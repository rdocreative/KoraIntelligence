"use client";

import React, { forwardRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Sun, Moon, Coffee, CloudMoon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
  isToday?: boolean;
  lastMovedTaskId?: string | null;
  onUpdateTaskStatus?: (taskId: string, status: 'pendente' | 'concluido') => void;
  onUpdateTask?: (taskId: string, updates: any) => void;
  onDeleteTask?: (taskId: string) => void;
  isLoading?: boolean;
}

const PERIODS = [
  { 
    id: 'Morning', 
    label: 'Manhã', 
    time: '06:00 — 12:00', 
    icon: Sun, 
    color: '#FDBA74', 
    timeColor: 'rgba(249,115,22,0.7)', 
    background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.03) 40%, transparent 100%)', 
    defaultTime: '09:00' 
  },
  { 
    id: 'Afternoon', 
    label: 'Tarde', 
    time: '12:00 — 18:00', 
    icon: Coffee, 
    color: '#4ADE80', 
    timeColor: 'rgba(34,197,94,0.7)', 
    background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.03) 40%, transparent 100%)', 
    defaultTime: '15:00' 
  },
  { 
    id: 'Evening', 
    label: 'Noite', 
    time: '18:00 — 00:00', 
    icon: Moon, 
    color: '#A78BFA', 
    timeColor: 'rgba(129,140,248,0.7)', 
    background: 'linear-gradient(180deg, rgba(129, 140, 248, 0.1) 0%, rgba(129, 140, 248, 0.03) 40%, transparent 100%)', 
    defaultTime: '21:00' 
  },
  { 
    id: 'Dawn', 
    label: 'Madrugada', 
    time: '00:00 — 06:00', 
    icon: CloudMoon, 
    color: '#818CF8', 
    timeColor: 'rgba(56,189,248,0.7)', 
    background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.1) 0%, rgba(56, 189, 248, 0.03) 40%, transparent 100%)', 
    defaultTime: '03:00' 
  },
];

const PeriodContainer = ({ dayId, period, tasks, lastMovedTaskId, onUpdateTaskStatus, onUpdateTask, onDeleteTask, isLoading }: any) => {
  const { setNodeRef, isOver } = useDroppable({ id: `${dayId}:${period.id}` });
  const hasTasks = tasks.length > 0;
  const isExpanded = hasTasks || isOver || isLoading;

  const handleDelete = async (taskId: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      
      onDeleteTask?.(taskId);
      toast.success("Tarefa removida");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover tarefa");
    }
  };

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "relative flex flex-col rounded-[24px] transition-all duration-300", 
        isOver ? "bg-white/[0.05] scale-[1.01]" : "", 
        isExpanded ? "p-3" : "p-3 hover:bg-white/[0.03]"
      )}
      style={{ background: period.background, border: 'none' }}
    >
      <div className={cn("flex items-center justify-between transition-all w-full", isExpanded ? "mb-4" : "mb-0")}>
        <div className="flex items-center gap-3">
          <period.icon size={isExpanded ? 16 : 14} style={{ color: period.color }} />
          <span className={cn("font-black uppercase tracking-widest leading-none", isExpanded ? "text-[11px]" : "text-[10px]")} style={{ color: period.color, opacity: 0.9 }}>
            {period.label}
          </span>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-tight" style={{ color: period.timeColor }}>{period.time}</span>
      </div>
      
      <div 
        className={cn("relative flex flex-col gap-3 transition-all custom-scrollbar", isExpanded ? "opacity-100" : "max-h-0 opacity-0 overflow-hidden")}
        style={isExpanded ? { maxHeight: '280px', overflowY: 'auto' } : {}}
      >
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => <div key={i} className="h-24 bg-white/5 rounded-[20px] animate-pulse" />)}
          </div>
        ) : (
          <SortableContext items={tasks.map((t: any) => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task: any) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                isAwaitingTime={lastMovedTaskId === task.id} 
                onUpdateStatus={(status: any) => onUpdateTaskStatus?.(task.id, status)} 
                onUpdateTask={onUpdateTask} 
                onDelete={() => handleDelete(task.id)}
                defaultPeriodTime={period.defaultTime} 
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
};

export const TaskColumn = forwardRef<HTMLDivElement, TaskColumnProps>(({ id, title, tasks, isToday, lastMovedTaskId, onUpdateTaskStatus, onUpdateTask, onDeleteTask, isLoading }, ref) => {
  return (
    <div ref={ref} data-day={id} className="flex flex-col w-72 shrink-0 h-full">
      <div className="flex items-center justify-center mb-4 px-3">
        <h3 className={cn("text-[15px] font-medium tracking-tight", isToday ? "text-[#6366f1]" : "text-white opacity-[0.85]")}>{title}</h3>
      </div>
      <div className={cn("flex-1 flex flex-col gap-4 p-2 rounded-[28px] overflow-y-auto custom-scrollbar", isToday ? "bg-[#6366f1]/[0.02]" : "bg-white/[0.01]")} style={{ border: '0.5px solid rgba(255,255,255,0.05)' }}>
        {PERIODS.map((period) => (
          <PeriodContainer key={period.id} dayId={id} period={period} tasks={tasks.filter(t => t.period === period.id)} lastMovedTaskId={lastMovedTaskId} onUpdateTaskStatus={onUpdateTaskStatus} onUpdateTask={onUpdateTask} onDeleteTask={onDeleteTask} isLoading={isLoading} />
        ))}
      </div>
    </div>
  );
});

TaskColumn.displayName = "TaskColumn";