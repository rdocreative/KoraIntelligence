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
  Play,
  Calendar,
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
import { TitlesPopover } from '../features/titles/TitlesPopover';
import { cn } from '@/lib/utils';

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
    color: '#6b6b7a',
    icon: Settings
  },
  '/masterplan': {
    title: 'Master Plan', // Default para a rota
    subtitle: 'Para onde você está indo',
    color: '#f0b429', // Cor da Visão (Default)
    icon: Eye
  }
};

export const TopBar = () => {
  const location = useLocation();
  
  // Determina a configuração atual baseada na rota
  // Se não encontrar exata, tenta encontrar uma parcial ou usa default
  const currentPath = location.pathname;
  const config = pageConfigs[currentPath] || pageConfigs['/'];
  const { title, subtitle, color, icon: Icon } = config;

  // Conversão de hex para rgba para as bordas/bg
  // Nota: Tailwind não suporta hex com alpha arbitrário nativamente sem plugin ou config, 
  // então usaremos style inline para precisão exigida no prompt.
  
  return (
    <header 
      className="sticky top-0 z-40 w-full flex items-center justify-between px-6 transition-all duration-300"
      style={{
        height: '58px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #2a2a35',
        backgroundColor: 'rgba(6, 6, 6, 0.8)'
      }}
    >
      {/* Linha de Gradiente Superior */}
      <div 
        className="absolute top-0 left-0 w-full h-[1px]"
        style={{
          background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
          opacity: 0.5
        }}
      />

      {/* Lado Esquerdo: Identidade da Página */}
      <div className="flex items-center gap-3">
        {/* Ícone da Página */}
        <div 
          className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-all duration-500"
          style={{
            backgroundColor: `${color}1F`, // ~12% opacity
            borderColor: `${color}47`, // ~28% opacity
            borderWidth: '1px',
            borderStyle: 'solid',
            boxShadow: `0 0 15px ${color}26` // ~15% opacity
          }}
        >
          <Icon 
            size={18} 
            style={{ color: color }} 
            strokeWidth={2}
          />
        </div>

        {/* Textos */}
        <div className="flex flex-col justify-center h-full pt-0.5">
          <h1 
            className="font-rajdhani font-bold text-[17px] leading-none tracking-wide"
            style={{ color: color }}
          >
            {title}
          </h1>
          <span className="font-exo2 font-normal text-[10px] text-[#6b6b7a] leading-tight mt-0.5">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Lado Direito: Ações Globais */}
      <div className="flex items-center gap-1 md:gap-2">
        
        {/* Busca (Agora apenas ícone) */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-9 h-9 text-[#6b6b7a] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
          <Search size={18} />
        </Button>

        {/* Títulos (Trophy) */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-9 h-9 text-[#6b6b7a] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
                <Trophy size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-fit">
            <AchievementsPopover />
          </DialogContent>
        </Dialog>

        {/* Notificações (Bell) */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative w-9 h-9 text-[#6b6b7a] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse"></span>
        </Button>
        
        {/* Divisor Vertical */}
        <div className="w-[1px] h-4 bg-[#2a2a35] mx-2" />

        {/* Avatar / Perfil */}
        <Dialog>
          <DialogTrigger asChild>
            <div 
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1a1a1a] to-[#2a2a2a] border border-[#2a2a35] flex items-center justify-center text-white font-bold text-[9px] cursor-pointer hover:border-red-500/50 hover:scale-105 transition-all shadow-lg"
              title="Meu Perfil"
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