import { useState, useMemo } from "react";
import { useMasterplan, TaskItem } from "@/hooks/useMasterplan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { Eye, Play, Calendar } from "lucide-react";

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
        statusColor = "text-neutral-400";
        statusMessage = "Sua jornada começa agora. Defina o ritmo.";
    } else if (data.annual.progress < yearProgress - 10) {
        yearStatus = "Atenção Necessária";
        statusColor = "text-[#E8251A]";
        statusMessage = "Acelere o ritmo para alcançar a meta.";
    } else if (data.annual.progress > yearProgress + 5) {
        yearStatus = "Excelente";
        statusColor = "text-emerald-500";
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

  // Header Config based on Tab
  const getHeaderConfig = () => {
    switch (activeTab) {
        case "overview":
            return {
                title: "Visão",
                subtitle: "Para onde você está indo",
                icon: Eye,
                hexColor: "#f0b429",
                badge: "Master Plan"
            };
        case "execution":
            return {
                title: "Execução",
                subtitle: "O que está sendo feito agora",
                icon: Play,
                hexColor: "#e8283a",
                badge: "Em curso",
                stats: true
            };
        case "annual":
            return {
                title: "Ano",
                subtitle: "Sua jornada em 2025",
                icon: Calendar,
                hexColor: "#a78bfa",
                badge: "2025"
            };
        default:
            return {
                title: "Master Plan",
                subtitle: "Sistema Tático",
                icon: Eye,
                hexColor: "#ffffff"
            };
    }
  };

  const headerConfig = getHeaderConfig();

  return (
    <div className="min-h-screen text-white pb-32">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neutral-900/20 to-transparent" />
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          
          {/* Dynamic Header */}
          <PageHeader
             title={headerConfig.title}
             subtitle={headerConfig.subtitle}
             icon={headerConfig.icon}
             hexColor={headerConfig.hexColor}
             badge={headerConfig.badge}
          >
             {/* Execução Stats Bar */}
             {headerConfig.stats && (
                 <div className="flex gap-8">
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase text-[#6b6b7a] font-bold tracking-wider">Ativos</span>
                        <div className="text-lg font-rajdhani font-bold text-white">{activeWeeks.length}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase text-[#6b6b7a] font-bold tracking-wider">Feitos</span>
                        <div className="text-lg font-rajdhani font-bold text-white">{analytics.completedTasks}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase text-[#6b6b7a] font-bold tracking-wider">Taxa</span>
                        <div className="text-lg font-rajdhani font-bold text-[#e8283a]">{analytics.executionRate}%</div>
                    </div>
                 </div>
             )}
             
             {/* Year Tabs */}
             {activeTab === 'annual' && (
                 <div className="flex gap-6">
                    {['Trimestre', 'Mês', 'Semana'].map((t, i) => (
                         <span key={t} className={`text-xs font-rajdhani font-bold uppercase tracking-wider pb-1 ${i===1 ? 'text-white border-b-2 border-[#a78bfa]' : 'text-[#6b6b7a]'}`}>
                             {t}
                         </span>
                    ))}
                 </div>
             )}
          </PageHeader>

          {/* Navigation Tabs */}
          <div className="sticky top-4 z-50 flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 bg-[#0A0A0A]/80 backdrop-blur-xl p-1.5 border border-white/10 rounded-2xl h-14 shadow-2xl w-full max-w-sm ring-1 ring-white/5">
              <TabsTrigger value="overview" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-black text-[10px] uppercase tracking-wider transition-all duration-300">Visão</TabsTrigger>
              <TabsTrigger value="execution" className="rounded-xl font-bold data-[state=active]:bg-[#E8251A] data-[state=active]:text-white text-[10px] uppercase tracking-wider transition-all duration-300">Execução</TabsTrigger>
              <TabsTrigger value="annual" className="rounded-xl font-bold data-[state=active]:bg-neutral-800 data-[state=active]:text-white text-[10px] uppercase tracking-wider transition-all duration-300">Ano</TabsTrigger>
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