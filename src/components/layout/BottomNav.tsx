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
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const leftItems = [
  { icon: LayoutDashboard, path: "/", label: "Início" },
  { icon: Crown, path: "/masterplan", label: "Masterplan" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos" },
  { icon: Target, path: "/metas", label: "Metas" },
];

const rightItems = [
  { icon: Bell, path: "/lembretes", label: "Lembretes" },
  { icon: Swords, path: "/missoes", label: "Missões" },
  { icon: ShoppingBag, path: "/loja", label: "Loja" },
  { icon: Settings, path: "/configuracoes", label: "Configurações" },
];

export const BottomNav = () => {
  return (
    <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2">
      {/* Pill Esquerda */}
      <nav className="bg-[#071412]/95 border border-[#2a4a46] rounded-full px-2 py-1.5 flex gap-1">
        {leftItems.map(({ icon: Icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "flex items-center justify-center w-[34px] h-[34px] rounded-full text-[#5a8a85] transition-none",
              isActive && "bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/25"
            )}
          >
            <Icon size={18} />
          </NavLink>
        ))}
      </nav>

      {/* FAB Central */}
      <button 
        className="w-[44px] h-[44px] rounded-full bg-[#38bdf8] text-[#071412] flex items-center justify-center shadow-[0_4px_16px_rgba(56,189,248,0.3)] transition-none"
      >
        <Plus size={24} strokeWidth={3} />
      </button>

      {/* Pill Direita */}
      <nav className="bg-[#071412]/95 border border-[#2a4a46] rounded-full px-2 py-1.5 flex gap-1">
        {rightItems.map(({ icon: Icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "flex items-center justify-center w-[34px] h-[34px] rounded-full text-[#5a8a85] transition-none",
              isActive && "bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/25"
            )}
          >
            <Icon size={18} />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};