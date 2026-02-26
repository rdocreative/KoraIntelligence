"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Sun, Moon, Coffee, CloudMoon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
  isToday?: boolean;
}

const PERIODS = [
  { 
    id: 'Morning', 
    label: 'Manhã', 
    time: '06:00 — 12:00',
    icon: Sun, 
    color: '#FDBA74',
    gradient: 'linear-gradient(180deg, rgba(253, 186, 116, 0.12) 0%, rgba(253, 186, 116, 0.02) 100%)'
  },
  { 
    id: 'Afternoon', 
    label: 'Tarde', 
    time: '12:00 — 18:00',
    icon: Coffee, 
    color: '#4ADE80',
    gradient: 'linear-gradient(180deg, rgba(74, 222, 128, 0.12) 0%, rgba(74, 222, 128, 0.02) 100%)'
  },
  { 
    id: 'Evening', 
    label: 'Noite', 
    time: '18:00 — 00:00',
    icon: Moon, 
    color: '#A78BFA',
    gradient: 'linear-gradient(180deg, rgba(167, 139, 250, 0.12) 0%, rgba(167, 139, 250, 0.02) 100%)'
  },
  { 
    id: 'Dawn', 
    label: 'Madrugada', 
    time: '00:00 — 06:00',
    icon: CloudMoon, 
    color: '#818CF8',
    gradient: 'linear-gradient(180deg, rgba(129, 140, 248, 0.12) 0%, rgba(129, 140, 248, 0.02) 100%)'
  },
];

const PeriodContainer = ({ 
  dayId, 
  period, 
  tasks 
}: { 
  dayId: string; 
  period: typeof PERIODS[0]; 
  tasks: any[] 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${dayId}:${period.id}`,
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "group flex flex-col p-4 rounded-[24px] border transition-all duration-200",
        isOver ? "border-[#38BDF8] bg-[#38BDF8]/10 scale-[1.01]" : "border-white/[0.04]"
      )}
      style={{ background: isOver ? undefined : period.gradient }}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <period.icon size={12} style={{ color: period.color }} />
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: period.color }}>
              {period.label}
            </span>
          </div>
          <span className="text-[9px] font-medium text-zinc-500 ml-5 uppercase tracking-tighter">
            {period.time}
          </span>
        </div>
        {tasks.length > 0 && (
          <span className="text-[9px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        )}
      </div>
      
      <div className="space-y-3 min-h-[20px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && !isOver && (
           <div className="flex items-center justify-center py-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
             <period.icon size={24} style={{ color: period.color }} />
           </div>
        )}

        {isOver && tasks.length === 0 && (
          <div className="h-10 border-2 border-dashed border-[#38BDF8]/20 rounded-[24px] flex items-center justify-center">
             <span className="text-[8px] font-black text-[#38BDF8] uppercase tracking-tighter">Soltar</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const TaskColumn = ({ id, title, tasks, isToday }: TaskColumnProps) => {
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
      </div>

      <div
        className={cn(
          "flex-1 flex flex-col gap-5 p-2 rounded-[24px] bg-white/[0.01] border border-white/5 custom-scrollbar overflow-y-auto pb-10",
          isToday && "bg-[#38BDF8]/[0.01] border-[#38BDF8]/10"
        )}
      >
        {PERIODS.map((period) => (
          <PeriodContainer 
            key={period.id}
            dayId={id}
            period={period}
            tasks={tasks.filter(t => t.period === period.id)}
          />
        ))}
      </div>
    </div>
  );
};