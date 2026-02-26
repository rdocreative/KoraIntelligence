"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  MessageSquare,
  ListTodo,
  Target,
  Trophy,
  ShoppingBag,
  Settings,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: MessageSquare, path: "/", label: "Início" },
  { icon: ListTodo, path: "/tarefas", label: "Tarefas" },
  { icon: Target, path: "/habitos", label: "Hábitos" },
  { icon: Trophy, path: "/missoes", label: "Missões" },
  { icon: ShoppingBag, path: "/loja", label: "Loja" },
];

const DEFAULT_WIDTH = 240;
const COLLAPSED_WIDTH = 0;
const MIN_WIDTH = 200; // Reduzi um pouco para dar mais flexibilidade

export const SideNav = () => {
  const [expandedWidth, setExpandedWidth] = useState(() => {
    const saved = localStorage.getItem("kora-sidebar-width");
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const currentWidth = isCollapsed ? COLLAPSED_WIDTH : expandedWidth;
  
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      const maxPossibleWidth = window.innerWidth * 0.35;
      
      if (newWidth >= MIN_WIDTH && newWidth <= maxPossibleWidth) {
        setExpandedWidth(newWidth);
      }
    }
  }, [isResizing]);

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
        localStorage.setItem("kora-sidebar-width", expandedWidth.toString());
      }
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing, expandedWidth, isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) setShowNotifications(false);
  };

  return (
    <>
      <div 
        className={cn(
          "fixed top-8 left-0 z-[60] transition-all duration-300",
          isCollapsed ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0 pointer-events-none"
        )}
      >
        <button 
          onClick={toggleCollapse}
          className="bg-white/90 dark:bg-white/10 backdrop-blur-xl p-2 rounded-r-xl shadow-lg border-y border-r border-black/5 dark:border-white/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
          title="Expandir Menu"
        >
          <PanelLeftOpen size={24} strokeWidth={2} />
        </button>
      </div>

      <aside 
        ref={sidebarRef}
        style={{ 
          width: `${currentWidth}px`,
          maxWidth: '35vw',
          transition: isResizing ? 'none' : 'width 300ms ease-in-out'
        }}
        className={cn(
          "relative sticky top-0 h-screen z-[50] flex flex-col shrink-0 will-change-[width] overflow-hidden",
          "bg-[#f5eeee] dark:bg-[#212121]" 
        )}
      >
        {/* Removido min-w-240 para evitar cortes internos */}
        <div className="flex flex-col h-full w-full">
          
          {!isCollapsed && (
            <div 
              onMouseDown={startResizing}
              className={cn(
                "absolute right-0 top-0 bottom-0 w-3 cursor-col-resize group z-[60] flex items-center justify-center -mr-1.5",
                isResizing && "w-screen fixed left-0 right-0 z-[9999] bg-transparent"
              )}
            >
              <div className={cn(
                "w-[3px] h-12 rounded-full transition-all duration-200 bg-transparent group-hover:bg-primary/20 absolute right-1.5",
                isResizing && "bg-primary/40 h-24"
              )} />
            </div>
          )}

          <div className="px-5 pt-8 pb-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <NavLink to="/perfil" className="block relative group shrink-0">
                <div className="relative p-[2px] rounded-full ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all shadow-sm">
                  <img 
                    src="https://github.com/shadcn.png" 
                    alt="User Avatar" 
                    className="w-10 h-10 min-w-[32px] min-h-[32px] rounded-full border-2 border-white dark:border-[#212121] object-cover"
                  />
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-[#f5eeee] dark:border-[#212121] rounded-full"></span>
                </div>
              </NavLink>

              <div className={cn(
                 "transition-opacity duration-200 flex flex-col gap-1",
                 expandedWidth < 180 ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
              )}>
                <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full tracking-tighter uppercase shrink-0 cursor-help select-none whitespace-nowrap self-start" title="Nível Atual">
                  LVL 42
                </span>
                {/* XP Progress Bar */}
                <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden w-[80px]">
                  <div className="h-full bg-primary rounded-full w-[65%]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-[var(--muted-foreground)] hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors relative"
                  title="Notificações"
                >
                  <Bell size={18} strokeWidth={2} />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-[#f5eeee] dark:border-[#212121]" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl border border-border p-3 z-[70] animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b">
                      <span className="font-bold text-sm">Notificações</span>
                      <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">3 novas</span>
                    </div>
                    <div className="text-xs p-2 rounded-lg bg-secondary/50">
                      <p className="font-medium">Meta Concluída!</p>
                      <p className="text-muted-foreground mt-0.5">Você completou "Beber Água".</p>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={toggleCollapse}
                className="p-2 text-[var(--muted-foreground)] hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                title="Recolher Menu"
              >
                <PanelLeftClose size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

          <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto mt-2 overflow-x-hidden">
            {navItems.map(({ icon: Icon, path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => cn(
                  "group relative flex items-center gap-4 py-3.5 px-4 rounded-[20px] transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-[var(--muted-foreground)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--foreground)]"
                )}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} strokeWidth={2} className="shrink-0" />
                    <span className={cn(
                      "text-[14px] font-bold tracking-wide truncate transition-all duration-300",
                      expandedWidth < 180 ? "opacity-0 w-0 absolute" : "flex-1 opacity-100 relative"
                    )}>
                      {label}
                    </span>
                    {isActive && expandedWidth >= 180 && (
                      <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 mt-auto mb-4 shrink-0">
             <div className="h-[1px] bg-black/5 dark:bg-white/5 mx-4 mb-4" />
             {!isCollapsed && expandedWidth >= 180 && (
                <NavLink
                  to="/configuracoes"
                  className="flex items-center gap-4 py-3.5 px-4 rounded-[20px] text-[var(--muted-foreground)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--foreground)] transition-all overflow-hidden"
                >
                  <Settings size={20} strokeWidth={2} className="shrink-0" />
                  <span className="text-[14px] font-bold tracking-wide truncate">Configurações</span>
                </NavLink>
             )}
          </div>
        </div>
      </aside>
    </>
  );
};