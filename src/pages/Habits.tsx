"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, Check, ChevronLeft, ChevronRight, 
  LayoutGrid, List as ListIcon, Clock, Flame, 
  BarChart3, CheckCircle2, Pencil, Trash2, 
  ChevronDown, ChevronUp, Play, Pause, GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  subDays
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  defaultDropAnimationSideEffects
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
  isExpanded: boolean;
  onExpand: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSave: (habit: Habit) => void;
}

const SortableHabitItem = ({ habit, isCompleted, isExpanded, onExpand, onToggle, onDelete, onSave }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: habit.id });

  const [editForm, setEditForm] = useState<Habit>(habit);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "group border-b border-[#1a2e2c] last:border-0 transition-all duration-200",
        isDragging && "scale-[1.02] z-50 shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-[#00e5cc40] opacity-95 bg-[#0d2420]",
        !isDragging && "bg-gradient-to-br from-[#050f0e] to-[#0d1f1c]"
      )}
    >
      <div 
        {...attributes}
        {...listeners}
        className={cn(
          "flex items-center gap-4 p-4 cursor-grab active:cursor-grabbing transition-all",
          isCompleted && "opacity-60 grayscale-[0.5]"
        )}
        onClick={() => onExpand(habit.id)}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(habit.id); }}
          className={cn(
            "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
            isCompleted ? "bg-[#00e5cc] border-[#00e5cc]" : "border-[#4a7a76] hover:border-[#00e5cc]"
          )}
        >
          {isCompleted && <Check size={12} className="text-[#050f0e] stroke-[3px]" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={cn("text-sm font-semibold truncate transition-colors", isExpanded ? "text-[#00e5cc]" : "text-[#e2f0ef]")}>
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

        <div className="flex items-center gap-2 text-[#4a7a76] group-hover:text-[#00e5cc] transition-colors">
          <Pencil size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Inline Edit Panel */}
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out bg-[#050f0e] shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]",
        isExpanded ? "max-height-[400px] border-t border-[#1a2e2c] p-4" : "max-h-0"
      )}>
        {isExpanded && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <Label className="text-[10px] uppercase text-[#4a7a76] font-bold">Nome</Label>
                <Input 
                  value={editForm.title} 
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="h-8 bg-[#0a1a18] border-[#1a2e2c] text-xs text-[#e2f0ef] focus-visible:ring-[#00e5cc]" 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-[#4a7a76] font-bold">Horário</Label>
                <Input 
                  type="time"
                  value={editForm.time} 
                  onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                  className="h-8 bg-[#0a1a18] border-[#1a2e2c] text-xs text-[#e2f0ef] focus-visible:ring-[#00e5cc]" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-[#4a7a76] font-bold">Prioridade</Label>
                <div className="flex gap-1">
                  {[
                    { v: 'high', c: 'bg-red-500', l: 'Alta' }, 
                    { v: 'medium', c: 'bg-yellow-500', l: 'Méd' }, 
                    { v: 'low', c: 'bg-[#00e577]', l: 'Baixa' }
                  ].map((p) => (
                    <button
                      key={p.v}
                      onClick={() => setEditForm({...editForm, priority: p.v as Priority})}
                      className={cn(
                        "flex-1 h-6 rounded text-[9px] font-bold uppercase transition-all",
                        editForm.priority === p.v ? `${p.c} text-[#050f0e]` : "bg-[#0a1a18] text-[#4a7a76] hover:bg-[#1a2e2c]"
                      )}
                    >
                      {p.l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1 flex flex-col justify-end">
                <div className="flex items-center justify-between bg-[#0a1a18] p-1.5 rounded border border-[#1a2e2c]">
                  <span className="text-[10px] uppercase text-[#4a7a76] font-bold ml-1">
                    {editForm.active ? 'Ativo' : 'Pausado'}
                  </span>
                  <button 
                    onClick={() => setEditForm({...editForm, active: !editForm.active})}
                    className={cn(
                      "p-1 rounded transition-colors",
                      editForm.active ? "text-[#00e5cc] bg-[#00e5cc]/10" : "text-[#4a7a76]"
                    )}
                  >
                    {editForm.active ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDelete(habit.id)}
                className="flex-1 h-8 bg-transparent border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 text-[10px] uppercase font-bold"
              >
                <Trash2 size={12} className="mr-1.5" /> Excluir
              </Button>
              <Button 
                size="sm"
                onClick={() => onSave(editForm)}
                className="flex-[2] h-8 bg-[#00e5cc] hover:bg-[#00c9b3] text-[#050f0e] font-extrabold text-[10px] uppercase"
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Page Component ---
const HabitsPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts'>('overview');
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Beber 3L de água', emoji: '💧', frequency: 'daily', priority: 'high', weekDays: [0,1,2,3,4,5,6], time: '08:00', completedDates: [], active: true },
    { id: '2', title: 'Ler 10 páginas', emoji: '📚', frequency: 'daily', priority: 'medium', weekDays: [0,1,2,3,4,5,6], time: '21:00', completedDates: [], active: true },
    { id: '3', title: 'Academia', emoji: '💪', frequency: 'weekly', priority: 'high', weekDays: [1,3,5], time: '18:00', completedDates: [], active: true },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- Logic ---
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

  // --- Computations ---
  const stats = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const scheduledToday = habits.filter(h => h.active && h.weekDays.includes(getDay(new Date())));
    const completedToday = scheduledToday.filter(h => h.completedDates.includes(todayStr)).length;
    
    // Streak logic (simplified)
    const streak = 7; 
    
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const daysInMonth = eachDayOfInterval({ start, end });
    let possible = 0; let done = 0;
    daysInMonth.forEach(day => {
      const dStr = format(day, 'yyyy-MM-dd');
      const wDay = getDay(day);
      const hForDay = habits.filter(h => h.active && h.weekDays.includes(wDay));
      possible += hForDay.length;
      done += hForDay.reduce((acc, h) => acc + (h.completedDates.includes(dStr) ? 1 : 0), 0);
    });
    const monthlyRate = possible === 0 ? 0 : Math.round((done / possible) * 100);

    return { total: habits.length, today: `${completedToday}/${scheduledToday.length}`, streak: `${streak}d`, rate: `${monthlyRate}%` };
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
    <div className="min-h-screen bg-[#050f0e] pb-32 animate-in fade-in duration-500">
      
      {/* 1. Header Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 md:p-0">
        {[
          { label: "Hábitos", value: stats.total, icon: CheckCircle2, color: "#00e5cc", grad: "from-[#00463f] to-[#0a1a18]", border: "border-[#00e5cc30]" },
          { label: "Sequência", value: stats.streak, icon: Flame, color: "#ff6b00", grad: "from-[#4a2000] to-[#0d1110]", border: "border-[#ff6b0030]" },
          { label: "Hoje", value: stats.today, icon: Check, color: "#00e577", grad: "from-[#004d22] to-[#0a1510]", border: "border-[#00e57730]" },
          { label: "Mês", value: stats.rate, icon: BarChart3, color: "#a855f7", grad: "from-[#2d0060] to-[#0d0a1a]", border: "border-[#9333ea30]" }
        ].map((s, i) => (
          <div 
            key={i}
            className={cn(
              "p-4 rounded-xl border flex items-center justify-between bg-gradient-to-br h-[100px]",
              s.grad, s.border
            )}
          >
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50 mb-1">{s.label}</span>
              <span className="text-[26px] font-extrabold text-white">{s.value}</span>
            </div>
            <s.icon size={38} style={{ color: s.color }} strokeWidth={1.5} />
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-6 p-4 md:p-0">
        
        {/* 2. Left Column: Calendar Overview */}
        <div className="w-full lg:w-[65%] space-y-6">
          <div className="bg-gradient-to-br from-[#0d1716] to-[#050f0e] border border-[#1a2e2c] rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </h2>
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
                          "min-h-[52px] rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
                          day.isCurrentMonth ? "bg-[#0a1a18] border-[#1a2e2c] text-[#e2f0ef]" : "text-[#2a3f3d] border-transparent",
                          day.isSelected ? "border-[#00e5cc] ring-1 ring-[#00e5cc]/30 shadow-[0_0_15px_rgba(0,229,204,0.2)]" : "",
                          day.isToday && !day.isSelected ? "border-2 border-[#00e5cc] bg-[#00e5cc10]" : "",
                          day.level === 1 && "bg-[#00e5cc20] border-[#00e5cc30]",
                          day.level === 2 && "bg-[#00e5cc40] border-[#00e5cc50]",
                          day.level === 3 && "bg-[#00e5cc70] border-[#00e5cc70]",
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
                          l === 1 ? "bg-[#00e5cc20]" : 
                          l === 2 ? "bg-[#00e5cc40]" : 
                          l === 3 ? "bg-[#00e5cc70]" : "bg-[#00e5cc]"
                        )} />
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#0d1716] border-[#1a2e2c] text-white">
                        {l === 0 ? "Nenhum hábito" : l === 4 ? "Todos os hábitos" : `${l*25}% completado`}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              <span>MAIS</span>
            </div>
          </div>
        </div>

        {/* 3. Right Column: Habit List with Drag and Drop */}
        <div className="w-full lg:w-[35%]">
          <div 
            style={{ 
              boxShadow: "0 0 0 1px rgba(0, 229, 204, 0.25), 0 0 12px rgba(0, 229, 204, 0.1)" 
            }}
            className="bg-gradient-to-br from-[#0d1716] via-[#050f0e] to-[#0d1716] border border-transparent rounded-xl overflow-hidden flex flex-col min-h-[500px]"
          >
            <div className="p-5 border-b border-[#1a2e2c] flex items-center justify-between bg-black/20">
              <div>
                <h2 className="text-[#e2f0ef] font-bold text-[14px] uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00e5cc] animate-pulse" />
                  Hábitos Ativos
                </h2>
                <p className="text-[10px] text-[#4a7a76] font-bold uppercase mt-1">{format(selectedDate, "eeee, d 'de' MMMM", { locale: ptBR })}</p>
              </div>
              <div className="bg-[#00e5cc15] text-[#00e5cc] text-[12px] px-3 py-1 rounded-full font-extrabold border border-[#00e5cc20]">
                {displayedHabits.filter(h => h.completedDates.includes(format(selectedDate, 'yyyy-MM-dd'))).length}/{displayedHabits.length}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={displayedHabits.map(h => h.id)} strategy={verticalListSortingStrategy}>
                  {displayedHabits.map((habit) => (
                    <SortableHabitItem 
                      key={habit.id}
                      habit={habit}
                      isCompleted={habit.completedDates.includes(format(selectedDate, 'yyyy-MM-dd'))}
                      isExpanded={expandedId === habit.id}
                      onExpand={(id) => setExpandedId(expandedId === id ? null : id)}
                      onToggle={toggleHabit}
                      onDelete={(id) => setHabits(prev => prev.filter(h => h.id !== id))}
                      onSave={(updated) => {
                        setHabits(prev => prev.map(h => h.id === updated.id ? updated : h));
                        setExpandedId(null);
                      }}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {displayedHabits.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center p-10 text-center opacity-40">
                  <Clock size={32} className="text-[#4a7a76] mb-3" />
                  <p className="text-xs font-bold uppercase text-[#4a7a76] tracking-widest">Nada planejado para hoje</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#1a2e2c]">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#00e5cc] hover:bg-[#00e5cc] hover:brightness-110 transition-all duration-200 text-[#050f0e] font-black text-[12px] uppercase tracking-[0.15em] h-12 rounded-xl shadow-[0_0_20px_rgba(0,229,204,0.15)]">
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

      {/* 4. Floating Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
        <div className="bg-[#0d1716] border border-[#1a2e2c] rounded-full p-1.5 shadow-[0_12px_48px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-center gap-1">
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

      {/* Charts View Overlay */}
      {activeTab === 'charts' && (
        <div className="fixed inset-0 bg-[#050f0e] z-[90] flex items-center justify-center animate-in zoom-in-95 duration-300">
          <div className="text-center space-y-4">
            <BarChart3 size={48} className="text-[#4a7a76] mx-auto animate-pulse" />
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Gráficos Analíticos</h2>
            <p className="text-sm font-bold text-[#4a7a76] uppercase tracking-[0.2em]">Em breve</p>
            <Button variant="outline" onClick={() => setActiveTab('overview')} className="mt-4 border-[#00e5cc40] text-[#00e5cc] rounded-full">Voltar</Button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HabitsPage;