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

const navItems = [
  { icon: LayoutDashboard, path: "/", label: "Início" },
  { icon: Crown, path: "/masterplan", label: "Masterplan" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos" },
  { icon: Target, path: "/metas", label: "Metas" },
  { icon: Brain, path: "/brain", label: "Sistema", isSpecial: true }, // Item de destaque
  { icon: Bell, path: "/lembretes", label: "Lembretes" },
  { icon: Swords, path: "/missoes", label: "Missões" },
  { icon: ShoppingBag, path: "/loja", label: "Loja" },
  { icon: Settings, path: "/configuracoes", label: "Configurações" },
];

export const SideNav = () => {
  return (
    <div className="fixed left-[24px] top-1/2 -translate-y-1/2 z-[100]">
      <nav className="bg-[#071412]/95 border border-[#2a4a46] rounded-full px-2 py-4 flex flex-col items-center gap-2 shadow-2xl backdrop-blur-sm">
        {navItems.map(({ icon: Icon, path, label, isSpecial }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "flex items-center justify-center rounded-full transition-all duration-200",
              // Estilo padrão
              !isSpecial && "w-[44px] h-[44px] text-[#5a8a85] hover:text-[#38bdf8] hover:bg-[#38bdf8]/5",
              !isSpecial && isActive && "bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20",
              // Estilo do item especial (Cérebro)
              isSpecial && "w-[54px] h-[54px] bg-[#38bdf8] text-[#071412] my-1 shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:scale-105 active:scale-95",
              isSpecial && isActive && "ring-2 ring-offset-2 ring-offset-[#071412] ring-[#38bdf8]"
            )}
          >
            <Icon size={isSpecial ? 28 : 22} strokeWidth={isSpecial ? 2.5 : 2} />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};