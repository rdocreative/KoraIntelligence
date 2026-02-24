"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, Calendar, ChevronRight, CheckCircle2, AlertCircle, 
  Target, Zap, ArrowDown, Terminal, HelpCircle, Trash2, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Reusable Helper Component for the Tooltip
const InfoTooltip = ({ text }: { text: string }) => (
  <TooltipProvider>
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button className="outline-none ml-2">
            <HelpCircle className="w-[14px] h-[14px] text-[#555] hover:text-primary transition-colors" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-[#1A1A1A] border-[#333] text-[#AAAAAA] max-w-[220px] rounded-lg p-3 text-xs leading-relaxed">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const ExecutionTab = ({
  currentMonth,
  currentMonthIndex,
  addMonthGoal,
  toggleMonthGoal,
  updateMonth,
  weeks,
  addWeek,
  deleteWeek,
  addWeekTask,
  toggleWeekTask,
  updateWeekReview
}: any) => {

  const [newMonthGoal, setNewMonthGoal] = useState("");
  const [newWeekTask, setNewWeekTask] = useState("");
  const [activeWeekId, setActiveWeekId] = useState<string | null>(null);
  const [weekToDelete, setWeekToDelete] = useState<string | null>(null);

  // Helper to find current active week
  React.useEffect(() => {
    if (weeks && weeks.length > 0 && !activeWeekId) {
      const now = new Date();
      const current = weeks.find((w: any) => new Date(w.endDate) >= now);
      if (current) setActiveWeekId(current.id);
      else setActiveWeekId(weeks[0].id); 
    }
  }, [weeks, activeWeekId]);

  const activeWeek = weeks.find((w: any) => w.id === activeWeekId);

  const MAX_WEEKS = 4;
  const MAX_TASKS = 7;
  const canCreateWeek = weeks.length < MAX_WEEKS;
  const canAddTask = activeWeek ? activeWeek.tasks.length < MAX_TASKS : false;

  const handleAddMonthGoal = () => {
    if (!newMonthGoal.trim()) return;
    addMonthGoal(currentMonthIndex, newMonthGoal);
    setNewMonthGoal("");
  };

  const handleAddWeekTask = () => {
    if (!newWeekTask.trim() || !activeWeekId || !canAddTask) return;
    addWeekTask(activeWeekId, newWeekTask);
    setNewWeekTask("");
  };

  const handleCreateWeek = () => {
    if (!canCreateWeek) return;

    const now = new Date();
    const end = new Date();
    end.setDate(now.getDate() + 7);
    
    addWeek({
        title: `Semana ${weeks.length + 1}`,
        startDate: now.toISOString(),
        endDate: end.toISOString(),
        tasks: [],
        review: ""
    });
  };

  const confirmDeleteWeek = () => {
    if (weekToDelete) {
      deleteWeek(weekToDelete);
      if (activeWeekId === weekToDelete) {
        setActiveWeekId(null);
      }
      setWeekToDelete(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* LEFT COLUMN: MONTHLY STRATEGY */}
      <div className="space-y-6 lg:col-span-1">
        <div className="sticky top-24 space-y-6">
            <Card className="bg-[#111111] border-white/5 shadow-xl">
                <CardHeader className="border-b border-white/5 pb-4">
                    <CardTitle className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                           <Target className="w-4 h-4" /> Estratégia Mensal
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-neutral-500">{currentMonth?.name}</span>
                            <InfoTooltip text="As metas que você quer conquistar neste mês. Elas devem alimentar os seus pilares." />
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-3">
                        {currentMonth?.goals.map((goal: any) => (
                            <div key={goal.id} className="group flex items-start gap-3 p-3 rounded-lg bg-[#0A0A0A] border border-white/5 hover:border-primary/30 transition-all">
                                <Checkbox 
                                    checked={goal.completed}
                                    onCheckedChange={() => toggleMonthGoal(currentMonthIndex, goal.id)}
                                    className="mt-0.5 border-neutral-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <span className={cn(
                                    "text-sm font-medium leading-relaxed transition-colors",
                                    goal.completed ? "text-neutral-600 line-through" : "text-neutral-200"
                                )}>
                                    {goal.text}
                                </span>
                            </div>
                        ))}
                        {(!currentMonth?.goals || currentMonth.goals.length === 0) && (
                            <div className="text-center py-8 px-4 border border-dashed border-neutral-800 rounded-lg">
                                <p className="text-xs text-neutral-500 font-mono">Nenhuma diretriz estratégica para este mês.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Input 
                            placeholder="Adicionar objetivo chave..." 
                            value={newMonthGoal}
                            onChange={(e) => setNewMonthGoal(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddMonthGoal()}
                            className="bg-[#0A0A0A] border-white/10 text-xs h-10 focus-visible:ring-primary/50"
                        />
                        <Button size="icon" onClick={handleAddMonthGoal} className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shrink-0">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" /> Lembrete Tático
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                    Não confunda movimento com progresso. Suas ações diárias devem servir diretamente aos objetivos mensais acima.
                </p>
            </div>
        </div>
      </div>

      {/* RIGHT COLUMN: WEEKLY EXECUTION (MAIN) */}
      <div className="space-y-6 lg:col-span-2">
        
        {/* Week Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {weeks.map((week: any) => (
                <div key={week.id} className="relative group/week">
                    <button
                        onClick={() => setActiveWeekId(week.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap pr-8",
                            activeWeekId === week.id 
                                ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_20px_rgba(var(--primary),0.3)]" 
                                : "bg-[#111111] text-neutral-500 border-white/5 hover:border-white/20 hover:text-neutral-300"
                        )}
                    >
                        {week.title}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setWeekToDelete(week.id);
                        }}
                        className={cn(
                            "absolute right-1 top-1 bottom-1 w-6 flex items-center justify-center rounded hover:bg-black/20 transition-all opacity-0 group-hover/week:opacity-100",
                            activeWeekId === week.id ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-neutral-500 hover:text-primary"
                        )}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
            
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <div>
                            <button 
                                onClick={handleCreateWeek}
                                disabled={!canCreateWeek}
                                className={cn(
                                    "flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-dashed border-neutral-700 text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ml-2",
                                    canCreateWeek 
                                        ? "text-neutral-500 hover:text-white hover:border-white/30 cursor-pointer" 
                                        : "opacity-40 cursor-not-allowed text-neutral-600"
                                )}
                            >
                                <Plus className="w-3 h-3" /> Nova Semana
                            </button>
                        </div>
                    </TooltipTrigger>
                    {!canCreateWeek && (
                        <TooltipContent className="bg-[#1A1A1A] border-[#333] text-white text-xs">
                            Um mês tem no máximo 4 semanas. Gerencie as existentes antes de criar uma nova.
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        </div>

        {activeWeek ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                
                {/* Tactical Header */}
                <div className="flex items-center justify-between bg-[#111111] p-4 rounded-xl border border-white/5">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                <Zap className="w-5 h-5 text-primary fill-current" />
                                Foco de Hoje
                            </h2>
                            <InfoTooltip text="Suas tarefas de hoje. Devem estar conectadas ao foco da semana." />
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono mt-1 uppercase tracking-widest pl-8">
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Conclusão</span>
                        <span className="text-2xl font-black text-white tracking-tighter">
                            {activeWeek.tasks.length > 0 
                                ? Math.round((activeWeek.tasks.filter((t: any) => t.completed).length / activeWeek.tasks.length) * 100) 
                                : 0}%
                        </span>
                    </div>
                </div>

                {/* TASK LIST OR EMPTY STATE */}
                <div className="space-y-1">
                    {activeWeek.tasks.length > 0 ? (
                        <div className="space-y-3 min-h-[200px]">
                            {activeWeek.tasks.map((task: any) => (
                                <div 
                                    key={task.id} 
                                    className={cn(
                                        "group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300",
                                        task.completed 
                                            ? "bg-[#0A0A0A]/50 border-white/5 opacity-60" 
                                            : "bg-[#161616] border-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary),0.1)] hover:-translate-y-0.5"
                                    )}
                                >
                                    <button 
                                        onClick={() => toggleWeekTask(activeWeek.id, task.id)}
                                        className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                            task.completed 
                                                ? "bg-primary border-primary text-primary-foreground" 
                                                : "border-neutral-600 group-hover:border-primary"
                                        )}
                                    >
                                        {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </button>
                                    
                                    <span className={cn(
                                        "flex-1 text-sm font-medium transition-all",
                                        task.completed ? "text-neutral-500 line-through decoration-2" : "text-white"
                                    )}>
                                        {task.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-neutral-800 rounded-xl bg-[#0A0A0A] relative overflow-hidden group">
                            <div className="relative z-10 text-center space-y-6 max-w-sm">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-neutral-300 uppercase tracking-widest">
                                        Nenhuma batalha definida
                                    </h3>
                                    <p className="text-xs text-neutral-500 font-mono leading-relaxed">
                                        O inimigo avança enquanto você hesita. Defina suas ordens para o dia agora.
                                    </p>
                                </div>
                                
                                <div className="flex flex-col items-center gap-2 animate-bounce pt-4 opacity-60">
                                    <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">
                                        Iniciar Protocolo
                                    </span>
                                    <ArrowDown className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="relative pt-2">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent -z-10" />
                    <div className={cn(
                        "flex gap-0 group rounded-xl transition-all shadow-2xl",
                        canAddTask ? "focus-within:ring-2 focus-within:ring-primary/30" : "opacity-70 cursor-not-allowed"
                    )}>
                        <div className="bg-[#1A1A1A] flex items-center justify-center pl-4 rounded-l-xl border-y border-l border-white/10 group-focus-within:border-primary/50 transition-colors">
                            <Terminal className="w-5 h-5 text-neutral-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <Input 
                            value={newWeekTask}
                            disabled={!canAddTask}
                            onChange={(e) => setNewWeekTask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddWeekTask()}
                            placeholder={canAddTask ? "Comando: Adicionar tarefa tática..." : "7 batalhas por dia é o limite."}
                            className={cn(
                                "h-14 bg-[#1A1A1A] border-y border-r border-l-0 border-white/10 rounded-l-none rounded-r-xl focus-visible:ring-0 focus-visible:border-primary/50 text-base font-medium shadow-none transition-all",
                                canAddTask ? "text-white placeholder:text-neutral-600" : "text-red-500 placeholder:text-red-500/60 cursor-not-allowed"
                            )}
                        />
                        <Button 
                            onClick={handleAddWeekTask}
                            disabled={!canAddTask}
                            className={cn(
                                "absolute right-2 top-2 bottom-2 px-6 font-bold text-xs uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all",
                                canAddTask 
                                    ? "bg-primary hover:bg-primary/90 text-primary-foreground transform active:scale-95" 
                                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none"
                            )}
                        >
                            Executar
                        </Button>
                    </div>
                </div>

            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-neutral-800 rounded-xl bg-[#0A0A0A]">
                <Calendar className="w-12 h-12 text-neutral-800 mb-4" />
                <h3 className="text-lg font-bold text-neutral-400 uppercase tracking-widest mb-2">Semana Inativa</h3>
                <p className="text-xs text-neutral-600 max-w-xs text-center mb-6">Inicie uma nova semana para começar a operar.</p>
                <Button onClick={handleCreateWeek} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase text-xs font-bold tracking-widest">
                    Iniciar Ciclo Semanal
                </Button>
            </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!weekToDelete} onOpenChange={(open) => !open && setWeekToDelete(null)}>
        <AlertDialogContent className="bg-[#111111] border border-white/10 text-white">
            <AlertDialogHeader>
                <AlertDialogTitle className="text-white font-bold">Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription className="text-neutral-400">
                    Essa ação não pode ser desfeita.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white">Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteWeek} className="bg-primary hover:bg-primary/90 text-primary-foreground border-0">Confirmar Exclusão</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};