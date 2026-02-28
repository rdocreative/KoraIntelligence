"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Calendar, 
  Clock, 
  Type, 
  AlignLeft, 
  CheckCircle2,
  AlertTriangle,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  selectedDay?: string;
  editTask?: any;
}

const PRIORITIES = [
  { value: 'Baixa', label: 'Baixa', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { value: 'Media', label: 'Média', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { value: 'Extrema', label: 'Extrema', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
];

const PERIODS = [
  { value: 'Dawn', label: 'Madrugada', emoji: '🌙' },
  { value: 'Morning', label: 'Manhã', emoji: '☀️' },
  { value: 'Afternoon', label: 'Tarde', emoji: '🌤️' },
  { value: 'Evening', label: 'Noite', emoji: '🌚' },
];

export function CreateTaskModal({ isOpen, onClose, onSave, editTask }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    data: new Date().toISOString().split('T')[0],
    horario: "09:00",
    prioridade: "Media",
    periodo: "Morning",
    emoji: "📝"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTask) {
      setFormData({
        nome: editTask.name || "",
        descricao: editTask.description || "",
        data: editTask.date || new Date().toISOString().split('T')[0],
        horario: editTask.time || "09:00",
        prioridade: editTask.priority === 'Média' ? 'Media' : editTask.priority,
        periodo: editTask.period || "Morning",
        emoji: editTask.icon || "📝"
      });
    } else {
      setFormData({
        nome: "",
        descricao: "",
        data: new Date().toISOString().split('T')[0],
        horario: "09:00",
        prioridade: "Media",
        periodo: "Morning",
        emoji: "📝"
      });
    }
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      if (editTask) {
        const { error } = await supabase
          .from('tasks')
          .update({
            ...formData,
            user_id: user.id
          })
          .eq('id', editTask.id);
        
        if (error) throw error;
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert([{
            ...formData,
            user_id: user.id,
            status: 'pendente'
          }]);
        
        if (error) throw error;
        toast.success("Tarefa criada com sucesso!");
      }

      onSave(formData);
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar tarefa:", error);
      toast.error("Erro ao salvar tarefa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-[500px] bg-[#111113] border border-white/5 rounded-3xl shadow-2xl animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
        <header className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center text-[#6366f1]">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{editTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
              <p className="text-xs text-white/40">Planeje seu próximo passo</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-white/20 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Type size={12} /> Título da Tarefa
              </label>
              <input
                autoFocus
                type="text"
                required
                value={formData.nome}
                onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Treino de pernas"
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1]/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Calendar size={12} /> Data
                </label>
                <input
                  type="date"
                  required
                  value={formData.data}
                  onChange={e => setFormData(prev => ({ ...prev, data: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Clock size={12} /> Horário
                </label>
                <input
                  type="time"
                  required
                  value={formData.horario}
                  onChange={e => setFormData(prev => ({ ...prev, horario: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2 ml-1">
                <AlertTriangle size={12} /> Prioridade
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRIORITIES.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, prioridade: p.value }))}
                    className={cn(
                      "py-2.5 rounded-xl text-[11px] font-bold border transition-all",
                      formData.prioridade === p.value
                        ? p.color
                        : "bg-white/[0.02] border-white/5 text-white/30 hover:bg-white/[0.05]"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2 ml-1">
                Período do Dia
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PERIODS.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, periodo: p.value }))}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all",
                      formData.periodo === p.value
                        ? "bg-[#6366f1]/10 border-[#6366f1]/20 text-[#6366f1]"
                        : "bg-white/[0.02] border-white/5 text-white/30 hover:bg-white/[0.05]"
                    )}
                  >
                    <span className="text-lg">{p.emoji}</span>
                    <span className="text-[10px] font-bold uppercase">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2 ml-1">
                <AlignLeft size={12} /> Descrição (Opcional)
              </label>
              <textarea
                value={formData.descricao}
                onChange={e => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Detalhes sobre a tarefa..."
                rows={3}
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all resize-none"
              />
            </div>
          </div>

          <footer className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl text-[13px] font-bold text-white/40 hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3.5 rounded-xl bg-[#6366f1] hover:bg-[#6366f1]/90 text-white text-[13px] font-bold shadow-lg shadow-[#6366f1]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Salvando..." : editTask ? 'Atualizar Tarefa' : 'Criar Tarefa'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}