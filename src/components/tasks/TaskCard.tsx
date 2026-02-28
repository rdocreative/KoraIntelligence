"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2, Clock, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: any;
  isAwaitingTime?: boolean;
  onUpdateStatus?: (status: 'pendente' | 'concluido') => void;
  onUpdateTask?: (taskId: string, updates: any) => void;
  onDelete?: (taskId: string) => void;
  defaultPeriodTime?: string;
}

export const TaskCard = ({ task, onUpdateStatus, onDelete }: TaskCardProps) => {
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
    position: 'relative' as const
  };

  const priorityColors: Record<string, string> = {
    'Baixa': 'text-blue-400 bg-blue-400/10',
    'Média': 'text-orange-400 bg-orange-400/10',
    'Media': 'text-orange-400 bg-orange-400/10',
    'Extrema': 'text-red-400 bg-red-400/10'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative bg-white/[0.03] border border-white/10 rounded-[20px] p-4 hover:bg-white/[0.06] transition-all cursor-grab active:cursor-grabbing"
    >
      {/* Ícones de Editar e Apagar no Hover */}
      <div className="absolute top-2 right-2 hidden group-hover:flex gap-1 z-10">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Aqui abriria o popover de edição se estivesse implementado
          }}
          className="bg-white/10 rounded-[6px] p-1 text-white/50 hover:text-white transition-colors"
        >
          <Pencil size={12} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(task.id);
          }}
          className="bg-white/10 rounded-[6px] p-1 text-white/50 hover:text-white transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="flex items-start gap-3">
        <span className="text-xl leading-none">{task.icon || '📝'}</span>
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "text-[13px] font-bold text-white mb-1 truncate",
            task.status === 'concluido' && "line-through opacity-50"
          )}>
            {task.name}
          </h4>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-medium">
              <Clock size={10} />
              <span>{task.time}</span>
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md",
              priorityColors[task.priority] || priorityColors['Baixa']
            )}>
              {task.priority === 'Media' ? 'Média' : task.priority}
            </span>
          </div>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus?.(task.status === 'concluido' ? 'pendente' : 'concluido');
          }}
          className={cn(
            "w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center shrink-0",
            task.status === 'concluido' 
              ? "bg-[#6366f1] border-[#6366f1]" 
              : "border-white/20 hover:border-white/40"
          )}
        >
          {task.status === 'concluido' && (
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
};