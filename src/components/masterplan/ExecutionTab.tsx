import React, { useState, useMemo } from "react";
import { NorteCard } from "@/components/masterplan/cockpit/NorteCard";
import { FocoHojeCard } from "@/components/masterplan/cockpit/FocoHojeCard";
import { MissoesSemanaisSection } from "@/components/masterplan/cockpit/MissoesSemanaisSection";
import { TaskItem } from "@/hooks/useMasterplan";

interface ExecutionTabProps {
  // Monthly Data
  currentMonth: any;
  currentMonthIndex: number;
  addMonthGoal: (monthIndex: number, task: TaskItem) => void;
  toggleMonthGoal: (monthIndex: number, taskId: string) => void;
  updateMonth: (monthIndex: number, data: any) => void;
  
  // Weekly Data
  weeks: any[];
  addWeek: (week: any) => void;
  deleteWeek: (id: string) => void;
  addWeekTask: (weekId: string, task: TaskItem) => void;
  toggleWeekTask: (weekId: string, taskId: string) => void;
  updateWeekReview: (weekId: string, field: string, value: string) => void;

  // Context Data
  annualObjective?: string;
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
  updateWeekReview,
  annualObjective
}: ExecutionTabProps) => {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);

  // Calcular progresso mensal
  const completedGoals = currentMonth.goals.filter((g: any) => g.completed).length;
  const totalGoals = currentMonth.goals.length;
  const monthProgress = totalGoals === 0 ? 0 : (completedGoals / totalGoals) * 100;
  
  // Encontrar a meta principal do mês
  const mainGoal = currentMonth.goals.find((g: any) => !g.completed) || currentMonth.goals[0];
  const mainGoalText = useMemo(() => {
    if (!mainGoal) return "Defina suas metas";
    const text = mainGoal.text;
    if (typeof text === 'string') return text;
    if (typeof text === 'object' && text?.text) return text.text;
    return "Meta do mês";
  }, [mainGoal]);

  // Agregar tarefas de todas as missões para "Foco de Hoje"
  const dailyTasks = useMemo(() => {
    const allTasks: { id: string; text: string; completed: boolean; missionName?: string; weekId: string }[] = [];
    
    weeks.forEach((week) => {
      (week.tasks || []).forEach((task: any) => {
        allTasks.push({
          id: `${week.id}-${task.id}`,
          text: typeof task.text === 'string' ? task.text : task.text?.text || 'Tarefa',
          completed: task.completed,
          missionName: week.goal,
          weekId: week.id
        });
      });
    });
    
    return allTasks;
  }, [weeks]);

  const handleAddDailyTask = (text: string) => {
    // Se há uma missão selecionada, adiciona nela. Senão, adiciona na primeira missão ou cria uma tarefa avulsa
    const targetWeek = selectedMissionId 
      ? weeks.find(w => w.id === selectedMissionId) 
      : weeks[0];
    
    if (targetWeek) {
      addWeekTask(targetWeek.id, {
        id: Date.now().toString(),
        text,
        completed: false
      });
    }
  };

  const handleToggleDailyTask = (compositeId: string) => {
    const [weekId, taskId] = compositeId.split('-');
    toggleWeekTask(weekId, taskId);
  };

  const handleSelectMission = (id: string) => {
    setSelectedMissionId(id === selectedMissionId ? null : id);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* 1. O NORTE - Progresso Mensal */}
      <section>
        <NorteCard 
          monthName={currentMonth.name}
          progress={monthProgress}
          mainGoal={mainGoalText}
        />
      </section>

      {/* 2. CAMPO DE BATALHA - Foco de Hoje */}
      <section>
        <FocoHojeCard 
          tasks={dailyTasks}
          onAddTask={handleAddDailyTask}
          onToggleTask={handleToggleDailyTask}
        />
      </section>

      {/* 3. A ESTRATÉGIA - Missões Semanais */}
      <section>
        <MissoesSemanaisSection 
          missions={weeks}
          onAddMission={addWeek}
          onDeleteMission={deleteWeek}
          onSelectMission={handleSelectMission}
        />
      </section>

    </div>
  );
};