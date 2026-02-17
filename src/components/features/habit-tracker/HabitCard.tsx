import { Habit } from '@/hooks/useHabitTracker';
import { Button } from '@/components/ui/button';
import { Check, Trophy, Flame, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  index?: number; // Para mostrar o "Ranking #1, #2..."
}

export const HabitCard = ({ habit, onComplete, index = 0 }: HabitCardProps) => {
  return (
    <div 
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
        // Base Style
        "bg-[#121212] hover:bg-[#161616]",
        // Border & Shadow
        "border-white/5 hover:border-red-500/20",
        // Elevation
        "shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]",
        habit.completed && "opacity-60 grayscale-[0.5]"
      )}
    >
      {/* Rank Number (Visual only for now) */}
      <div className={cn(
        "font-black text-xl italic w-8 text-center",
        index < 3 ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-neutral-700"
      )}>
        #{index + 1}
      </div>

      {/* Avatar / Icon Container */}
      <div className={cn(
        "h-12 w-12 rounded-full flex items-center justify-center border-2 shadow-inner bg-gradient-to-br from-[#202020] to-[#101010]",
        habit.completed ? "border-green-500/50" : "border-red-500/20 group-hover:border-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
      )}>
        {habit.completed ? (
            <Check className="w-5 h-5 text-green-500" />
        ) : (
            <Trophy className="w-5 h-5 text-neutral-400 group-hover:text-red-500 transition-colors" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={cn("font-bold text-base truncate", habit.completed ? "text-neutral-500 line-through" : "text-white")}>
            {habit.title}
          </h3>
          {/* Badge Example */}
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5 uppercase tracking-wider">
            {habit.type === 'fixed' ? 'Diário' : 'Extra'}
          </span>
        </div>
        
        {/* Mini Stats Bar */}
        <div className="flex items-center gap-4 text-xs font-medium text-neutral-500">
          <span className="flex items-center gap-1">
             <Flame className="w-3 h-3 text-orange-500" /> Nv. 1
          </span>
          <span className="flex items-center gap-1">
             <Zap className="w-3 h-3 text-yellow-500" /> Streak: 5
          </span>
        </div>
      </div>

      {/* Points & Action */}
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 font-black text-lg text-white">
            +{habit.points} <span className="text-yellow-500 text-sm">XP</span>
        </div>
        
        <Button
          size="sm"
          onClick={() => onComplete(habit.id)}
          disabled={habit.completed}
          className={cn(
            "h-8 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300",
            habit.completed 
              ? "bg-green-900/20 text-green-500 border border-green-900/50" 
              : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] border-none"
          )}
        >
          {habit.completed ? 'Feito' : 'Completar'}
        </Button>
      </div>
    </div>
  );
};