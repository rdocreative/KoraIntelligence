"use client";

import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  CheckCircle2,
  Activity,
  Target,
  Settings,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: 'Início', icon: HomeIcon, path: '/' },
  { name: 'Tarefas', icon: CheckCircle2, path: '/tarefas' },
  { name: 'Hábitos', icon: Activity, path: '/habitos' },
  { name: 'Missões', icon: Target, path: '/missoes' },
  { name: 'Configurações', icon: Settings, path: '/configuracoes' },
];

export const SideNav = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-full flex flex-col pt-12 pb-6 px-6 relative z-10 shrink-0 bg-transparent">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-serif font-medium tracking-tight text-white">Néctar.</h1>
        <button className="p-1.5 rounded-[24px] hover:bg-white/10 text-zinc-400 transition-colors border border-white/5">
          <Plus size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-[24px] transition-all",
                isActive 
                  ? "bg-[#38BDF8]/10 text-white font-semibold shadow-sm border border-[#38BDF8]/20" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
              )}
            >
              <item.icon 
                size={18} 
                strokeWidth={isActive ? 2 : 1.5} 
                style={{ color: isActive ? '#38BDF8' : 'currentColor' }} 
              />
              <span className="text-[13px]">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="pt-4 mt-auto flex items-center gap-3 cursor-pointer border-t border-white/5">
        <div className="w-8 h-8 rounded-[24px] flex items-center justify-center text-[10px] font-bold bg-[#38BDF8]/20 text-[#38BDF8]">RS</div>
        <span className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors">Ricardo S.</span>
      </div>
    </div>
  );
};