"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
  isToday?: boolean;
  lastMovedTaskId?: string | null;
  onUpdateTaskTime: (taskId: string, newTime: string) => void;
  onUpdateTask: (taskId: string, updates: any) => void;
}

export function TaskColumn({ 
  id, 
  title, 
  tasks, 
  isToday, 
  lastMovedTaskId,
  onUpdateTask 
}: TaskColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  const periods = [
    { id: 'Morning', label: 'Manhã', emoji: '🌅' },
    { id: 'Afternoon', label: 'Tarde', emoji: '☀️' },
    { id: 'Evening', label: 'Noite', emoji: '🌙' },
    { id: 'Dawn', label: 'Madrugada', emoji: '✨' }
  ];

  return (
    <div 
      data-day={title}
      className={cn(
        "flex flex-col min-w-[300px] w-[300px] rounded-2xl transition-all duration-300 h-full",
        isToday ? "bg-white/[0.03] ring-1 ring-white/10" : "bg-transparent border border-white/5"
      )}
    >
      <div className="p-4 border-b border-white/5 shrink-0">
        <h3 className={cn(
          "text-sm font-semibold tracking-wide uppercase",
          isToday ? "text-white" : "text-white/40"
        )}>
          {title}
        </h3>
      </div>
      
      <div 
        ref={setNodeRef}
        className="flex-1 p-3 space-y-6 overflow-y-auto custom-scrollbar"
      >
        {periods.map(period => (
          <div key={period.id} className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs">{period.emoji}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                {period.label}
              </span>
            </div>
            
            <div className="space-y-2 min-h-[50px]">
              <SortableContext 
                id={`${id}:${period.id}`}
                items={tasks.filter(t => t.period === period.id).map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {tasks
                  .filter(t => t.period === period.id)
                  .map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      isLastMoved={task.id === lastMovedTaskId}
                      onUpdate={onUpdateTask}
                    />
                  ))
                }
              </SortableContext>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}