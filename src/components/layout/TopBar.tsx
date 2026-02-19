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
    subtitle: 'Visão total do seu progresso',
    color: '#e8283a',
    icon: Home
  },
  '/tarefas': {
    title: 'Tarefas',
    subtitle: 'Gerenciamento do seu dia',
    color: '#38bdf8',
    icon: ClipboardList
  },
  '/metas': {
    title: 'Metas',
    subtitle: 'Foco nos grandes objetivos',
    color: '#34d399',
    icon: Target
  },
  '/missoes': {
    title: 'Missões',
    subtitle: 'Desafios e conquistas épicas',
    color: '#f0b429',
    icon: Zap
  },
  '/lembretes': {
    title: 'Lembretes',
    subtitle: 'Alertas e compromissos',
    color: '#ec4899',
    icon: Bell
  },
  '/comunidade': {
    title: 'Comunidade',
    subtitle: 'Conexão e troca de ideias',
    color: '#a78bfa',
    icon: Users
  },
  '/loja': {
    title: 'Loja',
    subtitle: 'Resgate suas recompensas',
    color: '#fb923c',
    icon: ShoppingBag
  },
  '/configuracoes': {
    title: 'Ajustes',
    subtitle: 'Personalize sua experiência',
    color: '#94a3b8',
    icon: Settings
  },
  '/masterplan': {
    title: 'Master Plan',
    subtitle: 'Sua visão estratégica futura',
    color: '#a855f7',
    icon: Eye
  }
};

export const TopBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const config = pageConfigs[currentPath] || pageConfigs['/'];
  const { title, subtitle, color, icon: Icon } = config;

  return (
    <header className="sticky top-0 w-full flex justify-center z-50 pt-10 pb-5 pointer-events-none">
      <div 
        className="flex items-center gap-[14px] px-6 py-3 rounded-full bg-gradient-to-r from-[#121212] to-[#2a2a2a] border border-[#303030] shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-all duration-300 pointer-events-auto"
      >
        {/* 1. Glowing Icon */}
        <div className="flex items-center justify-center">
          <Icon 
            size={18} 
            style={{ 
              color: color,
              filter: `drop-shadow(0 0 5px ${color}88)`
            }}
            className="transition-all duration-500"
          />
        </div>

        {/* 2. Page title */}
        <h1 className="text-[0.9rem] font-bold text-[#f0f0f0] tracking-tight leading-none">
          {title}
        </h1>

        {/* 3. Vertical separator */}
        <div className="w-px h-[16px] bg-[#303030]" />

        {/* 4. Page subtitle */}
        <span className="text-[0.68rem] text-[#888] font-medium tracking-wide leading-none">
          {subtitle}
        </span>
      </div>
    </header>
  );
};