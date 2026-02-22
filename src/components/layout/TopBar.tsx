"use client";

import { useLocation } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { 
  Home, ClipboardList, Target, Zap, Bell, Users, ShoppingBag, Settings, Eye, 
  Trophy, UserCircle, Coins, Flame
} from 'lucide-react';

const pageConfigs: Record<string, { title: string; color: string; icon: any }> = {
  '/': { title: 'Início', color: 'blue', icon: Home },
  '/habitos': { title: 'Hábitos', color: 'green', icon: ClipboardList },
  '/metas': { title: 'Metas', color: 'orange', icon: Target },
  '/missoes': { title: 'Missões', color: 'orange', icon: Zap },
  '/lembretes': { title: 'Lembretes', color: 'red', icon: Bell },
  '/comunidade': { title: 'Comunidade', color: 'purple', icon: Users },
  '/loja': { title: 'Loja', color: 'orange', icon: ShoppingBag },
  '/configuracoes': { title: 'Ajustes', color: 'blue', icon: Settings },
  '/masterplan': { title: 'Master Plan', color: 'purple', icon: Eye }
};

export const TopBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const config = pageConfigs[currentPath] || pageConfigs['/'];
  const { profile } = useProfile();

  return (
    <header className="sticky top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b-2 border-border px-8 h-20 flex items-center justify-between">
      {/* Page Pill */}
      <div className={cn(
        "flex items-center gap-3 px-6 py-2 rounded-full border-2 shadow-panel",
        `bg-panel border-duo-gray`
      )}>
        <config.icon size={20} className={`text-card-${config.color}`} strokeWidth={3} />
        <h1 className="text-sm font-black text-white uppercase tracking-widest">
          {config.title}
        </h1>
      </div>

      {/* Stats Group */}
      <div className="flex items-center gap-4">
        {/* Streak */}
        <div className="flex items-center gap-2 px-4 py-2 bg-panel rounded-2xl border-2 border-duo-gray shadow-panel">
          <Flame size={20} className="text-primary" fill="currentColor" />
          <span className="text-sm font-black text-primary">{profile?.streak_atual || 0}</span>
        </div>

        {/* XP / Coins */}
        <div className="flex items-center gap-2 px-4 py-2 bg-panel rounded-2xl border-2 border-duo-gray shadow-panel">
          <Coins size={20} className="text-card-orange" fill="currentColor" />
          <span className="text-sm font-black text-card-orange">{profile?.xp_total || 0}</span>
        </div>

        {/* Trophy */}
        <div className="w-12 h-12 flex items-center justify-center bg-panel rounded-2xl border-2 border-duo-gray shadow-panel hover:-translate-y-0.5 transition-all cursor-pointer">
          <Trophy size={20} className="text-card-purple" />
        </div>

        {/* Avatar */}
        <div className="w-12 h-12 flex items-center justify-center bg-panel rounded-2xl border-2 border-duo-gray shadow-panel hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden">
          <UserCircle size={28} className="text-card-blue" />
        </div>
      </div>
    </header>
  );
};

import { cn } from "@/lib/utils";