"use client";

import React from 'react';

export const MonthlyChart = () => {
  return (
    <div className="card-ghost p-6">
      <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">Atividade</h3>
      <div className="flex items-end justify-between h-32 gap-1">
        {[40, 60, 30, 90, 45, 70, 85, 40, 65, 55, 30, 95].map((h, i) => (
          <div 
            key={i} 
            className="flex-1 bg-red-600/20 hover:bg-red-600/40 transition-all rounded-t-sm"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
};