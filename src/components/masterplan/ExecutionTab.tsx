"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, Calendar, ChevronRight, CheckCircle2, AlertCircle, 
  Target, Zap, ArrowDown, Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  updateWeekReview: (weekId: string, review: string) => void;
}

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
}: ExecutionTabProps) => {

  const [newMonthGoal, setNewMonthGoal] = useState("");
  const [newWeekTask, setNewWeekTask] = useState("");
  const [activeWeekId, setActiveWeekId] = useState<string | null>(null);

  // Helper to find current active week
  React.useEffect(() => {
    if (weeks && weeks.length > 0 && !activeWeekId) {
      const now = new Date();
      const current = weeks.find(w => new Date(w.endDate) >= now);
      if (current) setActiveWeekId(current.id);
    }
  }, [weeks, activeWeekId]);

  const activeWeek = weeks.find(w => w.id === activeWeekId);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* LEFT COLUMN: MONTHLY STRATEGY */}
      <div className="space-y-6 lg:col-span-1">
        <div className="sticky top-24 space-y-6">
            <Card className="bg-[#111111] border-white/5 shadow-xl">
                <CardHeader className="border-b border-white/5 pb-4">
                    <CardTitle className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#E8251A] flex items-center gap-2">
                           <Target className="w-4 h-4" /> Estratégia Mensal
                        </span>
                        <span className="text-xs font-mono text-neutral-500">{currentMonth?.name}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-3">
                        {currentMonth?.goals.map((goal: any) => (
                            <div key={goal.id} className="group flex items-start gap-3 p-3 rounded-lg bg-[#0A0A0A] border border-white/5 hover:border-[#E8251A]/30 transition-all">
                                <Checkbox 
                                    checked={goal.completed}
                                    onCheckedChange={() => toggleMonthGoal(currentMonthIndex, goal.id)}
                                    className="mt-0.5 border-neutral-600 data-[state=checked]:bg-[#E8251A] data-[state=checked]:border-[#E8251A]"
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
                            className="bg-[#0A0A0A] border-white/10 text-xs h-10 focus-visible:ring-[#E8251A]/50"
                        />
                        <Button size="icon" onClick={handleAddMonthGoal} className="h-10 w-10 bg-[#E8251A] hover:bg-[#c91e14] text-white rounded-md shrink-0">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-[#E8251A]/5 border border-[#E8251A]/10">
                <h4 className="text-[10px] font-bold text-[#E8251A] uppercase tracking-widest mb-2 flex items-center gap-2">
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
            {weeks.map((week) => (
                <button
                    key={week.id}
                    onClick={() => setActiveWeekId(week.id)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap",
                        activeWeekId === week.id 
                            ? "bg-[#E8251A] text-white border-[#E8251A] shadow-[0_4px_20px_rgba(232,37,26,0.3)]" 
                            : "bg-[#111111] text-neutral-500 border-white/5 hover:border-white/20 hover:text-neutral-300"
                    )}
                >
                    {week.title}
                </button>
            ))}
            <button 
                onClick={handleCreateWeek}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-dashed border-neutral-700 text-neutral-500 hover:text-white hover:border-white/30 text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ml-2"
            >
                <Plus className="w-3 h-3" /> Nova Semana
            </button>
        </div>

        {activeWeek ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                
                {/* Tactical Header */}
                <div className="flex items-center justify-between bg-[#111111] p-4 rounded-xl border border-white/5">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <Zap className="w-5 h-5 text-[#E8251A] fill-current" />
                            Foco de Hoje
                        </h2>
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
                                            : "bg-[#161616] border-white/10 hover:border-[#E8251A]/50 hover:shadow-[0_0_20px_rgba(232,37,26,0.1)] hover:-translate-y-0.5"
                                    )}
                                >
                                    <button 
                                        onClick={() => toggleWeekTask(activeWeek.id, task.id)}
                                        className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                            task.completed 
                                                ? "bg-[#E8251A] border-[#E8251A] text-white" 
                                                : "border-neutral-600 group-hover:border-[#E8251A]"
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
                        // NEW EMPTY STATE (Tactical & Directive)
                        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-neutral-800 rounded-xl bg-[#0A0A0A] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(232,37,26,0.03)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                            
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
                                    <span className="text-[9px] font-bold text-[#E8251A] uppercase tracking-[0.2em]">
                                        Iniciar Protocolo
                                    </span>
                                    <ArrowDown className="w-4 h-4 text-[#E8251A]" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="relative pt-2">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent -z-10" />
                    <div className="flex gap-0 group focus-within:ring-2 focus-within:ring-[#E8251A]/30 rounded-xl transition-all shadow-2xl">
                        <div className="bg-[#1A1A1A] flex items-center justify-center pl-4 rounded-l-xl border-y border-l border-white/10 group-focus-within:border-[#E8251A]/50 transition-colors">
                            <Terminal className="w-5 h-5 text-neutral-500 group-focus-within:text-[#E8251A] transition-colors" />
                        </div>
                        <Input 
                            value={newWeekTask}
                            onChange={(e) => setNewWeekTask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddWeekTask()}
                            placeholder="Comando: Adicionar tarefa tática..." 
                            className="h-14 bg-[#1A1A1A] border-y border-r border-l-0 border-white/10 rounded-l-none rounded-r-xl focus-visible:ring-0 focus-visible:border-[#E8251A]/50 text-base font-medium placeholder:text-neutral-600 text-white shadow-none transition-all"
                        />
                        <Button 
                            onClick={handleAddWeekTask}
                            className="absolute right-2 top-2 bottom-2 bg-[#E8251A] hover:bg-[#c91e14] text-white px-6 font-bold text-xs uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(232,37,26,0.3)] transition-all transform active:scale-95"
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
                <p className="text-xs text-neutral-600 max-w-xs text-center mb-6">Você não tem um ciclo semanal ativo. Inicie uma nova semana para começar a operar.</p>
                <Button onClick={handleCreateWeek} variant="outline" className="border-[#E8251A] text-[#E8251A] hover:bg-[#E8251A] hover:text-white uppercase text-xs font-bold tracking-widest">
                    Iniciar Ciclo Semanal
                </Button>
            </div>
        )}

      </div>
    </div>
  );
};