import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle2, ListTodo, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthlyProgressProps {
  totalPoints: number;
  habitsCount: number;
}

export const MonthlyProgress = ({ totalPoints, habitsCount }: MonthlyProgressProps) => {
  const MONTHLY_XP_TARGET = 1000;
  const progressPercentage = Math.min(100, (totalPoints / MONTHLY_XP_TARGET) * 100);
  
  const stats = [
    { 
      label: "Hábitos", 
      value: habitsCount, 
      icon: CheckCircle2, 
      color: "text-red-500",
      stroke: "stroke-red-500",
      bgGradient: "from-red-500/5 to-transparent"
    },
    { 
      label: "Tarefas", 
      value: "0", 
      icon: ListTodo, 
      color: "text-blue-500",
      stroke: "stroke-blue-500",
      bgGradient: "from-blue-500/5 to-transparent"
    },
    { 
      label: "Metas", 
      value: "0", 
      icon: Target, 
      color: "text-emerald-500",
      stroke: "stroke-emerald-500",
      bgGradient: "from-emerald-500/5 to-transparent"
    },
    { 
      label: "XP Total", 
      value: totalPoints, 
      icon: Zap, 
      color: "text-amber-500",
      stroke: "stroke-amber-500",
      bgGradient: "from-amber-500/5 to-transparent"
    },
  ];

  return (
    <Card className="card-glass overflow-hidden border-white/10">
      <CardHeader className="pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Status Mensal
          </CardTitle>
          <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-1 rounded">
            {Math.round(progressPercentage)}% COMPLETADO
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] text-white/50 mb-1 font-bold uppercase tracking-wider">
             <span>Progresso de Nível</span>
             <span className="font-rajdhani font-bold text-white text-sm">{totalPoints} / {MONTHLY_XP_TARGET} XP</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={cn(
                "group flex flex-col justify-between p-4 rounded-xl border border-white/5 transition-all cursor-default relative overflow-hidden",
                "bg-white/[0.01] hover:bg-white/[0.03] backdrop-blur-[40px] backdrop-saturate-0",
                "hover:border-white/10"
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20", stat.bgGradient)} />
              
              <div className="relative z-10 flex justify-between items-start mb-2">
                 <stat.icon className={cn("h-4 w-4", stat.color, stat.stroke)} />
                 <ChevronRight className="h-3 w-3 text-white/20 group-hover:text-white transition-colors" />
              </div>
              <div className="relative z-10">
                <span className="block text-2xl font-rajdhani font-bold text-white">{stat.value}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};