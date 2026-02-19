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
    title: 'Master Plan', // Default para a rota
    subtitle: 'Para onde você está indo',
    color: '#a855f7', // Cor da Visão
    icon: Eye
  }
};

export const TopBar = () => {
  const location = useLocation();
  
  // Determina a configuração atual baseada na rota
  const currentPath = location.pathname;
  // Fallback melhorado para subrotas se necessário
  const config = pageConfigs[currentPath] || pageConfigs['/'];
  const { title, subtitle, color, icon: Icon } = config;

  return (
    <header 
      className="sticky top-0 z-40 w-full flex items-center justify-between px-6 transition-all duration-300"
      style={{
        height: '64px',
        backgroundColor: 'rgba(10, 10, 12, 0.8)', // #0a0a0c com transparência
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #222230',
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
      <div className="flex items-center gap-4">
        {/* Ícone da Página */}
        <div 
          className="w-10 h-10 rounded-[10px] flex items-center justify-center transition-all duration-500"
          style={{
            backgroundColor: `${color}1A`, // ~10% opacity
            borderColor: `${color}40`, // ~25% opacity
            borderWidth: '1px',
            borderStyle: 'solid',
          }}
        >
          <Icon 
            size={20} 
            style={{ color: color }} 
            strokeWidth={2}
          />
        </div>

        {/* Textos */}
        <div className="flex flex-col justify-center h-full">
          <h1 
            className="font-bold text-[18px] leading-none tracking-tight text-white"
          >
            {title}
          </h1>
          <span className="font-normal text-[11px] text-[#6b6b7a] leading-tight mt-1">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Lado Direito: Ações Globais */}
      <div className="flex items-center gap-2">
        
        {/* Busca */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-9 h-9 text-[#6b6b7a] hover:text-white hover:bg-white/[0.03] rounded-xl transition-colors"
        >
          <Search size={18} />
        </Button>

        {/* Títulos */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-9 h-9 text-[#6b6b7a] hover:text-white hover:bg-white/[0.03] rounded-xl transition-colors"
            >
                <Trophy size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-fit">
            <AchievementsPopover />
          </DialogContent>
        </Dialog>

        {/* Notificações */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative w-9 h-9 text-[#6b6b7a] hover:text-white hover:bg-white/[0.03] rounded-xl transition-colors"
        >
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse"></span>
        </Button>
        
        {/* Divisor */}
        <div className="w-[1px] h-5 bg-[#222230] mx-2" />

        {/* Avatar */}
        <Dialog>
          <DialogTrigger asChild>
            <div 
              className="w-9 h-9 rounded-full bg-transparent border border-[#222230] flex items-center justify-center text-white font-bold text-[10px] cursor-pointer hover:border-white/20 hover:bg-white/[0.03] transition-all"
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