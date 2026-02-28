"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { Filter, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MonthlyDashboard } from './MonthlyDashboard';
import { supabase } from "@/integrations/supabase/client";

export const MonthlyView = ({ currentDate }: { currentDate: Date }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activePriorities, setActivePriorities] = useState<string[]>([]);
  const [activeWeekDays, setActiveWeekDays] = useState<number[]>([]);
  const [sideViewMode, setSideViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [isLoading, setIsLoading] = useState(true);

  const [popoverData, setPopoverData] = useState<{
    x: number;
    y: number;
    date: Date;
    tasks: any[];
  } | null>(null);

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const calendarDays = useMemo(() => eachDayOfInterval({ start: startDate, end: endDate }), [startDate, endDate]);

  const fetchMonthlyTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .gte('data', format(startDate, 'yyyy-MM-dd'))
        .lte('data', format(endDate, 'yyyy-MM-dd'));

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => { 
    fetchMonthlyTasks(); 
  }, [fetchMonthlyTasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const priority = t.prioridade === 'Media' ? 'Média' : t.prioridade;
      const d = new Date(t.data + 'T12:00:00');
      const dayOfWeek = getDay(d);

      const priorityMatch = activePriorities.length === 0 || activePriorities.includes(priority);
      const dayMatch = activeWeekDays.length === 0 || activeWeekDays.includes(dayOfWeek);

      return priorityMatch && dayMatch;
    });
  }, [tasks, activePriorities, activeWeekDays]);

  // Dashboard logic: needs mapping by day name
  const tasksDataForDashboard = useMemo(() => {
    return filteredTasks.reduce((acc: any, t) => {
      const d = new Date(t.data + 'T12:00:00');
      const dayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][getDay(d)];
      if (!acc[dayName]) acc[dayName] = [];
      acc[dayName].push({ id: t.id, name: t.nome, priority: t.prioridade === 'Media' ? 'Média' : t.prioridade, period: t.periodo, time: t.horario, icon: t.emoji, date: t.data });
      return acc;
    }, {});
  }, [filteredTasks]);

  const getPriorityColor = (p: string) => {
    const priority = p === 'Media' || p === 'Média' ? 'Média' : p;
    switch(priority) {
      case 'Extrema': return '#ef4444';
      case 'Média': return '#f97316';
      case 'Baixa': return '#38bdf8';
      default: return '#64748b';
    }
  };

  const weekDaysLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const priorities = [
    { label: 'Extrema', value: 'Extrema', activeClass: 'bg-red-500/10 border-red-500/20 text-red-400' },
    { label: 'Média', value: 'Média', activeClass: 'bg-orange-500/10 border-orange-500/20 text-orange-400' },
    { label: 'Baixa', value: 'Baixa', activeClass: 'bg-sky-500/10 border-sky-500/20 text-sky-400' },
  ];

  return (
    <div className="flex h-full w-full relative overflow-hidden">
      <div className="flex-1 flex flex-col pr-2">
        <div className="flex items-center gap-3 mb-2 px-1">
          <div className="flex items-center gap-1">
            {priorities.map(p => {
              const isActive = activePriorities.includes(p.value);
              return (
                <button
                  key={p.value}
                  onClick={() => setActivePriorities(prev => isActive ? prev.filter(x => x !== p.value) : [...prev, p.value])}
                  className={cn(
                    "px-2 py-0.5 rounded-md text-[9px] font-bold border transition-all",
                    isActive ? p.activeClass : "bg-white/[0.02] border-white/[0.05] text-white/30 hover:bg-white/[0.04]"
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <div className="w-px h-3 bg-white/[0.05]" />
          <div className="flex items-center gap-1">
            {weekDaysLabels.map((d, i) => {
              const isActive = activeWeekDays.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => setActiveWeekDays(prev => isActive ? prev.filter(x => x !== i) : [...prev, i])}
                  className={cn(
                    "w-5 h-5 flex items-center justify-center rounded-md text-[9px] font-bold border transition-all",
                    isActive 
                      ? "bg-[#6366f1]/10 border-[#6366f1]/20 text-[#a5b4fc]" 
                      : "bg-white/[0.02] border-white/[0.05] text-white/30 hover:bg-white/[0.04]"
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#6366f1]/40" size={24} />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1 pb-4 overflow-y-auto custom-scrollbar">
            {calendarDays.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dateTasks = filteredTasks.filter(t => t.data === dateStr);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "min-h-[85px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col relative",
                    !isCurrentMonth ? "opacity-10 grayscale pointer-events-none" : isSelected ? "bg-white/[0.05] border-white/10" : "bg-white/[0.01] border-white/5 hover:border-white/10",
                    isToday(day) && !isSelected && "border-[#6366f1]/20"
                  )}
                >
                  <span className={cn(
                    "text-[11px] font-bold mb-1", 
                    isToday(day) ? "text-[#6366f1]" : "text-white/40"
                  )}>
                    {format(day, 'd')}
                  </span>
                  
                  <div className="flex flex-col gap-1 overflow-hidden">
                    {dateTasks.slice(0, 2).map((task) => (
                      <div key={task.id} className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.05] truncate">
                        <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: getPriorityColor(task.prioridade) }} />
                        <span className="text-[9px] text-white/60 truncate leading-none font-medium">{task.nome}</span>
                      </div>
                    ))}
                    {dateTasks.length > 2 && (
                      <span className="text-[8px] font-bold text-white/20 pl-1">+{dateTasks.length - 2} mais</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <MonthlyDashboard 
        selectedDate={selectedDate} 
        currentDate={currentDate} 
        tasksData={tasksDataForDashboard} 
        activePriorities={activePriorities} 
        activeWeekDays={activeWeekDays} 
        sideViewMode={sideViewMode} 
        setSideViewMode={setSideViewMode} 
      />
    </div>
  );
};