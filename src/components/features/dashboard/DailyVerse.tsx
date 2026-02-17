import { Quote, ChevronUp, ChevronDown } from "lucide-react";
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

export const DailyVerse = () => {
  const [inspiration, setInspiration] = useState(INSPIRATIONS[0]);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Carrega os índices já vistos do localStorage
    const savedSeen = localStorage.getItem(STORAGE_KEY);
    let seenIndices: number[] = savedSeen ? JSON.parse(savedSeen) : [];

    // Identifica quais índices ainda não foram usados
    let availableIndices = INSPIRATIONS.map((_, i) => i).filter(
      (i) => !seenIndices.includes(i)
    );

    // Se todos foram vistos, reseta a lista para começar de novo
    if (availableIndices.length === 0) {
      seenIndices = [];
      availableIndices = INSPIRATIONS.map((_, i) => i);
    }

    // Sorteia um índice entre os disponíveis
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    
    // Atualiza o estado e salva o novo índice no histórico
    setInspiration(INSPIRATIONS[randomIndex]);
    const updatedSeen = [...seenIndices, randomIndex];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSeen));
  }, []);

  return (
    <div className="w-full transition-all duration-500 ease-in-out">
      {isMinimized ? (
        <div className="flex justify-center w-full animate-in fade-in slide-in-from-top-2 duration-300">
          <button 
            onClick={() => setIsMinimized(false)}
            className="group flex items-center gap-2 bg-[#121212]/40 backdrop-blur-sm border border-red-900/20 px-4 py-1.5 rounded-b-xl hover:bg-red-900/10 hover:border-red-500/30 transition-all duration-300 shadow-sm"
          >
            <ChevronDown className="h-3 w-3 text-red-500/70 group-hover:text-red-500 group-hover:translate-y-0.5 transition-all" />
            <span className="text-[9px] font-bold tracking-[0.2em] text-neutral-500 uppercase">Abrir Frase</span>
          </button>
        </div>
      ) : (
        <div className={cn(
            "relative overflow-hidden rounded-2xl border border-red-900/30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-[#121212] to-[#0a0a0a] p-8 shadow-2xl min-h-[180px] flex flex-col justify-center transition-all duration-500 animate-in fade-in slide-in-from-top-4"
        )}>
          <button 
            onClick={() => setIsMinimized(true)}
            className="absolute top-3 right-3 p-1.5 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all z-20 group"
            title="Recolher"
          >
            <ChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-[60px]"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-5">
            <div className="relative">
              <Quote className="absolute -top-6 -left-8 h-8 w-8 text-red-500/5 rotate-180" />
              <p className="text-lg md:text-xl font-light leading-relaxed text-neutral-200 font-serif italic tracking-wide max-w-xl">
                "{inspiration.text}"
              </p>
            </div>

            <div className="flex items-center gap-3 w-full max-w-[200px]">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-red-500/20"></div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-red-500/60 uppercase whitespace-nowrap">
                {inspiration.author}
              </span>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-red-500/20"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};