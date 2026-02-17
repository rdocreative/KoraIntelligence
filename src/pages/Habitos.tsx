import { useState } from 'react';
import { useHabitTracker } from '@/hooks/useHabitTracker';
import { HabitCard } from '@/components/features/habit-tracker/HabitCard';
import { Gamification } from '@/components/features/habit-tracker/Gamification';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const Habitos = () => {
  const { habits, completeHabit, addCustomHabit, totalPoints, streak, getCurrentBadge, getNextBadge } = useHabitTracker();
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitPoints, setNewHabitPoints] = useState('5');

  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    addCustomHabit(newHabitTitle, parseInt(newHabitPoints) || 0);
    setNewHabitTitle('');
    setNewHabitPoints('5');
    toast.success('Hábito adicionado!');
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 pt-12 space-y-8 pb-24">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Meus Hábitos</h1>
        <p className="text-slate-500 dark:text-slate-400">Complete suas ações diárias para ganhar XP e subir de nível.</p>
      </div>

      <Gamification 
        currentBadge={getCurrentBadge()} 
        nextBadge={getNextBadge()} 
        totalPoints={totalPoints} 
        streak={streak} 
      />

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="text-indigo-500" size={20} />
            Ações de Hoje
          </h2>
        </div>

        <div className="grid gap-3">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onComplete={completeHabit} />
          ))}
        </div>

        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-transparent">
          <CardContent className="pt-6">
            <form onSubmit={handleAddCustomHabit} className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="grid gap-2 flex-1 w-full">
                <Label className="text-[10px] font-black uppercase text-slate-500">Novo Hábito</Label>
                <Input 
                  placeholder="Ex: Beber água..." 
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  className="bg-white dark:bg-slate-900"
                />
              </div>
              <div className="grid gap-2 w-full sm:w-24">
                <Label className="text-[10px] font-black uppercase text-slate-500">Pontos</Label>
                <Input 
                  type="number" 
                  value={newHabitPoints}
                  onChange={(e) => setNewHabitPoints(e.target.value)}
                  className="bg-white dark:bg-slate-900"
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
                <Plus size={18} className="mr-2" /> Adicionar
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Habitos;