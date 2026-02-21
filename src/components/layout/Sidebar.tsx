"use client";

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Crown, 
  ClipboardList,
  Target, 
  Swords,
  Users,
  ShoppingBag, 
  Settings,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { icon: LayoutDashboard, label: 'INÍCIO', path: '/', color: '#4adbc8' },
  { icon: Crown, label: 'MASTERPLAN', path: '/masterplan', color: '#a855f7' },
  { icon: ClipboardList, label: 'HÁBITOS', path: '/habitos', color: '#00e5cc' },
  { icon: Target, label: 'METAS', path: '/metas', color: '#22c55e' },
  { icon: Bell, label: 'LEMBRETES', path: '/lembretes', color: '#ec48fb' },
  { icon: Swords, label: 'MISSÕES', path: '/missoes', color: '#f97316' },
  { icon: Users, label: 'COMUNIDADE', path: '/comunidade', color: '#06b6d4' },
  { icon: ShoppingBag, label: 'LOJA', path: '/loja', color: '#eab308' },
  { icon: Settings, label: 'CONFIGURAÇÕES', path: '/configuracoes', color: '#94a3b8' },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-[#050f0e] flex flex-col items-center py-8 z-50 border-none overflow-hidden select-none">
      <div className="mb-10">
        <div className="w-10 h-10 bg-[#00e5cc] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,229,204,0.3)]">
          <Crown size={24} className="text-[#050f0e]" strokeWidth={2.5} />
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-4 w-full px-4">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    "relative flex items-center justify-center w-12 h-12 mx-auto rounded-xl transition-none",
                    isActive 
                      ? "bg-[#00e5cc10] text-[#00e5cc]" 
                      : "text-[#5a8a85] hover:text-white hover:bg-white/5"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon 
                        size={22} 
                        className="transition-none"
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      {isActive && (
                        <div className="absolute left-0 w-1 h-6 bg-[#00e5cc] rounded-r-full" />
                      )}
                    </>
                  )}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                sideOffset={15}
                className="bg-[#050f0e] border-[#1e3a36] text-white text-[10px] font-bold uppercase tracking-[0.1em] rounded-md transition-none"
              >
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>

      <div className="mt-auto px-4 w-full">
        <div className="w-10 h-10 mx-auto rounded-full overflow-hidden border border-[#1e3a36] hover:border-[#00e5cc] transition-none cursor-pointer">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </aside>
  );
};