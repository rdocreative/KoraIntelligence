import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Zap, LayoutDashboard, Trash2, Calendar as CalendarIcon, Briefcase, GraduationCap, Heart, User, Sparkles, Brain, Target, ChevronRight, Flag, Plus } from "lucide-react";
import { TaskList } from "@/components/masterplan/TaskList";
import { TaskItem } from "@/hooks/useMasterplan";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface WeeklyTabProps {
  weeks: any[];
  addWeek: (week: any) => void;
  deleteWeek: (id: string) => void;
  addWeekTask: (weekId: string, task: TaskItem) => void;
  toggleWeekTask: (weekId: string, taskId: string) => void;
  updateWeekReview: (weekId: string, field: string, value: string) => void;
  annualObjective?: string;
  monthName?: string;
}

export const WeeklyTab = ({ 
  weeks, 
  addWeek, 
  deleteWeek, 
  addWeekTask, 
  toggleWeekTask, 
  updateWeekReview,
  annualObjective = "Objetivo Anual",
  monthName = "Mês Atual"
}: WeeklyTabProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWeekStart, setNewWeekStart] = useState<Date>();
  const [newWeekEnd, setNewWeekEnd] = useState<Date>();
  const [newWeekGoal, setNewWeekGoal] = useState("");
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  const pillars = [
    { id: 'work', label: 'Trabalho', icon: Briefcase, color: 'text-blue-500', border: 'border-blue-500', bg: 'bg-blue-500/10', bar: 'bg-blue-500' },
    { id: 'studies', label: 'Estudos', icon: GraduationCap, color: 'text-purple-500', border: 'border-purple-500', bg: 'bg-purple-500/10', bar: 'bg-purple-500' },
    { id: 'health', label: 'Saúde', icon: Heart, color: 'text-red-500', border: 'border-red-500', bg: 'bg-red-500/10', bar: 'bg-red-500' },
    { id: 'personal', label: 'Pessoal', icon: User, color: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-500/10', bar: 'bg-yellow-500' },
  ];

  const handleCreateWeek = () => {
    if (!newWeekStart || !newWeekEnd || !newWeekGoal) return;
    
    const startDateStr = format(newWeekStart, 'yyyy-MM-dd');
    const endDateStr = format(newWeekEnd, 'yyyy-MM-dd');

    addWeek({
      id: Date.now().toString(),
      startDate: startDateStr,
      endDate: endDateStr,
      goal: newWeekGoal,
      reviewDate: endDateStr,
      pillar: selectedPillar,
      tasks: [],
      review: { worked: "", didntWork: "", improve: "" }
    });
    
    // Reset form and close dialog
    setNewWeekStart(undefined);
    setNewWeekEnd(undefined);
    setNewWeekGoal("");
    setSelectedPillar(null);
    setIsDialogOpen(false);
  };

  const getPillarStyles = (pillarId: string) => {
      const pillar = pillars.find(p => p.id === pillarId);
      if (!pillar) return { color: 'text-neutral-500', border: 'border-white/10', bg: 'bg-white/5', bar: 'bg-neutral-500' };
      return pillar;
  };

  return (
    <div className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* HEADER SECTION WITH ACTION BUTTON */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <Flag className="w-5 h-5 text-neutral-400" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white tracking-tight">MISSÕES SEMANAIS</h2>
                <p className="text-xs text-neutral-500 font-medium mt-1">Gerencie suas missões e mantenha o ritmo.</p>
             </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider px-6 h-10 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all">
                    <Plus className="w-4 h-4 mr-2" /> Nova Missão
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0A0A]/95 backdrop-blur-xl border-white/10 sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-white uppercase tracking-wider flex items-center gap-2 text-lg">
                        <Zap className="w-5 h-5 text-red-500" /> Nova Missão Semanal
                    </DialogTitle>
                    <DialogDescription className="text-neutral-500">
                        Defina o foco tático para a próxima semana.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Objetivo Único</Label>
                        <Input
                            value={newWeekGoal}
                            onChange={(e) => setNewWeekGoal(e.target.value)}
                            placeholder="Ex: Finalizar o Módulo 3..."
                            className="bg-white/5 border-white/10 h-11 text-sm focus:border-red-500/50 focus:ring-red-500/20 rounded-lg placeholder:text-neutral-600 text-white"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Pilar Relacionado</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {pillars.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPillar(p.id)}
                                    className={cn(
                                        "h-10 rounded-lg border flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group px-2",
                                        selectedPillar === p.id 
                                            ? `${p.bg} ${p.border} ring-1 ring-offset-0 ${p.border.replace('border', 'ring')}` 
                                            : "bg-white/5 border-white/10 hover:border-white/20 text-neutral-500"
                                    )}
                                >
                                    <p.icon className={cn("w-3.5 h-3.5 transition-colors", selectedPillar === p.id ? p.color : "text-neutral-500 group-hover:text-white")} />
                                    <span className={cn("text-[10px] font-bold uppercase truncate", selectedPillar === p.id ? "text-white" : "text-neutral-500")}>
                                        {p.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Início</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal bg-white/5 border-white/10 hover:bg-white/10 hover:text-white h-10 rounded-lg",
                                            !newWeekStart && "text-neutral-500"
                                        )}
                                    >
                                        {newWeekStart ? format(newWeekStart, "dd/MM/yyyy") : <span className="text-xs">DD/MM/AAAA</span>}
                                        <CalendarIcon className="ml-auto h-3.5 w-3.5 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-[#111] border-white/10" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={newWeekStart}
                                        onSelect={setNewWeekStart}
                                        initialFocus
                                        className="p-3 pointer-events-auto"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Fim</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal bg-white/5 border-white/10 hover:bg-white/10 hover:text-white h-10 rounded-lg",
                                            !newWeekEnd && "text-neutral-500"
                                        )}
                                    >
                                        {newWeekEnd ? format(newWeekEnd, "dd/MM/yyyy") : <span className="text-xs">DD/MM/AAAA</span>}
                                        <CalendarIcon className="ml-auto h-3.5 w-3.5 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-[#111] border-white/10" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={newWeekEnd}
                                        onSelect={setNewWeekEnd}
                                        initialFocus
                                        className="p-3 pointer-events-auto"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-end">
                    <Button 
                        onClick={handleCreateWeek} 
                        disabled={!newWeekGoal || !newWeekStart || !newWeekEnd}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold h-11 rounded-lg transition-all duration-300 uppercase tracking-widest text-xs shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Iniciar Missão
                    </Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
      </div>

      {/* ACTIVE MISSIONS LIST */}
      <div className="space-y-8">
        {weeks.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/5 rounded-2xl animate-in fade-in duration-700 bg-white/[0.01]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-6 h-6 text-neutral-600" />
            </div>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-[0.2em]">Nenhuma Missão Semanal ativa</p>
            <p className="text-xs text-neutral-700 mt-2">Clique em "+ Nova Missão" para começar a batalha.</p>
          </div>
        )}

        {weeks.map((week, idx) => {
            const pillarStyle = getPillarStyles(week.pillar);
            const completedTasks = week.tasks?.filter((t: any) => t.completed).length || 0;
            const totalTasks = week.tasks?.length || 0;
            const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

            return (
              <Card key={week.id} className={cn("bg-[#0E0E0E] border overflow-hidden shadow-xl transition-all duration-300 relative group", week.pillar ? pillarStyle.border.replace('border-', 'border-opacity-30 border-') : "border-white/10 hover:border-white/20")}>
                  
                  {/* BARRA DE PROGRESSO NO TOPO */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-20">
                      <div 
                        className={cn("h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.3)]", pillarStyle.bar)} 
                        style={{ width: `${progress}%` }} 
                      />
                  </div>

                  <CardHeader className="bg-white/[0.02] border-b border-white/5 py-5 px-6 relative z-10">
                    
                    {/* BREADCRUMBS CONTEXTO */}
                    <div className="flex items-center gap-1.5 mb-3 opacity-60">
                        <Target className="w-3 h-3 text-neutral-500" />
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <span className="truncate max-w-[100px] sm:max-w-xs">{annualObjective}</span> 
                            <ChevronRight className="w-3 h-3 text-neutral-700" /> 
                            <span>{monthName.substring(0, 3)}</span>
                            <ChevronRight className="w-3 h-3 text-neutral-700" /> 
                            <span className="text-white">Missão {idx + 1}</span>
                        </span>
                    </div>

                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                             <CalendarIcon className="w-3 h-3" />
                             {format(new Date(week.startDate), "dd MMM", { locale: ptBR })} - {format(new Date(week.endDate), "dd MMM", { locale: ptBR })}
                          </div>
                          {week.pillar && (
                              <span className={cn("text-[9px] px-2 py-0.5 rounded border uppercase font-black tracking-widest flex items-center gap-1.5", pillarStyle.color, pillarStyle.border, pillarStyle.bg)}>
                                <span className={cn("w-1.5 h-1.5 rounded-full", pillarStyle.bar)} />
                                {pillars.find(p => p.id === week.pillar)?.label}
                              </span>
                          )}
                        </div>
                        <h3 className="text-2xl md:text-3xl text-white font-black uppercase tracking-tight leading-none">
                            {week.goal}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                              <span className="text-2xl font-black text-white">{Math.round(progress)}%</span>
                              <span className="text-[10px] uppercase font-bold text-neutral-600 block leading-none">Concluído</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteWeek(week.id)} className="h-8 w-8 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-md">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <Tabs defaultValue="execution" className="w-full">
                        <div className="border-b border-white/5 px-6 bg-white/[0.01]">
                            <TabsList className="bg-transparent h-12 gap-6 p-0">
                                <TabsTrigger 
                                    value="execution" 
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none h-full px-0 text-xs font-bold uppercase tracking-widest text-neutral-500 data-[state=active]:text-white transition-all hover:text-neutral-300"
                                >
                                    <Zap className="w-3.5 h-3.5 mr-2" /> Execução
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="review" 
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 rounded-none h-full px-0 text-xs font-bold uppercase tracking-widest text-neutral-500 data-[state=active]:text-white transition-all hover:text-neutral-300"
                                >
                                    <Brain className="w-3.5 h-3.5 mr-2" /> Review
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="execution" className="p-6 m-0 focus-visible:ring-0 animate-in fade-in slide-in-from-left-4 duration-300">
                             <div className="max-w-3xl mx-auto space-y-6">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em]">Plano de Ação</Label>
                                    <span className="text-[10px] font-medium text-neutral-600 uppercase tracking-wider">{completedTasks} de {totalTasks} Tarefas</span>
                                </div>
                                <TaskList
                                    items={week.tasks || []}
                                    onAdd={(text) => addWeekTask(week.id, {
                                        id: Date.now().toString(),
                                        text: text,
                                        completed: false
                                    })}
                                    onToggle={(taskId) => toggleWeekTask(week.id, taskId)}
                                    placeholder="Adicionar tarefa tática..."
                                />
                             </div>
                        </TabsContent>

                        <TabsContent value="review" className="p-6 m-0 focus-visible:ring-0 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-3 p-4 rounded-xl bg-green-500/5 border border-green-500/10 hover:border-green-500/20 transition-all">
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> O que funcionou?
                                    </span>
                                    <Textarea
                                      value={week.review?.worked || ""}
                                      onChange={(e) => updateWeekReview(week.id, 'worked', e.target.value)}
                                      className="bg-black/20 border-none text-sm min-h-[120px] resize-none focus-visible:ring-0 placeholder:text-neutral-700/50 text-neutral-300"
                                      placeholder="Liste suas vitórias e acertos..."
                                    />
                                  </div>

                                  <div className="space-y-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition-all">
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> O que falhou?
                                    </span>
                                    <Textarea
                                      value={week.review?.didntWork || ""}
                                      onChange={(e) => updateWeekReview(week.id, 'didntWork', e.target.value)}
                                      className="bg-black/20 border-none text-sm min-h-[120px] resize-none focus-visible:ring-0 placeholder:text-neutral-700/50 text-neutral-300"
                                      placeholder="Identifique os obstáculos..."
                                    />
                                  </div>

                                  <div className="space-y-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 hover:border-yellow-500/20 transition-all">
                                    <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Como melhorar?
                                    </span>
                                    <Textarea
                                      value={week.review?.improve || ""}
                                      onChange={(e) => updateWeekReview(week.id, 'improve', e.target.value)}
                                      className="bg-black/20 border-none text-sm min-h-[120px] resize-none focus-visible:ring-0 placeholder:text-neutral-700/50 text-neutral-300"
                                      placeholder="Ações para a próxima semana..."
                                    />
                                  </div>
                             </div>
                        </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
            );
        })}
      </div>
    </div>
  );
};