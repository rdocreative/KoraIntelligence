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

// Mock de dados atualizado com períodos
const INITIAL_DATA: Record<string, any[]> = {
  'Segunda': [
    { id: 't1', name: 'Reunião Semanal', time: '09:00', icon: '💬', priority: 'Extrema', period: 'Morning' },
    { id: 't2', name: 'Responder E-mails', time: '10:30', icon: '📧', priority: 'Baixa', period: 'Morning' },
    { id: 't8', name: 'Beber Água', time: '3L', icon: '💧', priority: 'Média', period: 'Anytime' }
  ],
  'Terça': [
    { id: 't3', name: 'Design Review', time: '14:00', icon: '🎨', priority: 'Média', period: 'Afternoon' }
  ],
  'Quarta': [
    { id: 't4', name: 'Deep Work: Backend', time: '08:00', icon: '💻', priority: 'Extrema', period: 'Morning' },
    { id: 't5', name: 'Treino de Pernas', time: '18:00', icon: '🏋️‍♂️', priority: 'Média', period: 'Evening' }
  ],
  'Quinta': [
    { id: 't9', name: 'Leitura', time: '20m', icon: '📚', priority: 'Baixa', period: 'Evening' }
  ],
  'Sexta': [
    { id: 't6', name: 'Happy Hour', time: '19:00', icon: '🍻', priority: 'Baixa', period: 'Evening' }
  ],
  'Sábado': [],
  'Domingo': [
    { id: 't7', name: 'Planejamento', time: '20:00', icon: '📅', priority: 'Média', period: 'Evening' }
  ]
};

const WEEK_DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function TasksPage() {
  const [columns, setColumns] = useState(INITIAL_DATA);
  const [activeTask, setActiveTask] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findColumn = (id: string) => {
    if (id in columns) return id;
    return Object.keys(columns).find((key) => columns[key].find((task) => task.id === id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const columnId = findColumn(active.id as string);
    if (!columnId) return;
    
    const task = columns[columnId].find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeColumn = findColumn(active.id as string);
    const overColumn = findColumn(over.id as string);

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setColumns((prev) => {
      const activeItems = prev[activeColumn];
      const overItems = prev[overColumn];

      const activeIndex = activeItems.findIndex((i) => i.id === active.id);
      const overIndex = overItems.findIndex((i) => i.id === over.id);

      let newIndex;
      if (over.id in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1;
        const modifier = isBelowLastItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeColumn]: activeItems.filter((i) => i.id !== active.id),
        [overColumn]: [
          ...overItems.slice(0, newIndex),
          activeItems[activeIndex],
          ...overItems.slice(newIndex)
        ]
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeColumn = findColumn(active.id as string);
    const overColumn = findColumn(over.id as string);

    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      setActiveTask(null);
      return;
    }

    const activeIndex = columns[activeColumn].findIndex((i) => i.id === active.id);
    const overIndex = columns[overColumn].findIndex((i) => i.id === over.id);

    if (activeIndex !== overIndex) {
      setColumns((prev) => ({
        ...prev,
        [overColumn]: arrayMove(prev[overColumn], activeIndex, overIndex)
      }));
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
              styles: {
                active: {
                  opacity: '0.5',
                },
              },
            }),
          }}>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}