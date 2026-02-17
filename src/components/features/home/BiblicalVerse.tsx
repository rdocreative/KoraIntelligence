import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const VERSES = [
  { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
  { text: "O Senhor é o meu pastor, nada me faltará.", ref: "Salmos 23:1" },
  { text: "Entrega o teu caminho ao Senhor; confia nele, e ele o fará.", ref: "Salmos 37:5" },
  { text: "Esforça-te, e tem bom ânimo; não temas, nem te espantes.", ref: "Josué 1:9" },
  { text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor.", ref: "Jeremias 29:11" },
  { text: "Alegrai-vos sempre no Senhor; outra vez digo, alegrai-vos.", ref: "Filipenses 4:4" },
  { text: "Mas os que esperam no Senhor renovarão as forças.", ref: "Isaías 40:31" }
];

export const BiblicalVerse = () => {
  const [verse, setVerse] = useState(VERSES[0]);

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('daily_verse_date');
    const storedIndex = localStorage.getItem('daily_verse_index');

    if (storedDate === today && storedIndex) {
      setVerse(VERSES[parseInt(storedIndex)]);
    } else {
      const newIndex = Math.floor(Math.random() * VERSES.length);
      localStorage.setItem('daily_verse_date', today);
      localStorage.setItem('daily_verse_index', newIndex.toString());
      setVerse(VERSES[newIndex]);
    }
  }, []);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-none shadow-sm mb-6">
      <CardContent className="p-6 flex gap-4 items-start">
        <Quote className="text-indigo-400 shrink-0 mt-1" size={24} />
        <div>
          <p className="text-lg font-medium text-slate-700 dark:text-slate-200 italic font-serif">
            "{verse.text}"
          </p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 font-bold">
            — {verse.ref}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};