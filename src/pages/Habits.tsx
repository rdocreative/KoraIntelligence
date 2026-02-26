"use client";

import React from "react";
import { 
  Pause, 
  CheckCircle2, 
  Music 
} from "lucide-react";

export default function HabitsPage() {
  return (
    <div className="flex-1 flex items-center justify-center h-full animate-in fade-in duration-700">
      <div className="bg-[#0a0a0b] rounded-[40px] p-10 text-white border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center w-full max-w-md">
        
        <div className="w-full flex justify-end mb-6 relative z-10">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <Music size={12} className="text-[#38BDF8]" /> Lo-fi beats
          </div>
        </div>
        
        <h3 className="text-5xl font-serif font-medium mb-2 text-white relative z-10">Deep Work</h3>
        <p className="text-xs text-zinc-500 font-black uppercase tracking-[0.3em] mb-12 relative z-10">14:00 → 16:30</p>
        
        <div className="relative w-56 h-56 flex items-center justify-center mb-12 z-10">
           <svg className="absolute inset-0 w-full h-full transform -rotate-90">
             <circle cx="112" cy="112" r="100" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
             <circle 
                cx="112" cy="112" r="100" 
                stroke="#38BDF8" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray="628" 
                strokeDashoffset="180" 
                strokeLinecap="round" 
                className="drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]"
             />
           </svg>
           <div className="text-6xl">💻</div>
        </div>
        
        <div className="flex items-center justify-between w-full px-4 mb-10 relative z-10">
          <span className="text-xs font-black text-zinc-500 hover:text-white cursor-pointer transition-colors uppercase tracking-widest">+5m</span>
          <button className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-2xl">
            <Pause size={28} fill="black" />
          </button>
          <span className="text-xs font-black text-zinc-500 hover:text-white cursor-pointer transition-colors uppercase tracking-widest">-5m</span>
        </div>
        
        <div className="w-full space-y-3 relative z-10">
          <div className="bg-white/5 rounded-2xl p-5 flex items-center gap-4 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors group">
            <div className="w-6 h-6 rounded-full border-2 border-zinc-600 group-hover:border-[#38BDF8] transition-colors" />
            <span className="text-sm font-semibold text-zinc-300">Estruturar Layout</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 flex items-center gap-4 opacity-30">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-zinc-500" />
            </div>
            <span className="text-sm font-semibold text-zinc-500 line-through">Pesquisa de Referências</span>
          </div>
        </div>
      </div>
    </div>
  );
}