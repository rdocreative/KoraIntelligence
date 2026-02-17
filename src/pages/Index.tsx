import { useState } from 'react';
import { useHabitTracker } from '@/hooks/useHabitTracker';
import { HabitCard } from '@/components/features/habit-tracker/HabitCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { DailyVerse } from '@/components/features/dashboard/DailyVerse';
import { MonthlyProgress } from '@/components/features/dashboard/MonthlyProgress';
import { MonthlyChart } from '@/components/features/dashboard/MonthlyChart';
import { FAQSection } from '@/components/features/dashboard/FAQSection';
import { Gamification } from '@/components/features/habit-tracker/Gamification';
import { 
  Plus, 
  LayoutDashboard, 
  Settings as SettingsIcon
} from 'lucide-react';
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
    toast.success('Hábito adicionado com sucesso!');
  };

  const currentBadge = getCurrentBadge();
  const nextBadge = getNextBadge();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Title Section Removed (Now in TopBar), using space for Verse/Stats */}
      
      <Tabs defaultValue="overview" className="w-full space-y-8">
        <div className="flex items-center justify-between">
            <TabsList className="bg-[#121212] p-1 border border-white/5 rounded-full">
              <TabsTrigger value="overview" className="rounded-full px-6 py-2 data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all">
                <LayoutDashboard size={14} className="mr-2" /> Visão Geral
              </TabsTrigger>
              <TabsTrigger value="habits" className="rounded-full px-6 py-2 data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all">
                 Meus Hábitos
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-full px-6 py-2 data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all">
                 <SettingsIcon size={14} className="mr-2" /> Ajustes
              </TabsTrigger>
            </TabsList>
            
            <span className="hidden md:inline-flex text-xs font-bold text-neutral-500 uppercase tracking-widest">
                Painel Principal
            </span>
        </div>

        <TabsContent value="overview" className="space-y-8 outline-none">
          {/* Top Row: Verse & Stats */}
          <div className="grid lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2">
                <DailyVerse />
             </div>
             <div className="lg:col-span-1">
                {/* Simplified Gamification for Sidebar style */}
                <Gamification 
                  currentBadge={currentBadge} 
                  nextBadge={nextBadge} 
                  totalPoints={totalPoints}
                  streak={streak}
                />
             </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
             {/* Main Column */}
             <div className="lg:col-span-2 space-y-8">
                <MonthlyProgress totalPoints={totalPoints} habitsCount={habits.length} />
                <MonthlyChart history={history} />
             </div>

             {/* Right Column (Habits Preview) */}
             <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="font-bold text-lg text-white">Tarefas Prioritárias</h3>
                   <span className="text-xs text-red-500 font-bold cursor-pointer hover:underline">Ver todas</span>
                </div>
                <div className="space-y-4">
                  {habits.slice(0, 4).map((habit, index) => (
                    <HabitCard 
                      key={habit.id} 
                      habit={habit} 
                      onComplete={completeHabit}
                      index={index} 
                    />
                  ))}
                </div>
             </div>
          </div>
        </TabsContent>

        <TabsContent value="habits" className="space-y-8 outline-none animate-in slide-in-from-right-4">
             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-red-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-white">Ranking de Atividades</h2>
                    </div>
                    
                    <div className="space-y-4">
                        {habits.map((habit, index) => (
                            <HabitCard 
                            key={habit.id} 
                            habit={habit} 
                            onComplete={completeHabit}
                            index={index} 
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="glass-card border-dashed border-2 border-white/10 bg-transparent hover:bg-white/5 transition-colors">
                        <CardContent className="pt-8 pb-8 text-center">
                            <h3 className="text-lg font-bold text-white mb-2">Criar Nova Missão</h3>
                            <p className="text-neutral-500 text-sm mb-6">Adicione um novo hábito personalizado para ganhar mais XP.</p>
                            
                            <form onSubmit={handleAddCustomHabit} className="flex flex-col gap-4 max-w-sm mx-auto">
                                <Input 
                                    placeholder="Nome da missão..." 
                                    value={newHabitTitle}
                                    onChange={(e) => setNewHabitTitle(e.target.value)}
                                    className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-neutral-600"
                                />
                                <div className="flex gap-2">
                                    <Input 
                                        type="number" 
                                        placeholder="XP" 
                                        value={newHabitPoints}
                                        onChange={(e) => setNewHabitPoints(e.target.value)}
                                        className="bg-[#0a0a0a] border-white/10 text-white w-24"
                                    />
                                    <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold">
                                        <Plus size={18} className="mr-2" /> Adicionar
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <FAQSection />
                </div>
             </div>
        </TabsContent>

        <TabsContent value="settings">
            <div className="p-8 glass-card rounded-2xl text-center text-neutral-500">
                Ajustes de sistema em breve.
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;