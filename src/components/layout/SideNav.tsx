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
  Brain 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, path: "/", label: "Início", color: "blue" },
  { icon: Crown, path: "/masterplan", label: "Masterplan", color: "purple" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos", color: "green" },
  { icon: Target, path: "/metas", label: "Metas", color: "orange" },
  { icon: Brain, path: "/brain", label: "Sistema", color: "cyan", isSpecial: true },
  { icon: Bell, path: "/lembretes", label: "Lembretes", color: "red" },
  { icon: Swords, path: "/missoes", label: "Missões", color: "orange" },
  { icon: ShoppingBag, path: "/loja", label: "Loja", color: "purple" },
  { icon: Settings, path: "/configuracoes", label: "Configurações", color: "blue" },
];

export const SideNav = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-[80px] bg-sidebar border-r-2 border-border z-[100] hidden md:flex flex-col items-center py-6 gap-4">
      <div className="mb-6">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-cyan">
           <span className="material-icons-round text-background text-3xl">bolt</span>
        </div>
      </div>
      
      <nav className="flex flex-col items-center gap-4 w-full px-2">
        {navItems.map(({ icon: Icon, path, label, color, isSpecial }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => cn(
              "w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-200 group relative",
              isActive 
                ? `bg-card-${color} shadow-${color} text-white` 
                : "text-text-muted hover:bg-panel hover:text-white"
            )}
          >
            <Icon size={28} strokeWidth={2.5} />
            
            {/* Tooltip on hover */}
            <div className="absolute left-full ml-4 px-3 py-1 bg-duo-gray text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-panel">
              {label}
            </div>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};