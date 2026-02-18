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
    <div className="relative overflow-hidden rounded-2xl bg-[#141414] border border-neutral-700/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
      {/* Efeitos de fundo sutis para dar profundidade sem tirar o foco */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 p-7 pb-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-lg shadow-red-900/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">Foco de Hoje</h2>
              <p className="text-xs text-neutral-400 font-medium capitalize mt-1 tracking-wide">{today}</p>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-4xl font-black text-white tracking-tighter">{completedCount}</span>
            <span className="text-xl text-neutral-600 font-bold tracking-tighter">/{totalCount}</span>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="relative z-10 p-7 space-y-3 min-h-[220px]">
        {tasks.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-5 border border-white/5">
              <Sparkles className="w-7 h-7 text-neutral-500" />
            </div>
            <p className="text-base text-neutral-300 font-semibold">Tudo limpo por aqui</p>
            <p className="text-xs text-neutral-500 mt-1 max-w-[200px] mx-auto">Adicione suas missões críticas para dominar o dia.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggle(task.id)}
              className={cn(
                "group relative p-4 rounded-xl border cursor-pointer transition-all duration-300",
                task.completed 
                  ? "bg-black/20 border-transparent opacity-40" 
                  : "bg-[#1A1A1A] border-white/5 hover:border-red-500/30 hover:bg-[#1F1F1F] shadow-sm",
                animatingId === task.id && !task.completed && "animate-pulse"
              )}
            >
              {/* XP Animation */}
              {animatingId === task.id && !task.completed && (
                <div className="absolute -top-2 right-4 text-xs font-black text-green-500 animate-bounce bg-[#141414] px-2 py-0.5 rounded-full border border-green-900/30 z-20">
                  +10 XP ✨
                </div>
              )}

              {/* Breadcrumb */}
              {task.missionName && (
                <div className="flex items-center gap-1.5 mb-2.5 opacity-60">
                  <Target className="w-3 h-3 text-red-500/70" />
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    {task.missionName}
                  </span>
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Custom Checkbox */}
                <div className={cn(
                  "mt-0.5 w-5 h-5 rounded-[6px] border-2 flex items-center justify-center transition-all duration-300 shrink-0",
                  task.completed 
                    ? "bg-red-600 border-red-600" 
                    : "border-neutral-600 bg-neutral-800/50 group-hover:border-red-500 group-hover:bg-red-500/10"
                )}>
                  {task.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Task Text */}
                <span className={cn(
                  "text-sm font-medium transition-all duration-300 leading-tight",
                  task.completed ? "text-neutral-500 line-through decoration-neutral-700" : "text-neutral-100"
                )}>
                  {task.text}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Input */}
      <div className="relative z-10 p-7 pt-2 pb-8">
        <div className="flex gap-3">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="O que precisa ser feito hoje?"
            className="flex-1 bg-[#0A0A0A] border-white/10 h-12 text-sm focus:border-red-500/50 focus:ring-red-500/10 rounded-xl placeholder:text-neutral-600 text-white shadow-inner"
          />
          <button
            onClick={handleAddTask}
            disabled={!newTask.trim()}
            className="h-12 w-12 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-800 flex items-center justify-center transition-all duration-300 shadow-lg shadow-red-900/20 hover:shadow-red-900/40"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};