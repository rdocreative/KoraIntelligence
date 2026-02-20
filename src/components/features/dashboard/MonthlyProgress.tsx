import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle2, ListTodo, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthlyProgressProps {
  totalPoints: number;
  habitsCount: number;
  tasksCount?: number;
  goalsCount?: number;
}

export const MonthlyProgress = ({ 
  totalPoints, 
  habitsCount,
  tasksCount = 0,
  goalsCount = 0
}: MonthlyProgressProps) => {
  const MONTHLY_XP_TARGET = 1000;
  const progressPercentage = Math.min(100, (totalPoints / MONTHLY_XP_TARGET) * 100);
  
  const stats = [
    { 
      label: "Hábitos", 
      count: habitsCount,
      icon: CheckCircle2, 
      color: "text-[#FF3232]",
    },
    { 
      label: "Tarefas", 
      count: tasksCount,
      icon: ListTodo, 
      color: "text-blue-500",
    },
    { 
      label: "Metas", 
      count: goalsCount,
      icon: Target, 
      color: "text-emerald-500",
    },
    { 
      label: "XP Total", 
      count: totalPoints,
      icon: Zap, 
      color: "text-amber-500",
    },
  ];

  return (
    <Card className="card-glass overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white">Status Mensal</CardTitle>
          <span className="text-xs font-black text-[#FF3232] bg-[#FF3232]/10 px-2 py-1 rounded-md">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-white/40 font-black uppercase tracking-widest">
             <span>Progresso de Nível</span>
             <span>{totalPoints} / {MONTHLY_XP_TARGET} XP</span>
          </div>
          <Progress value={progressPercentage} className="h-1.5 bg-white/5" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="item-glass p-3 flex flex-col gap-1">
              <stat.icon className={cn("h-4 w-4 mb-1", stat.color)} />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-lg font-bold text-white font-rajdhani">
                {stat.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};