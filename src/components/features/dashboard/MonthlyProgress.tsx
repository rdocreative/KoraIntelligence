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
      color: "text-red-600",
      borderColor: "border-red-600/10",
      bgGradient: "from-red-600/5 via-transparent to-transparent"
    },
    { 
      label: "Tarefas", 
      value: "0", 
      icon: ListTodo, 
      color: "text-blue-600",
      borderColor: "border-blue-600/10",
      bgGradient: "from-blue-600/5 via-transparent to-transparent"
    },
    { 
      label: "Metas", 
      value: "0", 
      icon: Target, 
      color: "text-emerald-600",
      borderColor: "border-emerald-600/10",
      bgGradient: "from-emerald-600/5 via-transparent to-transparent"
    },
    { 
      label: "XP Total", 
      value: totalPoints, 
      icon: Zap, 
      color: "text-amber-600",
      borderColor: "border-amber-600/10",
      bgGradient: "from-amber-600/5 via-transparent to-transparent"
    },
  ];

  return (
    <Card className="card-glass overflow-hidden">
      <CardHeader className="pb-4 border-b border-white/5 bg-black/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-700 shadow-[0_0_12px_rgba(185,28,28,0.8)]"></span>
            Status Mensal
          </CardTitle>
          <span className="text-[10px] font-black text-white/80 bg-red-900/40 px-3 py-1 rounded-full border border-red-800/20">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-8">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-white/20 font-black uppercase tracking-widest">
             <span>Progresso de Nível</span>
             <span className="font-rajdhani text-sm text-red-600 opacity-80">{totalPoints} / {MONTHLY_XP_TARGET} XP</span>
          </div>
          <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div 
                className="h-full bg-gradient-to-r from-red-900 to-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={cn(
                "group flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden",
                "bg-black hover:bg-neutral-900/20 shadow-2xl",
                stat.borderColor
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", stat.bgGradient)} />
              
              <div className="relative z-10 flex justify-between items-start mb-3">
                 <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <stat.icon className={cn("h-4 w-4 opacity-70", stat.color)} />
                 </div>
                 <ChevronRight className="h-3 w-3 text-white/5 group-hover:text-white/20 transition-colors" />
              </div>
              <div className="relative z-10">
                <span className="block text-2xl font-rajdhani font-black text-white/90 leading-none mb-1">{stat.value}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/10 group-hover:text-white/30 transition-colors">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};