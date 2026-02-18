import React from "react";
import { TaskList } from "@/components/masterplan/TaskList";
import { TaskItem } from "@/hooks/useMasterplan";

interface MonthlyTabProps {
  months: any[];
  currentMonthIndex: number;
  addMonthGoal: (monthIndex: number, task: TaskItem) => void;
  toggleMonthGoal: (monthIndex: number, taskId: string) => void;
  updateMonth: (monthIndex: number, data: any) => void;
}

export const MonthlyTab = ({
  months,
  currentMonthIndex,
  addMonthGoal,
  toggleMonthGoal,
  updateMonth
}: MonthlyTabProps) => {
  return (
    <div className="grid gap-6">
      {months.map((month, index) => (
        <div key={index} className="space-y-4">
           {/* Se precisarmos mostrar mais de um mês, podemos adicionar um título aqui. 
               Como a aba Execução passa apenas o mês atual, isso renderiza apenas ele. */}
          
          <TaskList 
            items={month.goals}
            onAdd={(text) => addMonthGoal(currentMonthIndex, { 
                id: Date.now().toString(), 
                text, 
                completed: false 
            })}
            onToggle={(id) => toggleMonthGoal(currentMonthIndex, id)}
            placeholder="Qual missão você vai dominar este mês?"
          />
        </div>
      ))}
    </div>
  );
};