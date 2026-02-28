"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import { Sun, Sunset, Moon, Coffee } from "lucide-react";

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
  isToday: boolean;
  lastMovedTaskId: string | null;
  onUpdateTaskStatus: (taskId: string, status: string) => void;
  onUpdateTask: (taskId: string, updates: any) => void;
  onDeleteTask: (taskId: string) => void;
}

const PERIODS = [
  { id: 'Dawn', label: 'Madrugada', icon: Moon, color: 'text-indigo-400', range: '00:00 - 06:00' },
  { id: 'Morning', label: 'Manhã', icon: Coffee, color: 'text-amber-400', range: '06:00 - 12:00' },
  { id: 'Afternoon', label: 'Tarde', icon: Sun, color: 'text-orange-400', range: '12:00 - 18:00' },
  { id: 'Evening', label: 'Noite', icon: Sunset, color: 'text-purple-400', range: '18:00 - 00:00' }
];

export function TaskColumn({ 
  id, 
  title, 
  tasks, 
  isToday, 
  lastMovedTaskId,
  onUpdateTaskStatus,
  onUpdateTask,
  onDeleteTask
}: TaskColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div 
      data-day={title}
      className={cn(
        "flex flex-col w-[260px] shrink-0 h-full transition-all duration-300",
        isToday ? "opacity-100" : "opacity-80"
      )}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex flex-col">
          <h3 className={cn(
            "text-[14px] font-bold tracking-tight transition-colors",
            isToday ? "text-[#6366f1]" : "text-zinc-200"
          )}>
            {title}
          </h3>
          <span className="text-[10px] font-medium text-white/20 uppercase tracking-widest">
            {tasks.length} {tasks.length === 1 ? 'Tarefa' : 'Tarefas'}
          </span>
        </div>
        {isToday && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-1 pb-10">
        {PERIODS.map((period) => {
          const periodTasks = tasks.filter(t => t.period === period.id);
          const periodId = `${id}:${period.id}`;

          return (
            <div key={period.id} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 px-1">
                <period.icon size={12} className={period.color} />
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-wider">{period.label}</span>
                <div className="h-px flex-1 bg-white/[0.04]" />
              </div>

              <div 
                id={periodId}
                ref={setNodeRef}
                className={cn(
                  "flex flex-col gap-2 min-h-[40px] rounded-2xl transition-colors max-h-[250px] overflow-y-auto custom-scrollbar px-0.5 py-0.5",
                  periodTasks.length === 0 && "border border-dashed border-white/[0.03] bg-white/[0.01]"
                )}
              >
                <SortableContext 
                  items={periodTasks.map(t => t.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  {periodTasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      isHighlighted={lastMovedTaskId === task.id}
                      onUpdateStatus={(status) => onUpdateTaskStatus(task.id, status)}
                      onUpdateTask={(updates) => onUpdateTask(task.id, updates)}
                      onDelete={() => onDeleteTask(task.id)}
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
}