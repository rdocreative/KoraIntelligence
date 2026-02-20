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
  
  // PALETA GLOBAL DEFINIDA
  const stats = [
    { 
      label: "Hábitos", 
      count: `${habitsCount} ativos`,
      icon: CheckCircle2, 
      color: "text-[#00FF7F]", // Verde Neon
      bgColor: "bg-[#00FF7F]", 
      progress: habitsCount > 0 ? 100 : 0,
      sweepClass: "sweep-habits"
    },
    { 
      label: "Tarefas", 
      count: `${tasksCount} pendentes`,
      icon: ListTodo, 
      color: "text-[#00E5FF]", // Azul Ciano Neon
      bgColor: "bg-[#00E5FF]", 
      progress: tasksCount > 0 ? 50 : 0,
      sweepClass: "sweep-tasks"
    },
    { 
      label: "Metas", 
      count: `${goalsCount} ativas`,
      icon: Target, 
      color: "text-[#BF5FFF]", // Roxo/Violeta Neon
      bgColor: "bg-[#BF5FFF]", 
      progress: goalsCount > 0 ? 25 : 0,
      sweepClass: "sweep-goals"
    },
    { 
      label: "XP Total", 
      count: null,
      icon: Zap, 
      color: "text-[#FFB300]", // Laranja Dourado Neon
      bgColor: "bg-[#FFB300]", 
      progress: progressPercentage,
      sweepClass: "sweep-xp"
    },
  ];

  return (
    <Card className="card-glass overflow-hidden shadow-2xl shadow-black/60 border-white/10">
      <CardHeader className="pb-4 border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFB300] shadow-[0_0_8px_rgba(255,179,0,0.8)]"></span>
            Status Mensal
          </CardTitle>
          <span className="text-[10px] font-black text-black bg-[#FFB300] px-3 py-1 rounded-full">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-8 bg-gradient-to-r from-transparent to-white/[0.02]">
        
        {/* Barra de Progresso Geral (XP - Dourado) */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-white/60 font-black uppercase tracking-widest">
             <span>Progresso de Nível</span>
             <span className="font-rajdhani text-sm text-[#FFB300]">{totalPoints} / {MONTHLY_XP_TARGET} XP</span>
          </div>
          <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
            <div 
                className="h-full bg-gradient-to-r from-[#FFB300] to-[#FFD54F] shadow-[0_0_15px_rgba(255,179,0,0.4)] transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Cards de Categorias com Efeito Neon Sweep */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={cn("neon-sweep-wrapper", stat.sweepClass)}
            >
              <div className="neon-content p-3.5 flex flex-col justify-center gap-3 h-[105px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="p-1.5 rounded-lg bg-black/40 border border-white/5 shrink-0">
                        <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
                     </div>
                     <span className="text-[12px] font-black uppercase tracking-wider text-white truncate">
                       {stat.label}
                     </span>
                  </div>
                  {stat.label === "XP Total" && (
                    <span className="text-[14px] font-black font-rajdhani text-white">
                        {Math.round(stat.progress)}%
                    </span>
                  )}
                </div>

                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={cn("h-full transition-all duration-1000 rounded-full shadow-[0_0_10px_currentColor]", stat.bgColor)} 
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
                
                {stat.count && (
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-tight truncate">
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