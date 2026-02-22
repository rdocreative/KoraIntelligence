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
    <div className="fixed left-0 top-0 h-full w-[88px] z-[100] bg-sidebar border-r-2 border-[#37464f] flex flex-col items-center py-6 gap-4">
      <nav className="flex flex-col items-center gap-3 w-full">
        {navItems.map(({ icon: Icon, path, label, isSpecial }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "group relative flex items-center justify-center rounded-[16px] transition-all duration-200",
              "w-[52px] h-[52px]",
              isActive 
                ? "bg-[#37464f]/50 border-2 border-[#22d3ee] shadow-[0_0_10px_rgba(34,211,238,0.2)]" 
                : "border-2 border-transparent hover:bg-[#202f36] hover:border-[#37464f]",
              isSpecial && "mt-2 mb-2 bg-[#202f36] border-2 border-[#ce82ff] shadow-3d-purple hover:translate-y-[2px] hover:shadow-none active:translate-y-[4px]"
            )}
          >
            <Icon 
              size={isSpecial ? 28 : 24} 
              strokeWidth={isSpecial ? 2.5 : 2.5} 
              className={cn(
                "transition-colors",
                isActive ? "text-[#22d3ee]" : "text-[#9ca3af] group-hover:text-[#e5e7eb]",
                isSpecial && "text-[#ce82ff]"
              )}
            />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};