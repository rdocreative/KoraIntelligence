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
    <div className="fixed left-0 top-0 bottom-0 z-[100] flex flex-col bg-[#0D0F13] border-r border-[#252B38] w-[70px] py-6 items-center">
      <div className="flex flex-col items-center gap-4 w-full">
        {navItems.map(({ icon: Icon, path, label, isSpecial }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "group relative flex items-center justify-center transition-all duration-200 w-full py-3",
              isActive && "bg-[#1CB0F614] border-l-[3px] border-[#1CB0F6]",
              !isActive && "border-l-[3px] border-transparent"
            )}
          >
            {({ isActive }) => (
              <Icon 
                size={isSpecial ? 26 : 22}
                className={cn(
                  "transition-colors",
                  isActive ? "text-[#1CB0F6]" : "text-[#3D4560] group-hover:text-[#F0F2F5]"
                )}
              />
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};