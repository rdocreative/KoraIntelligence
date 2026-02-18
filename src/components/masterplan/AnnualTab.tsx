import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Activity, BarChart3, Award, Target, LayoutDashboard, Briefcase, GraduationCap, Heart, User } from "lucide-react";
import { TaskList } from "@/components/masterplan/TaskList";
import { TaskItem } from "@/hooks/useMasterplan";

interface AnnualTabProps {
  data: any;
  analytics: any;
  updateAnnual: (data: any) => void;
  addAreaItem: (area: any, task: TaskItem) => void;
  toggleAreaItem: (area: any, id: string) => void;
  deleteAreaItem: (area: any, id: string) => void;
}

export const AnnualTab = ({ data, analytics, updateAnnual, addAreaItem, toggleAreaItem, deleteAreaItem }: AnnualTabProps) => {
  
  // Helper para ícones
  const getIcon = (id: string) => {
    switch(id) {
      case 'work': return Briefcase;
      case 'studies': return GraduationCap;
      case 'health': return Heart;
      case 'personal': return User;
      default: return Target;
    }
  };

  return (
    <div className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

      {/* 1. STATUS GERAL */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-[#0A0A0A] border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Activity className="w-48 h-48 text-white" /></div>
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase text-white flex items-center gap-3">
              <BarChart3 className="text-red-500" /> Performance Geral do Ano
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 relative z-10">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-6xl font-black text-white tracking-tighter">{data.annual.progress}%</span>
                <span className="text-neutral-500 font-bold ml-2">Concluído</span>
              </div>
              <div className="text-right">
                <div className={`text-xl font-black uppercase ${analytics.statusColor}`}>{analytics.yearStatus}</div>
                <div className="text-xs text-neutral-400 font-medium">{analytics.statusMessage}</div>
              </div>
            </div>

            {/* Comparison Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-bold text-neutral-500 tracking-widest">
                <span>Progresso Real</span>
                <span>Tempo Decorrido ({Math.round(analytics.yearProgress)}%)</span>
              </div>
              <div className="h-4 bg-neutral-900 rounded-full overflow-hidden relative border border-white/5">
                {/* Time Progress (Background Bar) */}
                <div className="absolute top-0 left-0 h-full bg-white/10 w-full" style={{ width: `${analytics.yearProgress}%` }} />
                {/* User Progress (Foreground Bar) */}
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all duration-1000" style={{ width: `${data.annual.progress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <div className="text-2xl font-bold text-white">{analytics.totalTasks}</div>
                <div className="text-[10px] uppercase text-neutral-500 font-bold">Total Tarefas</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <div className="text-2xl font-bold text-white">{analytics.completedTasks}</div>
                <div className="text-[10px] uppercase text-neutral-500 font-bold">Concluídas</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <div className="text-2xl font-bold text-white">{analytics.executionRate}%</div>
                <div className="text-[10px] uppercase text-neutral-500 font-bold">Taxa Execução</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI CARD: Strongest Area */}
        <Card className="bg-[#0A0A0A] border-white/10 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase text-neutral-500 tracking-widest">Área de Destaque</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
              <Award className="w-10 h-10 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-white uppercase">{analytics.strongestArea.label}</div>
              <div className="text-sm text-neutral-400">{Math.round(analytics.strongestArea.percentage)}% de Conclusão</div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl text-xs text-neutral-300">
              "Você tem mostrado grande consistência em {analytics.strongestArea.label}. Mantenha o foco!"
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. ÁREAS DETALHADAS COM METAS ESTRATÉGICAS */}
      <div className="space-y-4">
        <Label className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em] pl-1">Progresso por Pilar</Label>
        <div className="grid lg:grid-cols-2 gap-6">
          {analytics.areaStats.map((area: any) => {
            const Icon = getIcon(area.id);
            const areaItems = (data.areas as any)[area.id] || [];

            return (
              <Card key={area.id} className="bg-[#0A0A0A] border-white/5 hover:border-white/20 transition-all duration-300 group flex flex-col h-full">
                <CardContent className="pt-6 space-y-6 flex-1 flex flex-col">
                  {/* Header do Card */}
                  <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-white/5 ${area.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-sm font-black uppercase tracking-wider ${area.color}`}>{area.label}</span>
                        </div>
                        <span className="text-2xl font-black text-white">{Math.round(area.percentage)}%</span>
                      </div>
                      <Progress value={area.percentage} className="h-1.5 bg-neutral-900" indicatorClassName={`${area.barColor} transition-all duration-1000`} />
                  </div>
                  
                  {/* Lista de Metas Estratégicas */}
                  <div className="flex-1 space-y-3 pt-2">
                     <div className="flex items-center gap-2 mb-2 opacity-50">
                        <div className="h-px bg-white/20 flex-1" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white">Metas Estratégicas</span>
                        <div className="h-px bg-white/20 flex-1" />
                     </div>
                     
                     <div className="bg-[#050505] rounded-xl border border-white/5 p-1">
                        <TaskList
                          items={areaItems}
                          onAdd={(text) => addAreaItem(area.id, { id: Date.now().toString(), text, completed: false })}
                          onToggle={(id) => toggleAreaItem(area.id, id)}
                          onDelete={(id) => deleteAreaItem(area.id, id)}
                          placeholder={`Adicionar meta em ${area.label}...`}
                        />
                     </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 3. MAPA DE CALOR MENSAL */}
      <div className="space-y-4">
        <Label className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em] pl-1">Consistência Mensal</Label>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {data.months.map((month: any, idx: number) => {
            const completed = month.goals.filter((g: any) => g.completed).length;
            const total = month.goals.length;
            const percent = total === 0 ? 0 : (completed / total) * 100;

            let bgClass = "bg-[#0E0E0E] border-white/5";
            let textClass = "text-neutral-500";

            if (total > 0) {
              if (percent === 100) { bgClass = "bg-green-950/20 border-green-500/30"; textClass = "text-green-500"; }
              else if (percent >= 50) { bgClass = "bg-yellow-950/20 border-yellow-500/30"; textClass = "text-yellow-500"; }
              else if (percent > 0) { bgClass = "bg-red-950/20 border-red-500/30"; textClass = "text-red-500"; }
            }

            return (
              <div key={idx} className={`p-4 rounded-xl border ${bgClass} transition-all duration-300 flex flex-col justify-between h-24`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${textClass}`}>{month.name.substring(0, 3)}</span>
                <div className="space-y-1">
                  <div className="text-xl font-black text-white">{Math.round(percent)}%</div>
                  <div className="text-[10px] text-neutral-600">{completed}/{total} Metas</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. OBJETIVO & CONFIGS */}
      <div className="grid lg:grid-cols-1 gap-10 border-t border-white/5 pt-10">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Target className="text-red-500 w-5 h-5" />
            <Label className="text-white font-bold uppercase tracking-widest text-sm">Objetivo Central</Label>
          </div>
          <div className="space-y-4">
            <Input
              value={data.annual.objective}
              onChange={(e) => updateAnnual({ objective: e.target.value })}
              className="text-2xl md:text-3xl font-black bg-transparent border-none border-b border-white/10 rounded-none focus-visible:ring-0 px-0 h-auto py-2 placeholder:text-neutral-800 text-white transition-all focus:border-red-500"
              placeholder="Defina seu objetivo..."
            />
            <Textarea
              value={data.annual.successCriteria}
              onChange={(e) => updateAnnual({ successCriteria: e.target.value })}
              className="bg-[#0E0E0E] border-white/10 resize-none h-32 text-sm transition-all focus:ring-1 focus:ring-red-500/20 p-4 leading-relaxed"
              placeholder="Critérios de sucesso..."
            />
          </div>
        </div>
      </div>

    </div>
  );
};