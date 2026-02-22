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

const DAY_NAMES = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export const HabitCard = ({ habit, onComplete, index = 0 }: HabitCardProps) => {
  const todayWeekday = new Date().getDay();
  const isForToday = habit.days.includes(todayWeekday);

  // Determine styles based on index/priority (using simple index for variety in this example)
  // Blue, Green, Orange, Purple rotation
  const colorMap = [
    { bg: "bg-[#1cb0f6]/20", border: "border-[#1cb0f6]", text: "text-[#1cb0f6]", checkBg: "bg-[#1cb0f6]", checkShadow: "shadow-3d-blue" },
    { bg: "bg-[#58cc02]/20", border: "border-[#58cc02]", text: "text-[#58cc02]", checkBg: "bg-[#58cc02]", checkShadow: "shadow-3d-green" },
    { bg: "bg-[#ff9600]/20", border: "border-[#ff9600]", text: "text-[#ff9600]", checkBg: "bg-[#ff9600]", checkShadow: "shadow-3d-orange" },
    { bg: "bg-[#ce82ff]/20", border: "border-[#ce82ff]", text: "text-[#ce82ff]", checkBg: "bg-[#ce82ff]", checkShadow: "shadow-3d-purple" },
  ];

  const style = colorMap[index % colorMap.length];

  return (
    <div 
      className={cn(
        "group relative flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all duration-200",
        habit.completed 
          ? "bg-[#202f36] border-[#37464f] opacity-60" 
          : cn(style.bg, style.border, "hover:scale-[1.02] cursor-pointer")
      )}
    >
      <div className="flex items-center gap-4">
        {/* Index / Icon */}
        <div className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 font-bold text-2xl bg-[#131f24]",
          habit.completed ? "border-[#37464f] text-[#9ca3af]" : cn(style.border, style.text)
        )}>
          {habit.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-base font-bold text-[#e5e7eb] truncate mb-1",
            habit.completed && "line-through text-[#9ca3af]"
          )}>
            {habit.title}
          </h3>
          
          <div className="flex gap-1">
             {DAY_NAMES.map((d, i) => (
                <span key={i} className={cn(
                   "text-[10px] font-extrabold uppercase",
                   habit.days.includes(i) ? (habit.completed ? "text-[#9ca3af]" : style.text) : "text-[#37464f]"
                )}>
                   {d}
                </span>
             ))}
          </div>
        </div>

        <div className="shrink-0">
          <Button
            size="sm"
            onClick={(e) => { e.stopPropagation(); onComplete(habit.id); }}
            disabled={!isForToday && !habit.completed}
            className={cn(
              "h-10 w-10 p-0 rounded-xl transition-all border-b-0",
              habit.completed 
                ? "bg-[#202f36] border-2 border-[#37464f] text-[#58cc02] hover:bg-[#202f36]" 
                : cn(style.checkBg, style.checkShadow, "text-white hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none hover:brightness-110")
            )}
          >
            {habit.completed ? <Check strokeWidth={4} size={20} /> : <Check strokeWidth={4} size={20} className="opacity-40" />}
          </Button>
        </div>
      </div>
    </div>
  );
};