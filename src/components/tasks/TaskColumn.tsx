"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
  isToday?: boolean;
  lastMovedTaskId?: string | null;
  onUpdateTaskTime?: (taskId: string, newTime: string) => void;
  onUpdateTask?: (taskId: string, updates: any) => void;
  onEditTask?: (task: any) => void;
  onDeleteTask?: (id: string) => void;
}

export function TaskColumn({ 
  id, 
  title, 
  tasks, 
  isToday, 
  onEditTask,
  onDeleteTask 
}: TaskColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  const periods = [
    { name: 'Dawn', label: 'Madrugada', emoji: '🌙' },
    { name: 'Morning', label: 'Manhã', emoji: '☀️' },
    { name: 'Afternoon', label: 'Tarde', emoji: '🌤️' },
    { name: 'Evening', label: 'Noite', emoji: '🌚' }
  ];

  return (
    <div 
      className={cn(
        "flex flex-col w-[300px] shrink-0 h-full rounded-2xl p-4 transition-all",
        isToday ? "bg-white/[0.03] ring-1 ring-white/10" : "bg-transparent"
      )}
      data-day={title}
    >
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <h3 className={cn(
            "text-[15px] font-semibold tracking-tight",
            isToday ? "text-[#6366f1]" : "text-white/60"
          )}>
            {title}
          </h3>
          <span className="bg-white/5 text-white/40 text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center uppercase tracking-wider">
            {tasks.length}
          </span>
        </div>
        <button className="text-white/20 hover:text-white/60 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div ref={setNodeRef} className="flex-1 flex flex-col gap-6 min-h-[200px] pb-10 custom-scrollbar">
        {periods.map(period => {
          const periodTasks = tasks.filter(task => task.period === period.name);
          
          return (
            <div key={`${id}:${period.name}`} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs opacity-40">{period.emoji}</span>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em]">
                  {period.label}
                </span>
                <div className="h-[1px] flex-1 bg-white/5 ml-2" />
              </div>

              <div id={`${id}:${period.name}`} className="min-h-[20px]">
                <SortableContext 
                  items={periodTasks.map(t => t.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  {periodTasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
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