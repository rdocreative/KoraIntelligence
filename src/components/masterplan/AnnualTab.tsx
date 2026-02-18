"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Target, BarChart3, TrendingUp, AlertTriangle, 
  Briefcase, GraduationCap, Heart, User, Plus, X, CheckCircle2, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend
} from 'recharts';

interface AnnualTabProps {
  data: any;
  analytics: any;
  updateAnnual: (data: any) => void;
  addAreaItem: (area: "work" | "studies" | "health" | "personal", text: string) => void;
  toggleAreaItem: (area: "work" | "studies" | "health" | "personal", id: string) => void;
  deleteAreaItem: (area: "work" | "studies" | "health" | "personal", id: string) => void;
}

const InfoTooltip = ({ text }: { text: string }) => (
  <TooltipProvider>
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button className="outline-none ml-2">
            <HelpCircle className="w-[14px] h-[14px] text-[#555] hover:text-[#E8251A] transition-colors" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-[#1A1A1A] border-[#333] text-[#AAAAAA] max-w-[220px] rounded-lg p-3 text-xs leading-relaxed">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Custom Tooltip for Charts
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-[#333] p-3 rounded-lg shadow-xl">
        <p className="text-xs font-bold text-white mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const AnnualTab = ({ 
  data, 
  analytics, 
  updateAnnual, 
  addAreaItem, 
  toggleAreaItem, 
  deleteAreaItem 
}: AnnualTabProps) => {

  const [newItemText, setNewItemText] = useState("");
  const [activeArea, setActiveArea] = useState<"work" | "studies" | "health" | "personal">("work");

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    addAreaItem(activeArea, newItemText);
    setNewItemText("");
  };

  const areas = [
    { 
      id: 'work' as const, 
      label: 'Trabalho', 
      icon: Briefcase, 
      items: data.areas.work,
      color: '#3B82F6', // Azul
      bg: 'rgba(59, 130, 246, 0.08)'
    },
    { 
      id: 'studies' as const, 
      label: 'Estudos', 
      icon: GraduationCap, 
      items: data.areas.studies,
      color: '#8B5CF6', // Roxo
      bg: 'rgba(139, 92, 246, 0.08)'
    },
    { 
      id: 'health' as const, 
      label: 'Saúde', 
      icon: Heart, 
      items: data.areas.health,
      color: '#10B981', // Verde
      bg: 'rgba(16, 185, 129, 0.08)'
    },
    { 
      id: 'personal' as const, 
      label: 'Pessoal', 
      icon: User, 
      items: data.areas.personal,
      color: '#F59E0B', // Âmbar
      bg: 'rgba(245, 158, 11, 0.08)'
    },
  ];

  const currentArea = areas.find(a => a.id === activeArea)!;

  // --- CHART DATA PREPARATION ---

  // 1. Distribution Data (Pie Chart)
  const distributionData = useMemo(() => {
    const totalCompleted = areas.reduce((acc, area) => acc + area.items.filter((i:any) => i.completed).length, 0);
    
    if (totalCompleted === 0) return [];

    return areas.map(area => ({
      name: area.label,
      value: area.items.filter((i:any) => i.completed).length,
      color: area.color,
      total: area.items.length
    })).filter(item => item.value > 0);
  }, [data.areas]);

  const totalCompletedGoals = distributionData.reduce((acc, curr) => acc + curr.value, 0);

  // 2. Evolution Data (Line Chart)
  const evolutionData = useMemo(() => {
    const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    
    // Calcular total de metas planejadas no ano (soma de todas as metas mensais existentes)
    const allMonthlyGoals = data.months.flatMap((m: any) => m.goals);
    const totalGoalsCount = allMonthlyGoals.length;

    if (totalGoalsCount === 0) {
        // Fallback para estado vazio ou projeção ideal apenas
        return months.map((m, i) => ({
            name: m,
            ideal: Math.round(((i + 1) / 12) * 100),
            real: 0
        }));
    }

    let accumulatedCompleted = 0;
    
    return months.map((monthName, index) => {
        // Encontrar o mês correspondente nos dados (assumindo que data.months está ordenado ou indexado corretamente)
        // Se data.months tiver menos itens ou estrutura diferente, ajustamos. 
        // Aqui assumo data.months[0] é Janeiro.
        const monthData = data.months[index];
        
        // Contar metas completas neste mês específico
        const completedInMonth = monthData ? monthData.goals.filter((g: any) => g.completed).length : 0;
        
        accumulatedCompleted += completedInMonth;

        // Calcular % acumulada em relação ao total do ano
        // Se não houver metas no totalGoalsCount, evitamos divisão por zero
        const realProgress = totalGoalsCount > 0 ? Math.round((accumulatedCompleted / totalGoalsCount) * 100) : 0;

        // Só mostramos o "real" até o mês atual para não desenhar linha zero no futuro
        const isFuture = index > new Date().getMonth();

        return {
            name: monthName,
            ideal: Math.round(((i: number) => (i + 1) / 12 * 100)(index)), // Ritmo linear ideal
            real: isFuture && realProgress === 0 && accumulatedCompleted === 0 ? null : realProgress // null interrompe a linha
        };
    });
  }, [data.months]);


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Analytics Hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#111111] border-white/5 md:col-span-2">
              <CardHeader>
                  <CardTitle className="flex items-center text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">
                      <BarChart3 className="w-4 h-4 mr-2" /> Status Geral do Ano
                      <InfoTooltip text="Porcentagem das suas metas anuais concluídas até agora." />
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex flex-col gap-6">
                      <div className="flex items-baseline justify-between">
                          <div>
                              <div className="text-4xl font-black text-white tracking-tighter mb-1">{analytics.yearProgress.toFixed(1)}%</div>
                              <div className="text-xs text-neutral-500 font-mono">do ano concluído</div>
                          </div>
                          <div className="text-right">
                              <div className={`text-xl font-bold ${analytics.statusColor}`}>{analytics.yearStatus}</div>
                              <div className="text-xs text-neutral-500">{analytics.statusMessage}</div>
                          </div>
                      </div>
                      
                      <div className="space-y-2">
                          <div className="flex justify-between text-xs text-neutral-400 font-bold uppercase tracking-wider">
                              <span>Progresso Meta Anual</span>
                              <span>{data.annual.progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                              <div className="h-full bg-[#E8251A] transition-all duration-1000" style={{ width: `${data.annual.progress}%` }} />
                          </div>
                      </div>
                  </div>
              </CardContent>
          </Card>

          <Card className="bg-[#111111] border-white/5">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">
                      <TrendingUp className="w-4 h-4" /> Estatísticas
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div>
                      <div className="text-xs text-neutral-500 mb-1">Taxa de Execução</div>
                      <div className="text-2xl font-bold text-white">{analytics.executionRate}%</div>
                  </div>
                  <div>
                      <div className="text-xs text-neutral-500 mb-1">Área Mais Forte</div>
                      <div className="text-sm font-bold text-green-500 uppercase tracking-wide">
                          {analytics.strongestArea?.label || "-"} ({Math.round(analytics.strongestArea?.percentage || 0)}%)
                      </div>
                  </div>
                  <div>
                      <div className="text-xs text-neutral-500 mb-1">Ponto de Atenção</div>
                      <div className="text-sm font-bold text-[#E8251A] uppercase tracking-wide">
                          {analytics.weakestArea?.label || "-"} ({Math.round(analytics.weakestArea?.percentage || 0)}%)
                      </div>
                  </div>
              </CardContent>
          </Card>
      </div>

      {/* NEW CHARTS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* GRAPH 1: PIE CHART (Distribution) */}
        <Card className="bg-[#111111] border-white/5">
            <CardHeader>
                <CardTitle className="flex items-center text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">
                    DISTRIBUIÇÃO DE ESFORÇO
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full relative">
                    {distributionData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={distributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {distributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-[#1A1A1A] border border-[#333] p-2 rounded shadow-xl text-xs">
                                                        <span style={{ color: data.color }} className="font-bold">{data.name}</span>
                                                        <span className="text-white ml-2">{data.value} metas</span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-white">{totalCompletedGoals}</span>
                                <span className="text-[10px] uppercase text-neutral-500 tracking-widest">Concluídas</span>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                             <div className="w-24 h-24 rounded-full border-4 border-neutral-800 mb-4" />
                             <p className="text-xs text-neutral-500 max-w-[180px]">Conclua metas para ver sua distribuição de esforço.</p>
                        </div>
                    )}
                </div>
                
                {/* Legend */}
                {distributionData.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {distributionData.map((item, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[10px] font-bold text-neutral-400 uppercase">{item.name}</span>
                                <span className="text-[10px] text-neutral-600 font-mono">
                                    {Math.round((item.value / totalCompletedGoals) * 100)}%
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>

        {/* GRAPH 2: LINE CHART (Evolution) */}
        <Card className="bg-[#111111] border-white/5">
            <CardHeader>
                <CardTitle className="flex items-center text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">
                    EVOLUÇÃO AO LONGO DO ANO
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full bg-[#0D0D0D] rounded-lg p-2 border border-white/5 relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="#444" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis 
                                stroke="#444" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <RechartsTooltip content={<CustomChartTooltip />} cursor={{ stroke: '#333', strokeWidth: 1 }} />
                            
                            {/* Reference Line (Time Elapsed / Ideal) */}
                            <Line 
                                type="monotone" 
                                dataKey="ideal" 
                                name="Tempo Decorrido"
                                stroke="#444" 
                                strokeWidth={2} 
                                strokeDasharray="4 4" 
                                dot={false}
                                activeDot={false}
                            />
                            
                            {/* Actual Progress Line */}
                            <Line 
                                type="monotone" 
                                dataKey="real" 
                                name="Progresso Real"
                                stroke="#E8251A" 
                                strokeWidth={2} 
                                dot={{ r: 3, fill: '#E8251A', strokeWidth: 0 }}
                                activeDot={{ r: 5, fill: '#fff', stroke: '#E8251A', strokeWidth: 2 }}
                                connectNulls={true}
                            />
                            <Legend 
                                verticalAlign="bottom" 
                                height={36} 
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                            />
                        </LineChart>
                     </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

      </div>

      {/* Main Annual Goal Editor */}
      <Card className="bg-[#111111] border-white/5">
          <CardHeader>
               <CardTitle className="flex items-center text-[11px] font-black uppercase tracking-[0.2em] text-[#E8251A]">
                   <Target className="w-4 h-4 mr-2" /> Objetivo Principal
                   <InfoTooltip text="É a sua grande meta do ano. Tudo que você faz aqui deve servir a esse objetivo." />
               </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Definição do Alvo</label>
                  <Input 
                      value={data.annual.objective}
                      onChange={(e) => updateAnnual({ objective: e.target.value })}
                      className="bg-[#0A0A0A] border-white/10 h-12 text-lg font-bold text-white"
                  />
              </div>
              <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Critério de Sucesso (KPIs)</label>
                  <Textarea 
                      value={data.annual.successCriteria}
                      onChange={(e) => updateAnnual({ successCriteria: e.target.value })}
                      className="bg-[#0A0A0A] border-white/10 min-h-[100px] text-neutral-300"
                  />
              </div>
          </CardContent>
      </Card>

      {/* Areas Editor */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {areas.map((area) => {
                  const isActive = activeArea === area.id;
                  return (
                      <button
                          key={area.id}
                          onClick={() => setActiveArea(area.id)}
                          className={cn(
                              "flex items-center gap-3 p-4 rounded-xl border transition-all min-w-[140px] md:min-w-0",
                              isActive 
                                  ? "shadow-lg" 
                                  : "bg-[#111111] border-white/5 text-neutral-500 hover:text-white"
                          )}
                          style={{
                              borderColor: isActive ? area.color : undefined,
                              borderWidth: isActive ? '2px' : '1px',
                              backgroundColor: isActive ? area.bg : undefined,
                          }}
                      >
                          <area.icon 
                            className="w-5 h-5 transition-opacity" 
                            style={{ color: area.color, opacity: isActive ? 1 : 0.4 }} 
                          />
                          <div className="text-left">
                              <div 
                                className="text-xs font-bold uppercase tracking-wide transition-opacity"
                                style={{ color: area.color, opacity: isActive ? 1 : 0.4 }}
                              >
                                {area.label}
                              </div>
                              <div className="text-[10px] opacity-70 text-neutral-400">{area.items.length} metas</div>
                          </div>
                      </button>
                  );
              })}
          </div>

          {/* Content */}
          <div className="md:col-span-3">
              <Card 
                className="bg-[#111111] min-h-[400px] transition-all duration-500"
                style={{ 
                    borderColor: currentArea.color, 
                    borderWidth: '2px',
                    backgroundColor: currentArea.bg 
                }}
              >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle 
                        className="text-lg font-bold uppercase tracking-tight flex items-center gap-2"
                        style={{ color: currentArea.color }}
                      >
                           {currentArea.label}
                           <InfoTooltip text="São as 4 áreas da sua vida. Cada pilar tem metas próprias que contribuem pro seu objetivo anual." />
                      </CardTitle>
                      <div className="text-xs text-neutral-500 font-mono">
                          {currentArea.items.filter((i:any) => i.completed).length}/{currentArea.items.length} Concluídas
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {/* Progress Bar specific to area */}
                      <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden mb-6">
                          <div 
                            className="h-full transition-all duration-700" 
                            style={{ 
                                width: `${currentArea.items.length > 0 ? (currentArea.items.filter((i:any) => i.completed).length / currentArea.items.length) * 100 : 0}%`,
                                backgroundColor: currentArea.color
                            }} 
                          />
                      </div>

                      <div className="flex gap-2">
                          <Input 
                              placeholder={`Adicionar meta para ${currentArea.label}...`}
                              value={newItemText}
                              onChange={(e) => setNewItemText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                              className="bg-black/40 border-white/10"
                          />
                          <Button onClick={handleAddItem} className="bg-[#E8251A] hover:bg-[#c91e14] shrink-0">
                              <Plus className="w-4 h-4" />
                          </Button>
                      </div>

                      <div className="space-y-2 mt-4">
                          {currentArea.items.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors group">
                                  <button 
                                      onClick={() => toggleAreaItem(currentArea.id, item.id)}
                                      className={cn(
                                          "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                          item.completed 
                                              ? "text-white" 
                                              : "border-neutral-700 text-transparent hover:border-white"
                                      )}
                                      style={{
                                          backgroundColor: item.completed ? currentArea.color : 'transparent',
                                          borderColor: item.completed ? currentArea.color : undefined
                                      }}
                                  >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>
                                  <span className={cn(
                                      "flex-1 text-sm font-medium",
                                      item.completed ? "text-neutral-600 line-through" : "text-neutral-200"
                                  )}>
                                      {item.text}
                                  </span>
                                  <button 
                                      onClick={() => deleteAreaItem(currentArea.id, item.id)}
                                      className="text-neutral-700 hover:text-[#E8251A] opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                      <X className="w-4 h-4" />
                                  </button>
                              </div>
                          ))}
                          {currentArea.items.length === 0 && (
                              <div className="text-center py-12 text-neutral-600 text-sm italic font-mono">
                                  Nenhuma meta definida para esta área.
                              </div>
                          )}
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
};