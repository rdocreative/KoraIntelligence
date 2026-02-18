import React, { useState } from "react";
import { Target, ChevronDown, ChevronUp, Calendar as CalendarIcon, Trophy } from "lucide-react";
import { WeeklyTab } from "@/components/masterplan/WeeklyTab";
import { MonthlyTab } from "@/components/masterplan/MonthlyTab";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TaskItem } from "@/hooks/useMasterplan";

interface ExecutionTabProps {
  // Monthly Data
  currentMonth: any;
  currentMonthIndex: number;
  addMonthGoal: (monthIndex: number, task: TaskItem) => void;
  toggleMonthGoal: (monthIndex: number, taskId: string) => void;
  updateMonth: (monthIndex: number, data: any) => void;
  
  // Weekly Data
  weeks: any[];
  addWeek: (week: any) => void;
  deleteWeek: (id: string) => void;
  addWeekTask: (weekId: string, task: TaskItem) => void;
  toggleWeekTask: (weekId: string, taskId: string) => void;
  updateWeekReview: (weekId: string, field: string, value: string) => void;
}

export const ExecutionTab = ({
  currentMonth,
  currentMonthIndex,
  addMonthGoal,
  toggleMonthGoal,
  updateMonth,
  weeks,
  addWeek,
  deleteWeek,
  addWeekTask,
  toggleWeekTask,
  updateWeekReview
}: ExecutionTabProps) => {
  const [isMonthExpanded, setIsMonthExpanded] = useState(false);

  const completedGoals = currentMonth.goals.filter((g: any) => g.completed).length;
  const totalGoals = currentMonth.goals.length;
  const progress = totalGoals === 0 ? 0 : (completedGoals / totalGoals) * 100;
  
  // Encontrar a primeira meta não concluída para ser o destaque "Norte"
  const mainGoal = currentMonth.goals.find((g: any) => !g.completed) || currentMonth.goals[0];

  return (
    <div className="space-y-0 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* --- NORTE: HERO CARD MENSAL (UNIFICADO) --- */}
      <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-500 hover:bg-white/[0.07] mb-12">
         
         {/* Efeitos de Fundo */}
         <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />
         <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

         <Collapsible open={isMonthExpanded} onOpenChange={setIsMonthExpanded}>
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row min-h-[140px]">
                    
                    {/* LADO ESQUERDO: Identidade do Mês */}
                    <div className="flex-1 p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-1.5">
                                    <CalendarIcon className="w-3 h-3" /> Mês Atual
                                </span>
                                <div className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${progress === 100 ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/5 text-neutral-400'}`}>
                                    {Math.round(progress)}% Concluído
                                </div>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                                {currentMonth.name}
                            </h2>
                            {/* Barra de Progresso Integrada */}
                            <div className="h-1 w-full max-w-[200px] bg-neutral-900 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* LADO DIREITO: Foco Principal (Integrado) */}
                    <div className="flex-1 p-8 flex items-center bg-white/[0.02]">
                        <div className="w-full flex items-center gap-5">
                             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/10 to-transparent flex items-center justify-center border border-red-500/10 shrink-0">
                                <Target className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                                <span className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest">Foco Principal</span>
                                <p className="text-lg font-bold text-white leading-tight truncate">
                                    {mainGoal ? mainGoal.text : "Nenhuma meta definida"}
                                </p>
                            </div>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-500 hover:text-white rounded-full hover:bg-white/10 shrink-0 ml-2">
                                    {isMonthExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo Expandido (Gestão Mensal) */}
            <CollapsibleContent className="border-t border-white/5 bg-black/40 shadow-inner">
                <div className="p-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-xs text-neutral-500 font-bold uppercase tracking-[0.2em]">Planejamento Mensal Detalhado</span>
                    </div>
                    <MonthlyTab 
                        months={[currentMonth]} 
                        currentMonthIndex={0}
                        addMonthGoal={(idx, task) => addMonthGoal(currentMonthIndex, task)}
                        toggleMonthGoal={(idx, id) => toggleMonthGoal(currentMonthIndex, id)}
                        updateMonth={(idx, data) => updateMonth(currentMonthIndex, data)}
                    />
                </div>
            </CollapsibleContent>
         </Collapsible>
      </div>

      {/* --- BATALHA: SPRINTS SEMANAIS --- */}
      <div>
          <div className="flex items-center gap-3 mb-8 px-1">
             <div className="p-1.5 rounded bg-white/5">
                <Trophy className="w-3.5 h-3.5 text-neutral-400" />
             </div>
             <span className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em]">Sprints Semanais</span>
             <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          
          <WeeklyTab 
            weeks={weeks}
            addWeek={addWeek}
            deleteWeek={deleteWeek}
            addWeekTask={addWeekTask}
            toggleWeekTask={toggleWeekTask}
            updateWeekReview={updateWeekReview}
          />
      </div>

    </div>
  );
};