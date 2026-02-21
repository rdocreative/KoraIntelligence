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
    <div className="fixed left-[20px] top-1/2 -translate-y-1/2 z-[100]">
      <nav 
        className="rounded-full px-1.5 py-3.5 flex flex-col items-center gap-1.5 shadow-2xl backdrop-blur-sm border-none"
        style={{
          background: 'linear-gradient(135deg, #0d1716 0%, #080f0e 60%, #050f0e 100%)'
        }}
      >
        {navItems.map(({ icon: Icon, path, label, isSpecial }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "flex items-center justify-center rounded-full transition-all duration-200",
              // Tamanhos reduzidos em 10% (44px -> 40px, 54px -> 49px)
              !isSpecial && "w-[40px] h-[40px] text-[#5a8a85]",
              isSpecial && "w-[49px] h-[49px] my-1 hover:scale-105 active:scale-95",
              isActive && !isSpecial && "border border-[#1a2e2c]"
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
                  background: 'linear-gradient(135deg, #0a1a18 0%, #070d0c 100%)',
                  color: '#38bdf8'
                };
              }
              return {};
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLElement;
              const isActive = target.classList.contains('active');
              if (!isSpecial && !isActive) {
                target.style.background = 'linear-gradient(135deg, #0a1a18 0%, #070d0c 100%)';
                target.style.color = '#38bdf8';
              }
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement;
              const isActive = target.classList.contains('active');
              if (!isSpecial && !isActive) {
                target.style.background = 'transparent';
                target.style.color = '#5a8a85';
              }
            }}
          >
            {/* Ícones reduzidos (22 -> 20, 28 -> 25) */}
            <Icon size={isSpecial ? 25 : 20} strokeWidth={isSpecial ? 2.5 : 2} />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};