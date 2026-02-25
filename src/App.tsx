"use client";

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  Bell, 
  Search,
  User,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { cn } from "@/lib/utils";
import Index from './pages/Index';
import Habits from './pages/Habits';

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }: any) => (
  <Link
    to={path}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative mb-1",
      active 
        ? "bg-primary text-primary-foreground shadow-[0_4px_0_0_var(--primary-dark)]" 
        : "text-[var(--muted-foreground)] hover:bg-[var(--border-ui)]/30 hover:text-[var(--foreground)]"
    )}
  >
    <Icon size={20} strokeWidth={active ? 3 : 2} className="shrink-0" />
    {!collapsed && (
      <span className={cn(
        "text-sm font-black uppercase tracking-wider",
        active ? "opacity-100" : "opacity-80"
      )}>
        {label}
      </span>
    )}
    {active && !collapsed && (
      <div className="absolute right-4">
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      </div>
    )}
  </Link>
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Hábitos', path: '/habits' },
    { icon: Bell, label: 'Alertas', path: '/alerts' },
    { icon: Search, label: 'Explorar', path: '/explore' },
  ];

  return (
    <aside 
      className={cn(
        "h-screen sticky top-0 border-r-2 border-[var(--border-ui)] flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-[80px]" : "w-[260px]",
        "bg-[var(--panel)]" // Vinculado à variável global
      )}
    >
      <div className="p-6 mb-4 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-[0_3px_0_0_var(--primary-dark)]">
              <Sparkles className="text-white" size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-black tracking-tighter text-[var(--foreground)]">DYAD</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl hover:bg-[var(--border-ui)]/50 text-[var(--muted-foreground)] transition-colors"
        >
          <ChevronRight className={cn("transition-transform", !collapsed && "rotate-180")} size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            {...item}
            active={location.pathname === item.path}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="p-4 border-t-2 border-[var(--border-ui)]">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-2xl bg-[var(--input-bg)]/50 border-2 border-[var(--border-ui)]",
          collapsed && "justify-center px-0"
        )}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold shrink-0">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-[var(--foreground)] truncate uppercase tracking-tighter">John Doe</p>
              <p className="text-[10px] text-[var(--muted-foreground)] font-bold truncate">PRO ACCOUNT</p>
            </div>
          )}
          {!collapsed && (
            <button className="text-[var(--muted-foreground)] hover:text-destructive transition-colors">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[var(--background)]">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/habits" element={<Habits />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;