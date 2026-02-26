"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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
  CalendarDays,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_DATA: Record<string, any[]> = {
  'Segunda': [
    { id: 't1', name: 'Reunião Semanal', time: '09:00', icon: '🤝', priority: 'Extrema', period: 'Morning' },
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

const WEEK_DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DISPLAY_ORDER = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function TasksPage() {
  const [columns, setColumns] = useState(INITIAL_DATA);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0); // Estado para controlar a aba ativa
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const currentDayName = useMemo(() => {
    return WEEK_DAYS[new Date().getDay()];
  }, []);

  // Inicializa o índice do dia atual
  useEffect(() => {
    const todayIndex = DISPLAY_ORDER.indexOf(currentDayName);
    if (todayIndex !== -1) {
      setCurrentDayIndex(todayIndex);
      // Timeout para garantir que o render ocorreu antes do scroll inicial
      setTimeout(() => scrollToDay(todayIndex), 100);
    }
  }, []);

  const findDay = (id: string) => {
    if (DISPLAY_ORDER.includes(id)) return id;
    if (id.includes(':')) return id.split(':')[0];
    return Object.keys(columns).find((key) => columns[key].find((task) => task.id === id));
  };

  const scrollToDay = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const child = container.children[0].children[index] as HTMLElement; // Acessa o TaskColumn
      if (child) {
        container.scrollTo({
          left: child.offsetLeft,
          behavior: 'smooth'
        });
        setCurrentDayIndex(index);
      }
    }
  };

  // Detecta qual dia está visível ao fazer scroll (snap)
  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollPosition = container.scrollLeft + (container.offsetWidth / 2);
      
      // Encontra o índice baseado na posição de scroll
      const width = container.offsetWidth; // No mobile, cada coluna é width: 100% (quase)
      // Ajuste simples assumindo largura total
      const newIndex = Math.floor(container.scrollLeft / container.offsetWidth + 0.5);
      
      if (newIndex !== currentDayIndex && newIndex >= 0 && newIndex < DISPLAY_ORDER.length) {
        setCurrentDayIndex(newIndex);
      }
    }
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

        if (activeDay === overDay) {
          const updatedDayItems = prev[activeDay].filter(i => i.id !== activeId);
          updatedDayItems.splice(newIndex, 0, taskToMove);
          return { ...prev, [activeDay]: updatedDayItems };
        }
        return {
          ...prev,
          [activeDay]: activeItems,
          [overDay]: [...overItems.slice(0, newIndex), taskToMove, ...overItems.slice(newIndex)]
        };
      });
      if (activeTask) setActiveTask({ ...activeTask, period: overPeriod });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) { setActiveTask(null); return; }
    const activeDay = findDay(active.id as string);
    const overDay = findDay(over.id as string);
    if (activeDay && overDay && activeDay === overDay) {
      const activeIndex = columns[activeDay].findIndex((i) => i.id === active.id);
      const overIndex = columns[overDay].findIndex((i) => i.id === over.id);
      if (activeIndex !== overIndex && overIndex !== -1) {
        setColumns((prev) => ({ ...prev, [activeDay]: arrayMove(prev[activeDay], activeIndex, overIndex) }));
      }
    }
    setActiveTask(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full animate-in fade-in duration-700 min-h-0">
      
      {/* Header Centralizado */}
      <header className="flex flex-col items-center justify-center py-2 shrink-0 space-y-2">
        <h2 className="text-xl font-serif font-medium text-white tracking-tight text-center">Quadro Semanal</h2>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-[#38BDF8]/10 px-3 py-1 rounded-full text-[#38BDF8] border border-[#38BDF8]/20">
          Semana 08
        </span>
      </header>

      {/* Tabs de Dias da Semana (Visível apenas no Mobile) */}
      <div className="md:hidden flex items-center justify-between px-2 py-3 border-b border-white/5 mb-2 overflow-x-auto custom-scrollbar">
        {DISPLAY_ORDER.map((day, index) => {
           const isSelected = index === currentDayIndex;
           const isToday = day === currentDayName;
           // Pega as primeiras 3 letras do dia (Seg, Ter...)
           const shortName = day.substring(0, 3);
           
           return (
             <button
               key={day}
               onClick={() => scrollToDay(index)}
               className={cn(
                 "flex flex-col items-center justify-center min-w-[3rem] py-1 transition-all rounded-lg gap-1",
                 isSelected ? "text-white" : "text-zinc-600 hover:text-zinc-400"
               )}
             >
               <span className={cn(
                 "text-[10px] font-black uppercase tracking-widest",
                 isSelected ? "text-white" : "text-zinc-600"
               )}>
                 {shortName}
               </span>
               <div className={cn(
                 "h-1 w-1 rounded-full transition-all",
                 isSelected ? "bg-[#38BDF8] scale-100" : "bg-transparent scale-0",
                 isToday && !isSelected && "bg-[#38BDF8]/50 scale-75" // Bolinha indicando "Hoje" mesmo inativo
               )} />
             </button>
           );
        })}
      </div>

      <div className="hidden md:flex justify-end px-4 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl text-xs font-semibold text-zinc-300 cursor-pointer hover:text-white transition-colors">
            <span>Visão Semanal</span>
            <ChevronDown size={14} />
          </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 flex min-h-0 pb-0 overflow-x-auto custom-scrollbar snap-x snap-mandatory scroll-smooth"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* Container flex com gap no desktop, sem gap no mobile (para snap perfeito) */}
          <div className="flex md:gap-5 items-start h-full md:pr-10">
            {DISPLAY_ORDER.map((day) => {
              const isToday = day === currentDayName;

              return (
                <TaskColumn 
                  key={day} 
                  id={day} 
                  title={day} 
                  tasks={columns[day] || []} 
                  isToday={isToday}
                />
              );
            })}
          </div>

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