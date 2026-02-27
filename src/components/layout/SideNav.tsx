"use client";

import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Target, Settings, LogOut, ShoppingBag, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../providers/AuthProvider';

export const SideNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, session } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: LayoutDashboard, label: 'Painel', path: '/' },
    { icon: CheckSquare, label: 'Tarefas', path: '/tarefas' },
    { icon: Target, label: 'Hábitos', path: '/habitos' },
    { icon: ShoppingBag, label: 'Loja', path: '/loja' },
    { icon: Settings, label: 'Ajustes', path: '/configuracoes' },
  ];

  return (
    <aside className="w-20 h-full flex flex-col items-center py-6 bg-transparent z-50">
      <div className="mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center shadow-lg shadow-[#38BDF8]/20">
            <span className="text-white font-serif font-bold text-xl italic">N</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-4 w-full px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "w-12 h-12 flex items-center justify-center rounded-[18px] transition-all duration-300 group relative",
              isActive 
                ? "bg-white/[0.08] text-white shadow-inner border border-white/5" 
                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
            )}
          >
            <item.icon 
              size={20} 
              strokeWidth={2}
              className={cn("transition-transform duration-300", isActive(item.path) ? "scale-100" : "group-hover:scale-110")} 
            />
            
            {/* Tooltip */}
            <div className="absolute left-14 bg-[#1A1A1A] text-white text-[10px] font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 z-50 translate-x-[-5px] group-hover:translate-x-0 duration-200">
              {item.label}
            </div>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4 w-full px-4">
        <button 
          onClick={() => signOut()}
          className="w-12 h-12 flex items-center justify-center rounded-[18px] text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut size={20} strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
};