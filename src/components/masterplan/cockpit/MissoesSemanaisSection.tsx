import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Flag, Plus, Zap, Briefcase, GraduationCap, Heart, User, Calendar as CalendarIcon, Trash2, Target, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Mission {
  id: string;
  goal: string;
  pillar?: string;
  startDate: string;
  endDate: string;
  linkedMonthGoalId?: string; // Novo campo de vínculo
  tasks: { id: string; completed: boolean }[];
}

interface MonthlyGoal {
  id: string;
  text: string | { text: string; completed: boolean }; // Adaptando para estrutura flexível
  completed: boolean;
}

interface MissoesSemanaisSectionProps {
  missions: Mission[];
  monthlyGoals: MonthlyGoal[]; // Recebe as metas do mês
  onAddMission: (mission: any) => void;
  onDeleteMission: (id: string) => void;
  onSelectMission: (id: string) => void;
}

const pillars = [
  { id: 'work', label: 'Trabalho', icon: Briefcase, color: 'text-blue-500', border: 'border-blue-500', bg: 'bg-blue-500/10', bar: 'bg-blue-500' },
  { id: 'studies', label: 'Estudos', icon: GraduationCap, color: 'text-purple-500', border: 'border-purple-500', bg: 'bg-purple-500/10', bar: 'bg-purple-500' },
  { id: 'health', label: 'Saúde', icon: Heart, color: 'text-red-500', border: 'border-red-500', bg: 'bg-red-500/10', bar: 'bg-red-500' },
  { id: 'personal', label: 'Pessoal', icon: User, color: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-500/10', bar: 'bg-yellow-500' },
];

export const MissoesSemanaisSection = ({ 
  missions, 
  monthlyGoals,
  onAddMission, 
  onDeleteMission,
  onSelectMission 
}: MissoesSemanaisSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedMonthGoalId, setSelectedMonthGoalId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isGoalSelectorOpen, setIsGoalSelectorOpen] = useState(false);

  // Filtra apenas metas não concluídas para vincular
  const activeMonthlyGoals = monthlyGoals.filter(g => !g.completed);

  const getPillarStyles = (pillarId?: string) => {
    const pillar = pillars.find(p => p.id === pillarId);
    if (!pillar) return { color: 'text-neutral-500', border: 'border-white/10', bg: 'bg-white/5', bar: 'bg-neutral-500', icon: Flag };
    return { ...pillar, icon: pillar.icon };
  };

  const getGoalText = (goal: MonthlyGoal) => {
      if (typeof goal.text === 'string') return goal.text;
      return goal.text?.text || "Meta sem nome";
  };

  const handleCreate = () => {
    if (!newGoal || !startDate || !endDate || !selectedMonthGoalId) return;
    
    onAddMission({
      id: Date.now().toString(),
      goal: newGoal,
      pillar: selectedPillar,
      linkedMonthGoalId: selectedMonthGoalId, // Salvando o vínculo
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      tasks: [],
      review: { worked: "", didntWork: "", improve: "" }
    });

    setNewGoal("");
    setSelectedPillar(null);
    setSelectedMonthGoalId(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setIsDialogOpen(false);
  };

  const selectedMonthGoalText = selectedMonthGoalId 
    ? getGoalText(monthlyGoals.find(g => g.id === selectedMonthGoalId)!) 
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/5">
            <Flag className="w-5 h-5 text-neutral-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">Missões Semanais</h2>
            <p className="text-xs text-neutral-500 font-medium">Suas batalhas estratégicas</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider px-5 h-9 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all">
              <Plus className="w-4 h-4 mr-1.5" /> Nova Missão
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0A0A0A]/95 backdrop-blur-xl border-white/10 sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="text-white uppercase tracking-wider flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-red-500" /> Nova Missão Semanal
              </DialogTitle>
              <DialogDescription className="text-neutral-500">
                Defina o foco tático para a próxima semana.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
              
              {/* 1. SELETOR DE META MENSAL (VÍNCULO OBRIGATÓRIO) */}
              <div className="space-y-2">
                 <Label className="text-[10px] uppercase font-bold text-red-500 tracking-widest flex items-center gap-2">
                    <Target className="w-3 h-3" /> Vínculo com o Norte (Obrigatório)
                 </Label>
                 <Popover open={isGoalSelectorOpen} onOpenChange={setIsGoalSelectorOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-between bg-white/5 border-white/10 hover:bg-white/10 h-11 rounded-lg text-left font-normal",
                                !selectedMonthGoalId && "text-neutral-500"
                            )}
                        >
                            <span className="truncate">
                                {selectedMonthGoalText || "Selecione a Meta Mensal para vincular..."}
                            </span>
                            <Target className="ml-2 h-4 w-4 opacity-50 shrink-0" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-2 bg-[#111] border-white/10" align="start">
                        <div className="space-y-1">
                            {activeMonthlyGoals.length === 0 ? (
                                <div className="p-3 text-xs text-neutral-500 text-center">
                                    Nenhuma meta mensal ativa encontrada. Defina suas metas do mês primeiro.
                                </div>
                            ) : (
                                activeMonthlyGoals.map(goal => (
                                    <button
                                        key={goal.id}
                                        onClick={() => {
                                            setSelectedMonthGoalId(goal.id);
                                            setIsGoalSelectorOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center gap-3",
                                            selectedMonthGoalId === goal.id 
                                                ? "bg-red-500/20 text-red-400" 
                                                : "text-neutral-300 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-2 h-2 rounded-full shrink-0",
                                            selectedMonthGoalId === goal.id ? "bg-red-500" : "bg-neutral-700"
                                        )} />
                                        <span className="truncate flex-1">{getGoalText(goal)}</span>
                                        {selectedMonthGoalId === goal.id && <Check className="w-3.5 h-3.5" />}
                                    </button>
                                ))
                            )}
                        </div>
                    </PopoverContent>
                 </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Objetivo Tático da Semana</Label>
                <Input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Ex: Finalizar o Módulo 3..."
                  className="bg-white/5 border-white/10 h-11 text-sm focus:border-red-500/50 focus:ring-red-500/20 rounded-lg placeholder:text-neutral-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Pilar</Label>
                <div className="grid grid-cols-4 gap-2">
                  {pillars.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPillar(p.id)}
                      className={cn(
                        "h-10 rounded-lg border flex items-center justify-center gap-1.5 transition-all duration-300 px-2 relative overflow-hidden",
                        selectedPillar === p.id 
                          ? `${p.bg} ${p.border} ring-1 ${p.border.replace('border', 'ring')}` 
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      )}
                    >
                      <p.icon className={cn("w-3.5 h-3.5 relative z-10", selectedPillar === p.id ? p.color : "text-neutral-500")} />
                      <span className={cn("text-[9px] font-bold uppercase relative z-10", selectedPillar === p.id ? "text-white" : "text-neutral-500")}>
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-white/5 border-white/10 hover:bg-white/10 h-10 rounded-lg",
                          !startDate && "text-neutral-500"
                        )}
                      >
                        {startDate ? format(startDate, "dd/MM/yy") : <span className="text-xs">DD/MM</span>}
                        <CalendarIcon className="ml-auto h-3.5 w-3.5 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#111] border-white/10" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-3" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-white/5 border-white/10 hover:bg-white/10 h-10 rounded-lg",
                          !endDate && "text-neutral-500"
                        )}
                      >
                        {endDate ? format(endDate, "dd/MM/yy") : <span className="text-xs">DD/MM</span>}
                        <CalendarIcon className="ml-auto h-3.5 w-3.5 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#111] border-white/10" align="start">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="p-3" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                onClick={handleCreate} 
                disabled={!newGoal || !startDate || !endDate || !selectedMonthGoalId}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold h-11 rounded-lg uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {!selectedMonthGoalId ? "Vincule uma Meta Mensal" : "Iniciar Missão"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mission Cards Grid */}
      {missions.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flag className="w-5 h-5 text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-500 font-medium">Nenhuma missão ativa</p>
          <p className="text-xs text-neutral-700 mt-1">Clique em "+ Nova Missão" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {missions.map((mission) => {
            const pillarStyle = getPillarStyles(mission.pillar);
            const PillarIcon = pillarStyle.icon;
            const completedTasks = mission.tasks?.filter(t => t.completed).length || 0;
            const totalTasks = mission.tasks?.length || 0;
            const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
            
            // Encontrar o nome da meta mensal vinculada (se existir)
            const linkedGoal = monthlyGoals.find(g => g.id === mission.linkedMonthGoalId);
            const linkedGoalName = linkedGoal ? getGoalText(linkedGoal) : null;

            return (
              <div
                key={mission.id}
                onClick={() => onSelectMission(mission.id)}
                className={cn(
                  "group relative p-5 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-[#0E0E0E]",
                  mission.pillar ? `${pillarStyle.border} border-opacity-30` : "border-white/10 hover:border-white/20"
                )}
              >
                {/* Progress bar top */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5 rounded-t-xl overflow-hidden">
                  <div className={cn("h-full transition-all duration-700", pillarStyle.bar)} style={{ width: `${progress}%` }} />
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteMission(mission.id); }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 text-neutral-600 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Content */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 justify-between">
                     <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded-md", pillarStyle.bg)}>
                          <PillarIcon className={cn("w-3.5 h-3.5", pillarStyle.color)} />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">
                          {format(new Date(mission.startDate), "dd MMM", { locale: ptBR })}
                        </span>
                     </div>
                  </div>
                  
                  {/* Título da Missão */}
                  <h3 className="text-base font-bold text-white leading-tight line-clamp-2">
                    {mission.goal}
                  </h3>
                  
                  {/* Contexto da Meta Mensal */}
                  {linkedGoalName && (
                      <div className="flex items-center gap-1.5 pt-1 border-t border-white/5 mt-2">
                          <Target className="w-3 h-3 text-neutral-600" />
                          <p className="text-[10px] text-neutral-500 truncate font-medium uppercase tracking-wide max-w-full">
                            {linkedGoalName}
                          </p>
                      </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-neutral-500 font-medium">
                      {completedTasks}/{totalTasks} tarefas
                    </span>
                    <span className="text-sm font-black text-white">{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};