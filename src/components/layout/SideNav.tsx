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
  User
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
    <aside className="fixed left-0 top-0 bottom-0 w-[200px] z-[100] flex flex-col bg-[#f5eeee] dark:bg-[#212121] border-r border-[var(--border-ui)]">
      {/* Navegação Principal com espaçamento generoso no topo */}
      <nav className="flex-1 px-3 pt-10 pb-4 flex flex-col gap-[4px] overflow-y-auto">
        {navItems.map(({ icon: Icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => cn(
              "group relative flex items-center gap-3 px-[10px] py-[8px] rounded-[10px] transition-all duration-200",
              isActive 
                ? "bg-primary/20 text-primary font-medium" 
                : "text-[var(--muted-foreground)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--foreground)]"
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                <span className="text-[13px] font-semibold leading-none">{label}</span>
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary/60 hidden" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Linha divisória sutil */}
      <div className="mx-4 h-px bg-[var(--border-ui)] opacity-50" />

      {/* Rodapé com Usuário Minimalista */}
      <div className="p-3 mt-auto">
        <div className="flex items-center justify-between gap-2 bg-black/5 dark:bg-white/5 p-2 rounded-[12px]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <User size={14} className="text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-bold truncate leading-tight">Usuário</span>
              <span className="text-[10px] text-primary font-bold leading-none">Lvl 15</span>
            </div>
          </div>
          <NavLink 
            to="/configuracoes" 
            className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors text-[var(--muted-foreground)]"
          >
            <Settings size={14} />
          </NavLink>
        </div>
      </div>
    </aside>
  );
};