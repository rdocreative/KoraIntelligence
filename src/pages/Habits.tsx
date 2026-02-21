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
        "group rounded-[12px] border border-[#1a2e2c] p-3 px-4 mb-2 cursor-grab active:cursor-grabbing select-none",
        isDragging ? "scale-[1.03] border-[#00e5cc60] bg-[#0d2420] shadow-2xl ring-2 ring-[#00e5cc20]" : "bg-gradient-to-br from-[#0a1a18] to-[#050f0e] transition-all duration-100",
        isCompleted && !isDragging && "opacity-60"
      )}
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(habit.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 z-10",
            isCompleted ? "bg-[#00e5cc] border-[#00e5cc]" : "border-[#4a7a76] hover:border-[#00e5cc]"
          )}
        >
          {isCompleted && <Check size={12} className="text-[#050f0e] stroke-[3px]" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#e2f0ef] truncate">
            {habit.title}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1 text-[10px] text-[#4a7a76] font-bold uppercase tracking-wider">
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
          className="p-1 text-[#4a7a76] hover:text-[#00e5cc] transition-colors z-10"
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
      className="fixed z-[1000] min-w-[280px] bg-[#0d1f1c] border border-[#1a3a36] rounded-[12px] p-4 shadow-[0_16_40px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase text-[#4a7a76] font-bold">Nome</Label>
          <Input 
            value={form.title} 
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="h-9 bg-[#050f0e] border-[#1a2e2c] text-xs text-[#e2f0ef] focus-visible:ring-[#00e5cc]" 
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] uppercase text-[#4a7a76] font-bold">Horário</Label>
          <Input 
            type="time"
            value={form.time} 
            onChange={(e) => setForm({...form, time: e.target.value})}
            className="h-9 bg-[#050f0e] border-[#1a2e2c] text-xs text-[#e2f0ef] focus-visible:ring-[#00e5cc]" 
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] uppercase text-[#4a7a76] font-bold">Prioridade</Label>
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
                  form.priority === p.v ? `${p.c} text-[#050f0e]` : "bg-[#050f0e] text-[#4a7a76] hover:bg-[#1a2e2c]"
                )}
              >
                {p.l}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#050f0e] p-2 rounded border border-[#1a2e2c]">
          <span className="text-[10px] uppercase text-[#4a7a76] font-bold ml-1">
            {form.active ? 'Ativo' : 'Pausado'}
          </span>
          <button 
            onClick={() => setForm({...form, active: !form.active})}
            className={cn(
              "p-1.5 rounded transition-colors",
              form.active ? "text-[#00e5cc] bg-[#00e5cc]/10" : "text-[#4a7a76]"
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
            className="flex-[2] h-9 bg-[#00e5cc] hover:bg-[#00c9b3] text-[#050f0e] font-extrabold text-[10px] uppercase"
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
    <div className="min-h-screen bg-[#050f0e] pb-10 animate-in fade-in duration-500 relative">
      
      {/* Tab Navigation at TOP */}
      <div className="flex justify-center pt-6 pb-2">
        <div className="bg-[#0d1716] border border-[#1a2e2c] rounded-full p-1 shadow-2xl backdrop-blur-xl flex items-center gap-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest transition-all duration-300",
              activeTab === 'overview' ? "bg-[#00e5cc15] border border-[#00e5cc40] text-[#00e5cc]" : "text-[#4a7a76] hover:text-[#e2f0ef]"
            )}
          >
            <LayoutGrid size={14} /> Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('charts')}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest transition-all duration-300",
              activeTab === 'charts' ? "bg-[#00e5cc15] border border-[#00e5cc40] text-[#00e5cc]" : "text-[#4a7a76] hover:text-[#e2f0ef]"
            )}
          >
            <BarChart3 size={14} /> Gráficos
          </button>
        </div>
      </div>

      {/* 1. Header Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-0 mt-4">
        {[
          { 
            label: "Total de Hábitos", 
            value: stats.total, 
            icon: Target, 
            color: "#00e5cc", 
            grad: "from-[#003832] to-[#050f0e]", 
            border: "border-[#00e5cc50]",
            iconBg: "bg-[#00e5cc20]"
          },
          { 
            label: "Maior Sequência", 
            value: stats.streak, 
            icon: Flame, 
            color: "#ff6b00", 
            grad: "from-[#3d1500] to-[#050f0e]", 
            border: "border-[#ff6b0060]",
            iconBg: "bg-[#ff6b0025]"
          },
          { 
            label: "Completos Hoje", 
            value: stats.today, 
            icon: CheckCircle2, 
            color: "#00e055", 
            grad: "from-[#00320f] to-[#050f0e]", 
            border: "border-[#00e05550]",
            iconBg: "bg-[#00e05520]"
          },
          { 
            label: "Taxa do Mês", 
            value: stats.rate, 
            icon: BarChart3, 
            color: "#b060ff", 
            grad: "from-[#1a0035] to-[#050f0e]", 
            border: "border-[#b060ff50]",
            iconBg: "bg-[#b060ff20]"
          }
        ].map((s, i) => (
          <div 
            key={i}
            className={cn(
              "p-4 px-5 rounded-[14px] border flex items-center justify-between bg-gradient-to-br transition-all duration-300",
              s.grad, s.border
            )}
          >
            <div 
              className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", s.iconBg)}
            >
              <s.icon size={32} style={{ color: s.color }} strokeWidth={2} />
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-semibold text-white/45 uppercase tracking-[0.1em] leading-tight">
                {s.label}
              </span>
              <span className="text-[28px] font-[800] text-white leading-tight mt-1">
                {s.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-6 p-4 md:p-0">
        <div className="w-full lg:w-[65%] space-y-6">
          <div className="bg-gradient-to-br from-[#0d1716] to-[#050f0e] border border-[#1a3a36] rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 text-lg font-bold text-white uppercase tracking-wider hover:text-[#00e5cc] transition-colors group">
                    {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    <ChevronDown size={18} className="text-[#4a7a76] group-hover:text-[#00e5cc]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="bg-[#0d1716] border-[#1a2e2c] w-64 p-3 shadow-2xl">
                  <div className="grid grid-cols-3 gap-1 mb-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentDate(setMonth(currentDate, i))}
                        className={cn(
                          "py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                          getMonth(currentDate) === i ? "bg-[#00e5cc] text-[#050f0e]" : "text-[#4a7a76] hover:bg-[#1a2e2c] hover:text-[#e2f0ef]"
                        )}
                      >
                        {format(new Date(2024, i, 1), 'MMM', { locale: ptBR })}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#1a2e2c]">
                    <button onClick={() => setCurrentDate(setYear(currentDate, getYear(currentDate) - 1))} className="p-1 text-[#4a7a76] hover:text-[#00e5cc]"><ChevronLeft size={16}/></button>
                    <span className="text-xs font-black text-white">{getYear(currentDate)}</span>
                    <button onClick={() => setCurrentDate(setYear(currentDate, getYear(currentDate) + 1))} className="p-1 text-[#4a7a76] hover:text-[#00e5cc]"><ChevronRight size={16}/></button>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1 text-[#4a7a76] hover:text-[#00e5cc] transition-colors">
                  <ChevronLeft size={24} />
                </button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
                  className="text-[11px] font-bold text-[#00e5cc] bg-[#00e5cc10] border border-[#00e5cc30] uppercase rounded-full h-8 px-4"
                >
                  Hoje
                </Button>
                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1 text-[#4a7a76] hover:text-[#00e5cc] transition-colors">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-4">
              {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                <div key={d} className="text-center text-xs font-bold text-[#00e5cc] uppercase tracking-wider py-2 opacity-80">{d}</div>
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
                          "min-h-[52px] aspect-square rounded-[8px] border flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
                          day.isCurrentMonth ? "bg-[#0a1a18] border-[#1a2e2c] text-[#e2f0ef]" : "text-[#2a3f3d] border-transparent",
                          day.isSelected ? "border-[#00e5cc] ring-1 ring-[#00e5cc]/30 shadow-[0_0_15px_rgba(0,229,204,0.2)]" : "",
                          day.isToday && !day.isSelected ? "border-2 border-[#00e5cc] bg-[#00e5cc10]" : "",
                          day.level === 1 && "bg-[#064e3b] border-[#064e3b30]",
                          day.level === 2 && "bg-[#059669] border-[#05966930]",
                          day.level === 3 && "bg-[#10b981] border-[#10b98130]",
                          day.level === 4 && "bg-[#00e5cc] text-[#050f0e]",
                          "hover:bg-[#0d2420] hover:border-[#00e5cc50]"
                        )}
                      >
                        <span className="text-[15px] font-semibold">{format(day.date, 'd')}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#0d1716] border-[#1a2e2c] text-[#e2f0ef]">
                      <p className="text-xs font-bold">{format(day.date, 'dd/MM')}</p>
                      <p className="text-[10px] text-[#4a7a76] font-bold uppercase">{day.done} de {day.total} feitos</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 text-[11px] font-bold text-[#4a7a76] uppercase tracking-widest">
              <span>MENOS</span>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map(l => (
                  <TooltipProvider key={l}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={cn(
                          "w-3 h-3 rounded-full border border-[#1a2e2c]",
                          l === 0 ? "bg-[#0a1a18]" : 
                          l === 1 ? "bg-[#064e3b]" : 
                          l === 2 ? "bg-[#059669]" : 
                          l === 3 ? "bg-[#10b981]" : "bg-[#00e5cc]"
                        )} />
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#0d1716] border-[#1a2e2c] text-white">
                        {l === 0 ? "0 hábitos" : l === 4 ? "Todos os hábitos" : `${l*25}% completado`}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              <span>MAIS</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[35%] relative">
          <div className="bg-gradient-to-br from-[#0d1716] via-[#050f0e] to-[#0d1716] border border-[#1a3a36] rounded-xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-5 border-b border-[#1a2e2c] flex items-center justify-between bg-black/20">
              <h2 className="text-[#e2f0ef] font-bold text-[14px] uppercase tracking-widest">HÁBITOS ATIVOS</h2>
              <div className="bg-[#00e5cc15] text-[#00e5cc] text-[12px] px-3 py-1 rounded-full font-extrabold border border-[#00e5cc20]">
                {displayedHabits.filter(h => h.completedDates.includes(format(selectedDate, 'yyyy-MM-dd'))).length}/{displayedHabits.length}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
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
                <div className="h-full flex flex-col items-center justify-center p-10 text-center opacity-40">
                  <Clock size={32} className="text-[#4a7a76] mb-3" />
                  <p className="text-xs font-bold uppercase text-[#4a7a76] tracking-widest">Nada planejado</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#1a2e2c]">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#00e5cc] hover:bg-[#00e5cc] hover:brightness-110 transition-all duration-200 text-[#050f0e] font-black text-[12px] uppercase tracking-[0.15em] h-12 rounded-xl">
                    <Plus className="mr-2" size={18} strokeWidth={3} /> NOVO HÁBITO
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0d1716] border-[#1a2e2c] text-[#e2f0ef]">
                  <DialogHeader><DialogTitle className="uppercase tracking-widest text-sm text-[#00e5cc]">Criar Hábito</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] uppercase font-bold text-[#4a7a76]">Título</Label>
                      <Input placeholder="Beber água..." className="bg-[#050f0e] border-[#1a2e2c] text-[#e2f0ef]" />
                    </div>
                  </div>
                  <DialogFooter><Button className="bg-[#00e5cc] text-[#050f0e] font-bold">CRIAR</Button></DialogFooter>
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