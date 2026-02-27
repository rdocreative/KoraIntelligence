"use client";

import React, { useState, useMemo } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
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
import { cn } from '@/lib/utils';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasksData: Record<string, any[]>;
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

export const CalendarModal = ({ isOpen, onClose, tasksData }: CalendarModalProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (!isOpen) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Get tasks for a specific date based on week day name (using mock logic)
  const getTasksForDate = (date: Date) => {
    const dayName = WEEK_DAYS_MAP[getDay(date)];
    return tasksData[dayName] || [];
  };

  const selectedDayTasks = getTasksForDate(selectedDate);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-5xl bg-[#0C0C0C] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px] animate-in zoom-in-95 fade-in duration-300">
        
        {/* Lado Esquerdo: Calendário */}
        <div className="flex-1 p-8 border-r border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <CalendarIcon className="text-[#38BDF8]" size={24} />
              <h2 className="text-2xl font-serif font-medium text-white capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={prevMonth}
                className="p-2 hover:bg-white/5 rounded-full text-zinc-400 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 hover:bg-white/5 rounded-full text-zinc-400 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
              <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-500 pb-2">
                {d}
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-7 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {calendarDays.map((day, idx) => {
              const tasks = getTasksForDate(day);
              const hasTasks = tasks.length > 0;
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, monthStart);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative h-full min-h-[70px] flex flex-col items-center justify-center transition-all group",
                    isCurrentMonth ? "bg-[#0C0C0C]" : "bg-[#080808] opacity-30",
                    isSelected && "bg-white/[0.03]"
                  )}
                >
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-[#38BDF8]/30 rounded-none pointer-events-none" />
                  )}
                  
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    isToday(day) ? "text-[#38BDF8] font-bold" : "text-zinc-400",
                    isSelected && "text-white scale-110",
                    !isCurrentMonth && "text-zinc-600"
                  )}>
                    {format(day, 'd')}
                  </span>

                  {hasTasks && isCurrentMonth && (
                    <div className="mt-1.5 flex gap-0.5">
                      {tasks.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-[#38BDF8]" />
                      ))}
                      {tasks.length > 3 && (
                        <div className="w-1 h-1 rounded-full bg-zinc-500" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lado Direito: Tarefas do Dia Selecionado */}
        <div className="w-full md:w-[350px] bg-white/[0.02] p-8 flex flex-col">
          <div className="mb-6">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#38BDF8] mb-1">
              {format(selectedDate, "EEEE", { locale: ptBR })}
            </div>
            <h3 className="text-xl font-serif text-white">
              {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {selectedDayTasks.length > 0 ? (
              selectedDayTasks.map((task) => (
                <div 
                  key={task.id}
                  className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{task.icon}</span>
                    <h4 className="text-sm font-medium text-white group-hover:text-[#38BDF8] transition-colors">{task.name}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500">
                    <div className="flex items-center gap-1 text-[10px]">
                      <Clock size={12} />
                      {task.time}
                    </div>
                    <div className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                      task.priority === 'Extrema' ? "bg-red-500/10 text-red-400" :
                      task.priority === 'Média' ? "bg-orange-500/10 text-orange-400" :
                      "bg-sky-500/10 text-sky-400"
                    )}>
                      {task.priority}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                <div className="w-12 h-12 rounded-2xl border border-dashed border-white/20 flex items-center justify-center mb-4">
                  <X size={20} className="text-zinc-500" />
                </div>
                <p className="text-xs text-zinc-400">Nenhuma tarefa<br/>para este dia</p>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};