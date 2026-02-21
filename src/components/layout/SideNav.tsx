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

const THEME_COLOR = "#00e5cc";

const navItems = [
  { icon: LayoutDashboard, path: "/", label: "Início" },
  { icon: Crown, path: "/masterplan", label: "Masterplan" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos" },
  { icon: Target, path: "/metas", label: "Metas" },
  { icon: Brain, path: "/brain", label: "Sistema", isSpecial: true },
  { icon: Bell, path: "/lembretes", label: "Lembretes" },
  { icon: Swords, path: "/missoes", label: "Missões" },
  { icon: ShoppingBag, path: "/loja", label: "Loja" },
  { icon: Settings, path: "/configuracoes", label: "Configurações" },
];

export const SideNav = () => {
  return (
    <div className="fixed left-[20px] top-1/2 -translate-y-1/2 z-[100]">
      <nav className="flex flex-col items-center gap-3 border-none bg-transparent">
        {navItems.map(({ icon: Icon, path, label, isSpecial }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "group relative flex items-center justify-center rounded-full transition-all duration-500 ease-in-out",
              !isSpecial && "w-[44px] h-[44px]",
              isSpecial && "w-[56px] h-[56px] my-2 hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(0,229,204,0.3)]",
              isActive && !isSpecial && "bg-[#0a1a18]/90 border border-[#1a2e2c] shadow-[0_0_20px_rgba(0,229,204,0.15)]"
            )}
            style={({ isActive }) => {
              if (isSpecial) {
                return {
                  background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #00b3a0 100%)`,
                  color: '#071412'
                };
              }
              return {
                color: THEME_COLOR,
                opacity: isActive ? 1 : 0.6
              };
            }}
          >
            <Icon 
              size={isSpecial ? 28 : 22} 
              strokeWidth={isSpecial ? 2.5 : 2} 
              className={cn(
                "transition-all duration-500 ease-in-out",
                "group-hover:scale-110",
                !isSpecial && "group-hover:opacity-100",
                isSpecial && "drop-shadow-sm"
              )}
            />
            
            {/* Glow sutil no hover */}
            {!isSpecial && (
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                style={{ backgroundColor: THEME_COLOR }}
              />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};