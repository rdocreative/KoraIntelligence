"use client";

import React, { useState } from 'react';
import { X, Clock, AlertCircle, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  selectedDay: string;
}

const PRIORITIES = ['Baixa', 'Média', 'Extrema'] as const;
const PERIODS = [
  { id: 'Morning', label: 'Manhã' },
  { id: 'Afternoon', label: 'Tarde' },
  { id: 'Evening', label: 'Noite' },
  { id: 'Dawn', label: 'Madrugada' }
];

export const CreateTaskModal = ({ isOpen, onClose, onSave, selectedDay }: CreateTaskModalProps) => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('09:00');
  const [icon, setIcon] = useState('📝');
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('Baixa');
  const [period, setPeriod] = useState('Morning');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: Math.random().toString(36).substr(2, 9),
      name,
      time,
      icon,
      priority,
      period,
    });
    
    // Reset form
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-[#0C0C0C] border border-white/10 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-medium text-white">Nova Tarefa</h2>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">Para {selectedDay}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">O que precisa ser feito?</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-12 h-12 bg-white/[0.03] border border-white/10 rounded-2xl text-center text-xl focus:outline-none focus:border-[#38BDF8]/50 transition-all"
                placeholder="📝"
              />
              <input 
                autoFocus
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Reunião de Design"
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#38BDF8]/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5">
                <Clock size={10} /> Horário
              </label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#38BDF8]/50 transition-all [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Período</label>
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#38BDF8]/50 transition-all appearance-none cursor-pointer"
              >
                {PERIODS.map(p => <option key={p.id} value={p.id} className="bg-[#0C0C0C]">{p.label}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5">
              <AlertCircle size={10} /> Prioridade
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                    priority === p 
                      ? "bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8]" 
                      : "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/10"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-black font-bold text-sm py-4 rounded-2xl transition-all shadow-lg shadow-[#38BDF8]/10 mt-4 active:scale-95"
          >
            Criar Tarefa
          </button>
        </form>
      </div>
    </div>
  );
};