import { Habit } from "@/hooks/useHabitTracker";
import { Check, Trophy, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  index: number;
}

export const HabitCard = ({ habit, onComplete, index }: HabitCardProps) => {
  const isCompleted = habit.last_completed === new Date().toISOString().split('T')[0];

  return (
    <div 
      className={cn(
        "item-glass p-4 group cursor-pointer active:scale-[0.98] transition-all",
        isCompleted && "opacity-60 border-[#FF3232]/30"
      )}
      onClick={() => !isCompleted && onComplete(habit.id)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div 
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
              isCompleted 
                ? "bg-[#FF3232] shadow-[0_0_15px_rgba(255,50,50,0.6)]" 
                : "bg-white/5 border border-white/10 group-hover:border-[#FF3232]/40"
            )}
          >
            {isCompleted ? (
              <Check className="text-white" size={24} strokeWidth={3} />
            ) : (
              <Zap className="text-white/30 group-hover:text-[#FF3232]" size={20} />
            )}
          </div>
          
          <div className="flex flex-col">
            <h4 className={cn(
              "font-bold text-sm transition-colors",
              isCompleted ? "text-white/50 line-through" : "text-white group-hover:text-[#FF3232]"
            )}>
              {habit.title}
            </h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3232]">
                +{habit.difficulty * 10} XP
              </span>
              <div className="flex items-center gap-1 text-[10px] text-white/40 font-bold">
                <Clock size={10} />
                <span>DIÁRIO</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/5">
          <Trophy size={12} className="text-[#FF3232]" />
          <span className="text-[10px] font-black text-white">{habit.streak_atual || 0}</span>
        </div>
      </div>
    </div>
  );
};