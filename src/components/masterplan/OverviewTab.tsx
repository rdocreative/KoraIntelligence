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

  // Helper para cores das áreas
  const getAreaConfig = (id: string) => {
    switch(id) {
      case 'work': return { color: 'text-blue-500', bg: 'bg-blue-500', icon: Briefcase, label: 'Trabalho' };
      case 'studies': return { color: 'text-violet-500', bg: 'bg-violet-500', icon: GraduationCap, label: 'Estudos' };
      case 'health': return { color: 'text-emerald-500', bg: 'bg-emerald-500', icon: Heart, label: 'Saúde' };
      case 'personal': return { color: 'text-amber-500', bg: 'bg-amber-500', icon: User, label: 'Pessoal' };
      default: return { color: 'text-primary', bg: 'bg-primary', icon: Target, label: 'Geral' };
    }
  };

  // Cálculo de progresso do mês
  const monthTotal = currentMonth?.goals.length || 0;
  const monthCompleted = currentMonth?.goals.filter((g: any) => g.completed).length || 0;
  const monthProgress = monthTotal === 0 ? 0 : (monthCompleted / monthTotal) * 100;
  const hasMonthGoals = monthTotal > 0;

  // Cálculo de progresso da semana
  const weekTotal = currentWeek?.tasks.length || 0;
  const weekCompleted = currentWeek?.tasks.filter((t: any) => t.completed).length || 0;
  const weekProgress = weekTotal === 0 ? 0 : (weekCompleted / weekTotal) * 100;

  // Common card styles
  const cardBaseStyle = "bg-[#161616] border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)]";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. CARD OBJETIVO ANUAL */}
      <Card className={`${cardBaseStyle} relative overflow-hidden group goal-card`}>
        <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
        
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Target size={16} />
                <span className="text-xs font-bold tracking-widest uppercase">Objetivo Anual</span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">{annualData.mainGoal || "Defina seu objetivo principal"}</h2>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-white">{Math.round(annualData.progress)}%</div>
              <span className="text-neutral-500 text-sm font-medium">Concluído</span>
            </div>
          </div>

          {/* Barra de Progresso Principal */}
          <div className="h-4 bg-neutral-800 rounded-full overflow-hidden mb-6 border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out relative"
              style={{ width: `${annualData.progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', transform: 'skewX(-20deg)' }}></div>
            </div>
          </div>

          {/* Breakdown dos 4 Pilares */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
            {analytics.areaStats.map((area: any) => {
              const config = getAreaConfig(area.id);
              const Icon = config.icon;
              return (
                <div key={area.id} className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-[#0A0A0A] border border-white/5 ${config.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-neutral-300 font-medium">{config.label}</span>
                      <span className={`${config.color} font-bold`}>{Math.round(area.percentage)}%</span>
                    </div>
                    <Progress value={area.percentage} className="h-1.5 bg-neutral-800" indicatorClassName={config.bg} />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2. GRID DE TEMPO (MÊS, SEMANA, HOJE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card Mês */}
        <Card className={`${cardBaseStyle} flex flex-col goal-card`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-bold text-neutral-200 uppercase tracking-wider">
                {currentMonth?.name || "Mês Atual"}
              </CardTitle>
              <Calendar size={16} className="text-neutral-500" />
            </div>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-white">{monthCompleted}</span>
              <span className="text-sm text-neutral-500 mb-1">de {monthTotal} metas</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-3 mt-2 flex-1">
              {currentMonth?.goals.slice(0, 3).map((goal: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${goal.completed ? 'bg-emerald-500' : 'bg-neutral-700'}`} />
                  <span className={`line-clamp-1 ${goal.completed ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}>
                    {goal.title}
                  </span>
                </div>
              ))}
              {(!hasMonthGoals) && (
                 <p className="text-sm text-neutral-600 italic">Sem metas definidas para este mês.</p>
              )}
            </div>
            
            {hasMonthGoals ? (
              <Button 
                variant="outline" 
                className="w-full mt-4 border-white/10 hover:bg-white/5 text-neutral-400 hover:text-white"
                onClick={onNavigateToWeekly}
              >
                Gerenciar Mês
              </Button>
            ) : (
              <Button 
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                onClick={onNavigateToWeekly}
              >
                + Definir metas do mês
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Card Semana */}
        <Card className={`${cardBaseStyle} flex flex-col mission-card`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-bold text-neutral-200 uppercase tracking-wider">
                Semana Ativa
              </CardTitle>
              <TrendingUp size={16} className="text-neutral-500" />
            </div>
            {currentWeek ? (
              <div className="flex flex-col mt-1">
                <span className="text-xs text-neutral-500">
                  {new Date(currentWeek.startDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})} - {new Date(currentWeek.endDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                </span>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-2xl font-bold text-white">{weekCompleted}</span>
                  <span className="text-sm text-neutral-500 mb-1">tarefas concluídas</span>
                </div>
              </div>
            ) : (
               <span className="text-sm text-neutral-500 mt-2 block">Nenhuma semana definida ainda.</span>
            )}
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            {currentWeek ? (
              <>
                <Progress value={weekProgress} className="h-2 bg-neutral-800 mb-4" />
                <Button 
                  variant="outline" 
                  className="w-full border-white/10 hover:bg-white/5 text-neutral-400 hover:text-white"
                  onClick={onNavigateToWeekly}
                >
                  Ver Tarefas
                </Button>
              </>
            ) : (
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 mt-4"
                onClick={onNavigateToWeekly}
              >
                + Criar Semana
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Card Hoje (Foco) */}
        <Card className={`${cardBaseStyle} ring-1 ring-primary/20 flex flex-col task-card`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                   <Target size={16} /> Foco de Hoje
                </Target>
                <p className="text-xs text-neutral-400 capitalize mt-1">{formattedDate}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-3 mt-2 flex-1">
              {currentWeek?.tasks.filter((t:any) => !t.completed).slice(0, 2).map((task: any, idx: number) => (
                <div key={idx} className="flex gap-3 items-start group">
                  <div className="mt-1 w-4 h-4 rounded border border-neutral-600 group-hover:border-primary transition-colors flex items-center justify-center">
                    <div className="w-2 h-2 rounded-[1px] bg-transparent group-hover:bg-primary/50 transition-colors" />
                  </div>
                  <span className="text-sm text-white font-medium line-clamp-2 leading-relaxed">
                    {task.title}
                  </span>
                </div>
              ))}
              
              {(!currentWeek || currentWeek.tasks.filter((t:any) => !t.completed).length === 0) && (
                <div className="flex flex-col items-center justify-center h-full text-center py-2">
                  <CheckCircle2 size={24} className="text-emerald-500 mb-2 opacity-50" />
                  <p className="text-xs text-neutral-500">Tudo feito por hoje!</p>
                </div>
              )}
            </div>

            <Button 
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg shadow-primary/20 group"
              onClick={onNavigateToWeekly}
            >
              Ir para Execução <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

      </div>

      <div className="flex justify-center pt-8 pb-4 opacity-0 hover:opacity-100 transition-opacity duration-500">
        <button 
          onClick={onResetTutorial}
          className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <RefreshCw size={10} /> Reiniciar Tutorial
        </button>
      </div>

    </div>
  );
};