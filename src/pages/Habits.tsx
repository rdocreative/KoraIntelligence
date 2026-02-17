import { useState } from 'react';
import { useHabitTracker } from '@/hooks/useHabitTracker';
import { HabitCard } from '@/components/features/habit-tracker/HabitCard';
import { Gamification } from '@/components/features/habit-tracker/Gamification';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const Habits = () => {
  const { 
    habits, 
    totalPoints, 
    streak, 
    completeHabit, 
    addCustomHabit,
    getCurrentBadge,
    getNextBadge
  } = useHabitTracker();

  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitPoints, setNewHabitPoints] = useState('5');

  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    
    const points = parseInt(newHabitPoints) || 0;
    addCustomHabit(newHabitTitle, points);
    setNewHabitTitle('');
    setNewHabitPoints('5');
    toast.success('Hábito personalizado adicionado!');
  };

  const currentBadge = getCurrentBadge();
  const nextBadge = getNextBadge();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 pt-8 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <header className="mb-6">
           <h1 className="text-2xl font-black text-slate-900 dark:text-white">Meus Hábitos</h1>
           <p className="text-slate-500 dark:text-slate-400">Gerencie sua rotina diária</p>
        </header>

        {/* Gamification no topo da aba Hábitos faz sentido para motivar */}
        <Gamification 
            currentBadge={currentBadge} 
            nextBadge={nextBadge} 
            totalPoints={totalPoints}
            streak={streak}
        />

        {/* Lista de Hábitos */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block"></span>
                Checklist de Hoje
                </h2>
                <span className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border shadow-sm">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })}
                </span>
            </div>

            <div className="space-y-3">
                {habits.map((habit) => (
                <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    onComplete={completeHabit} 
                />
                ))}
            </div>
        </div>

        {/* Add Custom Habit */}
        <div className="pt-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Criar novo hábito</h3>
            <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 shadow-none bg-transparent hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                <CardContent className="pt-6">
                <form onSubmit={handleAddCustomHabit} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="habit-name">Nome da tarefa</Label>
                    <Input 
                        id="habit-name"
                        placeholder="Ex: Ler Bíblia..." 
                        value={newHabitTitle}
                        onChange={(e) => setNewHabitTitle(e.target.value)}
                        className="bg-white dark:bg-slate-900"
                    />
                    </div>
                    <div className="flex gap-4">
                        <div className="grid gap-2 w-1/3">
                            <Label htmlFor="habit-points">Pontos</Label>
                            <Input 
                                id="habit-points"
                                type="number" 
                                min="1" 
                                max="100"
                                value={newHabitPoints}
                                onChange={(e) => setNewHabitPoints(e.target.value)}
                                className="bg-white dark:bg-slate-900"
                            />
                        </div>
                        <Button type="submit" className="flex-1 mt-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                            <Plus size={18} className="mr-2" /> Adicionar Hábito
                        </Button>
                    </div>
                </form>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
};

export default Habits;