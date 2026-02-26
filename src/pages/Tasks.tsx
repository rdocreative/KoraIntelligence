"use client";

import React, { useState } from "react";
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
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { TaskColumn } from "@/components/tasks/TaskColumn";
import { TaskCard } from "@/components/tasks/TaskCard";
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays,
  MoreHorizontal,
  ChevronDown
} from "lucide-react";

const INITIAL_DATA: Record<string, any[]> = {
  'Segunda': [
    { id: 't1', name: 'Reunião Semanal', time: '09:00', icon: '💬', priority: 'Extrema', period: 'Morning' },
    { id: 't2', name: 'Responder E-mails', time: '10:30', icon: '📧', priority: 'Baixa', period: 'Morning' },
  ],
  'Terça': [
    { id: 't3', name: 'Design Review', time: '14:00', icon: '🎨', priority: 'Média', period: 'Afternoon' }
  ],
  'Quarta': [
    { id: 't4', name: 'Deep Work: Backend', time: '08:00', icon: '💻', priority: 'Extrema', period: 'Morning' },
    { id: 't5', name: 'Treino de Pernas', time: '18:00', icon: '🏋️‍♂️', priority: 'Média', period: 'Evening' }
  ],
  'Quinta': [],
  'Sexta': [
    { id: 't6', name: 'Happy Hour', time: '19:00', icon: '🍻', priority: 'Baixa', period: 'Evening' }
  ],
  'Sábado': [],
  'Domingo': []
};

const WEEK_DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function TasksPage() {
  const [columns, setColumns] = useState(INITIAL_DATA);
  const [activeTask, setActiveTask] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findDay = (id: string) => {
    if (WEEK_DAYS.includes(id)) return id;
    if (id.includes(':')) return id.split(':')[0];
    return Object.keys(columns).find((key) => columns[key].find((task) => task.id === id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const day = findDay(active.id as string);
    if (day) {
      setActiveTask(columns[day].find((t) => t.id === active.id));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeDay = findDay(activeId);
    let overDay = findDay(overId);

    if (!activeDay || !overDay) return;

    let overPeriod = activeTask?.period;
    if (overId.includes(':')) {
      overPeriod = overId.split(':')[1];
    } else {
      const targetTask = columns[overDay].find(t => t.id === overId);
      if (targetTask) overPeriod = targetTask.period;
    }

    if (activeDay !== overDay || activeTask?.period !== overPeriod) {
      setColumns((prev) => {
        const activeItems = prev[activeDay].filter(i => i.id !== activeId);
        const overItems = [...prev[overDay]];
        
        const taskToMove = { ...activeTask, period: overPeriod };
        
        const overIndex = overItems.findIndex(i => i.id === overId);
        const newIndex = overIndex >= 0 ? overIndex : overItems.length;

        // Se for o mesmo dia, atualizamos apenas uma lista
        if (activeDay === overDay) {
          const updatedDayItems = prev[activeDay].filter(i => i.id !== activeId);
          updatedDayItems.splice(newIndex, 0, taskToMove);
          return { ...prev, [activeDay]: updatedDayItems };
        }

        // Se forem dias diferentes
        return {
          ...prev,
          [activeDay]: activeItems,
          [overDay]: [
            ...overItems.slice(0, newIndex),
            taskToMove,
            ...overItems.slice(newIndex)
          ]
        };
      });
      
      if (activeTask) {
        setActiveTask({ ...activeTask, period: overPeriod });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeDay = findDay(active.id as string);
    const overDay = findDay(over.id as string);

    if (activeDay && overDay && activeDay === overDay) {
      const activeIndex = columns[activeDay].findIndex((i) => i.id === active.id);
      const overIndex = columns[overDay].findIndex((i) => i.id === over.id);

      if (activeIndex !== overIndex && overIndex !== -1) {
        setColumns((prev) => ({
          ...prev,
          [activeDay]: arrayMove(prev[activeDay], activeIndex, overIndex)
        }));
      }
    }

    setActiveTask(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full animate-in fade-in duration-700 min-h-0">
      <header className="flex items-center justify-between py-6 shrink-0">
        <div className="flex items-center gap-4">
          <button className="p-1.5 border border-white/10 rounded-xl hover:bg-white/5 text-zinc-400 transition-colors">
            <CalendarDays size={16} />
          </button>
          <div className="flex items-center gap-3">
            <button className="p-1 text-gray-400 hover:text-white transition-colors"><ChevronLeft size={18} /></button>
            <h2 className="text-3xl font-serif text-white tracking-tight italic">Quadro Semanal</h2>
            <button className="p-1 text-gray-400 hover:text-white transition-colors"><ChevronRight size={18} /></button>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-[#38BDF8]/10 px-3 py-1 rounded-full text-[#38BDF8]">
            Semana 08
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 cursor-pointer hover:text-white transition-colors">
            <span>Visão Semanal</span>
            <ChevronDown size={14} />
          </div>
          <button className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 text-zinc-400">
             <MoreHorizontal size={16} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-8 custom-scrollbar min-h-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {WEEK_DAYS.map((day) => (
            <TaskColumn 
              key={day} 
              id={day} 
              title={day} 
              tasks={columns[day]} 
              isToday={day === 'Quarta'} 
            />
          ))}

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: { active: { opacity: '0.5' } },
            }),
          }}>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}