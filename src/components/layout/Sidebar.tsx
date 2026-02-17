import { NavLink } from 'react-router-dom';
import { 
  Home, 
  CheckCircle2, 
  Target, 
  Wallet, 
  ShoppingBag, 
  Package, 
  Settings,
  Flame,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CheckCircle2, label: 'Hábitos', path: '/habitos' },
  { icon: Target, label: 'Metas', path: '/metas' },
  { icon: Wallet, label: 'Finanças', path: '/financa' },
  { icon: ShoppingBag, label: 'Loja', path: '/loja' },
  { icon: Package, label: 'Inventário', path: '/inventario' },
  { icon: Settings, label: 'Ajustes', path: '/configuracoes' },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-50">
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
        <div className="bg-red-600/20 p-2 rounded-xl">
           <Flame className="w-6 h-6 text-red-500 fill-red-500/50" />
        </div>
        <span className="hidden lg:block ml-3 font-bold text-lg tracking-wide">Mindset<span className="text-red-500">.AI</span></span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center justify-center lg:justify-start gap-4 px-3 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
              isActive 
                ? "bg-red-600/10 text-red-500" 
                : "text-neutral-500 hover:text-neutral-200 hover:bg-white/5"
            )}
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Line (Left) */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-500 rounded-r-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                )}
                
                <item.icon size={22} className={cn("transition-transform group-hover:scale-110", isActive && "fill-current")} />
                <span className={cn("hidden lg:block font-medium text-sm")}>
                  {item.label}
                </span>
                
                {/* Subtle Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/0 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Mini Profile */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-[#121212] p-3 rounded-2xl flex items-center gap-3 border border-white/5">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-red-900/20">
              ME
           </div>
           <div className="hidden lg:block">
              <div className="text-sm font-bold text-white">Usuário</div>
              <div className="text-xs text-neutral-500">Nível 12</div>
           </div>
        </div>
      </div>
    </aside>
  );
};