"use client";

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

  const lightSweepClass = "after:absolute after:inset-0 after:bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.05)_50%,transparent_70%)] after:pointer-events-none";

  return (
    <div 
      className={cn(
        "group relative flex flex-col gap-3 p-5 rounded-3xl border transition-all duration-300 overflow-hidden shadow-lg",
        // Verde Esmeralda (30% opacidade)
        "bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.3)_0%,_rgba(6,78,59,0.3)_100%)] border-emerald-500/20",
        lightSweepClass,
        habit.completed && "opacity-50 saturate-[0.5]"
      )}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className="font-rajdhani font-black text-2xl italic w-8 text-center text-emerald-400/60 drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]">
          {index + 1}
        </div>

        <div className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300 bg-black/20 border-white/5",
          habit.completed && "bg-emerald-500/20 border-emerald-500/20"
        )}>
          {habit.completed ? (
              <Check className="w-5 h-5 text-emerald-400" />
          ) : (
              <Trophy className="w-5 h-5 text-emerald-400/40 group-hover:text-emerald-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn("font-bold text-base tracking-tight truncate text-white/90", habit.completed && "opacity-50 line-through")}>
              {habit.title}
            </h3>
            {!isForToday && (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-white/5 text-white/30 border border-white/5 uppercase">
                OFF
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            <div className="flex gap-1.5">
              {DAY_NAMES.map((day, i) => (
                <span 
                  key={day} 
                  className={cn(
                    "transition-colors",
                    habit.days.includes(i) ? "text-emerald-400" : "text-white/10"
                  )}
                >
                  {day[0]}
                </span>
              ))}
            </div>
            <span className="font-rajdhani text-sm text-emerald-400 font-bold">{habit.points} XP</span>
          </div>
        </div>

        <div className="shrink-0">
          <Button
            size="sm"
            onClick={() => onComplete(habit.id)}
            disabled={habit.completed || !isForToday}
            className={cn(
              "h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md",
              habit.completed 
                ? "bg-white/5 text-white/40 border border-white/10" 
                : isForToday 
                  ? "bg-[#4adbc8] text-black hover:bg-[#3bc7b6]" 
                  : "bg-black/40 text-white/20 border border-white/5"
            )}
          >
            {habit.completed ? 'Feito' : 'Check'}
          </Button>
        </div>
      </div>
    </div>
  );
};