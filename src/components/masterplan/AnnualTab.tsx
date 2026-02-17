import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Activity, BarChart3, Award, Briefcase, GraduationCap, Heart, User, TrendingUp } from "lucide-react";
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
  
  // Helper para ícones dos pilares
  const getPillarIcon = (id: string) => {
    switch(id) {
      case 'work': return Briefcase;
      case 'studies': return GraduationCap;
      case 'health': return Heart;
      case 'personal': return User;
      default: return Activity;
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

      {/* COLUNA ESQUERDA (2/3) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* 1. PERFORMANCE GERAL */}
        <Card className="bg-[#0A0A0A] border-white/10 relative overflow-hidden h-[320px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><Activity className="w-64 h-64 text-white" /></div>
          
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase text-neutral-500 tracking-[0.2em] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-red-500" /> Performance Anual
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8 relative z-10">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-7xl font-black text-white tracking-tighter">{data.annual.progress}%</span>
                <span className="text-neutral-500 font-bold ml-2 text-sm uppercase tracking-widest">Concluído</span>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-black uppercase ${analytics.statusColor}`}>{analytics.yearStatus}</div>
                <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">{analytics.statusMessage}</div>
              </div>
            </div>

            {/* Comparison Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] uppercase font-bold text-neutral-500 tracking-widest">
                <span>Progresso Real</span>
                <span>Tempo ({Math.round(analytics.yearProgress)}%)</span>
              </div>
              <div className="h-3 bg-neutral-900 rounded-full overflow-hidden relative border border-white/5">
                {/* Time Progress (Background Bar) */}
                <div className="absolute top-0 left-0 h-full bg-white/5 w-full border-r border-white/10" style={{ width: `${analytics.yearProgress}%` }} />
                {/* User Progress (Foreground Bar) */}
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-800 via-red-600 to-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-1000" style={{ width: `${data.annual.progress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
              <div className="text-center">
                 <div className="text-xl font-bold text-white">{analytics.totalTasks}</div>
                 <div className="text-[9px] uppercase text-neutral-600 font-bold tracking-wider">Metas Totais</div>
              </div>
              <div className="text-center border-l border-white/5">
                 <div className="text-xl font-bold text-white">{analytics.completedTasks}</div>
                 <div className="text-[9px] uppercase text-neutral-600 font-bold tracking-wider">Concluídas</div>
              </div>
              <div className="text-center border-l border-white/5">
                 <div className="text-xl font-bold text-white">{analytics.executionRate}%</div>
                 <div className="text-[9px] uppercase text-neutral-600 font-bold tracking-wider">Taxa Execução</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. HEATMAP DE CONSISTÊNCIA (GitHub Style) */}
        <Card className="bg-[#0A0A0A] border-white/10 p-6">
           <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-4 h-4 text-neutral-500" />
              <Label className="text-xs font-bold uppercase text-neutral-500 tracking-[0.2em]">Mapa de Consistência</Label>
           </div>
           
           <div className="flex flex-wrap gap-2 justify-between">
              {data.months.map((month: any, idx: number) => {
                const completed = month.goals.filter((g: any) => g.completed).length;
                const total = month.goals.length;
                const percent = total === 0 ? 0 : (completed / total) * 100;
                
                // Color logic based on intensity
                let bgClass = "bg-neutral-900 border-white/5";
                if (total > 0) {
                    if (percent === 100) bgClass = "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)] border-green-400";
                    else if (percent >= 75) bgClass = "bg-green-700 border-green-600";
                    else if (percent >= 50) bgClass = "bg-green-900 border-green-800";
                    else if (percent > 0) bgClass = "bg-neutral-800 border-neutral-700";
                }

                return (
                  <div key={idx} className="group relative flex flex-col gap-1 items-center flex-1 min-w-[30px]">
                      <div className={`w-full aspect-square rounded-md border ${bgClass} transition-all duration-300 hover:scale-110`} />
                      <span className="text-[9px] font-bold text-neutral-600 uppercase mt-1 group-hover:text-white transition-colors">
                        {month.name.substring(0, 3)}
                      </span>
                      
                      {/* Tooltip simple */}
                      <div className="absolute bottom-full mb-2 bg-neutral-900 text-white text-[10px] px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                         {Math.round(percent)}% Concluído
                      </div>
                  </div>
                );
              })}
           </div>
        </Card>
      </div>

      {/* COLUNA DIREITA (1/3) */}
      <div className="space-y-6">
        
        {/* 3. ÁREA DE DESTAQUE */}
        <Card className="bg-gradient-to-br from-[#0E0E0E] to-black border-white/10 flex flex-col items-center justify-center p-6 text-center h-[200px] relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 blur-3xl opacity-20" />
          <div className="relative z-10 space-y-3">
             <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.15)] animate-pulse">
                <Award className="w-8 h-8 text-green-500" />
             </div>
             <div>
                <Label className="text-[10px] font-bold uppercase text-neutral-500 tracking-widest">Melhor Desempenho</Label>
                <div className="text-xl font-black text-white uppercase mt-1">{analytics.strongestArea.label}</div>
             </div>
          </div>
        </Card>

        {/* 4. PILARES (GRID COMPACTO 2x2) */}
        <div className="grid grid-cols-2 gap-4 h-[340px]">
          {analytics.areaStats.map((area: any) => {
            const Icon = getPillarIcon(area.id);
            return (
                <Card key={area.id} className="bg-[#0A0A0A] border-white/5 hover:border-white/20 transition-all duration-300 group flex flex-col items-center justify-center gap-3">
                  <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors ${area.color}`}>
                     <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                     <span className="block text-3xl font-black text-white">{Math.round(area.percentage)}%</span>
                     <span className="text-[9px] font-bold uppercase text-neutral-600 tracking-wider group-hover:text-neutral-400 transition-colors">{area.label}</span>
                  </div>
                </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
};