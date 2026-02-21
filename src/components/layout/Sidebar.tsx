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
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, path: "/", label: "Início" },
  { icon: Crown, path: "/masterplan", label: "Masterplan" },
  { icon: ClipboardList, path: "/habitos", label: "Hábitos" },
  { icon: Target, path: "/metas", label: "Metas" },
  { icon: Bell, path: "/lembretes", label: "Lembretes" },
  { icon: Swords, path: "/missoes", label: "Missões" },
  { icon: Users, path: "/comunidade", label: "Comunidade" },
  { icon: ShoppingBag, path: "/loja", label: "Loja" },
  { icon: Settings, path: "/configuracoes", label: "Configurações" },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-[52px] bg-[#050f0e] flex flex-col items-center py-3 z-50">
      <nav className="flex flex-col gap-2 w-full items-center">
        {navItems.map(({ icon: Icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) => cn(
              "flex items-center justify-center w-8 h-8 rounded-lg text-[#3a6a65] hover:text-[#e8f5f3] transition-none",
              isActive && "text-[#38bdf8] bg-[#38bdf8]/10"
            )}
          >
            <Icon size={20} strokeWidth={2} />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};