import React from "react";
import { WeeklyTab } from "./WeeklyTab";
import { Target, Calendar as CalendarIcon, ArrowUpRight } from "lucide-react";
import { TaskItem } from "@/hooks/useMasterplan";
import { cn } from "@/lib/utils";

interface ExecutionTabProps {
  // Props do Mês
  months: any[];
  currentMonthIndex: number;
  addMonthGoal: (monthIndex: number, task: TaskItem) => void;
  toggleMonthGoal: (monthIndex: number, taskId: string) => void;
  updateMonth: (monthIndex: number, data: any) => void;
  
  // Props da Semana
  weeks: any[];
  addWeek: (week: any) => void;
  deleteWeek: (id: string) => void;
  addWeekTask: (weekId: string, task: TaskItem) => void;
  toggleWeekTask: (weekId: string, taskId: string) => void;
  updateWeekReview: (weekId: string, field: string, value: string) => void;
}

export const ExecutionTab = (props: ExecutionTabProps) => {
  // Verificação de segurança: Se months não existir ou estiver vazio, retorna um estado de loading ou vazio
  if (!props.months || props.months.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="h-12 w-12 bg-white/5 rounded-full" />
        <div className="text-neutral-500 text-sm font-medium">Carregando plano mestre...</div>
      </div>
    );
  }

  const currentMonth = props.months[props.currentMonthIndex];
  
  // Se currentMonth for undefined (índice inválido), fallback seguro
  if (!currentMonth) {
    return <div className="text-red-500 p-4">Erro: Mês atual não encontrado.</div>;
  }
  
  // Pega a primeira meta não concluída como "Norte", ou a primeira geral se todas concluídas
  const mainGoal = currentMonth.goals?.find((g: any) => !g.completed) || currentMonth.goals?.[0];
  const completedGoals = currentMonth.goals?.filter((g: any) => g.completed).length || 0;
  const totalGoals = currentMonth.goals?.length || 0;
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* SECTION: MONTHLY NORTH STAR (Glassmorphism Minimalista) */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#0A0A0A] shadow-2xl group">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Left: Month Identity */}
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-neutral-900/50 border border-white/5 flex items-center justify-center shadow-inner">
              <CalendarIcon className="w-6 h-6 text-neutral-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                {currentMonth.name}
              </h2>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-widest">
                <span>Progresso Mensal</span>
                <div className="h-1 w-12 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          {/* Right: The ONE Main Goal (North Star) */}
          <div className="flex-1 w-full md:w-auto md:max-w-xl">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-neutral-900/80 to-neutral-900/40 border border-white/5 p-4 md:px-6 md:py-5 flex items-center gap-4 group-hover:border-white/10 transition-colors">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />
              
              <div className="h-10 w-10 min-w-[2.5rem] rounded-full bg-red-600/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-red-500" />
              </div>
              
              <div className="space-y-0.5 w-full">
                <div className="flex justify-between items-center w-full">
                   <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block mb-0.5">
                     Foco Principal do Mês
                   </span>
                   <ArrowUpRight className="w-4 h-4 text-neutral-700 group-hover:text-neutral-400 transition-colors" />
                </div>
                <p className="text-sm md:text-base font-medium text-neutral-200 line-clamp-1">
                  {mainGoal ? mainGoal.text : "Nenhuma meta definida."}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* SECTION: WEEKLY BATTLEFIELD */}
      <div className="relative">
        {/* Connector Line Visual */}
        <div className="absolute left-8 -top-12 bottom-0 w-px bg-gradient-to-b from-white/5 via-white/5 to-transparent -z-10 hidden md:block" />
        
        <WeeklyTab 
          weeks={props.weeks}
          addWeek={props.addWeek}
          deleteWeek={props.deleteWeek}
          addWeekTask={props.addWeekTask}
          toggleWeekTask={props.toggleWeekTask}
          updateWeekReview={props.updateWeekReview}
        />
      </div>
    </div>
  );
};