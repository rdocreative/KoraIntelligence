"use client";

import React from 'react';
import { SideNav } from '../components/layout/SideNav';

const Index = () => {
  return (
    <div className="flex min-h-screen bg-[#050f0e]">
      <SideNav />
      
      <main className="flex-1 p-8 ml-20">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo ao Masterplan</h2>
            <p className="text-gray-400">Gerencie sua jornada e alcance seus objetivos.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0d1716] border border-[#1a2e2c]">
              <h3 className="text-lg font-semibold text-white mb-2">Hábitos de Hoje</h3>
              <p className="text-gray-400 text-sm">Acompanhe seu progresso diário aqui.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-[#0d1716] border border-[#1a2e2c]">
              <h3 className="text-lg font-semibold text-white mb-2">Metas Ativas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Foco Total</span>
                  <span className="text-blue-400 font-mono text-sm">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Consistência</span>
                  <span className="text-blue-400 font-mono text-sm">12 dias</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;