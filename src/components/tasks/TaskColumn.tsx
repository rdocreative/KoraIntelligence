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
    icon?: string;
    priority?: 'Extrema' | 'Média' | 'Baixa';
    period?: string;
  };
}

const periodGradients: Record<string, string> = {
  Morning:   'linear-gradient(180deg, rgba(253,186,116,0.12) 0%, rgba(253,186,116,0.03) 100%)',
  Afternoon: 'linear-gradient(180deg, rgba(74,222,128,0.12) 0%, rgba(74,222,128,0.03) 100%)',
  Evening:   'linear-gradient(180deg, rgba(167,139,250,0.12) 0%, rgba(167,139,250,0.03) 100%)',
  Dawn:      'linear-gradient(180deg, rgba(129,140,248,0.12) 0%, rgba(129,140,248,0.03) 100%)',
};

const priorityColors: Record<string, string> = {
  Extrema: 'bg-red-500/20 text-red-400 border-red-500/30',
  Média:   'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Baixa:   'bg-sky-500/20 text-sky-400 border-sky-500/30',
};

export const TaskCard = ({ task }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    background: isDragging ? 'rgba(255,255,255,0.08)' : (task.period ? periodGradients[task.period] : 'rgba(255,255,255,0.03)'),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative flex flex-col p-4 rounded-[20px] border-0 transition-all cursor-grab active:cursor-grabbing overflow-hidden",
        isDragging && "z-50 shadow-2xl"
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
          {task.time && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-300 font-medium">
              <Clock size={10} className="text-zinc-400" />
              {task.time}
            </div>
          )}
        </div>
        <Circle size={16} className="text-zinc-500 hover:text-zinc-200 transition-colors" />
      </div>
    </div>
  );
};