"use client";

import React, { useState } from 'react';
import { Check, X, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeAdjustmentPopupProps {
  targetPeriod: string;
  currentTime: string;
  onConfirm: (newTime: string) => void;
  onCancel: () => void;
}

const PERIOD_DEFAULTS: Record<string, string> = {
  Morning: "09:00",
  Afternoon: "14:00",
  Evening: "19:00",
  Dawn: "02:00"
};

const PERIOD_LABELS: Record<string, string> = {
  Morning: "Manhã",
  Afternoon: "Tarde",
  Evening: "Noite",
  Dawn: "Madrugada"
};

const PERIOD_COLORS: Record<string, string> = {
  Morning: "text-orange-400",
  Afternoon: "text-emerald-400",
  Evening: "text-indigo-400",
  Dawn: "text-blue-400"
};

export const TimeAdjustmentPopup = ({ 
  targetPeriod, 
  currentTime, 
  onConfirm, 
  onCancel 
}: TimeAdjustmentPopupProps) => {
  const [newTime, setNewTime] = useState(PERIOD_DEFAULTS[targetPeriod] || currentTime);

  return (
    <div className="absolute inset-0 z-[100] bg-black/40 backdrop-blur-[12px] rounded-[20px] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300 ring-1 ring-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      {/* Glow de Fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/10 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#38BDF8] mb-3 shadow-inner">
            <Clock size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Mudar para</p>
            <h3 className={cn("text-lg font-serif font-medium", PERIOD_COLORS[targetPeriod])}>
              {PERIOD_LABELS[targetPeriod]}
            </h3>
          </div>
        </div>

        {/* Input de Horário */}
        <div className="w-full space-y-4 mb-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#38BDF8]/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-[#0C0C0C] border border-white/10 rounded-2xl overflow-hidden">
              <input 
                type="time" 
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full bg-transparent px-4 py-3.5 text-center text-xl font-bold text-white focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>
          
          {/* Ações */}
          <div className="flex gap-2 w-full">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              className="flex-1 h-12 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 text-zinc-400 flex items-center justify-center transition-all active:scale-95"
              title="Cancelar movimento"
            >
              <X size={20} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onConfirm(newTime);
              }}
              className="flex-[2] h-12 rounded-2xl bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-black flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(56,189,248,0.2)] active:scale-95"
            >
              <Check size={18} strokeWidth={3} />
              Confirmar
            </button>
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="text-[9px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors flex items-center gap-1.5"
        >
          <Sparkles size={10} />
          Desfazer Ação
        </button>
      </div>
    </div>
  );
};