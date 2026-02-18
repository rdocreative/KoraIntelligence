"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, GraduationCap, Heart, User, 
  ArrowRight, Target, CalendarDays, CheckCircle2, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewTabProps {
  activeWeeks: any[];
  currentMonth: any;
  areas: {
    work: any[];
    studies: any[];
    health: any[];
    personal: any[];
  };
  onNavigateToWeekly: () => void;
  annualData: any;
  onResetTutorial: () => void;
}

export const OverviewTab = ({ 
  activeWeeks, 
  currentMonth, 
  areas, 
  onNavigateToWeekly, 
  annualData,
  onResetTutorial
}: OverviewTabProps) => {

  const pillars = [
    { id: 'work', label: 'Trabalho', icon: Briefcase, items: areas.work },
    { id: 'studies', label: 'Estudos', icon: GraduationCap, items: areas.studies },
    { id: 'health', label: 'Saúde', icon: Heart, items: areas.health },
    { id: 'personal', label: 'Pessoal', icon: User, items: areas.personal },
  ];

  const calculateProgress = (items: any[]) => {
    if (!items?.length) return 0;
    return Math.round((items.filter(i => i.completed).length / items.length) * 100);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Annual Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-[#111111] border border-white/5 p-8 shadow-2xl group">
        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
           <Button variant="ghost" size="sm" onClick={onResetTutorial} className="text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white">
              <RefreshCw className="w-3 h-3 mr-2" /> Reset
           </Button>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E8251A]" />
        
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-[#E8251A]">
              <Target className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Objetivo Anual</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
              {annualData.objective || "Defina seu objetivo"}
            </h1>
            <p className="text-neutral-400 font-mono text-xs leading-relaxed max-w-lg">
              {annualData.successCriteria || "Critérios não definidos"}
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col items-end gap-2">
             <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Progresso Anual</span>
                <div className="text-5xl font-black text-white tracking-tighter">
                  {annualData.progress}%
                </div>
             </div>
             {/* Custom Progress Bar */}
             <div className="w-full md:w-48 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#E8251A] transition-all duration-1000" 
                  style={{ width: `${annualData.progress}%` }} 
                />
             </div>
          </div>
        </div>
      </div>

      {/* OS 4 PILARES DA EVOLUÇÃO (MONOCHROME RED) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">
            Os 4 Pilares da Evolução
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar) => {
            const progress = calculateProgress(pillar.items);
            const isActive = pillar.items.length > 0;
            
            return (
              <div 
                key={pillar.id}
                className={cn(
                  "relative p-5 rounded-xl border transition-all duration-300 group hover:-translate-y-1",
                  isActive 
                    ? "bg-[#111111] border-white/5 hover:border-[#E8251A]/30 hover:shadow-[0_4px_20px_rgba(232,37,26,0.1)]" 
                    : "bg-[#0A0A0A] border-white/5 opacity-60 hover:opacity-100"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "p-2.5 rounded-lg border transition-colors",
                    isActive 
                      ? "bg-[#E8251A]/10 border-[#E8251A]/20 text-[#E8251A]" 
                      : "bg-neutral-900 border-white/5 text-neutral-600 group-hover:text-neutral-500"
                  )}>
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-bold text-neutral-500 tabular-nums">
                      {progress}%
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                   <h4 className={cn(
                     "text-sm font-bold uppercase tracking-wide transition-colors",
                     isActive ? "text-white" : "text-neutral-500"
                   )}>
                     {pillar.label}
                   </h4>
                   <p className="text-[10px] text-neutral-500 font-medium">
                     {pillar.items.length} {pillar.items.length === 1 ? 'meta' : 'metas'} ativas
                   </p>
                </div>

                {/* Progress Bar only if active */}
                {isActive ? (
                  <div className="mt-4 h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#E8251A] transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ) : (
                  <div className="mt-4 h-1 w-full bg-neutral-900 rounded-full overflow-hidden" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly / Weekly Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {/* Monthly Focus */}
         <Card className="bg-[#111111] border-white/5 hover:border-white/10 transition-colors">
            <CardHeader className="pb-2">
               <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> Mês Atual
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                     <h3 className="text-xl font-bold text-white">{currentMonth?.name || "Mês Atual"}</h3>
                     <span className="text-xs text-neutral-500 font-mono">
                        {currentMonth?.goals?.filter((g: any) => g.completed).length}/{currentMonth?.goals?.length}
                     </span>
                  </div>
                  
                  <div className="space-y-2">
                    {currentMonth?.goals?.slice(0, 3).map((goal: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                        <div className={cn("w-1.5 h-1.5 rounded-full", goal.completed ? "bg-[#E8251A]" : "bg-neutral-700")} />
                        <span className={cn("truncate", goal.completed && "line-through text-neutral-600")}>
                           {goal.text}
                        </span>
                      </div>
                    ))}
                    {(!currentMonth?.goals || currentMonth.goals.length === 0) && (
                       <p className="text-sm text-neutral-600 italic">Nenhum foco definido para este mês.</p>
                    )}
                  </div>

                  <Button onClick={onNavigateToWeekly} className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/5 text-xs font-bold uppercase tracking-widest mt-2">
                     Gerenciar Mês
                  </Button>
               </div>
            </CardContent>
         </Card>

         {/* Weekly Focus */}
         <Card className="bg-[#111111] border-white/5 hover:border-white/10 transition-colors">
            <CardHeader className="pb-2">
               <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Semanas Ativas
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {activeWeeks && activeWeeks.length > 0 ? (
                    activeWeeks.slice(0, 2).map((week, idx) => (
                      <div key={idx} className="bg-[#0A0A0A] p-3 rounded-lg border border-white/5">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{week.title}</span>
                            <Badge variant="outline" className="border-[#E8251A]/30 text-[#E8251A] text-[9px] uppercase px-1.5 h-5">
                               Ativa
                            </Badge>
                         </div>
                         <div className="space-y-1">
                            {week.tasks?.slice(0, 2).map((t: any, ti: number) => (
                               <div key={ti} className="text-xs text-neutral-400 truncate flex items-center gap-2">
                                  <div className={cn("w-1 h-1 rounded-full", t.completed ? "bg-[#E8251A]" : "bg-neutral-700")} />
                                  {t.text}
                               </div>
                            ))}
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center">
                       <p className="text-sm text-neutral-600 mb-4">Nenhuma semana ativa no momento.</p>
                    </div>
                  )}
                  
                  <Button onClick={onNavigateToWeekly} className="w-full bg-[#E8251A] hover:bg-[#c91e14] text-white text-xs font-bold uppercase tracking-widest">
                     Abrir Painel Tático <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>

    </div>
  );
};