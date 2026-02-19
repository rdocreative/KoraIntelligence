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
  X,
  TrendingUp,
  Award,
  Star
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

  // Estados para os modais
  const [activeModal, setActiveModal] = useState<'coins' | 'achievements' | 'profile' | null>(null);

  const userStats = {
    coins: "1.250",
    titles: 12,
    level: 24,
    xp: 850,
    nextLevelXp: 1000
  };

  return (
    <header className="sticky top-0 w-full flex justify-center z-50 pt-10 pb-5 pointer-events-none">
      <div 
        className="flex items-center gap-[14px] px-6 py-3 rounded-full bg-gradient-to-r from-[#141415] to-[#1b1b1c] border border-[#303030] shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-all duration-300 pointer-events-auto"
      >
        {/* Page Icon & Title */}
        <div className="flex items-center gap-3">
          <Icon 
            size={18} 
            style={{ color: color, filter: `drop-shadow(0 0 5px ${color}88)` }}
            className="transition-all duration-500"
          />
          <h1 className="text-[0.9rem] font-bold text-[#f0f0f0] tracking-tight leading-none">
            {title}
          </h1>
        </div>

        <div className="w-px h-[16px] bg-[#303030]" />

        <span className="text-[0.68rem] text-[#888] font-medium tracking-wide leading-none mr-2">
          {subtitle}
        </span>

        <div className="w-px h-[16px] bg-[#303030]" />

        {/* User Stats Clicáveis */}
        <div className="flex items-center gap-4 ml-1">
          {/* Coins */}
          <button 
            onClick={() => setActiveModal('coins')}
            className="flex items-center gap-1.5 group outline-none"
          >
            <Coins 
              size={14} 
              className="text-[#fb923c] transition-all duration-300 group-hover:scale-110 group-active:scale-95" 
              style={{ filter: 'drop-shadow(0 0 4px #fb923c66)' }}
            />
            <span className="text-[0.75rem] font-bold text-[#f0f0f0]">{userStats.coins}</span>
          </button>

          {/* Achievements */}
          <button 
            onClick={() => setActiveModal('achievements')}
            className="flex items-center gap-1.5 group outline-none"
          >
            <Trophy 
              size={14} 
              className="text-[#a855f7] transition-all duration-300 group-hover:scale-110 group-active:scale-95"
              style={{ filter: 'drop-shadow(0 0 4px #a855f766)' }}
            />
            <span className="text-[0.75rem] font-bold text-[#f0f0f0]">{userStats.titles}</span>
          </button>

          {/* Profile */}
          <button 
            onClick={() => setActiveModal('profile')}
            className="flex items-center justify-center pl-1 group outline-none"
          >
            <UserCircle 
              size={20} 
              className="text-[#38bdf8] transition-all duration-300 group-hover:scale-110 group-active:scale-95"
              style={{ filter: 'drop-shadow(0 0 4px #38bdf866)' }}
            />
          </button>
        </div>
      </div>

      {/* Modais de Informação */}
      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#141415] border-[#303030] text-[#f0f0f0] sm:max-w-[400px] rounded-[24px] p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          {activeModal === 'coins' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#fb923c22] flex items-center justify-center mb-4">
                <Coins size={32} className="text-[#fb923c]" />
              </div>
              <h2 className="text-xl font-bold mb-1">Suas Moedas</h2>
              <p className="text-sm text-[#888] mb-6">Você acumulou {userStats.coins} moedas de ouro.</p>
              <div className="w-full space-y-3">
                <div className="p-4 rounded-2xl bg-[#1b1b1c] border border-[#303030] flex justify-between items-center">
                  <span className="text-sm text-[#888]">Saldo Total</span>
                  <span className="text-lg font-bold text-[#fb923c]">{userStats.coins}</span>
                </div>
                <button className="w-full py-3 rounded-2xl bg-[#fb923c] text-black font-bold text-sm hover:opacity-90 transition-opacity">
                  Ir para a Loja
                </button>
              </div>
            </div>
          )}

          {activeModal === 'achievements' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#a855f722] flex items-center justify-center mb-4">
                <Trophy size={32} className="text-[#a855f7]" />
              </div>
              <h2 className="text-xl font-bold mb-1">Conquistas</h2>
              <p className="text-sm text-[#888] mb-6">Você desbloqueou {userStats.titles} títulos épicos.</p>
              <div className="grid grid-cols-2 gap-3 w-full">
                {['Mestre do Foco', 'Persistente', 'Explorador', 'Visionário'].map((title) => (
                  <div key={title} className="p-3 rounded-2xl bg-[#1b1b1c] border border-[#303030] flex flex-col items-center gap-2">
                    <Award size={20} className="text-[#a855f7]" />
                    <span className="text-[0.7rem] font-medium">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModal === 'profile' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-[#38bdf822] flex items-center justify-center border-2 border-[#38bdf844]">
                  <UserCircle size={48} className="text-[#38bdf8]" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#38bdf8] text-black text-[0.6rem] font-black px-2 py-0.5 rounded-full">
                  LVL {userStats.level}
                </div>
              </div>
              <h2 className="text-xl font-bold mb-1">Usuário Mestre</h2>
              <p className="text-sm text-[#888] mb-6">Membro desde Outubro 2023</p>
              
              <div className="w-full bg-[#1b1b1c] rounded-2xl p-4 border border-[#303030]">
                <div className="flex justify-between text-[0.7rem] mb-2 text-[#888]">
                  <span>Progresso de XP</span>
                  <span>{userStats.xp} / {userStats.nextLevelXp}</span>
                </div>
                <div className="w-full h-2 bg-[#303030] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#38bdf8] to-[#818cf8] transition-all duration-500"
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