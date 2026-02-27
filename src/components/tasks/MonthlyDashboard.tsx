"use client";

import React, { useMemo } from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, Sun, Coffee, Moon, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'day' | 'week' | 'month';

interface MonthlyDashboardProps {
  selectedDate: Date;
  currentDate: Date;
  tasksData: Record<string, any[]>;
  activePriorities: string[];
  activeWeekDays: number[];
  sideViewMode: ViewMode;
  setSideViewMode: (mode: ViewMode) => void;
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

const PRIORITY_WEIGHT: Record<string, number> = {
  'Extrema': 1,
  'Média': 2,
  'Baixa': 3
};

const getPeriodInfo = (period: string) => {
  switch (period) {
    case 'Morning': return { label: 'MANHÃ', icon: Sun, color: 'text-orange-400' };
    case 'Afternoon': return { label: 'TARDE', icon: Coffee, color: 'text-emerald-400' };
    case 'Evening': return { label: 'NOITE', icon: Moon, color: 'text-indigo-400' };
    default: return { label: 'MADRUGADA', icon: Moon, color: 'text-blue-500' };
  }
};

export const MonthlyDashboard = ({ 
  selectedDate, 
  currentDate, 
  tasksData, 
  activePriorities, 
  activeWeekDays,
  sideViewMode,
  setSideViewMode
}: MonthlyDashboardProps) => {

  const sideTasks = useMemo(() => {
    let interval: Date[] = [];
    if (sideViewMode === 'day') {
      interval = [selectedDate];
    } else if (sideViewMode === 'week') {
      interval = eachDayOfInterval({
        start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
        end: endOfWeek(selectedDate, { weekStartsOn: 1 })
      });
    } else {
      interval = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
      });
    }

    const tasks = interval.flatMap(date => {
      const dayOfWeek = getDay(date);
      const dayName = WEEK_DAYS_MAP[dayOfWeek];
      const allTasks = tasksData[dayName] || [];

      return allTasks
        .filter(task => {
          const matchesPriority = activePriorities.length === 0 || activePriorities.includes(task.priority);
          const matchesDay = activeWeekDays.length === 0 || activeWeekDays.includes(dayOfWeek);
          return matchesPriority && matchesDay;
        })
        .map(t => ({ ...t, date }));
    });

    return tasks.sort((a, b) => 
      (PRIORITY_WEIGHT[a.priority] || 99) - (PRIORITY_WEIGHT[b.priority] || 99)
    );
  }, [sideViewMode, selectedDate, currentDate, activePriorities, activeWeekDays, tasksData]);

  const summary = useMemo(() => {
    return {
      total: sideTasks.length,
      extreme: sideTasks.filter(t => t.priority === 'Extrema').length
    };
  }, [sideTasks]);

  return (
    <div className="w-[320px] flex flex-col animate-in slide-in-from-right duration-500 py-2 h-full min-h-0 shrink-0">
      <div 
        className="bg-white/[0.02] border border-white/[0.06] rounded-[16px] flex flex-col h-full shadow-2xl overflow-hidden relative"
      >
        <div className="p-6 pb-5 border-b border-white/5 shrink-0 space-y-6">
          <div className="space-y-3">
            <div className="flex bg-white/[0.04] border border-white/[0.06] p-1 rounded-[10px] w-full">
              {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSideViewMode(mode)}
                  className={cn(
                    "flex-1 px-2 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                    sideViewMode === mode 
                      ? "bg-[#6366f1]/20 text-[#a5b4fc]" 
                      : "text-white/35 hover:text-white/60"
                  )}
                >
                  {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
              {sideViewMode === 'day' ? format(selectedDate, "EEEE", { locale: ptBR }) : 
               sideViewMode === 'week' ? `Semana de ${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "d", { locale: ptBR })}` : 
               format(currentDate, "MMMM", { locale: ptBR })}
            </span>
            <h3 className="text-2xl font-bold text-white truncate leading-none">
              Resumo do Dia
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-[12px] p-4 flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/40">Total</span>
              <span className="text-[28px] font-bold text-white leading-tight">{summary.total}</span>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-[12px] p-4 flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/40">Extrema</span>
              <span className="text-[28px] font-bold text-[#f87171] leading-tight">{summary.extreme}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-32 space-y-4 min-h-0">
          {sideTasks.length > 0 ? (
            sideTasks.map((task, idx) => {
              const period = getPeriodInfo(task.period);
              const PeriodIcon = period.icon;

              return (
                <div 
                  key={`${task.id}-${idx}`}
                  className="group p-4 rounded-[12px] transition-all relative overflow-hidden border border-white/[0.07] bg-white/[0.04] shrink-0"
                >
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <PeriodIcon size={14} className={period.color} />
                        <span className={cn("text-[10px] font-black tracking-widest uppercase", period.color)}>
                          {period.label}
                        </span>
                      </div>
                      {sideViewMode !== 'day' && (
                        <span className="text-[9px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
                          {format(task.date, "dd/MM")}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl shrink-0">{task.icon}</span>
                      <h4 className="text-[15px] font-semibold text-white/90 leading-tight line-clamp-2">
                        {task.name}
                      </h4>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.03]">
                      <div className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                        task.priority === 'Extrema' ? "text-red-500" :
                        task.priority === 'Média' ? "text-amber-500" : 
                        "text-blue-500"
                      )}>
                        {task.priority}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold">
                        <Clock size={11} className="text-zinc-600" />
                        {task.time}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 px-10">
              <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                <Target size={24} className="text-zinc-700" />
              </div>
              <p className="text-sm text-zinc-200 font-medium mb-1">Nenhuma tarefa para este período</p>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Relaxe ou adicione algo novo</p>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 via-black/10 to-transparent pointer-events-none z-20" />
      </div>
    </div>
  );
};