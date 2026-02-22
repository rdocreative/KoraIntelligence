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
  Coins,
  Flame
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PageConfig {
  title: string;
  subtitle: string;
  colorClass: string;
  shadowClass: string;
  icon: LucideIcon;
}

const pageConfigs: Record<string, PageConfig> = {
  '/': { title: 'Início', subtitle: 'Visão total', colorClass: 'text-card-blue', shadowClass: 'shadow-3d-blue', icon: Home },
  '/habitos': { title: 'Hábitos', subtitle: 'Rotina diária', colorClass: 'text-card-orange', shadowClass: 'shadow-3d-orange', icon: ClipboardList },
  '/tarefas': { title: 'Hábitos', subtitle: 'Rotina diária', colorClass: 'text-card-orange', shadowClass: 'shadow-3d-orange', icon: ClipboardList },
  '/metas': { title: 'Metas', subtitle: 'Objetivos', colorClass: 'text-card-green', shadowClass: 'shadow-3d-green', icon: Target },
  '/missoes': { title: 'Missões', subtitle: 'Desafios', colorClass: 'text-card-purple', shadowClass: 'shadow-3d-purple', icon: Zap },
  '/lembretes': { title: 'Lembretes', subtitle: 'Alertas', colorClass: 'text-card-red', shadowClass: 'shadow-3d-red', icon: Bell },
  '/comunidade': { title: 'Comunidade', subtitle: 'Social', colorClass: 'text-card-blue', shadowClass: 'shadow-3d-blue', icon: Users },
  '/loja': { title: 'Loja', subtitle: 'Recompensas', colorClass: 'text-card-orange', shadowClass: 'shadow-3d-orange', icon: ShoppingBag },
  '/configuracoes': { title: 'Ajustes', subtitle: 'Opções', colorClass: 'text-duo-gray', shadowClass: 'shadow-3d-panel', icon: Settings },
  '/masterplan': { title: 'Master Plan', subtitle: 'Estratégia', colorClass: 'text-card-purple', shadowClass: 'shadow-3d-purple', icon: Eye }
};

export const TopBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const config = pageConfigs[currentPath] || pageConfigs['/'];
  const { title, subtitle, colorClass, shadowClass, icon: Icon } = config;
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
    <header className="sticky top-0 w-full flex justify-center z-40 pt-4 pointer-events-none mb-6">
      <div className="flex items-center justify-between w-full max-w-[1280px] pointer-events-auto px-4 md:px-8">
        
        {/* Page Title Pill */}
        <div className="hidden sm:flex items-center bg-duo-panel border-2 border-duo-gray rounded-2xl px-5 py-3 shadow-3d-panel">
          <Icon size={24} className={cn("mr-3", colorClass)} strokeWidth={2.5} />
          <div>
            <h1 className={cn("text-lg font-extrabold uppercase tracking-wide leading-none", colorClass)}>
              {title}
            </h1>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Stats Group */}
        <div className="flex items-center gap-3 ml-auto">
          {/* XP / Coins */}
          <button className="h-12 px-4 flex items-center gap-2 rounded-2xl bg-duo-panel border-2 border-duo-gray shadow-3d-panel hover:-translate-y-0.5 active:translate-y-[1px] active:shadow-none transition-all">
            <Coins size={20} className="text-card-orange fill-card-orange" />
            <span className="text-base font-extrabold text-card-orange">{userStats.coins}</span>
          </button>

          {/* Streak */}
          <button className="h-12 px-4 flex items-center gap-2 rounded-2xl bg-duo-panel border-2 border-duo-gray shadow-3d-panel hover:-translate-y-0.5 active:translate-y-[1px] active:shadow-none transition-all">
            <Flame size={20} className="text-duo-primary fill-duo-primary" />
            <span className="text-base font-extrabold text-duo-primary">3</span>
          </button>

          {/* Avatar / Profile */}
          <button 
            onClick={() => setActiveModal('profile')} 
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-duo-panel border-2 border-duo-gray shadow-3d-panel hover:-translate-y-0.5 active:translate-y-[1px] active:shadow-none transition-all"
          >
            <UserCircle size={28} className="text-white" />
          </button>
        </div>
      </div>

      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-duo-panel border-2 border-duo-gray text-white w-[90vw] sm:max-w-[400px] rounded-3xl p-6 shadow-3d-panel">
          {activeModal === 'profile' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-duo-gray flex items-center justify-center border-4 border-duo-sidebar shadow-3d-panel mb-4">
                <UserCircle size={64} className="text-duo-primary" />
              </div>
              <h2 className="text-2xl font-extrabold uppercase">{userStats.name}</h2>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Nível {userStats.level}</p>
              
              <div className="w-full bg-duo-sidebar rounded-full h-4 border-2 border-duo-gray mb-2">
                <div 
                  className="h-full bg-duo-primary rounded-full"
                  style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                />
              </div>
              <div className="flex justify-between w-full text-xs font-bold text-gray-500 uppercase">
                <span>0 XP</span>
                <span>{userStats.xp} / {userStats.nextLevelXp} XP</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
};