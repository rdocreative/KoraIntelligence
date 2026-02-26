"use client";

import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bell,
  Flame,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const theme = {
  text: '#F9FAFB',
  border: 'rgba(255, 255, 255, 0.04)',
};

const pageTitles: Record<string, string> = {
  '/': 'Início',
  '/habitos': 'Masterplan',
  '/missoes': 'Missões',
  '/loja': 'Loja',
  '/configuracoes': 'Ajustes',
  '/dashboard': 'Dashboard',
};

export const TopBar = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Néctar';
  
  return (
    <header className="mb-14 flex items-center justify-between px-4 lg:px-0">
      <div>
        <h1 className="text-5xl font-serif italic mb-3 tracking-tight text-[#F9FAFB]">
          {title}
        </h1>
        <div className="flex items-center gap-3">
           <span className="text-[11px] font-black opacity-30 uppercase tracking-[0.3em]">
             {format(new Date(), "dd MMMM, yyyy", { locale: ptBR })}
           </span>
           <div className="h-1 w-1 rounded-full bg-white/20" />
           <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.2em]">
             Sincronizado
           </span>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div 
          className="flex items-center gap-3 px-6 py-3 rounded-full border bg-white/[0.02] backdrop-blur-xl transition-all hover:border-white/10" 
          style={{ borderColor: theme.border }}
        >
          <Flame size={16} className="text-orange-500" fill="currentColor" />
          <span className="text-sm font-black tracking-tight text-white">12 D</span>
        </div>
        <button 
          className="w-12 h-12 rounded-full flex items-center justify-center border bg-white/[0.02] hover:bg-white/10 transition-all group" 
          style={{ borderColor: theme.border }}
        >
          <Bell size={20} className="text-slate-400 group-hover:text-white transition-colors" />
        </button>
      </div>
    </header>
  );
};