import { useHabitTracker } from '@/hooks/useHabitTracker';
import { HabitCard } from '@/components/features/habit-tracker/HabitCard';
import { DailyVerse } from '@/components/features/dashboard/DailyVerse';
import { MonthlyProgress } from '@/components/features/dashboard/MonthlyProgress';
import { MonthlyChart } from '@/components/features/dashboard/MonthlyChart';
import { Gamification } from '@/components/features/habit-tracker/Gamification';

const Index = () => {
  const { 
    habits, 
    totalPoints, 
    history, 
    streak, 
    completeHabit, 
    getCurrentBadge,
    getNextBadge
  } = useHabitTracker();

  const currentBadge = getCurrentBadge();
  const nextBadge = getNextBadge();

  return (
    <div className="space-y-8 animate-in fade-in duration-700 outline-none relative">
      {/* Componente flutuante de frase do dia */}
      <DailyVerse />
      
      {/* Status Mensal no Topo (Full Width) */}
      <MonthlyProgress totalPoints={totalPoints} habitsCount={habits.length} />

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
              totalPoints={totalPoints}
              streak={streak}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-lg text-white">Tarefas Prioritárias</h3>
                  <span className="text-xs text-red-500 font-bold cursor-pointer hover:underline">Ver todas</span>
              </div>
              <div className="space-y-4">
                {habits.slice(0, 5).map((habit, index) => (
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
      </div>
    </div>
  );
};

export default Index;