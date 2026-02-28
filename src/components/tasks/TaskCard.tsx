"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Clock, Pencil, Trash2 } from "lucide-react";

interface Task {
  id: string;
  name: string;
  time: string;
  icon: string;
  priority: string;
  period: string;
  status?: string;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, isOverlay, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: task.id,
    disabled: isOverlay 
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const priorityColors: Record<string, string> = {
    'Extrema': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    'Média': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Baixa': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-[#18181b] border border-white/5 rounded-xl p-3.5 mb-3 transition-all cursor-grab active:cursor-grabbing hover:border-white/10 hover:shadow-lg hover:shadow-black/20",
        isDragging && "opacity-50 ring-2 ring-[#6366f1]/50",
        isOverlay && "cursor-grabbing z-50 shadow-2xl scale-105"
      )}
      data-draggable="true"
    >
      <div className="flex items-start justify-between mb-2">
        <div 
          className="flex items-center gap-2.5 flex-1"
          {...attributes}
          {...listeners}
        >
          <span className="text-lg">{task.icon}</span>
          <h4 className="text-[13.5px] font-medium text-white/90 leading-tight">
            {task.name}
          </h4>
        </div>
        
        {/* Actions - visible on hover */}
        {!isOverlay && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(task);
              }}
              className="p-1.5 text-white/40 hover:text-[#6366f1] hover:bg-[#6366f1]/10 rounded-md transition-colors"
              title="Editar tarefa"
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(task.id);
              }}
              className="p-1.5 text-white/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors"
              title="Excluir tarefa"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div 
        className="flex items-center justify-between mt-auto"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-1.5 text-white/40">
          <Clock size={12} strokeWidth={2.5} />
          <span className="text-[11px] font-medium">{task.time}</span>
        </div>

        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase",
          priorityColors[task.priority] || priorityColors['Média']
        )}>
          {task.priority}
        </span>
      </div>
    </div>
  );
}