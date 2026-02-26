"use client";

import React, { useState, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus,
  ArrowRight
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
  startOfDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- Types ---
interface Habit {
  id: string;
  title: string;
  time: string;
  completedDates: string[];
  tags: { label: string; color: string; bgColor: string }[];
  gradient: string;
  meta: string;
}

const HabitsPage = () => {
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 25)); // Set to February 2026 for the spec
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 25));

  const [habits, setHabits] = useState<Habit[]>([
    { 
      id: '1', 
      title: 'Beber 3L de água', 
      time: '08:00', 
      completedDates: [], 
      tags: [
        { label: 'SAÚDE', color: '#00D1FF', bgColor: 'rgba(0,209,255,0.1)' },
        { label: 'MÁXIMA', color: '#E63946', bgColor: 'rgba(230,57,70,0.1)' }
      ],
      gradient: 'linear-gradient(135deg, #E63946, #FF4D6D)',
      meta: 'META MENSAL 0/28'
    },
    { 
      id: '2', 
      title: 'Ler 10 páginas', 
      time: '21:00', 
      completedDates: [], 
      tags: [
        { label: 'ESTUDOS', color: '#9D4EDD', bgColor: 'rgba(157,78,221,0.1)' },
        { label: 'ALTA', color: '#FF8A3D', bgColor: 'rgba(255,138,61,0.1)' }
      ],
      gradient: 'linear-gradient(135deg, #FF8A3D, #FFB366)',
      meta: 'META MENSAL 0/28'
    },
    { 
      id: '3', 
      title: 'Meditar', 
      time: '07:30', 
      completedDates: [], 
      tags: [
        { label: 'ROTINA', color: '#6B6B6B', bgColor: 'rgba(107,107,107,0.1)' },
        { label: 'NORMAL', color: '#06D6A0', bgColor: 'rgba(6,214,160,0.1)' }
      ],
      gradient: 'linear-gradient(135deg, #06D6A0, #1DD3B0)',
      meta: 'META MENSAL 0/28'
    },
  ]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(endOfMonth(currentDate));
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const isToday = isSameDay(day, new Date(2026, 1, 25)); // Matching spec today
      return { 
        date: day, 
        isCurrentMonth: isSameMonth(day, currentDate), 
        isToday,
        isSelected: isSameDay(day, selectedDate),
        // Mock dots for the spec
        completedDots: isToday ? [] : (getDay(day) % 3 === 0 ? ['#E63946', '#FF8A3D', '#06D6A0'] : [])
      };
    });
  }, [currentDate, selectedDate]);

  const toggleHabit = (id: string) => {
    const dStr = format(selectedDate, 'yyyy-MM-dd');
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const completed = h.completedDates.includes(dStr);
        return { 
          ...h, 
          completedDates: completed 
            ? h.completedDates.filter(d => d !== dStr) 
            : [...h.completedDates, dStr] 
        };
      }
      return h;
    }));
  };

  const completedCount = habits.filter(h => h.completedDates.includes(format(selectedDate, 'yyyy-MM-dd'))).length;

  return (
    <div className="min-h-screen bg-[#F8F8F6] p-10 font-sans text-[#1A1A1A]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[32px]">
        
        {/* COLUNA ESQUERDA - CALENDÁRIO */}
        <div className="bg-white rounded-[24px] p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] flex flex-col h-fit">
          <div className="flex items-center justify-between mb-8">
            {/* Toggle MÊS / SEM */}
            <div className="bg-[#F8F8F6] rounded-full p-1 flex items-center">
              <button 
                onClick={() => setViewMode('monthly')}
                className={cn(
                  "px-4 py-2 rounded-full text-[13px] font-semibold transition-all",
                  viewMode === 'monthly' ? "bg-[#E63946] text-white" : "bg-transparent text-[#6B6B6B]"
                )}
              >
                MÊS
              </button>
              <button 
                onClick={() => setViewMode('weekly')}
                className={cn(
                  "px-4 py-2 rounded-full text-[13px] font-semibold transition-all",
                  viewMode === 'weekly' ? "bg-[#E63946] text-white" : "bg-transparent text-[#6B6B6B]"
                )}
              >
                SEM
              </button>
            </div>
          </div>

          {/* Month Header */}
          <div className="flex items-center justify-between mb-8 px-4">
            <button 
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-[#F8F8F6] rounded-full transition-colors text-[#1A1A1A]"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-serif text-[24px] font-semibold uppercase tracking-tight">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <button 
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-[#F8F8F6] rounded-full transition-colors text-[#1A1A1A]"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(day => (
              <div key={day} className="text-center text-[12px] font-semibold text-[#6B6B6B] py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDate(day.date)}
                className={cn(
                  "relative h-[52px] w-full flex flex-col items-center justify-center rounded-[12px] transition-all",
                  !day.isCurrentMonth && "opacity-20",
                  day.isToday && "bg-white border-2 border-[#9D4EDD]",
                  !day.isToday && day.isCurrentMonth && "bg-[#F8F8F6]",
                  day.isSelected && !day.isToday && "ring-2 ring-[#9D4EDD]/30"
                )}
              >
                <span className={cn(
                  "text-[16px]",
                  day.isToday ? "font-bold" : "font-normal"
                )}>
                  {format(day.date, 'd')}
                </span>
                
                {/* Dots for completed habits */}
                {day.completedDots.length > 0 && (
                  <div className="absolute bottom-1.5 flex gap-0.5">
                    {day.completedDots.map((color, i) => (
                      <div 
                        key={i} 
                        className="w-[6px] h-[6px] rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA - LISTA DE HÁBITOS */}
        <div className="flex flex-col gap-[32px]">
          <div className="bg-white rounded-[24px] p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] flex flex-col h-fit">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-[20px] font-semibold uppercase tracking-tight">
                HÁBITOS DE HOJE
              </h2>
              <span className="text-[#6B6B6B] font-medium">
                {completedCount}/{habits.length}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {habits.map((habit) => {
                const isCompleted = habit.completedDates.includes(format(selectedDate, 'yyyy-MM-dd'));
                return (
                  <div 
                    key={habit.id}
                    className="group relative rounded-[16px] p-[2px] transition-all hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]"
                    style={{ background: habit.gradient }}
                  >
                    <div className="bg-white rounded-[14px] p-5 flex items-center">
                      {/* Custom Circular Checkbox */}
                      <button 
                        onClick={() => toggleHabit(habit.id)}
                        className={cn(
                          "w-[40px] h-[40px] rounded-full border-2 flex items-center justify-center transition-all shrink-0 mr-4",
                          isCompleted
                            ? "bg-[#9D4EDD] border-[#9D4EDD]"
                            : "border-[#E5E5E5] hover:border-[#9D4EDD]/50"
                        )}
                      >
                        {isCompleted && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-[16px] font-semibold truncate leading-tight">
                            {habit.title}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1.5 text-[#6B6B6B]">
                            <Clock size={14} />
                            <span className="text-[12px] font-medium">{habit.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {habit.tags.map((tag, i) => (
                              <span 
                                key={i}
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider"
                                style={{ backgroundColor: tag.bgColor, color: tag.color }}
                              >
                                {tag.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 ml-4">
                        <span className="text-[#9D4EDD] text-[11px] font-bold tracking-tight mb-2">
                          {habit.meta}
                        </span>
                        <ArrowRight size={18} className="text-[#E5E5E5] group-hover:text-[#9D4EDD] transition-colors" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTÃO NOVO HÁBITO */}
          <button 
            className="w-full h-[56px] rounded-[16px] bg-gradient-to-r from-[#9D4EDD] to-[#FF6B4A] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(157,78,221,0.3)] transition-all hover:translate-y-[-2px] hover:shadow-[0_6px_24px_rgba(157,78,221,0.4)] active:translate-y-[0px]"
          >
            <span>✨</span> NOVO HÁBITO
          </button>
        </div>

      </div>
    </div>
  );
};

export default HabitsPage;