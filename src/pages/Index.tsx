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
          <h1 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight mb-1">
            Olá, <span className="text-primary">{firstName}</span>
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            Seu sistema está ativo e operante. Vamos progredir hoje?
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground bg-card px-4 py-2 rounded-full border border-border uppercase tracking-wider shadow-sm">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <span>Status do Sistema: <span className="text-primary">ONLINE</span></span>
        </div>
      </div>

      {/* 3D Colorful Stats Cards - Gap reduzido para 12px (gap-3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {statsCards.map((stat, i) => (
          <Link 
            key={i} 
            to={stat.link}
            className={cn(
              "relative group py-[14px] px-[20px] rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden stat-card bg-card dark:bg-transparent",
              "bg-gradient-to-br bg-opacity-10 backdrop-blur-md",
              stat.gradient,
              stat.border
            )}
          >
            <div className="absolute top-0 right-0 p-20 bg-primary/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-2">
              <div className="flex justify-between items-start">
                <div className={cn("p-2.5 rounded-2xl bg-background/40 border border-foreground/10")}>
                  <stat.icon size={20} style={{ color: stat.color }} />
                </div>
                <div className="p-1 rounded-full bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={14} className="text-foreground" />
                </div>
              </div>
              
              <div>
                <div className="text-3xl font-black text-foreground mb-0 tracking-tighter">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
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
        <div className="p-6 rounded-3xl bg-card border border-border shadow-sm relative overflow-hidden group task-card">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]"></span>
            Foco Rápido
          </h3>

          <div className="space-y-3 relative z-10">
            <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border flex items-center gap-4 group/item hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-lg shadow-sm">
                🚀
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-foreground">Acessar Masterplan</h4>
                <p className="text-[11px] text-muted-foreground">Revise suas metas anuais</p>
              </div>
              <Link to="/masterplan" className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold uppercase hover:bg-primary/90 transition-colors">
                Abrir
              </Link>
            </div>

            <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border flex items-center gap-4 group/item hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-lg shadow-sm">
                ⚡
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-foreground">Ver Hábitos</h4>
                <p className="text-[11px] text-muted-foreground">Checklist diário</p>
              </div>
              <Link to="/habitos" className="px-3 py-1.5 rounded-lg bg-secondary text-primary text-[10px] font-bold uppercase hover:bg-secondary/80 transition-colors border border-border">
                Ver
              </Link>
            </div>
          </div>
        </div>

        {/* Quote / Motivation Panel */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-center relative overflow-hidden mission-card">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10" />
          
          <div className="relative z-10 text-center space-y-3">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
               Lembrete Diário
             </p>
             <blockquote className="text-lg font-medium text-foreground leading-relaxed font-serif italic">
               "Não é sobre ter tempo, é sobre ter prioridades. O que você faz hoje define quem você será amanhã."
             </blockquote>
             <div className="w-10 h-1 bg-primary rounded-full mx-auto mt-2" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index;