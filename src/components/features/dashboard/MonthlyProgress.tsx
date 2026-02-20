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
      // Verde Esmeralda (15% opacidade)
      gradient: "bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.15)_0%,_rgba(6,78,59,0.15)_100%)]",
      borderColor: "border-emerald-500/10",
      iconColor: "text-emerald-400/80",
    },
    { 
      label: "Tarefas", 
      count: `${tasksCount} pendentes`,
      icon: ListTodo, 
      // Azul Ciano (15% opacidade)
      gradient: "bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.15)_0%,_rgba(8,51,68,0.15)_100%)]",
      borderColor: "border-cyan-500/10",
      iconColor: "text-cyan-400/80",
    },
    { 
      label: "Metas", 
      count: `${goalsCount} ativas`,
      icon: Target, 
      // Roxo/Violeta (15% opacidade)
      gradient: "bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.15)_0%,_rgba(46,16,101,0.15)_100%)]",
      borderColor: "border-violet-500/10",
      iconColor: "text-violet-400/80",
    },
    { 
      label: "XP Total", 
      count: `${totalPoints} XP`,
      icon: Zap, 
      // Laranja Dourado (15% opacidade)
      gradient: "bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.15)_0%,_rgba(69,26,3,0.15)_100%)]",
      borderColor: "border-amber-500/10",
      iconColor: "text-amber-400/80",
    },
  ];

  const lightSweepClass = "after:absolute after:inset-0 after:bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.02)_50%,transparent_70%)] after:pointer-events-none";

  return (
    <Card className="card-glass overflow-hidden shadow-2xl shadow-black/60 border-white/10">
      <CardHeader className="pb-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4adbc8] shadow-[0_0_8px_rgba(74,219,200,0.8)]"></span>
            Status Mensal
          </CardTitle>
          <span className="text-[10px] font-black text-black bg-[#4adbc8] px-3 py-1 rounded-full">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-8">
        {/* Barra de Progresso Global */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-white/60 font-black uppercase tracking-widest">
             <span>Progresso de Nível</span>
             <span className="font-rajdhani text-sm text-[#4adbc8]">{totalPoints} / {MONTHLY_XP_TARGET} XP</span>
          </div>
          <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
            <div 
                className="h-full bg-gradient-to-r from-[#2dd4bf] to-[#4adbc8] shadow-[0_0_15px_rgba(74,219,200,0.4)] transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Grade de Cards Coloridos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={cn(
                "group relative flex flex-col justify-center p-4 h-[115px] rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg",
                stat.gradient,
                stat.borderColor,
                lightSweepClass
              )}
            >
              <div className="relative z-10 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/5 shrink-0">
                    <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
                  </div>
                  <span className="text-[12px] font-black uppercase tracking-[0.15em] text-white/80">
                    {stat.label}
                  </span>
                </div>
                
                <div className="mt-1">
                  <p className="text-[14px] font-black text-white/90 uppercase tracking-tight">
                    {stat.count}
                  </p>
                  <div className="h-1 w-full bg-black/40 rounded-full mt-2 overflow-hidden">
                    <div className={cn("h-full w-full opacity-30", stat.iconColor.replace('text-', 'bg-'))} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};