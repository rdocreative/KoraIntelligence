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
  const [activeTab, setActiveTab] = useState("overview");

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

    let yearStatus = "Em Execução";
    let statusColor = "text-white";
    let statusMessage = "Mantenha o foco.";

    if (data.annual.progress === 0) {
        yearStatus = "Ponto de Partida";
        statusColor = "text-[#9ca3af]";
        statusMessage = "Sua jornada começa agora. Defina o ritmo.";
    } else if (data.annual.progress < yearProgress - 10) {
        yearStatus = "Atenção Necessária";
        statusColor = "text-[#ff4b4b]";
        statusMessage = "Acelere o ritmo para alcançar a meta.";
    } else if (data.annual.progress > yearProgress + 5) {
        yearStatus = "Excelente";
        statusColor = "text-[#58cc02]";
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
    <div className="min-h-screen text-[#e5e7eb] pb-32">
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          
          {/* Navigation Tabs */}
          <div className="sticky top-4 z-30 flex justify-center mb-4">
            <TabsList className="bg-[#202f36] border-2 border-[#37464f] p-1.5 rounded-2xl h-16 shadow-3d-panel w-full max-w-sm">
              <TabsTrigger 
                value="overview" 
                className="rounded-xl h-full font-extrabold text-[#9ca3af] uppercase tracking-wider data-[state=active]:bg-[#1cb0f6] data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-200"
              >
                Visão
              </TabsTrigger>
              <TabsTrigger 
                value="execution" 
                className="rounded-xl h-full font-extrabold text-[#9ca3af] uppercase tracking-wider data-[state=active]:bg-[#ff9600] data-[state=active]:text-[#3f2400] data-[state=active]:shadow-none transition-all duration-200"
              >
                Execução
              </TabsTrigger>
              <TabsTrigger 
                value="annual" 
                className="rounded-xl h-full font-extrabold text-[#9ca3af] uppercase tracking-wider data-[state=active]:bg-[#ce82ff] data-[state=active]:text-[#491666] data-[state=active]:shadow-none transition-all duration-200"
              >
                Ano
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="pt-0">
            {/* --- 1. VISÃO GERAL (DASHBOARD) --- */}
            <TabsContent value="overview">
              <OverviewTab 
                  activeWeeks={activeWeeks}
                  currentMonth={currentMonth}
                  areas={data.areas}
                  onNavigateToWeekly={() => setActiveTab('execution')}
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