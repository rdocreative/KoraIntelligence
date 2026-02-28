"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Target, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CheckSquare, label: 'Tarefas', path: '/tasks' },
  { icon: Calendar, label: 'Calendário', path: '/calendar' },
  { icon: Target, label: 'Metas', path: '/goals' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-full bg-[#0b0b0b] border-r border-white/5 flex flex-col p-6 shrink-0">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="text-white" size={20} />
        </div>
        <span className="text-xl font-black text-white tracking-tight">Dyad.ai</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-white/5 text-white shadow-inner" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                isActive ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-400"
              )} />
              <span className="text-sm font-bold tracking-wide">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-white/5 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-500 hover:text-zinc-300 transition-all hover:bg-white/[0.02]">
          <Settings size={20} />
          <span className="text-sm font-bold tracking-wide">Ajustes</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-500 hover:text-red-400 transition-all hover:bg-red-500/5">
          <LogOut size={20} />
          <span className="text-sm font-bold tracking-wide">Sair</span>
        </button>
      </div>
    </div>
  );
};