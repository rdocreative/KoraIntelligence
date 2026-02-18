"use client";

import { useState } from "react";
import { MonthData, WeekData } from "@/hooks/useMasterplan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, 
  Plus, 
  Target, 
  ChevronRight,
  Trash2,
  CheckCircle2,
  Circle,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExecutionTabProps {
  currentMonth: MonthData;
  currentMonthIndex: number;
  addMonthGoal: (monthIndex: number, goal: string) => void;
  toggleMonthGoal: (monthIndex: number, goalId: string) => void;
  updateMonth: (monthIndex: number, updates: Partial<MonthData>) => void;
  weeks: WeekData[];
  addWeek: (week: Omit<WeekData, 'id'>) => void;
  deleteWeek: (weekId: string) => void;
  addWeekTask: (weekId: string, task: string) => void;
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
  const [newGoal, setNewGoal] = useState("");
  const [newWeekTask, setNewWeekTask] = useState<Record<string, string>>({});
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      addMonthGoal(currentMonthIndex, newGoal.trim());
      setNewGoal("");
    }
  };

  const handleAddWeekTask = (weekId: string) => {
    const task = newWeekTask[weekId];
    if (task?.trim()) {
      addWeekTask(weekId, task.trim());
      setNewWeekTask(prev => ({ ...prev, [weekId]: "" }));
    }
  };

  const handleCreateWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    addWeek({
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0],
      focus: "",
      tasks: [],
      review: ""
    });
  };

  const completedGoals = currentMonth.goals.filter(g => g.completed).length;
  const totalGoals = currentMonth.goals.length;
  const monthProgress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Execução</h1>
        <p className="text-neutral-400 text-sm">Metas do mês e tarefas da semana</p>
      </div>

      {/* Monthly Section */}
      <Card className="bg-[#0A0A0A] border-neutral-800/50 overflow-hidden">
        <CardHeader className="border-b border-neutral-800/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8251A] to-red-700 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white">
                  {monthNames[currentMonthIndex]}
                </CardTitle>
                <p className="text-xs text-neutral-500">
                  {completedGoals} de {totalGoals} metas concluídas
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white">{monthProgress}%</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#E8251A] to-red-500 transition-all duration-500"
              style={{ width: `${monthProgress}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Month Focus */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Foco do Mês
            </label>
            <Input
              value={currentMonth.focus}
              onChange={(e) => updateMonth(currentMonthIndex, { focus: e.target.value })}
              placeholder="Qual é o tema principal deste mês?"
              className="bg-neutral-900/50 border-neutral-700 text-white placeholder:text-neutral-600"
            />
          </div>

          {/* Goals List */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Metas do Mês
            </label>
            
            {currentMonth.goals.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma meta definida ainda.</p>
                <p className="text-xs text-neutral-600">Adicione suas metas abaixo.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentMonth.goals.map((goal) => (
                  <div 
                    key={goal.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-all",
                      goal.completed 
                        ? "bg-emerald-500/10 border border-emerald-500/20" 
                        : "bg-neutral-900/50 border border-neutral-800"
                    )}
                  >
                    <Checkbox
                      checked={goal.completed}
                      onCheckedChange={() => toggleMonthGoal(currentMonthIndex, goal.id)}
                      className="border-neutral-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <span className={cn(
                      "flex-1 text-sm",
                      goal.completed ? "text-neutral-400 line-through" : "text-white"
                    )}>
                      {goal.text}
                    </span>
                    {goal.completed && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add Goal Input */}
            <div className="flex gap-2 mt-4">
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                placeholder="Adicionar nova meta..."
                className="bg-neutral-900/50 border-neutral-700 text-white placeholder:text-neutral-600"
              />
              <Button 
                onClick={handleAddGoal}
                className="bg-[#E8251A] hover:bg-red-700 text-white px-4"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tip Card */}
      <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-xl p-4 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">Dica</p>
          <p className="text-sm text-neutral-400">
            Cada tarefa do dia deve estar conectada a uma meta do mês. Isso é o que cria progresso real.
          </p>
        </div>
      </div>

      {/* Weekly Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Semanas do Mês</h2>
          <Button 
            onClick={handleCreateWeek}
            variant="outline"
            className="border-neutral-700 text-white hover:bg-neutral-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Semana
          </Button>
        </div>

        {weeks.length === 0 ? (
          <Card className="bg-[#0A0A0A] border-neutral-800/50">
            <CardContent className="p-8 text-center">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-neutral-600" />
              <p className="text-neutral-400 mb-1">Nenhuma semana criada ainda.</p>
              <p className="text-sm text-neutral-600">Crie sua primeira semana para começar a planejar.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {weeks.map((week) => {
              const isExpanded = expandedWeek === week.id;
              const weekCompleted = week.tasks.filter(t => t.completed).length;
              const weekTotal = week.tasks.length;
              const weekProgress = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

              return (
                <Card 
                  key={week.id}
                  className={cn(
                    "bg-[#0A0A0A] border-neutral-800/50 overflow-hidden transition-all",
                    isExpanded && "ring-1 ring-[#E8251A]/30"
                  )}
                >
                  <div 
                    className="p-4 cursor-pointer hover:bg-neutral-900/50 transition-colors"
                    onClick={() => setExpandedWeek(isExpanded ? null : week.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-neutral-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {new Date(week.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {new Date(week.endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {weekCompleted}/{weekTotal} tarefas • {weekProgress}%
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        "w-5 h-5 text-neutral-500 transition-transform",
                        isExpanded && "rotate-90"
                      )} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-neutral-800/50 p-4 space-y-4">
                      {/* Week Focus */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                          Foco da Semana
                        </label>
                        <Input
                          value={week.focus}
                          onChange={(e) => {
                            // This would need a new function in the hook
                          }}
                          placeholder="Qual é o foco principal desta semana?"
                          className="bg-neutral-900/50 border-neutral-700 text-white placeholder:text-neutral-600"
                        />
                      </div>

                      {/* Week Tasks */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                          Tarefas da Semana
                        </label>
                        
                        {week.tasks.length === 0 ? (
                          <p className="text-sm text-neutral-500 py-2">Nenhuma tarefa para esta semana ainda.</p>
                        ) : (
                          <div className="space-y-2">
                            {week.tasks.map((task) => (
                              <div 
                                key={task.id}
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-lg transition-all",
                                  task.completed 
                                    ? "bg-emerald-500/10 border border-emerald-500/20" 
                                    : "bg-neutral-900/50 border border-neutral-800"
                                )}
                              >
                                <Checkbox
                                  checked={task.completed}
                                  onCheckedChange={() => toggleWeekTask(week.id, task.id)}
                                  className="border-neutral-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                />
                                <span className={cn(
                                  "flex-1 text-sm",
                                  task.completed ? "text-neutral-400 line-through" : "text-white"
                                )}>
                                  {task.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Task Input */}
                        <div className="flex gap-2 mt-3">
                          <Input
                            value={newWeekTask[week.id] || ""}
                            onChange={(e) => setNewWeekTask(prev => ({ ...prev, [week.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddWeekTask(week.id)}
                            placeholder="O que você vai fazer hoje?"
                            className="bg-neutral-900/50 border-neutral-700 text-white placeholder:text-neutral-600"
                          />
                          <Button 
                            onClick={() => handleAddWeekTask(week.id)}
                            className="bg-[#E8251A] hover:bg-red-700 text-white px-4"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Week Review */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                          Revisão da Semana
                        </label>
                        <Textarea
                          value={week.review}
                          onChange={(e) => updateWeekReview(week.id, e.target.value)}
                          placeholder="O que funcionou? O que pode melhorar?"
                          className="bg-neutral-900/50 border-neutral-700 text-white placeholder:text-neutral-600 min-h-[80px]"
                        />
                      </div>

                      {/* Delete Week */}
                      <div className="pt-2 border-t border-neutral-800/50">
                        <Button 
                          onClick={() => deleteWeek(week.id)}
                          variant="ghost"
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir Semana
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};