import { useState, useEffect } from "react";
import { Crown } from "lucide-react";

export const LoadingScreen = ({ onFinished }: { onFinished: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 segundos
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      // Ease out quad for smooth deceleration
      const easeOutQuad = (t: number) => t * (2 - t);
      const rawProgress = currentStep / steps;
      const easedProgress = easeOutQuad(rawProgress) * 100;
      
      setProgress(Math.min(easedProgress, 100));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onFinished, 300); // Wait 300ms before finishing
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none animate-pulse duration-[3000ms]" />
       
       <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-12">
          {/* Icon with Pulse Animation */}
          <div className="relative group animate-pulse duration-[2000ms]">
             <div className="w-20 h-20 bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl rotate-45">
                <Crown className="w-8 h-8 text-red-600 -rotate-45 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
             </div>
             <div className="absolute inset-0 bg-red-600/10 blur-2xl rounded-full -z-10" />
          </div>

          <div className="w-full space-y-8 text-center">
             {/* New Text Structure */}
             <div className="flex flex-col items-center gap-1 animate-in slide-in-from-bottom-2 fade-in duration-700">
                <span className="text-sm font-light text-neutral-500 tracking-wide lowercase">
                  preparando seu sistema
                </span>
                <h1 className="text-3xl font-bold text-white tracking-tighter">
                  MasterPlan
                </h1>
             </div>
             
             <div className="space-y-3">
                <div className="h-1.5 w-full bg-neutral-900/50 rounded-full overflow-hidden border border-white/5">
                   <div 
                      className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 transition-all duration-75 ease-out rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)]"
                      style={{ width: `${progress}%` }}
                   />
                </div>
                {/* Text "INICIALIZANDO" without percentage */}
                <div className="flex justify-center items-center text-[10px] uppercase font-bold text-neutral-500 tracking-[0.3em]">
                   <span>Inicializando</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};