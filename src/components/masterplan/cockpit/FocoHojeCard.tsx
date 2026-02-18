import React, { useState } from "react";
import { Zap, Plus, Sparkles, Target, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
  missionName?: string;
}

interface FocoHojeCardProps {
  tasks: DailyTask[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
}

export const FocoHojeCard = ({ tasks, onAddTask, onToggleTask }: FocoHojeCardProps) => {
  const [newTask, setNewTask] = useState("");
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const today = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask("");
    }
  };

  const handleToggle = (id: string) => {
    setAnimatingId(id);
    onToggleTask(id);
    setTimeout(() => setAnimatingId(null), 600);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/10 shadow-2xl">
      {/* Efeitos de fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-20 w-96 h-40 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 p-6 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/10">
              <Zap className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Foco de Hoje</h2>
              <p className="text-xs text-neutral-500 capitalize mt-0.5">{today}</p>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-3xl font-black text-white">{completedCount}</span>
            <span className="text-lg text-neutral-600 font-bold">/{totalCount}</span>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Concluídas</p>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="relative z-10 p-6 space-y-3 min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-neutral-600" />
            </div>
            <p className="text-sm text-neutral-500 font-medium">Nenhuma tarefa para hoje</p>
            <p className="text-xs text-neutral-700 mt-1">Adicione suas batalhas abaixo</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggle(task.id)}
              className={cn(
                "group relative p-4 rounded-xl border cursor-pointer transition-all duration-300",
                task.completed 
                  ? "bg-white/[0.02] border-white/5 opacity-50" 
                  : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]",
                animatingId === task.id && !task.completed && "animate-pulse"
              )}
            >
              {/* XP Animation */}
              {animatingId === task.id && !task.completed && (
                <div className="absolute -top-2 right-4 text-xs font-black text-green-500 animate-bounce">
                  +10 XP ✨
                </div>
              )}

              {/* Breadcrumb */}
              {task.missionName && (
                <div className="flex items-center gap-1 mb-2 opacity-60">
                  <Target className="w-2.5 h-2.5 text-neutral-500" />
                  <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    Missão <ChevronRight className="w-2.5 h-2.5" /> {task.missionName}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4">
                {/* Custom Checkbox */}
                <div className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0",
                  task.completed 
                    ? "bg-red-500 border-red-500" 
                    : "border-neutral-700 group-hover:border-red-500/50"
                )}>
                  {task.completed && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Task Text */}
                <span className={cn(
                  "text-sm font-medium transition-all duration-300",
                  task.completed ? "text-neutral-600 line-through" : "text-white"
                )}>
                  {task.text}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Input */}
      <div className="relative z-10 p-6 pt-0">
        <div className="flex gap-3">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Adicionar tarefa de hoje..."
            className="flex-1 bg-white/5 border-white/10 h-12 text-sm focus:border-red-500/50 focus:ring-red-500/20 rounded-xl placeholder:text-neutral-600"
          />
          <button
            onClick={handleAddTask}
            disabled={!newTask.trim()}
            className="h-12 w-12 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};