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
    <div className="space-y-10 animate-in fade-in duration-700 outline-none">
      
      {/* Top Row: Verse & Stats */}
      <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DailyVerse />
          </div>
          <div className="lg:col-span-1">
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