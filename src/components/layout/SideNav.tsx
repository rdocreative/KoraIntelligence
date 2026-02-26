"use client";

import React from "react";
import { NavLink } from "react-router-dom";
import {
  MessageSquare,
  ListTodo,
  Target,
  Trophy,
  ShoppingBag,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { icon: MessageSquare, path: "/", label: "Início" },
  { icon: ListTodo, path: "/tarefas", label: "Tarefas" },
  { icon: Target, path: "/habitos", label: "Hábitos" },
  { icon: Trophy, path: "/missoes", label: "Missões" },
  { icon: ShoppingBag, path: "/loja", label: "Loja" },
];

export const SideNav = () => {
  return (
    <aside 
      className="w-[240px] h-screen sticky top-0 bg-white border-r border-[#E5E5E5] flex flex-col py-6 px-4 shrink-0 z-[50] transition-all duration-300"
    >
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8 px-2">
        <NavLink to="/perfil" className="block mb-3 transition-transform hover:scale-105 duration-200">
          <div className="w-[48px] h-[48px] rounded-full overflow-hidden border border-[#E5E5E5]">
            <img 
              src="https://github.com/shadcn.png" 
              alt="Ricardo" 
              className="w-full h-full object-cover"
            />
          </div>
        </NavLink>
        <div className="text-center">
          <h2 className="font-serif font-medium text-[#1A1A1A] text-[18px] uppercase tracking-wide leading-tight">
            RICARDO
          </h2>
          <p className="font-sans text-[12px] text-[#6B6B6B] mt-0.5">
            Nível 42
          </p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-2">
        {mainNavItems.map(({ icon: Icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => cn(
              "group relative flex items-center h-[48px] px-4 rounded-[12px] transition-all duration-200 overflow-hidden",
              isActive 
                ? "text-[#9D4EDD]" 
                : "text-[#1A1A1A] hover:bg-[#F8F8F6]"
            )}
            style={({ isActive }) => isActive ? {
              background: "linear-gradient(135deg, rgba(157,78,221,0.12), rgba(255,107,74,0.12))"
            } : {}}
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Border */}
                {isActive && (
                  <div className="absolute left-0 top-0 w-[3px] h-full bg-[#9D4EDD]" />
                )}
                
                <Icon 
                  size={20} 
                  className={cn(
                    "shrink-0 mr-3 transition-transform duration-200 group-hover:scale-[1.05]",
                    isActive ? "text-[#9D4EDD]" : "text-[#6B6B6B]"
                  )} 
                />
                <span className="text-[15px] font-sans font-normal truncate">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Spacer and Divider */}
      <div className="mt-10 mb-2 px-4">
        <div className="h-[1px] bg-[#E5E5E5] w-full" />
      </div>

      {/* Bottom Section - Settings */}
      <div className="mt-auto">
        <NavLink
          to="/configuracoes"
          className={({ isActive }) => cn(
            "group relative flex items-center h-[48px] px-4 rounded-[12px] transition-all duration-200 overflow-hidden",
            isActive 
              ? "text-[#9D4EDD]" 
              : "text-[#1A1A1A] hover:bg-[#F8F8F6]"
          )}
          style={({ isActive }) => isActive ? {
            background: "linear-gradient(135deg, rgba(157,78,221,0.12), rgba(255,107,74,0.12))"
          } : {}}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute left-0 top-0 w-[3px] h-full bg-[#9D4EDD]" />
              )}
              <Settings 
                size={20} 
                className={cn(
                  "shrink-0 mr-3 transition-transform duration-200 group-hover:scale-[1.05]",
                  isActive ? "text-[#9D4EDD]" : "text-[#6B6B6B]"
                )} 
              />
              <span className="text-[15px] font-sans font-normal truncate">
                Configurações
              </span>
            </>
          )}
        </NavLink>
      </div>
    </aside>
  );
};