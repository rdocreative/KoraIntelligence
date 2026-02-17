import { useState } from 'react';
import { useHabitTracker } from '@/hooks/useHabitTracker';
import { HabitCard } from '@/components/HabitCard';
import { Gamification } from '@/components/Gamification';
import { ProgressChart } from '@/components/ProgressChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Download, 
  Sheet as SheetIcon, 
  Trophy, 
  Settings, 
  LayoutDashboard, 
  Moon, 
  Sun,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

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

  const { theme, setTheme } = useTheme();
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

  const handleResetData = () => {
    if (confirm("Tem certeza que deseja apagar todos os seus dados? Isso não pode ser desfeito.")) {
      localStorage.removeItem('mindset_history');
      localStorage.removeItem('mindset_custom_habits');
      toast.success('Todos os dados foram resetados.');
      window.location.reload();
    }
  };

  const currentBadge = getCurrentBadge();
  const nextBadge = getNextBadge();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      <main className="container max-w-4xl mx-auto px-4 pt-12 space-y-8">
        
        {/* Header-less Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                <Trophy size={24} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Mindset Rewards
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Ganhe pontos por ações diárias positivas.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
             <div className="text-right">
               <div className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">Total Acumulado</div>
               <div className="font-black text-indigo-600 dark:text-indigo-400 text-2xl">{totalPoints} pts</div>
             </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-200/50 dark:bg-slate-900 p-1 rounded-xl">
            <TabsTrigger value="dashboard" className="rounded-lg py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
              <LayoutDashboard size={18} className="mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
              <Settings size={18} className="mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 outline-none">
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
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
                    Hoje
                  </h2>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm uppercase tracking-wider">
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
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
                <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 shadow-none bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <CardContent className="pt-6">
                    <form onSubmit={handleAddCustomHabit} className="flex flex-col sm:flex-row gap-3 items-end">
                      <div className="grid gap-2 flex-1 w-full">
                        <Label htmlFor="habit-name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nova tarefa</Label>
                        <Input 
                          id="habit-name"
                          placeholder="Ex: Correr 5km..." 
                          value={newHabitTitle}
                          onChange={(e) => setNewHabitTitle(e.target.value)}
                          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        />
                      </div>
                      <div className="grid gap-2 w-full sm:w-24">
                        <Label htmlFor="habit-points" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pontos</Label>
                        <Input 
                          id="habit-points"
                          type="number" 
                          min="1" 
                          max="100"
                          value={newHabitPoints}
                          onChange={(e) => setNewHabitPoints(e.target.value)}
                          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        />
                      </div>
                      <Button type="submit" variant="secondary" className="w-full sm:w-auto bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50">
                        <Plus size={18} className="mr-2" /> Adicionar
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </section>

              {/* Sidebar: Charts */}
              <aside className="space-y-6">
                <ProgressChart history={history} />
                
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-5 rounded-2xl text-sm text-indigo-800 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                  <div className="font-bold mb-1 flex items-center gap-2">
                    <Star size={16} className="text-indigo-500" />
                    Dica do dia
                  </div>
                  Pequenos progressos diários somam grandes resultados. Mantenha a consistência!
                </div>
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="outline-none">
            <div className="grid gap-6">
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Sun className="dark:hidden" size={20} />
                    <Moon className="hidden dark:block" size={20} />
                    Aparência
                  </CardTitle>
                  <CardDescription>Customize como o app se parece para você.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold">Modo Escuro</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Ativa o tema escuro para descansar seus olhos.</p>
                    </div>
                    <Switch 
                      checked={theme === 'dark'} 
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-green-600 dark:text-green-400">
                    <SheetIcon size={20} />
                    Dados e Exportação
                  </CardTitle>
                  <CardDescription>Gerencie seu histórico de hábitos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <div className="font-bold">Backup em CSV</div>
                      <p className="text-xs text-slate-500">Exporte seu progresso para Excel ou Google Sheets.</p>
                    </div>
                    <Button 
                      onClick={handleExport}
                      className="w-full sm:w-auto bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 font-bold"
                    >
                      <Download size={16} className="mr-2" />
                      Baixar Histórico
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-100 dark:border-red-900/30 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <div className="bg-red-50 dark:bg-red-950/20 px-6 py-4 border-b border-red-100 dark:border-red-900/30">
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle size={20} />
                    Zona de Perigo
                  </CardTitle>
                </div>
                <CardContent className="pt-6">
                  <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <div className="font-bold text-red-700 dark:text-red-400">Resetar todos os dados</div>
                      <p className="text-xs text-red-600/70 dark:text-red-400/60">Isso apagará permanentemente todos os seus pontos e hábitos customizados.</p>
                    </div>
                    <Button 
                      variant="destructive"
                      onClick={handleResetData}
                      className="w-full sm:w-auto font-bold bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Apagar Tudo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;