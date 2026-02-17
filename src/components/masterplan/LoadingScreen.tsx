import { useState, useEffect } from "react";
import { Crown } from "lucide-react";

export const LoadingScreen = ({ onFinished }: { onFinished: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [phrase, setPhrase] = useState("");

  const phrases = [
    "Parabéns. Sua nova fase começa agora.",
    "Você acabou de ativar o melhor método para mudar sua vida.",
    "Preparando seu novo sistema de foco.",
    "Construindo sua melhor versão...",
    "Seu plano está sendo ativado.",
    "Bem-vindo ao controle total."
  ];

  useEffect(() => {
    setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);

    const duration = 1800; 
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const easeOutQuad = (t: number) => t * (2 - t);
      const rawProgress = currentStep / steps;
      const easedProgress = easeOutQuad(rawProgress) * 100;
      
      setProgress(Math.min(easedProgress, 100));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onFinished, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none animate-pulse duration-[3000ms]" />
       
       <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-10">
          <div className="relative group">
             <div className="w-20 h-20 bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl rotate-45 transform transition-transform duration-1000 ease-out scale-100 group-hover:border-red-500/30">
                <Crown className="w-8 h-8 text-red-600 -rotate-45 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
             </div>
             <div className="absolute inset-0 bg-red-600/10 blur-2xl rounded-full -z-10" />
          </div>

          <div className="w-full space-y-8 text-center">
             <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug animate-in slide-in-from-bottom-2 fade-in duration-700 max-w-[280px] mx-auto">
                {phrase}
             </h2>
             
             <div className="space-y-3">
                <div className="h-1.5 w-full bg-neutral-900/50 rounded-full overflow-hidden border border-white/5">
                   <div 
                      className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 transition-all duration-75 ease-out rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)]"
                      style={{ width: `${progress}%` }}
                   />
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-neutral-500 tracking-[0.2em]">
                   <span>Inicializando</span>
                   <span className="text-red-500">{Math.round(progress)}%</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};