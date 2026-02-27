"use client";

import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  getDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthlyViewProps {
  tasksData: Record<string, any[]>;
  currentDate: Date;
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

export const MonthlyView = ({ tasksData, currentDate }: MonthlyViewProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getTasksForDate = (date: Date) => {
    const dayName = WEEK_DAYS_MAP[getDay(date)];
    return tasksData[dayName] || [];
  };

  const selectedDayTasks = getTasksForDate(selectedDate);

  return (
    <div className="flex h-full w-full animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      {/* Grid do Calendário */}
      <div className="flex-1 p-6 flex flex-col min-w-0">
        <div className="grid grid-cols-7 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
            <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {d}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 gap-px bg-white/5 rounded-[24px] overflow-hidden border border-white/5">
          {calendarDays.map((day, idx) => {
            const tasks = getTasksForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "relative group flex flex-col items-center justify-center transition-all min-h-0",
                  isCurrentMonth ? "bg-[#0A0A0B]" : "bg-[#080808] opacity-20 pointer-events-none",
                  isSelected && "bg-white/[0.03]"
                )}
              >
                {isSelected && (
                  <div className="absolute inset-0 border-2 border-[#38BDF8]/40 pointer-events-none z-10" />
                )}
                
                <span className={cn(
                  "text-sm font-medium relative z-10",
                  isToday(day) ? "text-[#38BDF8] font-bold" : "text-zinc-400",
                  isSelected && "text-white scale-110"
                )}>
                  {format(day, 'd')}
                </span>

                {tasks.length > 0 && isCurrentMonth && (
                  <div className="mt-2 flex gap-1">
                    {tasks.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]/60" />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Painel Lateral de Tarefas */}
      <div className="w-[380px] border-l border-white/5 bg-white/[0.01] flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-8 pb-4">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#38BDF8] mb-1">
            {format(selectedDate, "EEEE", { locale: ptBR })}
          </div>
          <h3 className="text-2xl font-serif text-white">
            {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-4 space-y-4">
          {selectedDayTasks.length > 0 ? (
            selectedDayTasks.map((task) => (
              <div 
                key={task.id}
                className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-[#38BDF8]/30 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{task.icon}</span>
                  <h4 className="text-sm font-semibold text-white group-hover:text-[#38BDF8] transition-colors">{task.name}</h4>
                </div>
                <div className="flex items-center gap-4 text-zinc-500">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium">
                    <Clock size={12} className="text-zinc-600" />
                    {task.time}
                  </div>
                  <div className={cn(
                    "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                    task.priority === 'Extrema' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                    task.priority === 'Média' ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                    "bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20"
                  )}>
                    {task.priority}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
              <div className="w-16 h-16 rounded-[24px] border border-dashed border-white/20 flex items-center justify-center mb-6">
                <X size={24} className="text-zinc-500" />
              </div>
              <p className="text-sm text-zinc-400 font-medium">Nenhum compromisso<br/>planejado para este dia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};