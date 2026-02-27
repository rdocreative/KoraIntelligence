"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';
import { Hash } from 'lucide-react';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
  isToday?: boolean;
}

export const TaskColumn = ({ id, title, tasks, isToday }: TaskColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div 
      data-day={title}
      className={cn(
        "flex flex-col w-[320px] shrink-0 h-full",
        isToday && "relative"
      )}
    >
      {/* Header da Coluna */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-2">
          <Hash size={14} className={cn(isToday ? "text-[#38BDF8]" : "text-zinc-600")} />
          <h3 className={cn(
            "text-[11px] font-black uppercase tracking-[0.2em]",
            isToday ? "text-white" : "text-zinc-500"
          )}>
            {title}
          </h3>
        </div>
        {isToday && (
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black text-[#38BDF8] uppercase tracking-tighter">Hoje</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
          </div>
        )}
      </div>

      {/* Container de Drop das Tarefas */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 flex flex-col gap-3 p-3 rounded-[32px] transition-all overflow-y-auto custom-scrollbar pb-20",
          isToday ? "bg-white/[0.04] border border-white/5 shadow-2xl" : "bg-white/[0.01] border border-transparent"
        )}
      >
        <SortableContext 
          id={id}
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-10 py-10 border-2 border-dashed border-white/10 rounded-[24px]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sem tarefas</p>
          </div>
        )}
      </div>
    </div>
  );
};