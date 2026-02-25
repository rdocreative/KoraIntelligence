"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Plus, Check, ChevronLeft, ChevronRight, 
  LayoutGrid, Clock, Flame, 
  BarChart3, Pencil, Trash2, 
  Play, Pause, CalendarDays, HelpCircle,
  HeartPulse, GraduationCap, Briefcase, Coffee, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  isBefore,
  startOfDay,
  subDays,
  getDaysInMonth
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import WeeklyView from "@/components/habits/WeeklyView";
import DateSelectorModal from "@/components/habits/DateSelectorModal";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

// --- Types ---
type Frequency = 'daily' | 'weekly';

interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: Frequency;
  weekDays: number[];
  time: string;
  completedDates: string[];
  active: boolean;
  priority: number; 
  categoryId: string;
}

const PRIORITY_CONFIG = [
  { id: 0, label: "MÁXIMA", color: "#FF3B30" },
  { id: 1, label: "ALTA", color: "#FF9500" },
  { id: 2, label: "MÉDIA", color: "#FFD60A" },
  { id: 3, label: "NORMAL", color: "#34C759" },
];

const CATEGORY_CONFIG = [
  { id: 'health', label: 'Saúde', color: '#00D1FF', icon: HeartPulse },
  { id: 'study', label: 'Estudos', color: '#BF5AF2', icon: GraduationCap },
  { id: 'work', label: 'Trabalho', color: '#FF9F0A', icon: Briefcase },
  { id: 'leisure', label: 'Lazer', color: '#FFD60A', icon: Coffee },
  { id: 'other', label: 'Outros', color: '#ACACAC', icon: Sparkles },
];

// --- Habit Card UI Component ---
const HabitCardUI = ({ 
  habit, 
  isCompleted, 
  onEdit, 
  onToggle, 
  currentDate, 
  isPlaceholder = false,
  isOverlay = false 
}: { 
  habit: Habit, 
  isCompleted: boolean, 
  onEdit?: (habit: Habit, rect: DOMRect) => void, 
  onToggle?: (id: string) => void,
  currentDate: Date,
  isPlaceholder?: boolean,
  isOverlay?: boolean
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const category = useMemo(() => 
    CATEGORY_CONFIG.find(c => c.id === habit.categoryId) || CATEGORY_CONFIG[4],
  [habit.categoryId]);

  const priority = useMemo(() => 
    PRIORITY_CONFIG.find(p => p.id === habit.priority) || PRIORITY_CONFIG[3],
  [habit.priority]);

  const streakInfo = useMemo(() => {
    const today = startOfDay(new Date());
    let streak = 0;
    let isLost = false;
    
    let checkDate = subDays(today, 1);
    let lastScheduledDate: Date | null = null;
    
    for (let i = 0; i < 60; i++) {
      const dayOfWeek = getDay(checkDate);
      if (habit.weekDays.includes(dayOfWeek)) {
        lastScheduledDate = checkDate;
        break;
      }
      checkDate = subDays(checkDate, 1);
    }

    if (lastScheduledDate) {
      const lastDateStr = format(lastScheduledDate, 'yyyy-MM-dd');
      const wasLastCompleted = habit.completedDates.includes(lastDateStr);
      let historicalDailyStreak = 0;
      let prevDate = wasLastCompleted ? subDays(lastScheduledDate, 1) : lastScheduledDate;
      let foundGap = false;
      while (!foundGap) {
        const dOfWeek = getDay(prevDate);
        if (habit.weekDays.includes(dOfWeek)) {
          const dStr = format(prevDate, 'yyyy-MM-dd');
          if (habit.completedDates.includes(dStr)) {
            historicalDailyStreak++;
          } else {
            foundGap = true;
          }
        }
        prevDate = subDays(prevDate, 1);
        if (historicalDailyStreak > 365) break;
      }
      if (!wasLastCompleted) {
        if (historicalDailyStreak > 0) isLost = true;
        streak = 0;
      } else {
        streak = historicalDailyStreak + 1;
      }
    }

    const todayStr = format(today, 'yyyy-MM-dd');
    if (habit.completedDates.includes(todayStr)) {
      if (isLost) {
        streak = 1;
        isLost = false;
      } else if (streak === 0) {
        streak = 1;
      }
    }
    return { streak, isLost };
  }, [habit.completedDates, habit.weekDays]);

  const completionsThisMonth = useMemo(() => {
    const monthStr = format(currentDate, 'yyyy-MM');
    return habit.completedDates.filter(date => date.startsWith(monthStr)).length;
  }, [habit.completedDates, currentDate]);

  const target = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
  const progressPercent = Math.min(100, (completionsThisMonth / target) * 100);

  const cardTheme = useMemo(() => {
    if (isCompleted) {
      return {
        main: "var(--border-ui)",
        bg: "var(--input-bg)",
        text: "var(--muted-foreground)"
      };
    }
    return {
      main: category.color,
      bg: `${category.color}15`,
      text: "var(--foreground)"
    };
  }, [category.color, isCompleted]);

  if (isPlaceholder) {
    return (
      <div 
        className="rounded-[20px] border-2 border-dashed border-[var(--border-ui)] bg-[var(--input-bg)]/30 h-[140px] mb-[16px] animate-pulse"
      />
    );
  }

  return (
    <div 
      ref={cardRef}
      style={{
        backgroundColor: cardTheme.bg,
        borderColor: isCompleted ? "var(--border-ui)" : `${category.color}44`,
        boxShadow: isCompleted || isOverlay ? 'none' : `0 4px 0 0 ${category.color}22`,
      }}
      className={cn(
        "group rounded-[20px] border-2 p-[16px] mb-[16px] select-none transition-all duration-300",
        isOverlay ? "cursor-grabbing scale-[1.02] shadow-2xl opacity-90" : "cursor-grab active:cursor-grabbing",
        isCompleted && "opacity-50 grayscale-[0.5]"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Check-in Button Interativo */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle?.(habit.id); }}
          className={cn(
            "h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform active:scale-90 shrink-0 z-10",
            isCompleted 
              ? "bg-primary border-primary rotate-[360deg]" 
              : "bg-white/50 border-gray-300 hover:border-gray-400"
          )}
          style={{ borderColor: isCompleted ? "var(--primary)" : category.color }}
        >
          {isCompleted ? (
            <Check 
              size={16} 
              className="stroke-[4px] text-primary-foreground animate-in zoom-in duration-200" 
            />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 transition-all group-hover:bg-primary/50" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "text-[15px] font-[950] truncate leading-tight transition-all duration-300",
              isCompleted ? "line-through text-[var(--muted-foreground)] opacity-70" : "text-[var(--foreground)]"
            )}>
              {habit.title}
            </h3>
            <span 
              className="text-[8px] font-black px-2 py-0.5 rounded-md border shrink-0 uppercase tracking-wider"
              style={{ 
                borderColor: `${priority.color}44`,
                backgroundColor: `${priority.color}11`,
                color: priority.color
              }}
            >
              {priority.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <category.icon size={12} style={{ color: category.color }} />
              <span className="text-[10px] font-black uppercase tracking-tight" style={{ color: category.color }}>
                {category.label}
              </span>
            </div>
            <span className="text-[var(--muted-foreground)] opacity-30 font-bold">•</span>
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-[var(--muted-foreground)]" />
              <span className="text-[11px] font-black text-[var(--muted-foreground)]/90">
                {habit.time}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center shrink-0 gap-3">
          {streakInfo.streak > 0 && (
            <div className="flex items-center gap-1.5 bg-[var(--input-bg)]/50 border border-[var(--border-ui)] px-2.5 py-1.5 rounded-xl text-[var(--foreground)] shadow-sm">
              <Flame size={14} className="text-[#FF9600] fill-[#FF9600]" />
              <span className="text-[12px] font-black">{streakInfo.streak}</span>
            </div>
          )}
          {!isCompleted && onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(habit, cardRef.current!.getBoundingClientRect()); }}
              className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors z-10"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      </div>

      {/* Meta Mensal - Minimalista com Trilha Visível */}
      <div className="mt-5 pt-3 border-t border-[var(--border-ui)]/10">
        <div className="flex justify-between items-end mb-1.5 px-0.5">
          <span className="text-[9px] font-black text-[var(--muted-foreground)]/60 uppercase tracking-[0.2em]">Meta Mensal</span>
          <span className="text-[11px] font-black tabular-nums opacity-80" style={{ color: isCompleted ? "var(--muted-foreground)" : category.color }}>
            {completionsThisMonth}<span className="opacity-30 mx-0.5">/</span>{target}
          </span>
        </div>
        <div className="h-[4px] w-full bg-gray-200/50 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-1000 ease-out rounded-full" 
            style={{ 
              width: `${progressPercent}%`,
              backgroundColor: isCompleted ? "var(--muted-foreground)" : category.color,
              opacity: isCompleted ? 0.3 : 1
            }}
          />
        </div>
      </div>
    </div>
  );
};

// --- Sortable Item Component ---
interface SortableItemProps {
  habit: Habit;
  isCompleted: boolean;
  onEdit: (habit: Habit, rect: DOMRect) => void;
  onToggle: (id: string) => void;
  currentDate: Date;
}

const SortableHabitItem = ({ habit, isCompleted, onEdit, onToggle, currentDate }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: habit.id,
    disabled: isCompleted 
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <HabitCardUI 
        habit={habit}
        isCompleted={isCompleted}
        onEdit={onEdit}
        onToggle={onToggle}
        currentDate={currentDate}
        isPlaceholder={isDragging}
      />
    </div>
  );
};

// --- Floating Edit Popup ---
interface EditPopupProps {
  habit: Habit;
  rect: DOMRect | null;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const EditPopup = ({ habit, rect, onClose, onSave, onDelete }: EditPopupProps) => {
  const [form, setForm] = useState<Habit>(habit);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!rect) return null;

  const top = rect.bottom + window.scrollY + 8;
  const left = Math.max(16, Math.min(window.innerWidth - 300, rect.left + window.scrollX));

  return (
    <div 
      ref={popupRef}
      style={{ top, left }}
      className="fixed z-[1000] min-w-[280px] bg-[var(--card)] border-2 border-[var(--border-ui)] rounded-[24px] p-5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-[800] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">Nome do Hábito</Label>
          <Input 
            value={form.title} 
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="h-10 bg-[var(--input-bg)] border-2 border-[var(--border-ui)] text-[14px] font-[700] text-[var(--foreground)] focus-visible:ring-primary rounded-[12px]" 
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-[800] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">Categoria</Label>
          <div className="grid grid-cols-5 gap-1">
            {CATEGORY_CONFIG.map((cat) => (
              <TooltipProvider key={cat.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setForm({...form, categoryId: cat.id})}
                      className={cn(
                        "h-8 flex items-center justify-center rounded-lg transition-all border-2",
                        form.categoryId === cat.id ? "scale-105" : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                      )}
                      style={{ 
                        backgroundColor: `${cat.color}22`, 
                        borderColor: form.categoryId === cat.id ? cat.color : 'transparent',
                        color: cat.color
                      }}
                    >
                      <cat.icon size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{cat.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-[800] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">Prioridade</Label>
          <div className="flex gap-1">
            {PRIORITY_CONFIG.map((p) => (
              <button
                key={p.id}
                onClick={() => setForm({...form, priority: p.id})}
                className={cn(
                  "flex-1 h-7 rounded-md text-[8px] font-black transition-all border",
                  form.priority === p.id ? "opacity-100 scale-105" : "opacity-40"
                )}
                style={{
                  borderColor: p.color,
                  backgroundColor: form.priority === p.id ? `${p.color}22` : 'transparent',
                  color: p.color
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => { onDelete(habit.id); onClose(); }}
            className="flex-1 h-10 border-2 border-[#FF4B4B]/30 text-[#FF4B4B] hover:bg-[#FF4B4B] hover:text-white text-[10px] font-[800] uppercase tracking-wider rounded-[12px]"
          >
            <Trash2 size={14} />
          </Button>
          <Button 
            size="sm"
            onClick={() => { onSave(form); onClose(); }}
            className="flex-[2] h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-[900] text-[10px] uppercase tracking-wider rounded-[12px] shadow-[0_4px_0_0_var(--primary-dark)] active:translate-y-[2px] active:shadow-none"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

const HabitsPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts'>('overview');
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Beber 3L de água', emoji: '💧', frequency: 'daily', weekDays: [0,1,2,3,4,5,6], time: '08:00', completedDates: [], active: true, priority: 0, categoryId: 'health' },
    { id: '2', title: 'Ler 10 páginas', emoji: '📚', frequency: 'daily', weekDays: [0,1,2,3,4,5,6], time: '21:00', completedDates: [], active: true, priority: 1, categoryId: 'study' },
    { id: '3', title: 'Academia', emoji: '💪', frequency: 'weekly', weekDays: [1,3,5], time: '18:00', completedDates: [], active: true, priority: 2, categoryId: 'health' },
    { id: '4', title: 'Meditar', emoji: '🧘', frequency: 'daily', weekDays: [0,1,2,3,4,5,6], time: '07:30', completedDates: [], active: true, priority: 3, categoryId: 'other' },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<{habit: Habit, rect: DOMRect} | null>(null);
  
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitPriority, setNewHabitPriority] = useState(3);
  const [newHabitCategory, setNewHabitCategory] = useState('health');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setHabits((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveDragId(null);
  };

  const toggleHabit = (id: string, date: Date = selectedDate) => {
    const dStr = format(date, 'yyyy-MM-dd');
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const completed = h.completedDates.includes(dStr);
        return {
          ...h,
          completedDates: completed ? h.completedDates.filter(d => d !== dStr) : [...h.completedDates, dStr]
        };
      }
      return h;
    }));
  };

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(endOfMonth(currentDate));
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const dStr = format(day, 'yyyy-MM-dd');
      const habitsScheduledForDay = habits.filter(h => h.active && h.weekDays.includes(getDay(day)));
      const doneCount = habitsScheduledForDay.filter(h => h.completedDates.includes(dStr)).length;
      const totalCount = habitsScheduledForDay.length;
      
      let level = 0;
      if (totalCount > 0 && doneCount > 0) {
        const percentage = Math.round((doneCount / totalCount) * 100);
        if (percentage >= 100) level = 4;       
        else if (percentage >= 66) level = 3;   
        else if (percentage >= 33) level = 2;   
        else level = 1;                         
      }

      const isPast = isBefore(startOfDay(day), startOfDay(new Date()));
      const isToday = isSameDay(day, new Date());

      return {
        date: day,
        isCurrentMonth: isSameMonth(day, currentDate),
        isToday,
        isPast,
        isFuture: !isPast && !isToday,
        isSelected: isSameDay(day, selectedDate),
        done: doneCount,
        total: totalCount,
        level
      };
    });
  }, [currentDate, selectedDate, habits]);

  const monthProgressValue = useMemo(() => {
    const currentMonthDays = calendarDays.filter(day => day.isCurrentMonth);
    const totalPossible = currentMonthDays.reduce((acc, day) => acc + day.total, 0);
    const totalDone = currentMonthDays.reduce((acc, day) => acc + day.done, 0);
    return totalPossible === 0 ? 0 : Math.round((totalDone / totalPossible) * 100);
  }, [calendarDays]);

  const stats = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const scheduledToday = habits.filter(h => h.active && h.weekDays.includes(getDay(new Date())));
    const completedToday = scheduledToday.filter(h => h.completedDates.includes(todayStr)).length;
    return {
      total: habits.length,
      today: `${completedToday}/${scheduledToday.length}`,
      streak: `7d`,
      progress: `${monthProgressValue}%`
    };
  }, [habits, monthProgressValue]);

  const displayedHabitsData = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const filtered = habits.filter(h => h.weekDays.includes(getDay(selectedDate)));
    const pending = filtered.filter(h => !h.completedDates.includes(dateStr));
    const completed = filtered.filter(h => h.completedDates.includes(dateStr));
    return { pending, completed, all: [...pending, ...completed] };
  }, [habits, selectedDate]);

  const handleCreateHabit = () => {
    if (newHabitTitle) {
      setHabits(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        title: newHabitTitle,
        emoji: '✨',
        frequency: 'daily',
        weekDays: [0,1,2,3,4,5,6],
        time: format(new Date(), 'HH:mm'),
        completedDates: [],
        active: true,
        priority: newHabitPriority,
        categoryId: newHabitCategory
      }]);
      setNewHabitTitle("");
      setNewHabitPriority(3);
      setNewHabitCategory('health');
      setIsModalOpen(false);
    }
  };

  const activeDraggingHabit = useMemo(() => 
    habits.find(h => h.id === activeDragId), 
  [habits, activeDragId]);

  return (
    <div className="min-h-screen bg-background pb-10 animate-in fade-in duration-500 relative w-full overflow-hidden">
      
      <div className="flex justify-center pt-[35px] pb-0 shrink-0">
        <div className="bg-[var(--panel)] border-2 border-[var(--border-ui)] rounded-full p-1 shadow-[0_4px_0_0_var(--border-ui)] flex items-center gap-1.5 overflow-visible">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-[800] uppercase tracking-[0.05em] transition-all duration-300 border-none shrink-0",
              activeTab === 'overview'
                ? "bg-primary text-primary-foreground shadow-[0_4px_0_0_var(--primary-dark)]"
                : "bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            <LayoutGrid size={14} strokeWidth={3} /> Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-[800] uppercase tracking-[0.05em] transition-all duration-300 border-none shrink-0",
              activeTab === 'charts'
                ? "bg-primary text-primary-foreground shadow-[0_4px_0_0_var(--primary-dark)]"
                : "bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            <BarChart3 size={14} strokeWidth={3} /> Dashboard
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="mt-[35px] flex flex-col lg:flex-row gap-8 p-4 md:p-0 items-start w-full">
          <div className={cn("transition-all duration-500 shrink-0", viewMode === 'weekly' ? 'w-full' : 'lg:w-[60%]')}>
            <div className="bg-[var(--panel)] border-2 border-[var(--border-ui)] rounded-[24px] shadow-[0_4px_0_0_var(--border-ui)] p-6 py-[24px] flex flex-col">
              <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="bg-[var(--panel)] border-2 border-[var(--border-ui)] rounded-full p-1 shadow-[0_3px_0_0_var(--border-ui)] flex items-center gap-1">
                  {[
                    { id: 'monthly', icon: LayoutGrid, label: 'Mês' },
                    { id: 'weekly', icon: CalendarDays, label: 'Sem' }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id as any)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-[800] uppercase tracking-wider transition-all border-none shrink-0",
                        viewMode === mode.id 
                          ? "bg-primary text-primary-foreground shadow-[0_3px_0_0_var(--primary-dark)]" 
                          : "bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      )}
                    >
                      <mode.icon size={12} strokeWidth={3} /> {mode.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentDate(viewMode === 'weekly' ? subWeeks(currentDate, 1) : subMonths(currentDate, 1))} className="p-1 text-[var(--muted-foreground)] hover:text-primary">
                    <ChevronLeft size={22} />
                  </button>
                  <button onClick={() => setIsDateSelectorOpen(true)} className="flex items-center gap-2 text-[15px] font-[800] text-[var(--foreground)] uppercase tracking-[0.05em] px-3 py-1.5 rounded-xl hover:bg-[var(--border-ui)] transition-colors group">
                    {viewMode === 'weekly' ? `Semana de ${format(startOfWeek(currentDate), 'dd/MM')}` : format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    <Pencil size={12} className="opacity-0 group-hover:opacity-50 text-primary" />
                  </button>
                  <button onClick={() => setCurrentDate(viewMode === 'weekly' ? addWeeks(currentDate, 1) : addMonths(currentDate, 1))} className="p-1 text-[var(--muted-foreground)] hover:text-primary">
                    <ChevronRight size={22} />
                  </button>
                </div>

                <button onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }} className="text-[11px] font-[800] text-primary bg-primary/10 border-2 border-primary/20 uppercase rounded-full px-4 py-1.5 hover:bg-primary hover:text-primary-foreground transition-all shadow-[0_2px_0_0_var(--primary-dark)22]">
                  Hoje
                </button>
              </div>

              <div className="flex-1 overflow-visible">
                {viewMode === 'monthly' && (
                  <div className="flex flex-col">
                    <div className="grid grid-cols-7 mb-2 shrink-0">
                      {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                        <div key={d} className="text-center text-[12px] font-[800] text-primary uppercase tracking-[0.08em]">{d}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-3 flex-1 content-start p-1">
                      <TooltipProvider>
                        {calendarDays.map((day, i) => (
                          <Tooltip key={i}>
                            <TooltipTrigger asChild>
                              <div
                                onClick={() => setSelectedDate(day.date)}
                                className={cn(
                                  "aspect-square rounded-[16px] border-[3px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative",
                                  !day.isCurrentMonth && "text-[var(--border-ui)] border-transparent bg-transparent opacity-20",
                                  
                                  // Default/Empty state
                                  day.isCurrentMonth && (day.isFuture || ((day.isPast || day.isToday) && day.level === 0)) && "bg-[#383838] border-[var(--border-ui)] text-[var(--foreground)]",
                                  
                                  // Levels - changing bg to #383838
                                  day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 1 && "bg-[#383838] border-[#FF3B30] text-[#FF3B30]", 
                                  day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 2 && "bg-[#383838] border-[#FF9500] text-[#FF9500]", 
                                  day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 3 && "bg-[#383838] border-[#FFD60A] text-[#FFD60A]", 
                                  day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 4 && "bg-[#383838] border-[#34C759] text-[#34C759]", 
                                  
                                  // Today - changing bg to #383838
                                  day.isToday && !day.isSelected && "border-[#10B981] bg-[#383838] text-[#059669]",
                                  
                                  day.isSelected && "border-[var(--foreground)] z-10 scale-105 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                                )}
                              >
                                <span className={cn(
                                  "text-[14px] font-[900]",
                                  day.isCurrentMonth ? "opacity-100" : "opacity-40"
                                )}>
                                  {format(day.date, 'd')}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-[var(--card)] border-2 border-[var(--border-ui)] text-[var(--foreground)] rounded-[16px] shadow-xl p-3">
                              <p className="text-xs font-bold mb-1">{format(day.date, 'dd/MM')}</p>
                              <p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase">{day.done} de {day.total} feitos</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                    </div>
                  </div>
                )}

                {viewMode === 'weekly' && (
                  <div className="overflow-y-auto custom-scrollbar">
                    <WeeklyView currentDate={currentDate} habits={habits} onToggleHabit={toggleHabit} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {viewMode !== 'weekly' && (
            <div className="w-full lg:w-[40%]">
              <div className="flex flex-col max-h-[calc(100vh-180px)] bg-[var(--panel)] border-2 border-[var(--border-ui)] rounded-[24px] shadow-[0_4px_0_0_var(--border-ui)] overflow-hidden">
                <div className="flex items-center justify-between p-6 pb-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[var(--foreground)] font-[900] text-[15px] uppercase tracking-[0.05em]">HÁBITOS DE HOJE</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground transition-all active:scale-90">
                            <HelpCircle size={13} strokeWidth={4} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-[var(--card)] border-2 border-[var(--border-ui)] p-4 max-w-[260px] text-[var(--foreground)] rounded-[24px] shadow-2xl">
                          <div className="space-y-3">
                            <span className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest block">DICA DO SISTEMA</span>
                            <p className="text-[12px] font-medium leading-relaxed">Arraste os cards para priorizar. A ordem define a sua escala de esforço diário.</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="bg-primary/10 text-primary text-[11px] font-[800] px-3 py-1 rounded-full border-2 border-primary/10">
                    {displayedHabitsData.completed.length}/{displayedHabitsData.all.length}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-2">
                  <DndContext 
                    sensors={sensors} 
                    collisionDetection={closestCenter} 
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                  >
                    <SortableContext items={displayedHabitsData.all.map(h => h.id)} strategy={verticalListSortingStrategy}>
                      {displayedHabitsData.pending.map((habit) => (
                        <SortableHabitItem 
                          key={habit.id}
                          habit={habit}
                          isCompleted={false}
                          onEdit={(habit, rect) => setEditingHabit({ habit, rect })}
                          onToggle={(id) => toggleHabit(id)}
                          currentDate={currentDate}
                        />
                      ))}
                      
                      {displayedHabitsData.completed.length > 0 && (
                        <>
                          <div className="mt-4 mb-4 pt-4 border-t-2 border-[var(--border-ui)]">
                            <span className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.1em]">CONCLUÍDOS</span>
                          </div>
                          {displayedHabitsData.completed.map((habit) => (
                            <HabitCardUI 
                                key={habit.id}
                                habit={habit}
                                isCompleted={true}
                                onToggle={(id) => toggleHabit(id)}
                                currentDate={currentDate}
                            />
                          ))}
                        </>
                      )}
                    </SortableContext>
                    
                    <DragOverlay>
                      {activeDraggingHabit ? (
                        <div className="w-full">
                          <HabitCardUI 
                            habit={activeDraggingHabit} 
                            isCompleted={false} 
                            currentDate={currentDate} 
                            isOverlay={true}
                          />
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </div>

                <div className="p-6 pt-4 border-t-2 border-[var(--border-ui)] bg-[var(--panel)] shrink-0">
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-[900] text-[12px] uppercase tracking-[0.1em] h-12 rounded-[20px] shadow-[0_4px_0_0_var(--primary-dark)] transition-all active:translate-y-[2px] active:shadow-none">
                        <Plus className="mr-2" size={18} strokeWidth={4} /> NOVO HÁBITO
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[var(--card)] border-2 border-[var(--border-ui)] text-[var(--foreground)] rounded-[32px] p-8 max-w-md w-full">
                      <DialogHeader><DialogTitle className="uppercase tracking-[0.2em] text-[12px] text-[var(--muted-foreground)] font-black text-center mb-4">Criar Novo Hábito</DialogTitle></DialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-[11px] uppercase font-[900] tracking-[0.1em] text-[var(--muted-foreground)]">Nome do hábito</Label>
                          <Input 
                            value={newHabitTitle}
                            onChange={(e) => setNewHabitTitle(e.target.value)}
                            placeholder="Ex: Beber 2L de água..." 
                            className="bg-[var(--input-bg)] border-2 border-[var(--border-ui)] h-12 rounded-[16px] text-[var(--foreground)] font-bold" 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[11px] uppercase font-[900] tracking-[0.1em] text-[var(--muted-foreground)]">Categoria</Label>
                          <div className="grid grid-cols-5 gap-2">
                            {CATEGORY_CONFIG.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => setNewHabitCategory(cat.id)}
                                className={cn(
                                  "flex flex-col items-center justify-center p-3 rounded-xl transition-all border-2",
                                  newHabitCategory === cat.id ? "scale-105" : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                                )}
                                style={{ 
                                  backgroundColor: `${cat.color}22`, 
                                  borderColor: newHabitCategory === cat.id ? cat.color : 'transparent',
                                  color: cat.color
                                }}
                              >
                                <cat.icon size={20} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[11px] uppercase font-[900] tracking-[0.1em] text-[var(--muted-foreground)]">Prioridade</Label>
                          <div className="flex gap-2">
                            {PRIORITY_CONFIG.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => setNewHabitPriority(p.id)}
                                className={cn(
                                  "flex-1 h-10 rounded-xl text-[10px] font-black transition-all border-2",
                                  newHabitPriority === p.id ? "scale-105" : "opacity-40"
                                )}
                                style={{
                                  backgroundColor: `${p.color}22`,
                                  borderColor: newHabitPriority === p.id ? p.color : 'transparent',
                                  color: p.color
                                }}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <Button 
                          onClick={handleCreateHabit}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-[16px] font-black uppercase tracking-widest shadow-[0_4px_0_0_var(--primary-dark)] active:translate-y-[1px] active:shadow-none transition-all"
                        >
                          CRIAR AGORA
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-[35px] w-full px-4 md:px-0">
          <DashboardOverview stats={stats} />
        </div>
      )}

      {editingHabit && (
        <EditPopup
          habit={editingHabit.habit}
          rect={editingHabit.rect}
          onClose={() => setEditingHabit(null)}
          onSave={(updated) => setHabits(prev => prev.map(h => h.id === updated.id ? updated : h))}
          onDelete={(id) => setHabits(prev => prev.filter(h => h.id !== id))}
        />
      )}

      <DateSelectorModal
        isOpen={isDateSelectorOpen}
        onClose={() => setIsDateSelectorOpen(false)}
        currentDate={currentDate}
        onSelectDate={(date) => {
          setCurrentDate(date);
          setSelectedDate(date);
        }}
      />
    </div>
  );
};

export default HabitsPage;