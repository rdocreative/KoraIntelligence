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

  const streakInfo = useMemo(() => {
    const today = startOfDay(new Date());
    let streak = 0;
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
          if (habit.completedDates.includes(dStr)) historicalStreak++;
          else foundGap = true;
        }
        prevDate = subDays(prevDate, 1);
        if (historicalStreak > 365) break;
      }
      streak = wasLastCompleted ? historicalStreak + 1 : 0;
    }
    const todayStr = format(today, 'yyyy-MM-dd');
    if (habit.completedDates.includes(todayStr) && streak === 0) streak = 1;

    return { streak };
  }, [habit.completedDates, habit.weekDays]);

  const completionsThisMonth = useMemo(() => {
    const monthStr = format(currentDate, 'yyyy-MM');
    return habit.completedDates.filter(date => date.startsWith(monthStr)).length;
  }, [habit.completedDates, currentDate]);

  const target = 30;
  const progressPercent = Math.min(100, (completionsThisMonth / target) * 100);

  const getHabitStyle = (title: string) => {
    if (title === 'Beber 3L de água') return { main: "#00B7FF", dark: "#0088CC", bg: "rgba(0, 183, 255, 0.11)", border: "rgba(0, 183, 255, 0.22)", shadow: "#0088CCFC" };
    if (title === 'Ler 10 páginas') return { main: "#FF9900", dark: "#D47F00", bg: "rgba(255, 153, 0, 0.11)", border: "rgba(255, 153, 0, 0.22)", shadow: "#D47F00FC" };
    if (title === 'Academia') return { main: "#D35CFF", dark: "#8A2BE2", bg: "rgba(211, 92, 255, 0.11)", border: "rgba(211, 92, 255, 0.22)", shadow: "#8A2BE2FC" };
    if (title === 'Meditar') return { main: "#61FF00", dark: "#49C200", bg: "rgba(97, 255, 0, 0.11)", border: "rgba(97, 255, 0, 0.22)", shadow: "#49C200FC" };
    return { main: "#00E5FF", dark: "#00B8CC", bg: "rgba(0, 229, 255, 0.11)", border: "rgba(0, 229, 255, 0.22)", shadow: "#00B8CCFC" };
  };

  const theme = getHabitStyle(habit.title);

  return (
    <div 
      ref={(node) => { setNodeRef(node); cardRef.current = node as HTMLDivElement; }}
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
        "group relative rounded-[14px] border-[1px] mb-4 cursor-grab active:cursor-grabbing select-none transition-all duration-200 ease-out overflow-hidden habit-card",
        isDragging && "scale-[1.02] opacity-90",
        isCompleted && !isDragging && "opacity-[0.6] grayscale-[0.5]"
      )}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[5px]" style={{ backgroundColor: theme.main }} />

      <div className="p-[14px] pl-[20px]">
        <div className="flex items-start gap-[12px]">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggle(habit.id); }}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
              "h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0 z-10 mt-0.5",
              isCompleted ? "bg-white border-white" : "border-white/30 bg-black/20 hover:border-white/50 hover:bg-black/30"
            )}
          >
            {isCompleted && <Check size={16} className="stroke-[4px]" style={{ color: theme.dark }} />}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={cn("text-[15px] font-[800] text-[#ffffff] truncate leading-tight transition-all duration-200", isCompleted && "line-through opacity-70")}>
              {habit.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock size={12} className="text-white/40" />
              <span className="text-[12px] font-[600] text-white/40">{habit.time}</span>
            </div>
          </div>

          <div className="flex items-center shrink-0 ml-auto gap-2">
            {streakInfo.streak > 0 && (
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-[8px] py-[3px] rounded-[7px] text-white">
                <Flame size={12} className="text-orange-400 fill-orange-400" />
                <span className="text-[10px] font-bold">{streakInfo.streak}</span>
              </div>
            )}
            <button onClick={handleEditClick} onPointerDown={(e) => e.stopPropagation()} className="p-1 text-white/30 hover:text-white transition-colors z-10">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-[800] text-white/30 uppercase tracking-[0.1em]">Este mês</span>
            <span className="text-[10px] font-[900] text-white/40 tabular-nums">{completionsThisMonth}/{target}</span>
          </div>
          <div className="h-[4px] w-full bg-black/20 rounded-full overflow-hidden">
            <div className="h-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%`, backgroundColor: theme.main }} />
          </div>
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
        return { ...h, completedDates: completed ? h.completedDates.filter(d => d !== dStr) : [...h.completedDates, dStr] };
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
      if (percent > 0) { if (percent <= 0.25) level = 1; else if (percent <= 0.75) level = 2; else level = 3; }
      return { date: day, isCurrentMonth: isSameMonth(day, currentDate), isToday: isSameDay(day, new Date()), isPast: isBefore(startOfDay(day), startOfDay(new Date())), isSelected: isSameDay(day, selectedDate), done, total, level };
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
    return { total: habits.length, today: `${completedToday}/${scheduledToday.length}`, streak: `7d`, rate: `${monthProgress}%` };
  }, [habits, monthProgress]);

  const displayedHabitsData = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const filtered = habits.filter(h => h.weekDays.includes(getDay(selectedDate)));
    const pending = filtered.filter(h => !h.completedDates.includes(dateStr));
    const completed = filtered.filter(h => h.completedDates.includes(dateStr));
    return { pending, completed, all: [...pending, ...completed] };
  }, [habits, selectedDate]);

  return (
    <div className="min-h-screen bg-[#0b1116] pb-10 px-4 md:px-8 animate-in fade-in duration-500">
      
      {/* Tab Selector */}
      <div className="flex justify-center pt-8 pb-8">
        <div className="bg-[#202f36] border-2 border-[#374151] rounded-full p-1 pb-2 shadow-[0_4px_0_0_#0b1116] flex items-center gap-1.5">
          <button onClick={() => setActiveTab('overview')} className={cn("flex items-center gap-2 px-6 py-2.5 rounded-full text-[12px] font-[800] uppercase tracking-[0.05em] transition-all", activeTab === 'overview' ? "bg-[#22d3ee] text-[#111b21] shadow-[0_4px_0_0_#06b6d4]" : "text-[#9ca3af] hover:text-white")}>
            <LayoutGrid size={14} strokeWidth={3} /> VISÃO GERAL
          </button>
          <button onClick={() => setActiveTab('charts')} className={cn("flex items-center gap-2 px-6 py-2.5 rounded-full text-[12px] font-[800] uppercase tracking-[0.05em] transition-all", activeTab === 'charts' ? "bg-[#22d3ee] text-[#111b21] shadow-[0_4px_0_0_#06b6d4]" : "text-[#9ca3af] hover:text-white")}>
            <BarChart3 size={14} strokeWidth={3} /> GRÁFICOS
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "TOTAL HÁBITOS", value: stats.total, icon: Target, bg: "#0099B5", shadow: "#00788E" },
            { label: "SEQUÊNCIA", value: stats.streak, icon: Flame, bg: "#FF9900", shadow: "#CC7A00" },
            { label: "HOJE", value: stats.today, icon: CheckCircle2, bg: "#58CC02", shadow: "#46A302" },
            { label: "MÊS", value: stats.rate, icon: BarChart3, bg: "#CE82FF", shadow: "#A568CC" }
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-[16px] flex items-center gap-4 text-white" style={{ background: s.bg, boxShadow: `0 4px 0 0 ${s.shadow}` }}>
              <div className="w-12 h-12 rounded-[12px] flex items-center justify-center bg-black/20">
                <s.icon size={22} strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-[10px] font-[700] opacity-80 uppercase tracking-widest">{s.label}</span>
                <p className="text-2xl font-[900] leading-none">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar Side */}
          <div className="lg:w-[60%] space-y-6">
            <div className="bg-[#1a282f] border-2 border-[#374151] rounded-[24px] p-6 shadow-[0_4px_0_0_#0b1116]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex bg-[#202f36] border-2 border-[#374151] rounded-full p-1 pb-2 shadow-[0_3px_0_0_#0b1116]">
                  <button onClick={() => setViewMode('monthly')} className={cn("px-4 py-1.5 rounded-full text-[11px] font-[800] uppercase", viewMode === 'monthly' ? "bg-[#22d3ee] text-[#111b21] shadow-[0_3px_0_0_#06b6d4]" : "text-[#9ca3af]")}>MÊS</button>
                  <button onClick={() => setViewMode('weekly')} className={cn("px-4 py-1.5 rounded-full text-[11px] font-[800] uppercase", viewMode === 'weekly' ? "bg-[#22d3ee] text-[#111b21] shadow-[0_3px_0_0_#06b6d4]" : "text-[#9ca3af]")}>SEM</button>
                </div>
                
                <div className="flex items-center gap-4">
                  <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="text-[#9ca3af] hover:text-white"><ChevronLeft /></button>
                  <span className="text-sm font-[900] text-white uppercase tracking-widest">{format(currentDate, 'MMMM yyyy', { locale: ptBR })}</span>
                  <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="text-[#9ca3af] hover:text-white"><ChevronRight /></button>
                </div>

                <Button variant="ghost" onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }} className="bg-[#22d3ee]/10 text-[#22d3ee] border-2 border-[#22d3ee]/20 text-[11px] font-[800] rounded-full h-8 px-4 shadow-[0_2px_0_0_#06b6d433]">HOJE</Button>
              </div>

              <div className="grid grid-cols-7 gap-3">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                  <div key={d} className="text-center text-[10px] font-[900] text-[#9ca3af] py-2">{d}</div>
                ))}
                {calendarDays.map((day, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedDate(day.date)}
                    className={cn(
                      "aspect-square rounded-[12px] border-2 flex items-center justify-center cursor-pointer transition-all",
                      !day.isCurrentMonth && "opacity-10",
                      day.isCurrentMonth && !day.level && "bg-[#2a3f4a] border-[#374151] text-white",
                      day.level === 1 && "bg-[#004D61] border-[#006E8A] text-white",
                      day.level === 2 && "bg-[#0089AD] border-[#00B5E5] text-white",
                      day.level === 3 && "bg-[#00E5FF] border-[#00E5FF] text-[#111b21]",
                      day.isToday && "ring-2 ring-inset ring-[#22d3ee]",
                      day.isSelected && "scale-[1.1] ring-2 ring-white z-10"
                    )}
                  >
                    <span className="text-[13px] font-[900]">{format(day.date, 'd')}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-center gap-4 text-[10px] font-[800] text-[#9ca3af] uppercase tracking-widest">
                  <span>MENOS</span>
                  <div className="flex gap-2">
                    {[0,1,2,3].map(l => (
                      <div key={l} className={cn("w-3 h-3 rounded-full", l===0?"bg-[#2a3f4a]":l===1?"bg-[#004D61]":l===2?"bg-[#0089AD]":"bg-[#00E5FF]")} />
                    ))}
                  </div>
                  <span>MAIS</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-[900] text-[#9ca3af] uppercase tracking-widest">PROGRESSO MENSAL</span>
                      <p className="text-[10px] font-[700] text-[#22d3ee] uppercase">CONSISTÊNCIA DE {format(currentDate, 'MMMM', { locale: ptBR })}</p>
                    </div>
                    <span className="text-xl font-[900] text-[#22d3ee]">{monthProgress}%</span>
                  </div>
                  <Progress value={monthProgress} className="h-2.5 bg-[#131f24]" indicatorClassName="bg-[#22d3ee]" />
                </div>
              </div>
            </div>
          </div>

          {/* Habits Side */}
          <div className="lg:w-[40%] space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[#e5e7eb] font-[900] text-[15px] uppercase tracking-[0.1em]">HÁBITOS ATIVOS</h2>
              <div className="bg-[#22d3ee]/20 text-[#22d3ee] text-[12px] font-[900] px-3 py-1 rounded-full border border-[#22d3ee]/30">
                {displayedHabitsData.completed.length}/{displayedHabitsData.all.length}
              </div>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={displayedHabitsData.all.map(h => h.id)} strategy={verticalListSortingStrategy}>
                {displayedHabitsData.pending.map((habit) => (
                  <SortableHabitItem key={habit.id} habit={habit} isCompleted={false} onEdit={(h, r) => setEditingHabit({ habit: h, rect: r })} onToggle={toggleHabit} currentDate={currentDate} />
                ))}
                
                {displayedHabitsData.completed.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="h-[2px] flex-1 bg-[#374151]/30"></div>
                      <span className="text-[10px] font-[900] text-[#9ca3af] uppercase tracking-widest">CONCLUÍDOS</span>
                      <div className="h-[2px] flex-1 bg-[#374151]/30"></div>
                    </div>
                    {displayedHabitsData.completed.map((habit) => (
                      <SortableHabitItem key={habit.id} habit={habit} isCompleted={true} onEdit={(h, r) => setEditingHabit({ habit: h, rect: r })} onToggle={toggleHabit} currentDate={currentDate} />
                    ))}
                  </div>
                )}
              </SortableContext>
            </DndContext>

            <Button onClick={() => setIsModalOpen(true)} className="w-full mt-4 bg-[#1CB0F6] hover:bg-[#1CB0F6] text-white font-[900] text-[13px] uppercase tracking-widest h-14 rounded-[16px] shadow-[0_5px_0_0_#0E8FC7] active:translate-y-[5px] active:shadow-none transition-all">
              <Plus className="mr-2" size={20} strokeWidth={3} /> NOVO HÁBITO
            </Button>
          </div>
        </div>
      </div>

      <DateSelectorModal isOpen={false} onClose={() => {}} currentDate={currentDate} onSelectDate={() => {}} />
    </div>
  );
};

export default HabitsPage;