import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Crown } from 'lucide-react';

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
    <Card className="bg-white/[0.05] border border-[#222230] rounded-2xl h-full shadow-none backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-white/[0.05]">
        <CardTitle className="text-[10px] font-bold text-[#6b6b7a] uppercase tracking-widest">SEU NÍVEL</CardTitle>
        <Crown className="h-5 w-5 text-yellow-500" />
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/[0.03] flex items-center justify-center text-3xl border border-white/[0.05]">
                {currentBadge.icon}
            </div>
            <div>
                <div className="text-2xl font-bold text-white">{currentBadge.name}</div>
                <div className="text-xs text-red-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                    <Zap size={14} fill="currentColor" /> <span className="font-rajdhani text-xl leading-none">{streak}</span> DIAS DE STREAK
                </div>
            </div>
        </div>

        {nextBadge ? (
          <div className="space-y-2">
             <div className="flex justify-between text-[11px] font-bold text-[#6b6b7a] uppercase tracking-wider">
                <span className="font-rajdhani text-sm text-white">XP: {totalPoints}</span>
                <span className="font-rajdhani text-sm">PRÓXIMO: {nextBadge.threshold}</span>
             </div>
             <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <div 
                    className="h-full bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.8)]" 
                    style={{ width: `${progress}%` }} 
                />
             </div>
             <p className="text-[11px] text-[#6b6b7a] text-center mt-2 font-bold uppercase tracking-widest">
               Faltam <span className="text-white font-rajdhani text-sm">{nextBadge.threshold - totalPoints} XP</span> para {nextBadge.name}
             </p>
          </div>
        ) : (
          <div className="text-center text-yellow-500 font-bold text-sm uppercase tracking-widest">
            Nível Máximo Atingido!
          </div>
        )}
      </CardContent>
    </Card>
  );
};