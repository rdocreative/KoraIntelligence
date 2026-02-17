import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Activity, BarChart3, Award, Briefcase, GraduationCap, Heart, User } from "lucide-react";
import { TaskItem } from "@/hooks/useMasterplan";

interface AnnualTabProps {
  data: any;
  analytics: any;
  updateAnnual: (data: any) => void;
  addAreaItem: (area: any, task: TaskItem) => void;
  toggleAreaItem: (area: any, id: string) => void;
  deleteAreaItem: (area: any, id: string) => void;
}

export const AnnualTab = ({ data, analytics }: AnnualTabProps) => {
  
  // Configuração dos pilares com ícones e cores
  const pillars = [
    { id: 'work', label: 'Trabalho', icon: Briefcase, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
    { id: 'studies', label: 'Estudos', icon: GraduationCap, color: 'text-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
    { id: 'health', label: 'Saúde', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' },
    { id: 'personal', label: 'Pessoal', icon: User, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20' },
  ];

  // Função para determinar a cor do heatmap baseado na porcentagem
  const getHeatmapColor = (percent: number, hasGoals: boolean) => {
    if (!hasGoals) return 'bg-neutral-900/50 border-white/5';
    if (percent === 100) return 'bg-green-500/40 border-green-500/30';
    if (percent >= 75) return 'bg-green-500/25 border-green-500/20';
    if (percent >= 50) return 'bg-yellow-500/25 border-yellow-500/20';
    if (percent >= 25) return 'bg-orange-500/25 border-orange-500/20';
    if (percent > 0) return 'bg-red-500/25 border-red-500/20';
    return 'bg-neutral-800/50 border-white/5';
  };

  return (
    <div className="space-y-8 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

      {/* LAYOUT PRINCIPAL: 2 COLUNAS */}
      <div className="grid lg:grid-cols-5 gap-6">
        
        {/* COLUNA ESQUERDA (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* CARD: PERFORMANCE GERAL */}
          <Card className="bg-[#0A0A0A] border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <Activity className="w-48 h-48 text-white" />
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase text-neutral-400 tracking-widest flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-red-500" /> Performance Geral do Ano
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-6xl font-black text-white tracking-tighter">{data.annual.progress}%</span>
                  <span className="text-neutral-500 font-medium ml-2">Concluído</span>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-black uppercase ${analytics.statusColor}`}>{analytics.yearStatus}</div>
                  <div className="text-xs text-neutral-500 font-medium">{analytics.statusMessage}</div>
                </div>
              </div>

              {/* Barra de Comparação */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-neutral-500 tracking-widest">
                  <span>Progresso Real</span>
                  <span>Tempo Decorrido ({Math.round(analytics.yearProgress)}%)</span>
                </div>
                <div className="h-3 bg-neutral-900 rounded-full overflow-hidden relative border border-white/5">
                  <div className="absolute top-0 left-0 h-full bg-white/10" style={{ width: `${analytics.yearProgress}%` }} />
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all duration-1000" style={{ width: `${data.annual.progress}%` }} />
                </div>
              </div>

              {/* KPIs Compactos */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                  <div className="text-2xl font-bold text-white">{analytics.totalTasks}</div>
                  <div className="text-[9px] uppercase text-neutral-500 font-bold tracking-wider">Total</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                  <div className="text-2xl font-bold text-white">{analytics.completedTasks}</div>
                  <div className="text-[9px] uppercase text-neutral-500 font-bold tracking-wider">Feitas</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                  <div className="text-2xl font-bold text-white">{analytics.executionRate}%</div>
                  <div className="text-[9px] uppercase text-neutral-500 font-bold tracking-wider">Taxa</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HEATMAP DE CONSISTÊNCIA */}
          <Card className="bg-[#0A0A0A] border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase text-neutral-400 tracking-widest">
                Consistência Mensal
              </CardTitle>
              <p className="text-xs text-neutral-600 mt-1">Visualize sua performance ao longo do ano</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {data.months.map((month: any, idx: number) => {
                  const completed = month.goals.filter((g: any) => g.completed).length;
                  const total = month.goals.length;
                  const percent = total === 0 ? 0 : (completed / total) * 100;
                  const hasGoals = total > 0;
                  const colorClass = getHeatmapColor(percent, hasGoals);

                  return (
                    <div 
                      key={idx} 
                      className={`aspect-square rounded-lg border ${colorClass} flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 cursor-default group relative`}
                      title={`${month.name}: ${completed}/${total} metas (${Math.round(percent)}%)`}
                    >
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        {month.name.substring(0, 3)}
                      </span>
                      <span className={`text-lg font-black ${hasGoals && percent > 0 ? 'text-white' : 'text-neutral-600'}`}>
                        {hasGoals ? Math.round(percent) : '—'}
                      </span>
                      
                      {/* Tooltip on hover */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 rounded px-2 py-1 text-[9px] text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {completed}/{total} metas
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Legenda do Heatmap */}
              <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-white/5">
                <span className="text-[9px] text-neutral-600 uppercase tracking-wider">Menos</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded bg-neutral-800/50 border border-white/5" />
                  <div className="w-4 h-4 rounded bg-red-500/25 border border-red-500/20" />
                  <div className="w-4 h-4 rounded bg-orange-500/25 border border-orange-500/20" />
                  <div className="w-4 h-4 rounded bg-yellow-500/25 border border-yellow-500/20" />
                  <div className="w-4 h-4 rounded bg-green-500/25 border border-green-500/20" />
                  <div className="w-4 h-4 rounded bg-green-500/40 border border-green-500/30" />
                </div>
                <span className="text-[9px] text-neutral-600 uppercase tracking-wider">Mais</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUNA DIREITA (2/5) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CARD: ÁREA DE DESTAQUE */}
          <Card className="bg-[#0A0A0A] border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase text-neutral-400 tracking-widest">
                Área de Destaque
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <Award className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-white uppercase">{analytics.strongestArea.label}</div>
                <div className="text-sm text-neutral-400">{Math.round(analytics.strongestArea.percentage)}% de Conclusão</div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl text-xs text-neutral-400 leading-relaxed border border-white/5">
                Você tem mostrado grande consistência em <span className="text-white font-medium">{analytics.strongestArea.label}</span>. Mantenha o foco!
              </div>
            </CardContent>
          </Card>

          {/* GRID 2x2: PILARES COMPACTOS */}
          <div className="grid grid-cols-2 gap-3">
            {pillars.map((pillar) => {
              const areaStat = analytics.areaStats.find((a: any) => a.id === pillar.id);
              const percentage = areaStat ? Math.round(areaStat.percentage) : 0;
              
              return (
                <Card 
                  key={pillar.id} 
                  className={`bg-[#0A0A0A] border-white/5 hover:${pillar.borderColor} transition-all duration-300 group`}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                    <div className={`p-3 rounded-xl ${pillar.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <pillar.icon className={`w-5 h-5 ${pillar.color}`} />
                    </div>
                    <div>
                      <span className={`text-2xl font-black text-white`}>{percentage}%</span>
                      <span className="block text-[9px] uppercase text-neutral-500 font-bold tracking-wider mt-0.5">
                        {pillar.label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* MINI STATS */}
          <Card className="bg-[#0A0A0A] border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-xl font-bold text-white">{data.weeks.length}</div>
                  <div className="text-[9px] uppercase text-neutral-500 font-bold">Sprints</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center flex-1">
                  <div className="text-xl font-bold text-white">
                    {data.months.filter((m: any) => m.goals.length > 0).length}
                  </div>
                  <div className="text-[9px] uppercase text-neutral-500 font-bold">Meses Ativos</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center flex-1">
                  <div className="text-xl font-bold text-white">
                    {Math.round(analytics.yearProgress)}%
                  </div>
                  <div className="text-[9px] uppercase text-neutral-500 font-bold">Ano Passado</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};