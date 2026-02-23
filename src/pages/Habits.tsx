"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Plus, Check, ChevronLeft, ChevronRight, 
  LayoutGrid, Clock, Flame, 
  BarChart3, CheckCircle2, Pencil, Trash2, 
  Play, Pause, CalendarDays, Target, HelpCircle
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
  priority: number; // 0: Máxima, 1: Alta, 2: Média, 3: Normal
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

  // Lógica do Termômetro baseada na propriedade priority do hábito
  const priorityTheme = useMemo(() => {
    if (isCompleted) {
      return {
        main: "#22d3ee",
        darkBorder: "rgba(34, 211, 238, 0.15)",
        bg: "rgba(34, 211, 238, 0.03)",
        tag: "CONCLUÍDO",
        tagColor: "#9ca3af"
      };
    }

    switch (habit.priority) {
      case 0:
        return {
          main: "#ef4444",
          darkBorder: "#991b1b",
          bg: "rgba(239, 68, 68, 0.08)",
          tag: "PRIORIDADE MÁXIMA",
          tagColor: "#ef4444"
        };
      case 1:
        return {
          main: "#f97316",
          darkBorder: "#9a3412",
          bg: "rgba(249, 115, 22, 0.08)",
          tag: "PRIORIDADE ALTA",
          tagColor: "#f97316"
        };
      case 2:
        return {
          main: "#eab308",
          darkBorder: "#854d0e",
          bg: "rgba(234, 179, 8, 0.08)",
          tag: "PRIORIDADE MÉDIA",
          tagColor: "#eab308"
        };
      default:
        return {
          main: "#4ade80",
          darkBorder: "#16a34a",
          bg: "rgba(74, 222, 128, 0.08)",
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
        boxShadow: 'none',
      }}
      {...attributes}
      {...listeners}
      className={cn(
        "group rounded-[16px] border-[2px] p-[14px] mb-[10px] cursor-grab active:cursor-grabbing select-none transition-all duration-200 ease-out",
        isDragging && "scale-[1.02] opacity-90",
        isCompleted && !isDragging && "opacity-[0.4] grayscale-[0.6]"
      )}
    >
      <div className="flex items-center gap-3.5">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(habit.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 z-10",
            isCompleted 
              ? "bg-[#22d3ee] border-[#22d3ee]" 
              : ""
          )}
          style={{
            borderColor: priorityTheme.main,
            backgroundColor: isCompleted ? priorityTheme.main : "rgba(0,0,0,0.4)"
          }}
        >
          {isCompleted && (
            <Check 
              size={13} 
              className="stroke-[4px] text-[#06090e]" 
            />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "text-[14px] font-[800] text-[#ffffff] truncate leading-tight transition-all duration-200",
              isCompleted && "line-through opacity-50"
            )}>
              {habit.title}
            </h3>
            <span 
              className="text-[8.5px] font-[900] px-1.5 py-0.5 rounded-full border shrink-0 uppercase tracking-wider"
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
            <Clock size={12} className="text-white/40" />
            <span className="text-[10.5px] font-[700] text-white/40">
              {habit.time}
            </span>
          </div>
        </div>

        <div className="flex items-center shrink-0 gap-2.5">
          {streakInfo.streak > 0 && (
            <div className="flex items-center gap-1.5 bg-black/50 border border-white/5 px-2.5 py-1 rounded-lg text-white">
              <Flame size={13} className="text-orange-400 fill-orange-400" />
              <span className="text-[11px] font-black">{streakInfo.streak}</span>
            </div>
          )}
          
          {!isCompleted && (
            <button 
              onClick={handleEditClick}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1 text-white/30 hover:text-white transition-colors z-10"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-2.5 border-t border-white/5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9.5px] font-[800] text-white/30 uppercase tracking-[0.15em]">Meta Mensal</span>
          <span className="text-[11px] font-[900] tabular-nums" style={{ color: priorityTheme.main }}>
            {completionsThisMonth}/{target}
          </span>
        </div>
        <div className="h-[4.5px] w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full transition-all duration-700 ease-out" 
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
      className="fixed z-[1000] min-w-[280px] bg-[#202f36] border-2 border-[#1e293b] rounded-[20px] p-[18px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-[800] uppercase tracking-[0.1em] text-white/40">Nome do Hábito</Label>
          <Input 
            value={form.title} 
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="h-10 bg-[#0a0f14] border-[#1e293b] text-[14px] font-[700] text-white focus-visible:ring-[#22d3ee] rounded-[12px]" 
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-[800] uppercase tracking-[0.1em] text-white/40">Horário Lembrete</Label>
          <Input 
            type="time"
            value={form.time} 
            onChange={(e) => setForm({...form, time: e.target.value})}
            className="h-10 bg-[#0a0f14] border-[#1e293b] text-[14px] font-[700] text-white focus-visible:ring-[#22d3ee] rounded-[12px]" 
          />
        </div>

        <div className="flex items-center justify-between bg-[#0a0f14] p-3 rounded-[12px] border border-[#1e293b]">
          <span className="text-[10px] font-[800] uppercase tracking-[0.1em] text-white/40 ml-1">
            Status: {form.active ? 'Ativo' : 'Pausado'}
          </span>
          <button 
            onClick={() => setForm({...form, active: !form.active})}
            className={cn(
              "p-1.5 rounded-[8px] transition-all",
              form.active ? "text-[#22d3ee] bg-[#22d3ee]/10" : "text-white/20 hover:text-white"
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
            className="flex-1 h-10 bg-transparent border-[#ff4b4b]/40 text-[#ff4b4b] hover:bg-[#ff4b4b] hover:text-white text-[10px] font-[800] uppercase tracking-wider rounded-[12px] transition-all"
          >
            <Trash2 size={14} className="mr-2" /> Excluir
          </Button>
          <Button 
            size="sm"
            onClick={() => { onSave(form); onClose(); }}
            className="flex-[2] h-10 bg-[#22d3ee] hover:bg-[#06b6d4] text-[#06090e] font-[900] text-[10px] uppercase tracking-wider rounded-[12px] shadow-[0_4px_0_0_#0891b2] active:translate-y-[2px] active:shadow-none transition-all"
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
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
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
        
        if (percentage >= 100) level = 4;       // VERDE (Tudo feito)
        else if (percentage >= 66) level = 3;   // AMARELO
        else if (percentage >= 33) level = 2;   // LARANJA
        else level = 1;                         // VERMELHO
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
    <div className="min-h-screen bg-background pb-10 animate-in fade-in duration-500 relative w-full">
      
      <div className="flex justify-center pt-4 pb-2">
        <div className="bg-[#202f36] border border-white/10 rounded-full p-1 pb-2 shadow-[0_4px_0_0_#020305] flex items-center gap-1.5 overflow-visible">
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
            <BarChart3 size={14} strokeWidth={3} /> Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-0 mt-8">
        {[
          { label: "TOTAL HÁBITOS", value: stats.total, icon: Target, from: "#22D3EE", to: "#06B6D4", shadow: "#0891B2" },
          { label: "SEQUÊNCIA", value: stats.streak, icon: Flame, from: "#FB923C", to: "#F97316", shadow: "#EA580C" },
          { label: "COMPLETOS HOJE", value: stats.today, icon: CheckCircle2, from: "#4ADE80", to: "#22C55E", shadow: "#16A34A" },
          { label: "MES", value: stats.progress, icon: CalendarDays, from: "#A855F7", to: "#6366F1", shadow: "#7C3AED" }
        ].map((s, i) => (
          <div
            key={i}
            className={cn(
              "py-6 px-7 rounded-[28px] flex items-center gap-5 transition-all duration-300",
              "text-white cursor-default hover:translate-y-[-2px] border-[1.5px] border-white/20"
            )}
            style={{
              background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
              boxShadow: `0 8px 0 0 ${s.shadow}`
            }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-black/30 ring-1 ring-white/10">
              <s.icon size={26} className="text-white fill-white/10" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-[900] text-white uppercase tracking-[0.12em] leading-tight mb-1 drop-shadow-sm">{s.label}</span>
              <span className="text-[31px] font-[950] text-white leading-none tracking-tight drop-shadow-sm">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'overview' ? (
        <div className="mt-[20px] flex flex-col lg:flex-row gap-6 p-4 md:p-0 items-start">
          <div className={cn("transition-all duration-500 shrink-0", viewMode === 'weekly' ? 'w-full' : 'lg:w-[60%]')}>
            <div className="bg-[#202f36] border border-white/10 rounded-[24px] py-[16px] px-[20px] shadow-[0_4px_0_0_#020305]">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-[#202f36] border border-white/10 rounded-full p-1 pb-2 shadow-[0_4px_0_0_#020305] flex items-center gap-1 overflow-visible">
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
                  <button 
                    onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
                    className="text-[11px] font-[800] text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/30 uppercase rounded-[999px] h-auto px-[14px] py-[6px] hover:bg-[#22d3ee] hover:text-[#06090e] transition-all"
                  >
                    Hoje
                  </button>
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
                              onContextMenu={(e) => {
                                e.preventDefault();
                                setSelectedDate(day.date);
                                setIsModalOpen(true);
                              }}
                              className={cn(
                                "min-h-[44px] aspect-square rounded-[10px] border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative",
                                !day.isCurrentMonth && "text-[#37464f] border-transparent bg-transparent opacity-30",
                                day.isCurrentMonth && (day.isFuture || ((day.isPast || day.isToday) && day.level === 0)) && "bg-[#16222b] border-[#1e293b] text-[#e5e7eb]",
                                day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 1 && "bg-[#ef4444]/30 border-[#ef4444]/50 text-white", 
                                day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 2 && "bg-[#f97316]/30 border-[#f97316]/50 text-white", 
                                day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 3 && "bg-[#eab308]/30 border-[#eab308]/50 text-white", 
                                day.isCurrentMonth && (day.isPast || day.isToday) && day.level === 4 && "bg-[#22c55e]/30 border-[#22c55e]/50 text-white", 
                                day.isToday && !day.isSelected && "border-white/40",
                                day.isSelected && "border-white z-10 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                              )}
                            >
                              <span className="text-[13px] font-[700]">{format(day.date, 'd')}</span>
                              {day.isToday && !day.isSelected && (
                                <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#202f36] border-[#1e293b] text-[#e5e7eb] rounded-[10px]">
                            <p className="text-xs font-bold">{format(day.date, 'dd/MM')}</p>
                            <p className="text-[10px] text-[#9ca3af] font-bold uppercase">{day.done} de {day.total} feitos ({day.total > 0 ? Math.round((day.done/day.total)*100) : 0}%)</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>

                  <div className="mt-6 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3 text-[10px] font-[700] text-[#9ca3af] uppercase tracking-widest">
                      <span>FRIO</span>
                      <div className="flex gap-1.5">
                        {[0, 1, 2, 3, 4].map(l => (
                          <TooltipProvider key={l}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={cn(
                                  "w-2.5 h-2.5 rounded-full border border-white/5",
                                  l === 0 ? "bg-[#16222b]" :
                                  l === 1 ? "bg-[#ef4444]/50" : 
                                  l === 2 ? "bg-[#f97316]/50" : 
                                  l === 3 ? "bg-[#eab308]/50" : 
                                  "bg-[#22c55e]/50" 
                                )} />
                              </TooltipTrigger>
                              <TooltipContent className="bg-[#202f36] border-[#1e293b] text-white">
                                {l === 0 ? "0%" : l === 4 ? "100%" : `${l * 25}%+` }
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                      <span>QUENTE</span>
                    </div>
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
              <div className="flex flex-col min-h-[480px] pt-4 px-2 overflow-visible h-full">
                <div className="flex items-center justify-between mb-6 px-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[#e5e7eb] font-[800] text-[13px] uppercase tracking-[0.1em]">HÁBITOS ATIVOS</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#06090e] transition-all active:scale-95 group">
                            <HelpCircle size={13} strokeWidth={4} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-[#202f36] border-2 border-[#1e293b] p-3 max-w-[240px] text-white rounded-[16px] shadow-2xl">
                          <div className="space-y-3">
                            <div className="flex flex-col gap-1.5 border-b border-white/5 pb-2">
                              <span className="text-[10px] font-black text-[#4ade80] uppercase tracking-widest">Escala de Prioridade</span>
                              <div className="flex items-center gap-3 text-[8px] font-black text-white/70 uppercase">
                                <span className="text-[#ef4444]">MÁXIMA</span>
                                <div className="flex gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#eab308]" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                                </div>
                                <span className="text-[#4ade80]">NORMAL</span>
                              </div>
                            </div>
                            <div className="space-y-2 text-[9.5px] font-medium leading-relaxed text-white/80">
                              <p>• <strong className="text-white">Arraste:</strong> A ordem define a prioridade.</p>
                              <p>• <strong className="text-white">Check:</strong> Clique no círculo à esquerda.</p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="bg-[#4ade80]/10 text-[#4ade80] text-[10px] font-[700] px-2.5 py-1 rounded-full border border-[#4ade80]/10 shrink-0">
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
                          <div className="mt-6 mb-3 pt-3 border-t-2 border-white/5">
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

                <div className="mt-auto pt-6 border-t-2 border-white/5">
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-[#22d3ee] hover:bg-[#22d3ee] active:translate-y-[1px] active:shadow-none transition-all duration-200 text-[#06090e] font-[800] text-[11px] uppercase tracking-[0.1em] h-11 rounded-[16px] shadow-[0_4px_0_0_#06b6d4]">
                        <Plus className="mr-2" size={16} strokeWidth={3} /> NOVO HÁBITO
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#202f36] border-2 border-[#1e293b] text-[#e5e7eb] rounded-[24px]">
                      <DialogHeader><DialogTitle className="uppercase tracking-widest text-sm text-[#22d3ee]">Criar Hábito</DialogTitle></DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label className="text-[11px] uppercase font-[700] tracking-[0.1em] text-[#9ca3af]">Título</Label>
                          <Input 
                            placeholder="Beber água..." 
                            className="bg-[#0a0f14] border-[#1e293b] text-[#e5e7eb]" 
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
                      <DialogFooter><Button className="bg-[#22d3ee] text-[#06090e] font-bold">CRIAR</Button></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8">
          <DashboardOverview />
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