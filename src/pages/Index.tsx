"use client";

import React from 'react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useProfile } from '@/hooks/useProfile';
import { 
  Target, 
  CheckCircle2, 
  ListTodo, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Index = () => {
  const { profile } = useProfile();
  const { activeHabits, pendingTasks, activeGoals } = useDashboardStats();

  const firstName = profile?.nome?.split(' ')[0] || "Guerreiro";

  const statsCards = [
    {
      label: "Hábitos Ativos",
      value: activeHabits,
      icon: CheckCircle2,
      color: "#2dd4bf",
      gradient: "from-[#2dd4bf]/20 to-[#2dd4bf]/5",
      border: "border-[#2dd4bf]/30",
      link: "/habitos"
    },
    {
      label: "Metas em Foco",
      value: activeGoals,
      icon: Target,
      color: "#f472b6",
      gradient: "from-[#f472b6]/20 to-[#f472b6]/5",
      border: "border-[#f472b6]/30",
      link: "/metas"
    },
    {
      label: "Tarefas Pendentes",
      value: pendingTasks,
      icon: ListTodo,
      color: "#facc15",
      gradient: "from-[#facc15]/20 to-[#facc15]/5",
      border: "border-[#facc15]/30",
      link: "/masterplan"
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-1">
            Olá, <span className="text-[#4adbc8]">{firstName}</span>
          </h1>
          <p className="text-neutral-400 font-medium text-sm">
            Seu sistema está ativo e operante. Vamos progredir hoje?
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 bg-[#111] px-4 py-2 rounded-full border border-white/5 uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5 text-[#4adbc8]" />
          <span>Status do Sistema: <span className="text-[#4adbc8]">ONLINE</span></span>
        </div>
      </div>

      {/* 3D Colorful Stats Cards - Gap reduzido para 12px (gap-3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {statsCards.map((stat, i) => (
          <Link 
            key={i} 
            to={stat.link}
            className={cn(
              "relative group py-[14px] px-[20px] rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden stat-card",
              "bg-gradient-to-br bg-opacity-10 backdrop-blur-md",
              stat.gradient,
              stat.border
            )}
          >
            <div className="absolute top-0 right-0 p-20 bg-white/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-white/10 transition-colors" />
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-2">
              <div className="flex justify-between items-start">
                <div className={cn("p-2.5 rounded-2xl bg-black/40 border border-white/10")}>
                  <stat.icon size={20} style={{ color: stat.color }} />
                </div>
                <div className="p-1 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={14} className="text-white" />
                </div>
              </div>
              
              <div>
                <div className="text-3xl font-black text-white mb-0 tracking-tighter">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">
                  {stat.label}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Daily Focus Panel */}
        <div className="p-6 rounded-3xl bg-[#0f2220] border border-[#2d5550] shadow-2xl relative overflow-hidden group task-card">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4adbc8]/5 to-transparent pointer-events-none" />
          
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4adbc8] shadow-[0_0_10px_#4adbc8]"></span>
            Foco Rápido
          </h3>

          <div className="space-y-3 relative z-10">
            <div className="p-3.5 rounded-2xl bg-[#0d1e1c] border border-[#1e3a36] flex items-center gap-4 group/item hover:border-[#4adbc8]/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#071412] flex items-center justify-center text-lg">
                🚀
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">Acessar Masterplan</h4>
                <p className="text-[11px] text-neutral-500">Revise suas metas anuais</p>
              </div>
              <Link to="/masterplan" className="px-3 py-1.5 rounded-lg bg-[#4adbc8] text-[#071412] text-[10px] font-bold uppercase hover:bg-[#3bc7b6] transition-colors">
                Abrir
              </Link>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0d1e1c] border border-[#1e3a36] flex items-center gap-4 group/item hover:border-[#4adbc8]/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#071412] flex items-center justify-center text-lg">
                ⚡
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">Ver Hábitos</h4>
                <p className="text-[11px] text-neutral-500">Checklist diário</p>
              </div>
              <Link to="/habitos" className="px-3 py-1.5 rounded-lg bg-[#1e3a36] text-[#4adbc8] text-[10px] font-bold uppercase hover:bg-[#254641] transition-colors">
                Ver
              </Link>
            </div>
          </div>
        </div>

        {/* Quote / Motivation Panel */}
        <div className="p-6 rounded-3xl bg-[#1a1a1a] border border-white/5 shadow-2xl flex flex-col justify-center relative overflow-hidden mission-card">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10" />
          
          <div className="relative z-10 text-center space-y-3">
             <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
               Lembrete Diário
             </p>
             <blockquote className="text-lg font-medium text-white leading-relaxed font-serif italic">
               "Não é sobre ter tempo, é sobre ter prioridades. O que você faz hoje define quem você será amanhã."
             </blockquote>
             <div className="w-10 h-1 bg-[#4adbc8] rounded-full mx-auto mt-2" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index;