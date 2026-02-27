"use client";

import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  CheckCircle2,
  Activity,
  Target,
  Settings,
  Plus,
  PanelLeftClose,
  PanelLeftOpen
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "h-full flex flex-col pt-8 pb-6 relative z-30 shrink-0 bg-[#070707] transition-all duration-300 ease-in-out border-none outline-none overflow-hidden",
        isCollapsed ? "w-[80px] px-3" : "w-[260px] px-6"
      )}
    >
      {/* Botão de Toggle e Header */}
      <div className={cn(
        "flex items-center mb-10 transition-all duration-300",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <h1 className="text-3xl font-serif font-medium tracking-tight text-white animate-in fade-in duration-500">
            Néctar.
          </h1>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-2 rounded-xl hover:bg-white/10 text-zinc-400 transition-colors border border-white/5",
            isCollapsed && "mx-auto"
          )}
          title={isCollapsed ? "Expandir" : "Recolher"}
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Adicionar Novo (Opcional, escondido se colapsado ou adaptado) */}
      {!isCollapsed && (
        <button className="flex items-center gap-3 w-full p-3 mb-6 rounded-[20px] bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all group">
          <div className="p-1 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8]">
            <Plus size={16} />
          </div>
          <span className="text-xs font-semibold">Novo Registro</span>
        </button>
      )}

      {/* Navegação */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={cn(
                "w-full flex items-center transition-all whitespace-nowrap border border-transparent",
                isCollapsed ? "justify-center p-3 rounded-xl" : "gap-3 px-3 py-2.5 rounded-[24px]",
                isActive 
                  ? "bg-[#38BDF8]/10 text-white font-semibold shadow-sm border-[#38BDF8]/20" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
              )}
              title={isCollapsed ? item.name : ""}
            >
              <item.icon 
                size={18} 
                strokeWidth={isActive ? 2 : 1.5} 
                style={{ color: isActive ? '#38BDF8' : 'currentColor' }} 
                className="shrink-0"
              />
              {!isCollapsed && (
                <span className="text-[13px] animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.name}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      {/* Footer / Perfil */}
      <div className={cn(
        "pt-4 mt-auto flex items-center gap-3 border-t border-white/5",
        isCollapsed ? "justify-center" : "px-1"
      )}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#38BDF8]/20 text-[#38BDF8] shrink-0 border border-[#38BDF8]/10">
          RS
        </div>
        {!isCollapsed && (
          <div className="flex flex-col min-w-0 animate-in fade-in duration-500">
            <span className="text-xs font-semibold text-zinc-200 truncate">
              Ricardo S.
            </span>
            <span className="text-[10px] text-zinc-500 font-medium">Nível 12</span>
          </div>
        )}
      </div>
    </div>
  );
};