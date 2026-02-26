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
  { 
    id: 'Anytime', 
    label: 'Qualquer Hora', 
    icon: Clock, 
    color: '#D1D5DB',
    gradient: 'linear-gradient(135deg, rgba(156, 163, 175, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)'
  },
  { 
    id: 'Morning', 
    label: 'Manhã', 
    icon: Sun, 
    color: '#FB923C',
    gradient: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(255, 255, 255, 0.01) 100%)'
  },
  { 
    id: 'Afternoon', 
    label: 'Tarde', 
    icon: Coffee, 
    color: '#4ADE80',
    gradient: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(255, 255, 255, 0.01) 100%)'
  },
  { 
    id: 'Evening', 
    label: 'Noite', 
    icon: Moon, 
    color: '#A78BFA',
    gradient: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(255, 255, 255, 0.01) 100%)'
  },
];

export const TaskColumn = ({ id, title, tasks, isToday }: TaskColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col w-80 shrink-0 h-full">
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

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 flex flex-col gap-4 p-2 rounded-[24px] bg-white/[0.01] border border-white/5 custom-scrollbar overflow-y-auto pb-10",
          isToday && "bg-[#38BDF8]/[0.01] border-[#38BDF8]/10 shadow-[inset_0_0_20px_rgba(56,189,248,0.01)]"
        )}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {PERIODS.map((period) => {
            const periodTasks = tasks.filter(t => t.period === period.id);
            
            return (
              <div 
                key={period.id} 
                className="space-y-3 p-4 rounded-[24px] border border-white/[0.03] transition-all"
                style={{ background: period.gradient }}
              >
                <div className="flex items-center gap-2 px-1 mb-1 opacity-60">
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
                   <div className="flex items-center justify-center py-4 opacity-10">
                     <period.icon size={20} style={{ color: period.color }} />
                   </div>
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