"use client";

import React, { useState, useEffect } from 'react';
import { Check, X, Clock } from 'lucide-react';
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

export const TimeAdjustmentPopup = ({ 
  targetPeriod, 
  currentTime, 
  onConfirm, 
  onCancel 
}: TimeAdjustmentPopupProps) => {
  const [newTime, setNewTime] = useState(PERIOD_DEFAULTS[targetPeriod] || currentTime);

  return (
    <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md rounded-[20px] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200 border border-[#38BDF8]/30">
      <div className="flex flex-col items-center text-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8]">
          <Clock size={16} />
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#38BDF8]">Novo Período</p>
          <p className="text-[12px] font-bold text-white">{PERIOD_LABELS[targetPeriod]}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="relative">
          <input 
            type="time" 
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center text-sm text-white focus:outline-none focus:border-[#38BDF8]/50 transition-all [color-scheme:dark]"
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onCancel}
            className="flex-1 h-9 rounded-lg border border-white/5 hover:bg-white/5 text-zinc-400 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
          <button 
            onClick={() => onConfirm(newTime)}
            className="flex-1 h-9 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-black flex items-center justify-center transition-colors shadow-lg shadow-[#38BDF8]/10"
          >
            <Check size={16} strokeWidth={3} />
          </button>
        </div>
      </div>

      <p className="mt-3 text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">
        Cancelar para desfazer movimento
      </p>
    </div>
  );
};