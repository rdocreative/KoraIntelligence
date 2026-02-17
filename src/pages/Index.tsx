import { useState, useEffect } from 'react';
import { useHabitTracker } from '@/hooks/useHabitTracker';
import { ProgressChart } from '@/components/features/habit-tracker/ProgressChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  BookOpen,
  Calendar,
  CheckCircle2,
  ListTodo,
  Target,
  Zap,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { getDailyVerse, getMonthProgress, getMonthName } from '@/utils/dailyContent';

const Index = () => {
  const { habits, totalPoints, history, streak } = useHabitTracker();
  const [verse, setVerse] = useState('');

  useEffect(() => {
    setVerse(getDailyVerse());
  }, []);

  const monthName = getMonthName();
  const monthProgress = getMonthProgress();

  return (
    <div className="container max-w-4xl mx-auto px-4 pt-12 space-y-10 pb-24">
      
      {/* 1. FRASE BÍBLICA */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-1000">
        <Card className="border-none bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-500/20">
          <CardContent className="py-8 flex flex-col items-center text-center gap-4">
            <BookOpen className="text-white/40" size={24} />
            <blockquote className="text-xl font-bold italic leading-relaxed">
              "{verse}"
            </blockquote>
            <div className="h-1 w-12 bg-white/20 rounded-full" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Palavra do Dia</p>
          </CardContent>
        </Card>
      </section>

      {/* 2. PROGRESSO DO MÊS */}
      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Calendar size={14} />
          Visão Geral Mensal
        </h2>
        
        <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-2xl font-black capitalize">
                {monthName}
              </CardTitle>
              <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-black">
                {monthProgress}% concluído
              </div>
            </div>
            <Progress value={monthProgress} className="h-3 bg-slate-100 dark:bg-slate-800" indicatorClassName="bg-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <CheckCircle2 className="mx-auto mb-2 text-green-500" size={20} />
                <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Hábitos</div>
                <div className="text-xl font-black">{habits.filter(h => h.completed).length}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <ListTodo className="mx-auto mb-2 text-blue-500" size={20} />
                <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Tarefas</div>
                <div className="text-xl font-black">0</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <Target className="mx-auto mb-2 text-purple-500" size={20} />
                <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Metas</div>
                <div className="text-xl font-black">0</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <Zap className="mx-auto mb-2 text-amber-500" size={20} />
                <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Total XP</div>
                <div className="text-xl font-black text-indigo-600">{totalPoints}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 3. EVOLUÇÃO MENSAL EM GRÁFICOS */}
      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <TrendingUp size={14} />
          Evolução de Performance
        </h2>
        <ProgressChart history={history} />
      </section>

      {/* 4. PERGUNTAS FREQUENTES */}
      <section className="space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
            <HelpCircle size={20} className="text-slate-600 dark:text-slate-400" />
          </div>
          <h2 className="text-xl font-black">Perguntas Frequentes</h2>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="item-1" className="border-none bg-white dark:bg-slate-900 rounded-xl px-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <AccordionTrigger className="hover:no-underline font-bold py-4">Como o XP é calculado?</AccordionTrigger>
            <AccordionContent className="text-slate-500 pb-4">
              Cada hábito ou tarefa concluída soma pontos ao seu XP total. Hábitos fixos dão pontos pré-definidos, enquanto tarefas personalizadas podem ter o peso que você escolher.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-none bg-white dark:bg-slate-900 rounded-xl px-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <AccordionTrigger className="hover:no-underline font-bold py-4">O que acontece se eu perder um dia?</AccordionTrigger>
            <AccordionContent className="text-slate-500 pb-4">
              Sua sequência (streak) será resetada para zero, mas seu XP total acumulado permanece intacto. O importante é a consistência a longo prazo!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-none bg-white dark:bg-slate-900 rounded-xl px-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <AccordionTrigger className="hover:no-underline font-bold py-4">Posso exportar meus dados?</AccordionTrigger>
            <AccordionContent className="text-slate-500 pb-4">
              Sim! Na aba de Configurações você encontra a opção de baixar todo seu histórico em formato CSV para usar no Excel ou Google Sheets.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
};

export default Index;