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
import { Clock, X, ChevronRight } from 'lucide-react';
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
      return "bg-red-500/10 text-red-400 border-l-2 border-red-500/50";
    case 'Média':
      return "bg-amber-500/10 text-amber-400 border-l-2 border-amber-500/50";
    case 'Baixa':
    default:
      return "bg-blue-500/10 text-blue-400 border-l-2 border-blue-500/50";
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
    <div className="flex h-full w-full animate-in fade-in duration-500 overflow-hidden bg-[#080808]">
      {/* Grid Principal do Calendário */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/5">
        <div className="grid grid-cols-7 border-b border-white/5 bg-[#0A0A0B]">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
            <div key={d} className="py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border-r border-white/5 last:border-r-0">
              {d}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 overflow-y-auto custom-scrollbar">
          {calendarDays.map((day, idx) => {
            const tasks = getTasksForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const today = isToday(day);

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "min-h-[140px] p-2 border-r border-b border-white/5 transition-colors cursor-pointer group flex flex-col",
                  !isCurrentMonth ? "bg-[#050505] opacity-20" : "bg-[#0A0A0B] hover:bg-white/[0.02]",
                  isSelected && "bg-white/[0.03]"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full transition-all",
                    today ? "bg-[#38BDF8] text-black font-bold" : "text-zinc-500 group-hover:text-zinc-300",
                    isSelected && !today && "text-white bg-white/10"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {tasks.length > 0 && isCurrentMonth && (
                    <span className="text-[9px] font-bold text-zinc-600 px-1.5 py-0.5 rounded-md bg-white/5">
                      {tasks.length}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-1 overflow-hidden">
                  {isCurrentMonth && tasks.slice(0, 4).map((task) => (
                    <div 
                      key={task.id}
                      className={cn(
                        "px-2 py-1 rounded text-[10px] font-semibold truncate transition-transform hover:scale-[1.02]",
                        getPriorityStyles(task.priority)
                      )}
                    >
                      {task.name}
                    </div>
                  ))}
                  {tasks.length > 4 && isCurrentMonth && (
                    <div className="text-[9px] font-bold text-zinc-600 pl-2 pt-1">
                      + {tasks.length - 4} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Painel Lateral Direito */}
      <div className="w-[400px] bg-[#0A0A0B] flex flex-col animate-in slide-in-from-right duration-500 shadow-2xl">
        <div className="p-10 pb-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#38BDF8]">
              {format(selectedDate, "EEEE", { locale: ptBR })}
            </div>
          </div>
          <h3 className="text-3xl font-serif text-white">
            {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 pt-8 space-y-6">
          {selectedDayTasks.length > 0 ? (
            selectedDayTasks.map((task) => (
              <div 
                key={task.id}
                className="group relative"
              >
                <div className="flex gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <div className={cn(
                      "w-3 h-3 rounded-full mb-2",
                      task.priority === 'Extrema' ? "bg-red-500" :
                      task.priority === 'Média' ? "bg-amber-500" : "bg-blue-500"
                    )} />
                    <div className="w-px flex-1 bg-white/10" />
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{task.icon}</span>
                      <h4 className="text-base font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                        {task.name}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 bg-white/5 px-2.5 py-1 rounded-lg">
                        <Clock size={12} className="text-zinc-400" />
                        {task.time}
                      </div>
                      <div className={cn(
                        "text-[10px] font-black uppercase tracking-wider",
                        task.priority === 'Extrema' ? "text-red-400" :
                        task.priority === 'Média' ? "text-amber-400" : "text-blue-400"
                      )}>
                        {task.priority}
                      </div>
                    </div>
                  </div>

                  <button className="opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
              <div className="w-20 h-20 rounded-[32px] border-2 border-dashed border-white/20 flex items-center justify-center mb-6">
                <X size={32} className="text-zinc-500" />
              </div>
              <p className="text-sm text-zinc-400 font-medium">Nenhum evento<br/>para este dia</p>
            </div>
          )}
        </div>

        <div className="p-10 pt-6 border-t border-white/5 bg-white/[0.01]">
          <button className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest transition-all border border-white/5">
            Adicionar Evento
          </button>
        </div>
      </div>
    </div>
  );
};