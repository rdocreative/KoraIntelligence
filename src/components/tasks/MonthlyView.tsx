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
import { Filter } from 'lucide-react';
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

  const fetchMonthlyTasks = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
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
    fetchMonthlyTasks(true); 
  }, [fetchMonthlyTasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const priority = t.prioridade === 'Media' ? 'Média' : t.prioridade;
      const dayOfWeek = getDay(new Date(t.data + 'T12:00:00'));

      const priorityMatch = activePriorities.length === 0 || activePriorities.includes(priority);
      const dayMatch = activeWeekDays.length === 0 || activeWeekDays.includes(dayOfWeek);

      return priorityMatch && dayMatch;
    });
  }, [tasks, activePriorities, activeWeekDays]);

  const tasksByDay = useMemo(() => {
    const map: Record<string, any[]> = {};
    filteredTasks.forEach(task => {
      const dateKey = task.data;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(task);
    });
    return map;
  }, [filteredTasks]);

  const tasksDataForDashboard = useMemo(() => {
    return filteredTasks.reduce((acc: any, t) => {
      const dayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][getDay(new Date(t.data + 'T12:00:00'))];
      if (!acc[dayName]) acc[dayName] = [];
      acc[dayName].push({ id: t.id, name: t.nome, priority: t.prioridade === 'Media' ? 'Média' : t.prioridade, period: t.periodo, time: t.horario, icon: t.emoji });
      return acc;
    }, {});
  }, [filteredTasks]);

  const getPriorityColor = (p: string) => {
    const priority = p === 'Media' || p === 'Média' ? 'Média' : p;
    switch(priority) {
      case 'Extrema': return '#ef4444';
      case 'Média': return '#f97316';
      case 'Baixa': return '#38bdf8';
      default: return '#cbd5e1';
    }
  };

  const getPriorityBorderColor = (p: string) => {
    const priority = p === 'Media' || p === 'Média' ? 'Média' : p;
    switch(priority) {
      case 'Extrema': return 'rgba(239, 68, 68, 0.3)';
      case 'Média': return 'rgba(249, 115, 22, 0.3)';
      case 'Baixa': return 'rgba(56, 189, 248, 0.3)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  };

  const weekDays = [
    { label: 'D', value: 0 },
    { label: 'S', value: 1 },
    { label: 'T', value: 2 },
    { label: 'Q', value: 3 },
    { label: 'Q', value: 4 },
    { label: 'S', value: 5 },
    { label: 'S', value: 6 },
  ];

  const priorities = [
    { label: 'Extrema', value: 'Extrema', activeClass: 'bg-red-500/15 border-red-500/30 text-red-300' },
    { label: 'Média', value: 'Média', activeClass: 'bg-orange-500/15 border-orange-500/30 text-orange-300' },
    { label: 'Baixa', value: 'Baixa', activeClass: 'bg-sky-500/15 border-sky-500/30 text-sky-300' },
  ];

  const handleShowMore = (e: React.MouseEvent, date: Date, tasks: any[]) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPopoverData({
      x: rect.left,
      y: rect.bottom + 8,
      date,
      tasks
    });
  };

  return (
    <div className="flex h-full w-full px-4 relative overflow-hidden">
      {popoverData && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setPopoverData(null)} />
          <div 
            className="fixed z-[9999] bg-[#13151f] border border-white/[0.08] rounded-xl p-3 min-w-[180px] shadow-2xl flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-200"
            style={{ top: popoverData.y, left: popoverData.x }}
          >
            <span className="text-[9px] uppercase font-bold text-white/40 tracking-wider">
              {format(popoverData.date, "dd 'de' MMMM", { locale: ptBR })}
            </span>
            <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto custom-scrollbar">
              {popoverData.tasks.map(t => (
                <div key={t.id} className="flex items-center gap-2 text-[11px] text-zinc-300">
                  <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: getPriorityColor(t.prioridade) }} />
                  <span className="truncate flex-1">{t.nome}</span>
                  <span className="text-[9px] text-white/30 font-mono">{t.horario}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col pr-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-white/20 mr-1" />
            {priorities.map(p => {
              const isActive = activePriorities.includes(p.value);
              return (
                <button
                  key={p.value}
                  onClick={() => setActivePriorities(prev => isActive ? prev.filter(x => x !== p.value) : [...prev, p.value])}
                  className={cn(
                    "px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-all",
                    isActive ? p.activeClass : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:bg-white/[0.05]"
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          
          <div className="w-px h-4 bg-white/[0.06]" />

          <div className="flex items-center gap-1">
            {weekDays.map((d, i) => {
              const isActive = activeWeekDays.includes(d.value);
              return (
                <button
                  key={i}
                  onClick={() => setActiveWeekDays(prev => isActive ? prev.filter(x => x !== d.value) : [...prev, d.value])}
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-medium border transition-all",
                    isActive 
                      ? "bg-[#6366f1]/15 border-[#6366f1]/30 text-[#a5b4fc]" 
                      : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:bg-white/[0.05]"
                  )}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 pb-4 overflow-y-auto custom-scrollbar relative">
          {calendarDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dateTasks = tasksByDay[dateStr] || [];
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            const hiddenCount = dateTasks.length - 3;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "min-h-[90px] p-2 rounded-[16px] border transition-all cursor-pointer flex flex-col group relative",
                  !isCurrentMonth ? "opacity-20 grayscale pointer-events-none" : isSelected ? "bg-white/[0.06] border-white/20" : "bg-white/[0.02] border-white/5 hover:border-white/10",
                  isToday(day) && !isSelected && "border-[#6366f1]/30"
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={cn("text-[12px] font-bold", isToday(day) ? "text-[#6366f1]" : "text-zinc-200/60")}>{format(day, 'd')}</span>
                  {hiddenCount > 0 && isCurrentMonth && (
                     <button 
                       onClick={(e) => handleShowMore(e, day, dateTasks)}
                       className="text-[9px] font-bold text-[#6366f1] hover:text-[#818cf8] transition-colors"
                     >
                       +{hiddenCount}
                     </button>
                  )}
                </div>
                
                <div className="flex flex-col gap-1">
                  {dateTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-1.5 bg-white/[0.03] border rounded-[20px] px-2 py-0.5 w-full truncate"
                      style={{ borderColor: getPriorityBorderColor(task.prioridade) }}
                    >
                      <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: getPriorityColor(task.prioridade) }} />
                      <span className="text-[10px] text-white/80 truncate leading-none">{task.nome}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <MonthlyDashboard selectedDate={selectedDate} currentDate={currentDate} tasksData={tasksDataForDashboard} activePriorities={activePriorities} activeWeekDays={activeWeekDays} sideViewMode={sideViewMode} setSideViewMode={setSideViewMode} />
    </div>
  );
};