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
  '/tarefas': { title: 'Tarefas', subtitle: 'Gerenciamento do seu dia', color: '#38bdf8', icon: ClipboardList },
  '/metas': { title: 'Metas', subtitle: 'Foco nos grandes objetivos', color: '#34d399', icon: Target },
  '/missoes': { title: 'Missões', subtitle: 'Desafios e conquistas épicas', color: '#f0b429', icon: Zap },
  '/lembretes': { title: 'Lembretes', subtitle: 'Alertas e compromissos', color: '#ec4899', icon: Bell },
  '/comunidade': { title: 'Comunidade', subtitle: 'Conexão e troca de ideias', color: '#a78bfa', icon: Users },
  '/loja': { title: 'Loja', subtitle: 'Resgate suas recompensas', color: '#fb923c', icon: ShoppingBag },
  '/configuracoes': { title: 'Ajustes', subtitle: 'Personalize sua experiência', color: '#94a3b8', icon: Settings },
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

  const commonShadow = "shadow-[0_8px_32px_rgba(0,0,0,0.4)]";
  const commonBg = "bg-gradient-to-b from-[#0d1716] to-[#050f0e]";
  const commonBorder = "border-[#2a4441]";

  return (
    <header className="sticky top-0 w-full flex justify-center z-50 pt-2 md:pt-4 pointer-events-none">
      <div className="flex items-center justify-center sm:justify-between w-full max-w-5xl pointer-events-auto py-8 px-6 -my-8 overflow-visible">
        
        {/* LADO ESQUERDO: Main Page Capsule */}
        <div 
          className={`hidden sm:flex items-center gap-3 px-5 py-3 rounded-full ${commonBg} border ${commonBorder} ${commonShadow} transition-all duration-300 flex-shrink-0`}
        >
          <div className="flex items-center gap-2.5">
            <Icon 
              size={18} 
              style={{ color: color, filter: `drop-shadow(0 0 4px ${color}44)` }}
            />
            <h1 className="text-[0.95rem] font-bold text-[#f0f0f0] tracking-tight leading-none whitespace-nowrap">
              {title}
            </h1>
          </div>

          <div className="w-px h-[14px] bg-[#2a4441] mx-1" />
          <span className="text-[0.68rem] text-[#888] font-medium tracking-wide leading-none whitespace-nowrap">
            {subtitle}
          </span>
        </div>

        {/* GRUPO DE STATS */}
        <div className="flex items-center gap-2.5 md:gap-3 flex-shrink-0">
          
          <button 
            className={`h-[40px] md:h-[48px] px-3.5 md:px-5 flex items-center gap-2 md:gap-3 rounded-[15px] md:rounded-[20px] ${commonBg} border ${commonBorder} ${commonShadow} group transition-all duration-300 hover:border-[#fb923c44] active:scale-95 outline-none`}
          >
            <Coins 
              size={15} 
              className="text-[#fb923c] fill-[#fb923c22] md:w-[19px] md:h-[19px]" 
              style={{ filter: 'drop-shadow(0 0 4px #fb923c44)' }}
            />
            <span className="text-[0.8rem] md:text-[0.9rem] font-bold text-[#fb923c] tracking-tight">
              {userStats.coins}
            </span>
          </button>

          <button 
            onClick={() => setActiveModal('profile')}
            className={`h-[40px] md:h-[48px] px-3.5 md:px-5 flex items-center gap-2 md:gap-3 rounded-[15px] md:rounded-[20px] ${commonBg} border ${commonBorder} ${commonShadow} group transition-all duration-300 hover:border-[#4adbc844] active:scale-95 outline-none`}
          >
            <Zap 
              size={15} 
              className="text-[#4adbc8] fill-[#4adbc822] md:w-[19px] md:h-[19px]" 
              style={{ filter: 'drop-shadow(0 0 4px #4adbc844)' }}
            />
            <span className="text-[0.8rem] md:text-[0.9rem] font-bold text-[#4adbc8] tracking-tight">
              {userStats.xp}
            </span>
          </button>

          <button 
            onClick={() => setActiveModal('achievements')}
            className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] flex items-center justify-center rounded-[15px] md:rounded-[20px] ${commonBg} border ${commonBorder} ${commonShadow} group transition-all duration-300 hover:border-[#a855f744] active:scale-95 outline-none`}
          >
            <Trophy 
              size={17} 
              className="text-[#a855f7] md:w-[21px] md:h-[21px]"
              style={{ filter: 'drop-shadow(0 0 4px #a855f744)' }}
            />
          </button>

          <button 
            onClick={() => setActiveModal('profile')}
            className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] flex items-center justify-center rounded-[15px] md:rounded-[20px] ${commonBg} border ${commonBorder} ${commonShadow} group transition-all duration-300 hover:border-[#38bdf844] active:scale-95 outline-none`}
          >
            <UserCircle 
              size={22} 
              className="text-[#38bdf8] md:w-[26px] md:h-[26px]"
              style={{ filter: 'drop-shadow(0 0 4px #38bdf844)' }}
            />
          </button>
        </div>
      </div>

      {/* Modais de Informação */}
      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className={`${commonBg} border ${commonBorder} text-[#f0f0f0] w-[90vw] sm:max-w-[400px] rounded-[32px] p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] outline-none mx-auto`}>
          
          {activeModal === 'achievements' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#a855f722] to-transparent border border-[#a855f733] flex items-center justify-center mb-4">
                <Trophy size={32} className="text-[#a855f7]" />
              </div>
              <h2 className="text-xl font-bold mb-1">Conquistas</h2>
              <p className="text-sm text-[#888] mb-6">Você desbloqueou {userStats.titles} títulos épicos.</p>
              <div className="grid grid-cols-2 gap-3 w-full">
                {['Mestre do Foco', 'Persistente', 'Explorador', 'Visionário'].map((title) => (
                  <div key={title} className={`p-4 rounded-2xl ${commonBg} border ${commonBorder} flex flex-col items-center gap-2 group hover:border-[#a855f744] transition-colors`}>
                    <Award size={20} className="text-[#a855f7]" />
                    <span className="text-[0.7rem] font-medium text-[#ccc]">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModal === 'profile' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#38bdf822] to-transparent flex items-center justify-center border-2 border-[#38bdf833] shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                  <UserCircle size={48} className="text-[#38bdf8]" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#38bdf8] text-black text-[0.65rem] font-black px-2.5 py-1 rounded-full shadow-lg">
                  LVL {userStats.level}
                </div>
              </div>
              <h2 className="text-xl font-bold mb-1">{userStats.name}</h2>
              <p className="text-sm text-[#888] mb-6">Membro da Comunidade</p>
              
              <div className={`w-full ${commonBg} rounded-2xl p-5 border ${commonBorder}`}>
                <div className="flex justify-between text-[0.7rem] mb-2.5 text-[#888] font-medium">
                  <span>Progresso de XP</span>
                  <span>{userStats.xp} / {userStats.nextLevelXp}</span>
                </div>
                <div className="w-full h-2.5 bg-[#050f0e] rounded-full overflow-hidden border border-[#2a4441]">
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