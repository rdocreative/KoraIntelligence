import { useState, useMemo } from "react";
import { 
  Plus, Check, ChevronLeft, ChevronRight, 
  LayoutGrid, List as ListIcon, Clock, Flame, 
  BarChart3, CheckCircle2, Calendar as CalendarIcon, 
  ArrowRight, X, Pencil, Trash2, ChevronDown, ChevronUp,
  Play, Pause
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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

// --- Constants ---
const PRIMARY_GRADIENT = "linear-gradient(135deg, #0d1716 0%, #080f0e 60%, #050f0e 100%)";
const INVERTED_GRADIENT = "linear-gradient(135deg, #050f0e 0%, #0a1a18 50%, #0d1716 100%)";

// --- Types ---
type Frequency = 'daily' | 'weekly';
type Priority = 'high' | 'medium' | 'low';

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

// --- Helpers ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

const HabitsPage = () => {
  // --- State ---
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Beber 3L de água', emoji: '💧', frequency: 'daily', priority: 'high', weekDays: [0,1,2,3,4,5,6], time: '08:00', completedDates: [], active: true },
    { id: '2', title: 'Ler 10 páginas', emoji: '📚', frequency: 'daily', priority: 'medium', weekDays: [0,1,2,3,4,5,6], time: '21:00', completedDates: [], active: true },
    { id: '3', title: 'Academia', emoji: '💪', frequency: 'weekly', priority: 'high', weekDays: [1,3,5], time: '18:00', completedDates: [], active: true },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Inline Editing State
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Habit | null>(null);

  // Creation Form State
  const [createForm, setCreateForm] = useState({
    title: "", emoji: "✨", frequency: 'daily' as Frequency, priority: 'medium' as Priority, weekDays: [0,1,2,3,4,5,6], time: "09:00"
  });

  // --- Logic ---

  const toggleHabitCompletion = (id: string, dateOverride?: Date) => {
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

  const handleCreateHabit = () => {
    if (!createForm.title.trim()) return;
    const newHabit: Habit = {
      id: generateId(),
      title: createForm.title,
      emoji: createForm.emoji,
      frequency: createForm.frequency,
      priority: createForm.priority,
      weekDays: createForm.frequency === 'daily' ? [0,1,2,3,4,5,6] : createForm.weekDays,
      time: createForm.time,
      completedDates: [],
      active: true
    };
    setHabits([...habits, newHabit]);
    setIsModalOpen(false);
    setCreateForm({ title: "", emoji: "✨", frequency: 'daily', priority: 'medium', weekDays: [0,1,2,3,4,5,6], time: "09:00" });
  };

  const handleEditClick = (habit: Habit) => {
    if (expandedHabitId === habit.id) {
      setExpandedHabitId(null);
      setEditForm(null);
    } else {
      setExpandedHabitId(habit.id);
      setEditForm({ ...habit });
    }
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    setHabits(habits.map(h => h.id === editForm.id ? editForm : h));
    setExpandedHabitId(null);
    setEditForm(null);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    setExpandedHabitId(null);
    setEditForm(null);
  };

  // --- Computations ---
  const stats = useMemo(() => {
    const todayStr = formatDateKey(new Date());
    const scheduledToday = habits.filter(h => h.active && h.weekDays.includes(getDay(new Date())));
    const completedToday = scheduledToday.filter(h => h.completedDates.includes(todayStr)).length;
    
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const daysInMonth = eachDayOfInterval({ start, end });
    let totalPossible = 0;
    let totalDone = 0;
    daysInMonth.forEach(day => {
        const dStr = formatDateKey(day);
        const dayOfWeek = getDay(day);
        const habitsForDay = habits.filter(h => h.active && h.weekDays.includes(dayOfWeek));
        totalPossible += habitsForDay.length;
        totalDone += habitsForDay.reduce((acc, h) => acc + (h.completedDates.includes(dStr) ? 1 : 0), 0);
    });
    const monthlyRate = totalPossible === 0 ? 0 : Math.round((totalDone / totalPossible) * 100);

    return { totalHabits: habits.length, completedToday, totalToday: scheduledToday.length, streak: 5, monthlyRate };
  }, [habits]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
        const dateStr = formatDateKey(day);
        const dayOfWeek = getDay(day);
        const habitsForDay = habits.filter(h => h.active && h.weekDays.includes(dayOfWeek));
        const total = habitsForDay.length;
        const completed = habitsForDay.filter(h => h.completedDates.includes(dateStr)).length;
        const percentage = total === 0 ? 0 : completed / total;
        
        let colorClass = "bg-[#0a1a18]";
        if (total > 0 && completed > 0) {
             if (percentage <= 0.25) colorClass = "bg-[#00e5cc]/20";
             else if (percentage <= 0.50) colorClass = "bg-[#00e5cc]/40";
             else if (percentage <= 0.75) colorClass = "bg-[#00e5cc]/70";
             else colorClass = "bg-[#00e5cc]";
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

  const displayedHabits = useMemo(() => {
    const dayOfWeek = getDay(selectedDate);
    return habits.filter(h => h.active && h.weekDays.includes(dayOfWeek));
  }, [habits, selectedDate]);

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
        const d = subMonths(new Date(), i);
        const mStart = startOfMonth(d);
        const mEnd = endOfMonth(d);
        const mDays = eachDayOfInterval({ start: mStart, end: mEnd });
        let mPossible = 0; let mDone = 0;
        mDays.forEach(day => {
            const dStr = formatDateKey(day);
            const wDay = getDay(day);
            const hForDay = habits.filter(h => h.active && h.weekDays.includes(wDay));
            mPossible += hForDay.length;
            mDone += hForDay.reduce((acc, h) => acc + (h.completedDates.includes(dStr) ? 1 : 0), 0);
        });
        data.push({
            name: format(d, 'MMM', { locale: ptBR }),
            rate: mPossible === 0 ? 0 : Math.round((mDone / mPossible) * 100)
        });
    }
    return data;
  }, [habits]);

  const avgRate = Math.round(chartData.reduce((acc, curr) => acc + curr.rate, 0) / chartData.length);

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-20 p-2 md:p-0 min-h-screen bg-[#050f0e]">
      
      {/* 1. New Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Habits Card - Cyan */}
        <div 
            style={{ 
                background: "linear-gradient(135deg, #003d38 0%, #0d1716 100%)", 
                borderColor: "rgba(0, 229, 204, 0.4)" 
            }}
            className="p-5 rounded-[12px] border flex flex-col justify-between h-32 relative overflow-hidden group"
        >
            <div className="flex justify-between items-start z-10">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#00e5cc]/60">Hábitos</span>
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center bg-[#00e5cc]/15">
                    <CheckCircle2 size={16} className="text-[#00e5cc]" />
                </div>
            </div>
            <span className="text-[28px] font-extrabold text-[#00e5cc] z-10">{stats.totalHabits}</span>
        </div>

        {/* Streak Card - Orange */}
        <div 
            style={{ 
                background: "linear-gradient(135deg, #3d1f00 0%, #0d1716 100%)", 
                borderColor: "rgba(249, 115, 0, 0.4)" 
            }}
            className="p-5 rounded-[12px] border flex flex-col justify-between h-32 relative overflow-hidden group"
        >
            <div className="flex justify-between items-start z-10">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#f97300]/60">Sequência</span>
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center bg-[#f97300]/15">
                    <Flame size={16} className="text-[#f97300]" />
                </div>
            </div>
            <span className="text-[28px] font-extrabold text-[#f97300] z-10">{stats.streak}d</span>
        </div>

        {/* Today Card - Green */}
        <div 
            style={{ 
                background: "linear-gradient(135deg, #003d1a 0%, #0d1716 100%)", 
                borderColor: "rgba(0, 229, 119, 0.4)" 
            }}
            className="p-5 rounded-[12px] border flex flex-col justify-between h-32 relative overflow-hidden group"
        >
            <div className="flex justify-between items-start z-10">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#00e577]/60">Hoje</span>
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center bg-[#00e577]/15">
                    <Check size={16} className="text-[#00e577]" />
                </div>
            </div>
            <span className="text-[28px] font-extrabold text-[#00e577] z-10">{stats.completedToday}/{stats.totalToday}</span>
        </div>

        {/* Month Card - Purple */}
        <div 
            style={{ 
                background: "linear-gradient(135deg, #1e003d 0%, #0d1716 100%)", 
                borderColor: "rgba(168, 85, 247, 0.4)" 
            }}
            className="p-5 rounded-[12px] border flex flex-col justify-between h-32 relative overflow-hidden group"
        >
            <div className="flex justify-between items-start z-10">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#a855f7]/60">Mês</span>
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center bg-[#a855f7]/15">
                    <BarChart3 size={16} className="text-[#a855f7]" />
                </div>
            </div>
            <span className="text-[28px] font-extrabold text-[#a855f7] z-10">{stats.monthlyRate}%</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Panel: Calendar */}
        <div 
            style={{ background: PRIMARY_GRADIENT, borderColor: "#1a2e2c" }}
            className="w-full lg:w-[65%] border rounded-[12px] p-6 flex flex-col shadow-2xl"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 bg-[#0a1a18] p-1 rounded-lg border border-[#1a2e2c]">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-[#1a2e2c] text-[#00e5cc]" : "text-[#4a7a76] hover:text-[#e2f0ef]")}
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-[#1a2e2c] text-[#00e5cc]" : "text-[#4a7a76] hover:text-[#e2f0ef]")}
                    >
                        <ListIcon size={16} />
                    </button>
                </div>
                
                <div className="flex items-center gap-6">
                    <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="text-[#4a7a76] hover:text-[#00e5cc] hover:scale-110 transition-all"><ChevronLeft size={22} /></button>
                    <span className="text-base font-bold text-[#e2f0ef] uppercase tracking-wider w-40 text-center">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </span>
                    <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="text-[#4a7a76] hover:text-[#00e5cc] hover:scale-110 transition-all"><ChevronRight size={22} /></button>
                </div>

                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
                    className="text-[11px] uppercase font-bold text-[#4a7a76] hover:text-[#00e5cc] hover:bg-[#1a2e2c]"
                >
                    Hoje
                </Button>
            </div>

            <div className="grid grid-cols-7 mb-4">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-[#4a7a76] py-2 opacity-70">{day}</div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 gap-3">
                <TooltipProvider>
                {calendarDays.map((day, i) => (
                    <Tooltip key={i}>
                        <TooltipTrigger asChild>
                            <div 
                                onClick={() => { setSelectedDate(day.date); if (!day.isCurrentMonth) setCurrentDate(day.date); }}
                                className={cn(
                                    "aspect-square rounded-[8px] border flex items-center justify-center cursor-pointer transition-all hover:scale-105 duration-300",
                                    day.isCurrentMonth ? "opacity-100" : "opacity-20",
                                    day.isSelected ? "border-[#00e5cc] ring-2 ring-[#00e5cc]/20 shadow-[0_0_15px_rgba(0,229,204,0.3)]" : "border-transparent",
                                    day.colorClass,
                                    day.total === 0 && day.isCurrentMonth && "bg-[#0a1a18] hover:bg-[#1a2e2c]"
                                )}
                            >
                                <span className={cn("text-xs font-bold", day.isToday && !day.isSelected ? "text-[#00e5cc]" : "text-[#e2f0ef]")}>
                                    {format(day.date, 'd')}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#0a1a18] border-[#1a2e2c] text-[#e2f0ef]">
                            <p className="text-xs font-bold">{format(day.date, 'dd/MM')}</p>
                            <p className="text-[10px] text-[#4a7a76]">{day.completed} de {day.total} feitos</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
                </TooltipProvider>
            </div>

            <div className="flex items-center justify-center gap-3 mt-8 text-[10px] font-bold text-[#4a7a76] uppercase tracking-widest">
                <span>MENOS</span>
                <div className="flex gap-1.5">
                    {[20, 40, 70, 100].map(op => (
                        <div key={op} className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: op === 100 ? '#00e5cc' : `#00e5cc${op}` }} />
                    ))}
                </div>
                <span>MAIS</span>
            </div>
        </div>

        {/* Right Panel: List */}
        <div className="w-full lg:w-[35%] flex flex-col gap-4">
            <div 
                style={{ background: INVERTED_GRADIENT, borderColor: "#1a2e2c" }}
                className="border rounded-[12px] flex flex-col max-h-[600px] overflow-hidden shadow-xl"
            >
                <div className="p-5 border-b border-[#1a2e2c] flex items-center justify-between bg-[#050f0e]/50">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00e5cc]" />
                        <h2 className="text-[#e2f0ef] font-bold text-[13px] uppercase tracking-wider">HÁBITOS ATIVOS</h2>
                    </div>
                    <div className="bg-[#00e5cc20] text-[#00e5cc] text-[12px] px-2.5 py-0.5 rounded-full font-bold">
                        {displayedHabits.filter(h => h.completedDates.includes(formatDateKey(selectedDate))).length}/{displayedHabits.length}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {displayedHabits.length === 0 ? (
                        <div className="p-10 flex flex-col items-center justify-center text-center opacity-50">
                            <Clock className="mb-2 text-[#4a7a76]" />
                            <p className="text-[#4a7a76] text-xs font-bold uppercase tracking-widest">Nada agendado</p>
                        </div>
                    ) : (
                        <div>
                            {displayedHabits.map((habit) => {
                                const isCompleted = habit.completedDates.includes(formatDateKey(selectedDate));
                                const isExpanded = expandedHabitId === habit.id;
                                
                                return (
                                    <div key={habit.id} className="border-b border-[#1a2e2c] last:border-0">
                                        {/* Habit Row */}
                                        <div className={cn(
                                            "group flex items-center gap-3 p-4 transition-all hover:bg-[#0a1a18] cursor-pointer",
                                            isCompleted && "opacity-60 bg-[#050f0e]"
                                        )}>
                                            {/* Check Circle (Left interaction) */}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); toggleHabitCompletion(habit.id); }}
                                                className={cn(
                                                    "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 z-10",
                                                    isCompleted 
                                                        ? "bg-[#00e5cc] border-[#00e5cc]" 
                                                        : "border-[#4a7a76] hover:border-[#00e5cc]"
                                                )}
                                            >
                                                {isCompleted && <Check size={12} className="text-[#050f0e] stroke-[3px]" />}
                                            </button>

                                            {/* Main Content (Click to Expand) */}
                                            <div 
                                                className="flex-1 flex items-center justify-between"
                                                onClick={() => handleEditClick(habit)}
                                            >
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className={cn("font-medium text-[#e2f0ef] truncate text-sm transition-colors", isExpanded && "text-[#00e5cc]")}>
                                                            {habit.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] text-[#4a7a76]">
                                                        {habit.time && (
                                                            <div className="flex items-center gap-1">
                                                                <Clock size={10} className="text-[#00e5cc]" />
                                                                <span>{habit.time}</span>
                                                            </div>
                                                        )}
                                                        <div className={cn(
                                                            "w-1.5 h-1.5 rounded-full ml-1",
                                                            habit.priority === 'high' ? "bg-red-500" : habit.priority === 'medium' ? "bg-yellow-500" : "bg-emerald-500"
                                                        )} />
                                                    </div>
                                                </div>

                                                {/* Right Actions */}
                                                <div className="flex items-center text-[#4a7a76] gap-1 group-hover:text-[#00e5cc] transition-colors">
                                                    <Pencil size={14} className="opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Inline Edit Panel */}
                                        <div className={cn(
                                            "overflow-hidden transition-all duration-300 ease-in-out bg-[#050f0e] shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]",
                                            isExpanded ? "max-h-[300px] border-t border-[#1a2e2c]" : "max-h-0"
                                        )}>
                                            {isExpanded && editForm && (
                                                <div className="p-4 space-y-4">
                                                    {/* Name & Time */}
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div className="col-span-2 space-y-1">
                                                            <Label className="text-[10px] uppercase text-[#4a7a76]">Nome</Label>
                                                            <Input 
                                                                value={editForm.title} 
                                                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                                                className="h-8 bg-[#0a1a18] border-[#1a2e2c] text-xs text-[#e2f0ef] focus-visible:ring-[#00e5cc]" 
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px] uppercase text-[#4a7a76]">Horário</Label>
                                                            <Input 
                                                                type="time"
                                                                value={editForm.time} 
                                                                onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                                                                className="h-8 bg-[#0a1a18] border-[#1a2e2c] text-xs text-[#e2f0ef] focus-visible:ring-[#00e5cc]" 
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Priority & Active */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px] uppercase text-[#4a7a76]">Prioridade</Label>
                                                            <div className="flex gap-1">
                                                                {[
                                                                    { v: 'high', c: 'bg-red-500', l: 'Alta' }, 
                                                                    { v: 'medium', c: 'bg-yellow-500', l: 'Méd' }, 
                                                                    { v: 'low', c: 'bg-emerald-500', l: 'Baix' }
                                                                ].map((p) => (
                                                                    <button
                                                                        key={p.v}
                                                                        onClick={() => setEditForm({...editForm, priority: p.v as Priority})}
                                                                        className={cn(
                                                                            "flex-1 h-6 rounded text-[9px] font-bold uppercase transition-all border border-transparent",
                                                                            editForm.priority === p.v 
                                                                                ? `${p.c} text-[#050f0e] border-white/20` 
                                                                                : "bg-[#0a1a18] text-[#4a7a76] hover:bg-[#1a2e2c]"
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

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 pt-1">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleDeleteHabit(habit.id)}
                                                            className="flex-1 h-8 bg-transparent border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 text-[10px] uppercase tracking-wider"
                                                        >
                                                            <Trash2 size={12} className="mr-1.5" /> Excluir
                                                        </Button>
                                                        <Button 
                                                            size="sm"
                                                            onClick={handleSaveEdit}
                                                            className="flex-[2] h-8 bg-[#00e5cc] hover:bg-[#00c9b3] text-[#050f0e] font-bold text-[10px] uppercase tracking-wider"
                                                        >
                                                            Salvar Alterações
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full bg-[#00e5cc] hover:bg-[#00e5cc] hover:brightness-110 transition-all duration-200 text-[#050f0e] font-bold text-[13px] uppercase tracking-widest h-12 rounded-[12px] shadow-[0_0_20px_rgba(0,229,204,0.2)]">
                        <Plus className="mr-2" size={18} strokeWidth={3} /> NOVO HÁBITO
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0d1716] border-[#1a2e2c] text-[#e2f0ef]">
                    <DialogHeader><DialogTitle className="text-[#e2f0ef] uppercase tracking-widest text-sm">Criar Hábito</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label className="text-[#4a7a76] text-[10px] uppercase font-bold">Nome</Label>
                            <Input value={createForm.title} onChange={e => setCreateForm({...createForm, title: e.target.value})} className="bg-[#050f0e] border-[#1a2e2c] text-[#e2f0ef]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-[#4a7a76] text-[10px] uppercase font-bold">Horário</Label>
                                <Input type="time" value={createForm.time} onChange={e => setCreateForm({...createForm, time: e.target.value})} className="bg-[#050f0e] border-[#1a2e2c] text-[#e2f0ef]" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-[#4a7a76] text-[10px] uppercase font-bold">Prioridade</Label>
                                <Select onValueChange={(v: any) => setCreateForm({...createForm, priority: v})} defaultValue={createForm.priority}>
                                    <SelectTrigger className="bg-[#050f0e] border-[#1a2e2c] text-[#e2f0ef]"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-[#0a1a18] border-[#1a2e2c] text-[#e2f0ef]">
                                        <SelectItem value="high">Alta</SelectItem>
                                        <SelectItem value="medium">Média</SelectItem>
                                        <SelectItem value="low">Baixa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter><Button onClick={handleCreateHabit} className="bg-[#00e5cc] text-[#050f0e] font-bold">CRIAR</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* History Chart */}
      <div 
        style={{ background: PRIMARY_GRADIENT, borderColor: "#1a2e2c" }}
        className="border rounded-[12px] p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-[#e2f0ef] font-bold text-[13px] uppercase tracking-widest">DESEMPENHO MENSAL</h3>
            <div className="flex items-center gap-2">
                <span className="text-[#4a7a76] text-[11px] font-bold">MÉDIA GLOBAL:</span>
                <span className="text-[#00e5cc] font-bold text-[22px]">{avgRate}%</span>
            </div>
        </div>
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2e2c" vertical={false} />
                    <XAxis dataKey="name" stroke="#4a7a76" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#4a7a76" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                    <RechartsTooltip cursor={{ fill: 'rgba(0, 229, 204, 0.05)' }} contentStyle={{ backgroundColor: '#0d1716', borderColor: '#1a2e2c', borderRadius: '8px' }} />
                    <Bar dataKey="rate" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {chartData.map((_, i) => <Cell key={`cell-${i}`} fill="#00e5cc" />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default HabitsPage;