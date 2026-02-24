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
      color: "#CB0104",
      shadowColor: "#8A0002",
      textColor: "white",
      link: "/habitos"
    },
    {
      label: "Metas em Foco",
      value: activeGoals,
      icon: Target,
      color: "#58CC02",
      shadowColor: "#46A302",
      textColor: "white",
      link: "/metas"
    },
    {
      label: "Tarefas Pendentes",
      value: pendingTasks,
      icon: ListTodo,
      color: "#FF9600",
      shadowColor: "#E58700",
      textColor: "white",
      link: "/masterplan"
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-6xl mx-auto px-4 pt-4">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 mb-4">
        <div>
          <h1 className="text-[32px] md:text-[42px] font-[950] text-[var(--foreground)] uppercase tracking-tight mb-1.5">
            Olá, <span className="text-[#CB0104]">{firstName}</span>
          </h1>
          <p className="text-[var(--muted-foreground)] font-[700] text-[15px] tracking-wide">
            Seu sistema está pronto. Vamos dominar o dia?
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-[900] text-[var(--muted-foreground)] bg-[var(--topbar)] px-6 py-2.5 rounded-full border-2 border-[var(--border-ui)] uppercase tracking-widest shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <TrendingUp className="w-4 h-4 text-[#CB0104]" />
          <span>Status do Sistema: <span className="text-[#CB0104]">ONLINE</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, i) => (
          <Link 
            key={i} 
            to={stat.link}
            className="group relative py-7 px-8 rounded-[32px] border-2 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            style={{
              backgroundColor: stat.color,
              borderColor: 'transparent',
              boxShadow: `0 5px 0 0 ${stat.shadowColor}`,
              color: stat.textColor
            }}
          >
            <div className="relative z-10 flex flex-col h-full justify-between gap-5">
              <div className="flex justify-between items-start">
                <div className="p-3.5 rounded-2xl bg-black/10">
                  <stat.icon size={26} style={{ color: stat.textColor }} strokeWidth={3} />
                </div>
                <div className="p-1.5 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} style={{ color: stat.textColor }} />
                </div>
              </div>
              
              <div>
                <div className="text-[36px] font-[950] mb-0 tracking-tighter" style={{ color: stat.textColor }}>
                  {stat.value}
                </div>
                <div className="text-[11px] font-[900] uppercase tracking-widest opacity-80" style={{ color: stat.textColor }}>
                  {stat.label}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-[40px] bg-[var(--panel)] border-2 border-[var(--border-ui)] shadow-[0_2px_12px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <h3 className="text-[13px] font-[900] text-[var(--foreground)] uppercase tracking-[0.15em] mb-6 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CB0104] shadow-[0_0_10px_#CB0104]"></span>
            Ações Rápidas
          </h3>

          <div className="space-y-4 relative z-10">
            <Link to="/masterplan" className="p-5 rounded-[24px] bg-[var(--background)] border-2 border-[var(--border-ui)] flex items-center gap-5 hover:border-[#CB0104] transition-all group/item shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="w-12 h-12 rounded-2xl bg-[var(--panel)] flex items-center justify-center text-2xl">
                🚀
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-[900] text-[var(--foreground)]">Acessar Masterplan</h4>
                <p className="text-[12px] text-[var(--muted-foreground)] font-bold">Gerencie seus grandes objetivos</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--border-ui)] group-hover/item:text-[#CB0104] transition-colors" />
            </Link>

            <Link to="/habitos" className="p-5 rounded-[24px] bg-[var(--background)] border-2 border-[var(--border-ui)] flex items-center gap-5 hover:border-[#CB0104] transition-all group/item shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="w-12 h-12 rounded-2xl bg-[var(--panel)] flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-[900] text-[var(--foreground)]">Lista de Hábitos</h4>
                <p className="text-[12px] text-[var(--muted-foreground)] font-bold">Confira sua rotina diária</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--border-ui)] group-hover/item:text-[#CB0104] transition-colors" />
            </Link>
          </div>
        </div>

        <div className="p-8 rounded-[40px] bg-[var(--panel)] border-2 border-[var(--border-ui)] shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex flex-col justify-center relative overflow-hidden text-center">
          <div className="relative z-10 space-y-4">
             <p className="text-[11px] font-[900] text-[var(--muted-foreground)] uppercase tracking-[0.2em]">
               Mentalidade do Dia
             </p>
             <blockquote className="text-[20px] font-[800] text-[var(--foreground)] leading-snug italic px-4">
               "Sua rotina é o sistema operacional que executa o seu futuro. Configure-o com sabedoria."
             </blockquote>
             <div className="w-12 h-1.5 bg-[#CB0104] rounded-full mx-auto mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;