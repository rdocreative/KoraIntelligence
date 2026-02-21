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
  { icon: ClipboardList, path: "/habitos", label: "Hábitos", color: "#00e5cc" },
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
      <nav className="flex flex-col items-center gap-2 border-none bg-transparent">
        {navItems.map(({ icon: Icon, path, label, isSpecial, color }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "flex items-center justify-center rounded-full transition-all duration-300",
              !isSpecial && "w-[42px] h-[42px]",
              isSpecial && "w-[52px] h-[52px] my-1 hover:scale-105 active:scale-95 shadow-lg",
              isActive && !isSpecial && "bg-[#0a1a18] border border-[#1a2e2c]"
            )}
            style={({ isActive }) => {
              if (isSpecial) {
                return {
                  background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                  boxShadow: '0 4px 20px #38bdf840',
                  color: '#071412'
                };
              }
              if (isActive) {
                return {
                  color: color,
                  boxShadow: `0 0 15px ${color}20`
                };
              }
              return {
                color: '#5a8a85'
              };
            }}
          >
            <Icon 
              size={isSpecial ? 26 : 22} 
              strokeWidth={isSpecial ? 2.5 : 2} 
              className="transition-transform duration-200 group-hover:scale-110"
            />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};