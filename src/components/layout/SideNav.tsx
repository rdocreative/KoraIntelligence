"use client";

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Target, 
  Calendar, 
  ListTodo, 
  Bell, 
  Users, 
  Store, 
  Settings,
  Package,
  Wallet,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Início', path: '/' },
  { icon: ListTodo, label: 'Masterplan', path: '/masterplan' },
  { icon: Calendar, label: 'Hábitos', path: '/habitos' },
  { icon: Target, label: 'Metas', path: '/metas' },
  { icon: Bell, label: 'Lembretes', path: '/lembretes' },
  { icon: LayoutGrid, label: 'Missões', path: '/missoes' },
  { icon: Users, label: 'Comunidade', path: '/comunidade' },
  { icon: Wallet, label: 'Finanças', path: '/financa' },
  { icon: Store, label: 'Loja', path: '/loja' },
  { icon: Package, label: 'Inventário', path: '/inventario' },
  { icon: Settings, label: 'Ajustes', path: '/configuracoes' },
];

export const SideNav = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[85px] bg-[var(--sidebar)] border-r border-[var(--border-ui)] flex flex-col items-center py-6 z-50">
      <div className="mb-8">
        <div className="w-12 h-12 bg-[#A50104] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
          K
        </div>
      </div>

      <nav className="flex-1 w-full flex flex-col gap-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "relative w-full py-4 flex flex-col items-center transition-all duration-200 group",
              isActive 
                ? "bg-[rgba(165,1,4,0.15)] border-l-[3px] border-[#A50104]" 
                : "hover:bg-black/5"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={24} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-[#A50104]" : "text-[#4A5270]"
                  )} 
                />
                <span className={cn(
                  "text-[9px] font-[800] uppercase mt-1.5 tracking-tighter transition-colors text-center px-1",
                  isActive ? "text-[#A50104]" : "text-[#4A5270]"
                )}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};