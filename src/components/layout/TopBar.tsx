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
  '/': { title: 'Início', subtitle: 'Visão Geral', color: '#1cb0f6', icon: Home },
  '/habitos': { title: 'Hábitos', subtitle: 'Rotina Diária', color: '#ff9600', icon: ClipboardList },
  '/tarefas': { title: 'Tarefas', subtitle: 'Lista de Ações', color: '#ff9600', icon: ClipboardList },
  '/metas': { title: 'Metas', subtitle: 'Objetivos', color: '#58cc02', icon: Target },
  '/missoes': { title: 'Missões', subtitle: 'Desafios', color: '#ce82ff', icon: Zap },
  '/lembretes': { title: 'Lembretes', subtitle: 'Agenda', color: '#ff4b4b', icon: Bell },
  '/comunidade': { title: 'Comunidade', subtitle: 'Social', color: '#a78bfa', icon: Users },
  '/loja': { title: 'Loja', subtitle: 'Recompensas', color: '#fb923c', icon: ShoppingBag },
  '/configuracoes': { title: 'Ajustes', subtitle: 'Sistema', color: '#9ca3af', icon: Settings },
  '/masterplan': { title: 'Master Plan', subtitle: 'Estratégia', color: '#a855f7', icon: Eye }
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

  return (
    <header className="sticky top-0 w-full flex justify-center z-50 pt-4 pb-4 pointer-events-none bg-[#111b21]">
      <div className="flex items-center justify-between w-full max-w-[1280px] pointer-events-auto px-6">
        
        {/* LADO ESQUERDO: Título da Página */}
        <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-panel border-2 border-[#37464f] shadow-3d-panel">
                <Icon size={24} style={{ color: color }} strokeWidth={3} />
            </div>
            <div className="flex flex-col">
                <h1 className="text-[20px] font-[800] text-[#e5e7eb] tracking-wide uppercase leading-none">
                    {title}
                </h1>
                <span className="text-[12px] font-[600] text-[#9ca3af] tracking-wide uppercase mt-1">
                    {subtitle}
                </span>
            </div>
        </div>

        {/* GRUPO DE STATS (DIREITA) */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          
          {/* Coins */}
          <button className="h-[48px] px-4 flex items-center gap-2 rounded-2xl bg-panel border-2 border-[#37464f] shadow-3d-panel hover:translate-y-[2px] hover:shadow-none transition-all active:translate-y-[4px]">
            <Coins size={20} className="text-[#ff9600] fill-[#ff9600]" />
            <span className="text-[16px] font-[800] text-[#ff9600] tracking-wide">{userStats.coins}</span>
          </button>

          {/* XP */}
          <button onClick={() => setActiveModal('profile')} className="h-[48px] px-4 flex items-center gap-2 rounded-2xl bg-panel border-2 border-[#37464f] shadow-3d-panel hover:translate-y-[2px] hover:shadow-none transition-all active:translate-y-[4px]">
            <Zap size={20} className="text-[#ce82ff] fill-[#ce82ff]" />
            <span className="text-[16px] font-[800] text-[#ce82ff] tracking-wide">{userStats.xp}</span>
          </button>

          {/* Avatar / Profile */}
          <button onClick={() => setActiveModal('profile')} className="h-[48px] w-[48px] flex items-center justify-center rounded-2xl bg-panel border-2 border-[#37464f] shadow-3d-panel hover:translate-y-[2px] hover:shadow-none transition-all active:translate-y-[4px]">
            <UserCircle size={28} className="text-[#22d3ee]" />
          </button>
        </div>
      </div>

      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-panel border-2 border-[#37464f] text-[#e5e7eb] w-[90vw] sm:max-w-[400px] rounded-[32px] p-0 overflow-hidden shadow-2xl outline-none mx-auto">
          {activeModal === 'achievements' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#37464f] border-2 border-[#ce82ff] flex items-center justify-center mb-4">
                <Trophy size={32} className="text-[#ce82ff]" />
              </div>
              <h2 className="text-xl font-[800] uppercase tracking-wide mb-1">Conquistas</h2>
              <p className="text-sm text-[#9ca3af] mb-6 font-semibold">Você desbloqueou {userStats.titles} títulos épicos.</p>
            </div>
          )}

          {activeModal === 'profile' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-[#131f24] flex items-center justify-center border-4 border-[#22d3ee]">
                  <UserCircle size={56} className="text-[#22d3ee]" />
                </div>
                <div className="absolute -bottom-2 right-0 bg-[#22d3ee] border-2 border-[#131f24] text-[#131f24] text-[12px] font-[800] px-3 py-1 rounded-full uppercase">
                  LVL {userStats.level}
                </div>
              </div>
              <h2 className="text-2xl font-[800] text-white uppercase tracking-wide mb-1">{userStats.name}</h2>
              <p className="text-sm text-[#9ca3af] mb-6 font-bold uppercase tracking-wider">Membro da Comunidade</p>
              
              <div className="w-full bg-[#131f24] rounded-2xl p-5 border-2 border-[#37464f]">
                <div className="flex justify-between text-[11px] mb-2.5 text-[#9ca3af] font-[800] uppercase tracking-widest">
                  <span>Progresso de XP</span>
                  <span>{userStats.xp} / {userStats.nextLevelXp}</span>
                </div>
                <div className="w-full h-4 bg-[#202f36] rounded-full overflow-hidden border-2 border-[#37464f]">
                  <div 
                    className="h-full bg-[#ce82ff]"
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