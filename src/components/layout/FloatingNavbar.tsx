import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  ClipboardList,
  Target, 
  Swords,
  Users,
  ShoppingBag, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'INÍCIO', path: '/' },
  { icon: CheckCircle2, label: 'HÁBITOS', path: '/habitos' },
  { icon: ClipboardList, label: 'TAREFAS', path: '/tarefas' },
  { icon: Target, label: 'METAS', path: '/metas' },
  { icon: Swords, label: 'MISSÕES', path: '/missoes' },
  { icon: Users, label: 'COMUNIDADE', path: '/comunidade' },
  { icon: ShoppingBag, label: 'LOJA', path: '/loja' },
  { icon: Settings, label: 'CONFIGURAÇÕES', path: '/configuracoes' },
];

export const FloatingNavbar = () => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-6">
      <nav className="flex items-center gap-1 bg-[#121212]/90 backdrop-blur-2xl border border-white/10 px-3 py-3 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
              isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            {({ isActive }) => (
              <>
                {/* Tooltip Pop-up */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#181818] border border-white/10 rounded-xl opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none shadow-2xl z-[60]">
                  <span className="text-[10px] font-bold tracking-widest text-white whitespace-nowrap uppercase">
                    {item.label}
                  </span>
                  {/* Tooltip Arrow */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#181818] border-r border-b border-white/10 rotate-45"></div>
                </div>

                {/* Icon */}
                <div className={cn(
                    "relative flex items-center justify-center transition-transform duration-300",
                    isActive && "scale-110"
                )}>
                    <item.icon 
                        size={20} 
                        className={cn(
                            "transition-all duration-300",
                            isActive && "drop-shadow-[0_0_12px_rgba(239,68,68,0.6)] fill-red-500/10"
                        )} 
                        strokeWidth={isActive ? 2.5 : 2}
                    />
                </div>

                {/* Active Dot Indicator */}
                <span className={cn(
                  "absolute -bottom-0.5 w-1 h-1 rounded-full bg-red-500 transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,1)]",
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                )} />

                {/* Hover Background Glow */}
                <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};