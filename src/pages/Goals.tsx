"use client";

import { Target, TrendingUp, CheckCircle2 } from "lucide-react";

const GoalsPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide">Minhas Metas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Goal Card */}
        <div className="panel p-6 flex flex-col gap-4 group hover:border-card-green transition-colors">
            <div className="flex justify-between items-start">
               <div className="w-12 h-12 rounded-2xl bg-card-green text-white flex items-center justify-center shadow-3d-green">
                  <Target size={24} />
               </div>
               <span className="bg-card-green/20 text-card-green px-3 py-1 rounded-full text-xs font-extrabold uppercase">Em andamento</span>
            </div>
            
            <div>
               <h3 className="text-xl font-extrabold text-white mb-1">Ler 12 Livros</h3>
               <p className="text-gray-500 font-bold text-sm">Meta Anual • Desenvolvimento</p>
            </div>

            <div className="space-y-2 mt-2">
               <div className="flex justify-between text-xs font-black uppercase text-gray-400">
                  <span>Progresso</span>
                  <span className="text-card-green">4/12</span>
               </div>
               <div className="h-4 bg-duo-sidebar rounded-full border-2 border-duo-sidebar overflow-hidden">
                  <div className="h-full bg-card-green w-[33%] shadow-[0_0_10px_rgba(88,204,2,0.5)]" />
               </div>
            </div>
        </div>

        {/* Another Goal */}
        <div className="panel p-6 flex flex-col gap-4 group hover:border-card-blue transition-colors">
            <div className="flex justify-between items-start">
               <div className="w-12 h-12 rounded-2xl bg-card-blue text-white flex items-center justify-center shadow-3d-blue">
                  <TrendingUp size={24} />
               </div>
               <span className="bg-card-blue/20 text-card-blue px-3 py-1 rounded-full text-xs font-extrabold uppercase">Mensal</span>
            </div>
            
            <div>
               <h3 className="text-xl font-extrabold text-white mb-1">Economizar R$ 500</h3>
               <p className="text-gray-500 font-bold text-sm">Financeiro</p>
            </div>

            <div className="space-y-2 mt-2">
               <div className="flex justify-between text-xs font-black uppercase text-gray-400">
                  <span>Progresso</span>
                  <span className="text-card-blue">R$ 350 / R$ 500</span>
               </div>
               <div className="h-4 bg-duo-sidebar rounded-full border-2 border-duo-sidebar overflow-hidden">
                  <div className="h-full bg-card-blue w-[70%] shadow-[0_0_10px_rgba(28,176,246,0.5)]" />
               </div>
            </div>
        </div>
      </div>
      
      {/* Empty State / Placeholder */}
      <div className="panel p-12 flex flex-col items-center justify-center border-dashed border-4 border-duo-gray bg-transparent shadow-none">
         <CheckCircle2 size={48} className="text-duo-gray mb-4" />
         <p className="text-gray-500 font-bold uppercase tracking-wider">Nenhuma meta concluída ainda.</p>
      </div>
    </div>
  );
};

export default GoalsPage;