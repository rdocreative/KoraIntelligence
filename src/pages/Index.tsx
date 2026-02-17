import { useState } from 'react';
import { useHabitTracker } from '@/hooks/useHabitTracker';
import { HabitCard } from '@/components/HabitCard';
import { Gamification } from '@/components/Gamification';
import { ProgressChart } from '@/components/ProgressChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Download, Sheet as SheetIcon, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const { 
    habits, 
    totalPoints, 
    history, 
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

  const handleExport = () => {
    // Simple CSV export
    const headers = ['Date', 'Points', 'Habit IDs'];
    const rows = history.map(d => [d.date, d.points, d.completedHabitIds.join('|')]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mindset_rewards_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Histórico exportado com sucesso!');
  };

  const currentBadge = getCurrentBadge();
  const nextBadge = getNextBadge();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Trophy size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Mindset Rewards
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total</div>
               <div className="font-bold text-indigo-600 text-lg">{totalPoints} pts</div>
             </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Gamification Stats */}
        <section className="animate-in slide-in-from-bottom-4 duration-700 fade-in">
          <Gamification 
            currentBadge={currentBadge} 
            nextBadge={nextBadge} 
            totalPoints={totalPoints}
            streak={streak}
          />
        </section>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Main Content: Habits List */}
          <section className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-500 rounded-full inline-block"></span>
                Ações de Hoje
              </h2>
              <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
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

            {/* Custom Habit Form */}
            <Card className="border-dashed border-2 border-slate-200 shadow-none bg-transparent hover:bg-slate-50/50 transition-colors">
              <CardContent className="pt-6">
                <form onSubmit={handleAddCustomHabit} className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="grid gap-2 flex-1 w-full">
                    <label htmlFor="habit-name" className="text-sm font-medium text-slate-500">Adicionar nova tarefa</label>
                    <Input 
                      id="habit-name"
                      placeholder="Ex: Correr 5km..." 
                      value={newHabitTitle}
                      onChange={(e) => setNewHabitTitle(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div className="grid gap-2 w-full sm:w-24">
                    <label htmlFor="habit-points" className="text-sm font-medium text-slate-500">Pontos</label>
                    <Input 
                      id="habit-points"
                      type="number" 
                      min="1" 
                      max="100"
                      value={newHabitPoints}
                      onChange={(e) => setNewHabitPoints(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <Button type="submit" variant="secondary" className="w-full sm:w-auto bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                    <Plus size={18} className="mr-2" /> Adicionar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>

          {/* Sidebar: Charts & Export */}
          <aside className="space-y-6">
            <ProgressChart history={history} />
            
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <SheetIcon className="text-green-400" size={20} />
                  Exportar Dados
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Salve seu progresso para analisar no Excel ou Google Sheets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleExport}
                  className="w-full bg-white text-slate-900 hover:bg-slate-100 font-medium"
                >
                  <Download size={16} className="mr-2" />
                  Baixar CSV
                </Button>
                <p className="text-xs text-slate-500 mt-4 text-center">
                  Dica: Importe o CSV no Google Sheets para criar gráficos personalizados!
                </p>
              </CardContent>
            </Card>
            
            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100">
              <strong>Dica do dia:</strong> Pequenos progressos diários somam grandes resultados ao longo do tempo. Mantenha a consistência! 🌟
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default Index;
