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

  return (
    <div 
      className={cn(
        "group relative flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-300 backdrop-blur-2xl backdrop-saturate-0",
        "bg-zinc-500/[0.02] hover:bg-zinc-500/[0.04]",
        "border-white/10 hover:border-red-500/40",
        "shadow-2xl shadow-black/80",
        habit.completed && "opacity-60"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Rank Number */}
        <div className={cn(
          "font-rajdhani font-bold text-xl italic w-8 text-center",
          index < 3 ? "text-red-500" : "text-white/30"
        )}>
          #{index + 1}
        </div>

        {/* Icon Container */}
        <div className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center border-2 bg-white/5 shrink-0 transition-all",
          habit.completed ? "border-green-500/50" : "border-white/10 group-hover:border-red-500"
        )}>
          {habit.completed ? (
              <Check className="w-5 h-5 text-green-500" />
          ) : (
              <Trophy className="w-5 h-5 text-white/20 group-hover:text-red-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className={cn("font-bold text-base truncate", habit.completed ? "text-white/30 line-through" : "text-white")}>
              {habit.title}
            </h3>
            {!isForToday && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/40 border border-white/10 uppercase tracking-widest">
                OFF
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-[10px] font-bold text-white/30 uppercase tracking-widest">
            <div className="flex gap-1.5">
              {DAY_NAMES.map((day, i) => (
                <span 
                  key={day} 
                  className={cn(
                    "transition-colors",
                    habit.days.includes(i) ? (habit.completed ? "text-green-500/50" : "text-red-500") : "text-white/10"
                  )}
                >
                  {day[0]}
                </span>
              ))}
            </div>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="font-rajdhani text-sm text-white/60">{habit.points} XP</span>
          </div>
        </div>

        {/* Action */}
        <div className="shrink-0">
          <Button
            size="sm"
            onClick={() => onComplete(habit.id)}
            disabled={habit.completed || !isForToday}
            className={cn(
              "h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
              habit.completed 
                ? "bg-green-600/10 text-green-500 border border-green-500/30" 
                : isForToday 
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
                  : "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
            )}
          >
            {habit.completed ? 'Feito' : 'Check'}
          </Button>
        </div>
      </div>
    </div>
  );
};