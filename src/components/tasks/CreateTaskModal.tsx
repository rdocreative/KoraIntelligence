"use client";

import React, { useState, useEffect } from 'react';
import { X, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  selectedDay: string;
}

const PRIORITIES = ['Baixa', 'Média', 'Extrema'] as const;

const getPeriodFromTime = (timeStr: string) => {
  const hour = parseInt(timeStr.split(':')[0]);
  if (hour >= 6 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 18) return 'Afternoon';
  if (hour >= 18 && hour < 24) return 'Evening';
  return 'Dawn';
};

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export const CreateTaskModal = ({ isOpen, onClose, onSave, selectedDay }: CreateTaskModalProps) => {
  const [name, setName] = useState('');
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [icon, setIcon] = useState('📝');
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('Baixa');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalTime = `${selectedHour}:${selectedMinute}`;
    const autoPeriod = getPeriodFromTime(finalTime);

    onSave({
      id: Math.random().toString(36).substr(2, 9),
      name,
      time: finalTime,
      icon,
      priority,
      period: autoPeriod,
    });
    
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-[#0C0C0C] border border-white/10 rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-serif font-medium text-white">Nova Tarefa</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Para {selectedDay}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">O que precisa ser feito?</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-12 h-12 bg-white/[0.03] border border-white/10 rounded-xl text-center text-lg focus:outline-none focus:border-[#38BDF8]/50 transition-all"
                placeholder="📝"
              />
              <input 
                autoFocus
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Reunião de Design"
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#38BDF8]/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Seletor de Horas (Estilo Relógio Digital Expandido) */}
            <div className="col-span-7 space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5">
                <Clock size={10} /> Horário ({selectedHour}:{selectedMinute})
              </label>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
                <div className="grid grid-cols-8 gap-1 mb-3">
                  {HOURS.map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setSelectedHour(h)}
                      className={cn(
                        "h-8 flex items-center justify-center rounded-lg text-[10px] font-bold transition-all",
                        selectedHour === h 
                          ? "bg-[#38BDF8] text-black shadow-lg shadow-[#38BDF8]/20" 
                          : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                      )}
                    >
                      {h}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 justify-center border-t border-white/5 pt-3">
                  {MINUTES.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMinute(m)}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                        selectedMinute === m 
                          ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30" 
                          : "text-zinc-600 hover:bg-white/5"
                      )}
                    >
                      :{m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Prioridade e Botão */}
            <div className="col-span-5 flex flex-col justify-between">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5">
                  <AlertCircle size={10} /> Prioridade
                </label>
                <div className="flex flex-col gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "w-full py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all text-left px-4 flex items-center justify-between",
                        priority === p 
                          ? "bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8]" 
                          : "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/10"
                      )}
                    >
                      {p}
                      {priority === p && <div className="w-1 h-1 rounded-full bg-[#38BDF8]" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-black font-bold text-xs h-12 rounded-xl transition-all shadow-lg shadow-[#38BDF8]/10 active:scale-95 mt-4"
              >
                Criar Tarefa
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};