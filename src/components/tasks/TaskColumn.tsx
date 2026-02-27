"use client";

import React, { forwardRef } from 'react';
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
  lastMovedTaskId?: string | null;
  onUpdateTaskTime?: (taskId: string, newTime: string) => void;
}

const PERIODS = [
  { 
    id: 'Morning', 
    label: 'Manhã', 
    time: '06:00 — 12:00',
    icon: Sun, 
    color: '#FDBA74',
    gradient: 'linear-gradient(180deg, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0.01) 100%)',
    startHour: 6,
    endHour: 12,
    defaultTime: '09:00'
  },
  { 
    id: 'Afternoon', 
    label: 'Tarde', 
    time: '12:00 — 18:00',
    icon: Coffee, 
    color: '#4ADE80',
    gradient: 'linear-gradient(180deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.01) 100%)',
    startHour: 12,
    endHour: 18,
    defaultTime: '15:00'
  },
  { 
    id: 'Evening', 
    label: 'Noite', 
    time: '18:00 — 00:00',
    icon: Moon, 
    color: '#A78BFA',
    gradient: 'linear-gradient(180deg, rgba(129,140,248,0.08) 0%, rgba(129,140,248,0.01) 100%)',
    startHour: 18,
    endHour: 24,
    defaultTime: '21:00'
  },
  { 
    id: 'Dawn', 
    label: 'Madrugada', 
    time: '00:00 — 06:00',
    icon: CloudMoon, 
    color: '#818CF8',
    gradient: 'linear-gradient(180deg, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0.01) 100%)',
    startHour: 0,
    endHour: 6,
    defaultTime: '03:00'
  },
];

const PeriodContainer = ({ 
  dayId, 
  period, 
  tasks,
  isToday,
  lastMovedTaskId,
  onUpdateTaskTime
}: { 
  dayId: string; 
  period: typeof PERIODS[0]; 
  tasks: any[];
  isToday?: boolean;
  lastMovedTaskId?: string | null;
  onUpdateTaskTime?: (taskId: string, newTime: string) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${dayId}:${period.id}`,
  });

  const hasTasks = tasks.length > 0;
  const isExpanded = hasTasks || isOver;

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "relative flex flex-col rounded-[24px] border transition-all duration-300 ease-in-out",
        "border-white/[0.03]",
        isOver ? "bg-white/[0.05] border-white/10 scale-[1.01]" : "",
        isExpanded ? "p-4" : "p-3 bg-white/[0.01] hover:bg-white/[0.03] cursor-default"
      )}
      style={{ background: period.gradient }}
    >
      <div className={cn("flex items-center justify-between transition-all", isExpanded ? "mb-4" : "mb-0")}>
        <div className="flex items-center gap-3">
          <period.icon 
            size={isExpanded ? 16 : 14} 
            style={{ color: period.color }} 
          />
          <div className="flex flex-col">
            <span 
              className={cn("font-black uppercase tracking-widest leading-none", isExpanded ? "text-[11px]" : "text-[10px]")}
              style={{ color: period.color }}
            >
              {period.label}
            </span>
            {isExpanded && (
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight opacity-70 mt-0.5">
                {period.time}
              </span>
            )}
          </div>
        </div>
        {tasks.length > 0 && (
          <span className="text-[9px] font-bold text-zinc-200 bg-white/10 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        )}
      </div>
      
      <div className={cn(
          "relative flex flex-col gap-3 transition-all duration-300",
          isExpanded ? "min-h-[20px] max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden min-h-0"
      )}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={{ ...task, period: period.id }} 
              isAwaitingTime={lastMovedTaskId === task.id}
              onUpdateTime={(newTime) => onUpdateTaskTime?.(task.id, newTime)}
              defaultPeriodTime={period.defaultTime}
            />
          ))}
        </SortableContext>
        
        {isOver && tasks.length === 0 && (
          <div className="h-10 border-2 border-dashed border-white/10 rounded-[20px] flex items-center justify-center">
             <span className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">Soltar</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const TaskColumn = forwardRef<HTMLDivElement, TaskColumnProps>(({ id, title, tasks, isToday, lastMovedTaskId, onUpdateTaskTime }, ref) => {
  return (
    <div 
      ref={ref} 
      data-day={id}
      className="flex flex-col w-72 shrink-0 h-full scroll-snap-align-center"
    >
      <div className="flex items-center justify-center mb-4 px-3 relative">
        <div className="flex items-center gap-3">
          <h3 className={cn(
            "text-lg font-serif font-medium tracking-tight",
            isToday ? "text-[#6366f1]" : "text-zinc-100"
          )}>
            {title}
          </h3>
          {isToday && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500/80 border border-white/5 px-2 py-0.5 rounded-md">
              Hoje
            </span>
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex-1 relative flex flex-col gap-4 p-2 rounded-[28px] border custom-scrollbar overflow-y-auto pb-10 transition-all duration-500",
          isToday 
            ? "bg-[#6366f1]/[0.02] border-[#6366f1]/10 shadow-[0_0_40px_rgba(99,102,241,0.02)]" 
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
            lastMovedTaskId={lastMovedTaskId}
            onUpdateTaskTime={onUpdateTaskTime}
          />
        ))}
      </div>
    </div>
  );
});

TaskColumn.displayName = "TaskColumn";