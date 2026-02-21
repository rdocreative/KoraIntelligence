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
  
  // Paleta harmonizada em Turquesa (#4adbc8)
  const stats = [
    { 
      label: "Hábitos", 
      count: `${habitsCount} ativos`,
      icon: CheckCircle2, 
      color: "text-[#2dd4bf]", 
      bgColor: "bg-[#2dd4bf]", 
      borderColor: "border-[#2dd4bf]/20",
      bgGradient: "from-[#2dd4bf]/10 to-[#2dd4bf]/5",
      progress: habitsCount > 0 ? 100 : 0 
    },
    { 
      label: "Tarefas", 
      count: `${tasksCount} pendentes`,
      icon: ListTodo, 
      color: "text-[#4adbc8]", 
      bgColor: "bg-[#4adbc8]", 
      borderColor: "border-[#4adbc8]/20",
      bgGradient: "from-[#4adbc8]/10 to-[#4adbc8]/5",
      progress: tasksCount > 0 ? 50 : 0 
    },
    { 
      label: "Metas", 
      count: `${goalsCount} ativas`,
      icon: Target, 
      color: "text-[#99f6e4]", 
      bgColor: "bg-[#99f6e4]", 
      borderColor: "border-[#99f6e4]/20",
      bgGradient: "from-[#99f6e4]/10 to-[#99f6e4]/5",
      progress: goalsCount > 0 ? 25 : 0 
    },
    { 
      label: "XP Total", 
      count: null,
      icon: Zap, 
      color: "text-amber-300", 
      bgColor: "bg-amber-300", 
      borderColor: "border-amber-400/20",
      bgGradient: "from-amber-400/10 to-amber-300/5",
      progress: progressPercentage
    },
  ];

  return (
    // Big Card Radius: 14px
    <Card className="card-glass overflow-hidden shadow-2xl shadow-black/60 border-white/10 rounded-[14px]">
      {/* Big Card Padding Header: 20px 24px */}
      <CardHeader className="py-[20px] px-[24px] border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent">
        <div className="flex items-center justify-between">
          {/* Title: 14px, 700, #e8f5f3 */}
          <CardTitle className="text-[14px] font-[700] text-[#e8f5f3] flex items-center gap-2 uppercase tracking-[0.02em]">
            <span className="w-2 h-2 rounded-full bg-[#4adbc8] shadow-[0_0_8px_rgba(74,219,200,0.8)]"></span>
            Status Mensal
          </CardTitle>
          {/* Badge: 11px, 700, padding 3px 10px, radius 999 */}
          <span className="text-[11px] font-[700] text-black bg-[#4adbc8] px-[10px] py-[3px] rounded-[999px]">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </CardHeader>
      {/* Big Card Padding Content: 20px 24px */}
      <CardContent className="space-y-8 pt-8 px-[24px] pb-[20px] bg-gradient-to-r from-transparent to-white/[0.02]">
        <div className="space-y-2">
          {/* Label: 11px, 700, uppercase, rgba(255,255,255,0.45) */}
          <div className="flex justify-between text-[11px] text-white/45 font-[700] uppercase tracking-[0.1em]">
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

        {/* Gap Cards: 12px */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[12px]">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={cn(
                // Medium Card: Radius 10px, Padding 16px 18px
                "group flex flex-col justify-center py-[16px] px-[18px] h-[105px] rounded-[10px] border transition-all duration-300 relative overflow-hidden shadow-md shadow-black/20",
                "bg-gradient-to-br hover:opacity-100 opacity-90",
                stat.bgGradient,
                stat.borderColor
              )}
            >
              <div className="relative z-10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="p-1.5 rounded-lg bg-black/40 border border-white/5 shrink-0">
                        <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
                     </div>
                     {/* Label: 11px, 700, uppercase */}
                     <span className="text-[11px] font-[700] uppercase tracking-[0.1em] text-white/80 truncate">
                       {stat.label}
                     </span>
                  </div>
                  {stat.label === "XP Total" && (
                    <span className="text-[14px] font-black font-rajdhani text-white">
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
                  <p className="text-[11px] font-[700] text-white/80 uppercase tracking-tight truncate">
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