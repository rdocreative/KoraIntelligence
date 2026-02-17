import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Target, 
  ShoppingBag, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Início', path: '/' },
  { icon: CheckCircle2, label: 'Hábitos', path: '/habitos' },
  { icon: Target, label: 'Metas', path: '/metas' },
  { icon: ShoppingBag, label: 'Loja', path: '/loja' },
  { icon: Settings, label: 'Ajustes', path: '/configuracoes' },
];

export const FloatingNavbar = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <nav className="flex items-center justify-between bg-[#121212]/80 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "relative group flex flex-col items-center justify-center w-12 h-12 transition-all duration-300",
              isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            {({ isActive }) => (
              <>
                {/* Icon */}
                <div className={cn(
                    "transition-transform duration-300",
                    isActive && "-translate-y-1"
                )}>
                    <item.icon 
                        size={24} 
                        className={cn(
                            isActive && "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] fill-red-500/10"
                        )} 
                        strokeWidth={isActive ? 2.5 : 2}
                    />
                </div>

                {/* Active Dot Indicator */}
                <span className={cn(
                  "absolute -bottom-1 w-1 h-1 rounded-full bg-red-500 transition-all duration-300 shadow-[0_0_8px_rgba(239,68,68,1)]",
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                )} />

                {/* Hover Glow Background */}
                <div className="absolute inset-0 bg-red-500/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};