"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Target, BarChart3, TrendingUp, AlertTriangle, 
  Briefcase, GraduationCap, Heart, User, Plus, X, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnualTabProps {
  data: any;
  analytics: any;
  updateAnnual: (data: any) => void;
  // Fixed type definition
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
  const [activeArea, setActiveArea] = useState<string>("work");

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    addAreaItem(activeArea as any, newItemText);
    setNewItemText("");
  };

  const areas = [
    { id: 'work', label: 'Trabalho', icon: Briefcase, items: data.areas.work },
    { id: 'studies', label: 'Estudos', icon: GraduationCap, items: data.areas.studies },
    { id: 'health', label: 'Saúde', icon: Heart, items: data.areas.health },
    { id: 'personal', label: 'Pessoal', icon: User, items: data.areas.personal },
  ];

  const currentArea = areas.find(a => a.id === activeArea);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Analytics Hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#111111] border-white/5 md:col-span-2">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">
                      <BarChart3 className="w-4 h-4" /> Status Geral do Ano
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

      {/* Main Annual Goal Editor */}
      <Card className="bg-[#111111] border-white/5">
          <CardHeader>
               <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#E8251A]">
                   <Target className="w-4 h-4" /> Objetivo Principal
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
              {areas.map((area) => (
                  <button
                      key={area.id}
                      onClick={() => setActiveArea(area.id)}
                      className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border transition-all min-w-[140px] md:min-w-0",
                          activeArea === area.id 
                              ? "bg-[#E8251A] border-[#E8251A] text-white shadow-lg" 
                              : "bg-[#111111] border-white/5 text-neutral-500 hover:text-white hover:bg-[#161616]"
                      )}
                  >
                      <area.icon className="w-5 h-5" />
                      <div className="text-left">
                          <div className="text-xs font-bold uppercase tracking-wide">{area.label}</div>
                          <div className="text-[10px] opacity-70">{area.items.length} metas</div>
                      </div>
                  </button>
              ))}
          </div>

          {/* Content */}
          <div className="md:col-span-3">
              <Card className="bg-[#111111] border-white/5 min-h-[400px]">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                           {currentArea?.label}
                      </CardTitle>
                      <div className="text-xs text-neutral-500 font-mono">
                          {currentArea?.items.filter((i:any) => i.completed).length}/{currentArea?.items.length} Concluídas
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex gap-2">
                          <Input 
                              placeholder={`Adicionar meta para ${currentArea?.label}...`}
                              value={newItemText}
                              onChange={(e) => setNewItemText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                              className="bg-[#0A0A0A] border-white/10"
                          />
                          <Button onClick={handleAddItem} className="bg-[#E8251A] hover:bg-[#c91e14]">
                              <Plus className="w-4 h-4" />
                          </Button>
                      </div>

                      <div className="space-y-2 mt-4">
                          {currentArea?.items.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors group">
                                  <button 
                                      onClick={() => toggleAreaItem(activeArea as any, item.id)}
                                      className={cn(
                                          "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                          item.completed 
                                              ? "bg-[#E8251A] border-[#E8251A] text-white" 
                                              : "border-neutral-700 text-transparent hover:border-white"
                                      )}
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
                                      onClick={() => deleteAreaItem(activeArea as any, item.id)}
                                      className="text-neutral-700 hover:text-[#E8251A] opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                      <X className="w-4 h-4" />
                                  </button>
                              </div>
                          ))}
                          {currentArea?.items.length === 0 && (
                              <div className="text-center py-12 text-neutral-600 text-sm">
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