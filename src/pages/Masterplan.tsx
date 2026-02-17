import { useState, useMemo } from "react";
import { useMasterplan, TaskItem } from "@/hooks/useMasterplan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importando componentes modularizados
import { LoadingScreen } from "@/components/masterplan/LoadingScreen";
import { OnboardingWizard } from "@/components/masterplan/OnboardingWizard";
import { OverviewTab } from "@/components/masterplan/OverviewTab";
import { WeeklyTab } from "@/components/masterplan/WeeklyTab";
import { MonthlyTab } from "@/components/masterplan/MonthlyTab";
import { AnnualTab } from "@/components/masterplan/AnnualTab";

const MasterplanPage = () => {
  const { 
    data, completeTutorial, resetTutorial, updateAnnual, addAreaItem, toggleAreaItem, deleteAreaItem,
    addMonthGoal, toggleMonthGoal, updateMonth,
    addWeek, deleteWeek, addWeekTask, toggleWeekTask, updateWeekReview 
  } = useMasterplan();

  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // CÁLCULOS ANALÍTICOS (DASHBOARD)
  // ==========================================
  const analytics = useMemo(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const yearProgress = (dayOfYear / 365) * 100;

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <Tabs defaultValue="overview" className="w-full space-y-8">
          {/* SELETOR DE ABAS NO TOPO ABSOLUTO DO CONTEÚDO */}
          <div className="sticky top-4 z-50 flex justify-center">
            <TabsList className="grid grid-cols-4 bg-[#0A0A0A]/80 backdrop-blur-xl p-1.5 border border-white/10 rounded-2xl h-14 shadow-2xl w-full max-w-md ring-1 ring-white/5">
              <TabsTrigger value="overview" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-black text-[10px] uppercase tracking-wider transition-all duration-300">Visão</TabsTrigger>
              <TabsTrigger value="weekly" className="rounded-xl font-bold data-[state=active]:bg-red-600 data-[state=active]:text-white text-[10px] uppercase tracking-wider transition-all duration-300">Foco</TabsTrigger>
              <TabsTrigger value="monthly" className="rounded-xl font-bold data-[state=active]:bg-neutral-800 data-[state=active]:text-white text-[10px] uppercase tracking-wider transition-all duration-300">Mês</TabsTrigger>
              <TabsTrigger value="annual" className="rounded-xl font-bold data-[state=active]:bg-neutral-800 data-[state=active]:text-white text-[10px] uppercase tracking-wider transition-all duration-300">Ano</TabsTrigger>
            </TabsList>
          </div>

          <div className="pt-4">
            {/* --- 1. VISÃO GERAL (DASHBOARD) --- */}
            <TabsContent value="overview">
              <OverviewTab 
                  activeWeeks={activeWeeks}
                  currentMonth={currentMonth}
                  areas={data.areas}
                  onNavigateToWeekly={() => document.querySelector('[data-value="weekly"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}
                  annualData={data.annual}
                  onResetTutorial={resetTutorial}
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
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MasterplanPage;