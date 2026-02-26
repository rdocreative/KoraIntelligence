"use client";

import React, { useState, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  ArrowRight,
  Plus,
  Sunrise,
  Sun,
  Moon,
  Check
} from "lucide-react";
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
  isBefore,
  startOfToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import confetti from 'canvas-confetti';

// --- Types ---
interface Habit {
  id: string;
  title: string;
  time: string;
  period: 'Manhã' | 'Tarde' | 'Noite';
  completedDates: string[];
  tags: { label: string; color: string; bgColor: string }[];
  gradient: string;
  meta: string;
}

const HabitsPage = () => {
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 25)); // February 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 25));

  const [habits, setHabits] = useState<Habit[]>([
    { 
      id: '1', 
      title: 'Beber 3L de água', 
      time: '08:00', 
      period: 'Manhã',
      completedDates: [], 
      tags: [
        { label: 'SAÚDE', color: '#1976D2', bgColor: '#E3F2FD' },
        { label: 'MÁXIMA', color: '#D32F2F', bgColor: '#FFEBEE' }
      ],
      gradient: 'linear-gradient(135deg, #E63946, #FF4D6D)',
      meta: '0/28'
    },
    { 
      id: '2', 
      title: 'Ler 10 páginas', 
      time: '21:00', 
      period: 'Tarde',
      completedDates: [], 
      tags: [
        { label: 'ESTUDOS', color: '#9D4EDD', bgColor: 'rgba(157,78,221,0.1)' },
        { label: 'ALTA', color: '#FF8A3D', bgColor: 'rgba(255,138,61,0.1)' }
      ],
      gradient: 'linear-gradient(135deg, #FF8A3D, #FFB366)',
      meta: '0/28'
    },
    { 
      id: '3', 
      title: 'Meditar', 
      time: '07:30', 
      period: 'Noite',
      completedDates: [], 
      tags: [
        { label: 'ROTINA', color: '#6B6B6B', bgColor: 'rgba(107,107,107,0.1)' },
        { label: 'NORMAL', color: '#06D6A0', bgColor: 'rgba(6,214,160,0.1)' }
      ],
      gradient: 'linear-gradient(135deg, #06D6A0, #1DD3B0)',
      meta: '0/28'
    },
  ]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(endOfMonth(currentDate));
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const isToday = isSameDay(day, new Date(2026, 1, 25)); 
      const dStr = format(day, 'yyyy-MM-dd');
      const completedCount = habits.filter(h => h.completedDates.includes(dStr)).length;
      const isPast = isBefore(day, startOfToday());

      return { 
        date: day, 
        isCurrentMonth: isSameMonth(day, currentDate), 
        isToday,
        isSelected: isSameDay(day, selectedDate),
        completedCount,
        totalHabits: habits.length,
        isPast
      };
    });
  }, [currentDate, selectedDate, habits]);

  const toggleHabit = (id: string) => {
    const dStr = format(selectedDate, 'yyyy-MM-dd');
    let wasCompleted = false;

    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const completed = h.completedDates.includes(dStr);
        if (!completed) wasCompleted = true;
        return { 
          ...h, 
          completedDates: completed 
            ? h.completedDates.filter(d => d !== dStr) 
            : [...h.completedDates, dStr] 
        };
      }
      return h;
    }));

    if (wasCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9D4EDD', '#FF6B4A', '#06D6A0']
      });
      // Som simulado poderia vir aqui
    }
  };

  const dStrSelected = format(selectedDate, 'yyyy-MM-dd');
  const completedCountSelected = habits.filter(h => h.completedDates.includes(dStrSelected)).length;
  const progressPercentage = (completedCountSelected / habits.length) * 100;

  const periods = [
    { label: 'MANHÃ', icon: Sunrise, key: 'Manhã' },
    { label: 'TARDE', icon: Sun, key: 'Tarde' },
    { label: 'NOITE', icon: Moon, key: 'Noite' }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] p-12 font-sans text-[#1A1A1A]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-[45%_55%] gap-[32px] items-start">
        
        {/* COLUNA ESQUERDA - CALENDÁRIO PREMIUM */}
        <div className="bg-white rounded-[32px] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] h-[600px] flex flex-col animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <h2 className="font-serif text-[28px] font-semibold text-[#1A1A1A] leading-tight">
                {format(currentDate, 'MMMM', { locale: ptBR })}
              </h2>
              <span className="text-[14px] text-[#6B6B6B] font-medium tracking-wide">
                {format(currentDate, 'yyyy')}
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-[#F8F8F6] p-1 rounded-full">
                <button 
                  onClick={() => setViewMode('monthly')}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[11px] font-bold transition-all uppercase tracking-tighter",
                    viewMode === 'monthly' ? "bg-white shadow-sm text-[#1A1A1A]" : "text-[#6B6B6B]"
                  )}
                >
                  MÊS
                </button>
                <button 
                  onClick={() => setViewMode('weekly')}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[11px] font-bold transition-all uppercase tracking-tighter",
                    viewMode === 'weekly' ? "bg-white shadow-sm text-[#1A1A1A]" : "text-[#6B6B6B]"
                  )}
                >
                  SEM
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F8F8F6] transition-colors"
                >
                  <ChevronLeft size={20} className="text-[#6B6B6B]" />
                </button>
                <button 
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F8F8F6] transition-colors"
                >
                  <ChevronRight size={20} className="text-[#6B6B6B]" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 mb-2 px-2">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, idx) => (
              <div key={idx} className="text-center text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {calendarDays.map((day, idx) => {
              const isFull = day.completedCount === day.totalHabits && day.totalHabits > 0;
              
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day.date)}
                  className={cn(
                    "relative w-full aspect-square flex flex-col items-center justify-center rounded-[16px] transition-all duration-300 group",
                    !day.isCurrentMonth && "opacity-20",
                    day.isToday && "bg-[#9D4EDD15] border-2 border-[#9D4EDD] ring-offset-2 ring-1 ring-[#FF6B4A]",
                    !day.isToday && "bg-[#F8F8F6] hover:bg-white hover:shadow-md",
                    day.isSelected && !day.isToday && "ring-2 ring-[#9D4EDD]/30",
                    isFull && "shadow-[0_0_12px_rgba(6,214,160,0.2)]"
                  )}
                >
                  <span className={cn(
                    "text-[16px]",
                    day.isToday ? "font-bold text-[#9D4EDD]" : "font-medium text-[#1A1A1A]",
                    day.isPast && day.completedCount === 0 && !day.isToday && "text-[#B0B0B0] opacity-40"
                  )}>
                    {format(day.date, 'd')}
                  </span>
                  
                  {day.completedCount > 0 && (
                    <div className="absolute top-1 right-1 bg-[#06D6A0] text-white text-[8px] font-black px-1.5 py-0.5 rounded-[6px] shadow-sm animate-in zoom-in duration-300">
                      {day.completedCount}/{day.totalHabits}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUNA DIREITA - LISTA DE HÁBITOS ORGANIZADA */}
        <div className="bg-white rounded-[32px] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex flex-col animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-[24px] font-semibold text-[#1A1A1A]">Seus Hábitos</h2>
            <span className="text-[14px] font-medium text-[#6B6B6B]">
              {completedCountSelected} de {habits.length} concluídos
            </span>
          </div>
          
          <div className="w-full h-[6px] bg-[#F8F8F6] rounded-[3px] overflow-hidden mb-10">
            <div 
              className="h-full bg-gradient-to-r from-[#9D4EDD] to-[#FF6B4A] transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="space-y-12">
            {periods.map((period) => {
              const periodHabits = habits.filter(h => h.period === period.key);
              if (periodHabits.length === 0) return null;

              return (
                <div key={period.key} className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <period.icon size={14} className="text-[#6B6B6B]" />
                      <h3 className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-[0.2em]">
                        {period.label}
                      </h3>
                    </div>
                    <div className="h-[1px] w-full bg-[#E5E5E5]" />
                  </div>

                  <div className="space-y-4">
                    {periodHabits.map((habit, hIdx) => {
                      const isCompleted = habit.completedDates.includes(dStrSelected);
                      
                      return (
                        <div 
                          key={habit.id}
                          className={cn(
                            "group relative h-[96px] bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-bottom-4",
                            isCompleted && "opacity-80"
                          )}
                          style={{ 
                            borderLeft: `4px solid`,
                            borderImageSource: habit.gradient,
                            borderImageSlice: 1,
                            animationDelay: `${hIdx * 80}ms`
                          }}
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            {/* Checkbox circular 52px */}
                            <button 
                              onClick={() => toggleHabit(habit.id)}
                              className={cn(
                                "w-[52px] h-[52px] rounded-full border-2 flex items-center justify-center transition-all duration-500 shrink-0 mr-6 transform active:scale-90",
                                isCompleted 
                                  ? "border-transparent rotate-0 scale-100" 
                                  : "border-[#E5E5E5] hover:border-[#9D4EDD] rotate-[-20deg]"
                              )}
                              style={isCompleted ? { background: habit.gradient } : {}}
                            >
                              {isCompleted && (
                                <Check size={28} className="text-white animate-in zoom-in duration-300" strokeWidth={3} />
                              )}
                            </button>

                            <div className="flex-1 min-w-0 pr-4">
                              <h4 className={cn(
                                "text-[17px] font-semibold text-[#1A1A1A] truncate transition-all duration-300",
                                isCompleted && "line-through opacity-50"
                              )}>
                                {habit.title}
                              </h4>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[13px] text-[#6B6B6B] flex items-center gap-1 font-medium">
                                  ⏰ {habit.time}
                                </span>
                                <div className="flex gap-1.5">
                                  {habit.tags.map((tag, tIdx) => (
                                    <span 
                                      key={tIdx}
                                      className="px-2.5 py-1.5 rounded-[6px] text-[10px] font-bold tracking-tight"
                                      style={{ backgroundColor: tag.bgColor, color: tag.color }}
                                    >
                                      {tag.label}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end text-right">
                              <span className="font-serif text-[20px] font-bold text-[#9D4EDD] leading-none">
                                {habit.meta}
                              </span>
                              <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-tighter mt-1">
                                META MENSAL
                              </span>
                            </div>
                            
                            <button className="w-8 h-8 rounded-full bg-[#F8F8F6] flex items-center justify-center transition-all duration-300 hover:bg-[#9D4EDD] group/btn">
                              <ArrowRight size={16} className="text-[#1A1A1A] group-hover/btn:text-white" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTÃO ADICIONAR HÁBITO */}
          <button className="w-full h-[64px] mt-12 bg-gradient-to-r from-[#9D4EDD] to-[#FF6B4A] rounded-[20px] flex items-center justify-center gap-4 text-white font-bold text-[16px] shadow-[0_8px_24px_rgba(157,78,221,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(157,78,221,0.45)] active:scale-95">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Plus size={16} />
            </div>
            <span>✨ Criar Novo Hábito</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default HabitsPage;