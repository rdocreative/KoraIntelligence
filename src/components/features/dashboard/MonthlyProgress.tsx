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
      color: "text-red-500",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/20",
      bgGradient: "from-red-950/15 to-red-600/15",
      progress: habitsCount > 0 ? 100 : 0 // Visual placeholder
    },
    { 
      label: "Tarefas", 
      count: `${tasksCount} pendentes`,
      icon: ListTodo, 
      color: "text-blue-400",
      bgColor: "bg-blue-400",
      borderColor: "border-blue-500/20",
      bgGradient: "from-blue-950/15 to-blue-600/15",
      progress: tasksCount > 0 ? 50 : 0 // Visual placeholder
    },
    { 
      label: "Metas", 
      count: `${goalsCount} ativas`,
      icon: Target, 
      color: "text-emerald-400",
      bgColor: "bg-emerald-400",
      borderColor: "border-emerald-500/20",
      bgGradient: "from-emerald-950/15 to-emerald-600/15",
      progress: goalsCount > 0 ? 25 : 0 // Visual placeholder
    },
    { 
      label: "XP Total", 
      count: null,
      icon: Zap, 
      color: "text-amber-400",
      bgColor: "bg-amber-400",
      borderColor: "border-amber-500/20",
      bgGradient: "from-amber-950/15 to-amber-600/15",
      progress: progressPercentage
    },
  ];

  return (
    <Card className="card-glass overflow-hidden shadow-2xl shadow-black/60 border-white/10">
      <CardHeader className="pb-4 border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
            Status Mensal
          </CardTitle>
          <span className="text-[10px] font-black text-white bg-red-700/80 px-3 py-1 rounded-full">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-8 bg-gradient-to-r from-transparent to-white/[0.02]">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-white/40 font-black uppercase tracking-widest">
             <span>Progresso de Nível</span>
             <span className="font-rajdhani text-sm text-red-500">{totalPoints} / {MONTHLY_XP_TARGET} XP</span>
          </div>
          <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
            <div 
                className="h-full bg-gradient-to-r from-red-800 to-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={cn(
                "group flex flex-col justify-center p-3.5 h-[105px] rounded-2xl border transition-all duration-300 relative overflow-hidden shadow-md shadow-black/20",
                "bg-gradient-to-br hover:opacity-90",
                stat.bgGradient,
                stat.borderColor
              )}
            >
              <div className="relative z-10 flex flex-col gap-2">
                {/* Alinhamento perfeito entre Ícone+Título e Porcentagem */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="p-1.5 rounded-lg bg-black/40 border border-white/5 shrink-0">
                        <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
                     </div>
                     <span className="text-[13px] font-black uppercase tracking-widest text-white truncate">
                       {stat.label}
                     </span>
                  </div>
                  {/* Removido a porcentagem individual para deixar o contador mais visível nos outros cards, exceto XP */}
                  {stat.label === "XP Total" && (
                    <span className="text-[14px] font-black font-rajdhani text-white/90">
                        {Math.round(stat.progress)}%
                    </span>
                  )}
                </div>

                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div 
                    className={cn("h-full transition-all duration-1000 rounded-full", stat.bgColor)} 
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
                
                {stat.count && (
                  <p className="text-[10px] font-medium text-white/60 uppercase tracking-tight truncate">
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