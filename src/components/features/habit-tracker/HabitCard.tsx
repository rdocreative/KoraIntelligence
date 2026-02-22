"use client";

import { Habit } from '@/hooks/useHabitTracker';
import { Button } from '@/components/ui/button';
import { Check, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  index?: number;
}

const DAY_NAMES = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export const HabitCard = ({ habit, onComplete, index = 0 }: HabitCardProps) => {
  const todayWeekday = new Date().getDay();
  const isForToday = habit.days.includes(todayWeekday);

  // Determine color based on some logic or random for now, or props if available
  // Using generic blue for consistency if not specified
  const themeColor = "border-card-blue";
  const themeBg = "bg-card-blue/10";
  const themeText = "text-card-blue";

  return (
    <div 
      className={cn(
        "list-item-card p-4 mb-3 flex items-center gap-4 relative overflow-hidden group",
        habit.completed ? "opacity-60 grayscale-[0.5]" : "opacity-100",
        // Dynamic styling based on category would go here
        "bg-duo-panel border-duo-gray hover:border-card-blue"
      )}
    >
      {/* Icon / Number */}
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold border-2 shrink-0 transition-colors",
        habit.completed 
          ? "bg-card-green border-card-green text-white shadow-none" 
          : "bg-duo-sidebar border-duo-gray text-gray-500 group-hover:border-card-blue group-hover:text-card-blue"
      )}>
        {habit.completed ? <Check strokeWidth={4} /> : (index + 1)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-extrabold text-base text-white truncate",
          habit.completed && "line-through text-gray-500"
        )}>
          {habit.title}
        </h3>
        
        <div className="flex items-center gap-3 mt-1">
          <div className="flex gap-1">
            {DAY_NAMES.map((day, i) => (
              <span 
                key={i} 
                className={cn(
                  "text-[10px] font-bold w-4 text-center",
                  habit.days.includes(i) ? "text-card-blue" : "text-gray-600"
                )}
              >
                {day}
              </span>
            ))}
          </div>
          <span className="flex items-center text-xs font-bold text-card-orange">
             <Flame size={12} className="mr-1 fill-card-orange" /> {habit.points} XP
          </span>
        </div>
      </div>

      {/* Action */}
      <Button
        onClick={() => onComplete(habit.id)}
        disabled={habit.completed || !isForToday}
        className={cn(
          "h-10 px-6 rounded-xl font-extrabold uppercase tracking-wider transition-all",
          habit.completed 
            ? "bg-transparent text-card-green border-2 border-card-green"
            : isForToday 
              ? "btn-primary bg-card-blue shadow-3d-blue text-white" 
              : "bg-duo-gray text-gray-400 cursor-not-allowed shadow-none"
        )}
      >
        {habit.completed ? 'Feito' : 'Check'}
      </Button>
    </div>
  );
};