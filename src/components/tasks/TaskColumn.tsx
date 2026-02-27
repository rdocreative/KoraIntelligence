"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { 
  Sun, 
  Coffee, 
  Moon, 
  CloudMoon,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
  isToday?: boolean;
  lastMovedTaskId?: string | null;
  onUpdateTaskTime?: (taskId: string, newTime: string) => void;
}

const PERIODS = [
  { id: 'Morning', label: 'Manhã', icon: Sun, color: '#F97316' },
  { id: 'Afternoon', label: 'Tarde', icon: Coffee, color: '#22C55E' },
  { id: 'Evening', label: 'Noite', icon: Moon, color: '#818CF8' },
  { id: 'Dawn', label: 'Madrugada', icon: CloudMoon, color: '#38BDF8' }
];

export const TaskColumn = ({ id, title, tasks, isToday, lastMovedTaskId, onUpdateTaskTime }: TaskColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div 
      data-day={title}
      className={cn(
        "flex flex-col w-[340px] shrink-0 h-full transition-opacity duration-300",
        !isToday && "opacity-80 hover:opacity-100"
      )}
    >
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col">
          <h3 className={cn(
            "text-2xl font-serif font-bold tracking-tight",
            isToday ? "text-white" : "text-zinc-500"
          )}>
            {title}
          </h3>
          {isToday && (
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#38BDF8] mt-1">Hoje</span>
          )}
        </div>
        <button className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-10">
        {PERIODS.map((period) => {
          const periodTasks = tasks.filter(t => t.period === period.id);
          const Icon = period.icon;

          return (
            <div key={period.id} className="flex flex-col gap-3 min-h-[40px]">
              <div 
                ref={setNodeRef}
                id={`${id}:${period.id}`}
                className="flex items-center gap-2 mb-1 px-1"
              >
                <Icon size={14} style={{ color: period.color }} />
                <span 
                  className="text-[10px] font-black uppercase tracking-[0.2em]"
                  style={{ color: period.color }}
                >
                  {period.label}
                </span>
                <div className="flex-1 h-px bg-white/[0.03] ml-2" />
                <span className="text-[10px] font-bold text-zinc-600 ml-2">
                  {periodTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-3 min-h-[40px]">
                <SortableContext 
                  id={`${id}:${period.id}`}
                  items={periodTasks.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {periodTasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      isAwaitingTime={lastMovedTaskId === task.id}
                      onUpdateTime={(newTime) => onUpdateTaskTime?.(task.id, newTime)}
                      defaultPeriodTime={period.id === 'Morning' ? '09:00' : period.id === 'Afternoon' ? '14:00' : '19:00'}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};