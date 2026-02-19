"use client";

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
  LucideIcon
} from 'lucide-react';

// Configuração das páginas para cores e textos
interface PageConfig {
  title: string;
  subtitle: string;
  color: string;
  icon: LucideIcon;
}

const pageConfigs: Record<string, PageConfig> = {
  '/': {
    title: 'Início',
    subtitle: 'Dashboard',
    color: '#e8283a',
    icon: Home
  },
  '/tarefas': {
    title: 'Tarefas',
    subtitle: 'Gerenciamento',
    color: '#38bdf8',
    icon: ClipboardList
  },
  '/metas': {
    title: 'Metas',
    subtitle: 'Objetivos',
    color: '#34d399',
    icon: Target
  },
  '/missoes': {
    title: 'Missões',
    subtitle: 'Conquistas',
    color: '#f0b429',
    icon: Zap
  },
  '/lembretes': {
    title: 'Lembretes',
    subtitle: 'Alertas',
    color: '#ec4899',
    icon: Bell
  },
  '/comunidade': {
    title: 'Comunidade',
    subtitle: 'Social',
    color: '#a78bfa',
    icon: Users
  },
  '/loja': {
    title: 'Loja',
    subtitle: 'Recompensas',
    color: '#fb923c',
    icon: ShoppingBag
  },
  '/configuracoes': {
    title: 'Ajustes',
    subtitle: 'Preferências',
    color: '#94a3b8',
    icon: Settings
  },
  '/masterplan': {
    title: 'Master Plan',
    subtitle: 'Visão Futura',
    color: '#a855f7',
    icon: Eye
  }
};

export const TopBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const config = pageConfigs[currentPath] || pageConfigs['/'];
  const { title, subtitle, color } = config;

  return (
    <header className="sticky top-0 w-full flex justify-center z-50 py-6 bg-[#0a0a0c]/95 backdrop-blur-xl border-b border-white/[0.02]">
      <div 
        className="flex items-center gap-[12px] px-6 py-3 rounded-full bg-[#1c1c1c] border border-[#303030] shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-all duration-300"
      >
        {/* 1. Status dot */}
        <div 
          className="w-[8px] h-[8px] rounded-full transition-all duration-500"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}cc`
          }}
        />

        {/* 2. Page title */}
        <h1 className="text-[0.9rem] font-bold text-[#f0f0f0] tracking-tight leading-none">
          {title}
        </h1>

        {/* 3. Vertical separator */}
        <div className="w-px h-[16px] bg-[#303030]" />

        {/* 4. Page subtitle */}
        <span className="text-[0.68rem] text-[#777] font-semibold uppercase tracking-[0.05em] leading-none">
          {subtitle}
        </span>
      </div>
    </header>
  );
};