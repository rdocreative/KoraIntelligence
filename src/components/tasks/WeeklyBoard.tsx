"use client";

import React, { useState } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { TaskColumn } from './TaskColumn';
import { TaskCard } from './TaskCard';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Task {
  id: string;
  content: string;
  time: string;
  period: string;
  date: Date;
}

const PERIODS = [
  { id: 'Morning', start: 6, end: 12, default: '09:00' },
  { id: 'Afternoon', start: 12, end: 18, default: '15:00' },
  { id: 'Evening', start: 18, end: 24, default: '21:00' },
  { id: 'Dawn', start: 0, end: 6, default: '03:00' }
];

const getPeriodFromTime = (time: string) => {
  const [hours] = time.split(':').map(Number);
  if (hours >= 0 && hours < 6) return 'Dawn';
  if (hours >= 6 && hours < 12) return 'Morning';
  if (hours >= 12 && hours < 18) return 'Afternoon';
  return 'Evening';
};

export const WeeklyBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', content: 'Reunião de Design', time: '10:00', period: 'Morning', date: new Date() },
    { id: '2', content: 'Almoço com equipe', time: '13:00', period: 'Afternoon', date: new Date() },
    { id: '3', content: 'Revisão de código', time: '19:00', period: 'Evening', date: new Date() },
  ]);
  
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Format of overId is "dateString:periodId" from TaskColumn
    const [dateStr, periodId] = overId.split(':');
    
    if (dateStr && periodId) {
      setTasks(prev => {
        return prev.map(t => {
          if (t.id === activeId) {
            // Find the target period to get default time
            const targetPeriod = PERIODS.find(p => p.id === periodId);
            const [hours] = t.time.split(':').map(Number);
            let newTime = t.time;
            
            // Check if current time is strictly within the new period's bounds
            let isValid = false;
            if (targetPeriod) {
               if (hours >= targetPeriod.start && hours < targetPeriod.end) {
                 isValid = true;
               }
            }

            // If time doesn't fit in new period, FORCE update to default time
            if (!isValid && targetPeriod) {
               newTime = targetPeriod.default;
            }

            return {
              ...t,
              period: periodId,
              date: new Date(dateStr),
              time: newTime
            };
          }
          return t;
        });
      });
      setLastMovedTaskId(activeId);
    }
    
    setActiveTask(null);
  };

  const updateTaskTime = (taskId: string, newTime: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        // Automatically determine the correct period based on the new time
        // This forces the task to move to the correct column immediately
        const newPeriod = getPeriodFromTime(newTime);
        return { ...t, time: newTime, period: newPeriod };
      }
      return t;
    }));
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
              const dateStr = day.toISOString();
              const dayTasks = tasks.filter(t => isSameDay(t.date, day));
              
              return (
                <TaskColumn
                  key={day.toISOString()}
                  id={dateStr}
                  title={format(day, 'EEEE', { locale: ptBR })}
                  tasks={dayTasks}
                  isToday={isSameDay(day, new Date())}
                  lastMovedTaskId={lastMovedTaskId}
                  onUpdateTaskTime={updateTaskTime}
                />
              );
            })}
            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};