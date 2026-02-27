"use client";

import React from 'react';
import { 
  format, 
  startOfWeek, 
  addDays, 
  isToday 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sun, Coffee, Moon, Plus, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  name: string;
  time: string;
  priority: 'Extrema' | 'Média' | 'Baixa';
  period: 'Morning' | 'Afternoon' | 'Evening' | 'LateNight';
  icon: string;
}

interface WeeklyViewProps {
  tasksData: Record<string, Task[]>;
  currentDate: Date;
}

const PERIODS = [
  { id: 'Morning', label: 'Manhã', icon: Sun, color: 'text-orange-400', bg: 'bg-orange-500/5', border: 'border-orange-500/10' },
  { id: 'Afternoon', label: 'Tarde', icon: Coffee, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' },
  { id: 'Evening', label: 'Noite', icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-500/5', border: 'border-indigo-500/10' },
] as const;

const WEEK_DAYS_MAP: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado'
};

const getTaskGradient = (period: string) => {
  switch (period) {
    case 'Morning':
      return "from-orange-500/12 to-transparent";
    case 'Afternoon':
      return "from-emerald-500/12 to-transparent";
    case 'Evening':
      return "from-indigo-500/12 to-transparent";
    case 'LateNight':
    default:
      return "from-blue-600/12 to-transparent";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Extrema': return "text-red-400";
    case 'Média': return "text-amber-400";
    default: return "text-blue-400";
  }
};

export const WeeklyView = ({ tasksData, currentDate }: WeeklyViewProps) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex flex-col h-full w-full overflow-hidden animate-in fade-in duration-700 px-6">
      {/* Header dos Dias */}
      <div className="grid grid-cols-7 gap-4 mb-4 shrink-0">
        {weekDays.map((day) => {
          const isDateToday = isToday(day);
          return (
            <div key={day.toString()} className="flex flex-col items-center py-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">
                {format(day, 'EEE', { locale: ptBR })}
              </span>
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all",
                isDateToday 
                  ? "bg-[#38BDF8] text-black shadow-[0_0_20px_rgba(56,189,248,0.3)]" 
                  : "text-zinc-300 bg-white/5"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid de Tarefas por Turno */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dayName = WEEK_DAYS_MAP[day.getDay()];
            const dayTasks = tasksData[dayName] || [];

            return (
              <div key={day.toString()} className="flex flex-col gap-3">
                {PERIODS.map((period) => {
                  const periodTasks = dayTasks.filter(t => t.period === period.id);
                  const hasTasks = periodTasks.length > 0;
                  const Icon = period.icon;

                  return (
                    <div 
                      key={period.id}
                      className={cn(
                        "group rounded-[20px] border transition-all duration-300 relative overflow-hidden",
                        period.bg,
                        period.border,
                        hasTasks 
                          ? "min-h-[140px] p-3" 
                          : "h-9 p-0 px-3 flex items-center hover:bg-white/[0.05] hover:border-white/20 cursor-pointer"
                      )}
                    >
                      {/* Cabeçalho do Turno */}
                      <div className={cn(
                        "flex items-center gap-2",
                        hasTasks ? "mb-3" : "w-full"
                      )}>
                        <Icon size={hasTasks ? 14 : 12} className={cn(period.color, "shrink-0")} />
                        <span className={cn(
                          "font-black tracking-widest uppercase",
                          hasTasks ? "text-[10px] text-zinc-400" : "text-[8px] text-zinc-500 group-hover:text-zinc-300 transition-colors"
                        )}>
                          {period.label}
                        </span>
                        {!hasTasks && (
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus size={10} className="text-zinc-500" />
                          </div>
                        )}
                      </div>

                      {/* Lista de Tarefas */}
                      {hasTasks && (
                        <div className="space-y-2">
                          {periodTasks.map((task) => (
                            <div 
                              key={task.id}
                              className={cn(
                                "p-3 rounded-2xl flex flex-col gap-2 transition-all hover:scale-[1.02] cursor-grab active:cursor-grabbing bg-gradient-to-b",
                                getTaskGradient(task.period)
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-base filter drop-shadow-sm">{task.icon}</span>
                                <div className="flex items-center gap-1 text-[8px] font-bold text-zinc-400">
                                  <Clock size={8} />
                                  {task.time}
                                </div>
                              </div>
                              <h4 className="text-[11px] font-bold leading-tight line-clamp-2 text-white/90">
                                {task.name}
                              </h4>
                              <div className={cn(
                                "text-[7px] font-black uppercase tracking-widest",
                                getPriorityColor(task.priority)
                              )}>
                                {task.priority}
                              </div>
                            </div>
                          ))}
                          
                          <button className="w-full py-2.5 rounded-xl border border-dashed border-white/5 hover:border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 mt-1">
                            <Plus size={12} />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Novo</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};