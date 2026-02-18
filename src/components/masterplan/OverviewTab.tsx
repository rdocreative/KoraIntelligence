import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight, Trophy, Briefcase, GraduationCap, Heart, User } from "lucide-react";
import { TaskItem } from "@/hooks/useMasterplan";

interface OverviewTabProps {
  activeWeeks: any[];
  currentMonth: any;
  areas: {
    work: TaskItem[];
    studies: TaskItem[];
    health: TaskItem[];
    personal: TaskItem[];
  };
  onNavigateToWeekly: () => void;
  annualData: {
    objective: string;
    successCriteria: string;
    progress: number;
  };
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

  // Helper para obter texto seguro
  const getSafeText = (item: any) => {
    if (!item) return "";
    if (typeof item === 'string') return item;
    return item.text || "";
  };

  return (
    <div className="space-y-12 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4">
           <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
                  OBJETIVO NORTEADOR DO ANO
                </span>
                <Button variant="ghost" size="sm" onClick={onResetTutorial} className="h-5 px-2 text-[9px] text-neutral-600 hover:text-white uppercase tracking-widest hover:bg-white/5 rounded-full">
                    Setup
                </Button>
              </div>

              <div>
                <h1 className="text-3xl md:text-[2.5rem] font-bold text-white tracking-tight leading-tight">
                  {annualData.objective || "Objetivo Não Definido"}
                </h1>
                <p className="mt-4 text-base md:text-lg text-neutral-400/90 font-medium max-w-xl leading-relaxed">
                    {annualData.successCriteria || "Defina seu critério de sucesso na aba Anual."}
                </p>
              </div>
           </div>
           
           <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
              <div className="flex justify-between w-full lg:w-72 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                  <span>Conclusão Anual</span>
                  <span className="text-white text-shadow-sm">{annualData.progress}%</span>
              </div>
              <div className="w-full lg:w-72 h-2 bg-neutral-900 rounded-full border border-white/5 relative overflow-hidden shadow-inner">
                 <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-800 via-red-600 to-red-500 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-1000 ease-out"
                    style={{ width: `${annualData.progress}%` }}
                 />
              </div>
           </div>
      </header>

      {/* OS 4 PILARES DA EVOLUÇÃO (NOVA SEÇÃO) */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em] pl-1">Os 4 Pilares da Evolução</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {[
             { label: 'Trabalho', items: areas.work, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/10' },
             { label: 'Estudos', items: areas.studies, icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-500/5', border: 'border-purple-500/10' },
             { label: 'Saúde', items: areas.health, icon: Heart, color: 'text-red-500', bg: 'bg-red-500/5', border: 'border-red-500/10' },
             { label: 'Pessoal', items: areas.personal, icon: User, color: 'text-yellow-500', bg: 'bg-yellow-500/5', border: 'border-yellow-500/10' },
           ].map((area) => (
             <div key={area.label} className={`relative flex items-center gap-4 p-5 rounded-2xl border ${area.border} ${area.bg} transition-all duration-300 hover:bg-white/5 hover:border-white/10 group overflow-hidden`}>
                <div className={`absolute right-0 top-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity transform translate-x-2 -translate-y-2`}>
                   <area.icon className={`w-16 h-16 ${area.color}`} />
                </div>
                
                <div className={`w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center shrink-0 shadow-lg`}>
                   <area.icon className={`w-5 h-5 ${area.color}`} />
                </div>
                
                <div className="flex-1 min-w-0 relative z-10">
                   <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${area.color}`}>{area.label}</div>
                   <div className="text-sm font-bold text-white truncate leading-tight">
                      {area.items.length > 0 ? getSafeText(area.items[0]) : <span className="text-neutral-600 font-normal italic">Sem metas definidas</span>}
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* HERO CARD - WEEKLY FOCUS */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-[#121212] to-black border-white/10 shadow-2xl relative overflow-hidden group hover:border-red-500/30 transition-all duration-500">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 scale-150">
            <Target className="w-64 h-64" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">Foco da Semana</span>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            {activeWeeks.length > 0 ? (
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                  "{activeWeeks[0].goal}"
                </h3>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Progresso</span>
                    <span className="text-2xl font-bold text-white">{Math.round((activeWeeks[0].tasks.filter((t: any) => t.completed).length / (activeWeeks[0].tasks.length || 1)) * 100)}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Tarefas</span>
                    <span className="text-2xl font-bold text-white">{activeWeeks[0].tasks.filter((t: any) => t.completed).length} <span className="text-base text-neutral-600 font-medium">/ {activeWeeks[0].tasks.length}</span></span>
                  </div>
                </div>
                <Button onClick={onNavigateToWeekly} className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg">
                  Ver Detalhes <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-start gap-4">
                <p className="text-neutral-500 text-lg">Você ainda não definiu o foco desta semana.</p>
                <Button className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 shadow-lg shadow-red-900/20">
                  Definir Agora
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* MONTH CARD */}
        <Card className="bg-[#0A0A0A] border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em]">Mês Atual</CardTitle>
            <div className="text-3xl font-black text-white uppercase">{currentMonth.name}</div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-end justify-between">
              <div className="text-5xl font-black text-white tracking-tighter">
                {currentMonth.goals.filter((g: any) => g.completed).length}
                <span className="text-lg text-neutral-600 font-medium ml-1">/ {currentMonth.goals.length}</span>
              </div>
              <Trophy className="w-12 h-12 text-neutral-800" />
            </div>
            <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000"
                style={{ width: `${(currentMonth.goals.filter((g: any) => g.completed).length / (currentMonth.goals.length || 1)) * 100}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              Cada pequena vitória conta. Continue avançando.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};