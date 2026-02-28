"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Target, 
  Settings,
  LogOut,
  User,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from "@/integrations/supabase/client";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CheckSquare, label: 'Tarefas', path: '/tasks' },
  { icon: Calendar, label: 'Hábitos', path: '/habits' },
  { icon: Target, label: 'Metas', path: '/goals' },
  { icon: Zap, label: 'Missões', path: '/missions' },
];

export const Sidebar = () => {
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="w-[240px] h-screen bg-[#0d0f14] border-r border-white/[0.05] flex flex-col shrink-0">
      <div className="p-5 flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-[#6366f1] rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white fill-white" />
        </div>
        <span className="text-base font-bold text-white tracking-tight">Flowstate</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                isActive 
                  ? "bg-[#6366f1]/10 text-white" 
                  : "text-white/30 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              <item.icon size={16} className={cn(
                "transition-colors",
                isActive ? "text-[#6366f1]" : "text-white/20 group-hover:text-white/40"
              )} />
              <span className="text-[13px] font-medium tracking-tight">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-1 rounded-full bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 space-y-3">
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
            DB
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-white truncate leading-none mb-1">David Brito</p>
            <p className="text-[9px] text-white/20 truncate">Nível 12 • Iniciante</p>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <button className="flex items-center gap-3 px-3 py-2 text-white/30 hover:text-white transition-colors rounded-xl hover:bg-white/[0.03]">
            <User size={14} />
            <span className="text-[11px] font-medium">Perfil</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-white/30 hover:text-white transition-colors rounded-xl hover:bg-white/[0.03]">
            <Settings size={14} />
            <span className="text-[11px] font-medium">Ajustes</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-red-400/50 hover:text-red-400 transition-colors rounded-xl hover:bg-red-400/5"
          >
            <LogOut size={14} />
            <span className="text-[11px] font-medium">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
};