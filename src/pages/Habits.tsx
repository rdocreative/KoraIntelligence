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
  getMonth
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
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    }
  });

  const cardRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : undefined,
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cardRef.current) {
      onEdit(habit, cardRef.current.getBoundingClientRect());
    }
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
        "group rounded-[10px] border border-[#1a3530] p-[14px] px-[16px] mb-2 cursor-grab active:cursor-grabbing select-none",
        isDragging ? "scale-[1.03] border-[#00e5cc60] bg-[#0d1e1c] shadow-2xl ring-2 ring-[#00e5cc20]" : "bg-gradient-to-br from-[#0a1e1c] to-[#050f0e] transition-all duration-100",
        isCompleted && !isDragging && "opacity-60"
      )}
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(habit.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 z-10",
            isCompleted ? "bg-[#00e5cc] border-[#00e5cc]" : "border-[#5a8a85] hover:border-[#00e5cc]"
          )}
        >
          {isCompleted && <Check size={12} className="text-[#071412] stroke-[3px]" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-white truncate">
            {habit.title}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1 text-[12px] text-[#4a8a85] font-bold uppercase tracking-wider">
              <Clock size={10} className="text-[#00e5cc]" />
              {habit.time}
            </div>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              habit.priority === 'high' ? "bg-red-500" : habit.priority === 'medium' ? "bg-yellow-500" : "bg-[#00e577]"
            )} />
          </div>
        </div>

        <button 
          onClick={handleEditClick}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1 text-[#5a8a85] hover:text-[#00e5cc] transition-colors z-10"
        >
          <ChevronRight size={18} />
        </button>
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
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!rect) return null;

  const top = rect.bottom + window.scrollY + 8;
  const left = rect.left + window.scrollX;

  return (
    <div 
      ref={popupRef}
      style={{ top, left }}
      className="fixed z-[1000] min-w-[280px] bg-[#0f2220] border border-[#2d5550] rounded-[12px] p-4 shadow-[0_16_40px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase text-[#5a8a85] font-bold">Nome</Label>
          <Input 
            value={form.title} 
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="h-9 bg-[#071412] border-[#2a4a46] text-xs text-[#e8f5f3] focus-visible:ring-[#00e5cc]" 
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] uppercase text-[#5a8a85] font-bold">Horário</Label>
          <Input 
            type="time"
            value={form.time} 
            onChange={(e) => setForm({...form, time: e.target.value})}
            className="h-9 bg-[#071412] border-[#2a4a46] text-xs text-[#e8f5f3] focus-visible:ring-[#00e5cc]" 
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] uppercase text-[#5a8a85] font-bold">Prioridade</Label>
          <div className="flex gap-1">
            {[
              { v: 'high', c: 'bg-red-500', l: 'Alta' }, 
              { v: 'medium', c: 'bg-yellow-500', l: 'Média' }, 
              { v: 'low', c: 'bg-[#00e577]', l: 'Baixa' }
            ].map((p) => (
              <button
                key={p.v}
                onClick={() => setForm({...form, priority: p.v as Priority})}
                className={cn(
                  "flex-1 h-7 rounded text-[9px] font-bold uppercase transition-all",
                  form.priority === p.v ? `${p.c} text-[#071412]` : "bg-[#071412] text-[#5a8a85] hover:bg-[#1e3a36]"
                )}
              >
                {p.l}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#071412] p-2 rounded border border-[#1e3a36]">
          <span className="text-[10px] uppercase text-[#5a8a85] font-bold ml-1">
            {form.active ? 'Ativo' : 'Pausado'}
          </span>
          <button 
            onClick={() => setForm({...form, active: !form.active})}
            className={cn(
              "p-1.5 rounded transition-colors",
              form.active ? "text-[#00e5cc] bg-[#00e5cc]/10" : "text-[#5a8a85]"
            )}
          >
            {form.active ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
          </button>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => { onDelete(habit.id); onClose(); }}
            className="flex-1 h-9 bg-transparent border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 text-[10px] uppercase font-bold"
          >
            <Trash2 size={14} className="mr-1.5" /> Excluir
          </Button>
          <Button 
            size="sm"
            onClick={() => { onSave(form); onClose(); }}
            className="flex-[2] h-9 bg-[#00e5cc] hover:bg-[#00c9b3] text-[#071412] font-extrabold text-[10px] uppercase"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

const HabitsPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts'>('overview');
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Beber 3L de água', emoji: '💧', frequency: 'daily', priority: 'high', weekDays: [0,1,2,3,4,5,6], time: '08:00', completedDates: [], active: true },
    { id: '2', title: 'Ler 10 páginas', emoji: '📚', frequency: 'daily', priority: 'medium', weekDays: [0,1,2,3,4,5,6], time: '21:00', completedDates: [], active: true },
    { id: '3', title: 'Academia', emoji: '💪', frequency: 'weekly', priority: 'high', weekDays: [1,3,5], time: '18:00', completedDates: [], active: true },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const toggleHabit = (id: string) => {
    const dStr = format(selectedDate, 'yyyy-MM-dd');
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

      return {
        date: day,
        isCurrentMonth: isSameMonth(day, currentDate),
        isToday: isSameDay(day, new Date()),
        isSelected: isSameDay(day, selectedDate),
        done,
        total,
        level
      };
    });
  }, [currentDate, selectedDate, habits]);

  const displayedHabits = useMemo(() => {
    return habits.filter(h => h.weekDays.includes(getDay(selectedDate)));
  }, [habits, selectedDate]);

  return (
    <div className="min-h-screen bg-transparent pb-10 animate-in fade-in duration-500 relative">
      
      {/* Header Section: Tabs and Stats */}
      <div className="space-y-6 pt-2">
        {/* Navigation Tabs - More compact and centered */}
        <div className="flex justify-center">
          <div className="bg-[#0f2220]/80 border border-[#2d5550]/50 rounded-full p-1.5 backdrop-blur-md flex items-center gap-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-full text-[12px] font-bold uppercase tracking-wider transition-all duration-300",
                activeTab === 'overview' ? "bg-[#00e5cc] text-[#071412]" : "text-white/60 hover:text-white"
              )}
            >
              <LayoutGrid size={14} strokeWidth={2.5} /> Visão Geral
            </button>
            <button 
              onClick={() => setActiveTab('charts')}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-full text-[12px] font-bold uppercase tracking-wider transition-all duration-300",
                activeTab === 'charts' ? "bg-[#00e5cc] text-[#071412]" : "text-white/60 hover:text-white"
              )}
            >
              <BarChart3 size={14} strokeWidth={2.5} /> Gráficos
            </button>
          </div>
        </div>

        {/* Stats Grid - Compact and Consistent with White Text */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "ATIVOS", value: stats.total, icon: Target, color: "#00e5cc", iconBg: "bg-[#00e5cc15]" },
            { label: "SEQUÊNCIA", value: stats.streak, icon: Flame, color: "#ff6b00", iconBg: "bg-[#ff6b0015]" },
            { label: "COMPLETOS", value: stats.today, icon: CheckCircle2, color: "#00e055", iconBg: "bg-[#00e05515]" },
            { label: "MENSAL", value: stats.rate, icon: BarChart3, color: "#b060ff", iconBg: "bg-[#b060ff15]" }
          ].map((s, i) => (
            <div 
              key={i}
              className="bg-[#0f2220]/60 border border-[#2d5550]/40 p-3 rounded-2xl flex items-center gap-3 backdrop-blur-sm"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", s.iconBg)}>
                <s.icon size={18} style={{ color: s.color }} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">
                  {s.label}
                </span>
                <span className="text-xl font-black text-white leading-none truncate">
                  {s.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[65%] space-y-6">
          <div className="bg-gradient-to-br from-[#0f2220] to-[#071412] border border-[#2d5550] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5cc]/5 blur-3xl rounded-full -mr-10 -mt-10" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))} 
                  className="p-1.5 text-white/40 hover:text-[#00e5cc] transition-colors bg-[#071412]/50 rounded-lg"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 text-md font-black text-white uppercase tracking-wider hover:text-[#00e5cc] transition-colors group px-4 py-1.5 bg-[#071412]/30 rounded-full border border-[#2d5550]/30">
                      {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                      <ChevronDown size={16} className="text-white/30 group-hover:text-[#00e5cc]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-[#0f2220] border-[#2d5550] w-64 p-3 shadow-2xl rounded-2xl">
                    <div className="grid grid-cols-3 gap-1 mb-4">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentDate(setMonth(currentDate, i))}
                          className={cn(
                            "py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                            getMonth(currentDate) === i ? "bg-[#00e5cc] text-[#071412]" : "text-[#5a8a85] hover:bg-[#1e3a36] hover:text-[#e8f5f3]"
                          )}
                        >
                          {format(new Date(2024, i, 1), 'MMM', { locale: ptBR })}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#1e3a36]">
                      <button onClick={() => setCurrentDate(setYear(currentDate, getYear(currentDate) - 1))} className="p-1 text-[#5a8a85] hover:text-[#00e5cc]"><ChevronLeft size={16}/></button>
                      <span className="text-xs font-black text-white">{getYear(currentDate)}</span>
                      <button onClick={() => setCurrentDate(setYear(currentDate, getYear(currentDate) + 1))} className="p-1 text-[#5a8a85] hover:text-[#00e5cc]"><ChevronRight size={16}/></button>
                    </div>
                  </PopoverContent>
                </Popover>

                <button 
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))} 
                  className="p-1.5 text-white/40 hover:text-[#00e5cc] transition-colors bg-[#071412]/50 rounded-lg"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
                  className="text-[11px] font-black text-[#00e5cc] bg-[#00e5cc10] border border-[#00e5cc20] hover:bg-[#00e5cc20] uppercase rounded-full h-9 px-5 transition-all"
                >
                  Hoje
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-4">
              {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-[#00e5cc] uppercase tracking-[0.2em] py-2 opacity-60">{d}</div>
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
                          "min-h-[50px] aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
                          day.isCurrentMonth ? "bg-[#0d1f1c]/50 border-[#1a3530] text-white hover:bg-[#122b27]" : "text-[#2a3f3d] border-transparent opacity-20",
                          day.isSelected ? "border-[#00e5cc] bg-[#00e5cc10] ring-1 ring-[#00e5cc]/30 shadow-[0_0_15px_rgba(0,229,204,0.15)]" : "",
                          day.isToday && !day.isSelected ? "border-2 border-[#00e5cc]/40 bg-[#00e5cc05]" : "",
                          day.level === 1 && "bg-[#064e3b]/40 border-[#064e3b30]",
                          day.level === 2 && "bg-[#059669]/60 border-[#05966930]",
                          day.level === 3 && "bg-[#10b981]/80 border-[#10b98130]",
                          day.level === 4 && "bg-[#00e5cc] text-[#071412] font-black",
                        )}
                      >
                        <span className="text-[15px] font-bold">{format(day.date, 'd')}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#0f2220] border-[#2d5550] text-[#e8f5f3] rounded-xl shadow-2xl">
                      <p className="text-xs font-bold">{format(day.date, 'dd/MM')}</p>
                      <p className="text-[10px] text-[#5a8a85] font-bold uppercase">{day.done} de {day.total} feitos</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
              <span>MENOS</span>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map(l => (
                  <div key={l} className={cn(
                    "w-2.5 h-2.5 rounded-full border border-[#2a4a46]/30",
                    l === 0 ? "bg-[#0d1e1c]" : 
                    l === 1 ? "bg-[#064e3b]" : 
                    l === 2 ? "bg-[#059669]" : 
                    l === 3 ? "bg-[#10b981]" : "bg-[#00e5cc]"
                  )} />
                ))}
              </div>
              <span>MAIS</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[35%] relative">
          <div className="bg-gradient-to-br from-[#0f2220] via-[#071412] to-[#0f2220] border border-[#2d5550] rounded-2xl overflow-hidden flex flex-col min-h-[500px] shadow-2xl">
            <div className="p-5 border-b border-[#2a4a46]/50 flex items-center justify-between bg-[#071412]/40 backdrop-blur-sm">
              <h2 className="text-white font-black text-[11px] uppercase tracking-[0.2em]">LISTA DE HÁBITOS</h2>
              <div className="bg-[#00e5cc15] text-[#00e5cc] text-[10px] px-3 py-1 rounded-full font-black border border-[#00e5cc20]">
                {displayedHabits.filter(h => h.completedDates.includes(format(selectedDate, 'yyyy-MM-dd'))).length}/{displayedHabits.length}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={displayedHabits.map(h => h.id)} strategy={verticalListSortingStrategy}>
                  {displayedHabits.map((habit) => (
                    <SortableHabitItem 
                      key={habit.id}
                      habit={habit}
                      isCompleted={habit.completedDates.includes(format(selectedDate, 'yyyy-MM-dd'))}
                      onEdit={(habit, rect) => setEditingHabit({ habit, rect })}
                      onToggle={toggleHabit}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {displayedHabits.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-30">
                  <Clock size={40} className="text-white mb-4" />
                  <p className="text-[10px] font-black uppercase text-white tracking-[0.2em]">Nada para este dia</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#071412]/30">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#00e5cc] hover:bg-[#00e5cc] hover:brightness-110 transition-all duration-300 text-[#071412] font-black text-[11px] uppercase tracking-[0.2em] h-12 rounded-xl shadow-lg shadow-[#00e5cc]/10">
                    <Plus className="mr-2" size={18} strokeWidth={3} /> ADICIONAR HÁBITO
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0f2220] border-[#2d5550] text-[#e8f5f3] rounded-3xl">
                  <DialogHeader><DialogTitle className="uppercase tracking-[0.2em] text-xs font-black text-[#00e5cc]">Novo Hábito</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] uppercase font-black text-white/40 tracking-wider">Nome do Hábito</Label>
                      <Input placeholder="Ex: Meditação matinal" className="bg-[#071412] border-[#2a4a46] text-[#e8f5f3] rounded-xl focus:border-[#00e5cc] transition-all" />
                    </div>
                  </div>
                  <DialogFooter><Button className="w-full bg-[#00e5cc] text-[#071412] font-black rounded-xl">CRIAR HÁBITO</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {editingHabit && (
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