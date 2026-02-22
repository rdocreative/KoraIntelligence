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
  { icon: LayoutDashboard, path: "/", label: "Início", color: "text-card-blue" },
  { icon: Crown, path: "/masterplan", label: "Masterplan", color: "text-card-purple" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos", color: "text-card-orange" },
  { icon: Target, path: "/metas", label: "Metas", color: "text-card-green" },
  { icon: Brain, path: "/brain", label: "Sistema", isSpecial: true, color: "text-white" },
  { icon: Bell, path: "/lembretes", label: "Lembretes", color: "text-card-red" },
  { icon: Swords, path: "/missoes", label: "Missões", color: "text-card-blue" },
  { icon: ShoppingBag, path: "/loja", label: "Loja", color: "text-card-orange" },
  { icon: Settings, path: "/configuracoes", label: "Configurações", color: "text-duo-gray" },
];

export const SideNav = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[80px] bg-duo-sidebar border-r-2 border-duo-gray hidden md:flex flex-col items-center py-6 z-50">
      <div className="mb-8">
        <img src="/placeholder.svg" className="w-10 h-10 rounded-xl" alt="Logo" />
      </div>
      
      <nav className="flex flex-col items-center gap-4 w-full px-2">
        {navItems.map(({ icon: Icon, path, label, isSpecial, color }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "group relative flex items-center justify-center rounded-xl w-full aspect-square transition-all duration-200",
              isActive 
                ? "bg-duo-gray/40 border-2 border-duo-gray/50 shadow-3d-panel translate-y-[1px]" 
                : "hover:bg-duo-gray/20 hover:-translate-y-[2px]",
              isSpecial && "bg-card-blue shadow-3d-blue border-b-0 hover:bg-card-blue-shadow"
            )}
          >
            <Icon 
              size={26} 
              strokeWidth={2.5} 
              className={cn(
                "transition-colors",
                isSpecial ? "text-white" : color,
                // If not active and not special, dull the color slightly
                // isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
              )}
            />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};