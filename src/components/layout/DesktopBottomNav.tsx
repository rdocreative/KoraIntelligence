import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Crown, 
  ClipboardList,
  Target, 
  Bell, 
  Swords, 
  Users, 
  ShoppingBag, 
  Settings,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const leftNavItems = [
  { icon: LayoutDashboard, path: "/", label: "Início" },
  { icon: Crown, path: "/masterplan", label: "Masterplan" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos" },
  { icon: Target, path: "/metas", label: "Metas" },
  { icon: Swords, path: "/missoes", label: "Missões" },
  { icon: ShoppingBag, path: "/loja", label: "Loja" },
];

const rightNavItems = [
  { icon: Bell, path: "/lembretes", label: "Lembretes" },
  { icon: Users, path: "/comunidade", label: "Comunidade" },
  { icon: Settings, path: "/configuracoes", label: "Configurações" },
];

export const DesktopBottomNav = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4">
      <TooltipProvider delayDuration={0}>
        {/* PILL ESQUERDA (Navegação Principal) */}
        <nav className="bg-[#071412]/95 border border-[#2a4a46] rounded-full px-2 py-1.5 flex gap-1 backdrop-blur-md">
          {leftNavItems.map(({ icon: Icon, path, label }) => (
            <Tooltip key={path}>
              <TooltipTrigger asChild>
                <NavLink
                  to={path}
                  className={({ isActive }) => cn(
                    "flex items-center justify-center w-[38px] h-[38px] rounded-full text-[#5a8a85] transition-none outline-none",
                    isActive && "bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/40"
                  )}
                >
                  <Icon size={18} />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                sideOffset={10}
                className="bg-[#0f2220] border-[#2a4a46] rounded-[6px] px-[10px] py-[4px] text-[11px] font-bold text-[#e8f5f3] animate-none duration-0"
              >
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* FAB CENTRAL (Assistente IA) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-[#071412] shadow-[0_4px_20px_rgba(56,189,248,0.25)] transition-transform duration-200 hover:scale-105 hover:shadow-[0_6px_28px_rgba(56,189,248,0.4)]"
              style={{
                background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)"
              }}
              onClick={() => console.log("Abrir Assistente IA")}
            >
              <Brain size={24} strokeWidth={2.5} />
            </button>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            sideOffset={10}
            className="bg-[#0f2220] border-[#2a4a46] rounded-[6px] px-[10px] py-[4px] text-[11px] font-bold text-[#e8f5f3] animate-none duration-0"
          >
            Assistente IA
          </TooltipContent>
        </Tooltip>

        {/* PILL DIREITA (Utilitários) */}
        <nav className="bg-[#071412]/95 border border-[#2a4a46] rounded-full px-2 py-1.5 flex gap-1 backdrop-blur-md">
          {rightNavItems.map(({ icon: Icon, path, label }) => (
            <Tooltip key={path}>
              <TooltipTrigger asChild>
                <NavLink
                  to={path}
                  className={({ isActive }) => cn(
                    "flex items-center justify-center w-[38px] h-[38px] rounded-full text-[#5a8a85] transition-none outline-none",
                    isActive && "bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/40"
                  )}
                >
                  <Icon size={18} />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                sideOffset={10}
                className="bg-[#0f2220] border-[#2a4a46] rounded-[6px] px-[10px] py-[4px] text-[11px] font-bold text-[#e8f5f3] animate-none duration-0"
              >
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </div>
  );
};