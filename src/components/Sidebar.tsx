"use client";

import React from 'react';
import { 
  Calendar, 
  CheckSquare, 
  Settings, 
  LayoutDashboard, 
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Calendário', path: '/calendar' },
    { icon: CheckSquare, label: 'Tarefas', path: '/tasks' },
    { icon: Sparkles, label: 'Foco', path: '/focus' },
  ];

  return (
    <aside 
      className={cn(
        "h-screen flex flex-col border-r border-white/5 transition-all duration-300 relative z-50",
        isCollapsed ? "w-20" : "w-64",
        "bg-transparent"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#6366f1] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-sans text-xl font-medium tracking-tight">Dyad</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="px-4 mb-8">
        <button className={cn(
          "w-full flex items-center gap-3 bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all rounded-2xl text-zinc-400 group",
          isCollapsed ? "p-3 justify-center" : "px-4 py-3"
        )}>
          <Search size={18} className="group-hover:text-zinc-200" />
          {!isCollapsed && <span className="text-sm font-medium">Buscar...</span>}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-[#6366f1]/10 text-[#6366f1]" 
                  : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200",
                isCollapsed && "justify-center px-0"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-[#6366f1] rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        {!isCollapsed && (
          <div className="bg-gradient-to-br from-[#6366f1]/10 to-transparent border border-[#6366f1]/10 rounded-[24px] p-5 mb-6">
            <h4 className="text-sm font-bold text-zinc-100 mb-1">Assine o Pro</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">Desbloqueie análises avançadas e recursos exclusivos.</p>
            <button className="w-full py-2 bg-[#6366f1] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
              Upgrade
            </button>
          </div>
        )}

        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200 transition-all",
            isCollapsed && "justify-center px-0"
          )}
        >
          <Settings size={20} />
          {!isCollapsed && <span className="font-medium">Configurações</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;