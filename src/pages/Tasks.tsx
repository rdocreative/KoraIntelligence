"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  LayoutGrid,
  Calendar as CalendarIcon,
  Sparkles
} from 'lucide-react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { TaskColumn } from '@/components/tasks/TaskColumn';
import { TaskCard } from '@/components/tasks/TaskCard';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const INITIAL_TASKS = [
  { id: '1', name: 'Meditação Matinal', time: '07:30', icon: '🧘', priority: 'Baixa', period: 'Morning', dayId: format(new Date(), 'yyyy-MM-dd') },
  { id: '2', name: 'Reunião de Alinhamento', time: '10:00', icon: '💼', priority: 'Extrema', period: 'Morning', dayId: format(new Date(), 'yyyy-MM-dd') },
  { id: '3', name: 'Treino de Pernas', time: '16:00', icon: '💪', priority: 'Média', period: 'Afternoon', dayId: format(new Date(), 'yyyy-MM-dd') },
  { id: '4', name: 'Leitura: Filosofia', time: '21:30', icon: '📚', priority: 'Baixa', period: 'Evening', dayId: format(new Date(), 'yyyy-MM-dd') },
];

const TasksPage = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lastMovedTaskId, setLastMovedTaskId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
    return {
      id: format(date, 'yyyy-MM-dd'),
      title: format(date, "EEEE, d 'de' MMMM", { locale: ptBR }),
      shortTitle: format(date, 'EEE, d', { locale: ptBR }),
      isToday: isSameDay(date, new Date())
    };
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setLastMovedTaskId(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    
    if (overId.includes(':')) {
      const [dayId, periodId] = overId.split(':');
      if (activeTask.dayId !== dayId || activeTask.period !== periodId) {
        setTasks(prev => prev.map(t => 
          t.id === active.id ? { ...t, dayId, period: periodId } : t
        ));
      }
    } else {
      const overTask = tasks.find(t => t.id === over.id);
      if (overTask && (activeTask.dayId !== overTask.dayId || activeTask.period !== overTask.period)) {
        setTasks(prev => prev.map(t => 
          t.id === active.id ? { ...t, dayId: overTask.dayId, period: overTask.period } : t
        ));
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      
      if (newIndex !== -1) {
        setTasks(prev => arrayMove(prev, oldIndex, newIndex));
      }
    }

    const task = tasks.find(t => t.id === active.id);
    const originalTask = INITIAL_TASKS.find(t => t.id === active.id);
    
    if (task && originalTask && (task.dayId !== originalTask.dayId || task.period !== originalTask.period)) {
      setLastMovedTaskId(active.id as string);
    } else {
      setActiveId(null);
    }
  };

  const handleUpdateTaskTime = (taskId: string, newTime: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, time: newTime } : t));
    setLastMovedTaskId(null);
    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <div className="flex-1 flex flex-col py-8 h-full relative">
      <header className="flex items-center justify-between mb-10 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-4xl font-medium tracking-tight text-white mb-1">Minhas Tarefas</h1>
            <p className="text-zinc-500 text-sm font-medium">Você tem {tasks.length} tarefas programadas para esta semana</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-2xl p-1">
            <button className="p-2.5 text-zinc-400 hover:text-white transition-colors">
              <Search size={18} />
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-white/5 rounded-xl hover:bg-white/10 transition-all">
              <CalendarIcon size={16} className="text-[#6366f1]" />
              Esta Semana
            </button>
          </div>
          <button className="p-3 bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white rounded-2xl transition-all">
            <LayoutGrid size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 relative min-h-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 h-full custom-scrollbar snap-x snap-mandatory"
          >
            {days.map((day) => (
              <TaskColumn
                key={day.id}
                id={day.id}
                title={day.title}
                isToday={day.isToday}
                tasks={tasks.filter(t => t.dayId === day.id)}
                lastMovedTaskId={lastMovedTaskId}
                onUpdateTaskTime={handleUpdateTaskTime}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.5',
                },
              },
            }),
          }}>
            {activeTask ? (
              <div className="w-72 scale-105 rotate-2 transition-transform">
                <TaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <button className="absolute bottom-8 right-0 w-16 h-16 bg-[#6366f1] text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-[#6366f1]/40 hover:scale-105 active:scale-95 transition-all group z-30">
        <Plus size={32} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default TasksPage;