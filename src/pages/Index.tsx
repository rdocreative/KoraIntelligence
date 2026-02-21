"use client";

import React from 'react';
import Sidebar from '../components/Sidebar';
import BrainFAB from '../components/BrainFAB';

const Index = () => {
  return (
    <div className="flex min-h-screen bg-[#050f0e]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo ao Dyad AI</h2>
            <p className="text-gray-400">Seu centro de comando para inteligência artificial.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0d1716] border border-[#1a2e2c]">
              <h3 className="text-lg font-semibold text-white mb-2">Atividade Recente</h3>
              <p className="text-gray-400 text-sm">Nenhuma atividade registrada hoje.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-[#0d1716] border border-[#1a2e2c]">
              <h3 className="text-lg font-semibold text-white mb-2">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Tokens usados</span>
                  <span className="text-blue-400 font-mono text-sm">1.2k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Agentes Ativos</span>
                  <span className="text-blue-400 font-mono text-sm">4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BrainFAB />
    </div>
  );
};

export default Index;