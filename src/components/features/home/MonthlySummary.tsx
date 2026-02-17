import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ListTodo, Target, Trophy } from 'lucide-react';

interface MonthlySummaryProps {
  totalXP: number;
  habitsCount: number;
}

export const MonthlySummary = ({ totalXP, habitsCount }: MonthlySummaryProps) => {
  // Mock data for features not yet implemented (Tarefas/Metas)
  const tasksCount = 0;
  const goalsCount = 0;
  
  // Calculate days passed in month for progress bar logic (example logic)
  const date = new Date();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const progressPercent = Math.round((date.getDate() / daysInMonth) * 100);
  
  const currentMonth = date.toLocaleDateString('pt-BR', { month: 'long' });

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm mb-6 overflow-hidden">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 capitalize">
            Progresso de {currentMonth}
          </CardTitle>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
            <CheckCircle2 size={20} className="mb-2 opacity-70" />
            <span className="text-2xl font-black">{habitsCount}</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Hábitos</span>
          </div>
          
          <div className="flex flex-col items-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
            <ListTodo size={20} className="mb-2 opacity-70" />
            <span className="text-2xl font-black">{tasksCount}</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Tarefas</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
            <Target size={20} className="mb-2 opacity-70" />
            <span className="text-2xl font-black">{goalsCount}</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Metas</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
            <Trophy size={20} className="mb-2 opacity-70" />
            <span className="text-2xl font-black">{totalXP}</span>
            <span className="text-xs uppercase tracking-wider font-semibold">XP Total</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};