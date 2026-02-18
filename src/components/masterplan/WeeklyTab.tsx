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
import { Zap, LayoutDashboard, Trash2, CheckSquare, Save, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
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

  const handleCreateWeek = () => {
    if (!newWeekStart || !newWeekEnd) return;
    const startDateStr = format(newWeekStart, 'yyyy-MM-dd');
    const endDateStr = format(newWeekEnd, 'yyyy-MM-dd');

    addWeek({
      startDate: startDateStr,
      endDate: endDateStr,
      goal: newWeekGoal,
      reviewDate: endDateStr
    });
    setNewWeekStart(undefined);
    setNewWeekEnd(undefined);
    setNewWeekGoal("");
  };

  return (
    <div className="space-y-8 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-10">
      
      {/* NEW SPRINT CREATOR - TRANSPARENTE */}
      <Card className="bg-transparent border-white/10 shadow-none">
        <CardHeader className="pb-4 pt-5 px-0">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-red-500" />
            <CardTitle className="text-sm font-bold uppercase text-white tracking-wider">Nova Sprint</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-0 pb-6">
          <div className="flex flex-col lg:flex-row gap-5 items-end">
            <div className="space-y-1.5 flex-1 w-full">
              <Label className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest pl-1">Objetivo Único</Label>
              <Input
                value={newWeekGoal}
                onChange={(e) => setNewWeekGoal(e.target.value)}
                placeholder="Qual o foco desta semana?"
                className="bg-transparent border-0 border-b border-white/10 h-10 text-sm focus:border-red-500 transition-all rounded-none px-0"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest pl-1">Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full lg:w-[140px] pl-0 text-left font-normal bg-transparent border-0 border-b border-white/10 hover:bg-white/5 rounded-none h-10", !newWeekStart && "text-neutral-700")}>
                      {newWeekStart ? format(newWeekStart, "dd/MM/yyyy") : <span className="text-xs">Data Início</span>}
                      <CalendarIcon className="ml-auto h-3 w-3 opacity-30" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={newWeekStart} onSelect={setNewWeekStart} initialFocus /></PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <Label className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest pl-1">Fim</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full lg:w-[140px] pl-0 text-left font-normal bg-transparent border-0 border-b border-white/10 hover:bg-white/5 rounded-none h-10", !newWeekEnd && "text-neutral-700")}>
                      {newWeekEnd ? format(newWeekEnd, "dd/MM/yyyy") : <span className="text-xs">Data Fim</span>}
                      <CalendarIcon className="ml-auto h-3 w-3 opacity-30" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={newWeekEnd} onSelect={setNewWeekEnd} initialFocus /></PopoverContent>
                </Popover>
              </div>
            </div>

            <Button onClick={handleCreateWeek} className="w-full lg:w-auto h-10 bg-white text-black hover:bg-neutral-200 font-bold px-8 rounded-full transition-all active:scale-95 text-[10px] uppercase tracking-widest">
              Criar <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-10">
        {weeks.length === 0 && (
          <div className="text-center py-20 opacity-20 border border-dashed border-white/10 rounded-2xl bg-transparent">
            <p className="text-sm font-bold uppercase tracking-widest text-neutral-500">Aguardando definição de sprint</p>
          </div>
        )}

        {weeks.map((week) => (
          <div key={week.id} className="relative group">
            <Card className="bg-transparent border-white/10 shadow-none overflow-hidden hover:border-white/20 transition-all duration-300">
              <CardHeader className="border-b border-white/5 py-5 px-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-neutral-600 tracking-[0.2em]">
                       {format(new Date(week.startDate), "dd 'de' MMM", { locale: ptBR })} - {format(new Date(week.endDate), "dd 'de' MMM", { locale: ptBR })}
                    </div>
                    <h3 className="text-lg md:text-xl text-white font-bold uppercase tracking-tight leading-none pt-1">{week.goal}</h3>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteWeek(week.id)} className="h-8 w-8 text-neutral-700 hover:text-red-500 hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                  
                  {/* ESQUERDA: PLANO DE AÇÃO */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 pb-2">
                      <Label className="text-[10px] font-black uppercase text-neutral-600 tracking-[0.2em]">Plano de Ação</Label>
                    </div>
                    <TaskList
                      items={week.tasks}
                      onAdd={(t) => addWeekTask(week.id, t)}
                      onToggle={(taskId) => toggleWeekTask(week.id, taskId)}
                      placeholder="Adicionar tarefa..."
                    />
                  </div>

                  {/* DIREITA: REVIEW */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 pb-2">
                      <Label className="text-[10px] font-black uppercase text-neutral-600 tracking-[0.2em]">Review Semanal</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-2 sm:col-span-1">
                        <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">O que funcionou?</span>
                        <Textarea
                          value={week.review.worked}
                          onChange={(e) => updateWeekReview(week.id, 'worked', e.target.value)}
                          className="bg-transparent border-white/5 text-xs min-h-[50px] resize-none focus:border-white/20 rounded-lg p-2 text-neutral-400"
                        />
                      </div>
                      <div className="space-y-1 col-span-2 sm:col-span-1">
                        <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">O que falhou?</span>
                        <Textarea
                          value={week.review.didntWork}
                          onChange={(e) => updateWeekReview(week.id, 'didntWork', e.target.value)}
                          className="bg-transparent border-white/5 text-xs min-h-[50px] resize-none focus:border-white/20 rounded-lg p-2 text-neutral-400"
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">Como melhorar?</span>
                        <Textarea
                          value={week.review.improve}
                          onChange={(e) => updateWeekReview(week.id, 'improve', e.target.value)}
                          className="bg-transparent border-white/5 text-xs h-[40px] resize-none focus:border-white/20 rounded-lg p-2 text-neutral-400"
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