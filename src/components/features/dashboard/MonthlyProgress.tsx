"use client";

import React from 'react';

export const MonthlyProgress = ({ totalPoints }: any) => {
  return (
    <div className="card-ghost p-6">
      <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">Meta Mensal</h3>
      <div className="flex items-end gap-1 mb-2">
        <span className="text-5xl font-bold font-['Rajdhani']">{Math.round((totalPoints / 3000) * 100)}%</span>
        <span className="text-white/40 mb-2 font-bold uppercase text-[10px]">Concluído</span>
      </div>
      <p className="text-sm text-white/50 leading-relaxed">
        Você está <span className="text-red-600 font-bold">12% acima</span> da sua meta para este período. Continue assim!
      </p>
    </div>
  );
};