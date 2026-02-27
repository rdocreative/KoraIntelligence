"use client";

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Target, 
  Trophy, 
  ShoppingBag, 
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../providers/AuthProvider';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Painel', path: '/' },
  { icon: CheckSquare, label: 'Tarefas', path: '/tarefas' },
  { icon: Target, label: 'Hábitos', path: '/habitos' },
  { icon: Trophy, label: 'Missões', path: '/missoes' },
  { icon: ShoppingBag, label: 'Loja', path: '/loja' },
  { icon: Settings, label: 'Ajustes', path: '/configuracoes' },
];

export const SideNav = () => {
  const { signOut } = useAuth();

  return (
    <aside 
      className="w-20 flex flex-col items-center py-8 gap-8 border-r border-white/[0.05]"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
    >
      <div className="w-10 h-10 bg-[#6366f1] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
        <span className="text-xl font-bold text-white">N</span>
      </div>

      <nav className="flex-1 flex flex-col gap-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 group relative",
              isActive 
                ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20" 
                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05]"
            )}
          >
            <item.icon size={22} strokeWidth={2.5} />
            <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => signOut()}
        className="w-12 h-12 flex items-center justify-center rounded-2xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
      >
        <LogOut size={22} strokeWidth={2.5} />
      </button>
    </aside>
  );
};