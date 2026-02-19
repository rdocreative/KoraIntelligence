import { Habit } from '@/hooks/useHabitTracker';
import { Button } from '@/components/ui/button';
import { Check, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  index?: number;
}

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const HabitCard = ({ habit, onComplete, index = 0 }: HabitCardProps) => {
  const todayWeekday = new Date().getDay();
  const isForToday = habit.days.includes(todayWeekday);

  return (
    <div 
      className={cn(
        "group relative flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-300",
        "bg-transparent hover:bg-white/[0.03]",
        "border-[#222230] hover:border-red-500/20",
        habit.completed && "opacity-60 grayscale-[0.5]"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Rank Number */}
        <div className={cn(
          "font-rajdhani font-bold text-xl italic w-8 text-center",
          index < 3 ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-[#6b6b7a]"
        )}>
          #{index + 1}
        </div>

        {/* Icon Container */}
        <div className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center border-2 shadow-inner bg-transparent shrink-0",
          habit.completed ? "border-green-500/50" : "border-[#1e1e2a] group-hover:border-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
        )}>
          {habit.completed ? (
              <Check className="w-5 h-5 text-green-500" />
          ) : (
              <Trophy className="w-5 h-5 text-[#6b6b7a] group-hover:text-red-500 transition-colors" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className={cn("font-bold text-base truncate", habit.completed ? "text-[#6b6b7a] line-through" : "text-[#f0f0f2]")}>
              {habit.title}
            </h3>
            {!isForToday && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-transparent text-[#6b6b7a] border border-[#222230] uppercase tracking-wider">
                Fora da Escala
              </span>
            )}
          </div>
          
          {habit.description && (
            <p className="text-xs text-[#6b6b7a] line-clamp-1 mb-2 font-normal">
              {habit.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-[10px] font-bold text-[#6b6b7a] uppercase tracking-tighter">
            <div className="flex gap-1">
              {DAY_NAMES.map((day, i) => (
                <span 
                  key={day} 
                  className={cn(
                    "px-1 rounded-sm",
                    habit.days.includes(i) ? "text-red-500" : "text-[#4a4a5a]"
                  )}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Points & Action */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1 font-rajdhani font-bold text-lg text-white">
              +{habit.points} <span className="text-yellow-500 text-sm">XP</span>
          </div>
          
          <Button
            size="sm"
            onClick={() => onComplete(habit.id)}
            disabled={habit.completed || !isForToday}
            className={cn(
              "h-8 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300",
              habit.completed 
                ? "bg-green-900/10 text-green-500 border border-green-900/40" 
                : isForToday 
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
                  : "bg-transparent text-[#6b6b7a] border border-[#222230] cursor-not-allowed"
            )}
          >
            {habit.completed ? 'Feito' : 'Completar'}
          </Button>
        </div>
      </div>
    </div>
  );
};