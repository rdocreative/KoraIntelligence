import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Zap, LayoutDashboard, Trash2, CheckSquare, Save } from "lucide-react";
import { TaskList } from "@/components/masterplan/TaskList";
import { TaskItem } from "@/hooks/useMasterplan";

interface WeeklyTabProps {
  weeks: any[];
  addWeek: (week: any) => void;
  deleteWeek: (id: string) => void;
  addWeekTask: (weekId: string, task: TaskItem) => void;
  toggleWeekTask: (weekId: string, taskId: string) => void;
  updateWeekReview: (weekId: string, field: string, value: string) => void;
}

export const WeeklyTab = ({ weeks, addWeek, deleteWeek, addWeekTask, toggleWeekTask, updateWeekReview }: WeeklyTabProps) => {
  const [newWeekStart, setNewWeekStart] = useState("");
  const [newWeekEnd, setNewWeekEnd] = useState("");
  const [newWeekGoal, setNewWeekGoal] = useState("");

  const handleCreateWeek = () => {
    if (!newWeekStart || !newWeekEnd) return;
    const reviewDate = newWeekEnd;
    addWeek({
      startDate: newWeekStart,
      endDate: newWeekEnd,
      goal: newWeekGoal,
      reviewDate: reviewDate
    });
    setNewWeekStart("");
    setNewWeekEnd("");
    setNewWeekGoal("");
  };

  return (
    <div className="space-y-8 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* NEW SPRINT CREATOR */}
      <Card className="bg-[#0A0A0A] border-white/10">
        <CardHeader className="border-b border-white/5 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg"><Zap className="w-5 h-5 text-red-500" /></div>
            <CardTitle className="text-lg font-black uppercase text-white tracking-wide">Nova Sprint Semanal</CardTitle>
          </div>
          <CardDescription className="text-neutral-500">Planeje os próximos 7 dias com intencionalidade.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="flex flex-col xl:flex-row gap-6 items-end">
            <div className="space-y-2 flex-1 w-full">
              <Label className="text-xs uppercase font-bold text-neutral-500 tracking-widest">Objetivo Único</Label>
              <Input
                value={newWeekGoal}
                onChange={(e) => setNewWeekGoal(e.target.value)}
                placeholder="Qual é a única coisa que fará essa semana valer a pena?"
                className="bg-black/40 border-white/10 h-14 text-base focus:border-red-500/50 transition-all focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full xl:w-auto">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-neutral-500 tracking-widest">Início</Label>
                <Input
                  type="date"
                  value={newWeekStart}
                  onChange={(e) => setNewWeekStart(e.target.value)}
                  className="bg-black/40 border-white/10 h-14 px-4 transition-all focus:ring-1 focus:ring-red-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-neutral-500 tracking-widest">Fim</Label>
                <Input
                  type="date"
                  value={newWeekEnd}
                  onChange={(e) => setNewWeekEnd(e.target.value)}
                  className="bg-black/40 border-white/10 h-14 px-4 transition-all focus:ring-1 focus:ring-red-500/20"
                />
              </div>
            </div>
            <Button onClick={handleCreateWeek} className="w-full xl:w-auto h-14 bg-white text-black hover:bg-neutral-200 font-bold px-10 rounded-lg transition-all active:scale-95">
              CRIAR SPRINT
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {weeks.length === 0 && (
          <div className="text-center py-24 opacity-30 border-2 border-dashed border-white/10 rounded-3xl animate-in fade-in duration-500">
            <LayoutDashboard className="w-20 h-20 mx-auto mb-6 text-neutral-500" />
            <p className="text-xl font-medium">Nenhuma sprint ativa.</p>
          </div>
        )}

        {weeks.map((week) => (
          <div key={week.id} className="relative group">
            {/* GLOW EFFECT */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

            <Card className="bg-[#0E0E0E] border-white/10 overflow-hidden shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 py-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase text-red-500 tracking-[0.2em] bg-red-950/30 px-2 py-1 rounded border border-red-500/20">
                        Semana de {new Date(week.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl text-white font-black uppercase italic tracking-tight">{week.goal}</h3>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteWeek(week.id)} className="text-neutral-600 hover:text-red-500 hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-8 grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <CheckSquare className="w-4 h-4 text-neutral-500" />
                    <Label className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em]">Plano de Ação</Label>
                  </div>
                  <TaskList
                    items={week.tasks}
                    onAdd={(t) => addWeekTask(week.id, t)}
                    onToggle={(taskId) => toggleWeekTask(week.id, taskId)}
                    placeholder="Adicionar tarefa chave..."
                  />
                </div>

                <div className="space-y-6 lg:border-l border-white/5 lg:pl-12">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Save className="w-4 h-4 text-neutral-500" />
                    <Label className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em]">Review Semanal</Label>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">O que funcionou?</span>
                      <Textarea
                        value={week.review.worked}
                        onChange={(e) => updateWeekReview(week.id, 'worked', e.target.value)}
                        className="bg-black/40 border-white/5 text-sm min-h-[60px] resize-none focus:border-green-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">O que falhou?</span>
                      <Textarea
                        value={week.review.didntWork}
                        onChange={(e) => updateWeekReview(week.id, 'didntWork', e.target.value)}
                        className="bg-black/40 border-white/5 text-sm min-h-[60px] resize-none focus:border-red-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider">Como melhorar?</span>
                      <Textarea
                        value={week.review.improve}
                        onChange={(e) => updateWeekReview(week.id, 'improve', e.target.value)}
                        className="bg-black/40 border-white/5 text-sm min-h-[60px] resize-none focus:border-yellow-500/50 transition-all"
                      />
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