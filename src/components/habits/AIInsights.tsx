"use client";

import React from 'react';
import { Sparkles, BrainCircuit, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const AIInsights = () => {
  return (
    <div className="relative group">
      {/* Background Glow Effect - AI Identity */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-[24px] blur-sm opacity-25 group-hover:opacity-50 transition-all duration-500"></div>
      
      <div className="relative bg-[#0f172a] border border-white/5 rounded-[24px] p-6 shadow-2xl overflow-hidden">
        {/* Animated Gradient Border - AI Identity */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-50"></div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20">
              <BrainCircuit size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-[13px] font-black text-white uppercase tracking-widest leading-none mb-1">Insights da IA</h3>
              <span className="text-[9px] font-black text-[#8b5cf6] uppercase tracking-[0.2em]">Otimização de Rotina</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <Sparkles size={12} className="text-[#8b5cf6] animate-pulse" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Ativo</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1e293b]/30 border border-white/5 p-4 rounded-[16px] hover:bg-[#1e293b]/50 transition-all group/card">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                <TrendingUp size={14} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/90 leading-relaxed">
                  Você costuma completar <span className="text-emerald-400">"Meditar"</span> mais cedo aos finais de semana. Sugerimos adiantar o lembrete em 30min.
                </p>
                <button className="mt-3 text-[9px] font-black text-[#8b5cf6] uppercase tracking-widest hover:text-[#a78bfa] transition-colors flex items-center gap-2">
                  Aplicar Ajuste <Sparkles size={10} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b]/30 border border-white/5 p-4 rounded-[16px] hover:bg-[#1e293b]/50 transition-all group/card">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 mt-0.5">
                <AlertCircle size={14} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/90 leading-relaxed">
                  O hábito <span className="text-orange-400">"Academia"</span> está com baixa consistência nas quartas. Tente reduzir a carga para manter o hábito.
                </p>
                <button className="mt-3 text-[9px] font-black text-[#8b5cf6] uppercase tracking-widest hover:text-[#a78bfa] transition-colors flex items-center gap-2">
                  Ver Análise <Sparkles size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;