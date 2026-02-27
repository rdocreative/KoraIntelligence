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
import { Clock, X, ChevronRight, Hash } from 'lucide-react';
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Extrema': return "bg-red-500";
    case 'Média': return "bg-amber-500";
    case 'Baixa':
    default: return "bg-[#38BDF8]";
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
    <div className="flex h-full w-full animate-in fade-in duration-700 overflow-hidden bg-[#080808] px-8">
      {/* Grid Principal do Calendário */}
      <div className="flex-1 flex flex-col min-w-0 pr-6">
        <div className="grid grid-cols-7 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
            <div key={d} className="py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
              {d}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 gap-3 overflow-y-auto custom-scrollbar pb-8">
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
                  "min-h-[140px] p-3 rounded-[24px] border transition-all cursor-pointer group flex flex-col relative",
                  !isCurrentMonth ? "bg-transparent border-transparent opacity-10 pointer-events-none" : 
                  isSelected ? "bg-white/[0.04] border-white/10 shadow-xl" : "bg-white/[0.02] border-white/5 hover:border-white/10",
                  isDateToday && !isSelected && "border-[#38BDF8]/20"
                )}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className={cn(
                    "w-7 h-7 flex items-center justify-center text-xs font-bold rounded-full transition-all",
                    isDateToday ? "border border-[#38BDF8] text-[#38BDF8]" : "text-zinc-500 group-hover:text-zinc-300",
                    isSelected && "bg-[#38BDF8] text-black border-none"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {tasks.length > 0 && isCurrentMonth && (
                    <div className="flex -space-x-1">
                      {tasks.slice(0, 3).map((t, i) => (
                        <div key={i} className={cn("w-1.5 h-1.5 rounded-full border border-[#080808]", getPriorityColor(t.priority))} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1.5 overflow-hidden">
                  {isCurrentMonth && tasks.slice(0, 3).map((task) => (
                    <div 
                      key={task.id}
                      className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2 transition-transform hover:scale-[1.02]"
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", getPriorityColor(task.priority))} />
                      <span className="text-[9px] font-semibold text-zinc-300 truncate tracking-tight">
                        {task.name}
                      </span>
                    </div>
                  ))}
                  {tasks.length > 3 && isCurrentMonth && (
                    <div className="text-[8px] font-black uppercase tracking-widest text-zinc-600 pl-1 pt-1">
                      + {tasks.length - 3} itens
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Painel Lateral Direito */}
      <div className="w-[380px] flex flex-col animate-in slide-in-from-right duration-500 py-4">
        <div className="bg-white/[0.03] border border-white/10 rounded-[32px] flex flex-col h-full shadow-2xl overflow-hidden">
          <div className="p-8 pb-6 border-b border-white/5">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-8 h-8 rounded-xl bg-[#38BDF8]/10 flex items-center justify-center">
                  <Hash size={14} className="text-[#38BDF8]" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                {format(selectedDate, "EEEE", { locale: ptBR })}
              </span>
            </div>
            <h3 className="text-3xl font-serif font-medium text-white leading-tight">
              {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-4">
            {selectedDayTasks.length > 0 ? (
              selectedDayTasks.map((task) => (
                <div 
                  key={task.id}
                  className="group p-5 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl filter drop-shadow-sm">{task.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-tight mb-1">
                          {task.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                          <Clock size={11} className="text-zinc-600" />
                          {task.time}
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                      getPriorityColor(task.priority)
                    )} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-white/5",
                      task.priority === 'Extrema' ? "text-red-400" :
                      task.priority === 'Média' ? "text-amber-400" : "text-[#38BDF8]"
                    )}>
                      {task.priority}
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-600 hover:text-white transition-all bg-white/5 rounded-lg">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-10">
                <div className="w-16 h-16 rounded-[24px] border-2 border-dashed border-white/10 flex items-center justify-center mb-6">
                  <X size={24} className="text-zinc-600" />
                </div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">Sem tarefas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};