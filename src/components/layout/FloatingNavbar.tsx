"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Target, 
  Zap, 
  Settings, 
  LucideIcon,
  Layers,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Início", path: "/" },
  { icon: Target, label: "Metas", path: "/metas" },
  { icon: Layers, label: "Plan", path: "/masterplan" },
  { icon: Zap, label: "Missões", path: "/missoes" },
  { icon: Settings, label: "Ajustes", path: "/configuracoes" },
];

export const FloatingNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1.5 p-2 bg-[#040e0d]/90 backdrop-blur-3xl rounded-[32px] border border-[#4adbc8]/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 overflow-hidden group",
                isActive 
                  ? "bg-[#4adbc8] shadow-[0_0_20px_rgba(74,219,200,0.3)]" 
                  : "hover:bg-[#4adbc8]/10 text-white/40 hover:text-[#4adbc8]"
              )}
            >
              <item.icon 
                className={cn(
                  "w-6 h-6 transition-transform duration-300",
                  isActive ? "text-black scale-110" : "group-hover:scale-110"
                )} 
              />
              
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};