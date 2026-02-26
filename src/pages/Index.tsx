"use client";

import React from 'react';
import { 
  Flame, 
  Trophy, 
  Target, 
  Coffee, 
  Quote,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const theme = {
  primary: '#C4B5FD',
  secondary: '#FB923C',
  accent: '#F472B6',
  gradPrimary: 'linear-gradient(135deg, #C4B5FD 0%, #A855F7 100%)',
  primaryGlow: '0 0 20px rgba(196, 181, 253, 0.25)',
};

const Index = () => {
  return (
    <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700">
      {/* Background Orbs */}
      <div className="fixed top-[0%] left-[20%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-10 pointer-events-none" style={{ background: theme.gradPrimary }} />
      <div className="fixed bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: theme.secondary }} />

      <div className="grid grid-cols-12 gap-8 lg:gap-10">
        {/* Hero Card - Saudação Imersiva */}
        <div className="col-span-12 lg:col-span-8 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group transition-all duration-500 hover:scale-[1.01]" 
             style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
          <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none" 
               style={{ background: 'radial-gradient(circle at top right, #C4B5FD, transparent 60%)' }} />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-black tracking-[0.3em] uppercase opacity-50">Bom dia, Ricardo</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif italic tracking-tight mb-4 text-white leading-tight">
                A excelência não é um ato, <br/>mas um <span style={{ color: theme.primary }}>hábito.</span>
              </h2>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <button className="px-8 py-4 rounded-[2rem] text-sm font-black uppercase tracking-widest text-black transition-all hover:scale-105"
                      style={{ background: theme.primary, boxShadow: theme.primaryGlow }}>
                Iniciar Foco
              </button>
              <span className="text-xs font-bold opacity-40">3 Hábitos pendentes hoje</span>
            </div>
          </div>
        </div>

        {/* Progresso Diário */}
        <div className="col-span-12 lg:col-span-4 p-10 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col items-center justify-center text-center group hover:bg-white/[0.04] transition-colors">
          <div className="relative mb-6">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
              <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="377" strokeDashoffset="113" className="transition-all duration-1000 ease-out" style={{ color: theme.primary }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black">70%</span>
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Energia do Dia</p>
          <p className="text-sm font-bold opacity-50">Quase lá, não pare!</p>
        </div>

        {/* Estatísticas Rápidas (3 Cards) */}
        {[
          { label: 'Ofensiva Atual', value: '12 Dias', icon: Flame, color: theme.secondary, sub: '+2 hoje' },
          { label: 'Pontos XP', value: '2.450', icon: Trophy, color: theme.primary, sub: 'Nível 42' },
          { label: 'Conclusão', value: '85%', icon: TrendingUp, color: '#10B981', sub: 'Semana' },
        ].map((stat, i) => (
          <div key={`stat-${i}`} className="col-span-12 md:col-span-4 p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-md group hover:bg-white/[0.04] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110" 
                   style={{ background: `linear-gradient(135deg, ${stat.color}40 0%, transparent 100%)`, border: `1px solid ${stat.color}30` }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-slate-400">{stat.sub}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
          </div>
        ))}

        {/* Foco Atual (Próximo Hábito) */}
        <div className="col-span-12 lg:col-span-8 p-8 rounded-[3rem] border border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent backdrop-blur-xl">
          <div className="flex items-center justify-between mb-8 opacity-50">
            <div className="flex items-center gap-3">
              <Target size={16} style={{ color: theme.primary }} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em]">Próximo Foco</h3>
            </div>
            <ChevronRight size={16} />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2rem] bg-[#16161C]/80 border border-white/5 transition-all hover:bg-[#1A1A24]">
             <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
               <Coffee size={24} className="text-slate-300" />
             </div>
             <div className="flex-1 text-center md:text-left">
               <h4 className="text-xl font-bold tracking-tight mb-1">Deep Work: UX Design</h4>
               <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Estudos • 14:00 - 16:00</p>
             </div>
             <button className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                     style={{ border: `1px solid ${theme.primary}50` }}>
               Começar
             </button>
          </div>
        </div>

        {/* Card de Inspiração Mínimo */}
        <div className="col-span-12 lg:col-span-4 p-8 rounded-[3rem] border border-white/5 bg-white/[0.02] flex flex-col justify-center items-center text-center relative overflow-hidden group">
          <Quote size={40} className="absolute -top-4 -left-2 opacity-5" />
          <p className="text-sm font-medium italic opacity-60 leading-relaxed mb-6">
            "A motivação serve para começar. O hábito é o que te mantém a avançar."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Jim Rohn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;