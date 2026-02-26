"use client";

import React, { useState } from 'react';
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
  DragEndEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { TaskColumn } from '@/components/tasks/TaskColumn';
import { TaskCard } from '@/components/tasks/TaskCard';
import { ChevronLeft, ChevronRight, CalendarDays, MoreHorizontal, Zap, LayoutGrid } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const INITIAL_DATA: Record<string, any[]> = {
  'Segunda': [
    { id: '1', name: 'Reunião de Planejamento', duration: 60, period: 'Morning', priority: 'Extrema', icon: '📅' },
    { id: '2', name: 'Revisão de Código', duration: 45, period: 'Morning', priority: 'Alta', icon: '💻' },
    { id: '3', name: 'Almoço', duration: 60, period: 'Afternoon', icon: '🥗' },
    { id: '4', name: 'Desenvolvimento Frontend', duration: 120, period: 'Afternoon', priority: 'Média', icon: '⚡' },
  ],
  'Terça': [
    { id: '5', name: 'Daily Scrum', duration: 15, period: 'Morning', priority: 'Baixa', icon: '☕' },
    { id: '6', name: 'Ajustes de Design', duration: 90, period: 'Afternoon', icon: '🎨' },
  ],
  'Quarta': [],
  'Quinta': [],
  'Sexta': []
};

export default function Tasks() {
  const [tasks, setTasks] = useState(INITIAL_DATA);
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [isTimelineMode, setIsTimelineMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: string) => {
    // Se o id for uma chave de dia (coluna)
    if (id in tasks) return id;
    
    // Procura em qual dia a tarefa está
    return Object.keys(tasks).find(key => tasks[key].find((t: any) => t.id === id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeContainer = findContainer(active.id as string);
    if (activeContainer) {
        const task = tasks[activeContainer].find((t: any) => t.id === active.id);
        setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Implementação básica de drag over
    // Para uma implementação completa seria necessário lidar com a lógica de mover entre colunas/períodos
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090B] text-white overflow-hidden font-sans selection:bg-[#38BDF8]/30">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#09090B]/50 backdrop-blur-xl z-10 shrink-0">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
                <CalendarDays size={18} />
                <span className="font-semibold text-sm">Outubro 2023</span>
            </div>
            
            <div className="h-4 w-px bg-white/10" />
            
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                <button className="p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white">
                    <ChevronLeft size={16} />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button className="p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white">
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-white/[0.03] px-4 py-2 rounded-full border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2">
                    <Zap size={14} className={cn("transition-colors", isTimelineMode ? "text-[#38BDF8]" : "text-zinc-500")} />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Modo Foco</span>
                </div>
                <Switch checked={isTimelineMode} onCheckedChange={setIsTimelineMode} className="scale-75 origin-right" />
            </div>
            
            <button className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
                <LayoutGrid size={20} />
            </button>
            
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#38BDF8] to-[#818CF8] ring-2 ring-white/10 shadow-[0_0_20px_rgba(56,189,248,0.3)]" />
        </div>
      </header>

      {/* Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100">
        <div className="h-full flex px-6 py-6 gap-6 min-w-max">
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {Object.entries(tasks).map(([day, dayTasks]) => (
                    <TaskColumn 
                        key={day}
                        id={day}
                        title={day}
                        tasks={dayTasks}
                        isToday={day === 'Segunda'}
                        isTimelineMode={isTimelineMode}
                    />
                ))}
                
                <DragOverlay>
                    {activeTask ? (
                        <TaskCard task={activeTask} isOverlay />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
      </div>
    </div>
  );
}