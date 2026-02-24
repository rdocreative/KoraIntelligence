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
  '/': { title: 'Início', subtitle: 'Visão total do seu progresso', color: '#1CB0F6', icon: Home },
  '/habitos': { title: 'Hábitos', subtitle: 'Seus hábitos de hoje', color: '#1CB0F6', icon: ClipboardList },
  '/metas': { title: 'Metas', subtitle: 'Foco nos grandes objetivos', color: '#58CC02', icon: Target },
  '/missoes': { title: 'Missões', subtitle: 'Desafios e conquistas épicas', color: '#FF9600', icon: Zap },
  '/lembretes': { title: 'Lembretes', subtitle: 'Alertas e compromissos', color: '#FF4B4B', icon: Bell },
  '/comunidade': { title: 'Comunidade', subtitle: 'Conexão e troca de ideias', color: '#CE82FF', icon: Users },
  '/loja': { title: 'Loja', subtitle: 'Resgate suas recompensas', color: '#FF9600', icon: ShoppingBag },
  '/configuracoes': { title: 'Ajustes', subtitle: 'Personalize sua experiênia', color: '#6B7280', icon: Settings },
  '/masterplan': { title: 'Master Plan', subtitle: 'Sua visão estratégica futura', color: '#CE82FF', icon: Eye }
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

  const commonShadow = "shadow-[0_4px_0_0_#D1D5DB]";
  const commonBg = "bg-[#F4F6F9]";
  const commonBorder = "border-[#E2E6ED]";

  return (
    <header className="sticky top-0 w-full flex justify-center z-50 pt-2 md:pt-4 pointer-events-none">
      <div className="flex items-center justify-center sm:justify-between w-full max-w-[100rem] pointer-events-auto py-4 px-5 overflow-visible">
        
        <div 
          className={`hidden sm:flex items-center gap-3 px-5 py-3 rounded-full ${commonBg} border-2 ${commonBorder} ${commonShadow} transition-all duration-300 flex-shrink-0`}
        >
          <div className="flex items-center gap-2.5">
            <Icon 
              size={18} 
              style={{ color: color }}
            />
            <h1 className="text-[14px] font-[800] text-[#0A0C0F] tracking-tight leading-none whitespace-nowrap uppercase">
              {title}
            </h1>
          </div>

          <div className="w-px h-[14px] bg-[#E2E6ED] mx-1" />
          
          <span className="text-[12px] font-[500] text-[#6B7280] tracking-wide leading-none whitespace-nowrap overflow-visible">
            {subtitle}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button className={`h-[40px] md:h-[48px] px-3.5 md:px-5 flex items-center gap-2 md:gap-3 rounded-[15px] md:rounded-[20px] ${commonBg} border-2 ${commonBorder} ${commonShadow} group transition-all duration-300 hover:scale-[1.02] active:translate-y-[1px] active:shadow-none outline-none`}>
            <Coins size={15} className="text-[#FF9600]" />
            <span className="text-[14px] font-[700] text-[#FF9600] tracking-tight">{userStats.coins}</span>
          </button>

          <button onClick={() => setActiveModal('profile')} className={`h-[40px] md:h-[48px] px-3.5 md:px-5 flex items-center gap-2 md:gap-3 rounded-[15px] md:rounded-[20px] ${commonBg} border-2 ${commonBorder} ${commonShadow} group transition-all duration-300 hover:scale-[1.02] active:translate-y-[1px] active:shadow-none outline-none`}>
            <Zap size={15} className="text-[#1CB0F6]" />
            <span className="text-[14px] font-[700] text-[#1CB0F6] tracking-tight">{userStats.xp}</span>
          </button>

          <button onClick={() => setActiveModal('achievements')} className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] flex items-center justify-center rounded-[15px] md:rounded-[20px] ${commonBg} border-2 ${commonBorder} ${commonShadow} group transition-all duration-300 hover:scale-[1.02] active:translate-y-[1px] active:shadow-none outline-none`}>
            <Trophy size={17} className="text-[#FF9600]" />
          </button>

          <button onClick={() => setActiveModal('profile')} className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] flex items-center justify-center rounded-[15px] md:rounded-[20px] ${commonBg} border-2 ${commonBorder} ${commonShadow} group transition-all duration-300 hover:scale-[1.02] active:translate-y-[1px] active:shadow-none outline-none`}>
            <UserCircle size={22} className="text-[#1CB0F6]" />
          </button>
        </div>
      </div>

      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className={`${commonBg} border-2 ${commonBorder} text-[#0A0C0F] w-[90vw] sm:max-w-[400px] rounded-[32px] p-0 overflow-hidden shadow-2xl outline-none mx-auto`}>
          {activeModal === 'achievements' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-[22px] bg-[#FF9600]/10 border border-[#FF9600]/20 flex items-center justify-center mb-4">
                <Trophy size={32} className="text-[#FF9600]" />
              </div>
              <h2 className="text-xl font-bold mb-1">Conquistas</h2>
              <p className="text-sm text-[#6B7280] mb-6">Você desbloqueou {userStats.titles} títulos épicos.</p>
              <div className="grid grid-cols-2 gap-3 w-full">
                {['Mestre do Foco', 'Persistente', 'Explorador', 'Visionário'].map((title) => (
                  <div key={title} className={`p-4 rounded-2xl ${commonBg} border-2 ${commonBorder} flex flex-col items-center gap-2 group hover:border-[#FF9600]/40 transition-colors`}>
                    <Award size={20} className="text-[#FF9600]" />
                    <span className="text-[0.7rem] font-medium text-[#0A0C0F]">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModal === 'profile' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-[#1CB0F6]/10 flex items-center justify-center border-2 border-[#1CB0F6]/20 shadow-md">
                  <UserCircle size={48} className="text-[#1CB0F6]" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#1CB0F6] text-white text-[0.65rem] font-black px-2.5 py-1 rounded-full shadow-lg">
                  LVL {userStats.level}
                </div>
              </div>
              <h2 className="text-xl font-bold mb-1">{userStats.name}</h2>
              <p className="text-sm text-[#6B7280] mb-6">Membro da Comunidade</p>
              
              <div className={`w-full ${commonBg} rounded-2xl p-5 border-2 ${commonBorder}`}>
                <div className="flex justify-between text-[0.7rem] mb-2.5 text-[#6B7280] font-medium">
                  <span>Progresso de XP</span>
                  <span>{userStats.xp} / {userStats.nextLevelXp}</span>
                </div>
                <div className="w-full h-2.5 bg-[#E2E6ED] rounded-full overflow-hidden border border-[#D1D5DB]">
                  <div 
                    className="h-full bg-[#1CB0F6] transition-all duration-700"
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