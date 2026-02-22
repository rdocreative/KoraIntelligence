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
  RefreshCw
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

  const getAreaConfig = (id: string) => {
    switch(id) {
      case 'work': return { color: 'text-card-blue', bg: 'bg-card-blue', border: 'border-card-blue', icon: Briefcase, label: 'Trabalho' };
      case 'studies': return { color: 'text-card-purple', bg: 'bg-card-purple', border: 'border-card-purple', icon: GraduationCap, label: 'Estudos' };
      case 'health': return { color: 'text-card-green', bg: 'bg-card-green', border: 'border-card-green', icon: Heart, label: 'Saúde' };
      case 'personal': return { color: 'text-card-orange', bg: 'bg-card-orange', border: 'border-card-orange', icon: User, label: 'Pessoal' };
      default: return { color: 'text-white', bg: 'bg-white', border: 'border-white', icon: Target, label: 'Geral' };
    }
  };

  const monthTotal = currentMonth?.goals.length || 0;
  const monthCompleted = currentMonth?.goals.filter((g: any) => g.completed).length || 0;
  const hasMonthGoals = monthTotal > 0;

  const weekTotal = currentWeek?.tasks.length || 0;
  const weekCompleted = currentWeek?.tasks.filter((t: any) => t.completed).length || 0;
  const weekProgress = weekTotal === 0 ? 0 : (weekCompleted / weekTotal) * 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. CARD OBJETIVO ANUAL */}
      <div className="panel overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-32 bg-card-red/5 rounded-full blur-3xl group-hover:bg-card-red/10 transition-colors duration-500" />
        
        <div className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-card-red mb-1 font-extrabold uppercase tracking-widest text-xs">
                <Target size={16} />
                <span>Objetivo Anual</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">{annualData.mainGoal || "Defina seu objetivo principal"}</h2>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-card-red drop-shadow-sm">{Math.round(annualData.progress)}%</div>
            </div>
          </div>

          {/* Barra de Progresso Principal */}
          <div className="h-6 bg-duo-sidebar rounded-full overflow-hidden mb-8 border-2 border-duo-sidebar">
            <div 
              className="h-full bg-card-red transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,75,75,0.4)]"
              style={{ width: `${annualData.progress}%` }}
            />
          </div>

          {/* Breakdown dos 4 Pilares */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t-2 border-duo-gray">
            {analytics.areaStats.map((area: any) => {
              const config = getAreaConfig(area.id);
              const Icon = config.icon;
              return (
                <div key={area.id} className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border-2 bg-duo-sidebar ${config.border} ${config.color}`}>
                    <Icon size={18} strokeWidth={3} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] font-bold uppercase mb-1.5">
                      <span className="text-gray-400">{config.label}</span>
                      <span className={`${config.color}`}>{Math.round(area.percentage)}%</span>
                    </div>
                    <div className="h-2.5 bg-duo-sidebar rounded-full border border-duo-gray overflow-hidden">
                       <div className={`h-full ${config.bg}`} style={{ width: `${area.percentage}%` }}/>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 2. GRID DE PILARES (4 CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.areaStats.map((area: any) => {
          const config = getAreaConfig(area.id);
          const Icon = config.icon;
          const areaItems = areas[area.id] || [];
          const firstItem = areaItems.find((i: any) => !i.completed) || areaItems[0];
          const hasItem = !!firstItem;

          return (
            <div key={area.id} className="panel p-5 flex flex-col h-full justify-between gap-4 hover:border-white/30 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl border-2 bg-duo-sidebar ${config.border} ${config.color} shadow-sm`}>
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <Badge variant="outline" className="border-2 border-duo-gray bg-duo-sidebar text-gray-400 font-extrabold text-xs">
                    {area.completed}/{area.total}
                  </Badge>
                </div>
                
                <h3 className={`font-extrabold text-xl mb-3 uppercase ${config.color}`}>{config.label}</h3>
                
                <div className="min-h-[3rem] p-3 rounded-xl bg-duo-sidebar border-2 border-duo-gray">
                  {hasItem ? (
                    <p className="text-xs font-bold text-gray-300 leading-relaxed line-clamp-2">
                       {firstItem.title}
                    </p>
                  ) : (
                     <p className="text-xs text-gray-600 font-bold italic">
                      Sem meta definida
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 3. GRID DE TEMPO (MÊS, SEMANA, HOJE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card Mês */}
        <div className="panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-extrabold text-white uppercase tracking-wide">
              {currentMonth?.name || "Mês Atual"}
            </h3>
            <Calendar size={20} className="text-gray-500" />
          </div>
          
          <div className="flex items-end gap-2 mb-6">
            <span className="text-4xl font-black text-card-purple">{monthCompleted}</span>
            <span className="text-sm font-bold text-gray-500 mb-1.5 uppercase">de {monthTotal} metas</span>
          </div>

          <div className="flex-1 flex flex-col justify-end">
            <Button 
              className="w-full btn-secondary h-12 border-2 border-duo-gray hover:border-white/20"
              onClick={onNavigateToWeekly}
            >
              {hasMonthGoals ? "Gerenciar Mês" : "Definir Metas"}
            </Button>
          </div>
        </div>

        {/* Card Semana */}
        <div className="panel p-6 flex flex-col">
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-extrabold text-white uppercase tracking-wide">
              Semana Ativa
            </h3>
            <TrendingUp size={20} className="text-gray-500" />
          </div>

          <div className="flex-1">
             {currentWeek ? (
              <div className="flex flex-col gap-4">
                 <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Progresso</span>
                    <div className="flex items-end gap-2 mt-1">
                       <span className="text-4xl font-black text-card-orange">{weekCompleted}</span>
                       <span className="text-sm font-bold text-gray-500 mb-1.5 uppercase">Concluídas</span>
                    </div>
                 </div>
                 <div className="h-4 bg-duo-sidebar rounded-full border-2 border-duo-sidebar overflow-hidden">
                    <div className="h-full bg-card-orange w-full" style={{ width: `${weekProgress}%` }} />
                 </div>
              </div>
             ) : (
                <div className="h-full flex items-center justify-center text-center">
                   <p className="text-gray-600 font-bold uppercase">Nenhuma semana</p>
                </div>
             )}
          </div>

          <div className="mt-6">
             <Button 
                className="w-full btn-secondary h-12"
                onClick={onNavigateToWeekly}
             >
                {currentWeek ? "Ver Tarefas" : "Criar Semana"}
             </Button>
          </div>
        </div>

        {/* Card Hoje (Foco) */}
        <div className="panel p-6 flex flex-col border-card-red shadow-3d-red">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
               <Target size={20} className="text-white" /> Foco de Hoje
            </h3>
          </div>

          <div className="flex-1 space-y-3">
             {currentWeek?.tasks.filter((t:any) => !t.completed).slice(0, 2).map((task: any, idx: number) => (
                <div key={idx} className="bg-card-red/20 border-2 border-card-red/40 p-3 rounded-xl flex items-start gap-3">
                   <div className="w-5 h-5 rounded border-2 border-card-red shrink-0 mt-0.5" />
                   <span className="text-sm font-bold text-white line-clamp-2">{task.title}</span>
                </div>
             ))}
             {(!currentWeek || currentWeek.tasks.filter((t:any) => !t.completed).length === 0) && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                   <CheckCircle2 size={32} className="text-white mb-2" />
                   <p className="text-sm font-bold uppercase">Tudo feito!</p>
                </div>
             )}
          </div>

          <Button 
            className="w-full mt-6 bg-white text-card-red font-extrabold uppercase h-12 rounded-xl shadow-none hover:bg-gray-200 border-none"
            onClick={onNavigateToWeekly}
          >
            Ir para Execução <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>

      </div>

      <div className="flex justify-center pt-4 opacity-50 hover:opacity-100 transition-opacity">
        <button 
          onClick={onResetTutorial}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
        >
          <RefreshCw size={12} /> Reiniciar Tutorial
        </button>
      </div>

    </div>
  );
};