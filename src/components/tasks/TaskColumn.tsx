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
    color: '#FDBA74',
    gradient: 'linear-gradient(180deg, rgba(253, 186, 116, 0.08) 0%, rgba(253, 186, 116, 0.01) 100%)',
    startHour: 6,
    endHour: 12
  },
  { 
    id: 'Afternoon', 
    label: 'Tarde', 
    time: '12:00 — 18:00',
    icon: Coffee, 
    color: '#4ADE80',
    gradient: 'linear-gradient(180deg, rgba(74, 222, 128, 0.08) 0%, rgba(74, 222, 128, 0.01) 100%)',
    startHour: 12,
    endHour: 18
  },
  { 
    id: 'Evening', 
    label: 'Noite', 
    time: '18:00 — 00:00',
    icon: Moon, 
    color: '#A78BFA',
    gradient: 'linear-gradient(180deg, rgba(167, 139, 250, 0.08) 0%, rgba(167, 139, 250, 0.01) 100%)',
    startHour: 18,
    endHour: 24
  },
  { 
    id: 'Dawn', 
    label: 'Madrugada', 
    time: '00:00 — 06:00',
    icon: CloudMoon, 
    color: '#818CF8',
    gradient: 'linear-gradient(180deg, rgba(129, 140, 248, 0.08) 0%, rgba(129, 140, 248, 0.01) 100%)',
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
    borderColor: `${period.color}30`, 
    background: `linear-gradient(180deg, ${period.color}0D 0%, transparent 100%)`, 
  } : {};

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "relative flex flex-col p-4 rounded-[24px] border transition-all duration-300 ease-in-out",
        !isActive && !isOver ? "border-white/[0.03]" : "",
        isOver ? "border-white/20 bg-white/5 scale-[1.01]" : ""
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
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight opacity-70 mt-0.5">
              {period.time}
            </span>
          </div>
        </div>
        {tasks.length > 0 && (
          <span className="text-[9px] font-bold text-zinc-200 bg-white/10 px-2 py-0.5 rounded-full">
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
           <div className="flex items-center justify-center py-4 opacity-[0.05]">
             <period.icon size={24} style={{ color: period.color }} />
           </div>
        )}

        {isOver && tasks.length === 0 && (
          <div className="h-10 border-2 border-dashed border-white/10 rounded-[20px] flex items-center justify-center">
             <span className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">Soltar</span>
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
            "text-lg font-serif font-medium tracking-tight transition-colors duration-500",
            isToday ? "text-[#38BDF8]" : "text-zinc-100"
          )}>
            {title}
          </h3>
          {isToday && (
            <span className="text-[9px] font-black uppercase tracking-widest text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded-full border border-[#38BDF8]/20 animate-pulse">
              Hoje
            </span>
          )}
          {!isToday && (
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-zinc-400 font-bold">
              {tasks.length}
            </span>
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex-1 relative flex flex-col gap-5 p-2 rounded-[28px] border custom-scrollbar overflow-y-auto pb-10 transition-all duration-500",
          isToday 
            ? "bg-[#38BDF8]/[0.02] border-[#38BDF8]/10 shadow-[0_0_40px_rgba(56,189,248,0.02)]" 
            : "bg-white/[0.01] border-white/[0.03]"
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