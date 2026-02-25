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
  PanelLeftOpen,
  ChevronRight
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
const COLLAPSED_WIDTH = 48; // Largura mínima apenas para o botão
const MIN_WIDTH = DEFAULT_WIDTH * 0.9;
const MAX_WIDTH = DEFAULT_WIDTH * 1.85;

export const SideNav = () => {
  // Estado para largura personalizada (modo expandido)
  const [expandedWidth, setExpandedWidth] = useState(() => {
    const saved = localStorage.getItem("kora-sidebar-width");
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });

  // Estado de colapso
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Largura atual baseada no estado
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
    // Fecha notificações ao colapsar para evitar popups flutuando
    if (!isCollapsed) setShowNotifications(false);
  };

  return (
    <aside 
      ref={sidebarRef}
      style={{ 
        width: `${currentWidth}px`,
        // Remove a transição durante o redimensionamento para máxima fluidez
        transition: isResizing ? 'none' : 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      className="sticky top-0 h-screen z-[50] flex flex-col bg-[#f5eeee] dark:bg-[#212121] rounded-r-[40px] shadow-2xl shrink-0 will-change-[width]"
    >
      {/* Resizer Handle (apenas se não estiver colapsado) */}
      {!isCollapsed && (
        <div 
          onMouseDown={startResizing}
          className={cn(
            "absolute right-0 top-0 bottom-0 w-3 cursor-col-resize group z-[60] flex items-center justify-center -mr-1.5 hover:bg-transparent",
            isResizing && "w-screen fixed left-0 right-0 z-[9999] cursor-col-resize bg-transparent" // Overlay invisível para capturar mouse
          )}
        >
          {/* Visual indicator of handle */}
          <div className={cn(
            "w-[3px] h-12 rounded-full transition-all duration-200 bg-transparent group-hover:bg-primary/20 absolute right-1.5",
            isResizing && "bg-primary/40 h-24"
          )} />
        </div>
      )}

      {/* Header com Logo e Ações */}
      <div className={cn(
        "flex items-center transition-all duration-300 relative",
        isCollapsed ? "justify-center pt-6 px-0" : "px-6 pt-8 pb-6 justify-between gap-2"
      )}>
        {/* Logo Icon - Oculto quando colapsado */}
        <div className={cn(
          "w-10 h-10 rounded-[14px] bg-primary flex items-center justify-center shadow-lg shadow-primary/25 shrink-0 transition-all duration-300",
          isCollapsed ? "hidden opacity-0 scale-0" : "flex opacity-100 scale-100 hover:scale-105"
        )}>
          <Sparkles className="text-primary-foreground w-5 h-5" />
        </div>

        {/* Botões de Ação */}
        <div className={cn(
          "flex items-center gap-1 transition-all duration-300",
          isCollapsed && "w-full justify-center"
        )}>
          {/* Botão de Notificações - Oculto quando colapsado */}
          {!isCollapsed && (
            <div className="relative animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-[var(--muted-foreground)] hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors relative"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f5eeee] dark:border-[#212121]" />
              </button>

              {/* Dropdown de Notificações */}
              {showNotifications && (
                <div className="absolute left-full top-0 ml-2 w-64 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl border border-border p-3 z-[70] animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b">
                    <span className="font-bold text-sm">Notificações</span>
                    <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">3 novas</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                      <p className="font-medium">Meta Concluída!</p>
                      <p className="text-muted-foreground mt-0.5">Você completou "Beber Água".</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botão Collapse/Expand - Único visível quando colapsado */}
          <button 
            onClick={toggleCollapse}
            className={cn(
              "p-2 text-[var(--muted-foreground)] hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors",
              isCollapsed && "bg-transparent hover:bg-primary/10 text-primary"
            )}
            title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
          >
            {isCollapsed ? <ChevronRight size={24} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
      </div>

      {/* Navegação Principal - Oculta quando colapsado */}
      {!isCollapsed && (
        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto scrollbar-none mt-2 animate-in fade-in slide-in-from-left-4 duration-300">
          {navItems.map(({ icon: Icon, path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => cn(
                "group relative flex items-center gap-4 py-3.5 px-4 rounded-[20px] transition-all duration-300 ease-out overflow-hidden",
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
                    currentWidth < 180 ? "opacity-0 w-0 absolute" : "opacity-100 w-auto relative"
                  )}>
                    {label}
                  </span>
                  
                  {isActive && currentWidth >= 180 && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}

      {/* Rodapé com Usuário - Oculto quando colapsado */}
      {!isCollapsed && (
        <div className="p-4 mt-auto mb-2 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
          <div className="relative group bg-black/5 dark:bg-white/5 p-3 rounded-[24px] hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-[14px] bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <div className={cn(
                  "flex flex-col min-w-0 transition-opacity duration-200",
                  currentWidth < 180 ? "opacity-0 w-0" : "opacity-100"
                )}>
                  <span className="text-[13px] font-extrabold truncate leading-tight">Ricardo</span>
                  <span className="text-[11px] text-primary font-bold leading-none mt-0.5">Lvl 42</span>
                </div>
              </div>
              
              {currentWidth >= 180 && (
                <NavLink 
                  to="/configuracoes" 
                  className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors text-[var(--muted-foreground)]"
                >
                  <Settings size={18} />
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};