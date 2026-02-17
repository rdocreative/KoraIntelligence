import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  CheckCircle2, 
  ListTodo, 
  Target, 
  Wallet, 
  ShoppingBag, 
  Package, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navItems = [
  { icon: Home, label: 'Início', path: '/' },
  { icon: CheckCircle2, label: 'Hábitos', path: '/habitos' },
  { icon: ListTodo, label: 'Tarefas', path: '/tarefas' },
  { icon: Target, label: 'Metas', path: '/metas' },
  { icon: Wallet, label: 'Finança', path: '/financa' },
  { icon: ShoppingBag, label: 'Loja', path: '/loja' },
  { icon: Package, label: 'Inventário', path: '/inventario' },
  { icon: Settings, label: 'Config', path: '/configuracoes' },
];

export const FloatingNavbar = () => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl px-2 py-2 flex items-center gap-2">
        <ul className="flex-1 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <li key={item.path} className="flex-1 min-w-[55px]">
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-300 gap-1 group",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <item.icon size={18} className={cn("transition-transform duration-300 group-hover:scale-110")} />
                <span className="text-[9px] font-black uppercase tracking-tighter truncate w-full text-center">
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="border-l border-slate-200 dark:border-slate-800 pl-2 ml-1">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};