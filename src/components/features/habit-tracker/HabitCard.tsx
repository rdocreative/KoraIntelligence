import { Habit } from '../hooks/useHabitTracker';
import { Button } from './ui/button';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
}

export const HabitCard = ({ habit, onComplete }: HabitCardProps) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
        habit.completed 
          ? "bg-green-50 border-green-200 shadow-sm opacity-80" 
          : "bg-white border-slate-100 shadow-md hover:shadow-lg hover:-translate-y-1"
      )}
    >
      <div className="flex-1">
        <h3 className={cn("font-medium text-lg", habit.completed ? "text-green-800 line-through decoration-green-500/50" : "text-slate-800")}>
          {habit.title}
        </h3>
        <p className="text-sm text-slate-500 font-medium">+{habit.points} pontos</p>
      </div>

      <Button
        size="icon"
        variant={habit.completed ? "ghost" : "default"}
        onClick={() => onComplete(habit.id)}
        disabled={habit.completed}
        className={cn(
          "h-12 w-12 rounded-full transition-all duration-500",
          habit.completed 
            ? "text-green-600 hover:text-green-700 hover:bg-green-100" 
            : "bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-slate-500/20 hover:scale-110"
        )}
      >
        {habit.completed ? (
          <CheckCircle2 className="h-8 w-8 animate-in zoom-in duration-300" />
        ) : (
          <Circle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};
