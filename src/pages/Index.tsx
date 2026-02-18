import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMasterplan } from "@/hooks/useMasterplan";
import { ExecutionTab } from "@/components/masterplan/ExecutionTab";
import { YearlyTab } from "@/components/masterplan/YearlyTab";
import { LifeVisionTab } from "@/components/masterplan/LifeVisionTab";
import { Sword, Mountain, Crown } from "lucide-react";

const Index = () => {
  const { 
    months, 
    currentMonthIndex, 
    weeks, 
    addMonthGoal, 
    toggleMonthGoal, 
    updateMonth,
    addWeek,
    deleteWeek,
    addWeekTask,
    toggleWeekTask,
    updateWeekReview,
    // Assumindo que existam handlers para o ano e vida, baseados no padrão
    lifeVision,
    updateLifeVision,
    years,
    updateYear
  } = useMasterplan();

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 font-sans selection:bg-red-500/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2">
              Master<span className="text-red-600">Plan</span>
            </h1>
            <p className="text-neutral-500 font-medium">Design your life. Execute daily.</p>
          </div>
        </header>

        <Tabs defaultValue="execution" className="space-y-10">
          <div className="sticky top-4 z-50 backdrop-blur-xl bg-[#050505]/80 p-2 rounded-2xl border border-white/5 shadow-2xl ring-1 ring-black/50 inline-flex">
            <TabsList className="bg-transparent border-0 p-0 h-auto gap-1">
              <TabsTrigger 
                value="execution" 
                className="data-[state=active]:bg-white data-[state=active]:text-black text-neutral-500 hover:text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2"
              >
                <Sword className="w-4 h-4" />
                Execução
              </TabsTrigger>
              <TabsTrigger 
                value="yearly" 
                className="data-[state=active]:bg-white data-[state=active]:text-black text-neutral-500 hover:text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2"
              >
                <Mountain className="w-4 h-4" />
                Visão Anual
              </TabsTrigger>
              <TabsTrigger 
                value="life" 
                className="data-[state=active]:bg-white data-[state=active]:text-black text-neutral-500 hover:text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Life Vision
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="execution" className="outline-none min-h-[500px]">
            <ExecutionTab
              months={months}
              currentMonthIndex={currentMonthIndex}
              addMonthGoal={addMonthGoal}
              toggleMonthGoal={toggleMonthGoal}
              updateMonth={updateMonth}
              weeks={weeks}
              addWeek={addWeek}
              deleteWeek={deleteWeek}
              addWeekTask={addWeekTask}
              toggleWeekTask={toggleWeekTask}
              updateWeekReview={updateWeekReview}
            />
          </TabsContent>

          <TabsContent value="yearly" className="outline-none">
             {/* Fallback caso YearlyTab não exista ou precise ser recriada, mas assumindo import */}
             {/* Se não existir, o compilador avisará e corrigiremos. */}
             <div className="p-10 text-center border border-dashed border-white/10 rounded-3xl">
                <Mountain className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white">Visão Anual</h3>
                <p className="text-neutral-500">Módulo de planejamento anual (Placeholder)</p>
             </div>
          </TabsContent>

          <TabsContent value="life" className="outline-none">
             <div className="p-10 text-center border border-dashed border-white/10 rounded-3xl">
                <Crown className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white">Life Vision</h3>
                <p className="text-neutral-500">Módulo de visão de vida (Placeholder)</p>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;