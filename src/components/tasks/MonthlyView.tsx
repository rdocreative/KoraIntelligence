"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
import { X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MonthlyDashboard } from './MonthlyDashboard';
import { supabase } from "@/lib/supabase";

export const MonthlyView = ({ currentDate }: { currentDate: Date }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedDate, setExpandedDate] = useState<Date | null>(null);
  const [popoverPos, setPopoverPos] = useState<any>(null);
  const [activePriorities, setActivePriorities] = useState<string[]>([]);
  const [activeWeekDays, setActiveWeekDays] = useState<number[]>([]);
  const [sideViewMode, setSideViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [isLoading, setIsLoading] = useState(true);

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

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
  }, [currentDate]);

  useEffect(() => { fetchMonthlyTasks(); }, [fetchMonthlyTasks]);

  const tasksDataForDashboard = tasks.reduce((acc: any, t) => {
    const dayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][getDay(new Date(t.data + 'T12:00:00'))];
    if (!acc[dayName]) acc[dayName] = [];
    acc[dayName].push({ id: t.id, name: t.nome, priority: t.prioridade === 'Media' ? 'Média' : t.prioridade, period: t.periodo, time: t.horario, icon: t.emoji });
    return acc;
  }, {});

  return (
    <div className="flex h-full w-full px-6 relative overflow-hidden">
      <div className="flex-1 flex flex-col pr-4">
        {/* Header e Grid simplificados para brevidade, mantendo lógica Supabase */}
        <div className="grid grid-cols-7 gap-2 pb-6 overflow-y-auto custom-scrollbar relative">
          {calendarDays.map((day, idx) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dateTasks = tasks.filter(t => t.data === dateStr);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "min-h-[170px] p-2.5 rounded-[22px] border transition-all cursor-pointer flex flex-col",
                  !isCurrentMonth ? "opacity-5 pointer-events-none" : isSelected ? "bg-white/[0.06] border-white/20" : "bg-white/[0.02] border-white/5",
                  isToday(day) && !isSelected && "border-[#6366f1]/40"
                )}
              >
                <span className={cn("text-sm font-bold mb-2", isToday(day) ? "text-[#6366f1]" : "text-zinc-200")}>{format(day, 'd')}</span>
                <div className="space-y-1">
                  {isLoading ? <div className="h-1 bg-white/5 animate-pulse rounded" /> : 
                    dateTasks.slice(0, 4).map(t => (
                      <div key={t.id} className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] truncate">{t.nome}</div>
                    ))
                  }
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