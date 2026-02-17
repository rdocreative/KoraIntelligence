import { useState } from 'react';
import { useHabitTracker } from '@/hooks/useHabitTracker';
import { HabitCard } from '@/components/features/habit-tracker/HabitCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DailyVerse } from '@/components/features/dashboard/DailyVerse';
import { MonthlyProgress } from '@/components/features/dashboard/MonthlyProgress';
import { MonthlyChart } from '@/components/features/dashboard/MonthlyChart';
import { FAQSection } from '@/components/features/dashboard/FAQSection';
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
  AlertTriangle,
  Save,
  Zap
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
    getCurrentBadge
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

  const handleSaveSettings = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const currentBadge = getCurrentBadge();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      <main className="container max-w-4xl mx-auto px-4 pt-8 space-y-6">
        
        {/* Simple Header */}
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              Mindset Rewards
            </h1>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
               <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
               <span className="font-bold text-sm">{streak} dias</span>
            </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-200/50 dark:bg-slate-900 p-1 rounded-xl">
            <TabsTrigger value="dashboard" className="rounded-lg py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm font-bold">
              <LayoutDashboard size={16} className="mr-2" />
              Início
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm font-bold">
              <Settings size={16} className="mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 animate-in fade-in duration-500 outline-none">
            
            {/* 1. Versículo do Dia */}
            <DailyVerse />

            {/* 2. Progresso Mensal Consolidado */}
            <MonthlyProgress totalPoints={totalPoints} habitsCount={habits.length} />

            <div className="grid md:grid-cols-3 gap-8">
              {/* Coluna Principal: Hábitos */}
              <div className="md:col-span-2 space-y-6">
                 {/* 3. Gráfico de Evolução (Em cima dos hábitos ou abaixo? Abaixo fica melhor em mobile, mas user pediu Evolucao nos requisitos) */}
                 <MonthlyChart history={history} />

                 <div className="pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
                        Hábitos de Hoje
                      </h2>
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

                    {/* Quick Add Form */}
                    <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 shadow-none bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <CardContent className="pt-6">
                        <form onSubmit={handleAddCustomHabit} className="flex flex-col sm:flex-row gap-3 items-end">
                          <div className="grid gap-2 flex-1 w-full">
                            <Label htmlFor="habit-name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nova tarefa</Label>
                            <Input 
                              id="habit-name"
                              placeholder="Ex: Ler Bíblia..." 
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
                          <Button type="submit" variant="secondary" className="w-full sm:w-auto bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold">
                            <Plus size={18} className="mr-2" /> Add
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                 </div>
              </div>

              {/* Sidebar / Coluna Direita */}
              <div className="space-y-8">
                {/* Badge Card */}
                <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-lg shadow-indigo-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-indigo-100">Nível Atual</CardTitle>
                    <Trophy className="h-5 w-5 text-yellow-300" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentBadge.name}</div>
                    <div className="text-4xl mt-2 mb-1">{currentBadge.icon}</div>
                    <p className="text-xs text-indigo-200 mt-2">
                      Continue evoluindo para alcançar novos níveis!
                    </p>
                  </CardContent>
                </Card>

                {/* 4. FAQ */}
                <FAQSection />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="outline-none space-y-6 animate-in slide-in-from-right-4 duration-300">
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

            <div className="flex justify-end pt-4 pb-8">
              <Button 
                onClick={handleSaveSettings}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
              >
                <Save size={20} className="mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;