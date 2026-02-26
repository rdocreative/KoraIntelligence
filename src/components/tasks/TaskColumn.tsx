"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Sun, Moon, Coffee, CloudMoon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
  isToday?: boolean;
}

const PERIODS = [
  { id: 'Morning', label: 'Manhã', time: '06:00 — 12:00', icon: Sun, color: '#FDBA74' },
  { id: 'Afternoon', label: 'Tarde', time: '12:00 — 18:00', icon: Coffee, color: '#4ADE80' },
  { id: 'Evening', label: 'Noite', time: '18:00 — 00:00', icon: Moon, color: '#A78BFA' },
  { id: 'Dawn', label: 'Madrugada', time: '00:00 — 06:00', icon: CloudMoon, color: '#818CF8' },
  { id: 'Anytime', label: 'Qualquer Hora', time: 'Livre', icon: Clock, color: '#94A3B8' },
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
        "flex flex-col p-4 rounded-[24px] border transition-all duration-200",
        isOver ? "border-[#38BDF8] bg-[#38BDF8]/5" : "border-white/[0.04] bg-white/[0.01]"
      )}
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
      
      <div className="space-y-3 min-h-[10px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {isOver && tasks.length === 0 && (
          <div className="h-10 border-2 border-dashed border-[#38BDF8]/20 rounded-[24px]" />
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