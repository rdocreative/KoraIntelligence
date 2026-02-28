"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, Circle } from "lucide-react";

interface TaskCardProps {
  task: any;
  isHighlighted?: boolean;
  onUpdateStatus?: (status: string) => void;
  onUpdateTask?: (updates: any) => void;
  onDelete?: () => void;
}

export function TaskCard({ task, isHighlighted, onUpdateStatus }: TaskCardProps) {
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
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'Extrema': return 'bg-red-500';
      case 'Média': return 'bg-orange-500';
      case 'Baixa': return 'bg-sky-500';
      default: return 'bg-zinc-500';
    }
  };

  const isCompleted = task.status === 'concluida';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-[#1c1e29] border border-white/[0.06] rounded-xl p-2.5 flex flex-col gap-2 transition-all duration-300 cursor-grab active:cursor-grabbing",
        isDragging && "opacity-40 scale-95 z-50 ring-2 ring-[#6366f1]/50",
        isHighlighted && "ring-2 ring-[#6366f1] animate-pulse",
        !isDragging && "hover:border-white/20 hover:shadow-xl hover:shadow-black/20",
        isCompleted && "opacity-60 grayscale-[0.5]"
      )}
      {...attributes}
      {...listeners}
      data-draggable="true"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onUpdateStatus?.(isCompleted ? 'pendente' : 'concluida');
            }}
            className={cn(
              "shrink-0 transition-colors",
              isCompleted ? "text-emerald-400" : "text-white/20 hover:text-white/40"
            )}
          >
            {isCompleted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
          </button>
          <span className={cn(
            "text-[12px] font-medium text-white truncate",
            isCompleted && "line-through text-white/40"
          )}>
            {task.name}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5 text-white/30">
          <Clock size={10} />
          <span className="text-[9px] font-bold font-mono tracking-tight">{task.time}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <div className={cn("w-1 h-1 rounded-full", getPriorityColor(task.priority))} />
          <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.05em]">{task.priority}</span>
        </div>
      </div>
    </div>
  );
}