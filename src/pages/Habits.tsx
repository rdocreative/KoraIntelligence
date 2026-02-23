"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Plus, Check, ChevronLeft, ChevronRight, 
  LayoutGrid, Clock, Flame, 
  BarChart3, Pencil, Trash2, 
  Play, Pause, CalendarDays, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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

  const priorityTheme = useMemo(() => {
    if (isCompleted) {
      return {
        main: "#22d3ee",
        darkBorder: "rgba(34, 211, 238, 0.1)",
        bg: "rgba(34, 211, 238, 0.02)",
        tag: "CONCLUÍDO",
        tagColor: "#9ca3af"
      };
    }

    switch (habit.priority) {
      case 0:
        return {
          main: "#ef4444",
          darkBorder: "rgba(239, 68, 68, 0.2)",
          bg: "rgba(239, 68, 68, 0.05)",
          tag: "PRIORIDADE MÁXIMA",
          tagColor: "#ef4444"
        };
      case 1:
        return {
          main: "#f97316",
          darkBorder: "rgba(249, 115, 22, 0.2)",
          bg: "rgba(249, 115, 22, 0.05)",
          tag: "PRIORIDADE ALTA",
          tagColor: "#f97316"
        };
      case 2:
        return {
          main: "#eab308",
          darkBorder: "rgba(234, 179, 8, 0.2)",
          bg: "rgba(234, 179, 8, 0.05)",
          tag: "PRIORIDADE MÉDIA",
          tagColor: "#eab308"
        };
      default:
        return {
          main: "#4ade80",
          darkBorder: "rgba(74, 222, 128, 0.2)",
          bg: "rgba(74, 222, 128, 0.05)",
          tag: "PRIORIDADE NORMAL",
          tagColor: "#4ade80"
        };
    }
  }, [habit.priority, isCompleted]);

  return (
    <div 
      ref={(node) => {
        setNodeRef(node);
        cardRef.current = node as HTMLDivElement;
      }}
      style={{
        ...style,
        backgroundColor: priorityTheme.bg,
        borderColor: priorityTheme.darkBorder,
      }}
      {...attributes}
      {...listeners}
      className={cn(
        "group rounded-[24px] border-[1.5px] p-[16px] mb-[12px] cursor-grab active:cursor-grabbing select-none transition-all duration-300 ease-out",
        isDragging && "scale-[1.02] opacity-90 shadow-xl",
        isCompleted && !isDragging && "opacity-[0.5] grayscale-[0.5]"
      )}
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(habit.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0 z-10",
            isCompleted 
              ? "bg-[#22d3ee] border-[#22d3ee]" 
              : ""
          )}
          style={{
            borderColor: priorityTheme.main,
            backgroundColor: isCompleted ? priorityTheme.main : "transparent"
          }}
        >
          {isCompleted && (
            <Check 
              size={14} 
              className="stroke-[3.5px] text-[#06090e]" 
            />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "text-[15px] font-bold text-[#ffffff] truncate leading-tight transition-all duration-200",
              isCompleted && "line-through opacity-50"
            )}>
              {habit.title}
            </h3>
            <span 
              className="text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 uppercase tracking-wide"
              style={{ 
                color: priorityTheme.tagColor, 
                borderColor: `${priorityTheme.tagColor}30`,
                backgroundColor: `${priorityTheme.tagColor}10`
              }}
            >
              {priorityTheme.tag}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-white/30" />
            <span className="text-[11px] font-semibold text-white/30">
              {habit.time}
            </span>
          </div>
        </div>

        <div className="flex items-center shrink-0 gap-3">
          {streakInfo.streak > 0 && (
            <div className="flex items-center gap-1.5 bg-black/30 border border-white/5 px-3 py-1 rounded-full text-white">
              <Flame size={13} className="text-orange-400 fill-orange-400" />
              <span className="text-[11px] font-bold">{streakInfo.streak}</span>
            </div>
          )}
          
          {!isCompleted && (
            <button 
              onClick={handleEditClick}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1.5 text-white/20 hover:text-white transition-colors z-10"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Meta Mensal</span>
          <span className="text-[11px] font-bold tabular-nums" style={{ color: priorityTheme.main }}>
            {completionsThisMonth}/{target}
          </span>
        </div>
        <div className="h-[6px] w-full bg-black/20 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-700 ease-out rounded-full" 
            style={{ 
              width: `${progressPercent}%`,
              backgroundColor: priorityTheme.main
            }}
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
      className="fixed z-[1000] min-w-[300px] bg-[#1e2a30] border border-white/10 rounded-[28px] p-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Nome do Hábito</Label>
          <Input 
            value={form.title} 
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="h-11 bg-[#0a0f14]/50 border-white/5 text-[14px] font-semibold text-white focus-visible:ring-[#22d3ee] rounded-[16px]" 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Horário Lembrete</Label>
          <Input 
            type="time"
            value={form.time} 
            onChange={(e) => setForm({...form, time: e.target.value})}
            className="h-11 bg-[#0a0f14]/50 border-white/5 text-[14px] font-semibold text-white focus-visible:ring-[#22d3ee] rounded-[16px]" 
          />
        </div>

        <div className="flex items-center justify-between bg-black/20 p-4 rounded-[16px] border border-white/5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
            {form.active ? 'Ativo' : 'Pausado'}
          </span>
          <button 
            onClick={() => setForm({...form, active: !form.active})}
            className={cn(
              "p-2 rounded-full transition-all",
              form.active ? "text-[#22d3ee] bg-[#22d3ee]/10" : "text-white/20 hover:text-white"
            )}
          >
            {form.active ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
          </button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => { onDelete(habit.id); onClose(); }}
            className="flex-1 h-11 text-[#ff4b4b] hover:bg-[#ff4b4b]/10 hover:text-[#ff4b4b] text-[11px] font-bold uppercase tracking-wider rounded-[16px]"
          >
            <Trash2 size={16} className="mr-2" /> Excluir
          </Button>
          <Button 
            size="sm"
            onClick={() => { onSave(form); onClose(); }}
            className="flex-[1.5] h-11 bg-[#22d3ee] hover:bg-[#06b6d4] text-[#06090e] font-bold text-[11px] uppercase tracking-wider rounded-[16px] transition-all shadow-lg shadow-cyan-500/20"
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
    { id: '1', title: 'Beber 3L de água', emoji: '💧', frequency: 'daily', weekDays: [0,1,2,3,4,5,6], time: '08:00', completedDates: [], active: true, priority: 0 },
    { id: '2', title: 'Ler 10 páginas', emoji: '📚', frequency: 'daily', weekDays: [0,1,2,3,4,5,6], time: '21:00', completedDates: [], active: true, priority: 1 },
    { id: '3', title: 'Academia', emoji: '💪', frequency: 'weekly', weekDays: [1,3,5], time: '18:00', completedDates: [], active: true, priority: 2 },
    { id: '4', title: 'Meditar', emoji: '🧘', frequency: 'daily', weekDays: [0,1,2,3,4,5,6], time: '07:30', completedDates: [], active: true, priority: 3 },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<{habit: Habit, rect: DOMRect} | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setHabits((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        
        return reordered.map((item, idx) => {
          const relativePos = idx / Math.max(1, reordered.length - 1);
          let p = 3;
          if (relativePos <= 0.25) p = 0;
          else if (relativePos <= 0.5) p = 1;
          else if (relativePos <= 0.75) p = 2;
          return { ...item, priority: p };
        });
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

  return (
    <div className="min-h-screen bg-background pb-12 animate-in fade-in duration-700 relative w-full">
      
      {/* Tab Selector */}
      <div className="flex justify-center pt-[40px] pb-0">
        <div className="bg-[#1e2a30] border border-white/5 rounded-full p-1.5 shadow-xl flex items-center gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all duration-300 border-none shrink-0",
              activeTab === 'overview'
                ? "bg-[#22d3ee] text-[#06090e] shadow-lg shadow-cyan-500/20"
                : "bg-transparent text-[#9ca3af] hover:text-white"
            )}
          >
            <LayoutGrid size={15} strokeWidth={2.5} /> Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={cn(
              "flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all duration-300 border-none shrink-0",
              activeTab === 'charts'
                ? "bg-[#22d3ee] text-[#06090e] shadow-lg shadow-cyan-500/20"
                : "bg-transparent text-[#9ca3af] hover:text-white"
            )}
          >
            <BarChart3 size={15} strokeWidth={2.5} /> Dashboard
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="mt-[40px] flex flex-col lg:flex-row gap-8 p-4 md:p-0 items-start max-w-7xl mx-auto">
          <div className={cn("transition-all duration-500 shrink-0", viewMode === 'weekly' ? 'w-full' : 'lg:w-[62%]')}>
            <div className="bg-[#1e2a30] border border-white/5 rounded-[32px] py-6 px-6 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="bg-black/20 rounded-full p-1 flex items-center gap-1">
                  {[
                    { id: 'monthly', icon: LayoutGrid, label: 'Mês' },
                    { id: 'weekly', icon: CalendarDays, label: 'Sem' }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id as any)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all shrink-0 whitespace-nowrap",
                        viewMode === mode.id 
                          ? "bg-[#22d3ee] text-[#06090e]" 
                          : "bg-transparent text-[#9ca3af] hover:text-white"
                      )}
                    >
                      <mode.icon size={13} strokeWidth={2.5} /> {mode.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      if (viewMode === 'weekly') setCurrentDate(subWeeks(currentDate, 1));
                      else setCurrentDate(subMonths(currentDate, 1));
                    }} 
                    className="p-1.5 text-[#9ca3af] hover:text-[#22d3ee] transition-colors bg-white/5 rounded-full"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setIsDateSelectorOpen(true)}
                    className="flex items-center gap-2 text-[15px] font-bold text-[#e5e7eb] px-4 py-2 rounded-2xl hover:bg-white/5 transition-colors group"
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
                    className="p-1.5 text-[#9ca3af] hover:text-[#22d3ee] transition-colors bg-white/5 rounded-full"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="flex items-center">
                  <button 
                    onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
                    className="text-[11px] font-bold text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/20 uppercase rounded-full px-5 py-2 hover:bg-[#22d3ee] hover:text-[#06090e] transition-all"
                  >
                    Hoje
                  </button>
                </div>
              </div>

              {viewMode === 'monthly' && (
                <>
                  <div className="grid grid-cols-7 mb-4">
                    {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                      <div key={d} className="text-center text-[10px] font-bold text-[#22d3ee]/60 uppercase tracking-widest py-1">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-3">
                    <TooltipProvider>
                      {calendarDays.map((day, i) => (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <div
                              onClick={() => setSelectedDate(day.date)}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                setSelectedDate(day.date);
                                setIsModalOpen(true);
                              }}
                              className={cn(
                                "min-h-[48px] aspect-square rounded-[18px] border-[1.5px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative",
                                !day.isCurrentMonth && "text-white/10 border-transparent bg-transparent",
                                day.isCurrentMonth && (day.isFuture || ((day.isPast || day.isToday) && day.level === 0)) && "bg-white/5 border-white/5 text-[#e5e7eb]",
                                day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 1 && "bg-[#ef4444]/20 border-[#ef4444]/40 text-white", 
                                day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 2 && "bg-[#f97316]/20 border-[#f97316]/40 text-white", 
                                day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 3 && "bg-[#eab308]/20 border-[#eab308]/40 text-white", 
                                day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 4 && "bg-[#22c55e]/20 border-[#22c55e]/40 text-white", 
                                day.isToday && !day.isSelected && "border-white/30",
                                day.isSelected && "border-[#22d3ee] bg-[#22d3ee]/10 z-10 scale-110 shadow-xl shadow-cyan-500/10"
                              )}
                            >
                              <span className="text-[14px] font-bold">{format(day.date, 'd')}</span>
                              {day.isToday && !day.isSelected && (
                                <div className="absolute bottom-1.5 w-1.5 h-1.5 bg-[#22d3ee] rounded-full" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#1e2a30] border-white/10 text-white rounded-2xl p-3">
                            <p className="text-xs font-bold mb-1">{format(day.date, "dd 'de' MMMM", { locale: ptBR })}</p>
                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{day.done} de {day.total} hábitos concluídos</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
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
            <div className="w-full lg:w-[38%] relative">
              <div className="flex flex-col min-h-[500px] h-full">
                <div className="flex items-center justify-between mb-8 px-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-white font-bold text-[14px] uppercase tracking-widest opacity-80">Hábitos de Hoje</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/40 hover:text-white transition-all active:scale-95 group">
                            <HelpCircle size={14} strokeWidth={2.5} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-[#1e2a30] border border-white/10 p-4 max-w-[260px] text-white rounded-[24px] shadow-2xl">
                          <div className="space-y-4">
                            <div className="flex flex-col gap-2 border-b border-white/5 pb-3">
                              <span className="text-[10px] font-bold text-[#22d3ee] uppercase tracking-widest">Dicas Rápidas</span>
                              <div className="space-y-2 text-[11px] text-white/70 leading-relaxed">
                                <p>• <strong className="text-white">Organizar:</strong> Pressione e arraste para reordenar.</p>
                                <p>• <strong className="text-white">Concluir:</strong> Clique no círculo à esquerda do hábito.</p>
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="bg-[#4ade80]/10 text-[#4ade80] text-[11px] font-bold px-3 py-1 rounded-full border border-[#4ade80]/20 shrink-0">
                    {displayedHabitsData.completed.length}/{displayedHabitsData.all.length}
                  </div>
                </div>

                <div className="flex-1">
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
                          <div className="mt-8 mb-4 pt-4 border-t border-white/5">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                              Finalizados
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
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-30">
                      <Clock size={32} className="text-white mb-4" />
                      <p className="text-[11px] font-bold uppercase text-white tracking-widest">Nada planejado para hoje</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-8">
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-[#22d3ee] hover:bg-[#06b6d4] active:scale-[0.98] transition-all duration-300 text-[#06090e] font-bold text-[12px] uppercase tracking-widest h-14 rounded-[24px] shadow-xl shadow-cyan-500/20">
                        <Plus className="mr-2" size={18} strokeWidth={3} /> NOVO HÁBITO
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1e2a30] border-white/10 text-white rounded-[32px] p-8">
                      <DialogHeader>
                        <DialogTitle className="uppercase tracking-[0.2em] text-[12px] font-bold text-[#22d3ee] mb-4">Criar Novo Hábito</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="space-y-2">
                          <Label className="text-[11px] uppercase font-bold tracking-widest text-white/40 ml-1">Título do Hábito</Label>
                          <Input 
                            placeholder="Ex: Beber 3L de água" 
                            className="h-12 bg-black/20 border-white/5 text-white rounded-[18px] px-5" 
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const val = (e.target as HTMLInputElement).value;
                                if (val) {
                                  const newHabit: Habit = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    title: val,
                                    emoji: '✨',
                                    frequency: 'daily',
                                    weekDays: [0,1,2,3,4,5,6],
                                    time: format(new Date(), 'HH:mm'),
                                    completedDates: [],
                                    active: true,
                                    priority: 3
                                  };
                                  setHabits(prev => [...prev, newHabit]);
                                  setIsModalOpen(false);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className="w-full h-12 bg-[#22d3ee] text-[#06090e] font-bold rounded-[18px] shadow-lg shadow-cyan-500/10">ADICIONAR</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-[40px] max-w-7xl mx-auto px-4">
          <DashboardOverview stats={stats} />
        </div>
      )}

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