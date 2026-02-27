"use client";

import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Circle, Clock, Check } from 'lucide-react';
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

export const TaskCard = ({ task, isAwaitingTime, onUpdateTime, defaultPeriodTime }: TaskCardProps) => {
  const [tempTime, setTempTime] = useState(task.time || defaultPeriodTime || '09:00');
  const [isPaused, setIsPaused] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: task.id,
    disabled: isAwaitingTime // Desativa drag enquanto ajusta horário
  });

  useEffect(() => {
    if (isAwaitingTime && !isPaused) {
      const timer = setTimeout(() => {
        onUpdateTime?.(tempTime);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAwaitingTime, isPaused, tempTime, onUpdateTime]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
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

        {/* Time Adjust Overlay */}
        {isAwaitingTime && (
          <div 
            className="absolute inset-0 bg-[#0C0C0C]/95 backdrop-blur-sm z-20 flex flex-col p-3 animate-in fade-in zoom-in-95 duration-200"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onPointerDown={(e) => e.stopPropagation()} // Impede drag ao interagir
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock size={12} className="text-[#38BDF8]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Novo Horário</span>
            </div>
            
            <div className="flex gap-2 flex-1 items-center">
              <input 
                type="time" 
                value={tempTime}
                onChange={(e) => setTempTime(e.target.value)}
                className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]/50 [color-scheme:dark]"
              />
              <button 
                onClick={() => onUpdateTime?.(tempTime)}
                className="w-8 h-8 bg-[#38BDF8] text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#38BDF8]/20"
              >
                <Check size={16} strokeWidth={3} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
              <div 
                className={cn("h-full bg-[#38BDF8]/40 origin-left")} 
                style={{ 
                  width: '100%', 
                  animation: isPaused ? 'none' : 'shrink-width 5s linear forwards' 
                }} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};