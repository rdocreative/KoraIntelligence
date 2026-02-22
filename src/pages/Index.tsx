"use client";

import React from 'react';
import { useHabitTracker } from '@/hooks/useHabitTracker';
import { useProfile } from '@/hooks/useProfile';
import { MonthlyChart } from '@/components/features/dashboard/MonthlyChart';
import { CheckCircle2, ListTodo, Target, Zap, Trophy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const { history, habits, totalPoints, streak } = useHabitTracker();
  const { profile } = useProfile();

  const statCards = [
    { label: "Hábitos", value: habits.length, icon: CheckCircle2, color: "blue" },
    { label: "Tarefas", value: 0, icon: ListTodo, color: "orange" },
    { label: "Metas", value: 0, icon: Target, color: "green" },
    { label: "XP Total", value: totalPoints, icon: Zap, color: "purple" },
  ];

  const levelProgress = ((totalPoints % 1000) / 1000) * 100;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 4 Stat Cards Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div 
            key={i}
            className={cn(
              "p-6 rounded-3xl flex flex-col gap-3 duo-card-3d",
              `bg-card-${stat.color} shadow-${stat.color} hover-shadow-${stat.color}`
            )}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                <stat.icon size={24} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Live</span>
            </div>
            <div>
              <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
              <div className="text-[11px] font-black text-white/80 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Panel: XP Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="duo-panel p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Evolução Diária</h2>
                <p className="text-text-muted text-sm font-bold">Seu progresso nos últimos 30 dias</p>
              </div>
              <div className="p-3 bg-panel rounded-2xl border-2 border-duo-gray shadow-panel">
                <Trophy size={24} className="text-card-orange" />
              </div>
            </div>
            <div className="h-[300px]">
              <MonthlyChart history={history} />
            </div>
          </div>

          {/* Priority Tasks List */}
          <div className="duo-panel p-8">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Missões Prioritárias</h2>
                <button className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                  Ver todas <ArrowRight size={14} />
                </button>
             </div>
             <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl border-2 border-duo-gray hover:border-primary/50 bg-sidebar/50 transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-full border-2 border-duo-gray flex items-center justify-center text-text-muted group-hover:border-primary group-hover:text-primary transition-all">
                      <div className="w-5 h-5 rounded-full border-2 border-current" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-black text-white">Tarefa de Exemplo {i + 1}</div>
                      <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Alta Prioridade • Hoje</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Side Column: Level Card */}
        <div className="space-y-6">
          <div className="duo-panel p-8 flex flex-col items-center text-center">
             <div className="relative mb-6">
                <div className="w-24 h-24 rounded-[32px] bg-card-purple shadow-purple flex items-center justify-center rotate-3 group hover:rotate-0 transition-transform cursor-pointer">
                   <Zap size={48} className="text-white -rotate-3 group-hover:rotate-0 transition-transform" fill="currentColor" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-card-orange shadow-orange w-10 h-10 rounded-full flex items-center justify-center border-4 border-panel">
                  <span className="text-white font-black text-sm">{profile?.nivel || 1}</span>
                </div>
             </div>
             
             <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Guerreiro Nível {profile?.nivel || 1}</h3>
             <p className="text-text-muted text-xs font-bold mb-6">Você está a {1000 - (totalPoints % 1000)} XP do próximo nível</p>
             
             <div className="w-full space-y-3">
                <div className="flex justify-between text-[10px] font-black text-text-muted uppercase tracking-widest">
                  <span>Progresso</span>
                  <span className="text-card-orange">{Math.round(levelProgress)}%</span>
                </div>
                <div className="h-4 w-full bg-sidebar border-2 border-duo-gray rounded-full p-1 overflow-hidden shadow-panel">
                  <div 
                    className="h-full bg-gradient-to-r from-card-orange to-[#ffbf00] rounded-full transition-all duration-1000"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
             </div>

             <button className="duo-button-primary w-full mt-8">
               Ver Recompensas
             </button>
          </div>

          <div className="duo-panel p-6 bg-card-blue/10 border-card-blue/20">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-card-blue shadow-blue flex items-center justify-center">
                   <Flame size={20} className="text-white" fill="currentColor" />
                </div>
                <div>
                   <div className="text-sm font-black text-white uppercase tracking-tight">Streak Ativo</div>
                   <div className="text-[10px] font-bold text-card-blue uppercase tracking-widest">{streak} dias seguidos</div>
                </div>
             </div>
             <p className="text-xs text-text-muted font-bold leading-relaxed">
               Mantenha a chama acesa! Complete um hábito hoje para não perder seu progresso.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;