import React, { useState } from "react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Zap, LayoutDashboard, Trash2, CheckSquare, Save, Calendar as CalendarIcon, 
  ArrowRight, X, Plus, Target, Flame, Rocket, Star, Trophy, Crown
} from "lucide-react";
import { TaskList } from "@/components/masterplan/TaskList";
import { TaskItem } from "@/hooks/useMasterplan";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";

interface WeeklyTabProps {
  weeks: any[];
  addWeek: (week: any) => void;
  deleteWeek: (id: string) => void;
  addWeekTask: (weekId: string, task: TaskItem) => void;
  toggleWeekTask: (weekId: string, taskId: string) => void;
  updateWeekReview: (weekId: string, field: string, value: string) => void;
}

const SPRINT_ICONS = [
  { icon: Zap, label: "Energia" },
  { icon: Flame, label: "Intenso" },
  { icon: Target, label: "Foco" },
  { icon: Rocket, label: "Speed" },
  { icon: Star, label: "Brilho" },
  { icon: Trophy, label: "Vitória" },
  { icon: Crown, label: "Liderar" },
  { icon: CheckSquare, label: "Executar" },
];

export const WeeklyTab = ({ weeks, addWeek, deleteWeek, addWeekTask, toggleWeekTask, updateWeekReview }: WeeklyTabProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWeekStart, setNewWeekStart] = useState<Date>();
  const [newWeekEnd, setNewWeekEnd] = useState<Date>();
  const [newWeekGoal, setNewWeekGoal] = useState("");
  const [selectedIconIdx, setSelectedIconIdx] = useState(0);

  const handleCreateWeek = () => {
    if (!newWeekStart || !newWeekEnd || !newWeekGoal) return;
    
    const startDateStr = format(newWeekStart, 'yyyy-MM-dd');
    const endDateStr = format(newWeekEnd, 'yyyy-MM-dd');

    // Mapear o ícone selecionado para uma string ou objeto se necessário
    // Por enquanto salvamos apenas os dados padrão, mas a UI já suporta a seleção
    addWeek({
      startDate: startDateStr,
      endDate: endDateStr,
      goal: newWeekGoal,
      reviewDate: endDateStr,
      iconIndex: selectedIconIdx // Assumindo que o backend/hook aceite isso futuramente
    });

    setNewWeekStart(undefined);
    setNewWeekEnd(undefined);
    setNewWeekGoal("");
    setIsModalOpen(false);
  };

  const setNext7Days = () => {
    const start = new Date();
    const end = addDays(start, 6); // 7 dias total
    setNewWeekStart(start);
    setNewWeekEnd(end);
  };

  const SelectedIcon = SPRINT_ICONS[selectedIconIdx].icon;

  return (
    <div className="space-y-8 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* HEADER + BOTÃO DE NOVA SPRINT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-black uppercase text-white tracking-tight flex items-center gap-3">
            <Zap className="text-yellow-500 w-6 h-6 fill-yellow-500/20" />
            Sprints Semanais
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-md">
            Ciclos curtos de foco extremo. Defina um objetivo único e execute sem piedade.
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-wider rounded-lg px-6 h-10 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Plus className="w-4 h-4 mr-2" /> Nova Sprint
            </Button>
          </DialogTrigger>
          
          <DialogContent className="bg-[#0F0F0F] border border-white/10 p-0 gap-0 max-w-md rounded-2xl shadow-2xl overflow-hidden">
            {/* CABEÇALHO DO MODAL */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-neutral-900/30">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-red-600/10 flex items-center justify-center border border-red-600/20">
                    <Zap className="w-4 h-4 text-red-500" />
                 </div>
                 <span className="text-sm font-bold uppercase text-white tracking-widest">Nova Sprint</span>
              </div>
              <DialogClose className="text-neutral-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </DialogClose>
            </div>

            {/* CORPO DO MODAL */}
            <div className="p-6 space-y-6">
              
              {/* SELEÇÃO DE ÍCONE (MOOD) */}
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Mood da Sprint</Label>
                <div className="grid grid-cols-4 gap-2">
                  {SPRINT_ICONS.map((item, idx) => {
                    const Icon = item.icon;
                    const isSelected = selectedIconIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedIconIdx(idx)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all duration-200",
                          isSelected 
                            ? "bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
                            : "bg-[#151515] text-neutral-500 border-transparent hover:bg-neutral-800 hover:text-neutral-300"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* INPUT DE OBJETIVO */}
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Objetivo Único</Label>
                <Input
                  value={newWeekGoal}
                  onChange={(e) => setNewWeekGoal(e.target.value)}
                  placeholder="Ex: Lançar MVP, Fechar contrato X..."
                  className="bg-[#151515] border-white/5 h-12 text-sm text-white placeholder:text-neutral-600 focus:border-red-500/50 transition-all focus:ring-1 focus:ring-red-500/20 rounded-xl"
                />
              </div>

              {/* DATAS */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Período</Label>
                   <button onClick={setNext7Days} className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer">
                      Próximos 7 dias
                   </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-[#151515] border-white/5 hover:bg-neutral-800 hover:text-white h-12 rounded-xl",
                          !newWeekStart && "text-neutral-600"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {newWeekStart ? format(newWeekStart, "dd/MM") : <span className="text-xs">Início</span>}
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

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-[#151515] border-white/5 hover:bg-neutral-800 hover:text-white h-12 rounded-xl",
                          !newWeekEnd && "text-neutral-600"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {newWeekEnd ? format(newWeekEnd, "dd/MM") : <span className="text-xs">Fim</span>}
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

              {/* BOTÃO DE AÇÃO */}
              <Button 
                onClick={handleCreateWeek} 
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-red-900/20 active:scale-[0.98] text-xs"
                disabled={!newWeekGoal || !newWeekStart || !newWeekEnd}
              >
                Criar Sprint
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* LISTA DE SPRINTS */}
      <div className="space-y-8">
        {weeks.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl animate-in fade-in duration-500 bg-[#0A0A0A]/30">
            <div className="w-20 h-20 bg-neutral-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
               <Zap className="w-8 h-8 text-neutral-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sem Foco Definido</h3>
            <p className="text-sm text-neutral-500 max-w-xs mx-auto mb-8">
              Crie uma sprint para organizar suas tarefas e definir um objetivo claro para a semana.
            </p>
            <Button onClick={() => setIsModalOpen(true)} variant="outline" className="border-white/10 text-neutral-400 hover:text-white hover:bg-white/5">
              Começar Agora
            </Button>
          </div>
        )}

        {weeks.map((week) => (
          <div key={week.id} className="relative group animate-in slide-in-from-bottom-2 duration-500">
            {/* Decoração de fundo sutil */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm" />
            
            <Card className="relative bg-[#0A0A0A] border-white/10 overflow-hidden shadow-2xl transition-all duration-300">
              <CardHeader className="bg-neutral-900/30 border-b border-white/5 py-5 px-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-2">
                         <CalendarIcon className="w-3 h-3" />
                         {format(new Date(week.startDate), "dd MMM", { locale: ptBR })} - {format(new Date(week.endDate), "dd MMM", { locale: ptBR })}
                      </div>
                      {/* Mostrar label do ícone se possível, ou apenas um badge genérico */}
                      <div className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[10px] font-bold uppercase text-red-500 tracking-wider">
                        Em Progresso
                      </div>
                    </div>
                    <h3 className="text-xl md:text-2xl text-white font-black uppercase tracking-tight leading-none pt-2">
                      {week.goal}
                    </h3>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteWeek(week.id)} className="h-8 w-8 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-lg opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                  
                  {/* ESQUERDA: PLANO DE AÇÃO */}
                  <div className="p-6 space-y-5">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <CheckSquare className="w-3.5 h-3.5 text-red-500" />
                      <Label className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em]">Plano de Ação</Label>
                    </div>
                    <div className="min-h-[120px]">
                      <TaskList
                        items={week.tasks}
                        onAdd={(t) => addWeekTask(week.id, t)}
                        onToggle={(taskId) => toggleWeekTask(week.id, taskId)}
                        placeholder="Adicionar tarefa chave..."
                      />
                    </div>
                  </div>

                  {/* DIREITA: REVIEW */}
                  <div className="p-6 space-y-5 bg-[#050505]/50">
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
                          className="bg-[#0F0F0F] border-white/5 text-xs min-h-[70px] resize-none focus:border-green-500/30 rounded-lg p-3 text-neutral-300 transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <span className="text-[9px] font-bold text-red-500/80 uppercase tracking-wider block mb-1">O que falhou?</span>
                        <Textarea
                          value={week.review.didntWork}
                          onChange={(e) => updateWeekReview(week.id, 'didntWork', e.target.value)}
                          className="bg-[#0F0F0F] border-white/5 text-xs min-h-[70px] resize-none focus:border-red-500/30 rounded-lg p-3 text-neutral-300 transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <span className="text-[9px] font-bold text-yellow-500/80 uppercase tracking-wider block mb-1">Como melhorar na próxima?</span>
                        <Textarea
                          value={week.review.improve}
                          onChange={(e) => updateWeekReview(week.id, 'improve', e.target.value)}
                          className="bg-[#0F0F0F] border-white/5 text-xs h-[50px] resize-none focus:border-yellow-500/30 rounded-lg p-3 text-neutral-300 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};