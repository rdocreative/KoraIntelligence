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
      borderColor: "border-red-500/20",
      bgGradient: "from-red-950/15 to-red-600/15"
    },
    { 
      label: "Tarefas", 
      value: "0", 
      icon: ListTodo, 
      color: "text-blue-500",
      borderColor: "border-blue-500/20",
      bgGradient: "from-blue-950/15 to-blue-600/15"
    },
    { 
      label: "Metas", 
      value: "0", 
      icon: Target, 
      color: "text-emerald-500",
      borderColor: "border-emerald-500/20",
      bgGradient: "from-emerald-950/15 to-emerald-600/15"
    },
    { 
      label: "XP Total", 
      value: totalPoints, 
      icon: Zap, 
      color: "text-amber-500",
      borderColor: "border-amber-500/20",
      bgGradient: "from-amber-950/15 to-amber-600/15"
    },
  ];

  return (
    <Card className="card-glass overflow-hidden">
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
                "group flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden shadow-md shadow-black/20",
                "bg-gradient-to-br hover:opacity-90",
                stat.bgGradient,
                stat.borderColor
              )}
            >
              {/* Top Row: Icon and Label */}
              <div className="relative z-10 flex items-center gap-2 mb-4">
                 <div className="p-1.5 rounded-lg bg-black/40 border border-white/5 shrink-0">
                    <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-white transition-colors truncate">
                   {stat.label}
                 </span>
              </div>

              {/* Bottom Row: Value */}
              <div className="relative z-10">
                <span className="block text-2xl font-rajdhani font-black text-white leading-none tracking-tight">
                  {stat.value}
                </span>
              </div>

              {/* Decorative chevron */}
              <ChevronRight className="absolute top-4 right-4 h-3 w-3 text-white/10 group-hover:text-white/20 transition-colors" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};