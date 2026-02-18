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
import { Zap, LayoutDashboard, Trash2, Calendar as CalendarIcon, Briefcase, GraduationCap, Heart, User, Sparkles, Brain, Target, ChevronRight, Flag } from "lucide-react";
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
    if (!newWeekStart || !newWeekEnd) return;
    
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
    setNewWeekStart(undefined);
    setNewWeekEnd(undefined);
    setNewWeekGoal("");
    setSelectedPillar(null);
  };

  const getPillarStyles = (pillarId: string) => {
      const pillar = pillars.find(p => p.id === pillarId);
      if (!pillar) return { color: 'text-neutral-500', border: 'border-white/10', bg: 'bg-white/5', bar: 'bg-neutral-500' };
      return pillar;
  };

  return (
    <div className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <Flag className="w-5 h-5 text-neutral-400" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white tracking-tight">MISSÕES SEMANAIS</h2>
                <p className="text-xs text-neutral-500 font-medium mt-1">Gerencie suas missões e mantenha o ritmo.</p>
             </div>
          </div>
      </div>

      {/* NEW MISSION CREATOR */}
      <Card className="bg-[#0A0A0A] border-white/10 shadow-lg mb-12">
        <CardHeader className="border-b border-white/5 pb-4 pt-5 px-6">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-red-500/10 rounded-md"><Zap className="w-4 h-4 text-red-500" /></div>
            <div>
               <CardTitle className="text-sm font-bold uppercase text-white tracking-wider">Nova Missão Semanal</CardTitle>
               <CardDescription className="text-xs text-neutral-500 mt-0.5">Defina o foco, o pilar e o período da missão.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5 px-6 pb-6 space-y-6">
            
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Objetivo Único</Label>
                    <Input
                        value={newWeekGoal}
                        onChange={(e) => setNewWeekGoal(e.target.value)}
                        placeholder="Meta principal da missão..."
                        className="bg-[#0E0E0E] border-white/10 h-11 text-sm focus:border-red-500/50 transition-all focus:ring-1 focus:ring-red-500/20 rounded-lg placeholder:text-neutral-600"
                    />
                </div>
                
                <div className="space-y-2">
                     <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Pilar Relacionado</Label>
                     <div className="flex gap-2">
                        {pillars.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPillar(p.id)}
                                className={cn(
                                    "flex-1 h-11 rounded-lg border flex items-center justify-center transition-all duration-300 relative overflow-hidden group",
                                    selectedPillar === p.id 
                                        ? `${p.bg} ${p.border} ring-1 ring-offset-0 ${p.border.replace('border', 'ring')}` 
                                        : "bg-[#0E0E0E] border-white/10 hover:border-white/20 text-neutral-500"
                                )}
                            >
                                <p.icon className={cn("w-4 h-4 transition-colors", selectedPillar === p.id ? p.color : "text-neutral-500 group-hover:text-white")} />
                                {selectedPillar === p.id && (
                                    <div className="absolute inset-0 bg-white/5 animate-pulse" />
                                )}
                            </button>
                        ))}
                     </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-5 items-end pt-2 border-t border-white/5">
                <div className="grid grid-cols-2 gap-3 w-full lg:w-auto flex-1">
                  <div className="space-y-1.5 flex flex-col">
                    <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Início</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-[#0E0E0E] border-white/10 hover:bg-white/5 hover:text-white h-10 rounded-md",
                            !newWeekStart && "text-neutral-500"
                          )}
                        >
                          {newWeekStart ? (
                            format(newWeekStart, "dd/MM/yyyy")
                          ) : (
                            <span className="text-xs text-neutral-600">DD/MM/AAAA</span>
                          )}
                          <CalendarIcon className="ml-auto h-3.5 w-3.5 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newWeekStart}
                          onSelect={setNewWeekStart}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Fim</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-[#0E0E0E] border-white/10 hover:bg-white/5 hover:text-white h-10 rounded-md",
                            !newWeekEnd && "text-neutral-500"
                          )}
                        >
                          {newWeekEnd ? (
                            format(newWeekEnd, "dd/MM/yyyy")
                          ) : (
                            <span className="text-xs text-neutral-600">DD/MM/AAAA</span>
                          )}
                          <CalendarIcon className="ml-auto h-3.5 w-3.5 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newWeekEnd}
                          onSelect={setNewWeekEnd}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Button 
                    onClick={handleCreateWeek} 
                    className="w-full lg:w-auto h-10 bg-red-600 hover:bg-red-500 text-white font-bold px-12 rounded-md transition-all duration-300 transform active:scale-95 text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] border border-transparent"
                >
                  INICIAR MISSÃO
                </Button>
            </div>
        </CardContent>
      </Card>

      {/* ACTIVE MISSIONS LIST */}
      <div className="space-y-8">
        {weeks.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/5 rounded-2xl animate-in fade-in duration-700 bg-white/[0.01]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-6 h-6 text-neutral-600" />
            </div>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-[0.2em]">Nenhuma Missão Semanal ativa</p>
            <p className="text-xs text-neutral-700 mt-2">Defina seu foco acima para começar a batalha.</p>
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