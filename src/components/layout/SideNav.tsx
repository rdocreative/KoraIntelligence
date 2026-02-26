"use client";

import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  CheckCircle2,
  BarChart3,
  Target,
  ShoppingBag,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const theme = {
  primary: '#C4B5FD',
  gradPrimary: 'linear-gradient(135deg, #C4B5FD 0%, #A855F7 100%)',
  primaryGlow: '0 0 20px rgba(196, 181, 253, 0.25)',
};

const navItems = [
  { name: 'Início', icon: Home, path: '/' },
  { name: 'Hábitos', icon: CheckCircle2, path: '/habitos' },
  { name: 'Dashboard', icon: BarChart3, path: '/dashboard' },
  { name: 'Missões', icon: Target, path: '/missoes' },
  { name: 'Loja', icon: ShoppingBag, path: '/loja' },
];

export const SideNav = () => {
  const location = useLocation();

  return (
    <div className="w-20 lg:w-64 h-screen flex flex-col p-6 relative z-20 transition-all duration-500 bg-transparent shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform hover:scale-110" 
          style={{ 
            background: theme.gradPrimary, 
            boxShadow: theme.primaryGlow 
          }}
        >
          <Zap size={20} color="#000" fill="#000" />
        </div>
        <span className="hidden lg:block text-2xl font-serif italic tracking-tighter text-[#F9FAFB]">Néctar</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-4 px-3 py-3 rounded-2xl transition-all duration-300 group",
                isActive ? "bg-white/5 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
              )}
            >
              <item.icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 1.5} 
                style={{ color: isActive ? theme.primary : 'currentColor' }} 
              />
              <span className="hidden lg:block text-sm font-semibold">{item.name}</span>
              {isActive && (
                <div 
                  className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: theme.primary, boxShadow: theme.primaryGlow }} 
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto">
        <NavLink 
          to="/perfil"
          className="p-2 lg:p-4 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-md hover:bg-white/[0.05] transition-colors cursor-pointer block"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/10 shadow-lg" />
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-xs font-black truncate uppercase tracking-widest text-[#F9FAFB]">Ricardo</p>
              <p className="text-[10px] font-medium opacity-40 uppercase">Nível 42</p>
            </div>
          </div>
        </NavLink>
      </div>
    </div>
  );
};