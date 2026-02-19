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
    subtitle: 'Visão geral da sua produtividade',
    color: '#e8283a',
    icon: Home
  },
  '/tarefas': {
    title: 'Tarefas',
    subtitle: '0 pendentes hoje',
    color: '#38bdf8',
    icon: ClipboardList
  },
  '/metas': {
    title: 'Metas',
    subtitle: '0 de 0 concluídas',
    color: '#34d399',
    icon: Target
  },
  '/missoes': {
    title: 'Missões',
    subtitle: 'Complete e ganhe XP',
    color: '#f0b429',
    icon: Zap
  },
  '/lembretes': {
    title: 'Lembretes',
    subtitle: 'Gerencie seus alertas',
    color: '#ec4899',
    icon: Bell
  },
  '/comunidade': {
    title: 'Comunidade',
    subtitle: 'Conecte-se e evolua junto',
    color: '#a78bfa',
    icon: Users
  },
  '/loja': {
    title: 'Loja',
    subtitle: 'Troque seus XP por recompensas',
    color: '#fb923c',
    icon: ShoppingBag
  },
  '/configuracoes': {
    title: 'Configurações',
    subtitle: 'Personalize sua experiência',
    color: '#94a3b8',
    icon: Settings
  },
  '/masterplan': {
    title: 'Master Plan',
    subtitle: 'Para onde você está indo',
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
      className="sticky top-0 z-40 w-full flex items-center justify-between px-6 bg-transparent"
      style={{ height: '80px' }}
    >
      {/* Lado Esquerdo: Espaçador para manter o equilíbrio (ou Logo se desejar) */}
      <div className="flex-1 hidden md:flex" />

      {/* Centro: Identidade da Página (Centralizado) */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg"
          style={{
            backgroundColor: `${color}15`,
            border: `1px solid ${color}30`,
          }}
        >
          <Icon 
            size={18} 
            style={{ color: color }} 
            strokeWidth={2.5}
          />
        </div>

        <div className="flex flex-col items-start">
          <h1 className="font-bold text-[16px] leading-tight tracking-tight text-white/90">
            {title}
          </h1>
          <span className="font-medium text-[10px] text-white/40 leading-tight uppercase tracking-widest">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Lado Direito: Ações Globais */}
      <div className="flex-1 flex items-center justify-end gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-9 h-9 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
        >
          <Search size={18} />
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-9 h-9 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
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
          className="relative w-9 h-9 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
        >
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
        </Button>
        
        <div className="w-[1px] h-4 bg-white/10 mx-2" />

        <Dialog>
          <DialogTrigger asChild>
            <div 
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 font-bold text-[10px] cursor-pointer hover:border-white/20 hover:bg-white/10 transition-all"
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