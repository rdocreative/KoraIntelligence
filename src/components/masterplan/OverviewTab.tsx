import React from "react";
import { 
  Target, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  User,
  Plus,
  RefreshCw,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface OverviewTabProps {
  activeWeeks: any[];
  currentMonth: any;
  areas: any;
  onNavigateToWeekly: () => void;
  annualData: any;
  onResetTutorial: () => void;
  analytics: any;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  activeWeeks,
  currentMonth,
  areas,
  onNavigateToWeekly,
  annualData,
  onResetTutorial,
  analytics
}) => {
  const currentWeek = activeWeeks[0];
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = today.toLocaleDateString('pt-BR', dateOptions);

  // Updated colors to match Design System
  const getAreaConfig = (id: string) => {
    switch(id) {
      case 'work': return { color: 'text-[#1cb0f6]', bg: 'bg-[#1cb0f6]', border: 'border-[#1cb0f6]', shadow: 'shadow-3d-blue', icon: Briefcase, label: 'Trabalho' };
      case 'studies': return { color: 'text-[#ce82ff]', bg: 'bg-[#ce82ff]', border: 'border-[#ce82ff]', shadow: 'shadow-3d-purple', icon: GraduationCap, label: 'Estudos' };
      case 'health': return { color: 'text-[#58cc02]', bg: 'bg-[#58cc02]', border: 'border-[#58cc02]', shadow: 'shadow-3d-green', icon: Heart, label: 'Saúde' };
      case 'personal': return { color: 'text-[#ff9600]', bg: 'bg-[#ff9600]', border: 'border-[#ff9600]', shadow: 'shadow-3d-orange', icon: User, label: 'Pessoal' };
      default: return { color: 'text-white', bg: 'bg-white', border: 'border-white', shadow: 'shadow-none', icon: Target, label: 'Geral' };
    }
  };

  const monthTotal = currentMonth?.goals.length || 0;
  const monthCompleted = currentMonth?.goals.filter((g: any) => g.completed).length || 0;

  const weekTotal = currentWeek?.tasks.length || 0;
  const weekCompleted = currentWeek?.tasks.filter((t: any) => t.completed).length || 0;
  const weekProgress = weekTotal === 0 ? 0 : (weekCompleted / weekTotal) * 100;

  const cardBaseStyle = "bg-[#202f36] border-2 border-[#37464f] shadow-3d-panel rounded-3xl";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. CARD OBJETIVO ANUAL */}
      <Card className={`${cardBaseStyle} relative overflow-hidden group border-0 ring-2 ring-[#37464f]`}>
        <div className="absolute top-0 right-0 p-32 bg-[#ff4b4b] opacity-10 rounded-full blur-3xl" />
        
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#ff4b4b] mb-1">
                <Target size={20} />
                <span className="text-xs font-extrabold tracking-widest uppercase">Objetivo Anual</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{annualData.mainGoal || "Defina seu objetivo principal"}</h2>
            </div>
            <div className="text-right">
              <div className="text-5xl font-extrabold text-[#ff4b4b]">{Math.round(annualData.progress)}%</div>
            </div>
          </div>

          {/* Barra de Progresso Principal */}
          <div className="h-6 bg-[#131f24] rounded-full overflow-hidden mb-6 border-2 border-[#37464f]">
            <div 
              className="h-full bg-[#ff4b4b] transition-all duration-1000 ease-out relative"
              style={{ width: `${annualData.progress}%` }}
            >
               <div className="absolute top-0 left-0 w-full h-[40%] bg-white/20 rounded-t-full"></div>
            </div>
          </div>

          {/* Breakdown dos 4 Pilares */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t-2 border-[#37464f]">
            {analytics.areaStats.map((area: any) => {
              const config = getAreaConfig(area.id);
              const Icon = config.icon;
              return (
                <div key={area.id} className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-[#131f24] border-2 border-[#37464f] ${config.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1.5 font-extrabold uppercase">
                      <span className="text-[#9ca3af]">{config.label}</span>
                      <span className={`${config.color}`}>{Math.round(area.percentage)}%</span>
                    </div>
                    <div className="h-3 bg-[#131f24] rounded-full overflow-hidden border border-[#37464f]">
                       <div className={`h-full ${config.bg}`} style={{ width: `${area.percentage}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2. GRID DE PILARES (4 CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.areaStats.map((area: any) => {
          const config = getAreaConfig(area.id);
          const Icon = config.icon;
          const areaItems = areas[area.id] || [];
          const firstItem = areaItems.find((i: any) => !i.completed) || areaItems[0];
          const hasItem = !!firstItem;

          return (
            <Card key={area.id} className={`bg-[#202f36] border-2 border-[#37464f] ${config.shadow} rounded-3xl hover:translate-y-[-2px] transition-transform duration-200`}>
              <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-[#131f24] border-2 ${config.border} ${config.color}`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-extrabold text-[#9ca3af] bg-[#131f24] px-3 py-1 rounded-full border border-[#37464f]">
                      {area.completed}/{area.total}
                    </span>
                  </div>
                  
                  <h3 className={`font-extrabold text-lg mb-2 ${config.color} uppercase`}>{config.label}</h3>
                  <div className="h-3 bg-[#131f24] rounded-full overflow-hidden border border-[#37464f] mb-4">
                      <div className={`h-full ${config.bg}`} style={{ width: `${area.percentage}%` }} />
                  </div>
                  
                  <div className="min-h-[3rem]">
                    {hasItem ? (
                      <p className="text-sm text-[#e5e7eb] font-bold line-clamp-2 leading-relaxed bg-[#131f24]/50 p-2 rounded-xl border border-[#37464f]">
                        {firstItem.title}
                      </p>
                    ) : (
                       <p className="text-sm text-[#9ca3af] italic mt-1 font-bold">
                        Sem meta definida
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 3. GRID DE TEMPO (MÊS, SEMANA, HOJE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card Mês */}
        <Card className={`${cardBaseStyle} flex flex-col`}>
          <CardHeader className="pb-2 border-b-2 border-[#37464f] bg-[#131f24] rounded-t-3xl pt-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-extrabold text-[#e5e7eb] uppercase tracking-wider">
                {currentMonth?.name || "Mês Atual"}
              </CardTitle>
              <Calendar size={20} className="text-[#9ca3af]" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-4">
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-extrabold text-white">{monthCompleted}</span>
              <span className="text-xs text-[#9ca3af] font-bold uppercase mb-2">de {monthTotal} metas</span>
            </div>
            
            <div className="space-y-2 flex-1">
              {currentMonth?.goals.slice(0, 3).map((goal: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-sm p-2 rounded-xl border border-[#37464f] bg-[#131f24]">
                  <div className={`w-3 h-3 rounded-full border ${goal.completed ? 'bg-[#58cc02] border-[#58cc02]' : 'bg-transparent border-[#9ca3af]'}`} />
                  <span className={`line-clamp-1 font-bold ${goal.completed ? 'text-[#9ca3af] line-through' : 'text-[#e5e7eb]'}`}>
                    {goal.title}
                  </span>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full mt-6 bg-[#22d3ee] text-[#083344] font-extrabold uppercase shadow-3d-cyan hover:bg-[#22d3ee] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none h-12 rounded-2xl border-b-0"
              onClick={onNavigateToWeekly}
            >
              Gerenciar
            </Button>
          </CardContent>
        </Card>

        {/* Card Semana */}
        <Card className={`${cardBaseStyle} flex flex-col`}>
          <CardHeader className="pb-2 border-b-2 border-[#37464f] bg-[#131f24] rounded-t-3xl pt-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-extrabold text-[#e5e7eb] uppercase tracking-wider">
                Semana
              </CardTitle>
              <TrendingUp size={20} className="text-[#9ca3af]" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-4">
             {currentWeek ? (
               <>
                <div className="flex flex-col mb-4">
                   <span className="text-xs font-bold text-[#9ca3af] uppercase mb-1">
                     {new Date(currentWeek.startDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})} - {new Date(currentWeek.endDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                   </span>
                   <div className="flex items-end gap-2">
                     <span className="text-4xl font-extrabold text-white">{weekCompleted}</span>
                     <span className="text-xs text-[#9ca3af] font-bold uppercase mb-2">tarefas</span>
                   </div>
                </div>
                
                <div className="h-4 bg-[#131f24] rounded-full overflow-hidden border border-[#37464f] mb-auto">
                   <div className="h-full bg-[#ce82ff]" style={{ width: `${weekProgress}%` }} />
                </div>
               </>
             ) : (
                <div className="flex-1 flex items-center justify-center text-[#9ca3af] font-bold text-sm">
                   Sem semana ativa
                </div>
             )}

             <Button 
                className="w-full mt-6 bg-[#202f36] border-2 border-[#37464f] text-[#e5e7eb] font-extrabold uppercase shadow-3d-panel hover:bg-[#202f36] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none h-12 rounded-2xl"
                onClick={onNavigateToWeekly}
              >
                {currentWeek ? 'Ver Tarefas' : 'Criar Semana'}
              </Button>
          </CardContent>
        </Card>

        {/* Card Hoje (Foco) */}
        <Card className={`${cardBaseStyle} border-[#ff9600] flex flex-col shadow-3d-orange`}>
          <CardHeader className="pb-2 border-b-2 border-[#ff9600] bg-[#ff9600]/10 rounded-t-3xl pt-6">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base font-extrabold text-[#ff9600] uppercase tracking-wider flex items-center gap-2">
                   <Target size={20} /> Foco de Hoje
                </CardTitle>
                <p className="text-xs text-[#9ca3af] font-bold uppercase mt-1">{formattedDate}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-4">
            <div className="space-y-3 mt-2 flex-1">
              {currentWeek?.tasks.filter((t:any) => !t.completed).slice(0, 2).map((task: any, idx: number) => (
                <div key={idx} className="flex gap-3 items-start p-3 bg-[#131f24] border-2 border-[#37464f] rounded-xl hover:border-[#ff9600] transition-colors cursor-pointer">
                   <div className="w-5 h-5 rounded-full border-2 border-[#37464f] shrink-0" />
                   <span className="text-sm text-white font-bold leading-tight">
                    {task.title}
                  </span>
                </div>
              ))}
              
              {(!currentWeek || currentWeek.tasks.filter((t:any) => !t.completed).length === 0) && (
                <div className="flex flex-col items-center justify-center h-full text-center py-2">
                  <CheckCircle2 size={32} className="text-[#58cc02] mb-2 opacity-50" />
                  <p className="text-xs font-bold text-[#9ca3af] uppercase">Tudo feito!</p>
                </div>
              )}
            </div>

            <Button 
              className="w-full mt-6 bg-[#ff9600] text-[#3f2400] font-extrabold uppercase shadow-3d-orange hover:bg-[#ff9600] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none h-12 rounded-2xl border-b-0"
              onClick={onNavigateToWeekly}
            >
              Executar <ArrowRight size={20} className="ml-2" />
            </Button>
          </CardContent>
        </Card>

      </div>

      <div className="flex justify-center pt-8 pb-4">
        <button 
          onClick={onResetTutorial}
          className="flex items-center gap-2 text-xs font-bold text-[#37464f] hover:text-[#9ca3af] uppercase tracking-widest transition-colors"
        >
          <RefreshCw size={12} /> Reiniciar Tutorial
        </button>
      </div>

    </div>
  );
};