"use client";

import React, { useMemo } from 'react';
import { 
  format, 
  startOfWeek, 
  isSameDay,
  isSameWeek,
  isSameMonth
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, Sun, Coffee, Moon, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'day' | 'week' | 'month';

interface MonthlyDashboardProps {
  selectedDate: Date;
  currentDate: Date;
  tasks: any[];
  sideViewMode: ViewMode;
  setSideViewMode: (mode: ViewMode) => void;
}

const PERIOD_STYLES: Record<string, { background: string, border: string }> = {
  Morning: {
    background: 'linear-gradient(160deg, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0.02) 100%)',
    border: '1px solid rgba(249,115,22,0.12)'
  },
  Afternoon: {
    background: 'linear-gradient(160deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.02) 100%)',
    border: '1px solid rgba(34,197,94,0.12)'
  },
  Evening: {
    background: 'linear-gradient(160deg, rgba(129,140,248,0.1) 0%, rgba(129,140,248,0.02) 100%)',
    border: '1px solid rgba(129,140,248,0.12)'
  },
  Dawn: {
    background: 'linear-gradient(160deg, rgba(56,189,248,0.1) 0%, rgba(56,189,248,0.02) 100%)',
    border: '1px solid rgba(56,189,248,0.12)'
  }
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
  tasks,
  sideViewMode,
  setSideViewMode
}: MonthlyDashboardProps) => {

  const sideTasks = useMemo(() => {
    const filtered = tasks.filter(task => {
      const taskDate = new Date(task.data + 'T12:00:00');
      if (sideViewMode === 'day') return isSameDay(taskDate, selectedDate);
      if (sideViewMode === 'week') return isSameWeek(taskDate, selectedDate, { weekStartsOn: 0 });
      return isSameMonth(taskDate, currentDate);
    });

    // Ordenação consistente com normalização
    const peso: Record<string, number> = { 'Extrema': 0, 'Alta': 1, 'Média': 2, 'Media': 2, 'Baixa': 3 };
    const normalize = (s: string) => s ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

    return filtered.sort((a, b) => {
      const pA = normalize(a.prioridade || a.priority);
      const pB = normalize(b.prioridade || b.priority);
      return (peso[pA] ?? 99) - (peso[pB] ?? 99);
    });
  }, [tasks, sideViewMode, selectedDate, currentDate]);

  const totalTasks = sideTasks.length;
  const extremeTasks = sideTasks.filter(t => (t.prioridade || t.priority) === 'Extrema').length;

  return (
    <div className="w-[320px] flex flex-col animate-in slide-in-from-right duration-500 py-2 h-full min-h-0 shrink-0">
      <div 
        className="rounded-[32px] flex flex-col h-full shadow-2xl overflow-hidden relative"
        style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.06)' 
        }}
      >
        <div className="p-6 pb-5 border-b border-white/5 shrink-0 space-y-5">
          <div className="space-y-3">
            <div className="flex bg-white/5 p-1 rounded-xl w-full">
              {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSideViewMode(mode)}
                  className={cn(
                    "flex-1 px-2 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                    sideViewMode === mode 
                      ? "bg-[#6366f1] text-white shadow-lg" 
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">
                {sideViewMode === 'day' ? format(selectedDate, "EEEE", { locale: ptBR }) : 
                 sideViewMode === 'week' ? `Semana de ${format(startOfWeek(selectedDate, { weekStartsOn: 0 }), "d 'de' MMM", { locale: ptBR })}` : 
                 format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white truncate leading-none">
              Resumo do {sideViewMode === 'day' ? 'Dia' : sideViewMode === 'week' ? 'Período' : 'Mês'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-zinc-500">
                <Target size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Total</span>
              </div>
              <span className="text-xl font-black text-white">{totalTasks}</span>
            </div>
            <div className="bg-red-500/[0.03] border border-red-500/10 rounded-2xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-red-500/70">
                <Zap size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Extrema</span>
              </div>
              <span className="text-xl font-black text-red-500">{extremeTasks}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-32 space-y-4 min-h-0">
          {sideTasks.length > 0 ? (
            sideTasks.map((task, idx) => {
              const periodInfo = getPeriodInfo(task.periodo || task.period);
              const PeriodIcon = periodInfo.icon;
              const styles = PERIOD_STYLES[task.periodo || task.period] || PERIOD_STYLES.Dawn;

              return (
                <div 
                  key={`${task.id}-${idx}`}
                  className="group p-5 rounded-[12px] transition-all relative overflow-hidden bg-zinc-950/40 shrink-0 min-h-[130px]"
                  style={{
                    background: styles.background,
                    border: styles.border
                  }}
                >
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <PeriodIcon size={14} className={periodInfo.color} />
                        <span className={cn("text-[10px] font-black tracking-widest uppercase", periodInfo.color)}>
                          {periodInfo.label}
                        </span>
                      </div>
                      {sideViewMode !== 'day' && (
                        <span className="text-[9px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
                          {format(new Date(task.data + 'T12:00:00'), "dd/MM")}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl filter drop-shadow-md shrink-0">{task.emoji || task.icon}</span>
                      <h4 className="text-[15px] font-bold text-white/95 group-hover:text-white transition-colors leading-tight line-clamp-2">
                        {task.nome || task.name}
                      </h4>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.03]">
                      <div className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                        (task.prioridade || task.priority) === 'Extrema' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        (task.prioridade || task.priority) === 'Média' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                        "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      )}>
                        {task.prioridade || task.priority}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-bold">
                        <Clock size={12} className="text-zinc-600" />
                        {task.horario || task.time}
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

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent pointer-events-none z-20" />
      </div>
    </div>
  );
};