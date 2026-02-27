"use client";

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, MoreVertical, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: {
    id: string;
    name: string;
    priority: string;
    time: string;
    icon: string;
    period: string;
  };
  isAwaitingTime?: boolean;
  onUpdateTime?: (newTime: string) => void;
  onUpdateTask?: (taskId: string, updates: any) => void;
  defaultPeriodTime?: string;
}

export const TaskCard = ({ task, isAwaitingTime, onUpdateTime, onUpdateTask, defaultPeriodTime }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(isAwaitingTime);
  const [editedTime, setEditedTime] = useState(task.time || defaultPeriodTime || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    borderRadius: '12px'
  };

  const priorityColors: Record<string, string> = {
    'Extrema': 'text-red-400',
    'Média': 'text-amber-400',
    'Baixa': 'text-blue-400',
  };

  const handleTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTime?.(editedTime);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-white/[0.04] border border-white/[0.08] p-4 transition-all hover:bg-white/[0.07] hover:border-white/15",
        isAwaitingTime && "ring-2 ring-[#6366f1]/50 bg-[#6366f1]/5"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl shrink-0 filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
          {task.icon}
        </span>
        <h4 className="text-[14px] font-semibold text-white/90 leading-tight flex-1">
          {task.name}
        </h4>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.03]">
        <span className={cn("text-[9px] font-black uppercase tracking-widest", priorityColors[task.priority])}>
          {task.priority}
        </span>
        
        {isEditing ? (
          <form onSubmit={handleTimeSubmit} className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <input
              autoFocus
              type="text"
              value={editedTime}
              onChange={(e) => setEditedTime(e.target.value)}
              className="bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[10px] text-white w-14 outline-none focus:border-[#6366f1]/50"
              placeholder="00:00"
            />
            <button type="submit" className="text-emerald-400 hover:text-emerald-300">
              <Check size={12} />
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="text-rose-400 hover:text-rose-300">
              <X size={12} />
            </button>
          </form>
        ) : (
          <div 
            className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold group-hover:text-zinc-300 transition-colors cursor-text"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Clock size={11} className="text-zinc-600" />
            {task.time || '--:--'}
          </div>
        )}
      </div>
    </div>
  );
};