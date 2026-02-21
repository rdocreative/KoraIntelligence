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
  subDays
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Styles constants from Design System ---
const PRIMARY_GRADIENT = "linear-gradient(135deg, #0d1716 0%, #080f0e 60%, #050f0e 100%)";
const INTERNAL_GRADIENT = "linear-gradient(135deg, #0a1a18 0%, #070d0c 100%)";
const BORDER_COLOR = "#1a2e2c";
const ACCENT_COLOR = "#00e5cc";
const TEXT_MAIN = "#e2f0ef";
const TEXT_SECONDARY = "#4a7a76";

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
    background: INTERNAL_GRADIENT,
    borderColor: BORDER_COLOR,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
  };

  const priorityColors = {
    high: "#ef4444",
    medium: "#fbbf24",
    low: "#34d399",
  };

  const currentMonthStr = format(date, 'yyyy-MM');
  const completionsThisMonth = habit.completedDates.filter(d => d.startsWith(currentMonthStr)).length;
  const totalDaysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 p-[14px] rounded-[8px] border transition-all mb-2",
        isCompleted && "opacity-60"
      )}
    >
        {isDragEnabled && (
             <div 
                {...attributes} 
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-[#4a7a76] hover:text-[#00e5cc]"
             >
                <GripVertical size={16} />
             </div>
        )}

        <button 
            onClick={() => toggleHabit(habit.id)}
            className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                isCompleted 
                    ? "bg-[#00e5cc] border-[#00e5cc]" 
                    : "border-[#4a7a76] hover:border-[#00e5cc]"
            )}
        >
            {isCompleted && <Check size={12} className="text-[#050f0e] stroke-[3px]" />}
        </button>

        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
                <span className="font-medium text-[#e2f0ef] truncate text-sm">{habit.title}</span>
                <div 
                    className="h-1.5 w-1.5 rounded-full" 
                    style={{ backgroundColor: priorityColors[habit.priority] }} 
                />
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#4a7a76] uppercase tracking-wider font-medium">
                {habit.time && (
                    <div className="flex items-center gap-1">
                        <Clock size={10} className="text-[#00e5cc]" />
                        <span>{habit.time}</span>
                    </div>
                )}
                <span className="truncate">MÊS: {completionsThisMonth}/{totalDaysInMonth}</span>
            </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 hover:bg-white/5 rounded-lg text-[#4a7a76] hover:text-[#00e5cc]">
                <ArrowRight size={14} />
            </button>
        </div>
    </div>
  );
};

const HabitsPage = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Beber 3L de água', emoji: '💧', frequency: 'daily', priority: 'high', weekDays: [0,1,2,3,4,5,6], time: '08:00', completedDates: [] },
    { id: '2', title: 'Ler 10 páginas', emoji: '📚', frequency: 'daily', priority: 'medium', weekDays: [0,1,2,3,4,5,6], time: '21:00', completedDates: [] },
    { id: '3', title: 'Academia', emoji: '💪', frequency: 'weekly', priority: 'high', weekDays: [1,3,5], time: '18:00', completedDates: [] },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'manual' | 'priority' | 'time' | 'name'>('manual');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [form, setForm] = useState({
    title: "", emoji: "✨", frequency: 'daily' as Frequency, priority: 'medium' as Priority, weekDays: [0,1,2,3,4,5,6], time: "09:00"
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const stats = useMemo(() => {
    const todayStr = formatDateKey(new Date());
    const scheduledToday = habits.filter(h => h.weekDays.includes(getDay(new Date())));
    const completedToday = scheduledToday.filter(h => h.completedDates.includes(todayStr)).length;
    
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
        const habitsForDay = habits.filter(h => h.weekDays.includes(dayOfWeek));
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
    let list = habits.filter(h => h.weekDays.includes(dayOfWeek));
    if (sortBy === 'priority') {
      const order = { high: 1, medium: 2, low: 3 };
      list.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortBy === 'time') {
      list.sort((a, b) => a.time.localeCompare(b.time));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [habits, selectedDate, sortBy]);

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
            const hForDay = habits.filter(h => h.weekDays.includes(wDay));
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
    <div className="animate-in fade-in duration-700 space-y-6 pb-20 p-2 md:p-0 min-h-screen bg-[#050f0e]">
      
      {/* 1. Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: "Hábitos", value: stats.totalHabits, icon: CheckCircle2, color: "#00e5cc" },
            { label: "Sequência", value: `${stats.streak}d`, icon: Flame, color: "#fbbf24" },
            { label: "Hoje", value: `${stats.completedToday}/${stats.totalToday}`, icon: Check, color: "#00e5cc" },
            { label: "Mês", value: `${stats.monthlyRate}%`, icon: BarChart3, color: "#a78bfa" },
        ].map((stat, i) => (
            <div 
                key={i} 
                style={{ background: PRIMARY_GRADIENT, borderColor: BORDER_COLOR, boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
                className="p-5 rounded-[12px] border flex flex-col justify-between h-28"
            >
                <div className="flex justify-between items-start">
                    <span className="text-[#4a7a76] text-[11px] font-bold uppercase tracking-widest">{stat.label}</span>
                    <div 
                        className="w-9 h-9 rounded-[8px] flex items-center justify-center"
                        style={{ backgroundColor: `${stat.color}33` }}
                    >
                        <stat.icon size={18} style={{ color: stat.color }} />
                    </div>
                </div>
                <span className="text-[22px] font-bold text-[#e2f0ef]">{stat.value}</span>
            </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Panel: Calendar */}
        <div 
            style={{ background: PRIMARY_GRADIENT, borderColor: BORDER_COLOR, boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
            className="w-full lg:w-[65%] border rounded-[12px] p-5 flex flex-col"
        >
            <div className="flex items-center justify-between mb-6">
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
                
                <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="text-[#4a7a76] hover:text-[#00e5cc]"><ChevronLeft size={20} /></button>
                    <span className="text-sm font-semibold text-[#e2f0ef] uppercase tracking-wider w-32 text-center">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </span>
                    <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="text-[#4a7a76] hover:text-[#00e5cc]"><ChevronRight size={20} /></button>
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

            <div className="grid grid-cols-7 mb-2">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-[#4a7a76] py-2">{day}</div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
                <TooltipProvider>
                {calendarDays.map((day, i) => (
                    <Tooltip key={i}>
                        <TooltipTrigger asChild>
                            <div 
                                onClick={() => { setSelectedDate(day.date); if (!day.isCurrentMonth) setCurrentDate(day.date); }}
                                className={cn(
                                    "aspect-square rounded-[8px] border flex items-center justify-center cursor-pointer transition-all hover:scale-105",
                                    day.isCurrentMonth ? "opacity-100" : "opacity-20",
                                    day.isSelected ? "border-[#00e5cc] ring-1 ring-[#00e5cc]" : "border-transparent",
                                    day.colorClass,
                                    day.total === 0 && day.isCurrentMonth && "bg-[#0a1a18]"
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

            <div className="flex items-center justify-center gap-3 mt-6 text-[10px] font-bold text-[#4a7a76] uppercase tracking-widest">
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
                style={{ background: PRIMARY_GRADIENT, borderColor: BORDER_COLOR }}
                className="border rounded-[12px] p-5 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00e5cc]" />
                    <h2 className="text-[#e2f0ef] font-bold text-[13px] uppercase tracking-wider">HÁBITOS ATIVOS</h2>
                </div>
                <div className="bg-[#00e5cc20] text-[#00e5cc] text-[12px] px-2.5 py-0.5 rounded-full font-bold">
                    {displayedHabits.filter(h => h.completedDates.includes(formatDateKey(selectedDate))).length}/{displayedHabits.length}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px]">
                {displayedHabits.length === 0 ? (
                    <div style={{ background: INTERNAL_GRADIENT }} className="p-10 border border-dashed border-[#1a2e2c] rounded-[12px] text-center">
                        <p className="text-[#4a7a76] text-xs font-bold uppercase tracking-widest">Nada hoje</p>
                    </div>
                ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={displayedHabits.map(h => h.id)} strategy={verticalListSortingStrategy}>
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

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full bg-[#00e5cc] hover:bg-[#00c9b3] text-[#050f0e] font-bold text-[13px] uppercase tracking-widest h-12 rounded-[12px]">
                        <Plus className="mr-2" size={18} strokeWidth={3} /> NOVO HÁBITO
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0d1716] border-[#1a2e2c] text-[#e2f0ef]">
                    <DialogHeader><DialogTitle className="text-[#e2f0ef] uppercase tracking-widest text-sm">Criar Hábito</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label className="text-[#4a7a76] text-[10px] uppercase font-bold">Nome</Label>
                            <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-[#050f0e] border-[#1a2e2c] text-[#e2f0ef]" />
                        </div>
                    </div>
                    <DialogFooter><Button onClick={handleCreateHabit} className="bg-[#00e5cc] text-[#050f0e] font-bold">CRIAR</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* History Chart */}
      <div 
        style={{ background: PRIMARY_GRADIENT, borderColor: BORDER_COLOR, boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
        className="border rounded-[12px] p-6"
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
                        {chartData.map((_, i) => <Cell key={`cell-${i}`} fill={ACCENT_COLOR} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default HabitsPage;