import { useState } from "react";
import { Plus, Check, GripVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
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

// Tipos
type Frequency = 'daily' | 'weekly';
type Priority = 'high' | 'medium' | 'low';

interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: Frequency;
  priority: Priority;
  weekDays: number[]; // 0 = Domingo, 1 = Segunda...
  completedDates: string[]; // YYYY-MM-DD
}

// Helper para data de hoje
const getTodayString = () => new Date().toISOString().split('T')[0];

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const SortableHabitItem = ({ 
  habit, 
  toggleHabit, 
  isCompleted 
}: { 
  habit: Habit; 
  toggleHabit: (id: string) => void; 
  isCompleted: boolean; 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  const priorityLabels = {
    high: "Alta",
    medium: "Média",
    low: "Baixa",
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-center justify-between p-4 rounded-xl border transition-all select-none",
        isCompleted 
            ? "bg-[#141418]/30 border-[#2a2a35]" 
            : "bg-[#1c1c21] border-[#2a2a35] hover:border-[#38bdf8]/50 hover:bg-[#1c1c21]/80"
      )}
    >
      <div className="flex items-center gap-3">
         {/* Drag Handle */}
         <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/10 text-[#6b6b7a]"
         >
            <GripVertical size={18} />
         </div>

         {/* Content */}
         <div 
            className="flex items-center gap-4 flex-1 cursor-pointer"
            onClick={() => toggleHabit(habit.id)}
         >
            <div className="h-10 w-10 rounded-full bg-[#2a2a35]/50 flex items-center justify-center text-xl shrink-0">
                {habit.emoji}
            </div>
            <div>
                <h3 className={cn(
                    "font-medium text-base transition-all",
                    isCompleted ? "text-[#6b6b7a] line-through decoration-[#38bdf8]/50" : "text-white"
                )}>
                    {habit.title}
                </h3>
                <p className="text-xs text-[#6b6b7a]">
                    {habit.frequency === 'daily' ? 'Todos os dias' : 'Dias específicos'}
                </p>
            </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Priority Badge */}
        <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border", priorityColors[habit.priority])}>
            {priorityLabels[habit.priority]}
        </span>

        {/* Check Circle */}
        <div 
            onClick={() => toggleHabit(habit.id)}
            className={cn(
                "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer",
                isCompleted 
                    ? "bg-[#38bdf8] border-[#38bdf8]" 
                    : "border-[#6b6b7a] group-hover:border-[#38bdf8]"
            )}
        >
            {isCompleted && <Check size={14} className="text-[#141418] stroke-[3px]" />}
        </div>
      </div>
    </div>
  );
};

const HabitsPage = () => {
  // Estado
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Hoje');
  
  // Estado do Form
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitEmoji, setNewHabitEmoji] = useState("✨");
  const [newHabitFrequency, setNewHabitFrequency] = useState<Frequency>('daily');
  const [newHabitPriority, setNewHabitPriority] = useState<Priority>('medium');
  const [newHabitWeekDays, setNewHabitWeekDays] = useState<number[]>([0,1,2,3,4,5,6]);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  // Lógica de Criação
  const handleCreateHabit = () => {
    if (!newHabitTitle.trim()) return;
    
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      title: newHabitTitle,
      emoji: newHabitEmoji,
      frequency: newHabitFrequency,
      priority: newHabitPriority,
      weekDays: newHabitFrequency === 'daily' ? [0,1,2,3,4,5,6] : newHabitWeekDays,
      completedDates: []
    };

    setHabits([...habits, newHabit]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewHabitTitle("");
    setNewHabitEmoji("✨");
    setNewHabitFrequency('daily');
    setNewHabitPriority('medium');
    setNewHabitWeekDays([0,1,2,3,4,5,6]);
  };

  // Lógica de Toggle
  const toggleHabit = (id: string, dateStr?: string) => {
    const targetDate = dateStr || getTodayString();
    setHabits(habits.map(h => {
      if (h.id === id) {
        const isCompleted = h.completedDates.includes(targetDate);
        return {
          ...h,
          completedDates: isCompleted 
            ? h.completedDates.filter(d => d !== targetDate)
            : [...h.completedDates, targetDate]
        };
      }
      return h;
    }));
  };

  // Filtragem e Progresso
  const todayIndex = new Date().getDay(); // 0-6
  
  // Hábitos programados para hoje (baseado no dia da semana)
  const scheduledForToday = habits.filter(h => h.weekDays.includes(todayIndex));
  
  // Progresso
  const completedTodayCount = scheduledForToday.filter(h => h.completedDates.includes(getTodayString())).length;
  const totalTodayCount = scheduledForToday.length;
  const progress = totalTodayCount === 0 ? 0 : (completedTodayCount / totalTodayCount) * 100;

  // Filtragem para exibição
  let displayedHabits: Habit[] = [];
  if (activeTab === 'Hoje') {
    displayedHabits = scheduledForToday;
  } else if (activeTab === 'Semana') {
    displayedHabits = habits; 
  } else {
    displayedHabits = habits;
  }

  // Calendar Helpers
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 pb-20">
       {/* Header Texts */}
       <div className="space-y-1">
        <h1 className="text-2xl font-bold font-exo2 text-white">Hábitos</h1>
        <p className="text-[#6b6b7a] font-rajdhani font-medium">Seus hábitos de hoje</p>
      </div>

      {/* Progresso (Só aparece se tiver hábitos hoje e não estiver na aba calendário) */}
      {totalTodayCount > 0 && activeTab === 'Hoje' && (
        <div className="bg-[#141418]/50 border border-[#2a2a35] p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white font-medium">Progresso Diário</span>
            <span className="text-[#38bdf8]">{completedTodayCount}/{totalTodayCount} hábitos</span>
          </div>
          <Progress value={progress} className="h-2 bg-[#2a2a35]" indicatorClassName="bg-[#38bdf8]" />
        </div>
      )}

      {/* Filtros e Ações */}
      <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
        <div className="flex gap-2">
          {['Hoje', 'Semana', 'Todas', 'Calendário'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-xs font-rajdhani font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap",
                activeTab === tab 
                  ? 'bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20' 
                  : 'text-[#6b6b7a] hover:text-white hover:bg-white/5 border border-transparent'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="h-8 w-8 rounded-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#141418] shadow-[0_0_10px_rgba(56,189,248,0.3)] shrink-0">
                <Plus size={16} strokeWidth={3} />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1c1c21] border-[#2a2a35] text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Hábito</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do hábito</Label>
                <Input 
                  id="name" 
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder="Ex: Beber água" 
                  className="bg-[#141418] border-[#2a2a35] text-white focus-visible:ring-[#38bdf8]"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 gap-2">
                  <Label htmlFor="emoji">Emoji</Label>
                  <div className="flex items-center justify-center bg-[#141418] border border-[#2a2a35] rounded-md h-10 px-3">
                    <Input 
                        id="emoji" 
                        value={newHabitEmoji}
                        onChange={(e) => setNewHabitEmoji(e.target.value)}
                        className="bg-transparent border-0 p-0 text-center text-lg focus-visible:ring-0 h-auto w-full"
                        maxLength={2}
                    />
                  </div>
                </div>
                <div className="col-span-3 gap-2">
                   <Label>Prioridade</Label>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => setNewHabitPriority('high')}
                        className={cn("flex-1 h-10 rounded-md border text-xs font-bold transition-all", 
                            newHabitPriority === 'high' ? "bg-red-500/20 text-red-400 border-red-500/50" : "bg-[#141418] text-[#6b6b7a] border-[#2a2a35]")}
                      >Alta</button>
                      <button 
                        onClick={() => setNewHabitPriority('medium')}
                        className={cn("flex-1 h-10 rounded-md border text-xs font-bold transition-all", 
                            newHabitPriority === 'medium' ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" : "bg-[#141418] text-[#6b6b7a] border-[#2a2a35]")}
                      >Média</button>
                      <button 
                        onClick={() => setNewHabitPriority('low')}
                        className={cn("flex-1 h-10 rounded-md border text-xs font-bold transition-all", 
                            newHabitPriority === 'low' ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-[#141418] text-[#6b6b7a] border-[#2a2a35]")}
                      >Baixa</button>
                   </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Frequência</Label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setNewHabitFrequency('daily')}
                        className={cn(
                            "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors border",
                            newHabitFrequency === 'daily' 
                                ? "bg-[#38bdf8]/10 border-[#38bdf8] text-[#38bdf8]" 
                                : "bg-[#141418] border-[#2a2a35] text-[#6b6b7a] hover:bg-[#2a2a35]"
                        )}
                    >
                        Diário
                    </button>
                    <button
                        onClick={() => setNewHabitFrequency('weekly')}
                        className={cn(
                            "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors border",
                            newHabitFrequency === 'weekly' 
                                ? "bg-[#38bdf8]/10 border-[#38bdf8] text-[#38bdf8]" 
                                : "bg-[#141418] border-[#2a2a35] text-[#6b6b7a] hover:bg-[#2a2a35]"
                        )}
                    >
                        Dias da Semana
                    </button>
                </div>
              </div>

              {newHabitFrequency === 'weekly' && (
                <div className="flex justify-between gap-1">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (newHabitWeekDays.includes(index)) {
                                    setNewHabitWeekDays(newHabitWeekDays.filter(d => d !== index));
                                } else {
                                    setNewHabitWeekDays([...newHabitWeekDays, index]);
                                }
                            }}
                            className={cn(
                                "w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all",
                                newHabitWeekDays.includes(index)
                                    ? "bg-[#38bdf8] text-[#141418]"
                                    : "bg-[#141418] border border-[#2a2a35] text-[#6b6b7a]"
                            )}
                        >
                            {day}
                        </button>
                    ))}
                </div>
              )}

            </div>
            <DialogFooter>
              <Button onClick={handleCreateHabit} className="bg-[#38bdf8] text-[#141418] hover:bg-[#0ea5e9]">
                Criar Hábito
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Calendar View */}
      {activeTab === 'Calendário' ? (
        <div className="border border-[#2a2a35] rounded-xl overflow-hidden bg-[#141418]/50">
            <div className="p-4 flex items-center justify-between border-b border-[#2a2a35] bg-[#1c1c21]">
                <h3 className="text-white font-medium capitalize">{monthName}</h3>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-1 hover:bg-[#2a2a35] rounded text-white"><ChevronLeft size={16} /></button>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-1 hover:bg-[#2a2a35] rounded text-white"><ChevronRight size={16} /></button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-max">
                    {/* Header Row */}
                    <div className="flex border-b border-[#2a2a35]">
                        <div className="w-40 p-3 shrink-0 sticky left-0 bg-[#1c1c21] z-10 border-r border-[#2a2a35] text-sm text-[#6b6b7a] font-medium">Hábito</div>
                        {monthDays.map(day => {
                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const dayOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][date.getDay()];
                            const isToday = date.toDateString() === new Date().toDateString();
                            return (
                                <div key={day} className={cn("w-10 p-2 shrink-0 flex flex-col items-center justify-center border-r border-[#2a2a35]/50 last:border-0", isToday && "bg-[#38bdf8]/10")}>
                                    <span className={cn("text-[10px] font-bold", isToday ? "text-[#38bdf8]" : "text-[#6b6b7a]")}>{dayOfWeek}</span>
                                    <span className={cn("text-sm font-medium", isToday ? "text-[#38bdf8]" : "text-white")}>{day}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Habit Rows */}
                    {habits.map((habit, idx) => (
                        <div key={habit.id} className={cn("flex border-b border-[#2a2a35] last:border-0 hover:bg-[#2a2a35]/30", idx % 2 === 0 ? "bg-[#1c1c21]/30" : "bg-transparent")}>
                             <div className="w-40 p-3 shrink-0 sticky left-0 bg-[#1c1c21] z-10 border-r border-[#2a2a35] flex items-center gap-2 overflow-hidden">
                                <span className="text-lg">{habit.emoji}</span>
                                <span className="text-sm text-white truncate">{habit.title}</span>
                             </div>
                             {monthDays.map(day => {
                                const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
                                const isCompleted = habit.completedDates.includes(dateStr);
                                const isToday = dateStr === getTodayString();
                                
                                return (
                                    <div 
                                        key={day} 
                                        onClick={() => toggleHabit(habit.id, dateStr)}
                                        className={cn(
                                            "w-10 shrink-0 flex items-center justify-center border-r border-[#2a2a35]/50 last:border-0 cursor-pointer hover:bg-[#38bdf8]/5 transition-colors",
                                            isToday && "ring-1 ring-inset ring-[#38bdf8] bg-[#38bdf8]/5"
                                        )}
                                    >
                                        {isCompleted && (
                                            <div className="h-5 w-5 rounded-full bg-[#38bdf8] flex items-center justify-center">
                                                <Check size={12} className="text-[#141418] stroke-[3px]" />
                                            </div>
                                        )}
                                    </div>
                                );
                             })}
                        </div>
                    ))}
                    {habits.length === 0 && (
                        <div className="p-8 text-center text-[#6b6b7a] text-sm">Nenhum hábito cadastrado.</div>
                    )}
                </div>
            </div>
        </div>
      ) : (
      
      /* Lista de Hábitos (Sortable) */
      <div className="space-y-3">
        {displayedHabits.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-[300px] border border-dashed border-[#2a2a35] rounded-2xl bg-[#141418]/50">
             <div className="h-12 w-12 rounded-full bg-[#2a2a35] flex items-center justify-center mb-3">
                <Plus className="text-[#6b6b7a]" />
             </div>
             <p className="text-[#6b6b7a] font-exo2 text-sm">
                {activeTab === 'Hoje' ? "Nenhum hábito para hoje." : "Sua lista está vazia."}
             </p>
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
                    {displayedHabits.map((habit) => {
                        const isCompleted = habit.completedDates.includes(getTodayString());
                        return (
                            <SortableHabitItem 
                                key={habit.id}
                                habit={habit}
                                toggleHabit={(id) => toggleHabit(id)}
                                isCompleted={isCompleted}
                            />
                        );
                    })}
                </SortableContext>
            </DndContext>
        )}
      </div>
      )}
    </div>
  );
};

export default HabitsPage;