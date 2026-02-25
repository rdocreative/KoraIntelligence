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
    <aside className="fixed left-0 top-0 bottom-0 w-[200px] z-[100] flex flex-col bg-[#f5eeee] dark:bg-[#212121] border-r-2 border-[var(--border-ui)] shadow-[4px_0_0_0_var(--shadow-ui)]">
      {/* Header com Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-[0_4px_0_0_var(--primary-dark)]">
          K
        </div>
        <div>
          <h1 className="font-bold text-xl leading-none">Kora</h1>
          <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider font-bold">Produtividade</span>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => cn(
              "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
              isActive 
                ? "bg-primary text-primary-foreground shadow-[0_4px_0_0_var(--primary-dark)]" 
                : "text-[var(--muted-foreground)] hover:bg-[var(--panel)] hover:text-[var(--foreground)]"
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm font-semibold">{label}</span>
                {isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Rodapé com Usuário */}
      <div className="p-4 border-t-2 border-[var(--border-ui)] mt-auto">
        <div className="flex items-center justify-between gap-2 bg-[var(--panel)] p-2 rounded-2xl border border-[var(--border-ui)]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <User size={16} className="text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold truncate">Usuário</span>
              <span className="text-[10px] text-primary font-bold">Level 15</span>
            </div>
          </div>
          <NavLink 
            to="/configuracoes" 
            className="p-1.5 hover:bg-[var(--border-ui)] rounded-lg transition-colors text-[var(--muted-foreground)]"
          >
            <Settings size={18} />
          </NavLink>
        </div>
      </div>
    </aside>
  );
};