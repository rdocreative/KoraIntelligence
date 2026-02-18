import React, { useState } from "react";
import { Target, ChevronDown, ChevronUp, Calendar as CalendarIcon, Trophy } from "lucide-react";
import { WeeklyTab } from "@/components/masterplan/WeeklyTab";
import { MonthlyTab } from "@/components/masterplan/MonthlyTab";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* --- NORTE: CARD MENSAL (GLASSMORPHISM) --- */}
      <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-500 hover:bg-white/[0.07]">
         
         {/* Efeitos de Fundo */}
         <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />
         <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

         <Collapsible open={isMonthExpanded} onOpenChange={setIsMonthExpanded}>
            <div className="p-6 md:p-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    
                    {/* Título e Progresso */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-1.5">
                                <CalendarIcon className="w-3 h-3" /> Mês Atual
                            </span>
                            <div className="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-[10px] font-bold text-white">
                                {Math.round(progress)}%
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                            {currentMonth.name}
                        </h2>
                    </div>

                    {/* Destaque da Meta (Norte) */}
                    <div className="w-full md:max-w-md bg-black/40 rounded-xl p-4 border border-white/5 backdrop-blur-sm flex items-center gap-4 group cursor-default hover:border-red-500/20 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                            <Target className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-0.5">Foco Principal</span>
                            <p className="text-sm font-bold text-white truncate">
                                {mainGoal ? mainGoal.text : "Nenhuma meta definida"}
                            </p>
                        </div>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-white rounded-full hover:bg-white/10">
                                {isMonthExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </div>

                {/* Barra de Progresso Discreta */}
                <div className="mt-6 h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000 ease-out" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Conteúdo Expandido (Gestão Mensal) */}
            <CollapsibleContent className="border-t border-white/5 bg-black/20">
                <div className="p-6 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-4">Planejamento Completo do Mês</p>
                    <MonthlyTab 
                        months={[currentMonth]} // Passando apenas o mês atual como array para o componente
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
      <div className="pt-2">
          <div className="flex items-center gap-3 mb-6 px-1">
             <Trophy className="w-4 h-4 text-neutral-500" />
             <span className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em]">Sprints Semanais</span>
             <div className="h-px flex-1 bg-white/10" />
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