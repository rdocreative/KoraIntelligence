import React from "react";
import { Target } from "lucide-react";

interface NorteCardProps {
  monthName: string;
  progress: number;
  mainGoal?: string;
}

export const NorteCard = ({ monthName, progress, mainGoal }: NorteCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06] p-6 transition-all duration-500 hover:bg-white/[0.05]">
      {/* Efeito de brilho sutil com a cor do mês */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-[var(--color-month)] opacity-5 blur-[60px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-month)]/10 flex items-center justify-center border border-[var(--color-month)]/10">
            <Target className="w-5 h-5 text-[var(--color-month)]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">O Norte</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{monthName}</h2>
          </div>
        </div>
        
        <div className="flex-1 max-w-xs hidden sm:block">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider truncate max-w-[180px]">
              {mainGoal || "Meta do mês"}
            </span>
            <span className="text-xs font-black text-white">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--color-month)] transition-all duration-1000 ease-out shadow-[0_0_10px_var(--color-month)] opacity-80" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Mobile progress */}
        <div className="sm:hidden text-right">
          <span className="text-2xl font-black text-white">{Math.round(progress)}%</span>
          <div className="h-1 w-16 bg-neutral-900 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-[var(--color-month)]" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};