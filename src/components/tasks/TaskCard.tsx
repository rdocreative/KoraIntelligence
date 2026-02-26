"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: {
    id: string;
    name: string;
    time?: string;
    duration?: number; // em minutos
    icon?: string;
    priority?: 'Extrema' | 'Média' | 'Baixa';
    period?: string;
  };
  isOverlay?: boolean;
  targetColor?: string;
}

const PERIOD_COLORS: Record<string, string> = {
  Morning: '#FDBA74',
  Afternoon: '#4ADE80',
  Evening: '#A78BFA',
  Dawn: '#818CF8',
  Anytime: '#94A3B8'
};

export const TaskCard = ({ task, isOverlay, targetColor }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  // Cálculo de altura baseada na duração (mínimo 60px, escala de 1.5px por minuto)
  const dynamicHeight = task.duration ? Math.max(70, task.duration * 1.2) : 80;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: `${dynamicHeight}px`,
    opacity: isDragging ? 0.2 : 1,
    borderColor: isOverlay && targetColor ? `${targetColor}40` : undefined,
    boxShadow: isOverlay && targetColor ? `0 0 20px ${targetColor}20` : undefined,
  };

  const priorityColors = {
    Extrema: 'bg-red-500/20 text-red-400 border-red-500/30',
    Média: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Baixa: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  };

  const currentColor = targetColor || (task.period ? PERIOD_COLORS[task.period] : '#ffffff');

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group flex flex-col p-4 rounded-[24px] bg-[#1A1A20]/60 border border-white/5 transition-all cursor-grab active:cursor-grabbing relative overflow-hidden",
        isDragging && "z-50",
        isOverlay && "scale-105 border-white/20 bg-[#1A1A20]/90"
      )}
    >
      {/* Glow lateral baseado no período/contexto */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300"
        style={{ backgroundColor: currentColor }}
      />

      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg shrink-0">
            {task.icon || '📝'}
          </div>
          <h4 className="text-sm font-semibold text-zinc-200 line-clamp-2 leading-tight">{task.name}</h4>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/[0.02]">
        <div className="flex items-center gap-2">
          {task.priority && (
            <span className={cn("text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0", priorityColors[task.priority])}>
              {task.priority}
            </span>
          )}
          {task.duration && (
            <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-medium">
              <Clock size={10} />
              {task.duration >= 60 ? `${Math.floor(task.duration / 60)}h${task.duration % 60 || ''}` : `${task.duration}m`}
            </div>
          )}
        </div>
        <Circle size={14} className="text-zinc-700 hover:text-zinc-400 transition-colors shrink-0" />
      </div>
    </div>
  );
};