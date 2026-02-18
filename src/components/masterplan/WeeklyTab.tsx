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
import { Zap, LayoutDashboard, Trash2, CheckSquare, Save, Calendar as CalendarIcon, Briefcase, GraduationCap, Heart, User, CheckCircle2 } from "lucide-react";
import { TaskList } from "@/components/masterplan/TaskList";
import { TaskItem } from "@/hooks/useMasterplan";
import { cn } from "@/lib/utils";

interface WeeklyTabProps {
  weeks: any[];
  addWeek: (week: any) => void;
  deleteWeek: (id: string) => void;
  addWeekTask: (weekId: string, task: TaskItem) => void;
  toggleWeekTask: (weekId: string, taskId: string) => void;
  updateWeekReview: (weekId: string, field: string, value: string) => void;
}

export const WeeklyTab = ({ weeks, addWeek, deleteWeek, addWeekTask, toggleWeekTask, updateWeekReview }: WeeklyTabProps) => {
  const [newWeekStart, setNewWeekStart] = useState<Date>();
  const [newWeekEnd, setNewWeekEnd] = useState<Date>();
  const [newWeekGoal, setNewWeekGoal] = useState("");
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  const pillars = [
    { id: 'work', label: 'Trabalho', icon: Briefcase, color: 'text-blue-500', border: 'border-blue-500', bg: 'bg-blue-500/10' },
    { id: 'studies', label: 'Estudos', icon: GraduationCap, color: 'text-purple-500', border: 'border-purple-500', bg: 'bg-purple-500/10' },
    { id: 'health', label: 'Saúde', icon: Heart, color: 'text-red-500', border: 'border-red-500', bg: 'bg-red-500/10' },
    { id: 'personal', label: 'Pessoal', icon: User, color: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  const handleCreateWeek = () => {
    if (!newWeekStart || !newWeekEnd) return;
    
    const startDateStr = format(newWeekStart, 'yyyy-MM-dd');
    const endDateStr = format(newWeekEnd, 'yyyy-MM-dd');

    addWeek({
      startDate: startDateStr,
      endDate: endDateStr,
      goal: newWeekGoal,
      reviewDate: endDateStr,
      pillar: selectedPillar // Salvando o pilar
    });
    setNewWeekStart(undefined);
    setNewWeekEnd(undefined);
    setNewWeekGoal("");
    setSelectedPillar(null);
  };

  const getPillarStyles = (pillarId: string) => {
      const pillar = pillars.find(p => p.id === pillarId);
      if (!pillar) return { color: 'text-neutral-500', border: 'border-white/10', bg: 'bg-white/5' };
      return pillar;
  };

  return (
    <div className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-10">
      
      {/* NEW SPRINT CREATOR */}
      <Card className="bg-[#0A0A0A] border-white/10 shadow-lg">
        <CardHeader className="border-b border-white/5 pb-4 pt-5 px-6">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-red-500/10 rounded-md"><Zap className="w-4 h-4 text-red-500" /></div>
            <div>
               <CardTitle className="text-sm font-bold uppercase text-white tracking-wider">Nova Sprint</CardTitle>
               <CardDescription className="text-xs text-neutral-500 mt-0.5">Defina o foco, o pilar e o período.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5 px-6 pb-6 space-y-6">
            
            {/* Linha 1: Objetivo e Pilar */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Objetivo Único</Label>
                    <Input
                        value={newWeekGoal}
                        onChange={(e) => setNewWeekGoal(e.target.value)}
                        placeholder="Meta principal da semana..."
                        className="bg-[#0E0E0E] border-white/10 h-11 text-sm focus:border-red-500/50 transition-all focus:ring-1 focus:ring-red-500/20 rounded-lg"
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

            {/* Linha 2: Datas e Botão */}
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
                            <span className="text-xs">Data Início</span>
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
                            <span className="text-xs">Data Fim</span>
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
                  CRIAR SPRINT
                </Button>
            </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {weeks.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/5 rounded-2xl animate-in fade-in duration-700 bg-white/[0.01]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutDashboard className="w-6 h-6 text-neutral-600" />
            </div>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-[0.2em]">Nenhuma sprint ativa</p>
            <p className="text-xs text-neutral-700 mt-2">Defina seu foco acima para começar a batalha.</p>
          </div>
        )}

        {weeks.map((week) => {
            const pillarStyle = getPillarStyles(week.pillar);
            return (
              <div key={week.id} className="relative group">
                <Card className={cn("bg-[#0E0E0E] border overflow-hidden shadow-xl transition-all duration-300", week.pillar ? pillarStyle.border.replace('border-', 'border-opacity-30 border-') : "border-white/10 hover:border-white/20")}>
                  <CardHeader className="bg-white/[0.02] border-b border-white/5 py-4 px-6 relative">
                    {/* Indicador de Pilar */}
                    {week.pillar && (
                        <div className={cn("absolute left-0 top-0 bottom-0 w-1", pillarStyle.bg.replace('/10', ''))} />
                    )}
                    
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                             <CalendarIcon className="w-3 h-3" />
                             {format(new Date(week.startDate), "dd 'de' MMM", { locale: ptBR })} - {format(new Date(week.endDate), "dd 'de' MMM", { locale: ptBR })}
                          </div>
                          {week.pillar && (
                              <span className={cn("text-[9px] px-1.5 py-0.5 rounded border uppercase font-black tracking-widest", pillarStyle.color, pillarStyle.border, pillarStyle.bg)}>
                                {pillars.find(p => p.id === week.pillar)?.label}
                              </span>
                          )}
                        </div>
                        <h3 className="text-lg md:text-xl text-white font-bold uppercase tracking-tight leading-none pt-1">{week.goal}</h3>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteWeek(week.id)} className="h-8 w-8 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-md">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                      
                      {/* ESQUERDA: PLANO DE AÇÃO */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                          <CheckSquare className="w-3.5 h-3.5 text-red-500" />
                          <Label className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em]">Plano de Ação</Label>
                        </div>
                        <div className="min-h-[120px]">
                          <TaskList
                            items={week.tasks}
                            onAdd={(text) => addWeekTask(week.id, {
                               id: Date.now().toString(),
                               text: text,
                               completed: false
                            })}
                            onToggle={(taskId) => toggleWeekTask(week.id, taskId)}
                            placeholder="Adicionar tarefa..."
                          />
                        </div>
                      </div>

                      {/* DIREITA: REVIEW */}
                      <div className="p-6 space-y-4 bg-black/20">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                          <Save className="w-3.5 h-3.5 text-neutral-500" />
                          <Label className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em]">Review Semanal</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <span className="text-[9px] font-bold text-green-600/80 uppercase tracking-wider block mb-1">O que funcionou?</span>
                            <Textarea
                              value={week.review.worked}
                              onChange={(e) => updateWeekReview(week.id, 'worked', e.target.value)}
                              className="bg-[#0A0A0A] border-white/5 text-xs min-h-[60px] resize-none focus:border-green-500/30 rounded-md p-2 text-neutral-300"
                            />
                          </div>
                          <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <span className="text-[9px] font-bold text-red-500/80 uppercase tracking-wider block mb-1">O que falhou?</span>
                            <Textarea
                              value={week.review.didntWork}
                              onChange={(e) => updateWeekReview(week.id, 'didntWork', e.target.value)}
                              className="bg-[#0A0A0A] border-white/5 text-xs min-h-[60px] resize-none focus:border-red-500/30 rounded-md p-2 text-neutral-300"
                            />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <span className="text-[9px] font-bold text-yellow-500/80 uppercase tracking-wider block mb-1">Como melhorar?</span>
                            <Textarea
                              value={week.review.improve}
                              onChange={(e) => updateWeekReview(week.id, 'improve', e.target.value)}
                              className="bg-[#0A0A0A] border-white/5 text-xs h-[40px] resize-none focus:border-yellow-500/30 rounded-md p-2 text-neutral-300"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </div>
            );
        })}
      </div>
    </div>
  );
};