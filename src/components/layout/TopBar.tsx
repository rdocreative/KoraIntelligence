"use client";

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  Coins,
  Trophy,
  UserCircle,
  Award
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

// Configuração das páginas para cores e textos
interface PageConfig {
  title: string;
  subtitle: string;
  color: string;
  icon: LucideIcon;
}

const pageConfigs: Record<string, PageConfig> = {
  '/': { title: 'Início', subtitle: 'Visão total do seu progresso', color: '#e8283a', icon: Home },
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

  const [activeModal, setActiveModal] = useState<'coins' | 'achievements' | 'profile' | null>(null);

  const userStats = {
    coins: "1.250",
    titles: 12,
    level: 24,
    xp: 850,
    nextLevelXp: 1000
  };

  return (
    <header className="sticky top-0 w-full flex justify-center z-50 pt-6 md:pt-10 pb-2 pointer-events-none px-4">
      <div className="flex items-center gap-2 md:gap-3 pointer-events-auto max-w-full overflow-x-auto no-scrollbar py-4 px-2">
        
        {/* Main Page Capsule - Hidden on Mobile */}
        <div 
          className="hidden sm:flex items-center gap-3 md:gap-[14px] px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-[#141415] border border-[#303030] shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-all duration-300 flex-shrink-0"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <Icon 
              size={18} 
              style={{ color: color, filter: `drop-shadow(0 0 5px ${color}88)` }}
            />
            <h1 className="text-[0.85rem] md:text-[0.9rem] font-bold text-[#f0f0f0] tracking-tight leading-none whitespace-nowrap">
              {title}
            </h1>
          </div>

          <div className="w-px h-[16px] bg-[#303030]" />
          <span className="text-[0.68rem] text-[#888] font-medium tracking-wide leading-none whitespace-nowrap">
            {subtitle}
          </span>
        </div>

        {/* Stats and Action Group */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          
          {/* XP Pill */}
          <button 
            onClick={() => setActiveModal('profile')}
            className="h-9 md:h-11 px-3 md:px-4 flex items-center gap-2 md:gap-3 rounded-[14px] md:rounded-[18px] bg-[#141415] border border-[#303030] shadow-[0_4px_16px_rgba(0,0,0,0.4)] group transition-all duration-300 hover:border-[#e8283a44] active:scale-95 outline-none"
          >
            <Zap 
              size={14} 
              className="text-[#e8283a] fill-[#e8283a22] md:w-4 md:h-4" 
              style={{ filter: 'drop-shadow(0 0 4px #e8283a66)' }}
            />
            <span className="text-[0.75rem] md:text-[0.85rem] font-bold text-[#e8283a] tracking-tight">
              {userStats.xp}
            </span>
          </button>

          {/* Coins Pill */}
          <button 
            onClick={() => setActiveModal('coins')}
            className="h-9 md:h-11 px-3 md:px-4 flex items-center gap-2 md:gap-3 rounded-[14px] md:rounded-[18px] bg-[#141415] border border-[#303030] shadow-[0_4px_16px_rgba(0,0,0,0.4)] group transition-all duration-300 hover:border-[#fb923c44] active:scale-95 outline-none"
          >
            <Coins 
              size={14} 
              className="text-[#fb923c] md:w-4 md:h-4" 
              style={{ filter: 'drop-shadow(0 0 4px #fb923c66)' }}
            />
            <span className="text-[0.75rem] md:text-[0.85rem] font-bold text-[#fb923c] tracking-tight">
              {userStats.coins}
            </span>
          </button>

          {/* Achievement Square */}
          <button 
            onClick={() => setActiveModal('achievements')}
            className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-[14px] md:rounded-[18px] bg-[#141415] border border-[#303030] shadow-[0_4px_16px_rgba(0,0,0,0.4)] group transition-all duration-300 hover:border-[#a855f744] active:scale-95 outline-none"
          >
            <Trophy 
              size={16} 
              className="text-[#a855f7] md:w-[18px] md:h-[18px]"
              style={{ filter: 'drop-shadow(0 0 4px #a855f766)' }}
            />
          </button>

          {/* Profile Square */}
          <button 
            onClick={() => setActiveModal('profile')}
            className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-[14px] md:rounded-[18px] bg-[#141415] border border-[#303030] shadow-[0_4px_16px_rgba(0,0,0,0.4)] group transition-all duration-300 hover:border-[#38bdf844] active:scale-95 outline-none"
          >
            <UserCircle 
              size={18} 
              className="text-[#38bdf8] md:w-[22px] md:h-[22px]"
              style={{ filter: 'drop-shadow(0 0 4px #38bdf866)' }}
            />
          </button>
        </div>
      </div>

      {/* Modais de Informação */}
      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#141415] border-[#303030] text-[#f0f0f0] w-[90vw] sm:max-w-[400px] rounded-[32px] p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] outline-none border-opacity-50 mx-auto">
          
          {activeModal === 'coins' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#fb923c22] to-transparent border border-[#fb923c33] flex items-center justify-center mb-4">
                <Coins size={32} className="text-[#fb923c]" />
              </div>
              <h2 className="text-xl font-bold mb-1">Suas Moedas</h2>
              <p className="text-sm text-[#888] mb-6">Você acumulou {userStats.coins} moedas de ouro.</p>
              <div className="w-full space-y-3">
                <div className="p-4 rounded-2xl bg-[#1b1b1c] border border-[#303030] flex justify-between items-center">
                  <span className="text-sm text-[#888]">Saldo Total</span>
                  <span className="text-lg font-bold text-[#fb923c]">{userStats.coins}</span>
                </div>
                <button className="w-full py-4 rounded-2xl bg-[#fb923c] text-black font-bold text-sm hover:brightness-110 transition-all active:scale-[0.98]">
                  Ir para a Loja
                </button>
              </div>
            </div>
          )}

          {activeModal === 'achievements' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#a855f722] to-transparent border border-[#a855f733] flex items-center justify-center mb-4">
                <Trophy size={32} className="text-[#a855f7]" />
              </div>
              <h2 className="text-xl font-bold mb-1">Conquistas</h2>
              <p className="text-sm text-[#888] mb-6">Você desbloqueou {userStats.titles} títulos épicos.</p>
              <div className="grid grid-cols-2 gap-3 w-full">
                {['Mestre do Foco', 'Persistente', 'Explorador', 'Visionário'].map((title) => (
                  <div key={title} className="p-4 rounded-2xl bg-[#1b1b1c] border border-[#303030] flex flex-col items-center gap-2 group hover:border-[#a855f744] transition-colors">
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
              <h2 className="text-xl font-bold mb-1">Usuário Mestre</h2>
              <p className="text-sm text-[#888] mb-6">Membro desde Outubro 2023</p>
              
              <div className="w-full bg-[#1b1b1c] rounded-2xl p-5 border border-[#303030]">
                <div className="flex justify-between text-[0.7rem] mb-2.5 text-[#888] font-medium">
                  <span>Progresso de XP</span>
                  <span>{userStats.xp} / {userStats.nextLevelXp}</span>
                </div>
                <div className="w-full h-2.5 bg-[#141415] rounded-full overflow-hidden border border-[#303030]">
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