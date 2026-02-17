import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMasterplan } from "@/hooks/useMasterplan";
import { OverviewTab } from "@/components/masterplan/OverviewTab";
import { WeeklyTab } from "@/components/masterplan/WeeklyTab";
import { MonthlyTab } from "@/components/masterplan/MonthlyTab";
import { AnnualTab } from "@/components/masterplan/AnnualTab";
import { LoadingScreen } from "@/components/masterplan/LoadingScreen";
import { OnboardingWizard } from "@/components/masterplan/OnboardingWizard";

const Index = () => {
  const { 
    data, 
    loading, 
    updateAnnual, 
    addAreaItem, 
    toggleAreaItem, 
    deleteAreaItem,
    addWeek,
    deleteWeek,
    addWeekTask,
    toggleWeekTask,
    updateWeekReview,
    addMonthGoal,
    toggleMonthGoal,
    updateMonth,
    resetData,
    analytics 
  } = useMasterplan();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  if (loading || isLoading) {
    return <LoadingScreen onFinished={() => setIsLoading(false)} />;
  }

  if (!data.onboardingCompleted) {
    return <OnboardingWizard onComplete={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-neutral-900/50 border border-white/5 p-1 rounded-full backdrop-blur-md">
              <TabsTrigger value="overview" className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black transition-all">Visão</TabsTrigger>
              <TabsTrigger value="weekly" className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black transition-all">Foco</TabsTrigger>
              <TabsTrigger value="monthly" className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black transition-all">Mês</TabsTrigger>
              <TabsTrigger value="annual" className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black transition-all">Ano</TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-transparent border-none shadow-none p-0">
            <TabsContent value="overview" className="mt-0 outline-none">
              <OverviewTab 
                activeWeeks={data.weeks} 
                currentMonth={data.months[analytics.currentMonthIndex]} 
                areas={data.areas}
                onNavigateToWeekly={() => setActiveTab("weekly")}
                annualData={{
                  objective: data.annual.objective,
                  successCriteria: data.annual.successCriteria,
                  progress: data.annual.progress
                }}
                onResetTutorial={resetData}
              />
            </TabsContent>

            <TabsContent value="weekly" className="mt-0 outline-none">
              <WeeklyTab 
                weeks={data.weeks}
                addWeek={addWeek}
                deleteWeek={deleteWeek}
                addWeekTask={addWeekTask}
                toggleWeekTask={toggleWeekTask}
                updateWeekReview={updateWeekReview}
              />
            </TabsContent>

            <TabsContent value="monthly" className="mt-0 outline-none">
              <MonthlyTab 
                months={data.months}
                currentMonthIndex={analytics.currentMonthIndex}
                addMonthGoal={addMonthGoal}
                toggleMonthGoal={toggleMonthGoal}
                updateMonth={updateMonth}
              />
            </TabsContent>

            <TabsContent value="annual" className="mt-0 outline-none">
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
      </main>
    </div>
  );
};

export default Index;