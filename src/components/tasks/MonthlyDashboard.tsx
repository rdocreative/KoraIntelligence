"use client";

import React from 'react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar as CalendarIcon,
  TrendingUp,
  Target
} from 'lucide-react';

interface MonthlyDashboardProps {
  selectedDate: Date;
  currentDate: Date;
  tasksData: Record<string, any[]>;
  activePriorities: string[];
  activeWeekDays: number[];
  sideViewMode: 'day' | 'week' | 'month';
  setSideViewMode: (mode: 'day' | 'week' | 'month') => void;
}

export const MonthlyDashboard = ({ 
  selectedDate, 
  currentDate, 
  tasksData,
  sideViewMode,
  setSideViewMode
}: MonthlyDashboardProps) => {
  const dayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][selectedDate.getDay()];
  const dayTasks = tasksData[dayName] || [];

  const stats = [
    { label: 'Concluídas', value: '12', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Pendentes', value: '05', icon: Circle, color: 'text-amber-400' },
    { label: 'Tempo Focado', value: '4.2h', icon: Clock, color: 'text-sky-400' },
  ];

  return (
    <aside className="w-[320px] h-full flex flex-col gap-5 p-5 bg-white/[0.02] border-l border-white/[0.05] overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Resumo do Dia</span>
        <h3 className="text-lg font-semibold text-white">
          {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
              <stat.icon size={16} />
            </div>
            <div>
              <p className="text-[10px] text-white/30 font-medium uppercase">{stat.label}</p>
              <p className="text-sm font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Tarefas Planejadas</span>
          <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-white/40">{dayTasks.length}</span>
        </div>
        
        <div className="flex flex-col gap-2">
          {dayTasks.length > 0 ? (
            dayTasks.map((task) => (
              <div 
                key={task.id}
                className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] rounded-xl p-3 flex items-center gap-3 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm">
                  {task.icon || '📝'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white truncate group-hover:text-[#6366f1] transition-colors">{task.name}</p>
                  <p className="text-[10px] text-white/30 flex items-center gap-1">
                    <Clock size={10} /> {task.time} • {task.priority}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center px-4">
              <CalendarIcon size={24} className="text-white/10 mb-2" />
              <p className="text-xs text-white/30 font-medium">Nenhuma tarefa para este dia</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/[0.05]">
        <div className="bg-gradient-to-br from-[#6366f1]/10 to-transparent border border-[#6366f1]/20 rounded-2xl p-4 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-[#6366f1]" />
              <span className="text-[10px] font-bold text-[#6366f1] uppercase">Meta Semanal</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed mb-3">Você completou <span className="text-white font-bold">85%</span> das tarefas planejadas para esta semana.</p>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#6366f1] w-[85%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </div>
          </div>
          <Target className="absolute -bottom-2 -right-2 text-white/[0.03] rotate-12 transition-transform group-hover:scale-110" size={80} />
        </div>
      </div>
    </aside>
  );
};