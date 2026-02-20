"use client";

import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ClipboardList, 
  Target, 
  Eye,
  Settings,
  LucideIcon
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Início', path: '/' },
  { icon: ClipboardList, label: 'Tarefas', path: '/tarefas' },
  { icon: Target, label: 'Metas', path: '/metas' },
  { icon: Eye, label: 'Visão', path: '/masterplan' },
  { icon: Settings, label: 'Ajustes', path: '/configuracoes' },
];

export const FloatingNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none">
      <nav className="flex items-center gap-1 p-2 bg-[#1a0000]/95 border border-[#FF3232]/20 rounded-full backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] pointer-events-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                isActive 
                  ? "bg-[#FF3232] text-white shadow-[0_0_15px_rgba(255,50,50,0.4)]" 
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <span className="sr-only">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};