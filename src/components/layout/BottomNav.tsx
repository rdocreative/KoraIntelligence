import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Crown, 
  ClipboardList,
  Target, 
  Swords, 
  Users, 
  ShoppingBag, 
  Bell, 
  Settings,
  User,
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
  { icon: LayoutDashboard, path: "/", label: "Dashboard" },
  { icon: Crown, path: "/masterplan", label: "Masterplan" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos" },
  { icon: Target, path: "/metas", label: "Metas" },
  { icon: Swords, path: "/missoes", label: "Missões" },
  { icon: Users, path: "/comunidade", label: "Comunidade" },
  { icon: ShoppingBag, path: "/loja", label: "Loja" },
];

const rightNavItems = [
  { icon: Bell, path: "/lembretes", label: "Notificações" },
  { icon: Settings, path: "/configuracoes", label: "Configurações" },
  { icon: User, path: "/perfil", label: "Perfil" },
];

export const BottomNav = () => {
  return (
    <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 select-none">
      <TooltipProvider delayDuration={0}>
        {/* PILL ESQUERDA */}
        <nav className="bg-[#071412]/95 border border-[#2a4a46] rounded-full px-2 py-1.5 flex gap-1 backdrop-blur-md">
          {leftNavItems.map(({ icon: Icon, path, label }) => (
            <Tooltip key={path}>
              <TooltipTrigger asChild>
                <NavLink
                  to={path}
                  className={({ isActive }) => cn(
                    "flex items-center justify-center w-[38px] h-[38px] rounded-full text-[#5a8a85] hover:text-[#e8f5f3] transition-none outline-none",
                    isActive && "bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/25"
                  )}
                >
                  <Icon size={19} />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                sideOffset={12}
                className="bg-[#0f2220] border-[#2a4a46] rounded-[6px] px-[10px] py-[4px] text-[11px] font-bold text-[#e8f5f3] animate-none duration-0"
              >
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* FAB CENTRAL - ASSISTENTE IA */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#38bdf8] via-[#0ea5e9] to-[#0284c7] flex items-center justify-center shadow-[0_4px_20px_rgba(56,189,248,0.4)] hover:scale-[1.08] hover:shadow-[0_6px_28px_rgba(56,189,248,0.6)] active:scale-95 transition-transform duration-200 outline-none"
            >
              <Brain size={26} className="text-[#071412] fill-[#071412]" strokeWidth={1.5} />
            </button>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            sideOffset={12}
            className="bg-[#0f2220] border-[#2a4a46] rounded-[6px] px-[10px] py-[4px] text-[11px] font-bold text-[#e8f5f3] animate-none duration-0"
          >
            Assistente IA
          </TooltipContent>
        </Tooltip>

        {/* PILL DIREITA */}
        <nav className="bg-[#071412]/95 border border-[#2a4a46] rounded-full px-2 py-1.5 flex gap-1 backdrop-blur-md">
          {rightNavItems.map(({ icon: Icon, path, label }) => (
            <Tooltip key={path}>
              <TooltipTrigger asChild>
                <NavLink
                  to={path}
                  className={({ isActive }) => cn(
                    "flex items-center justify-center w-[38px] h-[38px] rounded-full text-[#5a8a85] hover:text-[#e8f5f3] transition-none outline-none",
                    isActive && "bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/25"
                  )}
                >
                  <Icon size={19} />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                sideOffset={12}
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