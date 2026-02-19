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
        "bg-[#0a0a0c] hover:bg-[#0c0c0e] border-white/5 hover:border-red-900/40",
        "shadow-2xl",
        habit.completed && "opacity-40"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn(
          "font-rajdhani font-black text-2xl italic w-8 text-center",
          index < 3 ? "text-red-900/40 group-hover:text-red-600/60 transition-colors" : "text-white/[0.02]"
        )}>
          {index + 1}
        </div>

        <div className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300",
          habit.completed 
            ? "bg-green-900/10 border-green-900/20" 
            : "bg-black border-white/5 group-hover:border-red-900/30 group-hover:bg-red-900/5"
        )}>
          {habit.completed ? (
              <Check className="w-5 h-5 text-green-900/60" />
          ) : (
              <Trophy className="w-5 h-5 text-white/5 group-hover:text-red-900/80 transition-colors" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn("font-bold text-base tracking-tight truncate", habit.completed ? "text-white/10 line-through" : "text-white/80 group-hover:text-white transition-colors")}>
              {habit.title}
            </h3>
            {!isForToday && (
              <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-black text-white/10 border border-white/[0.02] uppercase">
                OFF
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-[10px] font-bold text-white/10 uppercase tracking-widest">
            <div className="flex gap-1.5">
              {DAY_NAMES.map((day, i) => (
                <span 
                  key={day} 
                  className={cn(
                    "transition-colors",
                    habit.days.includes(i) ? (habit.completed ? "text-green-900/20" : "text-red-900/60") : "text-white/[0.02]"
                  )}
                >
                  {day[0]}
                </span>
              ))}
            </div>
            <span className="font-rajdhani text-sm text-red-900/40 font-bold group-hover:text-red-900/60">{habit.points} XP</span>
          </div>
        </div>

        <div className="shrink-0">
          <button
            onClick={() => onComplete(habit.id)}
            disabled={habit.completed || !isForToday}
            className={cn(
              "h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              habit.completed 
                ? "bg-transparent text-green-900/40 border border-green-900/10" 
                : isForToday 
                  ? "bg-red-950/40 hover:bg-red-900/60 text-red-500/80 border border-red-900/20 hover:border-red-500/40" 
                  : "bg-black text-white/5 border border-white/[0.02] cursor-not-allowed"
            )}
          >
            {habit.completed ? 'Feito' : 'Check'}
          </button>
        </div>
      </div>
    </div>
  );
};