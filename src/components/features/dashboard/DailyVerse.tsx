import { Quote, Minimize2, Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const INSPIRATIONS = [
  { text: "Tudo posso naquele que me fortalece.", author: "Filipenses 4:13" },
  { text: "A imaginação é mais importante que o conhecimento. O conhecimento é limitado, a imaginação abraça o mundo.", author: "Albert Einstein" },
  { text: "Não pare quando estiver cansado. Pare quando terminar.", author: "David Goggins" },
  { text: "A felicidade da sua vida depende da qualidade dos seus pensamentos.", author: "Marco Aurélio" },
  { text: "O Senhor é o meu pastor, nada me faltará.", author: "Salmos 23:1" },
  { text: "A única maneira de fazer um excelente trabalho é amar o que você faz.", author: "Steve Jobs" },
  { text: "Sorte é o que acontece quando a preparação encontra a oportunidade.", author: "Sêneca" },
  { text: "Seja a mudança que você deseja ver no mundo.", author: "Mahatma Gandhi" },
  { text: "O sucesso não é final, o fracasso não é fatal: é a coragem de continuar que conta.", author: "Winston Churchill" },
  { text: "Não importa o quão devagar você vá, desde que você não pare.", author: "Confúcio" },
];

export const DailyVerse = () => {
  const [inspiration, setInspiration] = useState(INSPIRATIONS[0]);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Sorteia uma frase aleatória toda vez que o componente monta (F5/Reset)
    const randomIndex = Math.floor(Math.random() * INSPIRATIONS.length);
    setInspiration(INSPIRATIONS[randomIndex]);
  }, []);

  if (isMinimized) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="group flex items-center gap-3 bg-[#121212] border border-red-900/30 p-4 rounded-2xl hover:border-red-500/50 transition-all duration-300 shadow-xl"
      >
        <div className="bg-red-500/10 p-2 rounded-lg group-hover:bg-red-500/20 transition-colors">
            <Maximize2 className="h-4 w-4 text-red-500" />
        </div>
        <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Ver Inspiração</span>
      </button>
    );
  }

  return (
    <div className={cn(
        "relative overflow-hidden rounded-2xl border border-red-900/30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-[#121212] to-[#0a0a0a] p-8 shadow-2xl min-h-[220px] flex flex-col justify-center transition-all duration-500 animate-in fade-in zoom-in-95"
    )}>
      {/* Botão Minimizar */}
      <button 
        onClick={() => setIsMinimized(true)}
        className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all z-20"
      >
        <Minimize2 size={18} />
      </button>

      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/20 rounded-full blur-[60px]"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-900/10 rounded-full blur-[50px]"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
        <div className="relative">
          <Quote className="absolute -top-6 -left-8 h-10 w-10 text-red-500/10 rotate-180" />
          <p className="text-xl md:text-2xl font-light leading-relaxed text-neutral-100 font-serif italic tracking-wide max-w-2xl">
            "{inspiration.text}"
          </p>
        </div>

        <div className="flex items-center gap-4 w-full max-w-xs">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-red-500/30"></div>
          <span className="text-xs font-bold tracking-[0.15em] text-red-400 uppercase whitespace-nowrap">
            {inspiration.author}
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-red-500/30"></div>
        </div>
      </div>
    </div>
  );
};