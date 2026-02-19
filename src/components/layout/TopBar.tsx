import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Trophy, 
  Bell, 
  Home,
  ClipboardList,
  Target,
  Zap,
  Users,
  ShoppingBag,
  Settings,
  Eye,
  LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProfilePopover } from '../features/profile/ProfilePopover';
import { AchievementsPopover } from '../features/achievements/AchievementsPopover';

// Configuração das páginas
interface PageConfig {
  title: string;
  subtitle: string;
  color: string;
  icon: LucideIcon;
}

const pageConfigs: Record<string, PageConfig> = {
  '/': {
    title: 'Início',
    subtitle: 'Visão geral',
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
  const { title, subtitle, color, icon: Icon } = config;

  return (
    <header 
      className="sticky top-0 z-40 w-full h-28 px-6 flex items-center justify-between pointer-events-none"
    >
      {/* Lado Esquerdo: Espaçador */}
      <div className="flex-1 hidden md:flex" />

      {/* Centro: Ilha Flutuante */}
      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto z-50">
        <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-gradient-to-b from-[#1f1f23] to-[#0a0a0c] border border-white/10 shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
          
          <Icon 
            size={22} 
            style={{ color: color }} 
            strokeWidth={2.5}
            className="drop-shadow-md"
          />

          <div className="flex flex-col items-start gap-0.5">
            <h1 className="font-bold text-base text-white/90 leading-none tracking-tight">
              {title}
            </h1>
            <span className="font-medium text-[11px] text-white/50 leading-none uppercase tracking-wider">
              {subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Lado Direito: Ações Globais */}
      <div className="flex-1 flex items-center justify-end gap-2 pointer-events-auto">
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#0a0a0c]/40 backdrop-blur-md border border-white/5 shadow-lg">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-9 h-9 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <Search size={18} />
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                  <Trophy size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-fit">
              <AchievementsPopover />
            </DialogContent>
          </Dialog>

          <Button 
            variant="ghost" 
            size="icon" 
            className="relative w-9 h-9 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
          </Button>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <div 
              className="w-11 h-11 ml-2 rounded-full bg-gradient-to-b from-[#1f1f23] to-[#0a0a0c] border border-white/10 flex items-center justify-center text-white/80 font-bold text-xs cursor-pointer hover:border-white/20 transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              ME
            </div>
          </DialogTrigger>
          <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-fit">
            <ProfilePopover />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};