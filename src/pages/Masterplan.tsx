import { useState, useMemo } from "react";
import { useMasterplan, TaskItem } from "@/hooks/useMasterplan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importando componentes modularizados
import { LoadingScreen } from "@/components/masterplan/LoadingScreen";
import { OnboardingWizard } from "@/components/masterplan/OnboardingWizard";
import { OverviewTab } from "@/components/masterplan/OverviewTab";
import { AnnualTab } from "@/components/masterplan/AnnualTab";
import { ExecutionTab } from "@/components/masterplan/ExecutionTab";

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

    // Helper para estatísticas das áreas
    const calculateAreaStats = (items: TaskItem[]) => {
        const total = items.length;
        const completed = items.filter(i => i.completed).length;
        const percentage = total === 0 ? 0 : (completed / total) * 100;
        return { total, completed, percentage };
    };

    const areaStats = [
        { id: 'work', label: 'Trabalho', ...calculateAreaStats(data.areas.work) },
        { id: 'studies', label: 'Estudos', ...calculateAreaStats(data.areas.studies) },
        { id: 'health', label: 'Saúde', ...calculateAreaStats(data.areas.health) },
        { id: 'personal', label: 'Pessoal', ...calculateAreaStats(data.areas.personal) },
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

    // LÓGICA DE STATUS CONDICIONAL
    let yearStatus = "Em Execução";
    let statusColor = "text-white";
    let statusMessage = "Mantenha o foco.";

    if (data.annual.progress === 0) {
        // Cenário 1: Usuário novo ou no ponto de partida
        yearStatus = "Ponto de Partida";
        statusColor = "text-neutral-400"; // Neutro
        statusMessage = "Sua jornada começa agora. Defina o ritmo.";
    } else if (data.annual.progress < yearProgress - 10) {
        // Cenário 2: Atrasado
        yearStatus = "Atenção Necessária";
        statusColor = "text-[#E8251A]"; // Vermelho
        statusMessage = "Acelere o ritmo para alcançar a meta.";
    } else if (data.annual.progress > yearProgress + 5) {
        // Cenário 3: Adiantado
        yearStatus = "Excelente";
        statusColor = "text-emerald-500"; // Verde
        statusMessage = "Você está superando as expectativas.";
    }

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
    <div className="min-h-screen text-white selection:bg-red-900/30 selection:text-white pb-32">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neutral-900/20 to-transparent" />
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <Tabs defaultValue="overview" className="w-full space-y-8">
          {/* SELETOR DE ABAS NO TOPO ABSOLUTO DO CONTEÚDO */}
          <div className="sticky top-4 z-50 flex justify-center">
            <TabsList className="grid grid-cols-3 bg-[#0A0A0A]/80 backdrop-blur-xl p-1.5 border border-white/10 rounded-2xl h-14 shadow-2xl w-full max-w-sm ring-1 ring-white/5">
              <TabsTrigger value="overview" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-black text-[10px] uppercase tracking-wider transition-all duration-300">Visão</TabsTrigger>
              <TabsTrigger value="execution" className="rounded-xl font-bold data-[state=active]:bg-[#E8251A] data-[state=active]:text-white text-[10px] uppercase tracking-wider transition-all duration-300">Execução</TabsTrigger>
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
                  onNavigateToWeekly={() => document.querySelector('[data-value="execution"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}
                  annualData={data.annual}
                  onResetTutorial={resetTutorial}
                  analytics={analytics}
              />
            </TabsContent>

            {/* --- 2. EXECUÇÃO (MÊS + SEMANA) --- */}
            <TabsContent value="execution">
              <ExecutionTab 
                  // Monthly Props
                  currentMonth={currentMonth}
                  currentMonthIndex={currentMonthIndex}
                  addMonthGoal={addMonthGoal}
                  toggleMonthGoal={toggleMonthGoal}
                  updateMonth={updateMonth}
                  // Weekly Props
                  weeks={data.weeks}
                  addWeek={addWeek}
                  deleteWeek={deleteWeek}
                  addWeekTask={addWeekTask}
                  toggleWeekTask={toggleWeekTask}
                  updateWeekReview={updateWeekReview}
              />
            </TabsContent>

            {/* --- 3. ANNUAL (DASHBOARD ANALÍTICO) --- */}
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