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
    <Card className="bg-white/[0.10] backdrop-blur-md border border-[#222230] rounded-2xl h-full shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#222230]">
        <CardTitle className="text-sm font-bold text-[#6b6b7a] uppercase tracking-widest">Seu Nível</CardTitle>
        <Crown className="h-5 w-5 text-yellow-500" />
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/[0.05] flex items-center justify-center text-3xl border border-[#1e1e2a]">
                {currentBadge.icon}
            </div>
            <div>
                <div className="text-2xl font-bold text-white glow-text">{currentBadge.name}</div>
                <div className="text-xs text-red-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> <span className="font-rajdhani text-lg leading-none">{streak}</span> Dias de Streak
                </div>
            </div>
        </div>

        {nextBadge ? (
          <div className="space-y-2">
             <div className="flex justify-between text-[10px] font-bold text-[#6b6b7a] uppercase">
                <span className="font-rajdhani text-sm">XP Atual: {totalPoints}</span>
                <span className="font-rajdhani text-sm">Próximo: {nextBadge.threshold}</span>
             </div>
             <div className="h-1.5 w-full bg-[#1e1e28] rounded-full overflow-hidden border border-[#222230]">
                <div 
                    className="h-full bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.8)]" 
                    style={{ width: `${progress}%` }} 
                />
             </div>
             <p className="text-xs text-[#6b6b7a] text-center mt-2 font-normal">
               Faltam <span className="text-white font-rajdhani font-bold">{nextBadge.threshold - totalPoints} XP</span> para {nextBadge.name}
             </p>
          </div>
        ) : (
          <div className="text-center text-yellow-500 font-bold text-sm">
            Nível Máximo Atingido!
          </div>
        )}
      </CardContent>
    </Card>
  );
};