"use client";

import React from 'react';
import { Trophy, Flame, Target } from 'lucide-react';

export const DashboardHeader = ({ stats }: any) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2 font-['Rajdhani']">
          OLÁ, <span className="text-red-600">GUERREIRO</span>
        </h1>
        <p className="text-white/60">Seu progresso hoje está acima da média.</p>
      </div>
      
      <div className="flex gap-4">
        <div className="card-ghost p-4 flex items-center gap-3">
          <div className="p-2 bg-red-600/20 rounded-lg">
            <Flame className="text-red-600 w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase font-bold">Streak</p>
            <p className="text-xl font-bold">{stats.streak} dias</p>
          </div>
        </div>
        <div className="card-ghost p-4 flex items-center gap-3">
          <div className="p-2 bg-red-600/20 rounded-lg">
            <Trophy className="text-red-600 w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase font-bold">Rank</p>
            <p className="text-xl font-bold">{stats.badge}</p>
          </div>
        </div>
      </div>
    </div>
  );
};