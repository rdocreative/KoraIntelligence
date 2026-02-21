import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Tipos
type Frequency = 'daily' | 'weekly';

interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: Frequency;
  weekDays: number[]; // 0 = Domingo, 1 = Segunda...
  completedDates: string[]; // YYYY-MM-DD
}

// Helper para data de hoje
const getTodayString = () => new Date().toISOString().split('T')[0];

const TasksPage = () => {
  // Estado
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Hoje');
  
  // Estado do Form
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitEmoji, setNewHabitEmoji] = useState("✨");
  const [newHabitFrequency, setNewHabitFrequency] = useState<Frequency>('daily');
  const [newHabitWeekDays, setNewHabitWeekDays] = useState<number[]>([0,1,2,3,4,5,6]);

  // Lógica de Criação
  const handleCreateHabit = () => {
    if (!newHabitTitle.trim()) return;
    
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      title: newHabitTitle,
      emoji: newHabitEmoji,
      frequency: newHabitFrequency,
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
    setNewHabitWeekDays([0,1,2,3,4,5,6]);
  };

  // Lógica de Toggle
  const toggleHabit = (id: string) => {
    const today = getTodayString();
    setHabits(habits.map(h => {
      if (h.id === id) {
        const isCompleted = h.completedDates.includes(today);
        return {
          ...h,
          completedDates: isCompleted 
            ? h.completedDates.filter(d => d !== today)
            : [...h.completedDates, today]
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
    // Para simplificar, 'Semana' mostra todos também, ou poderia ser uma view de calendário
    // Aqui vou mostrar todos os ativos, similar a 'Todas' por enquanto, ou filtrar diferente se necessário
    displayedHabits = habits; 
  } else {
    displayedHabits = habits;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 pb-20">
       {/* Header Texts */}
       <div className="space-y-1">
        <h1 className="text-2xl font-bold font-exo2 text-white">Hábitos</h1>
        <p className="text-[#6b6b7a] font-rajdhani font-medium">Seus hábitos de hoje</p>
      </div>

      {/* Progresso (Só aparece se tiver hábitos hoje) */}
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
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {['Hoje', 'Semana', 'Todas'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-rajdhani font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === tab 
                  ? 'bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20' 
                  : 'text-[#6b6b7a] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="h-8 w-8 rounded-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#141418] shadow-[0_0_10px_rgba(56,189,248,0.3)]">
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
      
      {/* Lista de Hábitos */}
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
            displayedHabits.map((habit) => {
                const isCompleted = habit.completedDates.includes(getTodayString());
                return (
                    <div 
                        key={habit.id}
                        onClick={() => toggleHabit(habit.id)}
                        className={cn(
                            "group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                            isCompleted 
                                ? "bg-[#141418]/30 border-[#2a2a35] opacity-60" 
                                : "bg-[#1c1c21] border-[#2a2a35] hover:border-[#38bdf8]/50 hover:bg-[#1c1c21]/80"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-[#2a2a35]/50 flex items-center justify-center text-xl">
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
                        
                        <div className={cn(
                            "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                            isCompleted 
                                ? "bg-[#38bdf8] border-[#38bdf8]" 
                                : "border-[#6b6b7a] group-hover:border-[#38bdf8]"
                        )}>
                            {isCompleted && <Check size={14} className="text-[#141418] stroke-[3px]" />}
                        </div>
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
};
export default TasksPage;