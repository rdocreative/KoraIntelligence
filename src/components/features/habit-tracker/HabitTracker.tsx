import { Plus } from 'lucide-react';
import { Habit, useHabitTracker } from '@/hooks/useHabitTracker';
import { HabitCard } from './HabitCard';
import { Gamification } from './Gamification';
import { Button } from '@/components/ui/button';

interface HabitTrackerProps {
  habits: Habit[];
  totalPoints: number;
  onComplete: (id: string) => void;
  onAdd: (habit: any) => void;
}

const BADGES = [
  { name: 'Iniciante', icon: '🌱', threshold: 0, color: 'text-green-500' },
  { name: 'Guerreiro', icon: '⚔️', threshold: 500, color: 'text-blue-500' },
  { name: 'Mestre', icon: '🎓', threshold: 1500, color: 'text-purple-500' },
  { name: 'Lenda', icon: '🔥', threshold: 3000, color: 'text-red-500' },
];

export const HabitTracker = ({ habits, totalPoints, onComplete, onAdd }: HabitTrackerTrackerProps) => {
  const currentBadgeIndex = [...BADGES].reverse().findIndex(b => totalPoints >= b.threshold);
  const currentBadge = BADGES[BADGES.length - 1 - currentBadgeIndex];
  const nextBadge = BADGES[BADGES.length - currentBadgeIndex] || null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Missões Diárias</h2>
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">Seus objetivos para hoje</p>
            </div>
            <Button size="sm" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-4">
              <Plus className="w-4 h-4 mr-2" /> Novo Hábito
            </Button>
          </div>
          
          <div className="space-y-3">
            {habits.map((habit, index) => (
              <HabitCard 
                key={habit.id} 
                habit={habit} 
                onComplete={onComplete} 
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="md:col-span-1">
          <Gamification 
            currentBadge={currentBadge} 
            nextBadge={nextBadge} 
            totalPoints={totalPoints} 
            streak={7} 
          />
        </div>
      </div>
    </div>
  );
};