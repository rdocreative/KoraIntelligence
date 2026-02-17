import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle2, ListTodo, Zap } from "lucide-react";

interface MonthlyProgressProps {
  totalPoints: number;
  habitsCount: number;
}

export const MonthlyProgress = ({ totalPoints, habitsCount }: MonthlyProgressProps) => {
  // Mock targets for visualization since backend isn't fully ready for goals/tasks
  const MONTHLY_XP_TARGET = 1000;
  const progressPercentage = Math.min(100, (totalPoints / MONTHLY_XP_TARGET) * 100);
  
  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long' });

  const stats = [
    { label: "Hábitos", value: habitsCount, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Tarefas", value: "0", icon: ListTodo, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Metas", value: "0", icon: Target, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "XP Total", value: totalPoints, icon: Zap, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  ];

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold capitalize text-slate-700 dark:text-slate-200">
            Progresso de {currentMonth}
          </CardTitle>
          <span className="text-sm font-medium text-slate-500">{Math.round(progressPercentage)}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-3 bg-slate-100 dark:bg-slate-800" indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-600" />
          <p className="text-xs text-center text-slate-400">
            {totalPoints} / {MONTHLY_XP_TARGET} XP para a meta mensal
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className={`flex flex-col items-center justify-center p-3 rounded-xl ${stat.bg} transition-transform hover:scale-105`}>
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};