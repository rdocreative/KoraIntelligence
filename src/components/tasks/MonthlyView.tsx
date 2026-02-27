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
import { Clock, X, Hash } from 'lucide-react';
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

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'Extrema': 
      return "bg-gradient-to-r from-red-500/20 to-red-500/5 border-red-500/30 text-red-200";
    case 'Média': 
      return "bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-200";
    case 'Baixa':
    default: 
      return "bg-gradient-to-r from-sky-500/20 to-sky-500/5 border-sky-500/30 text-sky-200";
  }
};

const getSidebarCardStyles = (priority: string) => {
  switch (priority) {
    case 'Extrema': 
      return "bg-gradient-to-r from-red-600/10 via-red-600/5 to-transparent border-l-2 border-red-600/50";
    case 'Média': 
      return "bg-gradient-to-r from-amber-600/10 via-amber-600/5 to-transparent border-l-2 border-amber-600/50";
    case 'Baixa':
    default: 
      return "bg-gradient-to-r from-sky-600/10 via-sky-600/5 to-transparent border-l-2 border-sky-600/50";
  }
};

const getPriorityDot = (priority: string) => {
  switch (priority) {
    case 'Extrema': return "bg-red-500";
    case 'Média': return "bg-amber-500";
    default: return "bg-sky-500";
  }
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
    <div className="flex h-full w-full animate-in fade-in duration-700 overflow-hidden bg-[#080808] px-6">
      {/* Grid Principal do Calendário */}
      <div className="flex-1 flex flex-col min-w-0 pr-4">
        <div className="grid grid-cols-7 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
            <div key={d} className="py-2 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400">
              {d}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 gap-2 pb-6">
          {calendarDays.map((day, idx) => {
            const tasks = getTasksForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isDateToday = isToday(day);

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "min-h-0 h-full p-2 rounded-[18px] border transition-all cursor-pointer group flex flex-col relative",
                  !isCurrentMonth ? "bg-transparent border-transparent opacity-5 pointer-events-none" : 
                  isSelected ? "bg-white/[0.06] border-white/20 shadow-lg" : "bg-white/[0.02] border-white/5 hover:border-white/10",
                  isDateToday && !isSelected && "border-[#38BDF8]/40"
                )}
              >
                <div className="flex justify-between items-center mb-1.5 px-0.5">
                  <span className={cn(
                    "text-sm font-bold transition-all",
                    isDateToday ? "text-[#38BDF8]" : "text-zinc-200 group-hover:text-white",
                    isSelected && "text-white"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {tasks.length > 0 && isCurrentMonth && (
                     <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  )}
                </div>

                <div className="flex-1 space-y-1 overflow-hidden">
                  {isCurrentMonth && tasks.slice(0, 2).map((task) => (
                    <div 
                      key={task.id}
                      className={cn(
                        "px-2 py-0.5 rounded-md border flex items-center gap-1.5 transition-transform hover:scale-[1.02]",
                        getPriorityStyles(task.priority)
                      )}
                    >
                      <div className={cn("w-1 h-1 rounded-full shrink-0", getPriorityDot(task.priority))} />
                      <span className="text-[9px] font-medium truncate">
                        {task.name}
                      </span>
                    </div>
                  ))}
                  {tasks.length > 2 && isCurrentMonth && (
                    <div className="text-[8px] font-bold text-zinc-500 pl-1">
                      + {tasks.length - 2} itens
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Painel Lateral Direito - Mais Compacto */}
      <div className="w-[300px] flex flex-col animate-in slide-in-from-right duration-500 py-2">
        <div className="bg-white/[0.03] border border-white/10 rounded-[28px] flex flex-col h-full shadow-2xl overflow-hidden">
          <div className="p-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2 mb-1.5">
               <Hash size={12} className="text-[#38BDF8]" />
               <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                {format(selectedDate, "EEEE", { locale: ptBR })}
              </span>
            </div>
            <h3 className="text-xl font-serif text-white">
              {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3">
            {selectedDayTasks.length > 0 ? (
              selectedDayTasks.map((task) => (
                <div 
                  key={task.id}
                  className={cn(
                    "group p-4 rounded-[20px] transition-all border border-white/5 hover:border-white/10",
                    getSidebarCardStyles(task.priority)
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{task.icon}</span>
                    <h4 className="text-xs font-semibold text-white/90 group-hover:text-[#38BDF8] transition-colors truncate">
                      {task.name}
                    </h4>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                      <Clock size={10} className="text-zinc-600" />
                      {task.time}
                    </div>
                    <div className={cn(
                      "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                      task.priority === 'Extrema' ? "bg-red-500/20 text-red-400" :
                      task.priority === 'Média' ? "bg-amber-500/20 text-amber-400" : "bg-sky-500/20 text-sky-400"
                    )}>
                      {task.priority}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-8">
                <X size={20} className="text-zinc-600 mb-2" />
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em]">Vazio</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};