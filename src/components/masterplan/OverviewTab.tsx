"use client";

import { WeekData, MonthData, AreasData, AnnualData } from "@/hooks/useMasterplan";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Calendar, 
  ChevronRight, 
  Zap,
  TrendingUp,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewTabProps {
  activeWeeks: WeekData[];
  currentMonth: MonthData;
  areas: AreasData;
  onNavigateToWeekly: () => void;
  annualData: AnnualData;
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
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const currentMonthIndex = new Date().getMonth();
  const completedGoals = currentMonth.goals.filter(g => g.completed).length;
  const totalGoals = currentMonth.goals.length;

  // Calculate area stats
  const areaStats = [
    { id: 'work', label: 'Trabalho', items: areas.work },
    { id: 'studies', label: 'Estudos', items: areas.studies },
    { id: 'health', label: 'Saúde', items: areas.health },
    { id: 'personal', label: 'Pessoal', items: areas.personal },
  ].map(area => ({
    ...area,
    completed: area.items.filter(i => i.completed).length,
    total: area.items.length,
    percentage: area.items.length > 0 
      ? Math.round((area.items.filter(i => i.completed).length / area.items.length) * 100)
      : 0
  }));

  // Check if user is new (no annual goal set)
  const isNewUser = !annualData.goal || annualData.goal.trim() === "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Visão Geral</h1>
        <p className="text-neutral-400 text-sm">Seu progresso em um só lugar</p>
      </div>

      {/* Onboarding Card - Only shows for new users */}
      {isNewUser && (
        <Card className="bg-[#111111] border-l-4 border-l-[#E8251A] border-t-0 border-r-0 border-b-0 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E8251A] to-red-700 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Por onde começar?</h3>
                  <p className="text-sm text-neutral-400">Siga estes passos para configurar seu plano:</p>
                </div>
                
                <ol className="space-y-2 text-sm">
                  <li className="flex items-center gap-3 text-neutral-300">
                    <span className="w-6 h-6 rounded-full bg-[#E8251A]/20 text-[#E8251A] flex items-center justify-center text-xs font-bold">1</span>
                    Defina seu Objetivo Anual — a grande meta que guia tudo
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300">
                    <span className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center text-xs font-bold">2</span>
                    Preencha seus 4 Pilares — as áreas que você quer evoluir
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300">
                    <span className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center text-xs font-bold">3</span>
                    Crie as metas do mês atual
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300">
                    <span className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center text-xs font-bold">4</span>
                    Defina o foco da semana
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300">
                    <span className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center text-xs font-bold">5</span>
                    Adicione suas tarefas de hoje
                  </li>
                </ol>

                <Button 
                  onClick={() => document.querySelector('[data-value="annual"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}
                  className="bg-[#E8251A] hover:bg-red-700 text-white font-bold"
                >
                  Começar Agora
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Annual Goal Card */}
      <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-neutral-800/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Objetivo Anual</p>
              <h3 className="text-lg font-bold text-white">
                {annualData.goal || "Ainda não definido"}
              </h3>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Progresso</span>
              <span className="text-white font-semibold">{annualData.progress}%</span>
            </div>
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                style={{ width: `${annualData.progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Month Card */}
      <Card className="bg-[#0A0A0A] border-neutral-800/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8251A] to-red-700 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#E8251A] uppercase tracking-wider">Mês Atual</p>
                <h3 className="text-lg font-bold text-white">{monthNames[currentMonthIndex]}</h3>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="text-neutral-400 hover:text-white"
              onClick={() => document.querySelector('[data-value="execution"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}
            >
              Ver Metas do Mês
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {totalGoals === 0 ? (
            <div className="text-center py-6">
              <p className="text-neutral-500 text-sm">Nenhuma meta definida para este mês.</p>
              <p className="text-neutral-600 text-xs mt-1">Adicione suas metas na aba Execução.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentMonth.goals.slice(0, 3).map((goal) => (
                <div 
                  key={goal.id}
                  className="flex items-center gap-3"
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-600 flex-shrink-0" />
                  )}
                  <span className={cn(
                    "text-sm",
                    goal.completed ? "text-neutral-500 line-through" : "text-white"
                  )}>
                    {goal.text}
                  </span>
                </div>
              ))}
              {totalGoals > 3 && (
                <p className="text-xs text-neutral-500 pl-8">
                  +{totalGoals - 3} mais metas
                </p>
              )}
              <div className="pt-3 border-t border-neutral-800/50">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">{completedGoals} de {totalGoals} concluídas</span>
                  <span className="text-white font-semibold">
                    {totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Weeks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Semanas do Mês</h3>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-neutral-500 hover:text-white text-xs"
            onClick={onNavigateToWeekly}
          >
            Ver Tarefas da Semana
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>

        {activeWeeks.length === 0 ? (
          <Card className="bg-[#0A0A0A] border-neutral-800/50">
            <CardContent className="p-6 text-center">
              <p className="text-neutral-500 text-sm">Nenhuma semana ativa.</p>
              <p className="text-neutral-600 text-xs mt-1">Crie uma semana na aba Execução.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {activeWeeks.slice(0, 2).map((week) => {
              const weekCompleted = week.tasks.filter(t => t.completed).length;
              const weekTotal = week.tasks.length;
              const weekProgress = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

              return (
                <Card 
                  key={week.id}
                  className="bg-[#0A0A0A] border-neutral-800/50 hover:border-neutral-700 transition-colors cursor-pointer"
                  onClick={onNavigateToWeekly}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {new Date(week.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {new Date(week.endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {weekCompleted}/{weekTotal} tarefas concluídas
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-white">{weekProgress}%</span>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#E8251A] transition-all duration-500"
                        style={{ width: `${weekProgress}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Areas Overview */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Pilares</h3>
        <div className="grid grid-cols-2 gap-3">
          {areaStats.map((area) => (
            <Card 
              key={area.id}
              className="bg-[#0A0A0A] border-neutral-800/50"
            >
              <CardContent className="p-4">
                <p className="text-xs text-neutral-500 mb-1">{area.label}</p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-white">{area.percentage}%</span>
                  <span className="text-xs text-neutral-600">{area.completed}/{area.total}</span>
                </div>
                <div className="mt-2 h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#E8251A] to-red-500 transition-all duration-500"
                    style={{ width: `${area.percentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reset Tutorial Button */}
      <div className="pt-8 border-t border-neutral-800/30">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onResetTutorial}
          className="text-neutral-600 hover:text-neutral-400 text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-2" />
          Reiniciar Tutorial
        </Button>
      </div>
    </div>
  );
};