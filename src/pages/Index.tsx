"use client";

import React from 'react';
import { ClipboardList, Target, Trophy, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card-blue p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
          <ClipboardList className="absolute -right-2 -bottom-2 w-20 h-20 text-white/20 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-extrabold uppercase tracking-wider text-white/90">Hábitos</span>
          <span className="text-4xl font-black">12/15</span>
        </div>
        <div className="stat-card-orange p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
          <CheckCircle2 className="absolute -right-2 -bottom-2 w-20 h-20 text-white/20 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-extrabold uppercase tracking-wider text-white/90">Tarefas</span>
          <span className="text-4xl font-black">8 Pend.</span>
        </div>
        <div className="stat-card-green p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
          <Target className="absolute -right-2 -bottom-2 w-20 h-20 text-white/20 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-extrabold uppercase tracking-wider text-white/90">Metas</span>
          <span className="text-4xl font-black">85%</span>
        </div>
        <div className="stat-card-purple p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
          <Trophy className="absolute -right-2 -bottom-2 w-20 h-20 text-white/20 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-extrabold uppercase tracking-wider text-white/90">XP Total</span>
          <span className="text-4xl font-black">2.4k</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: XP & Level */}
        <div className="lg:col-span-2 space-y-6">
          <div className="panel p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold uppercase text-white flex items-center gap-2">
                <Zap className="text-card-orange fill-card-orange" />
                Evolução de XP
              </h2>
              <span className="text-duo-primary font-bold uppercase text-sm tracking-wider">Últimos 30 dias</span>
            </div>
            {/* Placeholder for Chart */}
            <div className="h-64 w-full bg-duo-sidebar rounded-2xl border-2 border-duo-gray flex items-center justify-center">
              <p className="text-gray-500 font-bold uppercase tracking-widest">Gráfico de XP aqui</p>
            </div>
          </div>

          <div className="panel p-6 bg-gradient-to-r from-duo-panel to-duo-sidebar">
            <h3 className="text-lg font-extrabold uppercase text-white mb-4">Próximo Nível</h3>
            <div className="flex items-center justify-between text-sm font-bold text-gray-400 uppercase mb-2">
              <span>Nível 1</span>
              <span>Nível 2</span>
            </div>
            <div className="h-5 w-full bg-duo-gray rounded-full border-2 border-duo-gray overflow-hidden">
               <div className="h-full bg-card-orange w-[75%] shadow-[0_0_10px_rgba(255,150,0,0.5)]" />
            </div>
            <p className="text-center mt-3 text-sm font-bold text-card-orange uppercase tracking-wider">
              Faltam 250 XP para subir!
            </p>
          </div>
        </div>

        {/* Side Content: Priorities */}
        <div className="lg:col-span-1 space-y-6">
          <div className="panel p-6 h-full flex flex-col">
            <h3 className="text-lg font-extrabold uppercase text-white mb-6">Prioridades Hoje</h3>
            
            <div className="space-y-3 flex-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="list-item-card bg-card-red/10 border-card-red/20 p-4 flex items-center gap-4 hover:border-card-red">
                   <div className="w-6 h-6 rounded-full border-2 border-card-red flex items-center justify-center shrink-0" />
                   <div className="flex-1">
                      <p className="font-bold text-white text-sm">Finalizar relatório</p>
                      <span className="text-xs font-bold text-card-red uppercase tracking-wider">Alta Prioridade</span>
                   </div>
                </div>
              ))}
              <div className="list-item-card bg-card-orange/10 border-card-orange/20 p-4 flex items-center gap-4 hover:border-card-orange">
                   <div className="w-6 h-6 rounded-full border-2 border-card-orange flex items-center justify-center shrink-0" />
                   <div className="flex-1">
                      <p className="font-bold text-white text-sm">Reunião de Alinhamento</p>
                      <span className="text-xs font-bold text-card-orange uppercase tracking-wider">Média Prioridade</span>
                   </div>
              </div>
            </div>
            
            <Button className="w-full mt-6 btn-primary h-12">
              Ver todas as tarefas <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;