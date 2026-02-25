"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Brain,
  User,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { icon: LayoutDashboard, path: "/", label: "Início" },
  { icon: Crown, path: "/masterplan", label: "Masterplan" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos" },
  { icon: Target, path: "/metas", label: "Metas" },
  { icon: Brain, path: "/brain", label: "Sistema" },
  { icon: Bell, path: "/lembretes", label: "Lembretes" },
  { icon: Swords, path: "/missoes", label: "Missões" },
  { icon: ShoppingBag, path: "/loja", label: "Loja" },
];

const DEFAULT_WIDTH = 240;
const MIN_WIDTH = DEFAULT_WIDTH * 0.9;
const MAX_WIDTH = DEFAULT_WIDTH * 1.85;
const COLLAPSED_WIDTH = 88;

export const SideNav = () => {
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem("kora-sidebar-width");
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("kora-sidebar-collapsed");
    return saved === "true";
  });

  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("kora-sidebar-collapsed", String(newState));
  };

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isCollapsed) return;
    setIsResizing(true);
  }, [isCollapsed]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && !isCollapsed) {
      const newWidth = e.clientX;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth);
      }
    }
  }, [isResizing, isCollapsed]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
      if (!isCollapsed) {
        localStorage.setItem("kora-sidebar-width", width.toString());
      }
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing, width, isCollapsed]);

  const currentWidth = isCollapsed ? COLLAPSED_WIDTH : width;

  return (
    <aside 
      ref={sidebarRef}
      style={{ width: `${currentWidth}px` }}
      className={cn(
        "sticky top-0 h-screen z-[50] flex flex-col bg-[#f5eeee] dark:bg-[#212121] rounded-r-[40px] shadow-2xl shrink-0 transition-[width,background-color,shadow] duration-300 ease-in-out",
        isResizing && "transition-none"
      )}
    >
      {/* Resizer Handle */}
      {!isCollapsed && (
        <div 
          onMouseDown={startResizing}
          className={cn(
            "absolute right-0 top-0 bottom-0 w-2 cursor-col-resize group z-[60] flex items-center justify-center",
            isResizing && "bg-primary/5"
          )}
        >
          <div className={cn(
            "w-[2px] h-12 rounded-full transition-all duration-200 bg-transparent group-hover:bg-primary/20",
            isResizing && "bg-primary/40 h-24"
          )} />
        </div>
      )}

      {/* Header com Logo e Botões de Ação */}
      <div className="px-6 pt-8 pb-6 flex items-center justify-between">
        <div className={cn(
          "flex items-center gap-3 transition-opacity duration-300",
          isCollapsed ? "opacity-0 w-0" : "opacity-100"
        )}>
          <div className="w-10 h-10 rounded-[14px] bg-primary flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
            <Sparkles className="text-primary-foreground w-5 h-5" />
          </div>
        </div>

        <div className={cn(
          "flex items-center gap-1",
          isCollapsed && "flex-col w-full items-center gap-3"
        )}>
          {/* Botão de Notificação */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[var(--muted-foreground)] hover:text-primary relative group">
                <Bell size={20} strokeWidth={2} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f5eeee] dark:border-[#212121]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl">
              <DropdownMenuLabel className="px-4 py-2 font-bold">Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                <DropdownMenuItem className="p-4 rounded-xl cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm">Missão Completa!</span>
                    <span className="text-xs text-muted-foreground">Você concluiu a tarefa diária de Meditação.</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-4 rounded-xl cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm">Novo Item na Loja</span>
                    <span className="text-xs text-muted-foreground">O set Lendário de Armadura está disponível.</span>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Botão de Recolher/Expandir */}
          <button 
            onClick={toggleCollapse}
            className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[var(--muted-foreground)] hover:text-primary group"
            title={isCollapsed ? "Expandir" : "Recolher"}
          >
            {isCollapsed ? (
              <PanelLeft size={20} strokeWidth={2} />
            ) : (
              <PanelLeftClose size={20} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto scrollbar-none">
        {navItems.map(({ icon: Icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => cn(
              "group relative flex items-center rounded-[20px] transition-all duration-300 ease-out",
              isCollapsed ? "justify-center p-3.5" : "gap-4 px-4 py-3.5",
              isActive 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]" 
                : "text-[var(--muted-foreground)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--foreground)]"
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                <span className={cn(
                  "text-[14px] font-bold tracking-wide truncate transition-all duration-300",
                  isCollapsed ? "opacity-0 w-0 absolute left-20" : "opacity-100"
                )}>
                  {label}
                </span>
                
                {isActive && !isCollapsed && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                )}
                
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-800 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] whitespace-nowrap">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Rodapé com Usuário Estilo Card */}
      <div className={cn(
        "p-4 mt-auto mb-2 overflow-hidden transition-all duration-300",
        isCollapsed ? "opacity-0 h-0 pointer-events-none" : "opacity-100"
      )}>
        <div className="relative group bg-black/5 dark:bg-white/5 p-3 rounded-[24px] hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-[14px] bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                <User size={18} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-extrabold truncate leading-tight">Ricardo</span>
                <span className="text-[11px] text-primary font-bold leading-none mt-0.5">Lvl 42</span>
              </div>
            </div>
            
            <NavLink 
              to="/configuracoes" 
              className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors text-[var(--muted-foreground)]"
            >
              <Settings size={18} />
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
};