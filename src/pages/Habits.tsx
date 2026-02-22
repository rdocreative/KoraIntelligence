"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Plus, Check, ChevronLeft, ChevronRight, 
  LayoutGrid, Clock, Flame, 
  BarChart3, CheckCircle2, Pencil, Trash2, 
  Play, Pause, CalendarDays, Target,
  ChevronDown, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  setMonth,
  setYear,
  getYear,
  getMonth,
  addWeeks,
  subWeeks
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
import { HabitCard } from "@/components/features/habit-tracker/HabitCard";

// --- Types ---
type Priority = 'high' | 'medium' | 'low';
type Frequency = 'daily' | 'weekly';

interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: Frequency;
  priority: Priority;
  weekDays: number[];
  time: string;
  completedDates: string[];
  active: boolean;
  points: number; 
  days: number[]; // Added to match HabitCard expectations
  completed: boolean; // Added to match HabitCard expectations
}

const HabitsPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts'>('overview');
  const [viewMode, setViewMode] = useState<'monthly' | 'list' | 'weekly'>('monthly');
  // Mock data adapted
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Beber 3L de água', emoji: '💧', frequency: 'daily', priority: 'high', weekDays: [0,1,2,3,4,5,6], days: [0,1,2,3,4,5,6], time: '08:00', completedDates: [], active: true, points: 50, completed: false },
    { id: '2', title: 'Ler 10 páginas', emoji: '📚', frequency: 'daily', priority: 'medium', weekDays: [0,1,2,3,4,5,6], days: [0,1,2,3,4,5,6], time: '21:00', completedDates: [], active: true, points: 30, completed: false },
    { id: '3', title: 'Academia', emoji: '💪', frequency: 'weekly', priority: 'high', weekDays: [1,3,5], days: [1,3,5], time: '18:00', completedDates: [], active: true, points: 100, completed: false },
    { id: '4', title: 'Meditar', emoji: '🧘', frequency: 'daily', priority: 'low', weekDays: [0,1,2,3,4,5,6], days: [0,1,2,3,4,5,6], time: '07:30', completedDates: [], active: true, points: 20, completed: false },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // DND Handlers
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
        const isCompleted = h.completedDates.includes(dStr);
        return {
          ...h,
          completed: !isCompleted, // Toggle current view status
          completedDates: isCompleted ? h.completedDates.filter(d => d !== dStr) : [...h.completedDates, dStr]
        };
      }
      return h;
    }));
  };

  const stats = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const scheduledToday = habits.filter(h => h.active && h.weekDays.includes(getDay(new Date())));
    const completedToday = scheduledToday.filter(h => h.completedDates.includes(todayStr)).length;
    return { total: habits.length, today: `${completedToday}/${scheduledToday.length}`, streak: `7d`, rate: `85%` };
  }, [habits]);

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
        else if (percent <= 0.5) level = 2;
        else if (percent <= 0.75) level = 3;
        else level = 4;
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

  const displayedHabitsData = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const filtered = habits.filter(h => h.weekDays.includes(getDay(selectedDate)));
    
    // Map habits to ensure 'completed' prop matches the selected date
    const mapped = filtered.map(h => ({
      ...h,
      completed: h.completedDates.includes(dateStr)
    }));

    const pending = mapped.filter(h => !h.completed);
    const completed = mapped.filter(h => h.completed);
    
    return { pending, completed, all: [...pending, ...completed] };
  }, [habits, selectedDate]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 4 Stat Cards Row - Updated Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1cb0f6] shadow-3d-blue rounded-2xl p-4 flex items-center gap-4 transition-transform hover:translate-y-[-2px]">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Target className="text-white" size={24} /></div>
          <div><p className="text-[#0b4363] text-xs font-extrabold uppercase">Total</p><p className="text-2xl font-extrabold text-white">{stats.total}</p></div>
        </div>
        <div className="bg-[#ff9600] shadow-3d-orange rounded-2xl p-4 flex items-center gap-4 transition-transform hover:translate-y-[-2px]">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Flame className="text-white" size={24} /></div>
          <div><p className="text-[#613400] text-xs font-extrabold uppercase">Streak</p><p className="text-2xl font-extrabold text-white">{stats.streak}</p></div>
        </div>
        <div className="bg-[#58cc02] shadow-3d-green rounded-2xl p-4 flex items-center gap-4 transition-transform hover:translate-y-[-2px]">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><CheckCircle2 className="text-white" size={24} /></div>
          <div><p className="text-[#1f4701] text-xs font-extrabold uppercase">Hoje</p><p className="text-2xl font-extrabold text-white">{stats.today}</p></div>
        </div>
        <div className="bg-[#ce82ff] shadow-3d-purple rounded-2xl p-4 flex items-center gap-4 transition-transform hover:translate-y-[-2px]">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><BarChart3 className="text-white" size={24} /></div>
          <div><p className="text-[#491666] text-xs font-extrabold uppercase">Mês</p><p className="text-2xl font-extrabold text-white">{stats.rate}</p></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Calendar Panel */}
        <div className={cn("w-full transition-all duration-500", viewMode === 'weekly' ? 'lg:w-full' : 'lg:w-[65%]')}>
          <div className="panel-base p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 text-[#58cc02] hover:bg-[#58cc02]/10 rounded-xl transition-colors"><ChevronLeft size={24} strokeWidth={3} /></button>
                <h2 className="text-xl font-extrabold text-white uppercase tracking-wide px-2">
                   {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 text-[#58cc02] hover:bg-[#58cc02]/10 rounded-xl transition-colors"><ChevronRight size={24} strokeWidth={3} /></button>
              </div>
              <Button 
                 onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
                 className="bg-[#58cc02] text-[#0f2900] font-extrabold uppercase shadow-3d-green hover:bg-[#58cc02] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none h-10 rounded-xl border-b-0"
              >
                Hoje
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 mb-4">
              {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                <div key={d} className="text-center text-xs font-extrabold text-[#9ca3af] uppercase py-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, i) => (
                <div 
                  key={i}
                  onClick={() => setSelectedDate(day.date)}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 border-2",
                    day.isCurrentMonth ? "bg-[#131f24] border-[#37464f]" : "bg-transparent border-transparent opacity-30",
                    day.isSelected ? "border-[#58cc02] ring-2 ring-[#58cc02]/30" : "hover:border-[#9ca3af]",
                    // Levels
                    day.isCurrentMonth && day.level === 0 && "hover:bg-[#37464f]",
                    day.level === 1 && "bg-[#58cc02]/20 border-[#58cc02]/30 text-[#58cc02]",
                    day.level === 2 && "bg-[#58cc02]/40 border-[#58cc02]/50 text-white",
                    day.level === 3 && "bg-[#58cc02]/60 border-[#58cc02]/70 text-white",
                    day.level === 4 && "bg-[#58cc02] border-[#58cc02] text-[#0f2900]"
                  )}
                >
                  <span className="text-sm font-bold">{format(day.date, 'd')}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center gap-4 items-center">
               <span className="text-[10px] font-extrabold uppercase text-[#9ca3af]">Menos</span>
               {[0, 1, 2, 3, 4].map(l => (
                 <div key={l} className={cn("w-4 h-4 rounded-md border-2", 
                   l===0?"bg-[#131f24] border-[#37464f]":
                   l===1?"bg-[#58cc02]/20 border-[#58cc02]/30":
                   l===4?"bg-[#58cc02] border-[#58cc02]": "bg-[#58cc02]/60 border-[#58cc02]/70"
                 )} />
               ))}
               <span className="text-[10px] font-extrabold uppercase text-[#9ca3af]">Mais</span>
            </div>
          </div>
        </div>

        {/* Sidebar / Active Habits List */}
        <div className="w-full lg:w-[35%] relative">
           <div className="panel-base flex flex-col h-full max-h-[700px]">
              <div className="p-6 border-b-2 border-[#37464f] bg-[#131f24] rounded-t-3xl flex justify-between items-center">
                 <h2 className="text-lg font-extrabold text-white uppercase tracking-wide">Hábitos do Dia</h2>
                 <span className="bg-[#58cc02] text-[#0f2900] text-xs font-extrabold px-3 py-1 rounded-full">
                    {displayedHabitsData.completed.length}/{displayedHabitsData.all.length}
                 </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                 {/* Drag and Drop context would wrap this list, keeping simple for style update */}
                 {displayedHabitsData.all.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[#9ca3af] p-8 text-center">
                       <Clock size={48} className="mb-4 opacity-50" />
                       <p className="font-bold">Nenhum hábito para hoje</p>
                    </div>
                 ) : (
                    displayedHabitsData.all.map((habit, index) => (
                       <HabitCard 
                          key={habit.id} 
                          habit={habit} 
                          index={index}
                          onComplete={(id) => toggleHabit(id)} 
                       />
                    ))
                 )}
              </div>

              <div className="p-4 border-t-2 border-[#37464f]">
                <Button className="w-full h-12 rounded-2xl bg-[#22d3ee] text-[#083344] font-extrabold uppercase tracking-widest shadow-3d-cyan hover:bg-[#22d3ee] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none border-b-0">
                   <Plus className="mr-2" size={20} strokeWidth={3} /> Novo Hábito
                </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;