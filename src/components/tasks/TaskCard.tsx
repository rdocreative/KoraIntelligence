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

const PERIOD_GRADIENTS: Record<string, string> = {
  Morning: 'from-orange-500/[0.08] via-orange-500/[0.02] to-transparent',
  Afternoon: 'from-emerald-500/[0.08] via-emerald-500/[0.02] to-transparent',
  Evening: 'from-indigo-500/[0.08] via-indigo-500/[0.02] to-transparent',
  Dawn: 'from-blue-600/[0.08] via-blue-600/[0.02] to-transparent',
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
  };

  const priorityColors = {
    Extrema: 'bg-red-500/20 text-red-400 border-red-500/30',
    Média: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Baixa: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  };

  const currentGradient = task.period ? PERIOD_GRADIENTS[task.period] : 'bg-white/[0.03]';

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
          "group relative flex flex-col p-4 rounded-[20px] border border-white/5 hover:border-white/10 transition-all cursor-grab active:cursor-grabbing overflow-hidden bg-gradient-to-b",
          currentGradient,
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
    </div>
  );
};