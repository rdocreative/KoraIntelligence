"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { TaskColumn } from './TaskColumn';
import { TaskCard } from './TaskCard';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Task {
  id: string;
  name: string;
  time: string;
  period: string;
  date: Date;
  icon?: string;
  priority?: 'Baixa' | 'Media' | 'Alta' | 'Extrema';
  status: 'pendente' | 'concluido';
}

const PERIODS = [
  { id: 'Morning', start: 6, end: 12, default: '09:00', label: 'Manhã' },
  { id: 'Afternoon', start: 12, end: 18, default: '15:00', label: 'Tarde' },
  { id: 'Evening', start: 18, end: 24, default: '21:00', label: 'Noite' },
  { id: 'Dawn', start: 0, end: 6, default: '03:00', label: 'Madrugada' }
];

const getPeriodFromTime = (time: string) => {
  const [hours] = time.split(':').map(Number);
  if (hours >= 0 && hours < 6) return 'Dawn';
  if (hours >= 6 && hours < 12) return 'Morning';
  if (hours >= 12 && hours < 18) return 'Afternoon';
  return 'Evening';
};

export const WeeklyBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const startDate = format(weekDays[0], 'yyyy-MM-dd');
      const endDate = format(weekDays[6], 'yyyy-MM-dd');

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .gte('data', startDate)
        .lte('data', endDate);

      if (fetchError) throw fetchError;

      const formattedTasks: Task[] = (data || []).map(t => ({
        id: t.id,
        name: t.nome,
        time: t.horario,
        period: t.periodo,
        date: new Date(t.data + 'T12:00:00'),
        icon: t.emoji,
        priority: t.prioridade as any,
        status: t.status as any
      }));

      setTasks(formattedTasks);
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
      setError("Erro ao carregar tarefas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
    const targetDay = weekDays.find(d => format(d, 'yyyy-MM-dd') === dateStr);

    if (targetDay && periodId) {
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
      }

      setTasks(prev => prev.map(t => {
        if (t.id === activeId) {
          return { ...t, period: periodId, date: targetDay, time: newTime };
        }
        return t;
      }));

      try {
        const { error: updateError } = await supabase
          .from('tasks')
          .update({
            periodo: periodId,
            data: format(targetDay, 'yyyy-MM-dd'),
            horario: newTime
          })
          .eq('id', activeId);

        if (updateError) throw updateError;
        
        if (!isValid) {
          toast.info(`Horário ajustado para ${newTime}`);
        }
      } catch (err) {
        toast.error("Erro ao sincronizar movimento");
        fetchTasks();
      }

      setLastMovedTaskId(activeId);
    }
    
    setActiveTask(null);
  };

  const updateTaskStatus = async (taskId: string, status: 'pendente' | 'concluido') => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    try {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);
      if (updateError) throw updateError;
    } catch (err) {
      toast.error("Erro ao atualizar status");
      fetchTasks();
    }
  };

  const updateTaskDetails = async (taskId: string, updates: any) => {
    const dbUpdates = {
      nome: updates.name,
      emoji: updates.icon,
      prioridade: updates.priority === 'Média' ? 'Media' : updates.priority,
      horario: updates.time,
      periodo: getPeriodFromTime(updates.time)
    };

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { 
          ...t, 
          name: updates.name, 
          icon: updates.icon, 
          priority: updates.priority, 
          time: updates.time,
          period: dbUpdates.periodo
        };
      }
      return t;
    }));

    try {
      const { error: updateError } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', taskId);
      if (updateError) throw updateError;
      toast.success("Tarefa atualizada");
    } catch (err) {
      toast.error("Erro ao salvar alterações");
      fetchTasks();
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {error}
        </p>
      </div>
    );
  }

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
              const dayTasks = tasks.filter(t => isSameDay(t.date, day));
              
              return (
                <TaskColumn
                  key={day.toISOString()}
                  id={dateId}
                  title={format(day, 'EEEE', { locale: ptBR })}
                  tasks={dayTasks}
                  isToday={isSameDay(day, new Date())}
                  lastMovedTaskId={lastMovedTaskId}
                  onUpdateTaskStatus={updateTaskStatus}
                  onUpdateTask={updateTaskDetails}
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