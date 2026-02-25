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
  PanelLeftOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

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
const COLLAPSED_WIDTH = 0;
const MIN_WIDTH = DEFAULT_WIDTH * 0.9;
const MAX_WIDTH = DEFAULT_WIDTH * 1.85;

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
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
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
    <aside 
      ref={sidebarRef}
      style={{ 
        width: `${currentWidth}px`,
        transform: isCollapsed ? `translateX(-${expandedWidth}px)` : 'translateX(0)',
        transition: isResizing ? 'none' : 'width 300ms ease-in-out, transform 300ms ease-in-out'
      }}
      className={cn(
        "relative sticky top-0 h-screen z-[50] flex flex-col shrink-0 will-change-[width,transform]",
        "bg-[#f5eeee] dark:bg-[#212121]" 
      )}
    >
      <button 
        onClick={toggleCollapse}
        style={{
          transform: isCollapsed ? `translateX(${expandedWidth + 24}px)` : 'translateX(0)',
          transition: 'transform 300ms ease-in-out'
        }}
        className={cn(
          "absolute top-8 z-[60] flex items-center justify-center cursor-pointer hover:scale-110",
          isCollapsed 
            ? "left-0 text-primary p-2 bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-xl shadow-lg border border-black/5 dark:border-white/10" 
            : "right-6 p-2 text-[var(--muted-foreground)] hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
        )}
        title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
      >
        {isCollapsed ? (
          <PanelLeftOpen size={24} strokeWidth={2.5} />
        ) : (
          <PanelLeftClose size={20} strokeWidth={2.5} />
        )}
      </button>

      <div className="flex flex-col h-full w-full overflow-hidden">
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

        <div className="px-6 pt-8 pb-6 flex items-center justify-between gap-2">
          <div className="w-10 h-10 rounded-[14px] bg-primary flex items-center justify-center shadow-lg shadow-primary/25 shrink-0 transition-transform hover:scale-105">
            <Sparkles className="text-primary-foreground w-5 h-5" strokeWidth={2.5} />
          </div>

          <div className="flex items-center gap-1 mr-10">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-[var(--muted-foreground)] hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors relative"
              >
                <Bell size={20} strokeWidth={2.5} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f5eeee] dark:border-[#212121]" />
              </button>

              {showNotifications && (
                <div className="absolute left-full top-0 ml-2 w-64 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl border border-border p-3 z-[70]">
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
          </div>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto mt-2">
          {navItems.map(({ icon: Icon, path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => cn(
                "group relative flex items-center gap-4 py-3.5 px-4 rounded-[20px] transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]" 
                  : "text-[var(--muted-foreground)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--foreground)]"
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={2.5} className="shrink-0" />
                  <span className={cn(
                    "text-[14px] font-bold tracking-wide truncate transition-all duration-300",
                    expandedWidth < 180 ? "opacity-0 w-0 absolute" : "opacity-100 w-auto relative"
                  )}>
                    {label}
                  </span>
                  {isActive && expandedWidth >= 180 && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white/80" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto mb-2">
          <div className="relative group bg-black/5 dark:bg-white/5 p-3 rounded-[24px] hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-[14px] bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <div className={cn(
                  "flex flex-col min-w-0 transition-opacity duration-200",
                  expandedWidth < 180 ? "opacity-0 w-0" : "opacity-100"
                )}>
                  <span className="text-[13px] font-extrabold truncate leading-tight">Ricardo</span>
                  <span className="text-[11px] text-primary font-bold leading-none mt-0.5">Lvl 42</span>
                </div>
              </div>
              {expandedWidth >= 180 && (
                <NavLink 
                  to="/configuracoes" 
                  className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors text-[var(--muted-foreground)]"
                >
                  <Settings size={18} strokeWidth={2.5} />
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};