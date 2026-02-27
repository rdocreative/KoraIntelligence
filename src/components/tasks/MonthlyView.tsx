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
import { X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MonthlyDashboard } from './MonthlyDashboard';

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
    case 'Extrema': return "bg-gradient-to-r from-red-500/20 to-red-500/5 border-red-500/30 text-red-200";
    case 'Média': return "bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-200";
    default: return "bg-gradient-to-r from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-200";
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
  const [expandedDate, setExpandedDate] = useState<Date | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number, left: number, width: number } | null>(null);
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

  const handleOpenPopover = (e: React.MouseEvent, day: Date) => {
    const rect = (e.currentTarget.closest('.calendar-cell') as HTMLElement).getBoundingClientRect();
    setPopoverPos({
      top: rect.top,
      left: rect.left,
      width: rect.width
    });
    setExpandedDate(day);
  };

  return (
    <div className="flex h-full w-full max-h-screen animate-in fade-in duration-700 overflow-hidden px-6 relative">
      <div className="flex-1 flex flex-col min-w-0 pr-4 h-full">
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
                      ? "bg-[#6366f1]/20 border-[#6366f1]/40 text-[#6366f1]"
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
              className="text-[9px] font-black uppercase tracking-widest text-[#6366f1] hover:underline ml-auto"
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

        <div className="grid grid-cols-7 gap-2 pb-6 overflow-y-auto custom-scrollbar pr-1 relative">
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
                  "calendar-cell min-h-[170px] p-2.5 rounded-[22px] border transition-all cursor-pointer group flex flex-col relative",
                  !isCurrentMonth ? "bg-transparent border-transparent opacity-5 pointer-events-none" : 
                  isSelected ? "bg-white/[0.06] border-white/20 shadow-lg" : "bg-white/[0.02] border-white/5 hover:border-white/10",
                  isDateToday && !isSelected && "border-[#6366f1]/40"
                )}
              >
                <div className="flex justify-between items-center mb-2 px-0.5">
                  <span className={cn(
                    "text-sm font-bold transition-all",
                    isDateToday ? "text-[#6366f1]" : "text-zinc-200 group-hover:text-white",
                    isSelected && "text-white"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>

                <div className="flex-1 space-y-1 relative z-10">
                  {isCurrentMonth && tasks.slice(0, 4).map((task) => (
                    <div 
                      key={task.id}
                      className={cn(
                        "px-2 py-0.5 rounded-md border flex items-center gap-1.5 transition-transform hover:scale-[1.04] relative z-20",
                        getPriorityStyles(task.priority)
                      )}
                    >
                      <div className={cn("w-1 h-1 rounded-full shrink-0", getPriorityDot(task.priority))} />
                      <span className="text-[8px] font-medium truncate">
                        {task.name}
                      </span>
                    </div>
                  ))}
                  {tasks.length > 4 && isCurrentMonth && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPopover(e, day);
                      }}
                      className="w-full text-left text-[8px] font-black text-zinc-500 pl-1 hover:text-[#6366f1] transition-colors mt-0.5"
                    >
                      + {tasks.length - 4} itens
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MonthlyDashboard 
        selectedDate={selectedDate}
        currentDate={currentDate}
        tasksData={tasksData}
        activePriorities={activePriorities}
        activeWeekDays={activeWeekDays}
        sideViewMode={sideViewMode}
        setSideViewMode={setSideViewMode}
      />

      <AnimatePresence>
        {expandedDate && popoverPos && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-[2px]" 
            onClick={() => { setExpandedDate(null); setPopoverPos(null); }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                position: 'fixed',
                top: popoverPos.top - 20, 
                left: popoverPos.left,
                width: popoverPos.width,
              }}
              className="bg-zinc-900 border border-white/20 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-[101] min-h-[170px]"
            >
              <div className="p-4 pb-2 flex items-center justify-between border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6366f1]">
                  {format(expandedDate, 'd MMM', { locale: ptBR })}
                </span>
                <button 
                  onClick={() => { setExpandedDate(null); setPopoverPos(null); }}
                  className="p-1 rounded-full hover:bg-white/5 text-zinc-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5 max-h-[300px]">
                {getFilteredTasksForDate(expandedDate).map((task) => (
                  <div 
                    key={task.id}
                    className={cn(
                      "px-2 py-1.5 rounded-xl border flex items-center gap-2 transition-all group",
                      getPriorityStyles(task.priority)
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", getPriorityDot(task.priority))} />
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-[10px] font-bold text-white truncate leading-tight">
                        {task.name}
                      </h4>
                      <span className="text-[8px] text-zinc-400 font-medium">
                        {task.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};