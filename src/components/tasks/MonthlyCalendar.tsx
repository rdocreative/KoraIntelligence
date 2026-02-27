"use client";

import React, { useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  getDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthlyCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  tasksData: Record<string, any[]>;
}

const WEEK_DAYS_MAP: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado'
};

export const MonthlyCalendar = ({ 
  currentDate, 
  selectedDate, 
  onDateSelect, 
  onMonthChange,
  tasksData
}: MonthlyCalendarProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
  }, [startDate, endDate]);

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <h2 className="text-3xl font-bold text-white capitalize">
            {format(currentDate, "MMMM", { locale: ptBR })}
            <span className="text-zinc-600 ml-3 font-medium">{format(currentDate, "yyyy")}</span>
          </h2>
          <div className="flex gap-1">
            <button 
              onClick={() => onMonthChange(subMonths(currentDate, 1))}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => onMonthChange(addMonths(currentDate, 1))}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px mb-2">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{day}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-3 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
        {calendarDays.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          
          const dayName = WEEK_DAYS_MAP[getDay(day)];
          const dayTasks = tasksData[dayName] || [];
          const extremeTasks = dayTasks.filter(t => t.priority === 'Extrema').length;

          return (
            <button
              key={day.toString()}
              onClick={() => onDateSelect(day)}
              className={cn(
                "group relative aspect-[4/3] p-4 transition-all duration-300 border text-left flex flex-col",
                isCurrentMonth ? "bg-white/[0.02]" : "bg-transparent opacity-20",
                isSelected 
                  ? "border-[#6366f1]/50 bg-[#6366f1]/[0.05] ring-1 ring-[#6366f1]/30" 
                  : "border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10",
                isToday && !isSelected && "border-white/20"
              )}
              style={{ borderRadius: '12px' }}
            >
              <div className="flex justify-between items-start mb-auto">
                <span className={cn(
                  "text-lg font-bold transition-colors",
                  isSelected ? "text-[#a5b4fc]" : isToday ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                )}>
                  {format(day, 'd')}
                </span>
                {extremeTasks > 0 && isCurrentMonth && (
                  <div className="flex items-center gap-1 bg-red-500/10 px-1.5 py-0.5 rounded text-[8px] font-black text-red-500">
                    <Zap size={8} fill="currentColor" />
                    {extremeTasks}
                  </div>
                )}
              </div>

              {isCurrentMonth && dayTasks.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#6366f1]/40" />
                  {dayTasks.length > 1 && <div className="h-1.5 w-1.5 rounded-full bg-white/10" />}
                  {dayTasks.length > 2 && <div className="h-1.5 w-1.5 rounded-full bg-white/10" />}
                </div>
              )}
              
              {isToday && !isSelected && (
                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#6366f1] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};