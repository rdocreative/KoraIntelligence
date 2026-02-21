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
  { icon: LayoutDashboard, path: "/", label: "Início", color: "#00d2ff" },
  { icon: Crown, path: "/masterplan", label: "Masterplan", color: "#ffd700" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos", color: "#00ffea" },
  { icon: Target, path: "/metas", label: "Metas", color: "#ff4d4d" },
  { icon: Brain, path: "/brain", label: "Sistema", isSpecial: true, color: "#00c2ff" },
  { icon: Bell, path: "/lembretes", label: "Lembretes", color: "#d8b4fe" },
  { icon: Swords, path: "/missoes", label: "Missões", color: "#ff8c00" },
  { icon: ShoppingBag, path: "/loja", label: "Loja", color: "#00f5d4" },
  { icon: Settings, path: "/configuracoes", label: "Configurações", color: "#e2e8f0" },
];

export const SideNav = () => {
  return (
    <div className="fixed left-[20px] top-1/2 -translate-y-1/2 z-[100]">
      <nav className="flex flex-col items-center gap-3 border-none bg-transparent">
        {navItems.map(({ icon: Icon, path, label, isSpecial, color }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "group relative flex items-center justify-center rounded-full transition-all duration-500 ease-in-out",
              !isSpecial && "w-[44px] h-[44px]",
              isSpecial && "w-[54px] h-[54px] my-2 hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(0,194,255,0.3)]",
              isActive && !isSpecial && "bg-[#0a1a18]/80 border border-[#1a2e2c] shadow-[0_0_15px_rgba(0,0,0,0.2)]"
            )}
            style={({ isActive }) => {
              if (isSpecial) {
                return {
                  background: 'linear-gradient(135deg, #00c2ff 0%, #0284c7 100%)',
                  color: '#071412'
                };
              }
              return {
                color: isActive ? color : '#5a8a85',
                boxShadow: isActive ? `0 0 20px ${color}25` : 'none'
              };
            }}
          >
            <Icon 
              size={isSpecial ? 28 : 22} 
              strokeWidth={isSpecial ? 2.5 : 2} 
              className={cn(
                "transition-all duration-500 ease-in-out",
                "group-hover:scale-110",
                isSpecial ? "drop-shadow-sm" : "group-hover:text-white"
              )}
            />
            
            {/* Indicador sutil de hover para abas não especiais */}
            {!isSpecial && (
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ backgroundColor: color }}
              />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};