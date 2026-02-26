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
  };
}

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

  const accentColors = {
    Extrema: 'border-red-500/85',
    Média: 'border-orange-500/85',
    Baixa: 'border-sky-500/85',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative flex flex-col p-4 rounded-[20px] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all cursor-grab active:cursor-grabbing overflow-hidden",
        isDragging && "z-50 border-[#38BDF8]/50 shadow-2xl bg-white/[0.08]"
      )}
    >
      {/* Destaque de prioridade sobrepondo a borda com mais intensidade */}
      {task.priority && (
        <div 
          className={cn(
            "absolute -bottom-[1px] -left-[1px] w-16 h-16 border-l-[2.5px] border-b-[2.5px] border-transparent rounded-bl-[20px] pointer-events-none z-20",
            accentColors[task.priority]
          )}
          style={{ 
            maskImage: 'linear-gradient(to top right, black 20%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to top right, black 20%, transparent 70%)'
          }}
        />
      )}

      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">
            {task.icon || '📝'}
          </div>
          <h4 className="text-sm font-semibold text-zinc-200 line-clamp-1">{task.name}</h4>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/[0.02] relative z-10">
        <div className="flex items-center gap-3">
          {task.priority && (
            <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border", priorityColors[task.priority])}>
              {task.priority}
            </span>
          )}
          {task.time && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
              <Clock size={10} />
              {task.time}
            </div>
          )}
        </div>
        <Circle size={16} className="text-zinc-700 hover:text-zinc-400 transition-colors" />
      </div>
    </div>
  );
};