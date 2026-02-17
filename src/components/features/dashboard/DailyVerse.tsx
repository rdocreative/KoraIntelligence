import { Quote } from "lucide-react";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    // Seleção baseada no dia para manter a mesma frase durante 24h
    const today = Math.floor(Date.now() / 86400000);
    const index = today % INSPIRATIONS.length;
    setInspiration(INSPIRATIONS[index]);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-900/30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-[#121212] to-[#0a0a0a] p-8 shadow-2xl min-h-[220px] flex flex-col justify-center">
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