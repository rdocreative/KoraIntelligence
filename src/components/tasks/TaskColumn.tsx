"use client";

import React, { useState, useEffect } from 'react';
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
    color: '#F97316',
    gradient: 'linear-gradient(180deg, rgba(249, 115, 22, 0.05) 0%, rgba(249, 115, 22, 0) 100%)',
    startHour: 6,
    endHour: 12
  },
  { 
    id: 'Afternoon', 
    label: 'Tarde', 
    time: '12:00 — 18:00',
    icon: Coffee, 
    color: '#16A34A',
    gradient: 'linear-gradient(180deg, rgba(22, 163, 74, 0.05) 0%, rgba(22, 163, 74, 0) 100%)',
    startHour: 12,
    endHour: 18
  },
  { 
    id: 'Evening', 
    label: 'Noite', 
    time: '18:00 — 00:00',
    icon: Moon, 
    color: '#7C3AED',
    gradient: 'linear-gradient(180deg, rgba(124, 58, 237, 0.05) 0%, rgba(124, 58, 237, 0) 100%)',
    startHour: 18,
    endHour: 24
  },
  { 
    id: 'Dawn', 
    label: 'Madrugada', 
    time: '00:00 — 06:00',
    icon: CloudMoon, 
    color: '#2563EB',
    gradient: 'linear-gradient(180deg, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0) 100%)',
    startHour: 0,
    endHour: 6
  },
];

const PeriodContainer = ({ 
  dayId, 
  period, 
  tasks,
  isToday
}: { 
  dayId: string; 
  period: typeof PERIODS[0]; 
  tasks: any[];
  isToday?: boolean;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${dayId}:${period.id}`,
  });

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isToday) {
      setIsActive(false);
      return;
    }

    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour >= period.startHour && currentHour < period.endHour) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); 
    return () => clearInterval(interval);
  }, [isToday, period]);

  const activeStyle = isActive && isToday ? {
    borderColor: `${period.color}20`, 
    background: `linear-gradient(180deg, ${period.color}05 0%, transparent 100%)`, 
  } : {};

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "relative flex flex-col p-4 rounded-[24px] border transition-all duration-300 ease-in-out",
        !isActive && !isOver ? "border-black/[0.03]" : "",
        isOver ? "border-black/20 bg-black/5 scale-[1.01]" : ""
      )}
      style={{ 
        background: (!isActive || !isToday) && !isOver ? period.gradient : undefined,
        ...activeStyle
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center z-10">
            <period.icon 
              size={16} 
              style={{ color: period.color }} 
              className="transition-all duration-500" 
            />
          </div>
          <div className="flex flex-col">
            <span 
              className="text-[11px] font-black uppercase tracking-widest leading-none transition-all duration-500" 
              style={{ color: period.color }}
            >
              {period.label}
            </span>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight opacity-70 mt-0.5">
              {period.time}
            </span>
          </div>
        </div>
        {tasks.length > 0 && (
          <span className="text-[9px] font-bold text-zinc-600 bg-black/5 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        )}
      </div>
      
      <div className="relative flex flex-col gap-3 min-h-[20px] max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={{ ...task, period: period.id }} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && !isOver && (
           <div className="flex items-center justify-center py-4 opacity-[0.1]">
             <period.icon size={24} style={{ color: period.color }} />
           </div>
        )}

        {isOver && tasks.length === 0 && (
          <div className="h-10 border-2 border-dashed border-black/10 rounded-[20px] flex items-center justify-center ml-8">
             <span className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter">Soltar</span>
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
            "text-sm font-serif italic font-bold tracking-tight text-zinc-800",
          )}>
            {title}
          </h3>
          <span className="text-[10px] bg-black/5 px-2 py-0.5 rounded-full text-zinc-500 font-bold">
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "flex-1 relative flex flex-col gap-5 p-2 rounded-[28px] bg-black/[0.01] border border-black/[0.03] custom-scrollbar overflow-y-auto pb-10"
        )}
      >
        {PERIODS.map((period) => (
          <PeriodContainer 
            key={period.id}
            dayId={id}
            period={period}
            tasks={tasks.filter(t => t.period === period.id)}
            isToday={isToday}
          />
        ))}
      </div>
    </div>
  );
};