"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Plus, Check, ChevronLeft, ChevronRight, 
  LayoutGrid, Clock, Flame, 
  BarChart3, CheckCircle2, Pencil, Trash2, 
  Play, Pause, CalendarDays, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
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
  subDays
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import WeeklyView from "@/components/habits/WeeklyView";
import DateSelectorModal from "@/components/habits/DateSelectorModal";

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
}

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
    transition: {
      duration: 200, 
      easing: 'ease-in-out',
    },
    disabled: isCompleted 
  });

  const cardRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cardRef.current) {
      onEdit(habit, cardRef.current.getBoundingClientRect());
    }
  };

  // Cálculo de sequências (Streak)
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
      
      let historicalStreak = 0;
      let prevDate = wasLastCompleted ? subDays(lastScheduledDate, 1) : lastScheduledDate;
      let foundGap = false;
      while (!foundGap) {
        const dOfWeek = getDay(prevDate);
        if (habit.weekDays.includes(dOfWeek)) {
          const dStr = format(prevDate, 'yyyy-MM-dd');
          if (habit.completedDates.includes(dStr)) {
            historicalStreak++;
          } else {
            foundGap = true;
          }
        }
        prevDate = subDays(prevDate, 1);
        if (historicalStreak > 365) break;
      }

      if (!wasLastCompleted) {
        if (historicalStreak > 0) isLost = true;
        streak = 0;
      } else {
        streak = historicalStreak + 1;
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

  const target = 30;
  const progressPercent = Math.min(100, (completionsThisMonth / target) * 100);

  const getHabitStyle = (title: string) => {
    if (title === 'Beber 3L de água') {
      return {
        main: "#1CB0F6",
        dark: "#0E8FC7",
        bg: "rgba(28, 176, 246, 0.11)",
        border: "rgba(28, 176, 246, 0.22)",
        shadow: "#0E8FC7FC"
      };
    }
    if (title === 'Ler 10 páginas') {
      return {
        main: "#FF9600",
        dark: "#CC7700",
        bg: "rgba(255, 150, 0, 0.11)",
        border: "rgba(255, 150, 0, 0.22)",
        shadow: "#CC7700FC"
      };
    }
    if (title === 'Academia') {
      return {
        main: "#CE82FF",
        dark: "#6B35A0",
        bg: "rgba(206, 130, 255, 0.11)",
        border: "rgba(206, 130, 255, 0.22)",
        shadow: "#6B35A0FC"
      };
    }
    if (title === 'Meditar') {
      return {
        main: "#58CC02",
        dark: "#46A302",
        bg: "rgba(88, 204, 2, 0.11)",
        border: "rgba(88, 204, 2, 0.22)",
        shadow: "#46A302FC"
      };
    }
    
    return {
      main: "#22d3ee",
      dark: "#0E8FC7",
      bg: "rgba(34, 211, 238, 0.11)",
      border: "rgba(34, 211, 238, 0.22)",
      shadow: "#0E8FC7FC"
    };
  };

  const theme = getHabitStyle(habit.title);

  return (
    <div 
      ref={(node) => {
        setNodeRef(node);
        cardRef.current = node as HTMLDivElement;
      }}
      style={{
        ...style,
        backgroundColor: theme.bg,
        borderColor: theme.border,
        boxShadow: isCompleted ? 'none' : `0px 5px 0px ${theme.shadow}`,
        transform: isCompleted ? `${CSS.Translate.toString(transform)} translateY(5px)` : CSS.Translate.toString(transform),
      }}
      {...attributes}
      {...listeners}
      className={cn(
        "group rounded-[14px] border-[1px] p-[12px] px-[14px] mb-4 cursor-grab active:cursor-grabbing select-none transition-all duration-200 ease-out hover:scale-[1.01] active:translate-y-[5px] active:shadow-none habit-card",
        isDragging && "scale-[1.03] opacity-90",
        isCompleted && !isDragging && "opacity-[0.6] grayscale-[0.5]"
      )}
    >
      <div className="flex items-start gap-[12px]">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(habit.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 z-10 mt-1",
            isCompleted 
              ? "bg-white border-white" 
              : "border-white/30 bg-black/20 hover:border-white/50 hover:bg-black/30"
          )}
        >
          {isCompleted && (
            <Check 
              size={14} 
              className="stroke-[4px]" 
              style={{ color: theme.dark }} 
            />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-[14px] font-[800] text-[#ffffff] truncate leading-tight transition-all duration-200",
            isCompleted && "line-through opacity-70"
          )}>
            {habit.title}
          </h3>
          <div className="flex flex-col items-start mt-[2px]">
            <div className="flex items-center gap-1">
              <Clock size={11} className="text-white/60" />
              <span className="text-[11px] font-[500] text-white/60">
                {habit.time}
              </span>
            </div>
            
            {streakInfo.isLost && !isCompleted && (
              <div className="mt-1 text-[10px] font-[800] text-[#FF4444] flex items-center gap-1">
                💔 Sequência perdida
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center shrink-0 ml-auto gap-2">
          {streakInfo.streak > 0 && (
            <div className="flex items-center gap-1.5 bg-black/60 border border-white/5 px-[8px] py-[2px] rounded-[7px] text-white transition-all">
              <Flame size={12} className="text-orange-400 fill-orange-400" />
              <span className="text-[10px] font-bold">{streakInfo.streak}</span>
            </div>
          )}
          
          {!isCompleted && (
            <button 
              onClick={handleEditClick}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1 text-white/40 hover:text-white transition-colors z-10"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-[800] text-white/40 uppercase tracking-wider">Este mês</span>
          <span className="text-[10px] font-[900] text-white/60 tabular-nums">{completionsThisMonth}/{target}</span>
        </div>
        <div className="h-[3px] w-full bg-black/20 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-700 ease-out opacity-60" 
            style={{ width: `${progressPercent}%`, backgroundColor: theme.main }}
          />
        </div>
      </div>
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
  const left = rect.left + window.scrollX;

  return (
    <div 
      ref={popupRef}
      style={{ top, left }}
      className="fixed z-[1000] min-w-[280px] bg-[#111b21] border-2 border-[#202f36] rounded-[16px] p-[16px] px-[18px] shadow-[0_4px_0_0_#020305] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-[11px] font-[700] uppercase tracking-[0.1em] text-[#9ca3af]">Nome</Label>
          <Input 
            value={form.title} 
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="h-9 bg-[#0a0f14] border-[#202f36] text-[14px] font-[600] text-[#e5e7eb] focus-visible:ring-[#22d3ee]" 
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-[700] uppercase tracking-[0.1em] text-[#9ca3af]">Horário</Label>
          <Input 
            type="time"
            value={form.time} 
            onChange={(e) => setForm({...form, time: e.target.value})}
            className="h-9 bg-[#0a0f14] border-[#202f36] text-[14px] font-[600] text-[#e5e7eb] focus-visible:ring-[#22d3ee]" 
          />
        </div>

        <div className="flex items-center justify-between bg-[#0a0f14] p-2.5 rounded-[10px] border border-[#202f36]">
          <span className="text-[11px] font-[700] uppercase tracking-[0.1em] text-[#9ca3af] ml-1">
            {form.active ? 'Ativo' : 'Pausado'}
          </span>
          <button 
            onClick={() => setForm({...form, active: !form.active})}
            className={cn(
              "p-1.5 rounded-[8px] transition-colors",
              form.active ? "text-[#22d3ee] bg-[#22d3ee]/10" : "text-[#9ca3af]"
            )}
          >
            {form.active ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
          </button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => { onDelete(habit.id); onClose(); }}
            className="flex-1 h-9 bg-transparent border-[#ff4b4b] text-[#ff4b4b] hover:bg-[#ff4b4b] hover:text-white text-[11px] font-[700] uppercase tracking-wider rounded-[10px]"
          >
            <Trash2 size={14} className="mr-1.5" /> Excluir
          </Button>
          <Button 
            size="sm"
            onClick={() => { onSave(form); onClose(); }}
            className="flex-[2] h-9 bg-[#22d3ee] hover:bg-[#06b6d4] text-[#06090e] font-[800] text-[11px] uppercase tracking-wider rounded-[10px]"
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
    { id: '1', title: 'Beber 3L de água', emoji: '💧', frequency: 'daily', weekDays: [0,1,2,3,4,5,6], time: '08:00', completedDates: [], active: true },
    { id: '2', title: 'Ler 10 páginas', emoji: '📚', frequency: 'daily', weekDays: [0,1,2,3,4,5,6], time: '21:00', completedDates: [], active: true },
    { id: '3', title: 'Academia', emoji: '💪', frequency: 'weekly', weekDays: [1,3,5], time: '18:00', completedDates: [], active: true },
    { id: '4', title: 'Meditar', emoji: '🧘', frequency: 'daily', weekDays: [0,1,2,3,4,5,6], time: '07:30', completedDates: [], active: true },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<{habit: Habit, rect: DOMRect} | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setHabits((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
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
      const habitsForDay = habits.filter(h => h.active && h.weekDays.includes(getDay(day)));
      const done = habitsForDay.filter(h => h.completedDates.includes(dStr)).length;
      const total = habitsForDay.length;
      const percent = total === 0 ? 0 : done / total;
      
      let level = 0;
      if (percent > 0) {
        if (percent <= 0.25) level = 1;
        else if (percent <= 0.75) level = 2;
        else level = 3;
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
        done,
        total,
        level
      };
    });
  }, [currentDate, selectedDate, habits]);

  const monthProgress = useMemo(() => {
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
      rate: `${monthProgress}%`
    };
  }, [habits, monthProgress]);

  const displayedHabitsData = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const filtered = habits.filter(h => h.weekDays.includes(getDay(selectedDate)));
    
    const pending = filtered.filter(h => !h.completedDates.includes(dateStr));
    const completed = filtered.filter(h => h.completedDates.includes(dateStr));
    
    return { pending, completed, all: [...pending, ...completed] };
  }, [habits, selectedDate]);

  return (
    <div className="min-h-screen bg-background pb-10 animate-in fade-in duration-500 relative">
      
      <div className="flex justify-center pt-4 pb-2">
        <div className="bg-[#111b21] border-2 border-[#202f36] rounded-full p-1 pb-2 shadow-[0_4px_0_0_#020305] flex items-center gap-1.5 overflow-visible">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-[800] uppercase tracking-[0.05em] transition-all duration-300 border-none shrink-0",
              activeTab === 'overview'
                ? "bg-[#22d3ee] text-[#06090e] shadow-[0_4px_0_0_#06b6d4]"
                : "bg-transparent text-[#9ca3af] hover:text-white"
            )}
          >
            <LayoutGrid size={14} strokeWidth={3} /> Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-[800] uppercase tracking-[0.05em] transition-all duration-300 border-none shrink-0",
              activeTab === 'charts'
                ? "bg-[#22d3ee] text-[#06090e] shadow-[0_4px_0_0_#06b6d4]"
                : "bg-transparent text-[#9ca3af] hover:text-white"
            )}
          >
            <BarChart3 size={14} strokeWidth={3} /> Gráficos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 md:p-0 mt-4">
        {[
          { label: "TOTAL HÁBITOS", value: stats.total, icon: Target, bg: "#1A8FA8", shadow: "#0E8FC7" },
          { label: "SEQUÊNCIA", value: stats.streak, icon: Flame, bg: "#C47A2A", shadow: "#CC7700" },
          { label: "HOJE", value: stats.today, icon: CheckCircle2, bg: "#2A9E55", shadow: "#46A302" },
          { label: "MÊS", value: stats.rate, icon: BarChart3, bg: "#7A52B8", shadow: "#6B35A0" }
        ].map((s, i) => (
          <div
            key={i}
            className={cn(
              "py-[10px] px-[18px] rounded-[16px] flex items-center gap-3 transition-all duration-300 stat-card",
              "text-white border-none"
            )}
            style={{ 
              background: `linear-gradient(135deg, ${s.bg}, ${s.bg}EE)`, 
              boxShadow: `0 4px 0 0 ${s.shadow}`
            }}
          >
            <div className={cn("w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 bg-black/20")}>
              <s.icon size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-[700] text-white/80 uppercase tracking-[0.1em] leading-none mb-1">{s.label}</span>
              <span className="text-[24px] font-[800] text-white leading-[1.1]">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[20px] flex flex-col lg:flex-row gap-4 p-4 md:p-0">
        <div className={cn("transition-all duration-500", viewMode === 'weekly' ? 'w-full' : 'lg:w-[60%]')}>
          <div className="bg-[#111b21] border-2 border-[#202f36] rounded-[24px] py-[16px] px-[20px] shadow-[0_4px_0_0_#020305]">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-[#111b21] border-2 border-[#202f36] rounded-full p-1 pb-2 shadow-[0_4px_0_0_#020305] flex items-center gap-1 overflow-visible">
                {[
                  { id: 'monthly', icon: LayoutGrid, label: 'Mês' },
                  { id: 'weekly', icon: CalendarDays, label: 'Sem' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-[800] uppercase tracking-wider transition-all border-none shrink-0 whitespace-nowrap",
                      viewMode === mode.id 
                        ? "bg-[#22d3ee] text-[#06090e] shadow-[0_4px_0_0_#06b6d4]" 
                        : "bg-transparent text-[#9ca3af] hover:text-white"
                    )}
                  >
                    <mode.icon size={12} strokeWidth={3} /> {mode.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    if (viewMode === 'weekly') setCurrentDate(subWeeks(currentDate, 1));
                    else setCurrentDate(subMonths(currentDate, 1));
                  }} 
                  className="p-1 text-[#9ca3af] hover:text-[#22d3ee] transition-colors"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={() => setIsDateSelectorOpen(true)}
                  className="flex items-center gap-2 text-[14px] font-[800] text-[#e5e7eb] uppercase tracking-[0.05em] px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  {viewMode === 'weekly'
                    ? `Semana de ${format(startOfWeek(currentDate), 'dd/MM')}`
                    : format(currentDate, 'MMMM yyyy', { locale: ptBR })
                  }
                  <Pencil size={12} className="opacity-0 group-hover:opacity-50 transition-opacity text-[#22d3ee]" />
                </button>
                <button 
                  onClick={() => {
                    if (viewMode === 'weekly') setCurrentDate(addWeeks(currentDate, 1));
                    else setCurrentDate(addMonths(currentDate, 1));
                  }} 
                  className="p-1 text-[#9ca3af] hover:text-[#22d3ee] transition-colors"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
                  className="text-[11px] font-[800] text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/30 uppercase rounded-[999px] h-auto px-[14px] py-[6px] hover:bg-[#22d3ee] hover:text-[#06090e] transition-all"
                >
                  Hoje
                </Button>
              </div>
            </div>

            {viewMode === 'monthly' && (
              <>
                <div className="grid grid-cols-7 mb-3">
                  {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                    <div key={d} className="text-center text-[10px] font-[700] text-[#22d3ee] uppercase tracking-[0.08em] py-1 opacity-80">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  <TooltipProvider>
                    {calendarDays.map((day, i) => (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <div
                            onClick={() => setSelectedDate(day.date)}
                            className={cn(
                              "min-h-[44px] aspect-square rounded-[10px] border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
                              !day.isCurrentMonth && "text-[#37464f] border-transparent bg-transparent opacity-30",
                              day.isCurrentMonth && (day.isFuture || (day.isPast && day.level === 0)) && "bg-[#16222b] border-[#202f36] text-[#e5e7eb]",
                              day.isCurrentMonth && day.isPast && day.level === 1 && "bg-[#0e3b4d] border-[#1a5e7a] text-white",
                              day.isCurrentMonth && day.isPast && day.level === 2 && "bg-[#00779e] border-[#0096c7] text-white",
                              day.isCurrentMonth && day.isPast && day.level === 3 && "bg-[#00CFFF] border-[#00CFFF] text-[#06090e]",
                              day.isCurrentMonth && day.isToday && "border-[#00CFFF] bg-transparent text-[#00CFFF]",
                              day.isSelected && "ring-2 ring-white/50 ring-offset-2 ring-offset-background"
                            )}
                          >
                            <span className="text-[13px] font-[700]">{format(day.date, 'd')}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#111b21] border-[#202f36] text-[#e5e7eb] rounded-[10px]">
                          <p className="text-xs font-bold">{format(day.date, 'dd/MM')}</p>
                          <p className="text-[10px] text-[#9ca3af] font-bold uppercase">{day.done} de {day.total} feitos</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>

                <div className="mt-6 flex items-center justify-center gap-3 text-[10px] font-[700] text-[#9ca3af] uppercase tracking-widest">
                  <span>MENOS</span>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map(l => (
                      <TooltipProvider key={l}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={cn(
                              "w-2.5 h-2.5 rounded-full border border-[#202f36]",
                              l === 0 ? "bg-[#16222b]" :
                              l === 1 ? "bg-[#0e3b4d]" :
                              l === 2 ? "bg-[#00779e]" : "bg-[#00CFFF]"
                            )} />
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#111b21] border-[#202f36] text-white">
                            {l === 0 ? "0 hábitos" : l === 3 ? "76-100% completado" : l === 1 ? "1-25% completado" : "26-75% completado"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                  <span>MAIS</span>
                </div>

                <div className="mt-6 space-y-3 px-2">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-[800] text-[#9ca3af] uppercase tracking-[0.15em] mb-0.5">Progresso Mensal</span>
                      <span className="text-[11px] font-[600] text-[#22d3ee]/70 uppercase tracking-tight">Consistência de {format(currentDate, 'MMMM', { locale: ptBR })}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-[20px] font-[900] text-[#22d3ee] tabular-nums leading-none">{monthProgress}</span>
                        <span className="text-[12px] font-[800] text-[#22d3ee]">%</span>
                      </div>
                    </div>
                    <Progress
                      value={monthProgress}
                      className="h-4 bg-[#0a0f14] border border-[#202f36] p-[3px]"
                      indicatorClassName="rounded-full bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                    />
                </div>
              </>
            )}

            {viewMode === 'weekly' && (
              <WeeklyView 
                currentDate={currentDate} 
                habits={habits} 
                onToggleHabit={toggleHabit} 
              />
            )}
          </div>
        </div>

        {viewMode !== 'weekly' && (
          <div className="w-full lg:w-[40%] relative">
            <div className="bg-[#111b21] border-2 border-[#202f36] rounded-[24px] flex flex-col min-h-[480px] shadow-[0_4px_0_0_#020305] p-5 overflow-visible h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#e5e7eb] font-[800] text-[13px] uppercase tracking-[0.05em]">HÁBITOS ATIVOS</h2>
                <div className="bg-[#22d3ee]/10 text-[#22d3ee] text-[10px] font-[700] px-[10px] py-[3px] rounded-[999px] border border-[#22d3ee]/20">
                  {displayedHabitsData.completed.length}/{displayedHabitsData.all.length}
                </div>
              </div>

              <div className="flex-1 overflow-visible">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                        <div className="mt-6 mb-3 pt-3 border-t-2 border-[#202f36]">
                          <span className="text-[10px] font-[800] text-[#9ca3af] uppercase tracking-[0.08em]">
                            CONCLUÍDOS HOJE
                          </span>
                        </div>
                        {displayedHabitsData.completed.map((habit) => (
                          <SortableHabitItem 
                            key={habit.id}
                            habit={habit}
                            isCompleted={true}
                            onEdit={(habit, rect) => setEditingHabit({ habit, rect })}
                            onToggle={(id) => toggleHabit(id)}
                            currentDate={currentDate}
                          />
                        ))}
                      </>
                    )}
                  </SortableContext>
                </DndContext>
                
                {displayedHabitsData.all.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center p-10 text-center opacity-40">
                    <Clock size={28} className="text-[#9ca3af] mb-3" />
                    <p className="text-[10px] font-[700] uppercase text-[#9ca3af] tracking-[0.1em]">Nada planejado</p>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 border-t-2 border-[#202f36]">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#22d3ee] hover:bg-[#22d3ee] active:translate-y-[1px] active:shadow-none transition-all duration-200 text-[#06090e] font-[800] text-[11px] uppercase tracking-[0.1em] h-11 rounded-[16px] shadow-[0_4px_0_0_#06b6d4]">
                      <Plus className="mr-2" size={16} strokeWidth={3} /> NOVO HÁBITO
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#111b21] border-2 border-[#202f36] text-[#e5e7eb] rounded-[24px]">
                    <DialogHeader><DialogTitle className="uppercase tracking-widest text-sm text-[#22d3ee]">Criar Hábito</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label className="text-[11px] uppercase font-[700] tracking-[0.1em] text-[#9ca3af]">Título</Label>
                        <Input placeholder="Beber água..." className="bg-[#0a0f14] border-[#202f36] text-[#e5e7eb]" />
                      </div>
                    </div>
                    <DialogFooter><Button className="bg-[#22d3ee] text-[#06090e] font-bold">CRIAR</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )}
      </div>

      {editingHabit && editingHabit.rect && (
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