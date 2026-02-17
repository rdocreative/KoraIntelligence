import { useHabitTracker } from '@/hooks/useHabitTracker';
import { BiblicalVerse } from '@/components/features/home/BiblicalVerse';
import { MonthlySummary } from '@/components/features/home/MonthlySummary';
import { FAQSection } from '@/components/features/home/FAQSection';
import { ProgressChart } from '@/components/features/habit-tracker/ProgressChart';

const Home = () => {
  const { totalPoints, history, habits } = useHabitTracker();

  // Calcular hábitos completados hoje (apenas para estatística visual do card, se necessário) ou total histórico
  // Aqui passaremos o total de hábitos cadastrados para o card
  const habitsCount = habits.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 pt-8 px-4 transition-colors duration-300">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* 1. Frase Bíblica */}
        <BiblicalVerse />

        {/* 2. Progresso do Mês e Grid de Stats */}
        <MonthlySummary totalXP={totalPoints} habitsCount={habitsCount} />

        {/* 3. Evolução Mensal (Gráficos) */}
        <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 px-1">Evolução Mensal</h3>
            <ProgressChart history={history} />
        </div>

        {/* 4. FAQ */}
        <FAQSection />

      </div>
    </div>
  );
};

export default Home;