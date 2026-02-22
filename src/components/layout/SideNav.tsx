"use client";

import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Crown, 
  ClipboardList, 
  Target, 
  Bell, 
  Swords, 
  ShoppingBag, 
  Settings, 
  Brain 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, path: "/", label: "Início", color: "text-[#1cb0f6]", activeBg: "bg-[#1cb0f6]/20", border: "border-[#1cb0f6]" },
  { icon: Crown, path: "/masterplan", label: "Masterplan", color: "text-[#ce82ff]", activeBg: "bg-[#ce82ff]/20", border: "border-[#ce82ff]" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos", color: "text-[#58cc02]", activeBg: "bg-[#58cc02]/20", border: "border-[#58cc02]" },
  { icon: Target, path: "/metas", label: "Metas", color: "text-[#ff9600]", activeBg: "bg-[#ff9600]/20", border: "border-[#ff9600]" },
  { icon: Brain, path: "/brain", label: "Sistema", color: "text-[#22d3ee]", activeBg: "bg-[#22d3ee]/20", border: "border-[#22d3ee]", isSpecial: true },
  { icon: Bell, path: "/lembretes", label: "Lembretes", color: "text-[#ff4b4b]", activeBg: "bg-[#ff4b4b]/20", border: "border-[#ff4b4b]" },
  { icon: Swords, path: "/missoes", label: "Missões", color: "text-[#ff9600]", activeBg: "bg-[#ff9600]/20", border: "border-[#ff9600]" },
  { icon: ShoppingBag, path: "/loja", label: "Loja", color: "text-[#22d3ee]", activeBg: "bg-[#22d3ee]/20", border: "border-[#22d3ee]" },
  { icon: Settings, path: "/configuracoes", label: "Configurações", color: "text-[#9ca3af]", activeBg: "bg-[#9ca3af]/20", border: "border-[#9ca3af]" },
];

export const SideNav = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-[80px] bg-[#131f24] border-r-2 border-[#37464f] z-[100] hidden md:flex flex-col items-center py-6">
      <nav className="flex flex-col items-center gap-4 w-full">
        {navItems.map(({ icon: Icon, path, label, color, activeBg, border, isSpecial }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "group relative flex items-center justify-center rounded-xl transition-all duration-200",
              "w-[52px] h-[52px]",
              "border-2 border-transparent", // Default border
              isActive 
                ? cn("bg-[#202f36] shadow-3d-panel translate-y-[-2px]", border) 
                : "hover:bg-[#202f36] hover:translate-y-[-2px]",
              isSpecial && !isActive && "opacity-80 hover:opacity-100"
            )}
          >
            <Icon 
              size={isSpecial ? 28 : 24} 
              strokeWidth={2.5}
              className={cn(
                "transition-colors",
                color
              )}
            />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
</dyad-file>

<dyad-write path="src/components/layout/TopBar.tsx" description="Redesigning TopBar with pills and 3D panels">
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
  '/habitos': { title: 'Hábitos', subtitle: 'Rotina', color: '#58cc02', icon: ClipboardList },
  '/tarefas': { title: 'Hábitos', subtitle: 'Rotina', color: '#58cc02', icon: ClipboardList },
  '/metas': { title: 'Metas', subtitle: 'Objetivos', color: '#ff9600', icon: Target },
  '/missoes': { title: 'Missões', subtitle: 'Desafios', color: '#ce82ff', icon: Zap },
  '/lembretes': { title: 'Lembretes', subtitle: 'Alertas', color: '#ff4b4b', icon: Bell },
  '/comunidade': { title: 'Comunidade', subtitle: 'Social', color: '#a78bfa', icon: Users },
  '/loja': { title: 'Loja', subtitle: 'Recompensas', color: '#22d3ee', icon: ShoppingBag },
  '/configuracoes': { title: 'Ajustes', subtitle: 'Opções', color: '#9ca3af', icon: Settings },
  '/masterplan': { title: 'Master Plan', subtitle: 'Estratégia', color: '#ce82ff', icon: Eye }
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

  const panelStyle = "bg-[#202f36] border-2 border-[#37464f] shadow-3d-panel rounded-2xl";

  return (
    <header className="sticky top-0 w-full flex justify-center z-50 pt-4 pb-4 pointer-events-none px-4">
      <div className="flex items-center justify-between w-full max-w-5xl pointer-events-auto">
        
        {/* LADO ESQUERDO: Page Pill */}
        <div 
          className={`hidden sm:flex items-center gap-3 px-6 py-3 ${panelStyle} transition-all duration-300`}
        >
          <Icon 
            size={24} 
            style={{ color: color }}
            strokeWidth={3}
          />
          <div className="flex flex-col">
            <h1 className="text-[14px] font-[800] text-white uppercase tracking-wider leading-none mb-0.5">
              {title}
            </h1>
            <span className="text-[11px] font-[700] text-[#9ca3af] uppercase tracking-wide leading-none">
              {subtitle}
            </span>
          </div>
        </div>

        {/* GRUPO DE STATS */}
        <div className="flex items-center gap-3 flex-shrink-0">
          
          {/* Moedas */}
          <button className={`h-[48px] px-4 flex items-center gap-3 ${panelStyle} group active-3d outline-none`}>
            <Coins size={20} className="text-[#ff9600]" strokeWidth={2.5} />
            <span className="text-[15px] font-[800] text-[#ff9600]">{userStats.coins}</span>
          </button>

          {/* XP */}
          <button onClick={() => setActiveModal('profile')} className={`h-[48px] px-4 flex items-center gap-3 ${panelStyle} group active-3d outline-none`}>
            <Zap size={20} className="text-[#22d3ee]" strokeWidth={2.5} />
            <span className="text-[15px] font-[800] text-[#22d3ee]">{userStats.xp}</span>
          </button>

          {/* Troféu */}
          <button onClick={() => setActiveModal('achievements')} className={`w-[48px] h-[48px] flex items-center justify-center ${panelStyle} group active-3d outline-none`}>
            <Trophy size={20} className="text-[#ce82ff]" strokeWidth={2.5} />
          </button>

          {/* Avatar */}
          <button onClick={() => setActiveModal('profile')} className={`w-[48px] h-[48px] flex items-center justify-center ${panelStyle} group active-3d outline-none overflow-hidden p-0.5`}>
            <div className="w-full h-full rounded-xl bg-[#37464f] flex items-center justify-center">
                <UserCircle size={28} className="text-[#e5e7eb]" />
            </div>
          </button>
        </div>
      </div>

      {/* MODALS - Keeping structure, updating style */}
      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#202f36] border-2 border-[#37464f] shadow-3d-panel text-[#e5e7eb] w-[90vw] sm:max-w-[400px] rounded-[32px] p-0 overflow-hidden outline-none mx-auto">
          {activeModal === 'achievements' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-[#ce82ff] border-b-4 border-[#a855f7] flex items-center justify-center mb-4 shadow-xl">
                <Trophy size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-extrabold mb-1 uppercase tracking-wide">Conquistas</h2>
              <p className="text-sm text-[#9ca3af] font-bold mb-6">Você desbloqueou {userStats.titles} títulos épicos.</p>
              <div className="grid grid-cols-2 gap-3 w-full">
                {['Mestre do Foco', 'Persistente', 'Explorador', 'Visionário'].map((title) => (
                  <div key={title} className="p-4 rounded-2xl bg-[#131f24] border-2 border-[#37464f] flex flex-col items-center gap-2 group">
                    <Award size={24} className="text-[#ce82ff]" />
                    <span className="text-[0.8rem] font-bold text-[#e5e7eb] uppercase">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModal === 'profile' && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-3xl bg-[#22d3ee] border-b-4 border-[#06b6d4] flex items-center justify-center shadow-xl">
                  <UserCircle size={56} className="text-[#083344]" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#ff9600] text-white text-xs font-extrabold px-3 py-1 rounded-full border-2 border-[#202f36]">
                  LVL {userStats.level}
                </div>
              </div>
              <h2 className="text-2xl font-extrabold mb-1 text-white">{userStats.name}</h2>
              <p className="text-sm text-[#9ca3af] font-bold uppercase mb-6">Membro da Comunidade</p>
              
              <div className="w-full bg-[#131f24] rounded-2xl p-5 border-2 border-[#37464f]">
                <div className="flex justify-between text-xs mb-2 text-[#9ca3af] font-extrabold uppercase">
                  <span>Progresso de XP</span>
                  <span>{userStats.xp} / {userStats.nextLevelXp}</span>
                </div>
                <div className="w-full h-4 bg-[#37464f] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#22d3ee] transition-all duration-700 rounded-full"
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