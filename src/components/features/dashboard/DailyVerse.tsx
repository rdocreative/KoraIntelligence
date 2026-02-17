import { Quote, X } from "lucide-react";
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

const STORAGE_KEY = "daily_verse_seen_indices";
const DISPLAY_DURATION = 60; // segundos

export const DailyVerse = () => {
  const [inspiration, setInspiration] = useState(INSPIRATIONS[0]);
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(DISPLAY_DURATION);

  useEffect(() => {
    const savedSeen = localStorage.getItem(STORAGE_KEY);
    let seenIndices: number[] = savedSeen ? JSON.parse(savedSeen) : [];
    let availableIndices = INSPIRATIONS.map((_, i) => i).filter((i) => !seenIndices.includes(i));

    if (availableIndices.length === 0) {
      seenIndices = [];
      availableIndices = INSPIRATIONS.map((_, i) => i);
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setInspiration(INSPIRATIONS[randomIndex]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...seenIndices, randomIndex]));

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    /* Posicionamento: top-[10%] para ficar a 10% do topo da viewport */
    <div className="fixed top-[10%] left-1/2 -translate-x-1/2 z-[40] w-full max-w-lg px-4 animate-in slide-in-from-top-8 fade-in duration-700 ease-out">
      <div className={cn(
        "relative overflow-hidden rounded-2xl border border-red-900/40 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(220,38,38,0.2)] p-5"
      )}>
        {/* Botão Fechar */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 p-1.5 text-neutral-500 hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10"
        >
          <X size={14} />
        </button>

        {/* Conteúdo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <Quote className="absolute -top-3 -left-5 h-5 w-5 text-red-500/10 rotate-180" />
            <p className="text-sm md:text-base font-light leading-relaxed text-neutral-100 font-serif italic tracking-wide">
              "{inspiration.text}"
            </p>
          </div>

          <div className="flex items-center gap-3 w-full max-w-[140px]">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-red-500/20"></div>
            <span className="text-[8px] font-black tracking-[0.2em] text-red-500/60 uppercase whitespace-nowrap">
              {inspiration.author}
            </span>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-red-500/20"></div>
          </div>
        </div>

        {/* Barra de Tempo (Timer Minimalista) */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-red-900/20 w-full">
          <div 
            className="h-full bg-red-600 transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(220,38,38,0.8)]"
            style={{ width: `${(timeLeft / DISPLAY_DURATION) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};