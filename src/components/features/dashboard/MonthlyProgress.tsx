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
      borderColor: "border-red-950/30",
      bgGradient: "from-red-950/10 to-transparent"
    },
    { 
      label: "Tarefas", 
      value: "0", 
      icon: ListTodo, 
      color: "text-blue-600",
      borderColor: "border-blue-950/30",
      bgGradient: "from-blue-950/10 to-transparent"
    },
    { 
      label: "Metas", 
      value: "0", 
      icon: Target, 
      color: "text-emerald-600",
      borderColor: "border-emerald-950/30",
      bgGradient: "from-emerald-950/10 to-transparent"
    },
    { 
      label: "XP Total", 
      value: totalPoints, 
      icon: Zap, 
      color: "text-amber-600",
      borderColor: "border-amber-950/30",
      bgGradient: "from-amber-950/10 to-transparent"
    },
  ];

  return (
    <Card className="bg-[#08080a] border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <CardHeader className="pb-4 border-b border-white/5 bg-black/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-neutral-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-900 shadow-[0_0_8px_rgba(153,27,27,0.8)]"></span>
            Status Mensal
          </CardTitle>
          <span className="text-[10px] font-black text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-8">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-white/20 font-black uppercase tracking-widest">
             <span>Progresso de Nível</span>
             <span className="font-rajdhani text-sm text-red-900">{totalPoints} / {MONTHLY_XP_TARGET} XP</span>
          </div>
          <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5">
            <div 
                className="h-full bg-red-900 shadow-[0_0_10px_rgba(153,27,27,0.5)] transition-all duration-1000"
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
                "bg-black hover:bg-[#050506]",
                stat.borderColor
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", stat.bgGradient)} />
              
              <div className="relative z-10 flex justify-between items-start mb-3">
                 <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <stat.icon className={cn("h-4 w-4 opacity-60", stat.color)} />
                 </div>
                 <ChevronRight className="h-3 w-3 text-white/5 group-hover:text-white/20 transition-colors" />
              </div>
              <div className="relative z-10">
                <span className="block text-2xl font-rajdhani font-black text-neutral-200 leading-none mb-1">{stat.value}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/10 group-hover:text-white/30">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};