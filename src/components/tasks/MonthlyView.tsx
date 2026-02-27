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
import { Clock, X, Hash, Sun, Coffee, Moon } from 'lucide-react';
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

const getPeriodGradient = (period: string) => {
  switch (period) {
    case 'Morning':
      return "from-orange-500/10 via-orange-500/[0.02] to-transparent border-l-orange-500/40";
    case 'Afternoon':
      return "from-emerald-500/10 via-emerald-500/[0.02] to-transparent border-l-emerald-500/40";
    case 'Evening':
      return "from-indigo-500/10 via-indigo-500/[0.02] to-transparent border-l-indigo-500/40";
    default:
      return "from-blue-500/10 via-blue-500/[0.02] to-transparent border-l-blue-500/40";
  }
};

const getPeriodInfo = (period: string) => {
  switch (period) {
    case 'Morning':
      return { label: 'MANHÃ', icon: Sun, color: 'text-orange-400' };
    case 'Afternoon':
      return { label: 'TARDE', icon: Coffee, color: 'text-emerald-400' };
    case 'Evening':
      return { label: 'NOITE', icon: Moon, color: 'text-indigo-400' };
    default:
      return { label: 'MADRUGADA', icon: Moon, color: 'text-blue-500' };
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

      {/* Painel Lateral Direito */}
      <div className="w-[320px] flex flex-col animate-in slide-in-from-right duration-500 py-2">
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

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
            {selectedDayTasks.length > 0 ? (
              selectedDayTasks.map((task) => {
                const period = getPeriodInfo(task.period);
                const PeriodIcon = period.icon;

                return (
                  <div 
                    key={task.id}
                    className={cn(
                      "group p-4 rounded-[24px] transition-all relative overflow-hidden bg-zinc-900/40 border-y border-r border-white/5 border-l-4",
                      getPeriodGradient(task.period)
                    )}
                  >
                    <div className="relative z-10">
                      {/* Top: Just Period Icon */}
                      <div className="flex items-center mb-3">
                        <PeriodIcon size={14} className={period.color} />
                      </div>

                      {/* Middle: Title & Icon */}
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-xl filter drop-shadow-md">{task.icon}</span>
                        <h4 className="text-[14px] font-semibold text-white/95 group-hover:text-white transition-colors leading-tight">
                          {task.name}
                        </h4>
                      </div>
                      
                      {/* Bottom: Priority (Left) & Time (Right) */}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.03]">
                        <div className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                          task.priority === 'Extrema' ? "bg-red-500/10 text-red-500" :
                          task.priority === 'Média' ? "bg-amber-500/10 text-amber-500" : "bg-sky-500/10 text-sky-500"
                        )}>
                          {task.priority}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                          <Clock size={10} className="text-zinc-600" />
                          {task.time}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
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