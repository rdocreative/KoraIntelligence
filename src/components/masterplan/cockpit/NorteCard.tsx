import React from "react";
import { Target } from "lucide-react";

interface NorteCardProps {
  monthName: string;
  progress: number;
  mainGoal?: string;
}

export const NorteCard = ({ monthName, progress, mainGoal }: NorteCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-transparent border border-white/[0.02] p-4 transition-all duration-500">
      
      <div className="relative z-10 flex items-center justify-between gap-6 opacity-70 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Target className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 block mb-0.5">O Norte</span>
            <h2 className="text-lg font-bold text-neutral-300 uppercase tracking-tight">{monthName}</h2>
          </div>
        </div>
        
        <div className="flex-1 max-w-xs hidden sm:block">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-wider truncate max-w-[180px]">
              {mainGoal || "Meta do mês"}
            </span>
            <span className="text-[10px] font-bold text-neutral-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-neutral-500 transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Mobile progress */}
        <div className="sm:hidden text-right">
          <span className="text-sm font-bold text-neutral-400">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};