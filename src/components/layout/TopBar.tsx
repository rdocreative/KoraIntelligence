"use client";

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { 
  Home,
  ClipboardList,
  Target,
  Zap,
  Bell,
  Users,
  ShoppingBag,
  Settings,
  Eye,
  LucideIcon,
  Trophy,
  UserCircle,
  Award,
  Coins
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface PageConfig {
  title: string;
  subtitle: string;
  color: string;
  icon: LucideIcon;
}

const pageConfigs: Record<string, PageConfig> = {
  '/': { title: 'Início', subtitle: 'Visão total do seu progresso', color: '#4adbc8', icon: Home },
  '/habitos': { title: 'Hábitos', subtitle: 'Seus hábitos de hoje', color: '#38bdf8', icon: ClipboardList },
  '/tarefas': { title: 'Hábitos', subtitle: 'Seus hábitos de hoje', color: '#38bdf8', icon: ClipboardList },
  '/metas': { title: 'Metas', subtitle: 'Foco nos grandes objetivos', color: '#34d399', icon: Target },
  '/missoes': { title: 'Missões', subtitle: 'Desafios e conquistas épicas', color: '#f0b429', icon: Zap },
  '/lembretes': { title: 'Lembretes', subtitle: 'Alertas e compromissos', color: '#ec4899', icon: Bell },
  '/comunidade': { title: 'Comunidade', subtitle: 'Conexão e troca de ideias', color: '#a78bfa', icon: Users },
  '/loja': { title: 'Loja', subtitle: 'Resgate suas recompensas', color: '#fb923c', icon: ShoppingBag },
  '/configuracoes': { title: 'Ajustes', subtitle: 'Personalize sua experiênia', color: '#94a3b8', icon: Settings },
  '/masterplan': { title: 'Master Plan', subtitle: 'Sua visão estratégica futura', color: '#a855f7', icon: Eye }
};

export const TopBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const config = pageConfigs[currentPath] || pageConfigs['/'];
  const { title, subtitle, color, icon: Icon } = config;
  const { profile } = useProfile();

  const [activeModal, setActiveModal] = useState<'achievements' | 'profile' | 'wallet' | null>(null);

  const userStats = {
    name: profile?.nome || "Usuário",
    titles: 0, 
    level: profile?.nivel || 1,
    xp: profile?.xp_total || 0,
    coins: profile?.moedas || 0,
    nextLevelXp: (profile?.nivel || 1) * 1000 
  };

  const commonShadow = "shadow-[0_4px_0_0_#0b1116]";
  const commonBg = "bg-[#202f36]";
  const commonBorder = "border-[#374151]";

  return (
    <header className="sticky top-0 w-full flex justify-center z-50 pt-1 md:pt-2 pointer-events-none">
      <div className="flex items-center justify-center sm:justify-between w-full max-w-[90rem] pointer-events-auto py-2 px-6 overflow-visible">
        
        {/* LADO ESQUERDO: Main Page Capsule */}
        <div 
          className={`hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full ${commonBg} border-2 ${commonBorder} ${commonShadow} transition-all duration-300 flex-shrink-0`}
        >
          <div className="flex items-center gap-2">
            <Icon 
              size={16} 
              style={{ color: color, filter: `drop-shadow(0 0 4px ${color}44)` }}
            />
            <h1 className="text-[13px] font-[800] text-[#e8f5f3] tracking-tight leading-none whitespace-nowrap uppercase">
              {title}
            </h1>
          </div>

          <div className="w-px h-[12px] bg-[#374151] mx-0.5" />
          
          <span className="text-[11px] font-[500] text-[#9ca3af] tracking-wide leading-none whitespace-nowrap overflow-visible">
            {subtitle}
          </span>
        </div>

        {/* GRUPO DE STATS */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button className={`h-[36px] md:h-[42px] px-3 md:px-4 flex items-center gap-2 rounded-[12px] md:rounded-[16px] ${commonBg} border-2 ${commonBorder} ${commonShadow} group transition-all duration-300 hover:scale-[1.02] active:translate-y-[1px] active:shadow-none outline-none`}>
            <Coins size={14} className="text-[#fb923c] fill-[#fb923c22] md:w-[17px] md:h-[17px]" style={{ filter: 'drop-shadow(0 0 4px #fb923c44)' }} />
            <span className="text-[13px] font-[700] text-[#fb923c] tracking-tight">{userStats.coins}</span>
          </button>

          <button onClick={() => setActiveModal('profile')} className={`h-[36px] md:h-[42px] px-3 md:px-4 flex items-center gap-2 rounded-[12px] md:rounded-[16px] ${commonBg} border-2 ${commonBorder} ${commonShadow} group transition-all duration-300 hover:scale-[1.02] active:translate-y-[1px] active:shadow-none outline-none`}>
            <Zap size={14} className="text-[#4adbc8] fill-[#4adbc822] md:w-[17px] md:h-[17px]" style={{ filter: 'drop-shadow(0 0 4px #4adbc844)' }} />
            <span className="text-[13px] font-[700] text-[#4adbc8] tracking-tight">{userStats.xp}</span>
          </button>

          <button onClick={() => setActiveModal('achievements')} className={`w-[36px] h-[36px] md:w-[42px] md:h-[42px] flex items-center justify-center rounded-[12px] md:rounded-[16px] ${commonBg} border-2 ${commonBorder} ${commonShadow} group transition-all duration-300 hover:scale-[1.02] active:translate-y-[1px] active:shadow-none outline-none`}>
            <Trophy size={15} className="text-[#f5a623] md:w-[19px] md:h-[19px]" style={{ filter: 'drop-shadow(0 0 4px #f5a62344)' }} />
          </button>

          <button onClick={() => setActiveModal('profile')} className={`w-[36px] h-[36px] md:w-[42px] md:h-[42px] flex items-center justify-center rounded-[12px] md:rounded-[16px] ${commonBg} border-2 ${commonBorder} ${commonShadow} group transition-all duration-300 hover:scale-[1.02] active:translate-y-[1px] active:shadow-none outline-none`}>
            <UserCircle size={20} className="text-[#38bdf8] md:w-[24px] md:h-[24px]" style={{ filter: 'drop-shadow(0 0 4px #38bdf844)' }} />
          </button>
        </div>
      </div>

      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className={`${commonBg} border-2 ${commonBorder} text-[#f0f0f0] w-[90vw] sm:max-w-[380px] rounded-[32px] p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] outline-none mx-auto`}>
          {activeModal === 'achievements' && (
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#f5a62322] to-transparent border border-[#f5a62333] flex items-center justify-center mb-3">
                <Trophy size={28} className="text-[#f5a623]" />
              </div>
              <h2 className="text-lg font-bold mb-1">Conquistas</h2>
              <p className="text-xs text-[#888] mb-5">Você desbloqueou {userStats.titles} títulos épicos.</p>
              <div className="grid grid-cols-2 gap-2.5 w-full">
                {['Mestre do Foco', 'Persistente', 'Explorador', 'Visionário'].map((title) => (
                  <div key={title} className={`p-3.5 rounded-xl ${commonBg} border-2 ${commonBorder} flex flex-col items-center gap-1.5 group hover:border-[#f5a62344] transition-colors`}>
                    <Award size={18} className="text-[#f5a623]" />
                    <span className="text-[0.65rem] font-medium text-[#ccc]">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModal === 'profile' && (
            <div className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#38bdf822] to-transparent flex items-center justify-center border-2 border-[#38bdf833] shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                  <UserCircle size={40} className="text-[#38bdf8]" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#38bdf8] text-black text-[0.6rem] font-black px-2 py-0.5 rounded-full shadow-lg">
                  LVL {userStats.level}
                </div>
              </div>
              <h2 className="text-lg font-bold mb-1">{userStats.name}</h2>
              <p className="text-xs text-[#888] mb-5">Membro da Comunidade</p>
              
              <div className={`w-full ${commonBg} rounded-xl p-4 border-2 ${commonBorder}`}>
                <div className="flex justify-between text-[0.65rem] mb-2 text-[#888] font-medium">
                  <span>Progresso de XP</span>
                  <span>{userStats.xp} / {userStats.nextLevelXp}</span>
                </div>
                <div className="w-full h-2 bg-[#050f0e] rounded-full overflow-hidden border border-[#2a4441]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#38bdf8] to-[#818cf8] transition-all duration-700 shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                    style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
};