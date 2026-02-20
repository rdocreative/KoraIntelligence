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

  // Cor Temática: Verde Neon (#00FF7F)
  const themeColor = "text-[#00FF7F]";
  const themeBg = "bg-[#00FF7F]";
  const themeBorder = "border-[#00FF7F]";

  return (
    <div 
      className={cn(
        "group relative flex flex-col gap-3 p-5 rounded-3xl border transition-all duration-300 backdrop-blur-xl overflow-hidden shadow-md shadow-black/20",
        "bg-[#0A0A0A] border-white/5 hover:border-[#00FF7F]/30",
        habit.completed && "opacity-50"
      )}
    >
      {/* Efeito Neon Sweep na borda inferior ao passar o mouse */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#00FF7F] group-hover:w-full transition-all duration-500 shadow-[0_0_15px_#00FF7F]" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn(
          "font-rajdhani font-black text-2xl italic w-8 text-center",
          index < 3 ? "text-[#00FF7F] drop-shadow-[0_0_8px_rgba(0,255,127,0.4)]" : "text-white/10"
        )}>
          {index + 1}
        </div>

        <div className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300",
          habit.completed 
            ? "bg-[#00FF7F]/10 border-[#00FF7F]/30" 
            : "bg-black/60 border-white/10 group-hover:border-[#00FF7F]/50 group-hover:bg-[#00FF7F]/5"
        )}>
          {habit.completed ? (
              <Check className="w-5 h-5 text-[#00FF7F]" />
          ) : (
              <Trophy className="w-5 h-5 text-white/20 group-hover:text-[#00FF7F]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn("font-bold text-base tracking-tight truncate", habit.completed ? "text-white/20 line-through" : "text-white")}>
              {habit.title}
            </h3>
            {!isForToday && (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-white/5 text-white/30 border border-white/5 uppercase">
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
                    habit.days.includes(i) ? (habit.completed ? "text-[#00FF7F]/40" : themeColor) : "text-white/5"
                  )}
                >
                  {day[0]}
                </span>
              ))}
            </div>
            <span className="font-rajdhani text-sm text-[#FFB300] font-bold">{habit.points} XP</span>
          </div>
        </div>

        <div className="shrink-0">
          <Button
            size="sm"
            onClick={() => onComplete(habit.id)}
            disabled={habit.completed || !isForToday}
            className={cn(
              "h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-black/30",
              habit.completed 
                ? "bg-[#00FF7F]/10 text-[#00FF7F] border border-[#00FF7F]/20" 
                : isForToday 
                  ? "bg-[#00FF7F] hover:bg-[#00E070] text-black shadow-[0_0_15px_rgba(0,255,127,0.3)]" 
                  : "bg-white/5 text-white/10 border border-white/5"
            )}
          >
            {habit.completed ? 'Feito' : 'Check'}
          </Button>
        </div>
      </div>
    </div>
  );
};