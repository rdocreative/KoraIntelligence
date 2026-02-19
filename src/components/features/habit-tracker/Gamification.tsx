"use client";

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Gamification = ({ totalPoints, nextBadge }: any) => {
  return (
    <div className="card-ghost p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Nível Atual</h3>
          <p className="text-2xl font-bold text-red-600 font-['Rajdhani']">Level 14</p>
        </div>
        <ShieldCheck className="text-red-600 w-8 h-8 opacity-50" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
          <span>Progresso para {nextBadge}</span>
          <span>{totalPoints}/2000 XP</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" 
            style={{ width: '62.5%' }} 
          />
        </div>
      </div>
    </div>
  );
};