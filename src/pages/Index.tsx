import { useHabitTracker } from '@/hooks/useHabitTracker';
import { useProfile } from '@/hooks/useProfile';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { HabitCard } from '@/components/features/habit-tracker/HabitCard';
import { MonthlyProgress } from '@/components/features/dashboard/MonthlyProgress';
import { MonthlyChart } from '@/components/features/dashboard/MonthlyChart';
import { Gamification } from '@/components/features/habit-tracker/Gamification';
import { BADGES } from '@/hooks/useHabitTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';

const Index = () => {
  // Hooks existentes
  const { 
    habits, 
    history, 
    completeHabit
  } = useHabitTracker();

  // Novos hooks conectados ao Supabase
  const { profile, loading: profileLoading } = useProfile();
  const { activeHabits, pendingTasks, activeGoals, loading: statsLoading } = useDashboardStats();

  // Calcular badges com base no XP real do perfil
  const xpTotal = profile?.xp_total || 0;
  const streak = profile?.streak_atual || 0;

  let currentBadge = BADGES[0];
  let nextBadge = null;

  for (let i = 0; i < BADGES.length; i++) {
    if (xpTotal >= BADGES[i].threshold) {
      currentBadge = BADGES[i];
      nextBadge = BADGES[i + 1] || null;
    }
  }

  const isLoading = profileLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#4adbc8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 outline-none relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Status Mensal no Topo (Full Width) */}
      <MonthlyProgress 
        totalPoints={xpTotal} 
        habitsCount={activeHabits}
        tasksCount={pendingTasks}
        goalsCount={activeGoals}
      />

      <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Coluna da Esquerda: Gráficos e Detalhes */}
          <div className="lg:col-span-2 space-y-8">
            <MonthlyChart history={history} />
          </div>

          {/* Coluna da Direita: Gamificação e Hábitos */}
          <div className="lg:col-span-1 space-y-8">
            <Gamification 
              currentBadge={currentBadge} 
              nextBadge={nextBadge} 
              totalPoints={xpTotal}
              streak={streak}
            />

            {/* Seção de Tarefas Prioritárias envelopada em Card */}
            <Card className="card-glass border-white/10 overflow-hidden shadow-2xl shadow-black/60">
              <CardHeader className="border-b border-white/5 pb-4 bg-gradient-to-r from-white/[0.03] to-transparent">
                  <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-[#4adbc8]" />
                        Tarefas Prioritárias
                      </CardTitle>
                      <span className="text-xs text-[#4adbc8] font-bold cursor-pointer hover:underline">Ver todas</span>
                  </div>
              </CardHeader>
              <CardContent className="pt-6 bg-gradient-to-r from-transparent to-white/[0.02]">
                <div className="space-y-4">
                  {habits.slice(0, 5).map((habit, index) => (
                    <HabitCard 
                      key={habit.id} 
                      habit={habit} 
                      onComplete={completeHabit}
                      index={index} 
                    />
                  ))}
                  {habits.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/5">
                      <p className="text-sm text-neutral-400 font-medium">Nenhum hábito ativo.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
};

export default Index;