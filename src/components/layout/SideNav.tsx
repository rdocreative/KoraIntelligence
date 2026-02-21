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
  { icon: LayoutDashboard, path: "/", label: "Início", color: "#38bdf8" },
  { icon: Crown, path: "/masterplan", label: "Masterplan", color: "#fbbf24" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos", color: "#4ade80" },
  { icon: Target, path: "/metas", label: "Metas", color: "#f87171" },
  { icon: Brain, path: "/brain", label: "Sistema", isSpecial: true, color: "#38bdf8" },
  { icon: Bell, path: "/lembretes", label: "Lembretes", color: "#c084fc" },
  { icon: Swords, path: "/missoes", label: "Missões", color: "#fb923c" },
  { icon: ShoppingBag, path: "/loja", label: "Loja", color: "#2dd4bf" },
  { icon: Settings, path: "/configuracoes", label: "Configurações", color: "#94a3b8" },
];

export const SideNav = () => {
  return (
    <div className="fixed left-[20px] top-1/2 -translate-y-1/2 z-[100]">
      <nav className="flex flex-col items-center gap-2 border-none">
        {navItems.map(({ icon: Icon, path, label, isSpecial, color }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "flex items-center justify-center rounded-full transition-all duration-300 group",
              !isSpecial && "w-[40px] h-[40px] hover:bg-[#0a1a18]",
              isSpecial && "w-[48px] h-[48px] my-1 hover:scale-110 active:scale-95",
              isActive && !isSpecial && "bg-[#0a1a18] border border-[#1a2e2c]"
            )}
            style={({ isActive }) => {
              if (isSpecial) {
                return {
                  background: `linear-gradient(135deg, ${color} 0%, #0284c7 100%)`,
                  boxShadow: `0 4px 20px ${color}40`,
                  color: '#071412'
                };
              }
              return {
                // Se estiver ativo, usa a cor cheia. Se não, uma versão com 40% de opacidade
                color: isActive ? color : `${color}66`
              };
            }}
          >
            <Icon 
              size={isSpecial ? 24 : 20} 
              strokeWidth={isSpecial ? 2.5 : 2}
              className="transition-colors duration-300 group-hover:text-[currentColor]"
              style={{ color: 'inherit' }}
            />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};