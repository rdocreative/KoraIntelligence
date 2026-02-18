"use client";

import { useState } from "react";
import { MasterplanData, TaskItem } from "@/hooks/useMasterplan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Target, 
  Plus, 
  Trash2,
  Briefcase,
  BookOpen,
  Heart,
  User,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnualTabProps {
  data: MasterplanData;
  analytics: {
    yearProgress: number;
    yearStatus: string;
    statusColor: string;
    statusMessage: string;
    areaStats: Array<{
      id: string;
      label: string;
      total: number;
      completed: number;
      percentage: number;
    }>;
    strongestArea: {
      id: string;
      label: string;
      percentage: number;
    };
    weakestArea: {
      id: string;
      label: string;
      percentage: number;
    };
    totalTasks: number;
    completedTasks: number;
    executionRate: number;
  };
  updateAnnual: (updates: Partial<MasterplanData['annual']>) => void;
  addAreaItem: (area: 'work' | 'studies' | 'health' | 'personal', item: string) => void;
  toggleAreaItem: (area: 'work' | 'studies' | 'health' | 'personal', itemId: string) => void;
  deleteAreaItem: (area: 'work' | 'studies' | 'health' | 'personal', itemId: string) => void;
}

const areaConfig = {
  work: { label: 'Trabalho', icon: Briefcase, color: 'from-blue-500 to-blue-700' },
  studies: { label: 'Estudos', icon: BookOpen, color: 'from-purple-500 to-purple-700' },
  health: { label: 'Saúde', icon: Heart, color: 'from-emerald-500 to-emerald-700' },
  personal: { label: 'Pessoal', icon: User, color: 'from-amber-500 to-amber-700' },
};

export const AnnualTab = ({
  data,
  analytics,
  updateAnnual,
  addAreaItem,
  toggleAreaItem,
  deleteAreaItem
}: AnnualTabProps) => {
  const [newItems, setNewItems] = useState<Record<string, string>>({
    work: '',
    studies: '',
    health: '',
    personal: ''
  });

  const handleAddItem = (area: 'work' | 'studies' | 'health' | 'personal') => {
    if (newItems[area].trim()) {
      addAreaItem(area, newItems[area].trim());
      setNewItems(prev => ({ ...prev, [area]: '' }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Plano Anual</h1>
        <p className="text-neutral-400 text-sm">Sua visão de longo prazo e pilares de evolução</p>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#0A0A0A] border-neutral-800/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-neutral-500 mb-1">Ano</p>
            <p className="text-2xl font-black text-white">{Math.round(analytics.yearProgress)}%</p>
            <p className="text-xs text-neutral-600">decorrido</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0A0A0A] border-neutral-800/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-neutral-500 mb-1">Taxa de Execução</p>
            <p className="text-2xl font-black text-white">{analytics.executionRate}%</p>
            <p className="text-xs text-neutral-600">{analytics.completedTasks}/{analytics.totalTasks} tarefas</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0A] border-neutral-800/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-neutral-500 mb-1">Melhor Área</p>
            <p className="text-lg font-bold text-emerald-500">{analytics.strongestArea?.label || '-'}</p>
            <p className="text-xs text-neutral-600">{analytics.strongestArea?.percentage || 0}%</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0A] border-neutral-800/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-neutral-500 mb-1">Precisa de Atenção</p>
            <p className="text-lg font-bold text-amber-500">{analytics.weakestArea?.label || '-'}</p>
            <p className="text-xs text-neutral-600">{analytics.weakestArea?.percentage || 0}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Card */}
      <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-neutral-800/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Status do Ano</p>
              <h3 className={cn("text-xl font-black", analytics.statusColor)}>{analytics.yearStatus}</h3>
              <p className="text-sm text-neutral-400 mt-1">{analytics.statusMessage}</p>
            </div>
            {analytics.yearStatus === "Excelente" && <Award className="w-10 h-10 text-emerald-500" />}
            {analytics.yearStatus === "Atenção Necessária" && <AlertTriangle className="w-10 h-10 text-[#E8251A]" />}
            {analytics.yearStatus === "Em Execução" && <TrendingUp className="w-10 h-10 text-white" />}
          </div>
        </CardContent>
      </Card>

      {/* Annual Goal */}
      <Card className="bg-[#0A0A0A] border-neutral-800/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white">Objetivo Anual</CardTitle>
              <p className="text-xs text-neutral-500">A grande meta que guia todas as suas ações</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={data.annual.goal}
            onChange={(e) => updateAnnual({ goal: e.target.value })}
            placeholder="Qual é o seu grande objetivo para este ano?"
            className="bg-neutral-900/50 border-neutral-700 text-white placeholder:text-neutral-600 min-h-[100px]"
          />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-neutral-400">Progresso do Objetivo</label>
              <span className="text-lg font-bold text-white">{data.annual.progress}%</span>
            </div>
            <Slider
              value={[data.annual.progress]}
              onValueChange={(value) => updateAnnual({ progress: value[0] })}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Areas / Pillars */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Pilares de Evolução</h2>
        <p className="text-sm text-neutral-500">As 4 áreas da sua vida que você quer desenvolver este ano</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {(Object.keys(areaConfig) as Array<keyof typeof areaConfig>).map((areaKey) => {
            const config = areaConfig[areaKey];
            const items = data.areas[areaKey];
            const completed = items.filter(i => i.completed).length;
            const total = items.length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            const Icon = config.icon;

            return (
              <Card key={areaKey} className="bg-[#0A0A0A] border-neutral-800/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center", config.color)}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-white">{config.label}</CardTitle>
                        <p className="text-xs text-neutral-500">{completed}/{total} concluídos</p>
                      </div>
                    </div>
                    <span className="text-xl font-black text-white">{percentage}%</span>
                  </div>
                  <div className="mt-3 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full bg-gradient-to-r transition-all duration-500", config.color)}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.length === 0 ? (
                    <p className="text-sm text-neutral-500 text-center py-4">
                      Nenhum objetivo definido ainda.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {items.map((item) => (
                        <div 
                          key={item.id}
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-lg transition-all group",
                            item.completed 
                              ? "bg-emerald-500/10" 
                              : "bg-neutral-900/50 hover:bg-neutral-800/50"
                          )}
                        >
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() => toggleAreaItem(areaKey, item.id)}
                            className="border-neutral-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                          />
                          <span className={cn(
                            "flex-1 text-sm",
                            item.completed ? "text-neutral-500 line-through" : "text-white"
                          )}>
                            {item.text}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAreaItem(areaKey, item.id)}
                            className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-500 h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Input
                      value={newItems[areaKey]}
                      onChange={(e) => setNewItems(prev => ({ ...prev, [areaKey]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddItem(areaKey)}
                      placeholder="Adicionar objetivo..."
                      className="bg-neutral-900/50 border-neutral-700 text-white placeholder:text-neutral-600 text-sm"
                    />
                    <Button 
                      onClick={() => handleAddItem(areaKey)}
                      size="sm"
                      className={cn("bg-gradient-to-r text-white", config.color)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Annual Notes */}
      <Card className="bg-[#0A0A0A] border-neutral-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-white">Notas e Reflexões</CardTitle>
          <p className="text-xs text-neutral-500">Espaço para suas anotações sobre o ano</p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.annual.notes}
            onChange={(e) => updateAnnual({ notes: e.target.value })}
            placeholder="Suas reflexões, aprendizados e insights..."
            className="bg-neutral-900/50 border-neutral-700 text-white placeholder:text-neutral-600 min-h-[120px]"
          />
        </CardContent>
      </Card>
    </div>
  );
};