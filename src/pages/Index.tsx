"use client";

import React from 'react';
import DashboardOverview from '@/components/tasks/../dashboard/DashboardOverview';
import { useHabitTracker } from '@/hooks/useHabitTracker';
import { useAuth } from '@/components/providers/AuthProvider';

const Index = () => {
  const { habits, streak, totalPoints } = useHabitTracker();
  const { user } = useAuth();

  // Calculando estatísticas simples para o dashboard
  const completedToday = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;

  const stats = {
    total: totalHabits || "0",
    today: `${completedToday}/${totalHabits || 0}`,
    streak: `${streak}d`,
    progress: `${Math.min(100, Math.round((totalPoints / 2500) * 100))}%`
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-serif font-medium text-white mb-2">
          Olá, {user?.user_metadata?.name?.split(' ')[0] || 'Guerreiro'}
        </h1>
        <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">
          Aqui está o resumo da sua jornada hoje
        </p>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <DashboardOverview stats={stats} />
        
        {/* Espaço para mais widgets no futuro (Métricas, Próximas Tarefas, etc) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
              <span className="text-xl">🎯</span>
            </div>
            <h4 className="text-white font-bold mb-1">Foco do Dia</h4>
            <p className="text-zinc-500 text-xs">Mantenha a consistência nos seus hábitos principais para subir de nível.</p>
          </div>

          <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <span className="text-xl">📈</span>
            </div>
            <h4 className="text-white font-bold mb-1">Sua Evolução</h4>
            <p className="text-zinc-500 text-xs">Você está {stats.progress} mais próximo de se tornar um Mestre Mindset.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;