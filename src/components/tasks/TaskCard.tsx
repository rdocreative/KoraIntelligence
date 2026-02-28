"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Clock, MoreHorizontal, CheckCircle2, Circle, Trash2, Edit3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: any;
  isHighlighted?: boolean;
  onUpdateStatus?: (status: string) => void;
  onUpdateTask?: (updates: any) => void;
  onDelete?: () => void;
}

export function TaskCard({ task, isHighlighted, onUpdateStatus, onDelete }: TaskCardProps) {
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
        "group relative bg-[#1c1e29] border border-white/[0.06] rounded-xl p-3 flex flex-col gap-2.5 transition-all duration-300",
        isDragging && "opacity-40 scale-95 z-50 ring-2 ring-[#6366f1]/50",
        isHighlighted && "ring-2 ring-[#6366f1] animate-pulse",
        !isDragging && "hover:border-white/20 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5",
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
            {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          </button>
          <span className={cn(
            "text-[13px] font-medium text-white truncate transition-all",
            isCompleted && "line-through text-white/40"
          )}>
            {task.name}
          </span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/5 text-white/30 transition-all">
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 bg-[#13151f] border-white/[0.08] text-white">
            <DropdownMenuItem className="gap-2 text-xs focus:bg-white/5 cursor-pointer">
              <Edit3 size={14} /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
              className="gap-2 text-xs focus:bg-red-500/10 text-red-400 focus:text-red-400 cursor-pointer"
            >
              <Trash2 size={14} /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-1.5 text-white/30">
          <Clock size={11} />
          <span className="text-[10px] font-bold font-mono tracking-tight">{task.time}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.05em]">{task.priority}</span>
          <div className={cn("w-1 h-1 rounded-full", getPriorityColor(task.priority))} />
        </div>
      </div>
    </div>
  );
}