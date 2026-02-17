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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <nav className="flex items-center justify-between bg-[#121212]/90 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "relative group flex flex-col items-center justify-center min-w-[70px] md:min-w-[90px] transition-all duration-300",
              isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            {({ isActive }) => (
              <>
                {/* Content */}
                <div className={cn(
                    "flex flex-col items-center gap-1.5 transition-transform duration-300",
                    isActive && "-translate-y-1"
                )}>
                    <item.icon 
                        size={18} 
                        className={cn(
                            "transition-all duration-300",
                            isActive && "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] fill-red-500/10"
                        )} 
                        strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span className={cn(
                        "text-[9px] font-black tracking-widest transition-all duration-300",
                        isActive ? "opacity-100" : "opacity-50 group-hover:opacity-100"
                    )}>
                        {item.label}
                    </span>
                </div>

                {/* Active Dot Indicator */}
                <span className={cn(
                  "absolute -bottom-1 w-1 h-1 rounded-full bg-red-500 transition-all duration-300 shadow-[0_0_8px_rgba(239,68,68,1)]",
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                )} />

                {/* Hover Glow Background */}
                <div className="absolute inset-0 bg-red-500/5 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};