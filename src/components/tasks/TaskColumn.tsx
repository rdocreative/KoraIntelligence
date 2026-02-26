"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Plus, Sun, Moon, Coffee, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
  isToday?: boolean;
}

const PERIODS = [
  { id: 'Anytime', label: 'Qualquer Hora', icon: Clock, color: '#D1D5DB' },
  { id: 'Morning', label: 'Manhã', icon: Sun, color: '#FB923C' },
  { id: 'Afternoon', label: 'Tarde', icon: Coffee, color: '#4ADE80' },
  { id: 'Evening', label: 'Noite', icon: Moon, color: '#A78BFA' },
];

export const TaskColumn = ({ id, title, tasks, isToday }: TaskColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col w-80 shrink-0 h-full">
      {/* Header da Coluna */}
      <div className="flex items-center justify-between mb-4 px-3">
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

      {/* Área de Drop e Conteúdo */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 flex flex-col gap-6 p-3 rounded-[32px] bg-white/[0.02] border border-white/5 custom-scrollbar overflow-y-auto pb-10",
          isToday && "bg-[#38BDF8]/[0.02] border-[#38BDF8]/10 shadow-[inset_0_0_20px_rgba(56,189,248,0.02)]"
        )}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {PERIODS.map((period) => {
            const periodTasks = tasks.filter(t => t.period === period.id);
            
            return (
              <div key={period.id} className="space-y-3">
                <div className="flex items-center gap-2 px-1 mb-1 opacity-40">
                  <period.icon size={12} style={{ color: period.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: period.color }}>
                    {period.label}
                  </span>
                </div>
                
                <div className="space-y-3 min-h-[10px]">
                  {periodTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>

                {periodTasks.length === 0 && (
                   <div className="h-px w-full bg-white/[0.03] my-4" />
                )}
              </div>
            );
          })}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/[0.03] rounded-[24px] min-h-[200px]">
             <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Sem tarefas</span>
          </div>
        )}
      </div>
    </div>
  );
};