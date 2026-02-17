import { Quote } from "lucide-react";
import { useEffect, useState } from "react";

const VERSES = [
  { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
  { text: "O Senhor é o meu pastor, nada me faltará.", ref: "Salmos 23:1" },
  { text: "Entrega o teu caminho ao Senhor; confia nele, e ele o fará.", ref: "Salmos 37:5" },
  { text: "Esforçai-vos, e ele fortalecerá o vosso coração, vós todos que esperais no Senhor.", ref: "Salmos 31:24" },
  { text: "Porque eu bem sei os planos que estou projetando para vós, diz o Senhor; planos de paz, e não de mal, para vos dar um futuro e uma esperança.", ref: "Jeremias 29:11" }
];

export const DailyVerse = () => {
  const [verse, setVerse] = useState(VERSES[0]);

  useEffect(() => {
    const today = Math.floor(Date.now() / 86400000);
    const index = today % VERSES.length;
    setVerse(VERSES[index]);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-900/30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-[#121212] to-[#0a0a0a] p-8 shadow-2xl">
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/20 rounded-full blur-[60px]"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div className="bg-red-500/10 p-3 rounded-full mb-2">
            <Quote className="h-6 w-6 text-red-500" />
        </div>
        <p className="text-xl md:text-2xl font-light leading-relaxed text-neutral-200 font-serif italic tracking-wide">
          "{verse.text}"
        </p>
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
        <span className="text-xs font-bold tracking-[0.2em] text-red-400 uppercase">
          {verse.ref}
        </span>
      </div>
    </div>
  );
};