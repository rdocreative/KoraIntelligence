"use client";

import React from 'react';
import { 
  CheckCircle2, 
  Target, 
  Zap, 
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Hábitos (Azul) */}
        <div className="bg-[#1cb0f6] shadow-3d-blue rounded-2xl p-5 flex flex-col justify-between h-[120px] transition-transform hover:translate-y-[-2px] cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-[#0b4363] text-xs font-extrabold uppercase tracking-wider">Hábitos</span>
            <CheckCircle2 className="text-[#0b4363] opacity-50" size={24} />
          </div>
          <span className="text-3xl font-extrabold text-white">8/10</span>
        </div>

        {/* Card 2: Tarefas (Laranja) */}
        <div className="bg-[#ff9600] shadow-3d-orange rounded-2xl p-5 flex flex-col justify-between h-[120px] transition-transform hover:translate-y-[-2px] cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-[#613400] text-xs font-extrabold uppercase tracking-wider">Tarefas</span>
            <Target className="text-[#613400] opacity-50" size={24} />
          </div>
          <span className="text-3xl font-extrabold text-white">3</span>
        </div>

        {/* Card 3: Metas (Verde) */}
        <div className="bg-[#58cc02] shadow-3d-green rounded-2xl p-5 flex flex-col justify-between h-[120px] transition-transform hover:translate-y-[-2px] cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-[#1f4701] text-xs font-extrabold uppercase tracking-wider">Metas</span>
            <BarChart3 className="text-[#1f4701] opacity-50" size={24} />
          </div>
          <span className="text-3xl font-extrabold text-white">85%</span>
        </div>

        {/* Card 4: XP (Roxo) */}
        <div className="bg-[#ce82ff] shadow-3d-purple rounded-2xl p-5 flex flex-col justify-between h-[120px] transition-transform hover:translate-y-[-2px] cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-[#491666] text-xs font-extrabold uppercase tracking-wider">XP Total</span>
            <Zap className="text-[#491666] opacity-50" size={24} />
          </div>
          <span className="text-3xl font-extrabold text-white">2.4k</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Welcome Panel */}
          <div className="panel-base p-8 relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-3xl font-extrabold text-white mb-2">Bem-vindo, Mestre</h2>
                <p className="text-[#9ca3af] font-bold text-sm mb-6 max-w-md">
                   Sua jornada de evolução contínua está ativa. Hoje é um ótimo dia para quebrar recordes.
                </p>
                <Button className="bg-[#22d3ee] text-[#083344] font-extrabold uppercase tracking-widest shadow-3d-cyan hover:bg-[#22d3ee] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all h-12 px-8 rounded-2xl border-b-0">
                   Ver Masterplan
                </Button>
             </div>
             {/* Decorative element */}
             <div className="absolute top-0 right-0 p-32 bg-[#22d3ee] opacity-5 rounded-full blur-3xl transform translate-x-12 -translate-y-12"></div>
          </div>

          {/* Active Tasks Panel */}
          <div className="panel-base p-6">
            <h3 className="text-lg font-extrabold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
              <Target size={20} className="text-[#ff9600]" />
              Foco de Hoje
            </h3>
            
            <div className="space-y-3">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl border-2 border-[#37464f] bg-[#131f24] transition-transform hover:scale-[1.01] cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-6 h-6 rounded-full border-2 border-[#37464f] group-hover:border-[#58cc02] group-hover:bg-[#58cc02] transition-colors flex items-center justify-center">
                          <CheckCircle2 size={14} className="text-white opacity-0 group-hover:opacity-100" />
                       </div>
                       <span className="text-[#e5e7eb] font-bold text-sm">Finalizar módulo de estudos</span>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase text-[#ff9600] bg-[#ff9600]/10 px-3 py-1 rounded-full">
                       Alta Prioridade
                    </span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
           {/* Level Card */}
           <div className="panel-base p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full border-4 border-[#37464f] mb-4 flex items-center justify-center bg-[#131f24]">
                 <span className="text-4xl">👑</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">Nível 5</h3>
              <p className="text-[#9ca3af] text-xs font-bold uppercase mb-4">Guerreiro de Elite</p>
              
              <div className="w-full h-4 bg-[#37464f] rounded-full overflow-hidden border-2 border-[#37464f] mb-2">
                 <div className="h-full bg-[#ffc800] w-[70%]"></div>
              </div>
              <span className="text-xs font-extrabold text-[#ffc800] uppercase">700 / 1000 XP</span>
           </div>

           {/* Streak Card */}
           <div className="panel-base p-6 bg-[#131f24]">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-sm font-extrabold text-[#9ca3af] uppercase">Sequência</h3>
                 <Zap size={18} className="text-[#ff9600]" fill="currentColor" />
              </div>
              <div className="text-4xl font-extrabold text-white mb-4">12 Dias</div>
              <div className="flex justify-between gap-1">
                 {['S','T','Q','Q','S','S','D'].map((d, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 5 ? 'bg-[#ff9600] text-[#3f2400]' : 'bg-[#37464f] text-[#9ca3af]'}`}>
                       {d}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Index;