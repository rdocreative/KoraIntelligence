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

// Cores Neon/Vibrantes para melhor contraste
const CATEGORY_CONFIG = [
  { id: 'health', label: 'Saúde', color: '#00F2FF', icon: HeartPulse }, // Cyan Neon
  { id: 'study', label: 'Estudos', color: '#BF7AFA', icon: GraduationCap }, // Violeta Elétrico
  { id: 'work', label: 'Trabalho', color: '#FF9F0A', icon: Briefcase }, // Laranja Vibrante
  { id: 'leisure', label: 'Lazer', color: '#FFD60A', icon: Coffee }, // Amarelo Sol
  { id: 'other', label: 'Outros', color: '#00FF95', icon: Sparkles }, // Menta Neon
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
        main: "#888888",
        bg: "rgba(255, 255, 255, 0.05)",
        text: "var(--muted-foreground)"
      };
    }
    return {
      main: category.color,
      bg: `${category.color}0D`, // ~8% de opacidade para efeito de névoa
      text: "var(--foreground)"
    };
  }, [category.color, isCompleted]);

  if (isPlaceholder) {
    return (
      <div 
        className="rounded-[24px] border-2 border-dashed border-[var(--border-ui)] bg-[var(--input-bg)]/30 h-[160px] mb-[16px] animate-pulse"
      />
    );
  }

  return (
    <div 
      ref={cardRef}
      style={{
        backgroundColor: cardTheme.bg,
        borderColor: isCompleted ? "rgba(255,255,255,0.05)" : `${category.color}22`,
        boxShadow: isCompleted || isOverlay ? 'none' : `0 8px 32px -12px ${category.color}11`,
      }}
      className={cn(
        "group relative rounded-[24px] border-2 p-[20px] mb-[16px] select-none transition-all duration-300 overflow-hidden",
        isOverlay ? "cursor-grabbing scale-[1.02] shadow-2xl z-[100]" : "cursor-grab active:cursor-grabbing",
        isCompleted && "opacity-50 grayscale-[0.8]"
      )}
    >
      {/* Filete Lateral (Glow Strip) */}
      {!isCompleted && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-[5px] rounded-r-full"
          style={{ 
            backgroundColor: category.color,
            boxShadow: `2px 0 10px ${category.color}66`
          }}
        />
      )}

      <div className="flex items-start gap-4">
        {/* Check-in Button Neon */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle?.(habit.id); }}
          className={cn(
            "mt-1 h-9 w-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform active:scale-90 shrink-0 z-10",
            isCompleted 
              ? "bg-primary border-primary shadow-lg shadow-primary/20" 
              : "bg-white/5 border-white/10 hover:border-white/30"
          )}
          style={{ 
            borderColor: isCompleted ? "var(--primary)" : `${category.color}66`,
            boxShadow: !isCompleted ? `0 0 15px ${category.color}22` : undefined
          }}
        >
          {isCompleted ? (
            <Check 
              size={18} 
              className="stroke-[4px] text-primary-foreground" 
            />
          ) : (
            <div 
              className="w-2 h-2 rounded-full transition-all group-hover:scale-150" 
              style={{ backgroundColor: category.color }}
            />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className={cn(
              "text-[16px] font-[950] truncate leading-tight transition-all duration-300",
              isCompleted ? "line-through text-white/30" : "text-white"
            )}>
              {habit.title}
            </h3>
            <span 
              className="text-[9px] font-black px-2 py-0.5 rounded-md border shrink-0 uppercase tracking-widest"
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
            <div className="flex items-center gap-2">
              <category.icon size={14} style={{ color: category.color }} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
              <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: category.color }}>
                {category.label}
              </span>
            </div>
            <span className="text-white/10 font-black">•</span>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-white/40" />
              <span className="text-[12px] font-black text-white/50">
                {habit.time}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center shrink-0 gap-3">
          {streakInfo.streak > 0 && (
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl text-white shadow-sm">
              <Flame size={16} className="text-[#FF9600] fill-[#FF9600] drop-shadow-[0_0_10px_rgba(255,150,0,0.4)]" />
              <span className="text-[14px] font-black">{streakInfo.streak}</span>
            </div>
          )}
          {!isCompleted && onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(habit, cardRef.current!.getBoundingClientRect()); }}
              className="p-1.5 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all z-10"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Meta Mensal - Re-adicionada com design Neon */}
      <div className="mt-6 pt-5 border-t border-white/5">
        <div className="flex justify-between items-end mb-3 px-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Meta Mensal</span>
            <span className="text-[14px] font-black text-white/80 tabular-nums">
              {completionsThisMonth}<span className="text-white/20 ml-1">concluídos</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[18px] font-[1000] tabular-nums leading-none" style={{ color: category.color }}>
              {Math.round(progressPercent)}%
            </span>
          </div>
        </div>
        <div className="h-[8px] w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
          <div 
            className="h-full transition-all duration-1000 ease-out rounded-full relative" 
            style={{ 
              width: `${progressPercent}%`,
              backgroundColor: category.color,
              boxShadow: `0 0 15px ${category.color}44`
            }}
          >
            {/* Brilho na ponta da barra */}
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white/40 to-transparent rounded-full" />
          </div>
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
      className="fixed z-[1000] min-w-[300px] bg-[#1a1a1a] border-2 border-white/10 rounded-[32px] p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-xl"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-[11px] font-[900] uppercase tracking-[0.2em] text-white/40">Nome do Hábito</Label>
          <Input 
            value={form.title} 
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="h-12 bg-white/5 border-2 border-white/5 text-[15px] font-[800] text-white focus-visible:ring-primary rounded-[16px] placeholder:text-white/20" 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[11px] font-[900] uppercase tracking-[0.2em] text-white/40">Categoria</Label>
          <div className="grid grid-cols-5 gap-2">
            {CATEGORY_CONFIG.map((cat) => (
              <TooltipProvider key={cat.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setForm({...form, categoryId: cat.id})}
                      className={cn(
                        "h-10 flex items-center justify-center rounded-2xl transition-all border-2",
                        form.categoryId === cat.id ? "scale-110 shadow-lg" : "opacity-30 grayscale hover:opacity-100 hover:grayscale-0"
                      )}
                      style={{ 
                        backgroundColor: `${cat.color}22`, 
                        borderColor: form.categoryId === cat.id ? cat.color : 'transparent',
                        color: cat.color,
                        boxShadow: form.categoryId === cat.id ? `0 0 15px ${cat.color}44` : 'none'
                      }}
                    >
                      <cat.icon size={18} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black border-white/10 text-white font-black uppercase text-[10px]">{cat.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[11px] font-[900] uppercase tracking-[0.2em] text-white/40">Prioridade</Label>
          <div className="flex gap-2">
            {PRIORITY_CONFIG.map((p) => (
              <button
                key={p.id}
                onClick={() => setForm({...form, priority: p.id})}
                className={cn(
                  "flex-1 h-9 rounded-xl text-[9px] font-black transition-all border-2",
                  form.priority === p.id ? "opacity-100 scale-105" : "opacity-20"
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

        <div className="flex items-center gap-3 pt-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => { onDelete(habit.id); onClose(); }}
            className="flex-1 h-12 border-2 border-[#FF4B4B]/30 text-[#FF4B4B] hover:bg-[#FF4B4B] hover:text-white text-[11px] font-black uppercase tracking-widest rounded-[18px]"
          >
            <Trash2 size={16} />
          </Button>
          <Button 
            size="sm"
            onClick={() => { onSave(form); onClose(); }}
            className="flex-[2] h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[11px] uppercase tracking-widest rounded-[18px] shadow-[0_4px_0_0_var(--primary-dark)] active:translate-y-[2px] active:shadow-none transition-all"
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
        <div className="bg-[#1a1a1a] border-2 border-white/5 rounded-full p-1 shadow-2xl flex items-center gap-1.5 overflow-visible">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-[900] uppercase tracking-widest transition-all duration-300 border-none shrink-0",
              activeTab === 'overview'
                ? "bg-primary text-primary-foreground shadow-[0_4px_15px_rgba(var(--primary-rgb),0.3)]"
                : "bg-transparent text-white/40 hover:text-white"
            )}
          >
            <LayoutGrid size={16} strokeWidth={3} /> Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-[900] uppercase tracking-widest transition-all duration-300 border-none shrink-0",
              activeTab === 'charts'
                ? "bg-primary text-primary-foreground shadow-[0_4px_15px_rgba(var(--primary-rgb),0.3)]"
                : "bg-transparent text-white/40 hover:text-white"
            )}
          >
            <BarChart3 size={16} strokeWidth={3} /> Dashboard
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="mt-[35px] flex flex-col lg:flex-row gap-8 p-4 md:p-0 items-start w-full max-w-[1400px] mx-auto">
          <div className={cn("transition-all duration-500 shrink-0", viewMode === 'weekly' ? 'w-full' : 'lg:w-[60%]')}>
            <div className="bg-[#1a1a1a] border-2 border-white/5 rounded-[32px] shadow-2xl p-8 flex flex-col backdrop-blur-md">
              <div className="flex items-center justify-between mb-10 shrink-0">
                <div className="bg-white/5 border border-white/5 rounded-full p-1 flex items-center gap-1">
                  {[
                    { id: 'monthly', icon: LayoutGrid, label: 'Mês' },
                    { id: 'weekly', icon: CalendarDays, label: 'Sem' }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id as any)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-black uppercase tracking-widest transition-all border-none shrink-0",
                        viewMode === mode.id 
                          ? "bg-primary text-primary-foreground shadow-lg" 
                          : "bg-transparent text-white/30 hover:text-white"
                      )}
                    >
                      <mode.icon size={14} strokeWidth={3} /> {mode.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={() => setCurrentDate(viewMode === 'weekly' ? subWeeks(currentDate, 1) : subMonths(currentDate, 1))} className="p-2 text-white/30 hover:text-primary transition-colors">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={() => setIsDateSelectorOpen(true)} className="flex items-center gap-3 text-[18px] font-[1000] text-white uppercase tracking-wider px-4 py-2 rounded-2xl hover:bg-white/5 transition-all group">
                    {viewMode === 'weekly' ? `Semana de ${format(startOfWeek(currentDate), 'dd/MM')}` : format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    <Pencil size={14} className="opacity-0 group-hover:opacity-40 text-primary" />
                  </button>
                  <button onClick={() => setCurrentDate(viewMode === 'weekly' ? addWeeks(currentDate, 1) : addMonths(currentDate, 1))} className="p-2 text-white/30 hover:text-primary transition-colors">
                    <ChevronRight size={24} />
                  </button>
                </div>

                <button onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }} className="text-[12px] font-black text-primary bg-primary/10 border-2 border-primary/20 uppercase rounded-xl px-5 py-2 hover:bg-primary hover:text-primary-foreground transition-all">
                  Hoje
                </button>
              </div>

              <div className="flex-1 overflow-visible">
                {viewMode === 'monthly' && (
                  <div className="flex flex-col">
                    <div className="grid grid-cols-7 mb-4 shrink-0">
                      {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                        <div key={d} className="text-center text-[12px] font-black text-white/20 uppercase tracking-[0.2em]">{d}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-4 flex-1 content-start p-1">
                      <TooltipProvider>
                        {calendarDays.map((day, i) => (
                          <Tooltip key={i}>
                            <TooltipTrigger asChild>
                              <div
                                onClick={() => setSelectedDate(day.date)}
                                className={cn(
                                  "aspect-square rounded-[20px] border-[3px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative",
                                  !day.isCurrentMonth && "text-white/5 border-transparent bg-transparent opacity-10",
                                  day.isCurrentMonth && (day.isFuture || ((day.isPast || day.isToday) && day.level === 0)) && "bg-white/5 border-white/5 text-white/40",
                                  day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 1 && "bg-[#FF3B3015] border-[#FF3B30] text-[#FF3B30] shadow-[0_0_15px_#FF3B3022]", 
                                  day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 2 && "bg-[#FF950015] border-[#FF9500] text-[#FF9500] shadow-[0_0_15px_#FF950022]", 
                                  day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 3 && "bg-[#FFD60A15] border-[#FFD60A] text-[#FFD60A] shadow-[0_0_15px_#FFD60A22]", 
                                  day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 4 && "bg-[#34C75915] border-[#34C759] text-[#34C759] shadow-[0_0_15px_#34C75922]", 
                                  day.isToday && !day.isSelected && "border-[#10B981] bg-[#10B981]/10 text-[#059669]",
                                  day.isSelected && "border-white z-10 scale-110 shadow-2xl"
                                )}
                              >
                                <span className={cn(
                                  "text-[16px] font-[1000]",
                                  day.isCurrentMonth ? "opacity-100" : "opacity-40"
                                )}>
                                  {format(day.date, 'd')}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-black border-2 border-white/10 text-white rounded-[20px] shadow-2xl p-4">
                              <p className="text-sm font-black mb-1">{format(day.date, 'dd/MM')}</p>
                              <p className="text-[11px] text-white/60 font-black uppercase tracking-wider">{day.done} de {day.total} feitos</p>
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
              <div className="flex flex-col max-h-[calc(100vh-180px)] bg-[#1a1a1a] border-2 border-white/5 rounded-[32px] shadow-2xl overflow-hidden backdrop-blur-md">
                <div className="flex items-center justify-between p-8 pb-4 shrink-0">
                  <div className="flex items-center gap-4">
                    <h2 className="text-white font-[1000] text-[18px] uppercase tracking-widest">HOJE</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground transition-all active:scale-90 shadow-lg shadow-primary/20">
                            <HelpCircle size={14} strokeWidth={4} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-black border-2 border-white/10 p-5 max-w-[280px] text-white rounded-[28px] shadow-2xl">
                          <div className="space-y-4">
                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em] block">SISTEMA KORA</span>
                            <p className="text-[13px] font-bold leading-relaxed text-white/80">Arraste para organizar sua prioridade de foco diário.</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="bg-primary/10 text-primary text-[12px] font-black px-4 py-1.5 rounded-xl border border-primary/20">
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
                          <div className="mt-6 mb-4 pt-6 border-t border-white/5">
                            <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">FINALIZADOS</span>
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

                <div className="p-8 pt-4 border-t border-white/5 bg-[#1a1a1a] shrink-0">
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-[1000] text-[14px] uppercase tracking-widest h-14 rounded-[24px] shadow-[0_6px_0_0_var(--primary-dark)] transition-all active:translate-y-[2px] active:shadow-none">
                        <Plus className="mr-3" size={20} strokeWidth={4} /> NOVO HÁBITO
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1a1a1a] border-2 border-white/5 text-white rounded-[32px] p-10 max-w-md w-full shadow-2xl backdrop-blur-xl">
                      <DialogHeader><DialogTitle className="uppercase tracking-[0.3em] text-[12px] text-white/30 font-black text-center mb-6">Configurar Hábito</DialogTitle></DialogHeader>
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <Label className="text-[12px] uppercase font-black tracking-widest text-white/40">Nome do hábito</Label>
                          <Input 
                            value={newHabitTitle}
                            onChange={(e) => setNewHabitTitle(e.target.value)}
                            placeholder="Ex: Treinar 1h na Smart Fit..." 
                            className="bg-white/5 border-2 border-white/5 h-14 rounded-[20px] text-white font-bold text-[16px] placeholder:text-white/20" 
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[12px] uppercase font-black tracking-widest text-white/40">Categoria de Foco</Label>
                          <div className="grid grid-cols-5 gap-3">
                            {CATEGORY_CONFIG.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => setNewHabitCategory(cat.id)}
                                className={cn(
                                  "flex flex-col items-center justify-center p-4 rounded-[20px] transition-all border-2",
                                  newHabitCategory === cat.id ? "scale-110 shadow-2xl" : "opacity-30 grayscale hover:opacity-100 hover:grayscale-0"
                                )}
                                style={{ 
                                  backgroundColor: `${cat.color}22`, 
                                  borderColor: newHabitCategory === cat.id ? cat.color : 'transparent',
                                  color: cat.color,
                                  boxShadow: newHabitCategory === cat.id ? `0 0 20px ${cat.color}44` : 'none'
                                }}
                              >
                                <cat.icon size={24} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[12px] uppercase font-black tracking-widest text-white/40">Escala de Prioridade</Label>
                          <div className="flex gap-3">
                            {PRIORITY_CONFIG.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => setNewHabitPriority(p.id)}
                                className={cn(
                                  "flex-1 h-12 rounded-[18px] text-[10px] font-black transition-all border-2",
                                  newHabitPriority === p.id ? "scale-105" : "opacity-20"
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
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 rounded-[24px] font-[1000] uppercase tracking-widest shadow-[0_6px_0_0_var(--primary-dark)] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                          CRIAR HÁBITO
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
        <div className="mt-[35px] w-full px-4 md:px-0 max-w-[1400px] mx-auto">
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