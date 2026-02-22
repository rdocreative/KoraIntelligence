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
        statusColor = "text-gray-400";
        statusMessage = "Sua jornada começa agora.";
    } else if (data.annual.progress < yearProgress - 10) {
        yearStatus = "Atenção Necessária";
        statusColor = "text-card-red";
        statusMessage = "Acelere o ritmo.";
    } else if (data.annual.progress > yearProgress + 5) {
        yearStatus = "Excelente";
        statusColor = "text-card-green";
        statusMessage = "Superando expectativas.";
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
    <div className="min-h-screen text-white pb-32">
      <div className="relative z-10 space-y-8 animate-in fade-in duration-500">
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          
          {/* Custom Tabs Navigation */}
          <div className="flex justify-center">
            <TabsList className="bg-duo-panel border-2 border-duo-gray p-1.5 rounded-2xl h-16 shadow-3d-panel w-full max-w-md grid grid-cols-3 gap-2">
              <TabsTrigger 
                value="overview" 
                className="rounded-xl font-extrabold uppercase tracking-widest text-[11px] data-[state=active]:bg-duo-primary data-[state=active]:text-duo-bg data-[state=active]:shadow-sm transition-all h-full"
              >
                Visão
              </TabsTrigger>
              <TabsTrigger 
                value="execution" 
                className="rounded-xl font-extrabold uppercase tracking-widest text-[11px] data-[state=active]:bg-card-orange data-[state=active]:text-white data-[state=active]:shadow-sm transition-all h-full"
              >
                Execução
              </TabsTrigger>
              <TabsTrigger 
                value="annual" 
                className="rounded-xl font-extrabold uppercase tracking-widest text-[11px] data-[state=active]:bg-card-purple data-[state=active]:text-white data-[state=active]:shadow-sm transition-all h-full"
              >
                Ano
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="pt-0">
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

            <TabsContent value="execution">
              <ExecutionTab 
                  currentMonth={currentMonth}
                  currentMonthIndex={currentMonthIndex}
                  addMonthGoal={addMonthGoal}
                  toggleMonthGoal={toggleMonthGoal}
                  updateMonth={updateMonth}
                  weeks={data.weeks}
                  addWeek={addWeek}
                  deleteWeek={deleteWeek}
                  addWeekTask={addWeekTask}
                  toggleWeekTask={toggleWeekTask}
                  updateWeekReview={updateWeekReview}
              />
            </TabsContent>

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