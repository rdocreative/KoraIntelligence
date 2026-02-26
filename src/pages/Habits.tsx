"use client";

import React from "react";
import { 
  Pause, 
  CheckCircle2, 
  Music 
} from "lucide-react";

export default function HabitsPage() {
  const primaryColor = '#ffffff';

  return (
    <div className="flex-1 flex items-center justify-center h-full animate-in fade-in duration-700">
      <div className="bg-black rounded-[24px] p-8 text-white border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center w-full max-w-md">
        
        <div className="w-full flex justify-end mb-6 relative z-10">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full text-[10px] font-bold text-zinc-300">
            <Music size={12} /> Lo-fi beats <span className="ml-1" style={{ color: '#38BDF8' }}>M</span>
          </div>
        </div>
        
        <h3 className="text-4xl font-serif mb-2 text-white relative z-10">Deep Work</h3>
        <p className="text-sm text-zinc-500 font-medium mb-12 tracking-widest relative z-10">14:00 → 16:30</p>
        
        <div className="relative w-48 h-48 flex items-center justify-center mb-12 z-10">
           <svg className="absolute inset-0 w-full h-full transform -rotate-90">
             <circle cx="96" cy="96" r="84" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
             <circle 
                cx="96" cy="96" r="84" 
                stroke="#38BDF8" 
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray="527" 
                strokeDashoffset="200" 
                strokeLinecap="round" 
             />
           </svg>
           <div className="text-5xl">💻</div>
        </div>
        
        <div className="flex items-center justify-between w-full px-4 mb-10 relative z-10">
          <span className="text-sm font-bold text-zinc-500 hover:text-white cursor-pointer transition-colors">+5m</span>
          <button className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl">
            <Pause size={24} fill="black" />
          </button>
          <span className="text-sm font-bold text-zinc-500 hover:text-white cursor-pointer transition-colors">-5m</span>
        </div>
        
        <div className="w-full space-y-3 relative z-10">
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="w-5 h-5 rounded-full border border-zinc-500" />
            <span className="text-sm font-medium text-zinc-300">Estruturar Layout</span>
          </div>
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4 opacity-40">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 size={14} className="text-zinc-400" />
            </div>
            <span className="text-sm font-medium text-zinc-400 line-through">Pesquisa de Ref</span>
          </div>
        </div>
      </div>
    </div>
  );
}