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
      duration: 250, 
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
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
    if (title === 'Beber 3L de água') return { accent: "#38bdf8" };
    if (title === 'Ler 10 páginas') return { accent: "#fb923c" };
    if (title === 'Academia') return { accent: "#c084fc" };
    if (title === 'Meditar') return { accent: "#4ade80" };
    return { accent: "#22d3ee" };
  };

  const theme = getHabitStyle(habit.title);

  return (
    <div 
      ref={(node) => {
        setNodeRef(node);
        cardRef.current = node as HTMLDivElement;
      }}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group rounded-[16px] border border-white/[0.06] bg-[#1a1c23] p-5 mb-4 cursor-grab active:cursor-grabbing select-none transition-all duration-300 hover:bg-[#21232c] hover:border-white/[0.12]",
        isDragging && "scale-[1.02] shadow-2xl bg-[#252731] border-white/20",
        isCompleted && !isDragging && "opacity-40 grayscale-[0.3]"
      )}
    >
      <div className="flex items-start gap-4">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(habit.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "h-5 w-5 rounded-full border-[1.5px] flex items-center justify-center transition-all shrink-0 mt-0.5",
            isCompleted 
              ? "bg-white border-white" 
              : "border-white/20 bg-transparent hover:border-white/40"
          )}
        >
          {isCompleted && (
            <Check size={12} strokeWidth={4} className="text-[#111b21]" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-[15px] font-semibold text-white tracking-tight leading-snug transition-all",
            isCompleted && "line-through text-white/40"
          )}>
            {habit.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Clock size={11} className="text-white/30" />
            <span className="text-[11px] font-medium text-white/30 uppercase tracking-widest">
              {habit.time}
            </span>
          </div>
        </div>

        <div className="flex items-center shrink-0 ml-auto gap-3">
          {streakInfo.streak > 0 && (
            <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-full">
              <Flame size={12} className="text-orange-400 fill-orange-400" />
              <span className="text-[10px] font-bold text-white/80">{streakInfo.streak}d</span>
            </div>
          )}
          
          <button 
            onClick={handleEditClick}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 text-white/10 hover:text-white/40 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.04]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-medium text-white/20 uppercase tracking-[0.15em]">Persistência</span>
          <span className="text-[11px] font-bold text-white/60 tabular-nums">{completionsThisMonth} de {target}</span>
        </div>
        <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%`, backgroundColor: theme.accent, opacity: 0.8 }}
          />
        </div>
      </div>
    </div>
  );
};

// --- Edit Popup ---
const EditPopup = ({ habit, rect, onClose, onSave, onDelete }: any) => {
  const [form, setForm] = useState<Habit>(habit);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!rect) return null;

  return (
    <div 
      ref={popupRef}
      style={{ top: rect.bottom + window.scrollY + 12, left: rect.left + window.scrollX }}
      className="fixed z-[1000] min-w-[260px] bg-[#1a1c23] border border-white/[0.08] rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Hábito</Label>
          <Input 
            value={form.title} 
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="h-9 bg-white/[0.03] border-white/[0.06] text-sm focus-visible:ring-white/20" 
          />
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => { onDelete(habit.id); onClose(); }}
            className="flex-1 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 text-[11px] font-bold uppercase"
          >
            Excluir
          </Button>
          <Button 
            size="sm"
            onClick={() => { onSave(form); onClose(); }}
            className="flex-1 bg-white text-[#111b21] hover:bg-white/90 font-bold text-[11px] uppercase"
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
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
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
        if (percent <= 0.3) level = 1;
        else if (percent <= 0.7) level = 2;
        else level = 3;
      }

      return {
        date: day,
        isCurrentMonth: isSameMonth(day, currentDate),
        isToday: isSameDay(day, new Date()),
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

  const displayedHabitsData = useMemo(() => {
    const filtered = habits.filter(h => h.weekDays.includes(getDay(selectedDate)));
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const pending = filtered.filter(h => !h.completedDates.includes(dateStr));
    const completed = filtered.filter(h => h.completedDates.includes(dateStr));
    return { pending, completed, all: [...pending, ...completed] };
  }, [habits, selectedDate]);

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#e2e8f0] pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Tab Switcher Minimalista */}
      <div className="flex justify-center pt-8 pb-10">
        <div className="inline-flex bg-white/[0.03] border border-white/[0.06] p-1 rounded-full">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutGrid },
            { id: 'charts', label: 'Análise', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-full text-[12px] font-semibold transition-all duration-300",
                activeTab === tab.id 
                  ? "bg-white text-[#0f1115] shadow-lg" 
                  : "text-white/40 hover:text-white"
              )}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Premium */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total", value: habits.length, icon: Target, color: "#38bdf8" },
          { label: "Sequência", value: "12d", icon: Flame, color: "#fb923c" },
          { label: "Foco Hoje", value: `${displayedHabitsData.completed.length}/${displayedHabitsData.all.length}`, icon: CheckCircle2, color: "#4ade80" },
          { label: "Este Mês", value: `${monthProgress}%`, icon: BarChart3, color: "#c084fc" }
        ].map((s, i) => (
          <div
            key={i}
            className="bg-[#1a1c23] border border-white/[0.06] rounded-2xl p-5 group hover:border-white/10 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/[0.04]">
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">{s.label}</span>
            </div>
            <span className="text-3xl font-bold tracking-tight text-white/90">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lado Esquerdo: Calendário */}
        <div className="flex-1">
          <div className="bg-[#1a1c23] border border-white/[0.06] rounded-[24px] p-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))} 
                  className="p-2 text-white/20 hover:text-white transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-lg font-bold tracking-tight px-2">
                  {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <button 
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))} 
                  className="p-2 text-white/20 hover:text-white transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
                className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white"
              >
                Ir para hoje
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-y-6 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-white/10 uppercase tracking-widest">{d}</div>
              ))}
              {calendarDays.map((day, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    onClick={() => setSelectedDate(day.date)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 text-sm font-medium",
                      !day.isCurrentMonth && "text-white/5 opacity-0 pointer-events-none",
                      day.isCurrentMonth && "text-white/40 hover:bg-white/[0.03]",
                      day.level === 1 && "bg-[#4ade80]/10 text-[#4ade80]",
                      day.level === 2 && "bg-[#4ade80]/20 text-[#4ade80]",
                      day.level === 3 && "bg-[#4ade80] text-[#0f1115]",
                      day.isToday && !day.level && "border border-white/10 text-white",
                      day.isSelected && !day.level && "ring-2 ring-white/20"
                    )}
                  >
                    {format(day.date, 'd')}
                  </div>
                  {day.isSelected && (
                    <div className="w-1 h-1 rounded-full bg-white mt-1 shadow-glow-white" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Direito: Lista de Hábitos */}
        <div className="w-full lg:w-[420px]">
          <div className="bg-[#1a1c23] border border-white/[0.06] rounded-[24px] p-6 flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20">Fila de Hábitos</h3>
              <span className="text-[10px] font-bold bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded text-white/40">
                {displayedHabitsData.all.length} ATIVOS
              </span>
            </div>

            <div className="flex-1 space-y-4">
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
                    <div className="pt-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-[1px] flex-1 bg-white/[0.03]" />
                        <span className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em]">Finalizados</span>
                        <div className="h-[1px] flex-1 bg-white/[0.03]" />
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
                    </div>
                  )}
                </SortableContext>
              </DndContext>
              
              {displayedHabitsData.all.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-20">
                  <Clock size={32} strokeWidth={1} className="mb-4" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Agenda Livre</p>
                </div>
              )}
            </div>

            <Button 
              onClick={() => setIsModalOpen(true)}
              className="mt-8 w-full bg-white text-[#0f1115] hover:bg-white/90 font-bold text-[11px] uppercase tracking-[0.2em] h-12 rounded-2xl transition-all active:scale-[0.98]"
            >
              <Plus className="mr-2" size={16} strokeWidth={3} /> Adicionar Hábito
            </Button>
          </div>
        </div>
      </div>

      {editingHabit && (
        <EditPopup
          habit={editingHabit.habit}
          rect={editingHabit.rect}
          onClose={() => setEditingHabit(null)}
          onSave={(updated: any) => setHabits(prev => prev.map(h => h.id === updated.id ? updated : h))}
          onDelete={(id: string) => setHabits(prev => prev.filter(h => h.id !== id))}
        />
      )}
    </div>
  );
};

export default HabitsPage;