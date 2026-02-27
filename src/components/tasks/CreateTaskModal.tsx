"use client";

import React, { useState } from 'react';
import { X, Clock, AlertCircle, Calendar, Tag, Repeat, Bell, AlignLeft } from 'lucide-react';
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

const REPETITION_OPTIONS = ['Nunca', 'Diário', 'Semanal', 'Mensal'];
const REMINDER_OPTIONS = [
  { label: 'No horário', value: '0' },
  { label: '15 min antes', value: '15' },
  { label: '30 min antes', value: '30' },
  { label: '1 hora antes', value: '60' }
];

const priorityStyles = {
  Baixa: {
    active: "bg-gradient-to-br from-sky-500/20 to-sky-500/5 border-sky-500/40 text-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.1)]",
    inactive: "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-sky-500/20 hover:text-sky-500/40"
  },
  Média: {
    active: "bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-orange-500/40 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.1)]",
    inactive: "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-orange-500/20 hover:text-orange-500/40"
  },
  Extrema: {
    active: "bg-gradient-to-br from-red-500/20 to-red-500/5 border-red-500/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]",
    inactive: "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-red-500/20 hover:text-red-500/40"
  }
};

export const CreateTaskModal = ({ isOpen, onClose, onSave, selectedDay }: CreateTaskModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [repetition, setRepetition] = useState('Nunca');
  const [reminder, setReminder] = useState('0');
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
      description,
      date,
      category,
      repetition,
      reminder,
      time,
      icon,
      priority,
      period,
    });
    
    // Reset form
    setName('');
    setDescription('');
    setDate('');
    setCategory('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-[#0C0C0C] border border-white/10 rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-serif font-medium text-white">Nova Tarefa</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Para {selectedDay}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome e Ícone */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Tarefa</label>
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

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5">
              <AlignLeft size={10} /> Descrição (Opcional)
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes sobre a tarefa..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#38BDF8]/50 transition-all resize-none h-20"
            />
          </div>

          {/* Grid de Detalhes Adicionais */}
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5">
                <Calendar size={10} /> Data
              </label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white focus:outline-none focus:border-[#38BDF8]/50 transition-all [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5">
                <Tag size={10} /> Categoria
              </label>
              <input 
                type="text" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Trabalho"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#38BDF8]/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5">
                <Repeat size={10} /> Repetição
              </label>
              <select 
                value={repetition}
                onChange={(e) => setRepetition(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white focus:outline-none focus:border-[#38BDF8]/50 transition-all appearance-none cursor-pointer"
              >
                {REPETITION_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-[#0C0C0C]">{opt}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5">
                <Bell size={10} /> Lembrete
              </label>
              <select 
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white focus:outline-none focus:border-[#38BDF8]/50 transition-all appearance-none cursor-pointer"
              >
                {REMINDER_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-[#0C0C0C]">{opt.label}</option>)}
              </select>
            </div>
          </div>

          {/* Grid de Ações Inferiores */}
          <div className="grid grid-cols-12 gap-4 items-end pt-2">
            <div className="col-span-2 space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5">
                <Clock size={10} /> Horário
              </label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]/50 transition-all [color-scheme:dark]"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Período</label>
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]/50 transition-all appearance-none cursor-pointer"
              >
                {PERIODS.map(p => <option key={p.id} value={p.id} className="bg-[#0C0C0C]">{p.label}</option>)}
              </select>
            </div>

            <div className="col-span-5 space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5">
                <AlertCircle size={10} /> Prioridade
              </label>
              <div className="flex gap-1.5 h-10">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "flex-1 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all duration-300",
                      priority === p 
                        ? priorityStyles[p].active 
                        : priorityStyles[p].inactive
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-3">
              <button
                type="submit"
                className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-black font-bold text-xs h-10 rounded-xl transition-all shadow-lg shadow-[#38BDF8]/10 active:scale-95"
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