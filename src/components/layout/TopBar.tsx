"use client";

import React from "react";
import { useLocation } from "react-router-dom";
import { 
  ClipboardList, 
  LayoutDashboard, 
  Target, 
  Settings as SettingsIcon, 
  User,
  Bell,
  Search,
  Zap,
  Star,
  ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";

const TopBar = () => {
  const location = useLocation();

  // Mapeamento dinâmico de títulos e ícones baseado na rota
  const getPageInfo = () => {
    const path = location.pathname;
    switch (path) {
      case "/habitos":
      case "/tarefas":
        return { 
          title: "Hábitos", 
          subtitle: "Seus hábitos de hoje", 
          icon: ClipboardList 
        };
      case "/masterplan":
        return { 
          title: "Masterplan", 
          subtitle: "Planejamento estratégico", 
          icon: LayoutDashboard 
        };
      case "/metas":
        return { 
          title: "Metas", 
          subtitle: "Objetivos de longo prazo", 
          icon: Target 
        };
      case "/missoes":
        return { 
          title: "Missões", 
          subtitle: "Desafios diários", 
          icon: Zap 
        };
      case "/comunidade":
        return { 
          title: "Comunidade", 
          subtitle: "Evolua com outros", 
          icon: User 
        };
      case "/loja":
        return { 
          title: "Loja", 
          subtitle: "Melhore sua jornada", 
          icon: ShoppingBag 
        };
      case "/configuracoes":
        return { 
          title: "Configurações", 
          subtitle: "Ajustes do sistema", 
          icon: SettingsIcon 
        };
      default:
        return { 
          title: "Dashboard", 
          subtitle: "Visão geral do sistema", 
          icon: LayoutDashboard 
        };
    }
  };

  const { title, subtitle, icon: Icon } = getPageInfo();

  return (
    <div className="w-full flex justify-center pt-8 px-6 mb-2">
      <header className="flex items-center gap-6 bg-[#0f2220]/80 border border-[#2d5550] rounded-full px-6 py-3.5 backdrop-blur-md shadow-2xl transition-all duration-300">
        
        {/* Lado Esquerdo: Ícone e Título */}
        <div className="flex items-center gap-4">
          <div className="text-white">
            <Icon size={22} strokeWidth={2.5} />
          </div>
          <h1 className="text-[17px] font-black text-white uppercase tracking-wider">
            {title}
          </h1>
        </div>

        {/* Separador Vertical */}
        <div className="h-4 w-[1px] bg-[#2d5550]" />

        {/* Lado Direito: Subtítulo */}
        <div className="flex items-center gap-6">
          <span className="text-[13px] font-bold text-white/50 uppercase tracking-widest whitespace-nowrap">
            {subtitle}
          </span>

          {/* Ações Rápidas (Opcionais, mantendo o estilo limpo) */}
          <div className="flex items-center gap-3 pl-2 border-l border-[#2d5550]">
            <button className="text-white/40 hover:text-white transition-colors">
              <Search size={18} />
            </button>
            <button className="text-white/40 hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00e5cc] rounded-full border-2 border-[#0f2220]" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default TopBar;