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
  ChevronDown,
  ChevronLeft,
  ChevronRight
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
  
  // Refs para funcionalidade de drag-to-scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const currentDayName = useMemo(() => {
    return WEEK_DAYS[new Date().getDay()];
  }, []);

  // Scroll inicial para o dia atual
  useEffect(() => {
    const todayIndex = DISPLAY_ORDER.indexOf(currentDayName);
    if (todayIndex !== -1 && scrollRef.current) {
        // Pequeno delay para garantir renderização
        setTimeout(() => {
            if (scrollRef.current) {
                const container = scrollRef.current;
                const columnWidth = container.children[0].children[0].getBoundingClientRect().width;
                const gap = 16; // 4 * 4px (tailwind gap-4)
                
                // Centraliza o dia atual ou coloca no início
                const scrollPos = (columnWidth + gap) * todayIndex;
                container.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }
        }, 100);
    }
  }, []);

  const findDay = (id: string) => {
    if (DISPLAY_ORDER.includes(id)) return id;
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

  // Funções para drag-to-scroll horizontal
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[data-draggable]')) return;
    setIsScrolling(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const onMouseLeave = () => setIsScrolling(false);
  const onMouseUp = () => setIsScrolling(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isScrolling || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="flex-1 flex flex-col h-full animate-in fade-in duration-700 min-h-0">
      
      {/* Header Centralizado e Miniaturizado */}
      <header className="flex flex-col items-center justify-center py-1 shrink-0 space-y-1 mb-2">
        <h2 className="text-lg font-serif font-medium text-white tracking-tight text-center">Quadro Semanal</h2>
        <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-[#38BDF8]/10 px-3 py-1 rounded-full text-[#38BDF8] border border-[#38BDF8]/20">
          Fev • Semana 08
        </span>
      </header>

      <div className="hidden md:flex justify-end px-4 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl text-xs font-semibold text-zinc-300 cursor-pointer hover:text-white transition-colors">
            <span>Visão Semanal</span>
            <ChevronDown size={14} />
          </div>
      </div>

      <div 
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className={cn(
          "flex-1 flex min-h-0 pb-0 overflow-x-auto custom-scrollbar cursor-grab select-none snap-x snap-mandatory scroll-smooth",
          isScrolling && "cursor-grabbing"
        )}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* gap-4 no mobile para espaçamento entre dias */}
          <div className="flex gap-4 md:gap-5 items-start h-full md:pr-10 px-2 md:px-0">
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