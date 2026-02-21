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
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainNavItems = [
  { icon: LayoutDashboard, path: "/", label: "Início" },
  { icon: Crown, path: "/masterplan", label: "Masterplan" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos" },
  { icon: Target, path: "/metas", label: "Metas" },
  { icon: Bell, path: "/lembretes", label: "Lembretes" },
  { icon: Swords, path: "/missoes", label: "Missões" },
  { icon: Users, path: "/comunidade", label: "Comunidade" },
  { icon: ShoppingBag, path: "/loja", label: "Loja" },
];

const bottomNavItems = [
  { icon: Settings, path: "/configuracoes", label: "Configurações" },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[52px] bg-[#050f0e] flex flex-col items-center py-3 z-[100] border-none select-none">
      {/* LOGO NO TOPO */}
      <div className="w-full flex justify-center pb-2 mb-2 border-b border-[#1e3a36]">
        <div className="w-[34px] h-[34px] flex items-center justify-center text-[#38bdf8]">
          <Zap size={20} fill="currentColor" strokeWidth={1} />
        </div>
      </div>

      <TooltipProvider delayDuration={0}>
        {/* ITENS PRINCIPAIS */}
        <nav className="flex flex-col gap-2 w-full items-center flex-1">
          {mainNavItems.map(({ icon: Icon, path, label }) => (
            <Tooltip key={path}>
              <TooltipTrigger asChild>
                <NavLink
                  to={path}
                  className={({ isActive }) => cn(
                    "flex items-center justify-center w-[34px] h-[34px] rounded-[10px] text-[#3a6a65] hover:text-[#e8f5f3] transition-none outline-none",
                    isActive && "text-[#38bdf8] bg-[#38bdf8]/10"
                  )}
                >
                  <Icon size={18} />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                sideOffset={10}
                className="bg-[#0f2220] border-[#2a4a46] rounded-[6px] px-[10px] py-[4px] text-[11px] font-semibold text-[#e8f5f3] animate-none duration-0"
              >
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* CONFIGURAÇÕES NO RODAPÉ */}
        <div className="w-full flex flex-col items-center gap-2 pt-2 border-t border-[#1e3a36]">
          {bottomNavItems.map(({ icon: Icon, path, label }) => (
            <Tooltip key={path}>
              <TooltipTrigger asChild>
                <NavLink
                  to={path}
                  className={({ isActive }) => cn(
                    "flex items-center justify-center w-[34px] h-[34px] rounded-[10px] text-[#3a6a65] hover:text-[#e8f5f3] transition-none outline-none",
                    isActive && "text-[#38bdf8] bg-[#38bdf8]/10"
                  )}
                >
                  <Icon size={18} />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                sideOffset={10}
                className="bg-[#0f2220] border-[#2a4a46] rounded-[6px] px-[10px] py-[4px] text-[11px] font-semibold text-[#e8f5f3] animate-none duration-0"
              >
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </aside>
  );
};