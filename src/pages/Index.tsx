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
    <div className="space-y-10 animate-in fade-in duration-700 outline-none relative">
      {/* 
        O DailyVerse agora fica 'solto' aqui. 
        Como ele é fixed, ele flutua sobre a página e não ocupa espaço no layout. 
      */}
      <DailyVerse />
      
      {/* Top Row: Apenas o Gamification agora, ocupando o lado direito ou a linha toda se preferir */}
      <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-start-3 lg:col-span-1">
            <Gamification 
              currentBadge={currentBadge} 
              nextBadge={nextBadge} 
              totalPoints={totalPoints}
              streak={streak}
            />
          </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Coluna Principal (Esquerda/Centro) */}
          <div className="lg:col-span-2 space-y-8">
            <MonthlyProgress totalPoints={totalPoints} habitsCount={habits.length} />
            <MonthlyChart history={history} />
          </div>

          {/* Coluna Direita (Hábitos) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between mb-2">
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
  );
};

export default Index;