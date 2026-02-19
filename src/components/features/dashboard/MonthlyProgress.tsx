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
      bgGradient: "from-red-600/20 via-red-900/10 to-transparent"
    },
    { 
      label: "Tarefas", 
      value: "0", 
      icon: ListTodo, 
      color: "text-blue-500",
      stroke: "stroke-blue-500",
      bgGradient: "from-blue-600/20 via-blue-900/10 to-transparent"
    },
    { 
      label: "Metas", 
      value: "0", 
      icon: Target, 
      color: "text-emerald-500",
      stroke: "stroke-emerald-500",
      bgGradient: "from-emerald-600/20 via-emerald-900/10 to-transparent"
    },
    { 
      label: "XP Total", 
      value: totalPoints, 
      icon: Zap, 
      color: "text-amber-500",
      stroke: "stroke-amber-500",
      bgGradient: "from-amber-600/20 via-amber-900/10 to-transparent"
    },
  ];

  return (
    <Card className="card-glass overflow-hidden border-white/10">
      <CardHeader className="pb-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-black text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,1)] animate-pulse"></span>
            Status Mensal
          </CardTitle>
          <span className="text-[10px] font-black text-white bg-red-700 px-3 py-1 rounded-full shadow-lg shadow-red-900/40">
            {Math.round(progressPercentage)}% COMPLETADO
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-8">
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-white/40 mb-1 font-black uppercase tracking-[0.2em]">
             <span>Progresso de Nível</span>
             <span className="font-rajdhani font-black text-red-500 text-lg">{totalPoints} <span className="text-white/20">/</span> {MONTHLY_XP_TARGET} XP</span>
          </div>
          <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-0.5">
            <div 
                className="h-full bg-gradient-to-r from-red-800 via-red-600 to-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={cn(
                "group flex flex-col justify-between p-5 rounded-[1.5rem] border border-white/5 transition-all duration-500 cursor-default relative overflow-hidden",
                "bg-black/40 hover:bg-black/60 backdrop-blur-3xl",
                "hover:border-white/20 hover:scale-[1.02]"
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40", stat.bgGradient)} />
              
              <div className="relative z-10 flex justify-between items-start mb-3">
                 <stat.icon className={cn("h-5 w-5 drop-shadow-[0_0_8px_currentColor]", stat.color)} />
                 <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-white transition-colors" />
              </div>
              <div className="relative z-10">
                <span className="block text-3xl font-rajdhani font-black text-white leading-none mb-1">{stat.value}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30 group-hover:text-white/60 transition-colors">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};