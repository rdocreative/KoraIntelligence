"use client";

import React, { useState } from 'react';
import { X, Clock, AlertCircle, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  name: string;
  time: string;
  icon: string;
  priority: 'Baixa' | 'Média' | 'Alta' | 'Extrema';
  period: string;
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Partial<Task>) => void;
  task: any;
}

const PRIORITIES = ['Baixa', 'Média', 'Alta', 'Extrema'] as const;
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

export const EditTaskModal = ({ isOpen, onClose, onSave, task }: EditTaskModalProps) => {
  const [name, setName] = useState(task.name);
  const [icon, setIcon] = useState(task.icon || '📝');
  const [priority, setPriority] = useState(task.priority || 'Baixa');
  const [hour, setHour] = useState(task.time?.split(':')[0] || '09');
  const [minute, setMinute] = useState(task.time?.split(':')[1] || '00');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name,
      icon: icon.charAt(0) + (icon.length > 1 && icon.charCodeAt(0) > 255 ? '' : ''), // Tenta manter apenas o emoji
      priority,
      time: `${hour}:${minute}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#0C0C0C] border border-white/10 rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-medium text-white">Editar Tarefa</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emoji e Nome */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Ícone & Nome</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={icon}
                onChange={(e) => setIcon(e.target.value.slice(-2))}
                className="w-12 h-12 bg-white/[0.03] border border-white/10 rounded-xl text-center text-lg focus:outline-none focus:border-[#6366f1]/50 transition-all"
                maxLength={2}
              />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da tarefa"
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition-all"
              />
            </div>
          </div>

          {/* Prioridade */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5">
              <AlertCircle size={10} /> Prioridade
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                    priority === p 
                      ? "bg-[#6366f1]/20 border-[#6366f1]/40 text-[#6366f1] shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                      : "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/20"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Horário */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5">
              <Clock size={10} /> Horário
            </label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <select 
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-[#6366f1]/50 transition-all"
                >
                  {HOURS.map(h => <option key={h} value={h} className="bg-[#0C0C0C]">{h}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
              <span className="text-zinc-600 font-bold">:</span>
              <div className="relative flex-1">
                <select 
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-[#6366f1]/50 transition-all"
                >
                  {MINUTES.map(m => <option key={m} value={m} className="bg-[#0C0C0C]">{m}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-zinc-400 font-bold text-xs hover:bg-white/10 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-[#6366f1] text-white font-bold text-xs shadow-lg shadow-[#6366f1]/20 hover:bg-[#6366f1]/90 transition-all"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};