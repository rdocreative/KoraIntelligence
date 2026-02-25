"use client";

import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Crown, 
  ClipboardList, 
  Target, 
  Bell, 
  Swords, 
  ShoppingBag, 
  Settings, 
  Brain,
  User,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, path: "/", label: "Início" },
  { icon: Crown, path: "/masterplan", label: "Masterplan" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos" },
  { icon: Target, path: "/metas", label: "Metas" },
  { icon: Brain, path: "/brain", label: "Sistema" },
  { icon: Bell, path: "/lembretes", label: "Lembretes" },
  { icon: Swords, path: "/missoes", label: "Missões" },
  { icon: ShoppingBag, path: "/loja", label: "Loja" },
];

export const SideNav = () => {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] z-[100] flex flex-col bg-[#f5eeee] dark:bg-[#212121] rounded-r-[40px] shadow-2xl border-r border-[var(--border-ui)]/50">
      {/* Header Estilizado */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <Sparkles className="text-primary-foreground w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-none tracking-tight">App Name</h1>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">Productivity</span>
          </div>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto scrollbar-none">
        {navItems.map(({ icon: Icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => cn(
              "group relative flex items-center gap-4 px-4 py-3.5 rounded-[20px] transition-all duration-300 ease-out",
              isActive 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]" 
                : "text-[var(--muted-foreground)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--foreground)]"
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                <span className="text-[14px] font-bold tracking-wide">{label}</span>
                
                {isActive && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Rodapé com Usuário Estilo Card */}
      <div className="p-4 mt-auto mb-2">
        <div className="relative group bg-black/5 dark:bg-white/5 p-3 rounded-[24px] hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-[14px] bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                <User size={18} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-extrabold truncate leading-tight">Ricardo</span>
                <span className="text-[11px] text-primary font-bold leading-none mt-0.5">Lvl 42</span>
              </div>
            </div>
            
            <NavLink 
              to="/configuracoes" 
              className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors text-[var(--muted-foreground)]"
            >
              <Settings size={18} />
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
};