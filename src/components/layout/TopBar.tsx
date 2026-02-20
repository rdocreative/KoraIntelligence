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

  const commonShadow = "shadow-[0_8px_32px_rgba(0,0,0,0.5)]";
  // Fundo matizado com o novo azul ultra escuro
  const btnBg = "bg-[#040e0d]";
  const btnBorder = "border-[#4adbc8]/10";

  return (
    <header className="sticky top-0 w-full flex justify-center z-50 pt-2 md:pt-4 pointer-events-none">
      <div className="flex items-center justify-center sm:justify-between w-full max-w-5xl pointer-events-auto py-8 px-6 -my-8 overflow-visible">
        
        <div 
          className={`hidden sm:flex items-center gap-3 px-5 py-3 rounded-full ${btnBg} border ${btnBorder} ${commonShadow} transition-all duration-300 flex-shrink-0`}
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

          <div className="w-px h-[14px] bg-white/5 mx-1" />
          <span className="text-[0.68rem] text-white/40 font-medium tracking-wide leading-none whitespace-nowrap">
            {subtitle}
          </span>
        </div>

        <div className="flex items-center gap-2.5 md:gap-3 flex-shrink-0">
          <button 
            className={`h-[40px] md:h-[48px] px-3.5 md:px-5 flex items-center gap-2 md:gap-3 rounded-[15px] md:rounded-[20px] ${btnBg} border ${btnBorder} ${commonShadow} group transition-all duration-300 hover:border-[#fb923c44] active:scale-95 outline-none`}
          >
            <Coins size={15} className="text-[#fb923c] fill-[#fb923c22] md:w-[19px] md:h-[19px]" />
            <span className="text-[0.8rem] md:text-[0.9rem] font-bold text-[#fb923c] tracking-tight">{userStats.coins}</span>
          </button>

          <button 
            onClick={() => setActiveModal('profile')}
            className={`h-[40px] md:h-[48px] px-3.5 md:px-5 flex items-center gap-2 md:gap-3 rounded-[15px] md:rounded-[20px] ${btnBg} border ${btnBorder} ${commonShadow} group transition-all duration-300 hover:border-[#4adbc844] active:scale-95 outline-none`}
          >
            <Zap size={15} className="text-[#4adbc8] fill-[#4adbc822] md:w-[19px] md:h-[19px]" />
            <span className="text-[0.8rem] md:text-[0.9rem] font-bold text-[#4adbc8] tracking-tight">{userStats.xp}</span>
          </button>

          <button 
            onClick={() => setActiveModal('achievements')}
            className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] flex items-center justify-center rounded-[15px] md:rounded-[20px] ${btnBg} border ${btnBorder} ${commonShadow} group transition-all duration-300 hover:border-[#a855f744] active:scale-95 outline-none`}
          >
            <Trophy size={17} className="text-[#a855f7]" />
          </button>

          <button 
            onClick={() => setActiveModal('profile')}
            className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] flex items-center justify-center rounded-[15px] md:rounded-[20px] ${btnBg} border ${btnBorder} ${commonShadow} group transition-all duration-300 hover:border-[#38bdf844] active:scale-95 outline-none`}
          >
            <UserCircle size={22} className="text-[#38bdf8]" />
          </button>
        </div>
      </div>

      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#040e0d] border-[#4adbc8]/10 text-[#f0f0f0] w-[90vw] sm:max-w-[400px] rounded-[32px] p-0 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] outline-none mx-auto">
          {/* Conteúdo do modal mantido, apenas atualizando o BG para o novo azul profundo */}
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
              <div className="w-full bg-[#020807] rounded-2xl p-5 border border-white/5 mt-4">
                <div className="flex justify-between text-[0.7rem] mb-2.5 text-white/40 font-medium">
                  <span>Progresso de XP</span>
                  <span>{userStats.xp} / {userStats.nextLevelXp}</span>
                </div>
                <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-[#4adbc8] to-[#38bdf8] transition-all duration-700"
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