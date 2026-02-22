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
    <div className="fixed left-[18px] top-1/2 -translate-y-1/2 z-[100] flex opacity-100 visible">
      {/* Largura aumentada de 50px para 56px (~12%) */}
      <nav className="flex flex-col items-center gap-3 border-none bg-[#131f24] p-2 rounded-[32px] border-2 border-[#374151] shadow-[0_4px_0_0_#0b1116] w-[56px]">
        {navItems.map(({ icon: Icon, path, label, isSpecial }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "group relative flex items-center justify-center rounded-full transition-all duration-200 shrink-0",
              !isSpecial && "w-[44px] h-[44px]", // Aumentado de 40px
              isSpecial && "w-[56px] h-[56px] my-2", // Aumentado de 50px
              // Active State: Blue background, solid blue shadow
              isActive && !isSpecial && "bg-[#1cb0f6] shadow-[0_4px_0_0_#1899d6]",
              // Inactive State: Transparent
              !isActive && !isSpecial && "bg-transparent hover:bg-[#202f36]",
              
              // Special Item Active
              isActive && isSpecial && "bg-[#1cb0f6] shadow-[0_4px_0_0_#1899d6]",
              !isActive && isSpecial && "bg-[#202f36] border-2 border-[#374151]"
            )}
          >
            {({ isActive }) => (
              <Icon 
                size={isSpecial ? 24 : 20} // Aumentado de 22/18
                strokeWidth={isSpecial ? 2.5 : 2} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-white" : "text-[#9ca3af] group-hover:text-white"
                )}
              />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};