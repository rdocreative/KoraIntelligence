"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, Check, ChevronLeft, ChevronRight, 
  LayoutGrid, Clock, Flame, 
  BarChart3, CheckCircle2, Target, CalendarDays, List, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, 
  addMonths, subMonths, getDay, startOfWeek, endOfWeek
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Habit {
  id: string;
  title: string;
  emoji: string;
  priority: 'high' | 'medium' | 'low';
  weekDays: number[];
  time: string;
  completedDates: string[];
  active: boolean;
}

const HabitsPage = () => {
  const [viewMode, setViewMode] = useState<'monthly' | 'list'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [habits] = useState<Habit[]>([
    { id: '1', title: 'Beber 3L de água', emoji: '💧', priority: 'high', weekDays: [0,1,2,3,4,5,6], time: '08:00', completedDates: [], active: true },
    { id: '2', title: 'Ler 10 páginas', emoji: '📚', priority: 'medium', weekDays: [0,1,2,3,4,5,6], time: '21:00', completedDates: [], active: true },
    { id: '3', title: 'Academia', emoji: '💪', priority: 'high', weekDays: [1,3,5], time: '18:00', completedDates: [], active: true },
  ]);

  const statCards = [
    { label: "Total Hábitos", value: habits.length, color: "blue", icon: Target },
    { label: "Streak", value: "7d", color: "orange", icon: Flame },
    { label: "Hoje", value: "2/4", color: "green", icon: CheckCircle2 },
    { label: "Mês %", value: "85%", color: "purple", icon: BarChart3 },
  ];

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  const priorityColors = {
    high: "card-red",
    medium: "card-orange",
    low: "card-green"
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div 
            key={i}
            className={cn(
              "p-6 rounded-3xl flex flex-col gap-3 duo-card-3d",
              `bg-card-${stat.color} shadow-${stat.color} hover-shadow-${stat.color}`
            )}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                <stat.icon size={24} strokeWidth={3} />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
              <div className="text-[11px] font-black text-white/80 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Calendar Panel */}
        <div className="lg:col-span-2">
          <div className="duo-panel p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 text-text-muted hover:text-white"><ChevronLeft/></button>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 text-text-muted hover:text-white"><ChevronRight/></button>
              </div>
              <div className="flex items-center bg-sidebar border-2 border-duo-gray p-1 rounded-2xl shadow-panel">
                <button onClick={() => setViewMode('monthly')} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", viewMode === 'monthly' ? "bg-primary text-background shadow-cyan" : "text-text-muted")}>Grade</button>
                <button onClick={() => setViewMode('list')} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", viewMode === 'list' ? "bg-primary text-background shadow-cyan" : "text-text-muted")}>Lista</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">{d}</div>
              ))}
              {calendarDays.map((day, i) => (
                <div 
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "aspect-square rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shadow-panel",
                    isSameMonth(day, currentDate) ? "bg-sidebar border-duo-gray hover:border-primary/50" : "opacity-20 pointer-events-none border-transparent",
                    isSameDay(day, selectedDate) && "border-primary bg-primary/10",
                    isSameDay(day, new Date()) && "ring-2 ring-primary ring-offset-4 ring-offset-panel"
                  )}
                >
                  <span className="text-lg font-black text-white">{format(day, 'd')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Habits List */}
        <div className="space-y-6">
          <div className="duo-panel p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Ativos Hoje</h3>
              <div className="p-2 bg-sidebar border-2 border-duo-gray rounded-xl">
                 <CalendarDays size={16} className="text-primary" />
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {habits.map((habit) => (
                <div 
                  key={habit.id}
                  className={cn(
                    "p-4 rounded-2xl border-2 duo-card-3d relative overflow-hidden group cursor-pointer",
                    `bg-card-${priorityColors[habit.priority]}/20 border-card-${priorityColors[habit.priority]}/40`
                  )}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                      `border-card-${priorityColors[habit.priority]} bg-card-${priorityColors[habit.priority]}/30`
                    )}>
                      <Check size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={4} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">{habit.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                         <Clock size={12} className="text-text-muted" />
                         <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{habit.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="duo-button-primary w-full mt-8">
               <Plus size={20} strokeWidth={3} /> Novo Hábito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;