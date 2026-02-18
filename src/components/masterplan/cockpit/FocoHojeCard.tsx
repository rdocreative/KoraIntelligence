import React, { useState } from "react";
import { Zap, Plus, Sparkles, Target, ChevronRight, Link2, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
  missionName?: string;
}

interface Mission {
  id: string;
  goal: string;
  pillar?: string;
}

interface FocoHojeCardProps {
  tasks: DailyTask[];
  missions: Mission[]; // Nova prop para o seletor
  onAddTask: (text: string, missionId?: string) => void;
  onToggleTask: (id: string) => void;
}

export const FocoHojeCard = ({ tasks, missions, onAddTask, onToggleTask }: FocoHojeCardProps) => {
  const [newTask, setNewTask] = useState("");
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const today = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  // Encontra a missão selecionada para exibir o nome
  const selectedMission = missions.find(m => m.id === selectedMissionId);

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask(newTask.trim(), selectedMissionId || undefined);
      setNewTask("");
      // Opcional: manter a missão selecionada para adições em lote ou limpar
      // setSelectedMissionId(null); 
    }
  };

  const handleToggle = (id: string) => {
    setAnimatingId(id);
    onToggleTask(id);
    setTimeout(() => setAnimatingId(null), 600);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/10 shadow-2xl flex flex-col h-full">
      {/* Efeitos de fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-20 w-96 h-40 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 p-6 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/10">
              <Zap className="w-5 h-5 text-emerald-500" />
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
      <div className="relative z-10 p-6 space-y-3 min-h-[200px] flex-1">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-neutral-600" />
            </div>
            <p className="text-sm text-neutral-500 font-medium">Nenhuma tarefa para hoje</p>
            <p className="text-xs text-neutral-700 mt-1">Defina suas batalhas na linha de comando abaixo</p>
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
                  : "bg-white/[0.03] border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.05]",
                animatingId === task.id && !task.completed && "animate-pulse"
              )}
            >
              {/* XP Animation */}
              {animatingId === task.id && !task.completed && (
                <div className="absolute -top-2 right-4 text-xs font-black text-emerald-500 animate-bounce">
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
                    ? "bg-emerald-500 border-emerald-500" 
                    : "border-neutral-700 group-hover:border-emerald-500/50"
                )}>
                  {task.completed && (
                    <svg className="w-3.5 h-3.5 text-[#0A0A0A] font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
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

      {/* COMMAND LINE INPUT AREA */}
      <div className="relative z-20 p-6 pt-2 bg-gradient-to-t from-[#0A0A0A] to-transparent">
        <div className={cn(
          "flex items-center gap-2 bg-[#111] border rounded-xl px-2 h-14 transition-all duration-300 shadow-lg",
          selectedMissionId ? "border-emerald-500/30 ring-1 ring-emerald-500/10" : "border-white/10 focus-within:border-white/20"
        )}>
          
          {/* Mission Selector Trigger */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-9 px-2 rounded-lg transition-all hover:bg-white/5 gap-2",
                  selectedMissionId ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400" : "text-neutral-500 hover:text-white"
                )}
              >
                {selectedMissionId && selectedMission ? (
                   <>
                     <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[80px] sm:max-w-[120px]">
                       {selectedMission.goal}
                     </span>
                     <div 
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMissionId(null);
                        }}
                        className="hover:bg-emerald-500/20 rounded-full p-0.5"
                     >
                       <X className="w-3 h-3" />
                     </div>
                   </>
                ) : (
                   <>
                     <Link2 className="w-4 h-4" />
                     <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">Vincular Missão</span>
                   </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 bg-[#161616] border-white/10 backdrop-blur-xl" align="start" sideOffset={8}>
                <div className="mb-2 px-2 py-1 text-[10px] uppercase font-bold text-neutral-500 tracking-widest">
                  Selecionar Missão Ativa
                </div>
                {missions.length === 0 ? (
                  <div className="text-xs text-neutral-500 px-2 py-2">Nenhuma missão ativa.</div>
                ) : (
                  <div className="space-y-1">
                    {missions.map(m => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedMissionId(m.id);
                          setIsPopoverOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 text-xs text-neutral-300 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                         <Target className="w-3 h-3 text-neutral-600 group-hover:text-emerald-500 transition-colors" />
                         <span className="truncate">{m.goal}</span>
                      </button>
                    ))}
                  </div>
                )}
            </PopoverContent>
          </Popover>

          {/* Input Text */}
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Comando: Adicionar tarefa tática..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-neutral-600 h-full px-2"
            autoComplete="off"
          />

          {/* Action Button (Cyber Green) */}
          <button
            onClick={handleAddTask}
            disabled={!newTask.trim()}
            className="h-9 w-9 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5 text-[#0A0A0A]" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};