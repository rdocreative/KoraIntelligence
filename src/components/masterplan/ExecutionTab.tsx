"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Calendar, CheckCircle2, AlertCircle, 
  Target, Zap, ArrowDown, Terminal, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
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

interface ExecutionTabProps {
  currentMonth: any;
  currentMonthIndex: number;
  addMonthGoal: (monthIndex: number, text: string) => void;
  toggleMonthGoal: (monthIndex: number, goalId: string) => void;
  updateMonth: (monthIndex: number, data: any) => void;
  weeks: any[];
  addWeek: (weekData: any) => void;
  deleteWeek: (weekId: string) => void;
  addWeekTask: (weekId: string, text: string) => void;
  toggleWeekTask: (weekId: string, taskId: string) => void;
  updateWeekReview: (weekId: string, field: "worked" | "didntWork" | "improve", value: string) => void;
}

export const ExecutionTab = ({
  currentMonth,
  currentMonthIndex,
  addMonthGoal,
  toggleMonthGoal,
  weeks,
  addWeek,
  deleteWeek,
  addWeekTask,
  toggleWeekTask
}: ExecutionTabProps) => {

  const [newMonthGoal, setNewMonthGoal] = useState("");
  const [newWeekTask, setNewWeekTask] = useState("");
  const [activeWeekId, setActiveWeekId] = useState<string | null>(null);
  const [weekToDelete, setWeekToDelete] = useState<string | null>(null);

  React.useEffect(() => {
    if (weeks && weeks.length > 0 && !activeWeekId) {
      const now = new Date();
      const current = weeks.find(w => new Date(w.endDate) >= now);
      if (current) setActiveWeekId(current.id);
      else setActiveWeekId(weeks[0].id);
    }
  }, [weeks, activeWeekId]);

  const activeWeek = weeks.find(w => w.id === activeWeekId);
  const MAX_WEEKS = 4;
  const canCreateWeek = weeks.length < MAX_WEEKS;

  const handleAddMonthGoal = () => {
    if (!newMonthGoal.trim()) return;
    addMonthGoal(currentMonthIndex, newMonthGoal);
    setNewMonthGoal("");
  };

  const handleAddWeekTask = () => {
    if (!newWeekTask.trim() || !activeWeekId) return;
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
            <div className="panel p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6 border-b-2 border-duo-gray pb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-card-purple flex items-center gap-2">
                       <Target className="w-4 h-4" /> Estratégia Mensal
                    </span>
                    <span className="text-xs font-bold text-gray-500 uppercase">{currentMonth?.name}</span>
                </div>
                
                <div className="space-y-3 mb-6">
                    {currentMonth?.goals.map((goal: any) => (
                        <div key={goal.id} className="list-item-card bg-duo-sidebar border-duo-gray p-3 flex items-start gap-3 hover:border-card-purple">
                            <button 
                                onClick={() => toggleMonthGoal(currentMonthIndex, goal.id)}
                                className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all mt-0.5",
                                    goal.completed ? "bg-card-purple border-card-purple" : "border-gray-500"
                                )}
                            >
                                {goal.completed && <CheckCircle2 size={12} className="text-white" />}
                            </button>
                            <span className={cn(
                                "text-sm font-bold transition-colors leading-tight",
                                goal.completed ? "text-gray-500 line-through" : "text-white"
                            )}>
                                {goal.text}
                            </span>
                        </div>
                    ))}
                    {(!currentMonth?.goals || currentMonth.goals.length === 0) && (
                        <div className="text-center py-6 px-4 border-2 border-dashed border-duo-gray rounded-2xl">
                            <p className="text-xs text-gray-500 font-bold uppercase">Nenhuma meta definida.</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Input 
                        placeholder="Adicionar objetivo..." 
                        value={newMonthGoal}
                        onChange={(e) => setNewMonthGoal(e.target.value)}
                        className="bg-duo-bg border-2 border-duo-gray h-12 rounded-xl text-white font-bold text-sm"
                    />
                    <Button onClick={handleAddMonthGoal} className="h-12 w-12 rounded-xl bg-card-purple shadow-3d-purple hover:-translate-y-0.5 active:translate-y-[1px] active:shadow-none p-0">
                        <Plus className="w-6 h-6 text-white" />
                    </Button>
                </div>
            </div>

            <div className="p-4 rounded-3xl bg-card-red/10 border-2 border-card-red/20">
                <h4 className="text-[10px] font-black text-card-red uppercase tracking-widest mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Lembrete Tático
                </h4>
                <p className="text-xs text-gray-400 font-bold leading-relaxed">
                    Não confunda movimento com progresso. Suas ações diárias devem servir diretamente aos objetivos mensais.
                </p>
            </div>
        </div>
      </div>

      {/* RIGHT COLUMN: WEEKLY EXECUTION */}
      <div className="space-y-6 lg:col-span-2">
        
        {/* Week Selector */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 px-1">
            {weeks.map((week) => (
                <div key={week.id} className="relative group/week">
                    <button
                        onClick={() => setActiveWeekId(week.id)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-3 rounded-2xl border-b-4 font-extrabold uppercase text-xs tracking-wider transition-all whitespace-nowrap min-w-[120px] justify-center",
                            activeWeekId === week.id 
                                ? "bg-card-orange border-card-orange-shadow text-white -translate-y-[1px]" 
                                : "bg-duo-panel border-duo-gray text-gray-500 hover:bg-duo-gray"
                        )}
                    >
                        {week.title}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setWeekToDelete(week.id);
                        }}
                        className="absolute -top-2 -right-2 bg-card-red text-white p-1 rounded-full opacity-0 group-hover/week:opacity-100 transition-opacity shadow-sm scale-75 hover:scale-100"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            ))}
            
            <button 
                onClick={handleCreateWeek}
                disabled={!canCreateWeek}
                className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed font-bold uppercase text-xs tracking-wider transition-all whitespace-nowrap",
                    canCreateWeek 
                        ? "border-duo-gray text-gray-500 hover:text-white hover:border-white hover:bg-white/5" 
                        : "border-duo-gray/30 text-gray-700 cursor-not-allowed"
                )}
            >
                <Plus className="w-4 h-4" /> Nova Semana
            </button>
        </div>

        {activeWeek ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                
                {/* Tactical Header */}
                <div className="panel p-6 flex items-center justify-between bg-gradient-to-r from-duo-panel to-duo-sidebar">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="bg-card-orange/20 p-2 rounded-xl">
                                <Zap className="w-6 h-6 text-card-orange fill-card-orange" />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">Foco de Hoje</h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1">Conclusão</span>
                        <span className="text-3xl font-black text-white tracking-tighter">
                            {activeWeek.tasks.length > 0 
                                ? Math.round((activeWeek.tasks.filter((t: any) => t.completed).length / activeWeek.tasks.length) * 100) 
                                : 0}%
                        </span>
                    </div>
                </div>

                {/* TASK LIST OR EMPTY STATE */}
                <div className="space-y-3">
                    {activeWeek.tasks.length > 0 ? (
                        <div className="grid gap-3">
                            {activeWeek.tasks.map((task: any) => (
                                <div 
                                    key={task.id} 
                                    className={cn(
                                        "list-item-card bg-duo-panel border-duo-gray p-4 flex items-center gap-4 hover:border-card-orange group",
                                        task.completed && "opacity-60 bg-duo-bg"
                                    )}
                                >
                                    <button 
                                        onClick={() => toggleWeekTask(activeWeek.id, task.id)}
                                        className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                                            task.completed 
                                                ? "bg-card-orange border-card-orange text-white" 
                                                : "border-gray-500 group-hover:border-card-orange"
                                        )}
                                    >
                                        {task.completed && <CheckCircle2 className="w-4 h-4" />}
                                    </button>
                                    
                                    <span className={cn(
                                        "flex-1 text-sm font-bold transition-all",
                                        task.completed ? "text-gray-500 line-through" : "text-white"
                                    )}>
                                        {task.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="panel p-12 text-center flex flex-col items-center border-dashed border-4 border-duo-gray bg-transparent shadow-none">
                            <h3 className="text-xl font-extrabold text-gray-300 uppercase mb-2">
                                Nenhuma batalha
                            </h3>
                            <p className="text-sm text-gray-500 font-bold max-w-xs mx-auto mb-6">
                                O inimigo avança enquanto você hesita. Defina suas ordens para o dia agora.
                            </p>
                            <div className="animate-bounce">
                                <ArrowDown className="w-6 h-6 text-card-orange" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                           <Terminal size={20} />
                        </div>
                        <Input 
                            value={newWeekTask}
                            onChange={(e) => setNewWeekTask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddWeekTask()}
                            placeholder="Comando: Adicionar tarefa tática..."
                            className="bg-duo-panel border-2 border-duo-gray h-14 pl-12 rounded-2xl text-white font-bold shadow-3d-panel focus:border-card-orange focus:ring-0"
                        />
                    </div>
                    <Button 
                        onClick={handleAddWeekTask}
                        className="h-14 px-8 bg-card-orange text-white font-extrabold uppercase tracking-widest rounded-2xl shadow-3d-orange hover:-translate-y-0.5 active:translate-y-[1px] active:shadow-none"
                    >
                        Executar
                    </Button>
                </div>

            </div>
        ) : (
            <div className="panel p-12 flex flex-col items-center justify-center text-center">
                <Calendar className="w-16 h-16 text-duo-gray mb-6" />
                <h3 className="text-xl font-extrabold text-white uppercase mb-2">Semana Inativa</h3>
                <p className="text-sm text-gray-500 font-bold max-w-xs mb-8">Você não tem um ciclo semanal ativo.</p>
                <Button onClick={handleCreateWeek} className="btn-primary h-12 px-8">
                    Iniciar Ciclo Semanal
                </Button>
            </div>
        )}

      </div>

      <AlertDialog open={!!weekToDelete} onOpenChange={(open) => !open && setWeekToDelete(null)}>
        <AlertDialogContent className="bg-duo-panel border-2 border-duo-gray text-white rounded-3xl shadow-3d-panel">
            <AlertDialogHeader>
                <AlertDialogTitle className="font-extrabold uppercase">Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription className="font-bold text-gray-400">
                    Isso apagará todas as tarefas desta semana.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="bg-duo-gray border-none text-white font-bold rounded-xl h-10 hover:bg-gray-600">Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteWeek} className="bg-card-red text-white font-bold rounded-xl h-10 hover:bg-red-600">Apagar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};