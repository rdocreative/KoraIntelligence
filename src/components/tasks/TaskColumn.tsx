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
  onUpdateTask?: (taskId: string, updates: any) => void;
}

const PERIODS = [
  { 
    id: 'Morning', 
    label: 'Manhã', 
    time: '06:00 — 12:00',
    icon: Sun, 
    color: '#FDBA74',
    background: 'linear-gradient(180deg, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0.01) 100%)',
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
    background: 'linear-gradient(180deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.01) 100%)',
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
    background: 'linear-gradient(180deg, rgba(129,140,248,0.08) 0%, rgba(129,140,248,0.01) 100%)',
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
    background: 'linear-gradient(180deg, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0.01) 100%)',
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
  onUpdateTaskTime,
  onUpdateTask
}: { 
  dayId: string; 
  period: typeof PERIODS[0]; 
  tasks: any[];
  isToday?: boolean;
  lastMovedTaskId?: string | null;
  onUpdateTaskTime?: (taskId: string, newTime: string) => void;
  onUpdateTask?: (taskId: string, updates: any) => void;
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
        "relative flex flex-col rounded-[24px] transition-all duration-300 ease-in-out",
        isOver ? "bg-white/[0.05] scale-[1.01]" : "",
        isExpanded ? "p-3" : "p-3 hover:bg-white/[0.03] cursor-default"
      )}
      style={{ 
        background: period.background,
        border: '1.5px solid rgba(255,255,255,0.08)',
        boxShadow: 'none'
      }}
    >
      <div className={cn("flex items-center justify-between transition-all w-full", isExpanded ? "mb-4" : "mb-0")}>
        <div className="flex items-center gap-3">
          <period.icon 
            size={isExpanded ? 16 : 14} 
            style={{ color: period.color }} 
          />
          <span 
            className={cn("font-black uppercase tracking-widest leading-none", isExpanded ? "text-[11px]" : "text-[10px]")}
            style={{ color: period.color, opacity: 0.9 }}
          >
            {period.label}
          </span>
        </div>
        
        {isExpanded && (
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight opacity-70">
            {period.time}
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
              onUpdateTask={onUpdateTask}
              defaultPeriodTime={period.defaultTime}
            />
          ))}
        </SortableContext>
        
        {isOver && tasks.length === 0 && (
          <div className="h-10 border-[3px] border-dashed border-white/10 rounded-[20px] flex items-center justify-center">
             <span className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">Soltar</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const TaskColumn = forwardRef<HTMLDivElement, TaskColumnProps>(({ id, title, tasks, isToday, lastMovedTaskId, onUpdateTaskTime, onUpdateTask }, ref) => {
  return (
    <div 
      ref={ref} 
      data-day={id}
      className="flex flex-col w-72 shrink-0 h-full scroll-snap-align-center"
    >
      <div className="flex items-center justify-center mb-4 px-3 relative">
        <div className="flex items-center gap-3">
          <h3 className={cn(
            "text-[15px] font-serif font-medium tracking-tight",
            isToday ? "text-[#6366f1] opacity-100" : "text-white opacity-[0.85]"
          )}>
            {title}
          </h3>
          {isToday && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#a5b4fc] bg-[rgba(99,102,241,0.25)] border border-[rgba(99,102,241,0.3)] px-2 py-0.5 rounded-[6px] font-[700]">
              Hoje
            </span>
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex-1 relative flex flex-col gap-4 p-2 rounded-[28px] custom-scrollbar overflow-y-auto pb-10 transition-all duration-500",
          isToday 
            ? "bg-[#6366f1]/[0.02] shadow-[0_0_40px_rgba(99,102,241,0.02)]" 
            : "bg-white/[0.01]"
        )}
        style={{ border: '0.5px solid rgba(255,255,255,0.05)' }}
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
            onUpdateTask={onUpdateTask}
          />
        ))}
      </div>
    </div>
  );
});

TaskColumn.displayName = "TaskColumn";