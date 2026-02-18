"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target, Calendar, CheckCircle2, ChevronRight, HelpCircle, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OverviewTabProps {
  activeWeeks: any[];
  currentMonth: any;
  areas: any;
  annualData: any;
  onNavigateToWeekly: () => void;
  onResetTutorial: () => void;
}

// Reusable Helper Component for the Tooltip
const InfoTooltip = ({ text }: { text: string }) => (
  <TooltipProvider>
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button className="outline-none">
            <HelpCircle className="w-[14px] h-[14px] text-[#555] hover:text-[#E8251A] transition-colors" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-[#1A1A1A] border-[#333] text-[#AAAAAA] max-w-[220px] rounded-lg p-3 text-xs leading-relaxed">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const OverviewTab = ({ 
  activeWeeks, 
  currentMonth, 
  areas, 
  onNavigateToWeekly,
  annualData,
  onResetTutorial
}: OverviewTabProps) => {

  const navigateToTab = (value: string) => {
    document.querySelector(`[data-value="${value}"]`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1A - HIERARCHICAL CONNECTION STRIP */}
      <div className="w-full bg-[#111111] border-y border-white/5 py-4 overflow-x-auto">
        <div className="flex items-start justify-between min-w-[600px] px-4 md:px-8 gap-4">
            
            {/* ANO */}
            <button onClick={() => navigateToTab('annual')} className="group flex flex-col items-center gap-1 flex-1 text-center hover:bg-white/5 p-2 rounded-lg transition-colors">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest group-hover:text-white transition-colors">ANO</span>
                <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400">Seu grande objetivo</span>
            </button>

            <ArrowRight className="w-4 h-4 text-neutral-800 mt-3 shrink-0" />

            {/* MÊS */}
            <button onClick={() => navigateToTab('execution')} className="group flex flex-col items-center gap-1 flex-1 text-center hover:bg-white/5 p-2 rounded-lg transition-colors">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest group-hover:text-white transition-colors">MÊS</span>
                <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400">As batalhas do mês</span>
            </button>

            <ArrowRight className="w-4 h-4 text-neutral-800 mt-3 shrink-0" />

            {/* SEMANA */}
            <button onClick={() => navigateToTab('execution')} className="group flex flex-col items-center gap-1 flex-1 text-center hover:bg-white/5 p-2 rounded-lg transition-colors">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest group-hover:text-white transition-colors">SEMANA</span>
                <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400">Seu foco desta semana</span>
            </button>

            <ArrowRight className="w-4 h-4 text-neutral-800 mt-3 shrink-0" />

            {/* DIA */}
            <button onClick={() => navigateToTab('execution')} className="group flex flex-col items-center gap-1 flex-1 text-center hover:bg-white/5 p-2 rounded-lg transition-colors">
                <span className="text-[10px] font-bold text-[#E8251A] uppercase tracking-widest">DIA</span>
                <span className="text-[10px] text-neutral-400">O que você vai fazer hoje</span>
            </button>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Annual Summary Card */}
        <Card className="bg-[#111111] border-white/5 lg:col-span-2">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-[#E8251A]">
                    <span className="flex items-center gap-2"><Target className="w-4 h-4" /> Objetivo Anual</span>
                    <InfoTooltip text="É a sua grande meta do ano. Tudo que você faz aqui deve servir a esse objetivo." />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {annualData.objective || "Nenhum objetivo definido."}
                </div>
                <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden mt-4">
                    <div className="bg-[#E8251A] h-full transition-all duration-500" style={{ width: `${annualData.progress}%` }} />
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-2 text-right">
                    {annualData.progress}% Concluído
                </div>
            </CardContent>
        </Card>

        {/* Monthly Summary Card */}
        <Card className="bg-[#111111] border-white/5 cursor-pointer hover:border-white/10 transition-colors" onClick={() => navigateToTab('execution')}>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Mês Atual</span>
                    <InfoTooltip text="As metas que você quer conquistar neste mês. Elas devem alimentar os seus pilares." />
                </CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="text-2xl font-bold text-white mb-1">{currentMonth?.name}</div>
                 <div className="text-xs text-neutral-500 mb-4">
                    {currentMonth?.goals.filter((g:any) => g.completed).length} de {currentMonth?.goals.length} metas
                 </div>
                 <div className="space-y-2">
                    {currentMonth?.goals.slice(0, 2).map((goal: any) => (
                        <div key={goal.id} className="flex items-center gap-2 text-xs text-neutral-300">
                            <div className={`w-1.5 h-1.5 rounded-full ${goal.completed ? 'bg-[#E8251A]' : 'bg-neutral-700'}`} />
                            <span className={goal.completed ? 'line-through opacity-50' : ''}>{goal.text}</span>
                        </div>
                    ))}
                    {currentMonth?.goals.length === 0 && <span className="text-xs text-neutral-600 italic">Nenhuma meta definida.</span>}
                 </div>
            </CardContent>
        </Card>

        {/* Weekly Summary Card */}
        <Card className="bg-[#111111] border-white/5 cursor-pointer hover:border-white/10 transition-colors" onClick={onNavigateToWeekly}>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">
                     <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Semana Ativa</span>
                     <InfoTooltip text="Cada semana tem um foco específico. Defina no máximo 3 prioridades por semana." />
                </CardTitle>
            </CardHeader>
            <CardContent>
                 {activeWeeks.length > 0 ? (
                     <>
                        <div className="text-lg font-bold text-white mb-1">{activeWeeks[0].title}</div>
                        <div className="text-xs text-neutral-500 mb-4">
                            {new Date(activeWeeks[0].endDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs font-bold text-[#E8251A] uppercase tracking-wide flex items-center gap-1">
                            Ver Tarefas <ChevronRight className="w-3 h-3" />
                        </div>
                     </>
                 ) : (
                     <div className="h-full flex flex-col justify-center items-center text-center">
                         <span className="text-xs text-neutral-500 mb-2">Nenhuma semana ativa</span>
                         <span className="text-[10px] font-bold text-[#E8251A] uppercase tracking-widest">Iniciar Agora</span>
                     </div>
                 )}
            </CardContent>
        </Card>

      </div>
      
      {/* Tutorial Reset (Hidden helper) */}
      <div className="flex justify-center pt-8 opacity-20 hover:opacity-100 transition-opacity">
        <button onClick={onResetTutorial} className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white">
            Reiniciar Tutorial
        </button>
      </div>

    </div>
  );
};