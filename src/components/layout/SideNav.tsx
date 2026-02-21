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
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

const topItems = [
  { icon: LayoutDashboard, path: "/", label: "Início" },
  { icon: Crown, path: "/masterplan", label: "Masterplan" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos" },
  { icon: Target, path: "/metas", label: "Metas" },
];

const bottomItems = [
  { icon: Bell, path: "/lembretes", label: "Lembretes" },
  { icon: Swords, path: "/missoes", label: "Missões" },
  { icon: ShoppingBag, path: "/loja", label: "Loja" },
  { icon: Settings, path: "/configuracoes", label: "Configurações" },
];

export const SideNav = () => {
  return (
    <div className="fixed left-[24px] top-1/2 -translate-y-1/2 z-[100] flex flex-col items-center gap-3">
      {/* Pill Superior */}
      <nav className="bg-[#071412]/95 border border-[#2a4a46] rounded-full px-2 py-3 flex flex-col gap-1.5">
        {topItems.map(({ icon: Icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "flex items-center justify-center w-[44px] h-[44px] rounded-full text-[#5a8a85] transition-none",
              isActive && "bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/25"
            )}
          >
            <Icon size={24} />
          </NavLink>
        ))}
      </nav>

      {/* FAB Central */}
      <button 
        className="w-[58px] h-[58px] rounded-full bg-[#38bdf8] text-[#071412] flex items-center justify-center shadow-[0_6px_20px_rgba(56,189,248,0.3)] transition-none"
      >
        <Brain size={32} strokeWidth={2.5} />
      </button>

      {/* Pill Inferior */}
      <nav className="bg-[#071412]/95 border border-[#2a4a46] rounded-full px-2 py-3 flex flex-col gap-1.5">
        {bottomItems.map(({ icon: Icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "flex items-center justify-center w-[44px] h-[44px] rounded-full text-[#5a8a85] transition-none",
              isActive && "bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/25"
            )}
          >
            <Icon size={24} />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};