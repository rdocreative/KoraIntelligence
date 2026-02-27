"use client";

import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Circle, Clock, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: {
    id: string;
    name: string;
    time?: string;
    icon?: string;
    priority?: 'Extrema' | 'Média' | 'Baixa';
    period?: string;
  };
  isAwaitingTime?: boolean;
  onUpdateTime?: (newTime: string) => void;
  defaultPeriodTime?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

export const TaskCard = ({ task, isAwaitingTime, onUpdateTime, defaultPeriodTime }: TaskCardProps) => {
  const initialTime = task.time || defaultPeriodTime || '09:00';
  const [hour, setHour] = useState(initialTime.split(':')[0] || '09');
  const [minute, setMinute] = useState(initialTime.split(':')[1] || '00');

  // Reset local state if task time changes or when overlay appears
  useEffect(() => {
    if (isAwaitingTime) {
      const currentTime = task.time || defaultPeriodTime || '09:00';
      setHour(currentTime.split(':')[0]);
      setMinute(currentTime.split(':')[1]);
    }
  }, [isAwaitingTime, task.time, defaultPeriodTime]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: task.id,
    disabled: isAwaitingTime 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none', // Impede o scroll do navegador durante o toque/arrasto
  };

  const priorityColors = {
    Extrema: 'bg-red-500/20 text-red-400 border-red-500/30',
    Média: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Baixa: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  const cardPriorityStyles = {
    Extrema: 'bg-red-500/[0.04] border-red-500/10 hover:border-red-500/30',
    Média: 'bg-orange-500/[0.04] border-orange-500/10 hover:border-orange-500/30',
    Baixa: 'bg-blue-500/[0.04] border-blue-500/10 hover:border-blue-500/30',
  };

  const currentCardStyle = task.priority ? cardPriorityStyles[task.priority] : 'bg-white/[0.03] border-white/5 hover:border-white/10';

  const handleConfirm = () => {
    onUpdateTime?.(`${hour}:${minute}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-draggable="true" // Permite que o container pai ignore o scroll horizontal ao clicar aqui
      className="relative group/card"
    >
      <div
        className={cn(
          "group relative flex flex-col p-4 rounded-[20px] border transition-all cursor-grab active:cursor-grabbing overflow-hidden min-h-[90px]",
          currentCardStyle,
          isDragging && "z-50 border-[#38BDF8]/50 shadow-2xl bg-white/[0.08]"
        )}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center text-lg">
              {task.icon || '📝'}
            </div>
            <h4 className="text-sm font-semibold text-zinc-100 line-clamp-1">{task.name}</h4>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-3">
            {task.priority && (
              <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border", priorityColors[task.priority])}>
                {task.priority}
              </span>
            )}
            {task.time && !isAwaitingTime && (
              <div className="flex items-center gap-1 text-[10px] text-zinc-300 font-medium">
                <Clock size={10} className="text-zinc-400" />
                {task.time}
              </div>
            )}
          </div>
          <Circle size={16} className="text-zinc-500 hover:text-zinc-200 transition-colors" />
        </div>

        {/* Time Adjust Overlay - Now with custom selects */}
        {isAwaitingTime && (
          <div 
            className="absolute inset-0 bg-[#0C0C0C]/95 backdrop-blur-md z-20 flex flex-col p-4 animate-in fade-in zoom-in-95 duration-200 rounded-[20px]"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock size={12} className="text-[#38BDF8]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Novo Horário</span>
            </div>
            
            <div className="flex gap-2 flex-1 items-center">
              <div className="flex-1 flex gap-1.5 h-10">
                {/* Hour Select */}
                <div className="relative flex-1">
                  <select 
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="w-full h-full bg-white/[0.05] border border-white/10 rounded-xl px-2 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-[#38BDF8]/50 transition-all text-center"
                  >
                    {HOURS.map(h => (
                      <option key={h} value={h} className="bg-[#0C0C0C]">{h}</option>
                    ))}
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>

                <span className="text-zinc-600 flex items-center">:</span>

                {/* Minute Select */}
                <div className="relative flex-1">
                  <select 
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="w-full h-full bg-white/[0.05] border border-white/10 rounded-xl px-2 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-[#38BDF8]/50 transition-all text-center"
                  >
                    {MINUTES.map(m => (
                      <option key={m} value={m} className="bg-[#0C0C0C]">{m}</option>
                    ))}
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                className="w-10 h-10 bg-[#38BDF8] text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#38BDF8]/20 shrink-0"
              >
                <Check size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};