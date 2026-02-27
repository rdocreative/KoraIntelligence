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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Botão Flutuante Discreto */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-8 z-50 p-2 bg-[#080B14] border border-l-0 border-white/10 rounded-r-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all animate-in fade-in slide-in-from-left duration-500"
          title="Abrir Menu"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}

      {/* Container Principal da SideNav */}
      <div 
        className={cn(
          "h-full flex flex-col relative z-30 shrink-0 bg-[#0A0C10] border-r border-white/[0.04] transition-all duration-500 ease-in-out outline-none overflow-hidden",
          isOpen ? "w-[260px]" : "w-0 border-r-0"
        )}
      >
        {/* Wrapper Interno */}
        <div 
          className={cn(
            "flex flex-col h-full min-w-[260px] p-8 pt-8 pb-6 transition-all duration-500 ease-in-out",
            isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-serif font-medium tracking-tight text-white">
              Néctar.
            </h1>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 transition-colors border border-white/5"
              title="Fechar Menu"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>

          {/* Adicionar Novo */}
          <button className="flex items-center gap-3 w-full p-3 mb-6 rounded-[20px] bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all group">
            <div className="p-1 rounded-lg bg-[#6366f1]/10 text-[#6366f1]">
              <Plus size={16} />
            </div>
            <span className="text-xs font-semibold">Novo Registro</span>
          </button>

          {/* Navegação */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-[24px] transition-all whitespace-nowrap border border-transparent",
                    isActive 
                      ? "bg-[#6366f1]/10 text-white font-semibold shadow-sm border-[#6366f1]/20" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                  )}
                >
                  <item.icon 
                    size={18} 
                    strokeWidth={isActive ? 2 : 1.5} 
                    style={{ color: isActive ? '#6366f1' : 'currentColor' }} 
                    className="shrink-0"
                  />
                  <span className="text-[13px]">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
          
          {/* Footer */}
          <div className="pt-4 mt-auto flex items-center gap-3 border-t border-white/5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#6366f1]/20 text-[#6366f1] shrink-0 border border-[#6366f1]/10">
              RS
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-200 truncate">
                Ricardo S.
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Nível 12</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};