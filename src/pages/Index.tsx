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
      link: "/habitos"
    },
    {
      label: "Metas em Foco",
      value: activeGoals,
      icon: Target,
      link: "/metas"
    },
    {
      label: "Tarefas Pendentes",
      value: pendingTasks,
      icon: ListTodo,
      link: "/masterplan"
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#F0F2F5] uppercase tracking-tight mb-1">
            Olá, <span className="text-[#1CB0F6]">{firstName}</span>
          </h1>
          <p className="text-[#8892AA] font-bold text-sm">
            Seu sistema está ativo e operante. Vamos progredir hoje?
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#8892AA] bg-[#0D0F13] px-4 py-2 rounded-full border border-[#252B38] uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5 text-[#1CB0F6]" />
          <span>Status do Sistema: <span className="text-[#1CB0F6]">ONLINE</span></span>
        </div>
      </div>

      {/* 3D Colorful Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsCards.map((stat, i) => (
          <Link 
            key={i} 
            to={stat.link}
            className={cn(
              "relative group py-6 px-7 rounded-[24px] border border-[#2A3040] bg-[#161A20] transition-all duration-300 hover:bg-[#1E2330] hover:translate-y-[-4px]"
            )}
          >
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-2xl bg-[#1C2028] border border-[#2A3040] text-[#1CB0F6]">
                  <stat.icon size={22} />
                </div>
                <div className="p-1 rounded-full bg-[#1CB0F614] opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} className="text-[#1CB0F6]" />
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-black text-[#F0F2F5] mb-1 tracking-tighter">
                  {stat.value}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8892AA]">
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
        <div className="p-8 rounded-[24px] bg-[#161A20] border border-[#2A3040] relative overflow-hidden group">
          <h3 className="text-[12px] font-bold text-[#8892AA] uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1CB0F6]"></span>
            Ações Rápidas
          </h3>

          <div className="space-y-3 relative z-10">
            <div className="p-4 rounded-2xl bg-[#1C2028] border border-[#2A3040] flex items-center gap-4 hover:bg-[#1E2330] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#0A0C0F] flex items-center justify-center text-lg">
                🚀
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#F0F2F5]">Acessar Masterplan</h4>
                <p className="text-[11px] text-[#8892AA]">Revise suas metas anuais</p>
              </div>
              <Link to="/masterplan" className="px-4 py-2 rounded-xl bg-[#1CB0F6] text-[#0A0C0F] text-[10px] font-bold uppercase hover:bg-[#0E9AD6] transition-all shadow-[0_4px_0_0_#0A7AB0] active:translate-y-[2px] active:shadow-none">
                Abrir
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-[#1C2028] border border-[#2A3040] flex items-center gap-4 hover:bg-[#1E2330] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#0A0C0F] flex items-center justify-center text-lg">
                ⚡
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#F0F2F5]">Ver Hábitos</h4>
                <p className="text-[11px] text-[#8892AA]">Checklist diário</p>
              </div>
              <Link to="/habitos" className="px-4 py-2 rounded-xl bg-[#1C2028] border border-[#2A3040] text-[#F0F2F5] text-[10px] font-bold uppercase hover:bg-[#1E2330] transition-colors">
                Ver
              </Link>
            </div>
          </div>
        </div>

        {/* Quote / Motivation Panel */}
        <div className="p-8 rounded-[24px] bg-[#161A20] border border-[#2A3040] flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10 text-center space-y-4">
             <p className="text-[11px] font-bold text-[#3D4560] uppercase tracking-[0.2em]">
               Lembrete Diário
             </p>
             <blockquote className="text-lg font-medium text-[#F0F2F5] leading-relaxed italic">
               "Não é sobre ter tempo, é sobre ter prioridades. O que você faz hoje define quem você será amanhã."
             </blockquote>
             <div className="w-12 h-1 bg-[#1CB0F6] rounded-full mx-auto mt-2" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index;