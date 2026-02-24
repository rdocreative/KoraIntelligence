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
  '/tarefas': { title: 'Hábitos', subtitle: 'Seus hábitos de hoje', color: '#1CB0F6', icon: ClipboardList },
  '/metas': { title: 'Metas', subtitle: 'Foco nos grandes objetivos', color: '#1CB0F6', icon: Target },
  '/missoes': { title: 'Missões', subtitle: 'Desafios e conquistas épicas', color: '#1CB0F6', icon: Zap },
  '/lembretes': { title: 'Lembretes', subtitle: 'Alertas e compromissos', color: '#1CB0F6', icon: Bell },
  '/comunidade': { title: 'Comunidade', subtitle: 'Conexão e troca de ideias', color: '#1CB0F6', icon: Users },
  '/loja': { title: 'Loja', subtitle: 'Resgate suas recompensas', color: '#1CB0F6', icon: ShoppingBag },
  '/configuracoes': { title: 'Ajustes', subtitle: 'Personalize sua experiênia', color: '#1CB0F6', icon: Settings },
  '/masterplan': { title: 'Master Plan', subtitle: 'Sua visão estratégica futura', color: '#1CB0F6', icon: Eye }
};

export const TopBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const config = pageConfigs[currentPath] || pageConfigs['/'];
  const { title, subtitle, icon: Icon } = config;
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

  const commonBg = "bg-[#161A20]";
  const commonBorder = "border-[#2A3040]";

  return (
    <header className="sticky top-0 w-full flex justify-center z-50 pointer-events-none bg-[#0D0F13] border-b border-[#252B38]">
      <div className="flex items-center justify-between w-full max-w-[100rem] pointer-events-auto py-4 px-5">
        
        {/* LADO ESQUERDO: Main Page Capsule */}
        <div className={`hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full ${commonBg} border ${commonBorder} shadow-lg transition-all duration-300`}>
          <div className="flex items-center gap-2.5">
            <Icon size={18} className="text-[#1CB0F6]" />
            <h1 className="text-[14px] font-[800] text-[#F0F2F5] tracking-tight leading-none uppercase">
              {title}
            </h1>
          </div>
          <div className="w-px h-[14px] bg-[#252B38] mx-1" />
          <span className="text-[12px] font-[500] text-[#8892AA] tracking-wide leading-none">
            {subtitle}
          </span>
        </div>

        {/* GRUPO DE STATS */}
        <div className="flex items-center gap-3">
          <button className={`h-[42px] px-4 flex items-center gap-2.5 rounded-2xl ${commonBg} border ${commonBorder} transition-all hover:bg-[#1E2330]`}>
            <Coins size={16} className="text-[#1CB0F6]" />
            <span className="text-[14px] font-[700] text-[#F0F2F5]">{userStats.coins}</span>
          </button>

          <button onClick={() => setActiveModal('profile')} className={`h-[42px] px-4 flex items-center gap-2.5 rounded-2xl ${commonBg} border ${commonBorder} transition-all hover:bg-[#1E2330]`}>
            <Zap size={16} className="text-[#1CB0F6]" />
            <span className="text-[14px] font-[700] text-[#F0F2F5]">{userStats.xp}</span>
          </button>

          <button onClick={() => setActiveModal('achievements')} className={`w-[42px] h-[42px] flex items-center justify-center rounded-2xl ${commonBg} border ${commonBorder} transition-all hover:bg-[#1E2330]`}>
            <Trophy size={18} className="text-[#1CB0F6]" />
          </button>

          <button onClick={() => setActiveModal('profile')} className={`w-[42px] h-[42px] flex items-center justify-center rounded-2xl ${commonBg} border ${commonBorder} transition-all hover:bg-[#1E2330]`}>
            <UserCircle size={24} className="text-[#1CB0F6]" />
          </button>
        </div>
      </div>

      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#161A20] border border-[#2A3040] text-[#F0F2F5] sm:max-w-[400px] rounded-[24px] p-0 overflow-hidden shadow-2xl">
          {activeModal === 'achievements' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1CB0F614] border border-[#1CB0F633] flex items-center justify-center mb-4">
                <Trophy size={32} className="text-[#1CB0F6]" />
              </div>
              <h2 className="text-xl font-bold mb-1">Conquistas</h2>
              <p className="text-sm text-[#8892AA] mb-6">Você desbloqueou {userStats.titles} títulos épicos.</p>
              <div className="grid grid-cols-2 gap-3 w-full">
                {['Mestre do Foco', 'Persistente', 'Explorador', 'Visionário'].map((title) => (
                  <div key={title} className={`p-4 rounded-2xl bg-[#1C2028] border border-[#2A3040] flex flex-col items-center gap-2 group hover:bg-[#1E2330] transition-colors`}>
                    <Award size={20} className="text-[#1CB0F6]" />
                    <span className="text-[0.7rem] font-bold text-[#8892AA] uppercase">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModal === 'profile' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-[#1CB0F614] flex items-center justify-center border border-[#1CB0F633]">
                  <UserCircle size={48} className="text-[#1CB0F6]" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#1CB0F6] text-[#0A0C0F] text-[0.65rem] font-black px-2.5 py-1 rounded-full shadow-lg">
                  LVL {userStats.level}
                </div>
              </div>
              <h2 className="text-xl font-bold mb-1">{userStats.name}</h2>
              <p className="text-sm text-[#8892AA] mb-6">Membro da Comunidade</p>
              
              <div className={`w-full bg-[#1C2028] rounded-2xl p-5 border border-[#2A3040]`}>
                <div className="flex justify-between text-[0.7rem] mb-2.5 text-[#8892AA] font-bold uppercase">
                  <span>Progresso de XP</span>
                  <span>{userStats.xp} / {userStats.nextLevelXp}</span>
                </div>
                <div className="w-full h-2.5 bg-[#0A0C0F] rounded-full overflow-hidden border border-[#252B38]">
                  <div 
                    className="h-full bg-[#1CB0F6] transition-all duration-700 shadow-[0_0_10px_rgba(28,176,246,0.4)]"
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