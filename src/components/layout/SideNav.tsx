"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  CheckCircle2,
  Activity,
  Target,
  Settings,
  Plus,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: 'Início', icon: HomeIcon, path: '/' },
  { name: 'Tarefas', icon: CheckCircle2, path: '/tarefas' },
  { name: 'Hábitos', icon: Activity, path: '/habitos' },
  { name: 'Missões', icon: Target, path: '/missoes' },
  { name: 'Configurações', icon: Settings, path: '/configuracoes' },
];

const DEFAULT_WIDTH = 256; // w-64 is 256px
const MIN_WIDTH = DEFAULT_WIDTH * 0.7; // -30%
const MAX_WIDTH = DEFAULT_WIDTH * 1.3; // +30%

export const SideNav = () => {
  const location = useLocation();
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const isResizing = useRef(false);

  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;

    let newWidth = e.clientX;
    if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
    if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;

    setWidth(newWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div 
      className="h-full flex flex-col pt-12 pb-6 px-6 relative z-10 shrink-0 bg-transparent transition-none group/sidebar border-r border-white/5"
      style={{ width: `${width}px` }}
    >
      {/* Handle de redimensionamento */}
      <div 
        onMouseDown={startResizing}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#38BDF8]/30 transition-colors flex items-center justify-center group"
      >
        <div className="hidden group-hover:flex items-center justify-center w-4 h-8 bg-zinc-800 rounded-full border border-white/10 -mr-0.5">
          <GripVertical size={12} className="text-zinc-500" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-10 overflow-hidden whitespace-nowrap">
        <h1 className="text-3xl font-serif font-medium tracking-tight text-white">Néctar.</h1>
        <button className="p-1.5 rounded-[24px] hover:bg-white/10 text-zinc-400 transition-colors border border-white/5 shrink-0">
          <Plus size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-[24px] transition-all whitespace-nowrap",
                isActive 
                  ? "bg-[#38BDF8]/10 text-white font-semibold shadow-sm border border-[#38BDF8]/20" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
              )}
            >
              <item.icon 
                size={18} 
                strokeWidth={isActive ? 2 : 1.5} 
                style={{ color: isActive ? '#38BDF8' : 'currentColor' }} 
                className="shrink-0"
              />
              <span className="text-[13px]">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="pt-4 mt-auto flex items-center gap-3 cursor-pointer border-t border-white/5 overflow-hidden whitespace-nowrap">
        <div className="w-8 h-8 rounded-[24px] flex items-center justify-center text-[10px] font-bold bg-[#38BDF8]/20 text-[#38BDF8] shrink-0">RS</div>
        <span className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors truncate">Ricardo S.</span>
      </div>
    </div>
  );
};