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
  Zap,
  LayoutGrid
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const INITIAL_DATA: Record<string, any[]> = {
  'Segunda': [
    { id: 't1', name: 'Design de Interface do App', duration: 120, icon: '🎨', priority: 'Extrema', period: 'Morning' },
    { id: 't2', name: 'Alinhamento com Cliente', duration: 45, icon: '📞', priority: 'Média', period: 'Morning' },
    { id: 't8', name: 'Check-in Diário', duration: 15, icon: '✅', priority: 'Baixa', period: 'Anytime' }
  ],
  'Terça': [
    { id: 't3', name: 'Review de Código Backend', duration: 90, icon: '💻', priority: 'Média', period: 'Afternoon' }
  ],
  'Quarta': [
    { id: 't4', name: 'Deep Work: Core Engine', duration: 180, icon: '⚙️', priority: 'Extrema', period: 'Morning' },
    { id: 't5', name: 'Treino Hipertrofia', duration: 60, icon: '🏋️‍♂️', priority: 'Média', period: 'Evening' }
  ],
  'Quinta': [
    { id: 't9', name: 'Estudo de Algoritmos', duration: 45, icon: '🧠', priority: 'Baixa', period: 'Afternoon' }
  ],
  'Sexta': [
    { id: 't6', name: 'Revisão Semanal de Projetos', duration: 120, icon: '📊', priority: 'Baixa', period: 'Morning' }
  ],
  'Sábado': [],
  'Domingo': []
};

const WEEK_DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

const PERIOD_COLORS: Record<string, string> = {
  Morning: '#FDBA74',
  Afternoon: '#4ADE80',
  Evening: '#A78BFA',
  Dawn: '#818CF8',
  Anytime: '#94A3B8'
};

export default function TasksPage() {
  const [columns, setColumns] = useState(INITIAL_DATA);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [overPeriod, setOverPeriod] = useState<string | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);

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
      const task = columns[day].find((t) => t.id === active.id);
      setActiveTask(task);
      setOverPeriod(task.period);
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

    let targetPeriod = activeTask?.period;
    if (overId.includes(':')) {
      targetPeriod = overId.split(':')[1];
    } else {
      const targetTask = columns[overDay].find(t => t.id === overId);
      if (targetTask) targetPeriod = targetTask.period;
    }

    setOverPeriod(targetPeriod);

    if (activeDay !== overDay || activeTask?.period !== targetPeriod) {
      setColumns((prev) => {
        const activeItems = prev[activeDay].filter(i => i.id !== activeId);
        const overItems = [...prev[overDay]];
        
        const taskToMove = { ...activeTask, period: targetPeriod };
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
          [overDay]: [
            ...overItems.slice(0, newIndex),
            taskToMove,
            ...overItems.slice(newIndex)
          ]
        };
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
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
    }
    setActiveTask(null);
    setOverPeriod(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full animate-in fade-in duration-700 min-h-0">
      <header className="flex items-center justify-between py-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="p-1.5 border border-white/10 rounded-xl hover:bg-white/5 text-zinc-400 transition-colors">
              <CalendarDays size={16} />
            </button>
            <div className="flex items-center gap-3">
              <button className="p-1 text-gray-400 hover:text-white transition-colors"><ChevronLeft size={18} /></button>
              <h2 className="text-3xl font-serif text-white tracking-tight italic">Fluxo Semanal</h2>
              <button className="p-1 text-gray-400 hover:text-white transition-colors"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setIsFocusMode(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all",
                !isFocusMode ? "bg-[#38BDF8] text-black shadow-lg shadow-[#38BDF8]/20" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <LayoutGrid size={12} />
              Turnos
            </button>
            <button 
              onClick={() => setIsFocusMode(true)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all",
                isFocusMode ? "bg-[#A78BFA] text-black shadow-lg shadow-[#A78BFA]/20" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Zap size={12} />
              Timeline
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-zinc-400">
             <span className="text-[10px] font-black uppercase tracking-widest">Modo Foco</span>
             <Switch checked={isFocusMode} onCheckedChange={setIsFocusMode} />
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
              isTimelineMode={isFocusMode}
            />
          ))}

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: { active: { opacity: '0.5' } },
            }),
          }}>
            {activeTask ? (
              <TaskCard 
                task={activeTask} 
                isOverlay 
                targetColor={overPeriod ? PERIOD_COLORS[overPeriod] : undefined} 
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}