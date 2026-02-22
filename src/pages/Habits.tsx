"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Plus, Check, ChevronLeft, ChevronRight, 
  LayoutGrid, Clock, Flame, 
  BarChart3, CheckCircle2, Pencil, Trash2, 
  Play, Pause, CalendarDays, Target,
  ChevronDown, List
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
    transition: {
      duration: 150, 
      easing: 'ease-in-out',
    },
    disabled: isCompleted 
  });

  const cardRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cardRef.current) {
      onEdit(habit, cardRef.current.getBoundingClientRect());
    }
  };

  // Melhoria conforme solicitado: Gradientes mais fortes e sombras 3D
  const priorityStyles = {
    high: "bg-[linear-gradient(135deg,rgba(255,75,75,0.40),rgba(255,75,75,0.18))] border-[#ff4b4b8c] shadow-[0_4px_0_0_#cc0000]",
    medium: "bg-[linear-gradient(135deg,rgba(255,150,0,0.40),rgba(255,150,0,0.18))] border-[#ff96008c] shadow-[0_4px_0_0_#e58700]",
    low: "bg-[linear-gradient(135deg,rgba(88,204,2,0.40),rgba(88,204,2,0.18))] border-[#58cc028c] shadow-[0_4px_0_0_#46a302]"
  };

  const checkboxBorderStyles = {
    high: "border-[#ff4b4b]",
    medium: "border-[#ff9600]",
    low: "border-[#58cc02]"
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
        "group rounded-[16px] border-2 p-[14px] px-[16px] mb-2.5 cursor-grab active:cursor-grabbing select-none transition-all duration-150 ease-out hover:scale-[1.02]",
        isDragging 
          ? "scale-[1.03] bg-[#202f36] border-[#22d3ee] shadow-2xl" 
          : priorityStyles[habit.priority],
        isCompleted && !isDragging && "opacity-[0.45] grayscale"
      )}
    >
      <div className="flex items-center gap-[14px]">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(habit.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 z-10 bg-transparent",
            isCompleted ? "bg-[#22d3ee] border-[#22d3ee]" : checkboxBorderStyles[habit.priority]
          )}
        >
          {isCompleted && <Check size={14} className="text-[#111b21] stroke-[4px]" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-[15px] font-[700] text-[#e5e7eb] truncate leading-tight transition-all duration-400",
            isCompleted && "line-through opacity-70"
          )}>
            {habit.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-[3px]">
            <Clock size={12} className="text-[#9ca3af]" />
            <span className="text-[12px] font-[500] text-[#9ca3af]">
              {habit.time}
            </span>
          </div>
        </div>

        {!isCompleted && (
          <button 
            onClick={handleEditClick}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 text-[#9ca3af] hover:text-[#22d3ee] transition-colors z-10 ml-auto"
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
      className="fixed z-[1000] min-w-[280px] bg-[#202f36] border-2 border-[#374151] rounded-[16px] p-[16px] px-[18px] shadow-[0_4px_0_0_#0b1116] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-[11px] font-[700] uppercase tracking-[0.1em] text-[#9ca3af]">Nome</Label>
          <Input 
            value={form.title} 
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="h-9 bg-[#131f24] border-[#374151] text-[14px] font-[600] text-[#e5e7eb] focus-visible:ring-[#22d3ee]" 
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-[700] uppercase tracking-[0.1em] text-[#9ca3af]">Horário</Label>
          <Input 
            type="time"
            value={form.time} 
            onChange={(e) => setForm({...form, time: e.target.value})}
            className="h-9 bg-[#131f24] border-[#374151] text-[14px] font-[600] text-[#e5e7eb] focus-visible:ring-[#22d3ee]" 
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-[700] uppercase tracking-[0.1em] text-[#9ca3af]">Prioridade</Label>
          <div className="flex gap-2">
            {[
              { v: 'high', c: 'bg-[#ff4b4b] text-white', l: 'Alta' }, 
              { v: 'medium', c: 'bg-[#ff9600] text-white', l: 'Média' }, 
              { v: 'low', c: 'bg-[#58cc02] text-white', l: 'Baixa' }
            ].map((p) => (
              <button
                key={p.v}
                onClick={() => setForm({...form, priority: p.v as Priority})}
                className={cn(
                  "flex-1 h-8 rounded-[10px] text-[11px] font-[700] uppercase tracking-wider transition-all",
                  form.priority === p.v ? p.c : "bg-[#131f24] text-[#9ca3af] hover:bg-[#374151]"
                )}
              >
                {p.l}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#131f24] p-2.5 rounded-[10px] border border-[#374151]">
          <span className="text-[11px] font-[700] uppercase tracking-[0.1em] text-[#9ca3af] ml-1">
            {form.active ? 'Ativo' : 'Pausado'}
          </span>
          <button 
            onClick={() => setForm({...form, active: !form.active})}
            className={cn(
              "p-1.5 rounded-[8px] transition-colors",
              form.active ? "text-[#22d3ee] bg-[#22d3ee]/10" : "text-[#9ca3af]"
            )}
          >
            {form.active ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
          </button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => { onDelete(habit.id); onClose(); }}
            className="flex-1 h-9 bg-transparent border-[#ff4b4b] text-[#ff4b4b] hover:bg-[#ff4b4b] hover:text-white text-[11px] font-[700] uppercase tracking-wider rounded-[10px]"
          >
            <Trash2 size={14} className="mr-1.5" /> Excluir
          </Button>
          <Button 
            size="sm"
            onClick={() => { onSave(form); onClose(); }}
            className="flex-[2] h-9 bg-[#22d3ee] hover:bg-[#06b6d4] text-[#111b21] font-[800] text-[11px] uppercase tracking-wider rounded-[10px]"
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
  const [viewMode, setViewMode] = useState<'monthly' | 'list' | 'weekly'>('monthly');
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Beber 3L de água', emoji: '💧', frequency: 'daily', priority: 'high', weekDays: [0,1,2,3,4,5,6], time: '08:00', completedDates: [], active: true },
    { id: '2', title: 'Ler 10 páginas', emoji: '📚', frequency: 'daily', priority: 'medium', weekDays: [0,1,2,3,4,5,6], time: '21:00', completedDates: [], active: true },
    { id: '3', title: 'Academia', emoji: '💪', frequency: 'weekly', priority: 'high', weekDays: [1,3,5], time: '18:00', completedDates: [], active: true },
    { id: '4', title: 'Meditar', emoji: '🧘', frequency: 'daily', priority: 'low', weekDays: [0,1,2,3,4,5,6], time: '07:30', completedDates: [], active: true },
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

  const displayedHabitsData = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const filtered = habits.filter(h => h.weekDays.includes(getDay(selectedDate)));
    
    const pending = filtered.filter(h => !h.completedDates.includes(dateStr));
    const completed = filtered.filter(h => h.completedDates.includes(dateStr));
    
    return { pending, completed, all: [...pending, ...completed] };
  }, [habits, selectedDate]);

  return (
    <div className="min-h-screen bg-transparent pb-10 animate-in fade-in duration-500 relative">
      
      {/* Navigation Tabs (Overview/Charts) - Design System Update */}
      <div className="flex justify-center pt-6 pb-2">
        <div className="bg-[#202f36] border-2 border-[#374151] rounded-full p-1 shadow-[0_4px_0_0_#0b1116] flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-[800] uppercase tracking-[0.05em] transition-all duration-300 border-none shrink-0",
              activeTab === 'overview'
                ? "bg-[#22d3ee] text-[#111b21] shadow-[0_4px_0_0_#06b6d4]"
                : "bg-transparent text-[#9ca3af] hover:text-white"
            )}
          >
            <LayoutGrid size={14} strokeWidth={3} /> Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-[800] uppercase tracking-[0.05em] transition-all duration-300 border-none shrink-0",
              activeTab === 'charts'
                ? "bg-[#22d3ee] text-[#111b21] shadow-[0_4px_0_0_#06b6d4]"
                : "bg-transparent text-[#9ca3af] hover:text-white"
            )}
          >
            <BarChart3 size={14} strokeWidth={3} /> Gráficos
          </button>
        </div>
      </div>

      {/* Header Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[12px] p-4 md:p-0 mt-6">
        {[
          { label: "TOTAL HÁBITOS", value: stats.total, icon: Target, bg: "#1cb0f6", shadow: "#1899d6" },
          { label: "SEQUÊNCIA", value: stats.streak, icon: Flame, bg: "#ff9600", shadow: "#e58700" },
          { label: "HOJE", value: stats.today, icon: CheckCircle2, bg: "#58cc02", shadow: "#46a302" },
          { label: "MÊS", value: stats.rate, icon: BarChart3, bg: "#ce82ff", shadow: "#a855f7" }
        ].map((s, i) => (
          <div
            key={i}
            className={cn(
              "py-[12px] px-[20px] rounded-[16px] flex items-center gap-3 transition-all duration-300",
              "text-white border-none"
            )}
            style={{ backgroundColor: s.bg, boxShadow: `0 4px 0 0 ${s.shadow}` }}
          >
            <div className={cn("w-14 h-14 rounded-[12px] flex items-center justify-center shrink-0 bg-black/20")}>
              <s.icon size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-[700] text-white/80 uppercase tracking-[0.1em] leading-none mb-2">{s.label}</span>
              <span className="text-[28px] font-[800] text-white leading-[1.1]">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[20px] flex flex-col lg:flex-row gap-[20px] p-4 md:p-0">
        <div className={cn("w-full transition-all duration-500", viewMode === 'weekly' ? 'lg:w-full' : 'lg:w-[65%]')}>
          {/* Calendar Panel */}
          <div className="bg-[#202f36] border-2 border-[#374151] rounded-[24px] py-[20px] px-[24px] shadow-[0_4px_0_0_#0b1116]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    if (viewMode === 'weekly') setCurrentDate(subWeeks(currentDate, 1));
                    else setCurrentDate(subMonths(currentDate, 1));
                  }} 
                  className="p-1 text-[#9ca3af] hover:text-[#22d3ee] transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 text-[14px] font-[700] text-[#e5e7eb] uppercase tracking-[0.02em] hover:text-[#22d3ee] transition-colors group px-2">
                      {viewMode === 'weekly' 
                        ? `Semana de ${format(startOfWeek(currentDate), 'dd/MM')}`
                        : format(currentDate, 'MMMM yyyy', { locale: ptBR })
                      }
                      <ChevronDown size={18} className="text-[#9ca3af] group-hover:text-[#22d3ee]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-[#202f36] border-2 border-[#374151] w-64 p-3 shadow-xl rounded-[16px]">
                    <div className="grid grid-cols-3 gap-1 mb-4">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentDate(setMonth(currentDate, i))}
                          className={cn(
                            "py-2 rounded-md text-[11px] font-[700] uppercase tracking-wider transition-all",
                            getMonth(currentDate) === i ? "bg-[#22d3ee] text-[#111b21]" : "text-[#9ca3af] hover:bg-[#374151] hover:text-[#e5e7eb]"
                          )}
                        >
                          {format(new Date(2024, i, 1), 'MMM', { locale: ptBR })}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#374151]">
                      <button onClick={() => setCurrentDate(setYear(currentDate, getYear(currentDate) - 1))} className="p-1 text-[#9ca3af] hover:text-[#22d3ee]"><ChevronLeft size={16}/></button>
                      <span className="text-[12px] font-black text-white">{getYear(currentDate)}</span>
                      <button onClick={() => setCurrentDate(setYear(currentDate, getYear(currentDate) + 1))} className="p-1 text-[#9ca3af] hover:text-[#22d3ee]"><ChevronRight size={16}/></button>
                    </div>
                  </PopoverContent>
                </Popover>
                <button 
                  onClick={() => {
                    if (viewMode === 'weekly') setCurrentDate(addWeeks(currentDate, 1));
                    else setCurrentDate(addMonths(currentDate, 1));
                  }} 
                  className="p-1 text-[#9ca3af] hover:text-[#22d3ee] transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Calendar Pills - Design System Update */}
              <div className="bg-[#202f36] border-2 border-[#374151] rounded-full p-1 shadow-[0_4px_0_0_#0b1116] flex items-center gap-1">
                {[
                  { id: 'monthly', icon: LayoutGrid, label: 'Mês' },
                  { id: 'list', icon: List, label: 'Lista' },
                  { id: 'weekly', icon: CalendarDays, label: 'Sem' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-[800] uppercase tracking-wider transition-all border-none shrink-0 whitespace-nowrap",
                      viewMode === mode.id 
                        ? "bg-[#22d3ee] text-[#111b21] shadow-[0_4px_0_0_#06b6d4]" 
                        : "bg-transparent text-[#9ca3af] hover:text-white"
                    )}
                  >
                    <mode.icon size={13} strokeWidth={3} /> {mode.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
                  className="text-[11px] font-[700] text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/30 uppercase rounded-[999px] h-auto px-[10px] py-[3px] hover:bg-[#22d3ee] hover:text-[#111b21]"
                >
                  Hoje
                </Button>
              </div>
            </div>

            {viewMode === 'monthly' && (
              <>
                <div className="grid grid-cols-7 mb-4">
                  {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                    <div key={d} className="text-center text-[11px] font-[700] text-[#22d3ee] uppercase tracking-[0.08em] py-2 opacity-80">{d}</div>
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
                              "min-h-[56px] aspect-square rounded-[12px] border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
                              day.isCurrentMonth ? "bg-[#2a3f4a] border-[#374151] text-[#e5e7eb] hover:brightness-110" : "text-[#37464f] border-transparent bg-transparent",
                              day.isSelected ? "border-[#22d3ee] ring-1 ring-[#22d3ee]" : "",
                              day.isToday && !day.isSelected ? "border-[#22d3ee] text-[#22d3ee]" : "",
                              day.level === 4 && "bg-[#22d3ee] text-[#111b21]",
                            )}
                          >
                            <span className="text-[14px] font-[600]">{format(day.date, 'd')}</span>
                            {day.level > 0 && day.level < 4 && (
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full mt-1",
                                day.level === 1 ? "bg-[#22d3ee]/30" : 
                                day.level === 2 ? "bg-[#22d3ee]/60" : "bg-[#22d3ee]"
                              )} />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#202f36] border-[#374151] text-[#e5e7eb] rounded-[10px]">
                          <p className="text-xs font-bold">{format(day.date, 'dd/MM')}</p>
                          <p className="text-[10px] text-[#9ca3af] font-bold uppercase">{day.done} de {day.total} feitos</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 text-[11px] font-[700] text-[#9ca3af] uppercase tracking-widest">
                  <span>MENOS</span>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map(l => (
                      <TooltipProvider key={l}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={cn(
                              "w-3 h-3 rounded-full border border-[#374151]",
                              l === 0 ? "bg-[#2a3f4a]" : 
                              l === 1 ? "bg-[#22d3ee]/30" : 
                              l === 2 ? "bg-[#22d3ee]/60" : 
                              l === 3 ? "bg-[#22d3ee]" : "bg-[#22d3ee]"
                            )} />
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#202f36] border-[#374151] text-white">
                            {l === 0 ? "0 hábitos" : l === 4 ? "Todos os hábitos" : `${l*25}% completado`}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                  <span>MAIS</span>
                </div>
              </>
            )}

            {viewMode === 'weekly' && (
              <WeeklyView 
                currentDate={currentDate} 
                habits={habits} 
                onToggleHabit={toggleHabit} 
              />
            )}

            {viewMode === 'list' && (
              <div className="space-y-4 py-4 min-h-[400px]">
                {habits.map(habit => (
                  <div key={habit.id} className="p-4 bg-[#202f36] border-2 border-[#374151] rounded-[16px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{habit.emoji}</div>
                      <div>
                        <div className="text-[15px] font-[700] text-[#e5e7eb]">{habit.title}</div>
                        <div className="text-[12px] text-[#9ca3af] font-[500] mt-1">{habit.time}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setEditingHabit({ habit, rect: new DOMRect() })} className="text-[#9ca3af] hover:text-[#22d3ee]">
                      <Pencil size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {viewMode !== 'weekly' && (
          <div className="w-full lg:w-[35%] relative">
            {/* Panel Hábitos Ativos - Design System Update */}
            <div className="bg-[#202f36] border-2 border-[#374151] rounded-[24px] overflow-hidden flex flex-col min-h-[500px] shadow-[0_4px_0_0_#0b1116] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#e5e7eb] font-[800] text-[14px] uppercase tracking-[0.05em]">HÁBITOS ATIVOS</h2>
                <div className="bg-[#22d3ee]/10 text-[#22d3ee] text-[11px] font-[700] px-[10px] py-[3px] rounded-[999px] border border-[#22d3ee]/20">
                  {displayedHabitsData.completed.length}/{displayedHabitsData.all.length}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
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
                        <div className="mt-8 mb-4 pt-4 border-t-2 border-[#374151]">
                          <span className="text-[10px] font-[800] text-[#9ca3af] uppercase tracking-[0.08em]">
                            CONCLUÍDOS HOJE
                          </span>
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
                
                {displayedHabitsData.all.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center p-10 text-center opacity-40">
                    <Clock size={32} className="text-[#9ca3af] mb-3" />
                    <p className="text-[11px] font-[700] uppercase text-[#9ca3af] tracking-[0.1em]">Nada planejado</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t-2 border-[#374151]">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#22d3ee] hover:bg-[#22d3ee] active:translate-y-[1px] active:shadow-none transition-all duration-200 text-[#111b21] font-[800] text-[12px] uppercase tracking-[0.1em] h-12 rounded-[16px] shadow-[0_4px_0_0_#06b6d4]">
                      <Plus className="mr-2" size={18} strokeWidth={3} /> NOVO HÁBITO
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#202f36] border-2 border-[#374151] text-[#e5e7eb] rounded-[24px]">
                    <DialogHeader><DialogTitle className="uppercase tracking-widest text-sm text-[#22d3ee]">Criar Hábito</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label className="text-[11px] uppercase font-[700] tracking-[0.1em] text-[#9ca3af]">Título</Label>
                        <Input placeholder="Beber água..." className="bg-[#131f24] border-[#374151] text-[#e5e7eb]" />
                      </div>
                    </div>
                    <DialogFooter><Button className="bg-[#22d3ee] text-[#111b21] font-bold">CRIAR</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )}
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