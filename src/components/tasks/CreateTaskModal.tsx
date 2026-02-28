"use client";

import React, { useState } from 'react';
import { X, Clock, AlertCircle, Calendar, Tag, Repeat, Bell, AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from 'date-fns';

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

const priorityStyles = {
  Baixa: { active: "bg-blue-500/20 border-blue-500/40 text-blue-400", inactive: "bg-white/[0.02] border-white/5 text-zinc-500" },
  Média: { active: "bg-orange-500/20 border-orange-500/40 text-orange-400", inactive: "bg-white/[0.02] border-white/5 text-zinc-500" },
  Extrema: { active: "bg-red-500/20 border-red-500/40 text-red-400", inactive: "bg-white/[0.02] border-white/5 text-zinc-500" }
};

export const CreateTaskModal = ({ isOpen, onClose, onSave, selectedDay }: CreateTaskModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [category, setCategory] = useState('');
  const [time, setTime] = useState('09:00');
  const [icon, setIcon] = useState('📝');
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('Baixa');
  const [period, setPeriod] = useState('Morning');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const dbPriority = priority === 'Média' ? 'Media' : priority;

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          nome: name,
          descricao: description,
          data: date,
          categoria: category || 'Geral',
          horario: time,
          emoji: icon,
          prioridade: dbPriority,
          periodo: period,
          status: 'pendente'
        })
        .select()
        .single();

      if (error) throw error;

      onSave({
        id: data.id,
        name: data.nome,
        description: data.descricao,
        date: new Date(data.data + 'T12:00:00'),
        category: data.categoria,
        time: data.horario,
        icon: data.emoji,
        priority: data.prioridade,
        period: data.periodo,
        status: data.status
      });
      
      setName('');
      setDescription('');
      toast.success("Tarefa criada!");
      onClose();
    } catch (err) {
      toast.error("Erro ao criar tarefa");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0C0C0C] border border-white/10 rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Nova Tarefa</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Para {selectedDay}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Tarefa</label>
            <div className="flex gap-3">
              <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} className="w-12 h-12 bg-white/[0.03] border border-white/10 rounded-xl text-center text-lg focus:outline-none" maxLength={1} />
              <input autoFocus type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Reunião de Design" className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5"><Calendar size={10} /> Data</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white [color-scheme:dark]" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5"><Tag size={10} /> Categoria</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Trabalho" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-end pt-2">
            <div className="col-span-3 space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-1.5"><Clock size={10} /> Horário</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white [color-scheme:dark]" />
            </div>
            <div className="col-span-3 space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Período</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white appearance-none">
                {PERIODS.map(p => <option key={p.id} value={p.id} className="bg-[#0C0C0C]">{p.label}</option>)}
              </select>
            </div>
            <div className="col-span-6 space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Prioridade</label>
              <div className="flex gap-1.5 h-10">
                {PRIORITIES.map((p) => (
                  <button key={p} type="button" onClick={() => setPriority(p)} className={cn("flex-1 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all", priority === p ? priorityStyles[p].active : priorityStyles[p].inactive)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSaving} className="w-full bg-[#6366f1] hover:bg-[#6366f1]/90 text-white font-bold text-xs h-12 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50">
            {isSaving ? "Salvando..." : "Criar Tarefa"}
          </button>
        </form>
      </div>
    </div>
  );
};