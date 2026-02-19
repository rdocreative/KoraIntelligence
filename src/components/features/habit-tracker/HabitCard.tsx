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
        "group relative flex flex-col gap-3 p-5 rounded-[2rem] border transition-all duration-500 backdrop-blur-[50px]",
        "bg-black/60 hover:bg-black/80",
        "border-white/5 hover:border-red-600/50",
        "shadow-2xl shadow-black",
        habit.completed && "opacity-60"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Rank Number */}
        <div className={cn(
          "font-rajdhani font-black text-2xl italic w-8 text-center",
          index < 3 ? "text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" : "text-white/20"
        )}>
          {index + 1}
        </div>

        {/* Icon Container */}
        <div className={cn(
          "h-14 w-14 rounded-2xl flex items-center justify-center border transition-all duration-500",
          habit.completed 
            ? "bg-green-600/20 border-green-500/50" 
            : "bg-white/[0.03] border-white/10 group-hover:border-red-600 group-hover:bg-red-600/10"
        )}>
          {habit.completed ? (
              <Check className="w-6 h-6 text-green-500" />
          ) : (
              <Trophy className="w-6 h-6 text-white/20 group-hover:text-red-500 group-hover:scale-110 transition-transform" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn("font-bold text-lg tracking-tight truncate", habit.completed ? "text-white/20 line-through" : "text-white")}>
              {habit.title}
            </h3>
            {!isForToday && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/5 uppercase tracking-tighter">
                OFF
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-[11px] font-bold text-white/20 uppercase tracking-widest">
            <div className="flex gap-2">
              {DAY_NAMES.map((day, i) => (
                <span 
                  key={day} 
                  className={cn(
                    "transition-colors",
                    habit.days.includes(i) ? (habit.completed ? "text-green-500/40" : "text-red-600") : "text-white/5"
                  )}
                >
                  {day[0]}
                </span>
              ))}
            </div>
            <span className="w-1 h-1 rounded-full bg-red-600/30" />
            <span className="font-rajdhani text-base text-red-500 font-bold">{habit.points} XP</span>
          </div>
        </div>

        {/* Action */}
        <div className="shrink-0">
          <Button
            size="sm"
            onClick={() => onComplete(habit.id)}
            disabled={habit.completed || !isForToday}
            className={cn(
              "h-11 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500",
              habit.completed 
                ? "bg-green-600/10 text-green-500 border border-green-500/20" 
                : isForToday 
                  ? "bg-red-700 hover:bg-red-600 text-white shadow-[0_10px_20px_-5px_rgba(220,38,38,0.5)] border border-red-500/50" 
                  : "bg-white/5 text-white/10 border border-white/5 cursor-not-allowed"
            )}
          >
            {habit.completed ? 'Feito' : 'Check'}
          </Button>
        </div>
      </div>
    </div>
  );
};