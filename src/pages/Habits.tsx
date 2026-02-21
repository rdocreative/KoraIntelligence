"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Plus, Check, ChevronLeft, ChevronRight, 
  LayoutGrid, Clock, Flame, 
  BarChart3, CheckCircle2, Pencil, Trash2, 
  Play, Pause, CalendarDays, Target,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  getDay,
  startOfWeek,
  endOfWeek,
  setMonth,
  setYear,
  getYear,
  getMonth,
  addWeeks,
  subWeeks
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import WeeklyView from "@/components/habits/WeeklyView";

// --- Types ---
type Priority = 'high' | 'medium' | 'low';
type Frequency = 'daily' | 'weekly';

interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: Frequency;
  priority: Priority;
  weekDays: number[];
  time: string;
  completedDates: string[];
  active: boolean;
}

// --- Sortable Item Component ---
interface SortableItemProps {
  habit: Habit;
  isCompleted: boolean;
  onEdit: (habit: Habit, rect: DOMRect) => void;
  onToggle: (id: string) => void;
}

const SortableHabitItem = ({ habit, isCompleted, onEdit, onToggle }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: habit.id,
    transition: null,
    disabled: isCompleted 
  });

  const cardRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const priorityStyles = {
    high: "bg-[linear-gradient(180deg,#350c0c_0%,#120606_100%)] border-[#ef444425]",
    medium: "bg-[linear-gradient(180deg,#351f00_0%,#120a00_100%)] border-[#f59e0b25]",
    low: "bg-[linear-gradient(180deg,#003518_0%,#001206_100%)] border-[#10b98125]"
  };

  return (
    <div 
      ref={(node) => {
        setNodeRef(node);
        cardRef.current = node as HTMLDivElement;
      }}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group rounded-[10px] border p-[14px] px-[16px] mb-2 cursor-grab active:cursor-grabbing select-none",
        isDragging 
          ? "scale-[1.03] border-[#00e5cc60] bg-[#0d1e1c] shadow-2xl ring-2 ring-[#00e5cc20]" 
          : priorityStyles[habit.priority],
        isCompleted && !isDragging && "opacity-[0.45]"
      )}
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(habit.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 z-10",
            isCompleted ? "bg-[#00e5cc] border-[#00e5cc]" : "border-[#5a8a85] hover:border-[#00e5cc]"
          )}
        >
          {isCompleted && <Check size={12} className="text-[#071412] stroke-[3px]" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-[14px] font-[600] text-[#e8f5f3] truncate leading-tight",
            isCompleted && "line-through opacity-70"
          )}>
            {habit.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-[12px] font-[400] text-[#5a8a85]">
              <Clock size={11} className="text-[#00e5cc]" />
              {habit.time}
            </div>
          </div>
        </div>

        {!isCompleted && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (cardRef.current) onEdit(habit, cardRef.current.getBoundingClientRect());
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 text-[#5a8a85] hover:text-[#00e5cc] z-10"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

// --- Floating Edit Popup ---
interface EditPopupProps {
  habit: Habit;
  rect: DOMRect | null;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const EditPopup = ({ habit, rect, onClose, onSave, onDelete }: EditPopupProps) => {
  const [form, setForm] = useState<Habit>(habit);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!rect) return null;

  const top = rect.bottom + window.scrollY + 8;
  const left = rect.left + window.scrollX;

  return (
    <div 
      ref={popupRef}
      style={{ top, left }}
      className="fixed z-[1000] min-w-[280px] bg-[#0f2220] border border-[#2d5550] rounded-[10px] p-[16px] px-[18px] shadow-[0_16_40px_rgba(0,0,0,0.6)]"
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-[11px] font-[700] uppercase tracking-[0.1em] text-white/45">Nome</Label>
          <Input 
            value={form.title} 
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="h-9 bg-[#071412] border-[#2a4a46] text-[14px] font-[600] text-[#e8f5f3]" 
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-[700] uppercase tracking-[0.1em] text-white/45">Prioridade</Label>
          <div className="flex gap-2">
            {['high', 'medium', 'low'].map((p) => (
              <button
                key={p}
                onClick={() => setForm({...form, priority: p as Priority})}
                className={cn(
                  "flex-1 h-8 rounded-[10px] text-[11px] font-[700] uppercase tracking-wider",
                  form.priority === p ? "bg-[#00e5cc] text-[#071412]" : "bg-[#071412] text-[#5a8a85]"
                )}
              >
                {p === 'high' ? 'Alta' : p === 'medium' ? 'Média' : 'Baixa'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => { onDelete(habit.id); onClose(); }}
            className="flex-1 h-9 bg-transparent border-red-500/30 text-red-500 text-[11px] font-[700] uppercase tracking-wider rounded-[10px]"
          >
            Excluir
          </Button>
          <Button 
            size="sm"
            onClick={() => { onSave(form); onClose(); }}
            className="flex-[2] h-9 bg-[#00e5cc] text-[#071412] font-[800] text-[11px] uppercase tracking-wider rounded-[10px]"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

const HabitsPage = () => {
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Beber 3L de água', emoji: '💧', frequency: 'daily', priority: 'high', weekDays: [0,1,2,3,4,5,6], time: '08:00', completedDates: [], active: true },
    { id: '2', title: 'Ler 10 páginas', emoji: '📚', frequency: 'daily', priority: 'medium', weekDays: [0,1,2,3,4,5,6], time: '21:00', completedDates: [], active: true },
    { id: '3', title: 'Academia', emoji: '💪', frequency: 'weekly', priority: 'high', weekDays: [1,3,5], time: '18:00', completedDates: [], active: true },
    { id: '4', title: 'Meditar', emoji: '🧘', frequency: 'daily', priority: 'low', weekDays: [0,1,2,3,4,5,6], time: '07:30', completedDates: [], active: true },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingHabit, setEditingHabit] = useState<{habit: Habit, rect: DOMRect} | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setHabits((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleHabit = (id: string, date: Date = selectedDate) => {
    const dStr = format(date, 'yyyy-MM-dd');
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const completed = h.completedDates.includes(dStr);
        return {
          ...h,
          completedDates: completed ? h.completedDates.filter(d => d !== dStr) : [...h.completedDates, dStr]
        };
      }
      return h;
    }));
  };

  const stats = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const scheduledToday = habits.filter(h => h.active && h.weekDays.includes(getDay(new Date())));
    const completedToday = scheduledToday.filter(h => h.completedDates.includes(todayStr)).length;
    return { total: habits.length, today: `${completedToday}/${scheduledToday.length}`, streak: `7d`, rate: `85%` };
  }, [habits]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(endOfMonth(currentDate));
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const dStr = format(day, 'yyyy-MM-dd');
      const habitsForDay = habits.filter(h => h.active && h.weekDays.includes(getDay(day)));
      const done = habitsForDay.filter(h => h.completedDates.includes(dStr)).length;
      const total = habitsForDay.length;
      const percent = total === 0 ? 0 : done / total;
      let level = 0;
      if (percent > 0) {
        if (percent <= 0.25) level = 1;
        else if (percent <= 0.5) level = 2;
        else if (percent <= 0.75) level = 3;
        else level = 4;
      }
      return { date: day, isCurrentMonth: isSameMonth(day, currentDate), isToday: isSameDay(day, new Date()), isSelected: isSameDay(day, selectedDate), done, total, level };
    });
  }, [currentDate, selectedDate, habits]);

  const displayedHabitsData = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const filtered = habits.filter(h => h.weekDays.includes(getDay(selectedDate)));
    const pending = filtered.filter(h => !h.completedDates.includes(dateStr));
    const completed = filtered.filter(h => h.completedDates.includes(dateStr));
    return { pending, completed, all: [...pending, ...completed] };
  }, [habits, selectedDate]);

  return (
    <div className="min-h-screen pb-10 relative">
      
      {/* Header Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[12px] p-4 md:p-0 mt-6">
        {[
          { label: "TOTAL HÁBITOS", value: stats.total, icon: Target, color: "#38bdf8", border: "border-[#38bdf840]" },
          { label: "SEQUÊNCIA", value: stats.streak, icon: Flame, color: "#ff6b00", border: "border-[#ff6b0030]" },
          { label: "HOJE", value: stats.today, icon: CheckCircle2, color: "#00e055", border: "border-[#00e05530]" },
          { label: "MÊS", value: stats.rate, icon: BarChart3, color: "#b060ff", border: "border-[#b060ff30]" }
        ].map((s, i) => (
          <div key={i} className={cn("py-[16px] px-[18px] rounded-[10px] border flex items-center gap-3 bg-black/40", s.border)}>
            <div className="w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0 bg-white/5">
              <s.icon size={20} style={{ color: s.color }} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-[700] text-white/45 uppercase tracking-[0.1em]">{s.label}</span>
              <span className="text-[24px] font-[800] text-white leading-none">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[20px] grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-[20px] p-4 md:p-0">
        {/* Left Card: Calendar or Weekly Grid */}
        <div className="bg-gradient-to-br from-[#0f2220] to-[#071412] border border-[#2d5550] rounded-[14px] py-[20px] px-[24px] shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  if (viewMode === 'weekly') setCurrentDate(subWeeks(currentDate, 1));
                  else setCurrentDate(subMonths(currentDate, 1));
                }} 
                className="p-1 text-[#5a8a85] hover:text-[#00e5cc]"
              >
                <ChevronLeft size={24} />
              </button>
              <button className="flex items-center gap-2 text-[14px] font-[700] text-[#e8f5f3] uppercase tracking-[0.02em] hover:text-[#00e5cc]">
                {viewMode === 'weekly' 
                  ? `Semana de ${format(startOfWeek(currentDate), 'dd/MM')}`
                  : format(currentDate, 'MMMM yyyy', { locale: ptBR })
                }
              </button>
              <button 
                onClick={() => {
                  if (viewMode === 'weekly') setCurrentDate(addWeeks(currentDate, 1));
                  else setCurrentDate(addMonths(currentDate, 1));
                }} 
                className="p-1 text-[#5a8a85] hover:text-[#00e5cc]"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="flex items-center bg-[#0d1e1c] border border-[#2a4a46] p-1 rounded-full">
              {[
                { id: 'monthly', icon: LayoutGrid, label: 'Mensal' },
                { id: 'weekly', icon: CalendarDays, label: 'Semanal' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-[700] uppercase tracking-wider",
                    viewMode === mode.id 
                      ? "bg-[#00e5cc] text-[#071412]" 
                      : "text-[#5a8a85] hover:text-[#e8f5f3]"
                  )}
                >
                  <mode.icon size={13} /> {mode.label}
                </button>
              ))}
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
              className="text-[11px] font-[700] text-[#00e5cc] bg-[#00e5cc10] border border-[#00e5cc30] uppercase rounded-[999px] h-auto px-[10px] py-[3px]"
            >
              Hoje
            </Button>
          </div>

          {viewMode === 'monthly' ? (
            <>
              <div className="grid grid-cols-7 mb-4">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                  <div key={d} className="text-center text-[11px] font-[700] text-[#00e5cc] uppercase py-2 opacity-80">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-3">
                <TooltipProvider>
                  {calendarDays.map((day, i) => (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <div 
                          onClick={() => setSelectedDate(day.date)}
                          className={cn(
                            "min-h-[56px] aspect-square rounded-[8px] border flex flex-col items-center justify-center cursor-pointer",
                            day.isCurrentMonth ? "bg-[#0d1f1c] border-[#1a3530] text-white" : "text-[#2a3f3d] border-transparent",
                            day.isSelected ? "border-[#00e5cc] ring-1 ring-[#00e5cc]/30" : "",
                            day.isToday && !day.isSelected ? "border-2 border-[#00e5cc] bg-[#00e5cc10]" : "",
                            day.level === 1 && "bg-[#064e3b] border-[#064e3b30]",
                            day.level === 2 && "bg-[#059669] border-[#05966930]",
                            day.level === 3 && "bg-[#10b981] border-[#10b98130]",
                            day.level === 4 && "bg-[#00e5cc] text-[#071412]",
                          )}
                        >
                          <span className="text-[14px] font-[600]">{format(day.date, 'd')}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#0f2220] border-[#2d5550] text-[#e8f5f3] rounded-[10px]">
                        <p className="text-xs font-bold">{format(day.date, 'dd/MM')}</p>
                        <p className="text-[10px] text-[#5a8a85] font-bold uppercase">{day.done} de {day.total} feitos</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </>
          ) : (
            <WeeklyView 
              currentDate={currentDate} 
              habits={habits} 
              onToggleHabit={toggleHabit} 
            />
          )}
        </div>

        {/* Right Panel: Fixed Active Habits */}
        <div className="relative">
          <div className="bg-gradient-to-br from-[#0f2220] via-[#071412] to-[#0f2220] border border-[#2d5550] rounded-[14px] overflow-hidden flex flex-col min-h-[500px]">
            <div className="py-[20px] px-[24px] border-b border-[#2a4a46] flex items-center justify-between bg-black/20">
              <h2 className="text-[#e8f5f3] font-[700] text-[14px] uppercase tracking-[0.02em]">HÁBITOS ATIVOS</h2>
              <div className="bg-[#00e5cc15] text-[#00e5cc] text-[11px] font-[700] px-[10px] py-[3px] rounded-[999px] border border-[#00e5cc20]">
                {displayedHabitsData.completed.length}/{displayedHabitsData.all.length}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={displayedHabitsData.all.map(h => h.id)} strategy={verticalListSortingStrategy}>
                  {displayedHabitsData.pending.map((habit) => (
                    <SortableHabitItem 
                      key={habit.id}
                      habit={habit}
                      isCompleted={false}
                      onEdit={(habit, rect) => setEditingHabit({ habit, rect })}
                      onToggle={(id) => toggleHabit(id)}
                    />
                  ))}
                  
                  {displayedHabitsData.completed.length > 0 && (
                    <>
                      <div className="mt-8 mb-4 pt-4 border-t border-[#1e3a36]">
                        <span className="text-[10px] font-[700] text-[#5a8a85] uppercase tracking-[0.08em]">CONCLUÍDOS</span>
                      </div>
                      {displayedHabitsData.completed.map((habit) => (
                        <SortableHabitItem 
                          key={habit.id}
                          habit={habit}
                          isCompleted={true}
                          onEdit={(habit, rect) => setEditingHabit({ habit, rect })}
                          onToggle={(id) => toggleHabit(id)}
                        />
                      ))}
                    </>
                  )}
                </SortableContext>
              </DndContext>
            </div>

            <div className="p-4 border-t border-[#2a4a46]">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#00e5cc] hover:brightness-110 text-[#071412] font-[800] text-[11px] uppercase tracking-[0.1em] h-12 rounded-[14px]">
                    <Plus className="mr-2" size={18} strokeWidth={3} /> NOVO HÁBITO
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0f2220] border-[#2d5550] text-[#e8f5f3] rounded-[14px]">
                  <DialogHeader><DialogTitle className="uppercase tracking-widest text-sm text-[#00e5cc]">Criar Hábito</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label className="text-[11px] uppercase font-[700] tracking-[0.1em] text-white/45">Título</Label>
                      <Input placeholder="Beber água..." className="bg-[#071412] border-[#2a4a46]" />
                    </div>
                  </div>
                  <DialogFooter><Button className="bg-[#00e5cc] text-[#071412] font-bold">CRIAR</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {editingHabit && editingHabit.rect && (
        <EditPopup 
          habit={editingHabit.habit}
          rect={editingHabit.rect}
          onClose={() => setEditingHabit(null)}
          onSave={(updated) => setHabits(prev => prev.map(h => h.id === updated.id ? updated : h))}
          onDelete={(id) => setHabits(prev => prev.filter(h => h.id !== id))}
        />
      )}
    </div>
  );
};

export default HabitsPage;