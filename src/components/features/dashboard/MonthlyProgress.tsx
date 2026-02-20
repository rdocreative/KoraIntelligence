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
      count: `${habitsCount} ativos`,
      icon: CheckCircle2, 
      color: "text-[#FF3232]",
      bgColor: "bg-[#FF3232]",
      borderColor: "border-[#FF3232]/10",
      bgGradient: "from-black to-red-950/20",
      progress: habitsCount > 0 ? 100 : 0 
    },
    { 
      label: "Tarefas", 
      count: `${tasksCount} pendentes`,
      icon: ListTodo, 
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/10",
      bgGradient: "from-black to-blue-950/20",
      progress: tasksCount > 0 ? 50 : 0 
    },
    { 
      label: "Metas", 
      count: `${goalsCount} ativas`,
      icon: Target, 
      color: "text-emerald-500",
      bgColor: "bg-emerald-500",
      borderColor: "border-emerald-500/10",
      bgGradient: "from-black to-emerald-950/20",
      progress: goalsCount > 0 ? 25 : 0 
    },
    { 
      label: "XP Total", 
      count: null,
      icon: Zap, 
      color: "text-amber-500",
      bgColor: "bg-amber-500",
      borderColor: "border-amber-500/10",
      bgGradient: "from-black to-amber-950/20",
      progress: progressPercentage
    },
  ];

  return (
    <Card className="card-glass overflow-hidden border-[#FF3232]/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <CardHeader className="pb-4 border-b border-white/5 bg-black/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3232] shadow-[0_0_5px_#FF3232]"></span>
            Status Mensal
          </CardTitle>
          <span className="text-[10px] font-black text-black bg-[#FF3232] px-3 py-1 rounded-full">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-8 bg-black/20">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-white/40 font-black uppercase tracking-widest">
             <span>Progresso de Nível</span>
             <span className="font-rajdhani text-sm text-[#FF3232]">{totalPoints} / {MONTHLY_XP_TARGET} XP</span>
          </div>
          <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
            <div 
                className="h-full bg-[#FF3232] shadow-[0_0_10px_rgba(255,50,50,0.3)] transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={cn(
                "group flex flex-col justify-center p-3.5 h-[105px] rounded-2xl border transition-all duration-300 relative overflow-hidden",
                "bg-gradient-to-br",
                stat.bgGradient,
                stat.borderColor
              )}
            >
              <div className="relative z-10 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                   <div className="p-1.5 rounded-lg bg-black border border-white/5 shrink-0">
                      <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
                   </div>
                   <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider truncate">
                     {stat.label}
                   </span>
                </div>

                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5 mt-1">
                  <div 
                    className={cn("h-full transition-all duration-1000 rounded-full opacity-70", stat.bgColor)} 
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
                
                {stat.count && (
                  <p className="text-[10px] font-medium text-white/40 uppercase tracking-tight truncate">
                    {stat.count}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};