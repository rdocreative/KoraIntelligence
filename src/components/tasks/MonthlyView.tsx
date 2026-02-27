"use client";

import React, { useState, useMemo } from 'react';
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
import { Clock, X, Hash, Sun, Coffee, Moon, Filter } from 'lucide-react';
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

const PRIORITIES = ['Extrema', 'Média', 'Baixa'];
const PRIORITY_WEIGHT: Record<string, number> = {
  'Extrema': 1,
  'Média': 2,
  'Baixa': 3
};

const WEEK_DAYS_SHORT = [
  { label: 'D', value: 0 },
  { label: 'S', value: 1 },
  { label: 'T', value: 2 },
  { label: 'Q', value: 3 },
  { label: 'Q', value: 4 },
  { label: 'S', value: 5 },
  { label: 'S', value: 6 }
];

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'Extrema': 
      return "bg-gradient-to-r from-red-500/20 to-red-500/5 border-red-500/30 text-red-200";
    case 'Média': 
      return "bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-200";
    case 'Baixa':
    default: 
      return "bg-gradient-to-r from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-200";
  }
};

const getPeriodGradient = (period: string) => {
  switch (period) {
    case 'Morning':
      return "from-orange-500/[0.08] via-orange-500/[0.02] to-transparent";
    case 'Afternoon':
      return "from-emerald-500/[0.08] via-emerald-500/[0.02] to-transparent";
    case 'Evening':
      return "from-indigo-500/[0.08] via-indigo-500/[0.02] to-transparent";
    default:
      return "from-blue-500/[0.08] via-blue-500/[0.02] to-transparent";
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
    default: return "bg-blue-500";
  }
};

type ViewMode = 'day' | 'week' | 'month';

export const MonthlyView = ({ tasksData, currentDate }: MonthlyViewProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activePriorities, setActivePriorities] = useState<string[]>([]);
  const [activeWeekDays, setActiveWeekDays] = useState<number[]>([]);
  const [sideViewMode, setSideViewMode] = useState<ViewMode>('day');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const togglePriority = (p: string) => {
    setActivePriorities(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const toggleWeekDay = (d: number) => {
    setActiveWeekDays(prev => 
      prev.includes(d) ? prev.filter(item => item !== d) : [...prev, d]
    );
  };

  const getFilteredTasksForDate = (date: Date) => {
    const dayOfWeek = getDay(date);
    const dayName = WEEK_DAYS_MAP[dayOfWeek];
    const allTasks = tasksData[dayName] || [];

    return allTasks.filter(task => {
      const matchesPriority = activePriorities.length === 0 || activePriorities.includes(task.priority);
      const matchesDay = activeWeekDays.length === 0 || activeWeekDays.includes(dayOfWeek);
      return matchesPriority && matchesDay;
    });
  };

  const sideTasks = useMemo(() => {
    let interval: Date[] = [];
    if (sideViewMode === 'day') {
      interval = [selectedDate];
    } else if (sideViewMode === 'week') {
      interval = eachDayOfInterval({
        start: startOfWeek(selectedDate),
        end: endOfWeek(selectedDate)
      });
    } else {
      interval = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
      });
    }

    const tasks = interval.flatMap(date => 
      getFilteredTasksForDate(date).map(t => ({ ...t, date }))
    );

    // Ordenação por prioridade: Extrema (1) -> Média (2) -> Baixa (3)
    return tasks.sort((a, b) => 
      (PRIORITY_WEIGHT[a.priority] || 99) - (PRIORITY_WEIGHT[b.priority] || 99)
    );
  }, [sideViewMode, selectedDate, currentDate, activePriorities, activeWeekDays, tasksData]);

  return (
    <div className="flex h-full w-full max-h-screen animate-in fade-in duration-700 overflow-hidden px-6">
      {/* Grid Principal do Calendário */}
      <div className="flex-1 flex flex-col min-w-0 pr-4 h-full">
        {/* Barra de Filtros Minimalista */}
        <div className="flex items-center gap-6 mb-6 px-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg">
              <Filter size={14} className="text-zinc-500" />
            </div>
            <div className="flex gap-1.5">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  onClick={() => togglePriority(p)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                    activePriorities.includes(p)
                      ? p === 'Extrema' ? "bg-red-500/20 border-red-500/40 text-red-400" :
                        p === 'Média' ? "bg-amber-500/20 border-amber-500/40 text-amber-400" :
                        "bg-blue-500/20 border-blue-500/40 text-blue-400"
                      : "bg-white/[0.02] border-white/5 text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mr-1">Dias</span>
            <div className="flex gap-1">
              {WEEK_DAYS_SHORT.map(d => (
                <button
                  key={d.value}
                  onClick={() => toggleWeekDay(d.value)}
                  className={cn(
                    "w-6 h-6 rounded-md text-[10px] font-bold transition-all border flex items-center justify-center",
                    activeWeekDays.includes(d.value)
                      ? "bg-[#38BDF8]/20 border-[#38BDF8]/40 text-[#38BDF8]"
                      : "bg-white/[0.02] border-white/5 text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {(activePriorities.length > 0 || activeWeekDays.length > 0) && (
            <button 
              onClick={() => { setActivePriorities([]); setActiveWeekDays([]); }}
              className="text-[9px] font-black uppercase tracking-widest text-[#38BDF8] hover:underline ml-auto"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-7 mb-2 shrink-0">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
            <div key={d} className="py-2 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 pb-6 overflow-y-auto custom-scrollbar pr-1">
          {calendarDays.map((day, idx) => {
            const tasks = getFilteredTasksForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isDateToday = isToday(day);

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "aspect-square p-2 rounded-[18px] border transition-all cursor-pointer group flex flex-col relative",
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
                </div>

                <div className="flex-1 space-y-1 overflow-hidden relative z-10">
                  {isCurrentMonth && tasks.slice(0, 2).map((task) => (
                    <div 
                      key={task.id}
                      className={cn(
                        "px-2 py-0.5 rounded-md border flex items-center gap-1.5 transition-transform hover:scale-[1.04] relative z-20",
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
      <div className="w-[320px] flex flex-col animate-in slide-in-from-right duration-500 py-2 h-full min-h-0 shrink-0">
        <div className="bg-white/[0.03] border border-white/10 rounded-[28px] flex flex-col h-full shadow-2xl overflow-hidden">
          <div className="p-6 pb-4 border-b border-white/5 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex bg-white/5 p-1 rounded-xl w-full">
                {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSideViewMode(mode)}
                    className={cn(
                      "flex-1 px-2 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      sideViewMode === mode 
                        ? "bg-[#38BDF8] text-black shadow-lg" 
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1.5">
               <Hash size={12} className="text-[#38BDF8]" />
               <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                {sideViewMode === 'day' ? format(selectedDate, "EEEE", { locale: ptBR }) : 
                 sideViewMode === 'week' ? `Semana de ${format(startOfWeek(selectedDate), "d", { locale: ptBR })}` : 
                 format(currentDate, "MMMM", { locale: ptBR })}
              </span>
            </div>
            <h3 className="text-xl font-serif text-white truncate">
              {sideViewMode === 'day' ? format(selectedDate, "d 'de' MMMM", { locale: ptBR }) : 
               sideViewMode === 'week' ? `Visualização Semanal` : 
               `Resumo do Mês`}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 min-h-0">
            {sideTasks.length > 0 ? (
              sideTasks.map((task, idx) => {
                const period = getPeriodInfo(task.period);
                const PeriodIcon = period.icon;

                return (
                  <div 
                    key={`${task.id}-${idx}`}
                    className={cn(
                      "group p-4 rounded-[24px] transition-all relative overflow-hidden border border-white/5 bg-gradient-to-br bg-zinc-900/40 shrink-0",
                      getPeriodGradient(task.period)
                    )}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <PeriodIcon size={14} className={period.color} />
                          <span className={cn("text-[9px] font-black tracking-widest uppercase", period.color)}>
                            {period.label}
                          </span>
                        </div>
                        {sideViewMode !== 'day' && (
                          <span className="text-[9px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
                            {format(task.date, "dd/MM")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-xl filter drop-shadow-md">{task.icon}</span>
                        <h4 className="text-[14px] font-semibold text-white/95 group-hover:text-white transition-colors leading-tight">
                          {task.name}
                        </h4>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.03]">
                        <div className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                          task.priority === 'Extrema' ? "bg-red-500/10 text-red-500" :
                          task.priority === 'Média' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
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
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em]">Vazio ou Filtrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};