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

  const lightSweepClass = "after:absolute after:inset-0 after:bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.08)_50%,transparent_70%)] after:pointer-events-none";

  return (
    <div 
      className={cn(
        "group relative flex flex-col gap-3 p-5 rounded-3xl border transition-all duration-300 overflow-hidden shadow-lg",
        // Padrão Verde Esmeralda Vibrante no centro
        "bg-[radial-gradient(circle_at_center,_#10b981_0%,_#064e3b_100%)] border-emerald-400/40",
        lightSweepClass,
        habit.completed && "opacity-70 saturate-[0.8]"
      )}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className="font-rajdhani font-black text-2xl italic w-8 text-center text-emerald-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
          {index + 1}
        </div>

        <div className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300 bg-white/10 border-white/20",
          habit.completed && "bg-emerald-400/20"
        )}>
          {habit.completed ? (
              <Check className="w-5 h-5 text-emerald-100" />
          ) : (
              <Trophy className="w-5 h-5 text-emerald-100/50 group-hover:text-emerald-100" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn("font-bold text-base tracking-tight truncate text-white", habit.completed && "opacity-50 line-through")}>
              {habit.title}
            </h3>
            {!isForToday && (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-white/10 text-white/50 border border-white/10 uppercase">
                OFF
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest">
            <div className="flex gap-1.5">
              {DAY_NAMES.map((day, i) => (
                <span 
                  key={day} 
                  className={cn(
                    "transition-colors",
                    habit.days.includes(i) ? "text-white" : "text-white/20"
                  )}
                >
                  {day[0]}
                </span>
              ))}
            </div>
            <span className="font-rajdhani text-sm text-white font-bold">{habit.points} XP</span>
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
                ? "bg-white/10 text-white border border-white/20" 
                : isForToday 
                  ? "bg-white text-emerald-900 hover:bg-emerald-50" 
                  : "bg-black/20 text-white/30 border border-white/5"
            )}
          >
            {habit.completed ? 'Feito' : 'Check'}
          </Button>
        </div>
      </div>
    </div>
  );
};