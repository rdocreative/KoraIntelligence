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
  { icon: LayoutDashboard, path: "/", label: "Início", color: "text-[#1cb0f6]", activeBg: "bg-[#1cb0f6]/20", border: "border-[#1cb0f6]" },
  { icon: Crown, path: "/masterplan", label: "Masterplan", color: "text-[#ce82ff]", activeBg: "bg-[#ce82ff]/20", border: "border-[#ce82ff]" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos", color: "text-[#58cc02]", activeBg: "bg-[#58cc02]/20", border: "border-[#58cc02]" },
  { icon: Target, path: "/metas", label: "Metas", color: "text-[#ff9600]", activeBg: "bg-[#ff9600]/20", border: "border-[#ff9600]" },
  { icon: Brain, path: "/brain", label: "Sistema", color: "text-[#22d3ee]", activeBg: "bg-[#22d3ee]/20", border: "border-[#22d3ee]", isSpecial: true },
  { icon: Bell, path: "/lembretes", label: "Lembretes", color: "text-[#ff4b4b]", activeBg: "bg-[#ff4b4b]/20", border: "border-[#ff4b4b]" },
  { icon: Swords, path: "/missoes", label: "Missões", color: "text-[#ff9600]", activeBg: "bg-[#ff9600]/20", border: "border-[#ff9600]" },
  { icon: ShoppingBag, path: "/loja", label: "Loja", color: "text-[#22d3ee]", activeBg: "bg-[#22d3ee]/20", border: "border-[#22d3ee]" },
  { icon: Settings, path: "/configuracoes", label: "Configurações", color: "text-[#9ca3af]", activeBg: "bg-[#9ca3af]/20", border: "border-[#9ca3af]" },
];

export const SideNav = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-[80px] bg-[#131f24] border-r-2 border-[#37464f] z-[100] hidden md:flex flex-col items-center py-6">
      <nav className="flex flex-col items-center gap-4 w-full">
        {navItems.map(({ icon: Icon, path, label, color, activeBg, border, isSpecial }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "group relative flex items-center justify-center rounded-xl transition-all duration-200",
              "w-[52px] h-[52px]",
              "border-2 border-transparent", // Default border
              isActive 
                ? cn("bg-[#202f36] shadow-3d-panel translate-y-[-2px]", border) 
                : "hover:bg-[#202f36] hover:translate-y-[-2px]",
              isSpecial && !isActive && "opacity-80 hover:opacity-100"
            )}
          >
            <Icon 
              size={isSpecial ? 28 : 24} 
              strokeWidth={2.5}
              className={cn(
                "transition-colors",
                color
              )}
            />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};