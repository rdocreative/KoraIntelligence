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
    <Card className="card-glass border-white/10 h-full overflow-hidden shadow-2xl shadow-black/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent">
        <CardTitle className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">SEU NÍVEL</CardTitle>
        <Crown className="h-5 w-5 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
      </CardHeader>
      <CardContent className="pt-8 space-y-8 bg-gradient-to-r from-transparent to-white/[0.02]">
        <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-[2rem] bg-black/40 flex items-center justify-center text-4xl border border-white/10 shadow-2xl relative group">
                <div className="absolute inset-0 bg-red-600/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">{currentBadge.icon}</span>
            </div>
            <div>
                <div className="text-3xl font-black text-white tracking-tight">{currentBadge.name}</div>
                <div className="text-xs text-red-500 font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <Zap size={16} fill="currentColor" className="animate-pulse" /> 
                    <span className="font-rajdhani text-2xl leading-none text-white">{streak}</span> DIAS DE STREAK
                </div>
            </div>
        </div>

        {nextBadge ? (
          <div className="space-y-4">
             <div className="flex justify-between text-[11px] font-black text-white/20 uppercase tracking-[0.2em]">
                <span className="font-rajdhani text-base text-white">XP: {totalPoints}</span>
                <span className="font-rajdhani text-base">PRÓXIMO: {nextBadge.threshold}</span>
             </div>
             <div className="h-3 w-full bg-black/40 rounded-full border border-white/5 p-0.5">
                <div 
                    className="h-full bg-gradient-to-r from-red-800 to-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)] rounded-full transition-all duration-1000" 
                    style={{ width: `${progress}%` }} 
                />
             </div>
             <p className="text-[11px] text-white/30 text-center mt-2 font-black uppercase tracking-[0.15em]">
               Faltam <span className="text-red-500 font-rajdhani text-base">{nextBadge.threshold - totalPoints} XP</span> para {nextBadge.name}
             </p>
          </div>
        ) : (
          <div className="text-center text-yellow-500 font-black text-sm uppercase tracking-[0.3em] py-4 border border-dashed border-yellow-500/20 rounded-2xl bg-yellow-500/5">
            Nível Máximo Atingido!
          </div>
        )}
      </CardContent>
    </Card>
  );
};