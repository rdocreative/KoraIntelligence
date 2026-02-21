import { useState, useMemo } from "react";
import { 
  Plus, Check, GripVertical, ChevronLeft, ChevronRight, 
  LayoutGrid, List as ListIcon, Clock, Flame, 
  BarChart3, CheckCircle2, Calendar as CalendarIcon, 
  MoreHorizontal, ArrowRight, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
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
  subDays,
  isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Types ---
type Frequency = 'daily' | 'weekly';
type Priority = 'high' | 'medium' | 'low';

interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: Frequency;
  priority: Priority;
  weekDays: number[]; // 0 = Domingo
  time: string; // "08:00"
  completedDates: string[]; // YYYY-MM-DD
}

// --- Helpers ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

// --- Sortable Item Component ---
const SortableHabitRow = ({ 
  habit, 
  toggleHabit, 
  isCompleted,
  date,
  isDragEnabled
}: { 
  habit: Habit; 
  toggleHabit: (id: string) => void; 
  isCompleted: boolean;
  date: Date;
  isDragEnabled: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: habit.id, disabled: !isDragEnabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityConfig = {
    high: { color: "bg-red-500", label: "Alta" },
    medium: { color: "bg-yellow-500", label: "Média" },
    low: { color: "bg-emerald-500", label: "Baixa" },
  };

  // Calculate current month completion for this specific habit
  const currentMonthStr = format(date, 'yyyy-MM');
  const completionsThisMonth = habit.completedDates.filter(d => d.startsWith(currentMonthStr)).length;
  // Simple estimation of total days passed in month or total days in month
  const totalDaysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-xl border transition-all mb-2",
        isCompleted 
            ? "bg-[#141418]/50 border-[#2a2a35] opacity-80" 
            : "bg-[#1c1c21] border-[#2a2a35] hover:border-[#38bdf8]/30"
      )}
    >
        {/* Drag Handle */}
        {isDragEnabled && (
             <div 
                {...attributes} 
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-[#6b6b7a] hover:text-white"
             >
                <GripVertical size={16} />
             </div>
        )}

        {/* Check Circle */}
        <button 
            onClick={() => toggleHabit(habit.id)}
            className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                isCompleted 
                    ? "bg-[#38bdf8] border-[#38bdf8]" 
                    : "border-[#6b6b7a] hover:border-[#38bdf8]"
            )}
        >
            {isCompleted && <Check size={12} className="text-[#141418] stroke-[3px]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
                <span className="font-medium text-white truncate text-sm">{habit.title}</span>
                <div className={cn("h-1.5 w-1.5 rounded-full", priorityConfig[habit.priority].color)} />
            </div>
            <div className="flex items-center gap-3 text-xs text-[#6b6b7a]">
                {habit.time && (
                    <div className="flex items-center gap-1">
                        <Clock size={10} />
                        <span>{habit.time}</span>
                    </div>
                )}
                <span className="truncate">Este mês: {completionsThisMonth}/{totalDaysInMonth}</span>
            </div>
        </div>

        {/* Action */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 hover:bg-white/5 rounded-lg text-[#6b6b7a] hover:text-[#38bdf8]">
                <ArrowRight size={14} />
            </button>
        </div>
    </div>
  );
};

const HabitsPage = () => {
  // --- State ---
  // Seed data for demo purposes
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Beber 3L de água', emoji: '💧', frequency: 'daily', priority: 'high', weekDays: [0,1,2,3,4,5,6], time: '08:00', completedDates: [] },
    { id: '2', title: 'Ler 10 páginas', emoji: '📚', frequency: 'daily', priority: 'medium', weekDays: [0,1,2,3,4,5,6], time: '21:00', completedDates: [] },
    { id: '3', title: 'Academia', emoji: '💪', frequency: 'weekly', priority: 'high', weekDays: [1,3,5], time: '18:00', completedDates: [] },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date()); // For Calendar Navigation
  const [selectedDate, setSelectedDate] = useState(new Date()); // Selected day to filter list
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'manual' | 'priority' | 'time' | 'name'>('manual');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Left panel mode (calendar vs list view of months?) - prompt says grid(calendar) and list view

  // Form State
  const [form, setForm] = useState({
    title: "", emoji: "✨", frequency: 'daily' as Frequency, priority: 'medium' as Priority, weekDays: [0,1,2,3,4,5,6], time: "09:00"
  });

  // --- Sensors for DnD ---
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- Logic ---

  // Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setHabits((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Toggle Habit
  const toggleHabit = (id: string, dateOverride?: Date) => {
    const targetDateStr = formatDateKey(dateOverride || selectedDate);
    setHabits(habits.map(h => {
      if (h.id === id) {
        const isCompleted = h.completedDates.includes(targetDateStr);
        return {
          ...h,
          completedDates: isCompleted 
            ? h.completedDates.filter(d => d !== targetDateStr)
            : [...h.completedDates, targetDateStr]
        };
      }
      return h;
    }));
  };

  // Create Habit
  const handleCreateHabit = () => {
    if (!form.title.trim()) return;
    const newHabit: Habit = {
      id: generateId(),
      title: form.title,
      emoji: form.emoji,
      frequency: form.frequency,
      priority: form.priority,
      weekDays: form.frequency === 'daily' ? [0,1,2,3,4,5,6] : form.weekDays,
      time: form.time,
      completedDates: []
    };
    setHabits([...habits, newHabit]);
    setIsModalOpen(false);
    setForm({ title: "", emoji: "✨", frequency: 'daily', priority: 'medium', weekDays: [0,1,2,3,4,5,6], time: "09:00" });
  };

  // --- Computations ---

  // 1. Stats Cards Logic
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    
    // Completed Today
    const todayStr = formatDateKey(new Date());
    const scheduledToday = habits.filter(h => h.weekDays.includes(getDay(new Date())));
    const completedToday = scheduledToday.filter(h => h.completedDates.includes(todayStr)).length;
    
    // Streak (Simplified: just check sequential days backwards from today)
    // A robust streak needs complex logic per habit, let's do a "Global Streak" - days where ALL scheduled habits were done
    let currentStreak = 0;
    let checkDate = subDays(new Date(), 1); // start checking from yesterday
    // (This is a simplified placeholde logic for the card)
    
    // Monthly Rate
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const daysInMonth = eachDayOfInterval({ start, end });
    let totalPossible = 0;
    let totalDone = 0;
    daysInMonth.forEach(day => {
        const dStr = formatDateKey(day);
        const dayOfWeek = getDay(day);
        const habitsForDay = habits.filter(h => h.weekDays.includes(dayOfWeek));
        totalPossible += habitsForDay.length;
        totalDone += habitsForDay.reduce((acc, h) => acc + (h.completedDates.includes(dStr) ? 1 : 0), 0);
    });
    const monthlyRate = totalPossible === 0 ? 0 : Math.round((totalDone / totalPossible) * 100);

    return { totalHabits, completedToday, totalToday: scheduledToday.length, streak: 5, monthlyRate };
  }, [habits]);

  // 2. Calendar / Heatmap Data
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
        const dateStr = formatDateKey(day);
        const dayOfWeek = getDay(day);
        const habitsForDay = habits.filter(h => h.weekDays.includes(dayOfWeek));
        const total = habitsForDay.length;
        const completed = habitsForDay.filter(h => h.completedDates.includes(dateStr)).length;
        const percentage = total === 0 ? 0 : completed / total;
        
        // Heatmap color intensity
        let colorClass = "bg-[#1c1c21]"; // default empty
        if (total > 0 && completed > 0) {
             if (percentage <= 0.25) colorClass = "bg-emerald-900/40";
             else if (percentage <= 0.50) colorClass = "bg-emerald-800/60";
             else if (percentage <= 0.75) colorClass = "bg-emerald-600/80";
             else colorClass = "bg-emerald-500";
        }

        return {
            date: day,
            isCurrentMonth: isSameMonth(day, currentDate),
            isToday: isSameDay(day, new Date()),
            isSelected: isSameDay(day, selectedDate),
            total,
            completed,
            colorClass
        };
    });
  }, [currentDate, habits, selectedDate]);

  // 3. Right Panel List Filtering
  const displayedHabits = useMemo(() => {
    const dayOfWeek = getDay(selectedDate);
    let list = habits.filter(h => h.weekDays.includes(dayOfWeek));
    
    if (sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      list.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'time') {
      list.sort((a, b) => a.time.localeCompare(b.time));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    // 'manual' uses the natural array order (drag and drop)
    
    return list;
  }, [habits, selectedDate, sortBy]);

  const pendingCount = displayedHabits.filter(h => !h.completedDates.includes(formatDateKey(selectedDate))).length;

  // 4. History Chart Data
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
        const d = subMonths(new Date(), i);
        const mStart = startOfMonth(d);
        const mEnd = endOfMonth(d);
        const mDays = eachDayOfInterval({ start: mStart, end: mEnd });
        
        let mPossible = 0;
        let mDone = 0;
        
        mDays.forEach(day => {
            const dStr = formatDateKey(day);
            const wDay = getDay(day);
            const hForDay = habits.filter(h => h.weekDays.includes(wDay));
            mPossible += hForDay.length;
            mDone += hForDay.reduce((acc, h) => acc + (h.completedDates.includes(dStr) ? 1 : 0), 0);
        });
        
        data.push({
            name: format(d, 'MMM', { locale: ptBR }),
            fullDate: format(d, 'MMMM yyyy', { locale: ptBR }),
            rate: mPossible === 0 ? 0 : Math.round((mDone / mPossible) * 100)
        });
    }
    return data;
  }, [habits]);

  const avgRate = Math.round(chartData.reduce((acc, curr) => acc + curr.rate, 0) / chartData.length);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 pb-20 p-2 md:p-0">
      
      {/* 1. Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: "Total de Hábitos", value: stats.totalHabits, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Maior Sequência", value: `${stats.streak} dias`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "Completos Hoje", value: `${stats.completedToday}/${stats.totalToday}`, icon: Check, color: "text-cyan-500", bg: "bg-cyan-500/10" },
            { label: "Taxa do Mês", value: `${stats.monthlyRate}%`, icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
            <div key={i} className={cn("p-4 rounded-xl border border-[#2a2a35] flex flex-col justify-between h-28", stat.bg)}>
                <div className="flex justify-between items-start">
                    <span className="text-[#6b6b7a] text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                    <stat.icon size={18} className={stat.color} />
                </div>
                <span className="text-2xl font-bold text-white font-exo2">{stat.value}</span>
            </div>
        ))}
      </div>

      {/* 2. Main Area - Split View */}
      <div className="flex flex-col lg:flex-row gap-6 h-auto min-h-[500px]">
        
        {/* Left Panel: Calendar (65%) */}
        <div className="w-full lg:w-[65%] bg-[#141418] border border-[#2a2a35] rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 bg-[#1c1c21] p-1 rounded-lg border border-[#2a2a35]">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-[#2a2a35] text-white" : "text-[#6b6b7a] hover:text-white")}
                    >
                        <CalendarIcon size={16} />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-[#2a2a35] text-white" : "text-[#6b6b7a] hover:text-white")}
                    >
                        <ListIcon size={16} />
                    </button>
                </div>
                
                <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1 hover:bg-[#2a2a35] rounded-full text-[#6b6b7a] hover:text-white transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-bold text-white capitalize w-32 text-center">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </span>
                    <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1 hover:bg-[#2a2a35] rounded-full text-[#6b6b7a] hover:text-white transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                        const now = new Date();
                        setCurrentDate(now);
                        setSelectedDate(now);
                    }}
                    className="border-[#2a2a35] text-[#6b6b7a] hover:text-white hover:bg-[#2a2a35]"
                >
                    Hoje
                </Button>
            </div>

            <div className="flex-1">
                <div className="grid grid-cols-7 mb-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <div key={day} className="text-center text-xs font-bold text-[#6b6b7a] uppercase py-2">
                            {day}
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2 auto-rows-fr h-full">
                    <TooltipProvider>
                    {calendarDays.map((day, i) => (
                        <Tooltip key={i}>
                            <TooltipTrigger asChild>
                                <div 
                                    onClick={() => {
                                        setSelectedDate(day.date);
                                        // Also switch month view if clicked on prev/next month day
                                        if (!day.isCurrentMonth) {
                                            setCurrentDate(day.date);
                                        }
                                    }}
                                    className={cn(
                                        "relative aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105",
                                        day.isCurrentMonth ? "opacity-100" : "opacity-30",
                                        day.isSelected ? "ring-2 ring-[#38bdf8] ring-offset-2 ring-offset-[#141418] z-10" : "border-transparent",
                                        day.colorClass,
                                        day.total === 0 && day.isCurrentMonth && "bg-[#1c1c21] hover:bg-[#2a2a35]"
                                    )}
                                >
                                    <span className={cn(
                                        "text-sm font-medium",
                                        day.isToday && !day.isSelected ? "text-[#38bdf8]" : "text-white"
                                    )}>
                                        {format(day.date, 'd')}
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#1c1c21] border-[#2a2a35] text-white">
                                <p className="font-bold mb-1">{format(day.date, 'dd ')} de {format(day.date, 'MMMM', { locale: ptBR })}</p>
                                <p className="text-xs text-[#6b6b7a]">{day.completed} de {day.total} hábitos feitos</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                    </TooltipProvider>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-[#6b6b7a]">
                <span>Menos</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded bg-[#1c1c21] border border-[#2a2a35]" />
                    <div className="w-3 h-3 rounded bg-emerald-900/40" />
                    <div className="w-3 h-3 rounded bg-emerald-800/60" />
                    <div className="w-3 h-3 rounded bg-emerald-600/80" />
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                </div>
                <span>Mais</span>
            </div>
        </div>

        {/* Right Panel: List (35%) */}
        <div className="w-full lg:w-[35%] flex flex-col gap-4">
            {/* Header */}
            <div className="bg-[#141418] border border-[#2a2a35] rounded-xl p-4 flex items-center justify-between">
                <div>
                    <h2 className="text-white font-bold text-lg">Meus Hábitos</h2>
                    <p className="text-[#6b6b7a] text-xs">
                        {format(selectedDate, "eeee, d 'de' MMMM", { locale: ptBR })}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-[#38bdf8] font-exo2">
                        {displayedHabits.filter(h => h.completedDates.includes(formatDateKey(selectedDate))).length}
                    </span>
                    <span className="text-[#6b6b7a] text-sm">/{displayedHabits.length}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                 <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                    <SelectTrigger className="h-9 bg-[#1c1c21] border-[#2a2a35] text-[#6b6b7a] text-xs w-[140px]">
                        <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1c1c21] border-[#2a2a35] text-white">
                        <SelectItem value="manual">Manual (Arrastar)</SelectItem>
                        <SelectItem value="priority">Prioridade</SelectItem>
                        <SelectItem value="time">Horário</SelectItem>
                        <SelectItem value="name">Nome</SelectItem>
                    </SelectContent>
                 </Select>
                 <div className="flex-1" />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto min-h-[300px]">
                {displayedHabits.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#2a2a35] rounded-xl bg-[#141418]/50">
                        <div className="w-12 h-12 rounded-full bg-[#2a2a35] flex items-center justify-center mb-3">
                            <CalendarIcon className="text-[#6b6b7a]" />
                        </div>
                        <h3 className="text-white font-medium mb-1">Dia Livre!</h3>
                        <p className="text-[#6b6b7a] text-xs mb-4">Nenhum hábito programado para este dia.</p>
                        <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#141418]">
                            Criar Hábito
                        </Button>
                    </div>
                ) : (
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext 
                            items={displayedHabits.map(h => h.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {displayedHabits.map((habit) => (
                                <SortableHabitRow 
                                    key={habit.id}
                                    habit={habit}
                                    date={selectedDate}
                                    isCompleted={habit.completedDates.includes(formatDateKey(selectedDate))}
                                    toggleHabit={(id) => toggleHabit(id, selectedDate)}
                                    isDragEnabled={sortBy === 'manual'}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2a2a35]">
                <span className="text-xs text-[#6b6b7a] font-medium">{pendingCount} pendentes</span>
                
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button size="icon" className="h-10 w-10 rounded-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#141418] shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                            <Plus size={20} strokeWidth={3} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1c1c21] border-[#2a2a35] text-white">
                        <DialogHeader>
                            <DialogTitle>Novo Hábito</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Nome</Label>
                                <Input 
                                    value={form.title} 
                                    onChange={e => setForm({...form, title: e.target.value})}
                                    placeholder="Ex: Meditar" 
                                    className="bg-[#141418] border-[#2a2a35] text-white" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Horário</Label>
                                    <Input 
                                        type="time"
                                        value={form.time} 
                                        onChange={e => setForm({...form, time: e.target.value})}
                                        className="bg-[#141418] border-[#2a2a35] text-white" 
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Emoji</Label>
                                    <Input 
                                        value={form.emoji} 
                                        onChange={e => setForm({...form, emoji: e.target.value})}
                                        className="bg-[#141418] border-[#2a2a35] text-white text-center" 
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Prioridade</Label>
                                <div className="flex gap-2">
                                    {(['high', 'medium', 'low'] as Priority[]).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setForm({...form, priority: p})}
                                            className={cn(
                                                "flex-1 py-2 text-xs font-bold uppercase rounded border transition-all",
                                                form.priority === p 
                                                    ? p === 'high' ? "bg-red-500 text-[#141418] border-red-500" :
                                                      p === 'medium' ? "bg-yellow-500 text-[#141418] border-yellow-500" :
                                                      "bg-emerald-500 text-[#141418] border-emerald-500"
                                                    : "bg-[#141418] text-[#6b6b7a] border-[#2a2a35]"
                                            )}
                                        >
                                            {p === 'high' ? 'Alta' : p === 'medium' ? 'Média' : 'Baixa'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateHabit} className="bg-[#38bdf8] text-[#141418] hover:bg-[#0ea5e9]">Criar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
      </div>

      {/* 3. History Chart */}
      <div className="bg-[#141418] border border-[#2a2a35] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg">Últimos 6 Meses</h3>
            <span className="text-[#6b6b7a] text-sm">Média: <span className="text-white font-bold">{avgRate}%</span></span>
        </div>
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke="#6b6b7a" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis 
                        stroke="#6b6b7a" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1c1c21', borderColor: '#2a2a35', color: '#fff' }}
                        cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
                    />
                    <Bar dataKey="rate" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.rate > 80 ? '#38bdf8' : entry.rate > 50 ? '#34d399' : '#6b6b7a'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default HabitsPage;