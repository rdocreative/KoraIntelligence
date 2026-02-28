"use client";

import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Sun, Coffee, Moon, CloudMoon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
  isToday: boolean;
  lastMovedTaskId?: string | null;
  onUpdateTaskStatus: (taskId: string, status: string) => void;
  onUpdateTask: (taskId: string, updates: any) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskPeriod = ({ title, icon: Icon, tasks, color, period, id, onUpdateTaskStatus, onUpdateTask, onDeleteTask }: any) => {
  const { setNodeRef } = useDroppable({
    id: `${id}:${period}`,
  });

  // Ordenação com normalização solicitada
  const sortedTasks = [...tasks].sort((a, b) => {
    const peso: Record<string, number> = { 'Extrema': 0, 'Alta': 1, 'Média': 2, 'Media': 2, 'Baixa': 3 };
    const normalize = (s: string) => s ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
    const pA = normalize(a.priority || a.prioridade);
    const pB = normalize(b.priority || b.prioridade);
    return (peso[pA] ?? 99) - (peso[pB] ?? 99);
  });

  return (
    <div ref={setNodeRef} className="space-y-4 mb-8 min-h-[100px] last:mb-0 group/period">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Icon size={14} className={cn("opacity-50 transition-opacity group-hover/period:opacity-100", color)} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover/period:text-zinc-400 transition-colors">
          {title}
        </span>
        <div className="h-px flex-1 bg-white/[0.03] ml-2" />
      </div>

      <div className="space-y-3">
        {sortedTasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onUpdateStatus={onUpdateTaskStatus}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export const TaskColumn = ({ 
  id, 
  title, 
  tasks, 
  isToday, 
  lastMovedTaskId,
  onUpdateTaskStatus,
  onUpdateTask,
  onDeleteTask 
}: TaskColumnProps) => {
  const periods = [
    { name: 'Morning', label: 'Manhã', icon: Sun, color: 'text-orange-400' },
    { name: 'Afternoon', label: 'Tarde', icon: Coffee, color: 'text-emerald-400' },
    { name: 'Evening', label: 'Noite', icon: Moon, color: 'text-indigo-400' },
    { name: 'Dawn', label: 'Madrugada', icon: CloudMoon, color: 'text-blue-500' }
  ];

  return (
    <div 
      data-day={title}
      className={cn(
        "w-[300px] flex flex-col h-full shrink-0 group/column",
        isToday ? "opacity-100" : "opacity-80 hover:opacity-100"
      )}
    >
      <div className="flex items-center justify-between mb-6 px-1">
        <h3 className={cn(
          "text-[13px] font-black uppercase tracking-[0.3em]",
          isToday ? "text-[#6366f1]" : "text-zinc-500"
        )}>
          {title}
        </h3>
        {isToday && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] shadow-[0_0_10px_#6366f1]" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {periods.map((p) => (
            <TaskPeriod
              key={p.name}
              id={id}
              period={p.name}
              title={p.label}
              icon={p.icon}
              color={p.color}
              tasks={tasks.filter(t => t.period === p.name)}
              onUpdateTaskStatus={onUpdateTaskStatus}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};