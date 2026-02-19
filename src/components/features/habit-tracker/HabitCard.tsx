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
        "group relative flex flex-col gap-3 p-5 rounded-3xl border transition-all duration-300 overflow-hidden",
        "bg-[#0a0a0c] hover:bg-[#050506] border-white/5 hover:border-red-900/40",
        "shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8)]",
        habit.completed && "opacity-40"
      )}
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn(
          "font-rajdhani font-black text-2xl italic w-8 text-center",
          index < 3 ? "text-red-700/80" : "text-white/5"
        )}>
          {index + 1}
        </div>

        <div className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300",
          habit.completed 
            ? "bg-green-950/20 border-green-900/30" 
            : "bg-black border-white/5 group-hover:border-red-900/50"
        )}>
          {habit.completed ? (
              <Check className="w-5 h-5 text-green-600" />
          ) : (
              <Trophy className="w-5 h-5 text-white/10 group-hover:text-red-700" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn("font-bold text-base tracking-tight truncate", habit.completed ? "text-white/10 line-through" : "text-neutral-200")}>
              {habit.title}
            </h3>
            {!isForToday && (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-white/5 text-white/20 border border-white/5 uppercase">
                OFF
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-[10px] font-bold text-white/20 uppercase tracking-widest">
            <div className="flex gap-1.5">
              {DAY_NAMES.map((day, i) => (
                <span 
                  key={day} 
                  className={cn(
                    "transition-colors",
                    habit.days.includes(i) ? (habit.completed ? "text-green-900/40" : "text-red-900") : "text-white/5"
                  )}
                >
                  {day[0]}
                </span>
              ))}
            </div>
            <span className="font-rajdhani text-sm text-red-900/60 font-bold">{habit.points} XP</span>
          </div>
        </div>

        <div className="shrink-0">
          <Button
            size="sm"
            onClick={() => onComplete(habit.id)}
            disabled={habit.completed || !isForToday}
            className={cn(
              "h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              habit.completed 
                ? "bg-transparent text-green-900 border border-green-950" 
                : isForToday 
                  ? "bg-red-800 hover:bg-red-700 text-white shadow-lg shadow-black" 
                  : "bg-neutral-900/50 text-white/5 border border-white/5"
            )}
          >
            {habit.completed ? 'Feito' : 'Check'}
          </Button>
        </div>
      </div>
    </div>
  );
};