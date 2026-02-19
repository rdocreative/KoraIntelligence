import React from 'react';
import { LayoutDashboard, Target, Settings, LogOut, User } from 'lucide-react';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-transparent text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            <Target className="text-white" />
          </div>
          <span className="hidden lg:block font-rajdhani font-bold text-2xl tracking-tighter">ULTRA<span className="text-red-500">ZEN</span></span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: Target, label: 'Missões' },
            { icon: User, label: 'Perfil' },
            { icon: Settings, label: 'Configurações' },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                item.active 
                  ? 'bg-red-600/10 text-red-500 border border-red-500/20' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              <span className="hidden lg:block font-bold text-sm uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-white/40 hover:text-red-500 transition-colors">
            <LogOut size={20} />
            <span className="hidden lg:block font-bold text-sm uppercase tracking-widest">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <header className="h-20 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex flex-col">
            <h2 className="text-xs font-bold text-white/30 uppercase tracking-[0.3em]">Sistema Ativo</h2>
            <p className="font-rajdhani font-bold text-lg">BEM-VINDO, COMANDANTE</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Sincronizado</p>
                <p className="text-xs font-bold text-white/60 uppercase">Nível 14</p>
             </div>
             <div className="w-10 h-10 rounded-full border-2 border-red-500/50 p-0.5">
                <div className="w-full h-full rounded-full bg-neutral-800 bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')] bg-cover" />
             </div>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};