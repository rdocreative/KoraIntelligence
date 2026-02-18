import React from "react";
import { Target } from "lucide-react";

interface NorteCardProps {
  monthName: string;
  progress: number;
  mainGoal?: string;
}

export const NorteCard = ({ monthName, progress, mainGoal }: NorteCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06] py-3 px-5 transition-all duration-500 hover:bg-white/[0.05]">
      
      <div className="relative z-10 flex items-center justify-between gap-6">
        {/* Left: Icon & Month */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/10">
            <Target className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500 block leading-none mb-1">O Norte</span>
            <h2 className="text-sm font-black text-white uppercase tracking-tight leading-none">{monthName}</h2>
          </div>
        </div>
        
        {/* Right: Progress Bar (Expanded) */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider truncate max-w-[200px] opacity-70">
              {mainGoal || "Meta do mês"}
            </span>
            <span className="text-[10px] font-black text-white">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(220,38,38,0.4)]" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Mobile progress (Mini) */}
        <div className="sm:hidden flex items-center gap-2">
            <div className="h-1 w-12 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400" 
                style={{ width: `${progress}%` }}
                />
            </div>
            <span className="text-xs font-black text-white">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};