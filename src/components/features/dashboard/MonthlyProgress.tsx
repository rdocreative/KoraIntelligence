import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle2, ListTodo, Zap, ChevronRight } from "lucide-react";

interface MonthlyProgressProps {
  totalPoints: number;
  habitsCount: number;
}

export const MonthlyProgress = ({ totalPoints, habitsCount }: MonthlyProgressProps) => {
  const MONTHLY_XP_TARGET = 1000;
  const progressPercentage = Math.min(100, (totalPoints / MONTHLY_XP_TARGET) * 100);
  
  const stats = [
    { label: "Hábitos", value: habitsCount, icon: CheckCircle2, color: "text-red-500" },
    { label: "Tarefas", value: "0", icon: ListTodo, color: "text-[#6b6b7a]" },
    { label: "Metas", value: "0", icon: Target, color: "text-[#6b6b7a]" },
    { label: "XP Total", value: totalPoints, icon: Zap, color: "text-yellow-500" },
  ];

  return (
    <Card className="bg-transparent border border-[#222230] rounded-2xl shadow-none">
      <CardHeader className="pb-4 border-b border-[#222230]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Status Mensal
          </CardTitle>
          <span className="text-xs font-mono text-red-500 bg-red-950/20 px-2 py-1 rounded border border-red-900/40">
            {Math.round(progressPercentage)}% COMPLETADO
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[#6b6b7a] mb-1 font-normal">
             <span>Progresso de Nível</span>
             <span className="font-rajdhani font-bold text-white text-sm">{totalPoints} / {MONTHLY_XP_TARGET} XP</span>
          </div>
          <div className="h-2 w-full bg-[#1e1e28] rounded-full overflow-hidden border border-[#222230]">
            <div 
                className="h-full bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="group relative flex flex-col justify-between p-4 rounded-xl bg-transparent border border-[#1e1e2a] hover:bg-white/[0.03] transition-all cursor-default">
              <div className="flex justify-between items-start mb-2">
                 <stat.icon className={`h-5 w-5 ${stat.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform`} />
                 <ChevronRight className="h-3 w-3 text-[#6b6b7a] group-hover:text-white" />
              </div>
              <div>
                <span className="block text-2xl font-rajdhani font-bold text-white group-hover:text-red-100 transition-colors">{stat.value}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b6b7a]">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};