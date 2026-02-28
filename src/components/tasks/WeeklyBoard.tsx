"use client";

import React, { useState } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { TaskColumn } from './TaskColumn';
import { TaskCard } from './TaskCard';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";

interface Task {
  id: string;
  name: string;
  time: string;
  period: string;
  date: Date | string;
  icon?: string;
  priority?: 'Baixa' | 'Media' | 'Alta' | 'Extrema';
  status: 'pendente' | 'concluido';
}

interface WeeklyBoardProps {
  tasks: Task[];
  isLoading: boolean;
  onUpdateTask: (taskId: string, updates: any) => void;
  onDragEndCallback: (taskId: string, dateStr: string, periodId: string, time: string) => void;
}

const PERIODS = [
  { id: 'Morning', start: 6, end: 12, default: '09:00', label: 'Manhã' },
  { id: 'Afternoon', start: 12, end: 18, default: '15:00', label: 'Tarde' },
  { id: 'Evening', start: 18, end: 24, default: '21:00', label: 'Noite' },
  { id: 'Dawn', start: 0, end: 6, default: '03:00', label: 'Madrugada' }
];

export const WeeklyBoard = ({ tasks, isLoading, onUpdateTask, onDragEndCallback }: WeeklyBoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [lastMovedTaskId, setLastMovedTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const [dateStr, periodId] = overId.split(':');
    
    const task = tasks.find(t => t.id === activeId);
    if (!task) return;

    const targetPeriod = PERIODS.find(p => p.id === periodId);
    const [hours] = task.time.split(':').map(Number);
    let newTime = task.time;
    
    let isValid = false;
    if (targetPeriod) {
       if (hours >= targetPeriod.start && hours < targetPeriod.end) {
         isValid = true;
       }
    }

    if (!isValid && targetPeriod) {
       newTime = targetPeriod.default;
       toast.info(`Horário ajustado para ${newTime}`);
    }

    // Reportar mudança para a página principal
    onDragEndCallback(activeId, dateStr, periodId, newTime);
    setLastMovedTaskId(activeId);
    setActiveTask(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full min-w-max p-4 gap-4">
          <DndContext 
            sensors={sensors} 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
          >
            {weekDays.map(day => {
              const dateId = format(day, 'yyyy-MM-dd');
              const dayTasks = tasks.filter(t => isSameDay(new Date(t.date + (typeof t.date === 'string' ? 'T12:00:00' : '')), day));
              
              return (
                <TaskColumn
                  key={day.toISOString()}
                  id={dateId}
                  title={format(day, 'EEEE', { locale: ptBR })}
                  tasks={dayTasks}
                  isToday={isSameDay(day, new Date())}
                  lastMovedTaskId={lastMovedTaskId}
                  onUpdateTaskStatus={(taskId, status) => onUpdateTask(taskId, { status })}
                  onUpdateTask={onUpdateTask}
                  isLoading={isLoading}
                />
              );
            })}
            <DragOverlay>
              {activeTask ? (
                <TaskCard 
                  task={activeTask} 
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};