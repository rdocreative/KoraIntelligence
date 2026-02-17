import { useState, useMemo } from "react";
import { useMasterplan, TaskItem } from "@/hooks/useMasterplan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Importando componentes modularizados
import { LoadingScreen } from "@/components/masterplan/LoadingScreen";
import { OnboardingWizard } from "@/components/masterplan/OnboardingWizard";
import { OverviewTab } from "@/components/masterplan/OverviewTab";
import { WeeklyTab } from "@/components/masterplan/WeeklyTab";
import { MonthlyTab } from "@/components/masterplan/MonthlyTab";
import { AnnualTab } from "@/components/masterplan/AnnualTab";

// ==========================================
// DASHBOARD PRINCIPAL
// ==========================================

const MasterplanPage = () => {
  const { 
    data, completeTutorial, resetTutorial, updateAnnual, addAreaItem, toggleAreaItem, deleteAreaItem,
    addMonthGoal, toggleMonthGoal, updateMonthReview, updateMonth,
    addWeek, deleteWeek, addWeekTask, toggleWeekTask, updateWeekReview 
  } = useMasterplan();

  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // CÁLCULOS ANALÍTICOS (DASHBOARD)
  // ==========================================
  const analytics = useMemo(() => {
    // Dias e Progresso Temporal
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const yearProgress = (dayOfYear / 365) * 100;

    // Status do Ano
    let yearStatus = "No Ritmo";
    let statusColor = "text-yellow-500";
    let statusMessage = "Continue consistente.";
    
    if (data.annual.progress < yearProgress - 10) {
        yearStatus = "Atenção Necessária";
        statusColor = "text-red-500";
        statusMessage = "Acelere o ritmo para alcançar a meta.";
    } else if (data.annual.progress > yearProgress + 5) {
        yearStatus = "Excelente";
        statusColor = "text-green-500";
        statusMessage = "Você está superando as expectativas.";
    }

    // Performance das Áreas
    const calculateAreaStats = (items: TaskItem[]) => {
        const total = items.length;
        const completed = items.filter(i => i.completed).length;
        const percentage = total === 0 ? 0 : (completed / total) * 100;
        return { total, completed, percentage };
    };

    const areaStats = [
        { id: 'work', label: 'Trabalho', ...calculateAreaStats(data.areas.work), color: 'text-blue-500', barColor: 'bg-blue-500' },
        { id: 'studies', label: 'Estudos', ...calculateAreaStats(data.areas.studies), color: 'text-purple-500', barColor: 'bg-purple-500' },
        { id: 'health', label: 'Saúde', ...calculateAreaStats(data.areas.health), color: 'text-red-500', barColor: 'bg-red-500' },
        { id: 'personal', label: 'Pessoal', ...calculateAreaStats(data.areas.personal), color: 'text-yellow-500', barColor: 'bg-yellow-500' },
    ];

    const strongestArea = [...areaStats].sort((a, b) => b.percentage - a.percentage)[0];
    const weakestArea = [...areaStats].sort((a, b) => a.percentage - b.percentage)[0];

    // KPIs Gerais
    const totalTasks = areaStats.reduce((acc, curr) => acc + curr.total, 0) + 
                       data.weeks.reduce((acc, w) => acc + w.tasks.length, 0) +
                       data.months.reduce((acc, m) => acc + m.goals.length, 0);
                       
    const completedTasks = areaStats.reduce((acc, curr) => acc + curr.completed, 0) + 
                           data.weeks.reduce((acc, w) => acc + w.tasks.filter(t => t.completed).length, 0) +
                           data.months.reduce((acc, m) => acc + m.goals.filter(g => g.completed).length, 0);

    const executionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return {
        yearProgress,
        yearStatus,
        statusColor,
        statusMessage,
        areaStats,
        strongestArea,
        weakestArea,
        totalTasks,
        completedTasks,
        executionRate
    };
  }, [data]);


  if (isLoading) {
    return <LoadingScreen onFinished={() => setIsLoading(false)} />;
  }

  if (!data.isTutorialCompleted) {
    return <OnboardingWizard onComplete={completeTutorial} />;
  }

  const currentMonthIndex = new Date().getMonth();
  const currentMonth = data.months[currentMonthIndex];
  const activeWeeks = data.weeks.filter(w => new Date(w.endDate) >= new Date());

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-red-900/30 selection:text-white pb-32">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neutral-900/20 to-transparent" />
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* HEADER PREMIUM */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 animate-in slide-in-from-top-4 duration-700">
           <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                  <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                      Masterplan 2.0
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetTutorial} className="h-6 text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest hover:bg-white/5 rounded-full">
                      Revisar Setup
                  </Button>
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 uppercase italic tracking-tighter leading-[0.9]">
                  {data.annual.objective || "Objetivo Não Definido"}
                </h1>
                <p className="mt-2 text-neutral-400 font-medium text-lg max-w-lg">
                    {data.annual.successCriteria || "Defina seu critério de sucesso na aba Anual."}
                </p>
              </div>
           </div>
           
           <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
              <div className="flex justify-between w-full lg:w-72 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                  <span>Conclusão Anual</span>
                  <span className="text-white text-shadow-sm">{data.annual.progress}%</span>
              </div>
              <div className="w-full lg:w-72 h-3 bg-neutral-900 rounded-full border border-white/5 relative overflow-hidden shadow-inner">
                 <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-1000 ease-out"
                    style={{ width: `${data.annual.progress}%` }}
                 />
              </div>
           </div>
        </header>

        <Tabs defaultValue="overview" className="w-full space-y-8">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 bg-[#0A0A0A] p-1.5 border border-white/10 rounded-2xl h-14 shadow-2xl">
            <TabsTrigger value="overview" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-black text-[10px] uppercase tracking-wider transition-all duration-300">Visão</TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-xl font-bold data-[state=active]:bg-red-600 data-[state=active]:text-white text-[10px] uppercase tracking-wider transition-all duration-300">Foco</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-xl font-bold data-[state=active]:bg-neutral-800 data-[state=active]:text-white text-[10px] uppercase tracking-wider transition-all duration-300">Mês</TabsTrigger>
            <TabsTrigger value="annual" className="rounded-xl font-bold data-[state=active]:bg-neutral-800 data-[state=active]:text-white text-[10px] uppercase tracking-wider transition-all duration-300">Ano</TabsTrigger>
          </TabsList>

          {/* --- 1. VISÃO GERAL (DASHBOARD) --- */}
          <TabsContent value="overview">
             <OverviewTab 
                activeWeeks={activeWeeks}
                currentMonth={currentMonth}
                areas={data.areas}
                onNavigateToWeekly={() => document.querySelector('[data-value="weekly"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}
             />
          </TabsContent>

          {/* --- 2. WEEKLY (EXECUÇÃO) --- */}
          <TabsContent value="weekly">
             <WeeklyTab 
                weeks={data.weeks}
                addWeek={addWeek}
                deleteWeek={deleteWeek}
                addWeekTask={addWeekTask}
                toggleWeekTask={toggleWeekTask}
                updateWeekReview={updateWeekReview}
             />
          </TabsContent>

          {/* --- 3. MONTHLY (PLANEJAMENTO) --- */}
          <TabsContent value="monthly">
             <MonthlyTab 
                months={data.months}
                currentMonthIndex={currentMonthIndex}
                addMonthGoal={addMonthGoal}
                toggleMonthGoal={toggleMonthGoal}
                updateMonth={updateMonth}
             />
          </TabsContent>

          {/* --- 4. ANNUAL (DASHBOARD ANALÍTICO) --- */}
          <TabsContent value="annual">
              <AnnualTab 
                data={data}
                analytics={analytics}
                updateAnnual={updateAnnual}
                addAreaItem={addAreaItem}
                toggleAreaItem={toggleAreaItem}
                deleteAreaItem={deleteAreaItem}
              />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MasterplanPage;