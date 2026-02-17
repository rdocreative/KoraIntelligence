import { Quote, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/useSettings";

const INSPIRATIONS = [
  { text: "Tudo posso naquele que me fortalece.", author: "Filipenses 4:13" },
  { text: "A imaginação é mais importante que o conhecimento.", author: "Albert Einstein" },
  { text: "Não pare quando estiver cansado. Pare quando terminar.", author: "David Goggins" },
  { text: "A felicidade da sua vida depende da qualidade dos seus pensamentos.", author: "Marco Aurélio" },
  { text: "O Senhor é o meu pastor, nada me faltará.", author: "Salmos 23:1" },
  { text: "A única maneira de fazer um excelente trabalho é amar o que você faz.", author: "Steve Jobs" },
];

const INDICES_KEY = "daily_verse_seen_indices";
const DATE_KEY = "daily_verse_last_date";
const DISPLAY_DURATION = 15;

export const DailyVerse = () => {
  const { settings } = useSettings();
  const [inspiration, setInspiration] = useState(INSPIRATIONS[0]);
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DISPLAY_DURATION);

  useEffect(() => {
    if (!settings.showDailyVerse) {
        setIsVisible(false);
        return;
    }

    // Verificar se já foi exibido hoje
    const today = new Date().toLocaleDateString('pt-BR'); // Formato DD/MM/YYYY
    const lastDate = localStorage.getItem(DATE_KEY);

    if (lastDate === today) {
      setIsVisible(false);
      return;
    }

    // Lógica de seleção da frase
    const savedSeen = localStorage.getItem(INDICES_KEY);
    let seenIndices: number[] = savedSeen ? JSON.parse(savedSeen) : [];
    let availableIndices = INSPIRATIONS.map((_, i) => i).filter((i) => !seenIndices.includes(i));

    if (availableIndices.length === 0) {
      seenIndices = [];
      availableIndices = INSPIRATIONS.map((_, i) => i);
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setInspiration(INSPIRATIONS[randomIndex]);
    
    // Salvar estado: frase vista e data de hoje
    localStorage.setItem(INDICES_KEY, JSON.stringify([...seenIndices, randomIndex]));
    localStorage.setItem(DATE_KEY, today);
    
    setIsVisible(true);

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
  }, [settings.showDailyVerse]);

  if (!isVisible || !settings.showDailyVerse) return null;

  return (
    <div className="fixed top-[10%] left-1/2 -translate-x-1/2 z-[999] w-full max-w-lg px-4 pointer-events-none">
      <div className={cn(
        "relative overflow-hidden rounded-2xl border border-red-900/40 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(220,38,38,0.2)] p-5 animate-in slide-in-from-top-8 fade-in duration-700 ease-out pointer-events-auto",
        !settings.glowEffects && "shadow-none border-white/10"
      )}>
        <button 
          type="button"
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 z-50 p-2 text-neutral-500 hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center space-y-3">
          <Quote className="w-5 h-5 text-red-600/30 mb-1" />
          <p className="text-sm md:text-base font-light leading-relaxed text-neutral-100 font-serif italic tracking-wide px-4">
            "{inspiration.text}"
          </p>
          <span className="text-[8px] font-black tracking-[0.2em] text-red-500/60 uppercase whitespace-nowrap">
            {inspiration.author}
          </span>
        </div>

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