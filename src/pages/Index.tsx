import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useHabitTracker } from "@/hooks/useHabitTracker";
import { useSettings } from "@/hooks/useSettings";
import { DailyVerse } from "@/components/features/dashboard/DailyVerse";
import { Gamification } from "@/components/features/habit-tracker/Gamification";
import { HabitCard } from "@/components/features/habit-tracker/HabitCard";
import { MonthlyProgress } from "@/components/features/dashboard/MonthlyProgress";
import { MonthlyChart } from "@/components/features/dashboard/MonthlyChart";
import { FAQSection } from "@/components/features/dashboard/FAQSection";
import { HabitMonthView } from "@/components/features/habit-tracker/HabitMonthView";
import { Flame, CalendarDays, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { habits, completeHabit, totalPoints, streak, getCurrentBadge, getNextBadge, history } = useHabitTracker();
  const { settings } = useSettings();

  const today = new Date();
  const currentBadge = getCurrentBadge();
  const nextBadge = getNextBadge();

  // Filtra e ordena os hábitos: não completados primeiro
  const sortedHabits = [...habits].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {settings.showDailyVerse && <DailyVerse />}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-white glow-text uppercase italic tracking-tighter">
            Olá, {settings.userName.split(" ")[0]}
          </h1>
          <p className="text-neutral-500 font-medium flex items-center gap-2 text-sm">
            <CalendarDays className="w-4 h-4 text-red-500" />
            {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-[#121212] px-4 py-2 rounded-2xl border border-white/5 shadow-lg">
          <div className="p-2 bg-red-500/10 rounded-full">
            <Flame className={`w-5 h-5 ${streak > 0 ? 'text-red-500 fill-red-500 animate-pulse' : 'text-neutral-600'}`} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white leading-none">{streak}</span>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Dias Seguidos</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Habits (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                   <LayoutDashboard className="w-5 h-5 text-red-500" />
                   Hábitos de Hoje
                </h2>
                <span className="text-xs font-medium text-neutral-500 bg-[#121212] px-3 py-1 rounded-full border border-white/5">
                   {habits.filter(h => h.completed).length} / {habits.length} Concluídos
                </span>
             </div>
             
             {habits.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-[#0a0a0a]/50">
                   <p className="text-neutral-500 mb-4">Você ainda não tem hábitos configurados.</p>
                   <Link to="/configuracoes">
                      <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                         Configurar Hábitos
                      </Button>
                   </Link>
                </div>
             ) : (
                <div className="grid gap-3">
                   {sortedHabits.map((habit, index) => (
                      <HabitCard 
                         key={habit.id} 
                         habit={habit} 
                         onComplete={completeHabit}
                         index={index}
                      />
                   ))}
                </div>
             )}
          </div>
          
          <HabitMonthView />
        </div>

        {/* Right Column: Gamification & Stats (1/3) */}
        <div className="space-y-6">
           {/* Level Card */}
           <div className="h-[300px]">
              <Gamification 
                 currentBadge={currentBadge} 
                 nextBadge={nextBadge} 
                 totalPoints={totalPoints}
                 streak={streak}
              />
           </div>

           {/* Monthly Progress */}
           <MonthlyProgress 
              totalPoints={totalPoints} 
              habitsCount={history.reduce((acc, curr) => acc + curr.completedHabitIds.length, 0)} 
           />

           {/* XP Chart */}
           <MonthlyChart history={history} />
        </div>
      </div>

      <FAQSection />
    </div>
  );
};

export default Index;