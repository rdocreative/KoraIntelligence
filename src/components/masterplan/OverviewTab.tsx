"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Target, Calendar, CheckCircle2, ChevronRight, 
  ArrowUpRight, AlertCircle, BarChart3, RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewTabProps {
  activeWeeks: any[];
  currentMonth: any;
  areas: any;
  annualData: any;
  onNavigateToWeekly: () => void;
  onResetTutorial: () => void;
}

export const OverviewTab = ({ 
  activeWeeks, 
  currentMonth, 
  areas, 
  annualData, 
  onNavigateToWeekly,
  onResetTutorial
}: OverviewTabProps) => {

  const currentMonthIndex = new Date().getMonth();
  
  // Dados simulados para os meses (em um app real viriam do backend/contexto)
  // Assumindo que o hook useMasterplan fornece 'months' dentro de 'annualData' ou similar,
  // mas aqui vou gerar baseado na estrutura provável ou criar placeholders inteligentes.
  // Como 'currentMonth' é passado isoladamente, vou criar uma estrutura para renderizar os 12 meses.
  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. FOCO IMEDIATO (HERO CARD) */}
      <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-[#111111] to-[#0A0A0A] border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
           <Target className="w-32 h-32 text-[#E8251A]" />
        </div>
        
        <CardHeader className="relative z-10">
           <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#E8251A]">
               <Target className="w-4 h-4" /> Objetivo Principal
           </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
           <div>
               <h2 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight mb-2">
                   {annualData.objective || "Defina seu objetivo anual"}
               </h2>
               <p className="text-sm text-neutral-400 max-w-lg leading-relaxed">
                   {annualData.successCriteria || "Estabeleça os critérios de sucesso na aba 'Ano' para começar sua jornada."}
               </p>
           </div>

           <div className="space-y-2">
               <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-500">
                   <span>Progresso Anual</span>
                   <span>{annualData.progress}%</span>
               </div>
               <Progress value={annualData.progress} className="h-2 bg-neutral-900" indicatorClassName="bg-[#E8251A]" />
           </div>

           <div className="pt-2">
               <button 
                   onClick={onNavigateToWeekly}
                   className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-[#E8251A] transition-colors group/btn"
               >
                   Ir para Execução <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
               </button>
           </div>
        </CardContent>
      </Card>

      {/* 2. CONSISTÊNCIA MENSAL (GRID) - REFACTORED */}
      <Card className="bg-[#111111] border-white/5">
         <CardHeader>
             <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">
                 <Calendar className="w-4 h-4" /> Consistência Mensal
             </CardTitle>
         </CardHeader>
         <CardContent>
             <div className="grid grid-cols-3 gap-3">
                 {months.map((month, index) => {
                     const isPast = index < currentMonthIndex;
                     const isCurrent = index === currentMonthIndex;
                     const isFuture = index > currentMonthIndex;

                     // Simulando dados de progresso para visualização (idealmente viria de props)
                     // Se for passado, 0. Se for atual, pega do currentMonth
                     const progress = isCurrent 
                        ? Math.round((currentMonth?.goals?.filter((g:any) => g.completed).length / (currentMonth?.goals?.length || 1)) * 100)
                        : 0; 
                     
                     // Status visual based on time
                     let statusClasses = "bg-[#0A0A0A] border-white/5 text-neutral-500";
                     
                     if (isCurrent) {
                         statusClasses = "bg-[#161616] border-[#E8251A]/50 shadow-[0_0_15px_rgba(232,37,26,0.15)] ring-1 ring-[#E8251A]/20 scale-105 z-10";
                     } else if (isFuture) {
                         statusClasses = "bg-[#0A0A0A] border-white/5 opacity-30 grayscale pointer-events-none";
                     } else if (isPast) {
                         statusClasses = "bg-[#080808] border-white/5 text-neutral-700 opacity-70";
                     }

                     return (
                         <div 
                             key={month} 
                             className={cn(
                                 "flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-500",
                                 statusClasses
                             )}
                         >
                             <span className={cn(
                                 "text-xs font-bold uppercase tracking-widest mb-1",
                                 isCurrent ? "text-white" : "text-inherit"
                             )}>
                                 {month}
                             </span>
                             
                             {/* Circular Progress or Status Icon */}
                             {isFuture ? (
                                <div className="w-8 h-8 rounded-full border-2 border-dashed border-neutral-800 flex items-center justify-center mt-1">
                                    <span className="text-[9px] font-mono text-neutral-800">...</span>
                                </div>
                             ) : (
                                <div className="relative w-10 h-10 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-neutral-900"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                        <path
                                            className={cn(
                                                "transition-all duration-1000 ease-out",
                                                isCurrent ? "text-[#E8251A]" : "text-neutral-700"
                                            )}
                                            strokeDasharray={`${progress}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                    </svg>
                                    <span className={cn(
                                        "absolute text-[9px] font-bold",
                                        isCurrent ? "text-white" : "text-neutral-600"
                                    )}>
                                        {progress}%
                                    </span>
                                </div>
                             )}
                         </div>
                     );
                 })}
             </div>
         </CardContent>
      </Card>

      {/* 3. STATUS DAS ÁREAS (MINI CARDS) */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(areas).map(([key, items]: [string, any]) => {
              const completed = items.filter((i: any) => i.completed).length;
              const total = items.length;
              const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
              
              const labels: Record<string, string> = { 
                  work: 'Trabalho', studies: 'Estudos', health: 'Saúde', personal: 'Pessoal' 
              };

              return (
                  <div key={key} className="bg-[#111111] border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/10 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">{labels[key]}</span>
                          {percentage >= 100 ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                              <span className="text-xs font-mono text-neutral-600">{percentage}%</span>
                          )}
                      </div>
                      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                          <div 
                              className={cn("h-full transition-all duration-1000", percentage >= 100 ? "bg-emerald-500" : "bg-white")} 
                              style={{ width: `${percentage}%` }} 
                          />
                      </div>
                  </div>
              );
          })}
      </div>

      {/* 4. ACTIONS FOOTER */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
          <button 
            onClick={onResetTutorial}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:text-red-500 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reiniciar Sistema
          </button>
      </div>

    </div>
  );
};