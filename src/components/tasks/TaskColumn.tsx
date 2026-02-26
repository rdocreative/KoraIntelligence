"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
  isToday?: boolean;
}

export const TaskColumn = ({ id, title, tasks, isToday }: TaskColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col w-72 shrink-0 h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            "text-xs font-black uppercase tracking-[0.2em]",
            isToday ? "text-[#38BDF8]" : "text-zinc-500"
          )}>
            {title}
          </h3>
          <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-zinc-400 font-bold">
            {tasks.length}
          </span>
        </div>
        <button className="p-1 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all">
          <Plus size={16} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 flex flex-col gap-3 p-3 rounded-[24px] bg-white/[0.02] border border-white/5 custom-scrollbar overflow-y-auto",
          isToday && "bg-[#38BDF8]/[0.02] border-[#38BDF8]/10 shadow-[inset_0_0_20px_rgba(56,189,248,0.02)]"
        )}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/[0.03] rounded-2xl min-h-[100px]">
             <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Vazio</span>
          </div>
        )}
      </div>
    </div>
  );
};