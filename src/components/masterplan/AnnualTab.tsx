"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Target, BarChart3, TrendingUp, 
  Briefcase, GraduationCap, Heart, User, Plus, X, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip
} from 'recharts';

interface AnnualTabProps {
  data: any;
  analytics: any;
  updateAnnual: (data: any) => void;
  addAreaItem: (area: "work" | "studies" | "health" | "personal", text: string) => void;
  toggleAreaItem: (area: "work" | "studies" | "health" | "personal", id: string) => void;
  deleteAreaItem: (area: "work" | "studies" | "health" | "personal", id: string) => void;
}

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
    { id: 'work', label: 'Trabalho', icon: Briefcase, items: data.areas.work, color: '#1cb0f6' },
    { id: 'studies', label: 'Estudos', icon: GraduationCap, items: data.areas.studies, color: '#ce82ff' },
    { id: 'health', label: 'Saúde', icon: Heart, items: data.areas.health, color: '#58cc02' },
    { id: 'personal', label: 'Pessoal', icon: User, items: data.areas.personal, color: '#ff9600' },
  ];

  const currentArea = areas.find(a => a.id === activeArea)!;

  const distributionData = useMemo(() => {
    const totalCompleted = areas.reduce((acc, area) => acc + area.items.filter((i:any) => i.completed).length, 0);
    if (totalCompleted === 0) return [];
    return areas.map(area => ({
      name: area.label,
      value: area.items.filter((i:any) => i.completed).length,
      color: area.color,
    })).filter(item => item.value > 0);
  }, [data.areas]);

  const evolutionData = useMemo(() => {
    const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const allMonthlyGoals = data.months.flatMap((m: any) => m.goals);
    const totalGoalsCount = allMonthlyGoals.length;

    if (totalGoalsCount === 0) {
        return months.map((m, i) => ({
            name: m,
            ideal: Math.round(((i + 1) / 12) * 100),
            real: 0
        }));
    }

    let accumulatedCompleted = 0;
    return months.map((monthName, index) => {
        const monthData = data.months[index];
        const completedInMonth = monthData ? monthData.goals.filter((g: any) => g.completed).length : 0;
        accumulatedCompleted += completedInMonth;
        const realProgress = totalGoalsCount > 0 ? Math.round((accumulatedCompleted / totalGoalsCount) * 100) : 0;
        const isFuture = index > new Date().getMonth();

        return {
            name: monthName,
            ideal: Math.round(((i: number) => (i + 1) / 12 * 100)(index)),
            real: isFuture && realProgress === 0 && accumulatedCompleted === 0 ? null : realProgress
        };
    });
  }, [data.months]);


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Analytics Hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="panel p-6 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-duo-primary" />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Status Geral</h3>
              </div>
              
              <div className="flex flex-col gap-6">
                  <div className="flex items-baseline justify-between">
                      <div>
                          <div className="text-5xl font-black text-white tracking-tighter mb-1">{analytics.yearProgress.toFixed(1)}%</div>
                          <div className="text-xs text-gray-400 font-bold uppercase">do ano concluído</div>
                      </div>
                      <div className="text-right">
                          <div className={`text-xl font-black ${analytics.statusColor === 'text-white' ? 'text-white' : analytics.statusColor}`}>{analytics.yearStatus}</div>
                          <div className="text-xs text-gray-500 font-bold uppercase">{analytics.statusMessage}</div>
                      </div>
                  </div>
                  
                  <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400 font-black uppercase tracking-wider">
                          <span>Progresso Meta Anual</span>
                          <span>{data.annual.progress}%</span>
                      </div>
                      <div className="h-4 bg-duo-sidebar rounded-full border-2 border-duo-sidebar overflow-hidden">
                          <div className="h-full bg-card-red transition-all duration-1000" style={{ width: `${data.annual.progress}%` }} />
                      </div>
                  </div>
              </div>
          </div>

          <div className="panel p-6">
              <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-card-green" />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Estatísticas</h3>
              </div>
              <div className="space-y-6">
                  <div>
                      <div className="text-xs text-gray-500 font-bold uppercase mb-1">Taxa de Execução</div>
                      <div className="text-3xl font-black text-white">{analytics.executionRate}%</div>
                  </div>
                  <div>
                      <div className="text-xs text-gray-500 font-bold uppercase mb-1">Área Mais Forte</div>
                      <div className="text-sm font-black text-card-green uppercase tracking-wide">
                          {analytics.strongestArea?.label || "-"} ({Math.round(analytics.strongestArea?.percentage || 0)}%)
                      </div>
                  </div>
                  <div>
                      <div className="text-xs text-gray-500 font-bold uppercase mb-1">Ponto de Atenção</div>
                      <div className="text-sm font-black text-card-red uppercase tracking-wide">
                          {analytics.weakestArea?.label || "-"} ({Math.round(analytics.weakestArea?.percentage || 0)}%)
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Main Annual Goal Editor */}
      <div className="panel p-6">
          <div className="flex items-center gap-2 mb-6 text-card-red">
               <Target className="w-5 h-5" />
               <h3 className="text-sm font-black uppercase tracking-[0.2em]">Objetivo Principal</h3>
          </div>
          <div className="space-y-6">
              <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Definição do Alvo</label>
                  <Input 
                      value={data.annual.objective}
                      onChange={(e) => updateAnnual({ objective: e.target.value })}
                      className="bg-duo-sidebar border-2 border-duo-gray h-14 text-lg font-bold text-white rounded-xl focus:border-card-red focus:ring-0"
                  />
              </div>
              <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Critério de Sucesso (KPIs)</label>
                  <Textarea 
                      value={data.annual.successCriteria}
                      onChange={(e) => updateAnnual({ successCriteria: e.target.value })}
                      className="bg-duo-sidebar border-2 border-duo-gray min-h-[100px] text-gray-300 font-medium rounded-xl focus:border-card-red focus:ring-0"
                  />
              </div>
          </div>
      </div>

      {/* Areas Editor */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {areas.map((area) => {
                  const isActive = activeArea === area.id;
                  return (
                      <button
                          key={area.id}
                          onClick={() => setActiveArea(area.id as any)}
                          className={cn(
                              "flex items-center gap-3 p-4 rounded-2xl border-b-4 transition-all min-w-[140px] md:min-w-0",
                              isActive 
                                  ? "bg-duo-panel border-duo-primary" 
                                  : "bg-duo-sidebar border-duo-gray opacity-60 hover:opacity-100"
                          )}
                          style={{
                              borderColor: isActive ? area.color : undefined,
                          }}
                      >
                          <div className="p-2 rounded-lg bg-black/20">
                             <area.icon 
                                className="w-5 h-5" 
                                style={{ color: area.color }} 
                             />
                          </div>
                          <div className="text-left">
                              <div 
                                className="text-xs font-black uppercase tracking-wide"
                                style={{ color: isActive ? 'white' : '#9ca3af' }}
                              >
                                {area.label}
                              </div>
                              <div className="text-[10px] font-bold text-gray-500">{area.items.length} metas</div>
                          </div>
                      </button>
                  );
              })}
          </div>

          {/* Content */}
          <div className="md:col-span-3">
              <div 
                className="panel p-6 min-h-[400px] transition-all duration-500 border-2"
                style={{ borderColor: currentArea.color }}
              >
                  <div className="flex flex-row items-center justify-between pb-4 border-b-2 border-duo-gray mb-4">
                      <h3 
                        className="text-xl font-black uppercase tracking-tight flex items-center gap-2"
                        style={{ color: currentArea.color }}
                      >
                           {currentArea.label}
                      </h3>
                      <div className="text-xs font-bold text-gray-500 bg-duo-gray/30 px-3 py-1 rounded-full">
                          {currentArea.items.filter((i:any) => i.completed).length}/{currentArea.items.length} Concluídas
                      </div>
                  </div>
                  
                  <div className="space-y-4">
                      {/* Progress Bar specific to area */}
                      <div className="h-3 w-full bg-duo-sidebar rounded-full overflow-hidden border border-duo-gray">
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
                              className="bg-duo-sidebar border-2 border-duo-gray h-12 rounded-xl text-white font-bold focus:border-white focus:ring-0"
                          />
                          <Button onClick={handleAddItem} className="h-12 w-12 rounded-xl bg-duo-primary text-duo-bg shadow-3d-cyan hover:-translate-y-0.5 active:translate-y-[1px] active:shadow-none p-0">
                              <Plus className="w-6 h-6" />
                          </Button>
                      </div>

                      <div className="space-y-2 mt-4">
                          {currentArea.items.map((item: any) => (
                              <div key={item.id} className="list-item-card bg-duo-panel border-duo-gray p-3 flex items-center gap-3 group hover:border-white">
                                  <button 
                                      onClick={() => toggleAreaItem(currentArea.id as any, item.id)}
                                      className={cn(
                                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                                          item.completed 
                                              ? "bg-transparent" 
                                              : "border-gray-500 hover:border-white"
                                      )}
                                      style={{
                                          backgroundColor: item.completed ? currentArea.color : 'transparent',
                                          borderColor: item.completed ? currentArea.color : undefined
                                      }}
                                  >
                                      {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                                  </button>
                                  <span className={cn(
                                      "flex-1 text-sm font-bold",
                                      item.completed ? "text-gray-500 line-through" : "text-white"
                                  )}>
                                      {item.text}
                                  </span>
                                  <button 
                                      onClick={() => deleteAreaItem(currentArea.id as any, item.id)}
                                      className="text-gray-600 hover:text-card-red opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                      <X className="w-4 h-4" />
                                  </button>
                              </div>
                          ))}
                          {currentArea.items.length === 0 && (
                              <div className="text-center py-12 text-gray-600 text-sm font-bold uppercase">
                                  Nenhuma meta definida.
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};