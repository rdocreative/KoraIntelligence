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
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { MonthlyView } from "@/components/tasks/MonthlyView";
import { 
  ChevronLeft, 
  ChevronRight,
  CalendarDays,
  Plus,
  LayoutGrid
} from "lucide-react";
import { cn } from '@/lib/utils';
import { format, getWeek, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [lastMovedTaskId, setLastMovedTaskId] = useState<string | null>(null);
  const [originalTaskState, setOriginalTaskState] = useState<{ day: string; period: string } | null>(null);
  
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

  const dateInfo = useMemo(() => {
    const month = format(currentDate, "MMMM", { locale: ptBR });
    const weekNumber = getWeek(currentDate);
    return {
      month: month.charAt(0).toUpperCase() + month.slice(1),
      year: format(currentDate, "yyyy"),
      week: weekNumber.toString().padStart(2, '0')
    };
  }, [currentDate]);

  useEffect(() => {
    if (viewMode === 'weekly') {
      const timer = setTimeout(() => {
        if (scrollRef.current) {
          const todayElement = scrollRef.current.querySelector(`[data-day="${currentDayName}"]`) as HTMLElement;
          if (todayElement) {
            const containerWidth = scrollRef.current.clientWidth;
            const elementWidth = todayElement.clientWidth;
            const elementLeft = todayElement.offsetLeft;
            const scrollTo = elementLeft - (containerWidth / 2) + (elementWidth / 2);
            
            scrollRef.current.scrollTo({
              left: scrollTo,
              behavior: 'smooth'
            });
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentDayName, viewMode]);

  const handleNextDate = () => {
    setCurrentDate(prev => viewMode === 'monthly' ? addMonths(prev, 1) : prev);
  };

  const handlePrevDate = () => {
    setCurrentDate(prev => viewMode === 'monthly' ? subMonths(prev, 1) : prev);
  };

  const handleAddTask = (newTask: any) => {
    setColumns(prev => ({
      ...prev,
      [currentDayName]: [...(prev[currentDayName] || []), newTask]
    }));
  };

  const handleUpdateTask = (taskId: string, updates: any) => {
    setColumns(prev => {
      const newColumns = { ...prev };
      Object.keys(newColumns).forEach(day => {
        newColumns[day] = newColumns[day].map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        );
      });
      return newColumns;
    });
    setLastMovedTaskId(null);
    toast.success("Tarefa atualizada!");
  };

  const findDay = (id: string) => {
    if (DISPLAY_ORDER.includes(id)) return id;
    if (id.includes(':')) return id.split(':')[0];
    return Object.keys(columns).find((key) => columns[key].find((task) => task.id === id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const day = findDay(active.id as string);
    if (day) {
      const task = columns[day].find((t) => t.id === active.id);
      setActiveTask(task);
      setOriginalTaskState({ day, period: task.period });
      setLastMovedTaskId(null);
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
      setOriginalTaskState(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeDay = findDay(activeId);
    const overDay = findDay(overId);

    // Ajuste automático de horário ao mudar de turno
    if (activeTask && originalTaskState) {
      const overPeriod = activeTask.period;
      if (activeDay !== originalTaskState.day || overPeriod !== originalTaskState.period) {
        const [hours] = (activeTask.time || "09:00").split(':').map(Number);
        const periodBounds: Record<string, { start: number; end: number; default: string }> = {
          Morning: { start: 6, end: 12, default: '09:00' },
          Afternoon: { start: 12, end: 18, default: '15:00' },
          Evening: { start: 18, end: 24, default: '21:00' },
          Dawn: { start: 0, end: 6, default: '03:00' }
        };

        const bounds = periodBounds[overPeriod];
        if (bounds) {
          const isValid = hours >= bounds.start && hours < bounds.end;
          if (!isValid) {
            const newTime = bounds.default;
            setColumns(prev => {
              const updated = { ...prev };
              const currentDay = findDay(activeId);
              if (currentDay) {
                updated[currentDay] = updated[currentDay].map(t => 
                  t.id === activeId ? { ...t, time: newTime } : t
                );
              }
              return updated;
            });
            toast.info(`Horário ajustado para ${newTime}`);
          }
        }
        setLastMovedTaskId(activeId);
      }
    }

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
    setOriginalTaskState(null);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (viewMode !== 'weekly') return;
    if (!scrollRef.current) return;
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[data-draggable]')) return;
    
    setIsScrolling(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  return (
    <div className="flex-1 flex flex-col h-full animate-in fade-in duration-700 min-h-0 relative">
      <header className="flex items-center justify-between py-6 shrink-0 px-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button onClick={handlePrevDate} className="p-1 text-zinc-500 hover:text-white transition-colors"><ChevronLeft size={20} /></button>
            <h2 className="text-4xl font-serif font-medium text-white tracking-tight">
              {dateInfo.month} {viewMode === 'monthly' && dateInfo.year} <span className="text-zinc-600 font-sans text-xl ml-2">— {viewMode === 'monthly' ? 'Mês' : `Semana ${dateInfo.week}`}</span>
            </h2>
            <button onClick={handleNextDate} className="p-1 text-zinc-500 hover:text-white transition-colors"><ChevronRight size={20} /></button>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500/80 border border-white/5 px-2 py-0.5 rounded-md">
            Tempo Real
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/5">
            <button 
              onClick={() => setViewMode('weekly')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                viewMode === 'weekly' ? "bg-white/10 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <LayoutGrid size={16} />
              <span>Semanal</span>
            </button>
            <button 
              onClick={() => setViewMode('monthly')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                viewMode === 'monthly' ? "bg-white/10 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <CalendarDays size={16} />
              <span>Mensal</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 relative min-h-0 overflow-hidden">
        {viewMode === 'weekly' ? (
          <div 
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseLeave={() => setIsScrolling(false)}
            onMouseUp={() => setIsScrolling(false)}
            onMouseMove={(e) => {
              if (!isScrolling || !scrollRef.current) return;
              e.preventDefault();
              const x = e.pageX - scrollRef.current.offsetLeft;
              const walk = (x - startX) * 1.5; 
              scrollRef.current.scrollLeft = scrollLeft - walk;
            }}
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)'
            }}
            className={cn(
              "h-full flex pb-8 overflow-x-auto custom-scrollbar cursor-grab select-none px-10",
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
              <div className="flex gap-5 items-start h-full pr-10">
                {DISPLAY_ORDER.map((day) => {
                  const isToday = day === currentDayName;

                  return (
                    <TaskColumn 
                      key={day} 
                      id={day} 
                      title={day} 
                      tasks={columns[day] || []} 
                      isToday={isToday}
                      lastMovedTaskId={lastMovedTaskId}
                      onUpdateTaskTime={(taskId, newTime) => handleUpdateTask(taskId, { time: newTime })}
                      onUpdateTask={handleUpdateTask}
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
        ) : (
          <MonthlyView 
            tasksData={columns} 
            currentDate={currentDate}
          />
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-[#6366f1] hover:bg-[#6366f1]/90 text-white rounded-full shadow-2xl shadow-[#6366f1]/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group z-50"
        title="Criar nova tarefa"
      >
        <Plus size={32} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <CreateTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTask}
        selectedDay={currentDayName}
      />
    </div>
  );
}