import { Quote } from "lucide-react";
import { useEffect, useState } from "react";

const VERSES = [
  { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
  { text: "O Senhor é o meu pastor, nada me faltará.", ref: "Salmos 23:1" },
  { text: "Entrega o teu caminho ao Senhor; confia nele, e ele o fará.", ref: "Salmos 37:5" },
  { text: "Esforçai-vos, e ele fortalecerá o vosso coração, vós todos que esperais no Senhor.", ref: "Salmos 31:24" },
  { text: "Porque eu bem sei os planos que estou projetando para vós, diz o Senhor; planos de paz, e não de mal, para vos dar um futuro e uma esperança.", ref: "Jeremias 29:11" },
  { text: "Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.", ref: "Isaías 40:31" },
  { text: "Sede fortes e corajosos; não temais, nem vos espanteis, porque o Senhor vosso Deus é convosco, por onde quer que andardes.", ref: "Josué 1:9" },
  { text: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.", ref: "João 14:27" },
  { text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", ref: "Mateus 11:28" },
  { text: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.", ref: "1 Coríntios 13:4" }
];

export const DailyVerse = () => {
  const [verse, setVerse] = useState(VERSES[0]);

  useEffect(() => {
    // Calcula o índice baseado no dia atual (muda a cada 24h)
    const today = Math.floor(Date.now() / 86400000);
    const index = today % VERSES.length;
    setVerse(VERSES[index]);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg shadow-blue-900/20">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
      
      <div className="relative flex flex-col items-center text-center space-y-3">
        <Quote className="h-8 w-8 text-blue-200 opacity-50 mb-1" />
        <p className="text-lg md:text-xl font-medium leading-relaxed italic font-serif">
          "{verse.text}"
        </p>
        <div className="h-0.5 w-12 bg-blue-400/50 rounded-full"></div>
        <span className="text-sm font-bold tracking-wider text-blue-100 uppercase">
          {verse.ref}
        </span>
      </div>
    </div>
  );
};