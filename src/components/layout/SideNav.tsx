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
    <div className="fixed left-[18px] top-1/2 -translate-y-1/2 z-[100] flex">
      <nav className="flex flex-col items-center gap-3 bg-background p-2 rounded-[32px] w-[56px]">
        {navItems.map(({ icon: Icon, path, label, isSpecial }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "group relative flex items-center justify-center rounded-full transition-all duration-200 shrink-0",
              !isSpecial && "w-[44px] h-[44px]",
              isSpecial && "w-[56px] h-[56px] my-2",
              
              isActive && !isSpecial && "bg-primary shadow-[0_4px_0_0_var(--primary-dark)]",
              !isActive && !isSpecial && "bg-transparent hover:bg-[var(--panel)]",
              
              isSpecial && "bg-primary shadow-[0_4px_0_0_var(--primary-dark)]",
              !isActive && isSpecial && "brightness-95 hover:brightness-100"
            )}
          >
            {({ isActive }) => (
              <Icon 
                size={isSpecial ? 24 : 20}
                strokeWidth={isSpecial ? 2.5 : 2} 
                className={cn(
                  "transition-colors",
                  (isActive || isSpecial) ? "text-primary-foreground" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                )}
              />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};