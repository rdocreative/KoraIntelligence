import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Medal, Zap } from 'lucide-react';

interface GamificationProps {
  currentBadge: { name: string; icon: string; color: string; threshold: number };
  nextBadge: { name: string; icon: string; color: string; threshold: number } | null;
  totalPoints: number;
  streak: number;
}

export const Gamification = ({ currentBadge, nextBadge, totalPoints, streak }: GamificationProps) => {
  const progress = nextBadge 
    ? Math.min(100, Math.max(0, ((totalPoints - currentBadge.threshold) / (nextBadge.threshold - currentBadge.threshold)) * 100))
    : 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-indigo-900">Nível Atual</CardTitle>
          <span className="text-2xl">{currentBadge.icon}</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-700">{currentBadge.name}</div>
          <p className="text-xs text-indigo-500 mt-1">
            {totalPoints} pontos totais
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100 shadow-sm">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-900">Sequência (Streak)</CardTitle>
          <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-700">{streak} dias</div>
          <p className="text-xs text-amber-600 mt-1">
            Mantenha o ritmo!
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 bg-white border-slate-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">Próximo Nível: {nextBadge ? nextBadge.name : 'Mestre Supremo'}</CardTitle>
          {nextBadge && <span className="text-xl opacity-50">{nextBadge.icon}</span>}
        </CardHeader>
        <CardContent>
          {nextBadge ? (
            <div className="space-y-2">
               <div className="flex justify-between text-xs text-slate-500">
                  <span>{totalPoints} pts</span>
                  <span>{nextBadge.threshold} pts</span>
               </div>
               <Progress value={progress} className="h-3 bg-slate-100" indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500" />
               <p className="text-xs text-slate-400 text-center mt-2">
                 Faltam {nextBadge.threshold - totalPoints} pontos para subir de nível!
               </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-purple-600 font-medium">
              Você atingiu o nível máximo! 🚀
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
