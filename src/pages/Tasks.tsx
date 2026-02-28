"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { WeeklyBoard } from '@/components/tasks/WeeklyBoard';
import { MonthlyView } from '@/components/tasks/MonthlyView';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { Plus, Calendar, LayoutGrid, Search, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { format, startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TasksPage() {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
  const [columns, setColumns] = useState<Record<string, any[]>>({
    'Segunda': [], 'Terça': [], 'Quarta': [], 'Quinta': [], 'Sexta': [], 'Sábado': [], 'Domingo': []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, [currentDate]);

  async function fetchTasks() {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }

    const sOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const eOfWeek = endOfWeek(currentDate, { weekStartsOn: 1 });

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .gte('data', format(sOfWeek, 'yyyy-MM-dd'))
      .lte('data', format(eOfWeek, 'yyyy-MM-dd'));

    if (error) {
      toast.error("Erro ao carregar tarefas");
      setIsLoading(false);
      return;
    }

    const newColumns: Record<string, any[]> = {
      'Segunda': [], 'Terça': [], 'Quarta': [], 'Quinta': [], 'Sexta': [], 'Sábado': [], 'Domingo': []
    };

    const dayMap: Record<number, string> = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };

    (data || []).forEach(task => {
      const date = new Date(task.data + 'T12:00:00');
      const dayName = dayMap[date.getDay()];
      if (dayName && newColumns[dayName]) {
        newColumns[dayName].push({
          id: task.id,
          name: task.nome,
          time: task.horario,
          icon: task.emoji || '📝',
          priority: task.prioridade === 'Media' ? 'Média' : task.prioridade,
          period: task.periodo,
          status: task.status,
          date: task.data
        });
      }
    });

    setColumns(newColumns);
    setIsLoading(false);
  }

  const handleUpdateTask = async (taskId: string, updates: any) => {
    // Atualização local imediata
    setColumns(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(day => {
        next[day] = next[day].map(t => t.id === taskId ? { ...t, ...updates } : t);
      });
      return next;
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('tasks').update({
        nome: updates.name,
        horario: updates.time,
        prioridade: updates.priority === 'Média' ? 'Media' : updates.priority,
        periodo: updates.period,
        status: updates.status,
        emoji: updates.icon
      }).eq('id', taskId).eq('user_id', user.id);

      if (error) {
        toast.error("Erro ao salvar alterações");
        fetchTasks();
      }
    }
  };

  const handleDragEnd = async (taskId: string, dateStr: string, periodId: string, time: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('tasks').update({
        periodo: periodId,
        horario: time,
        data: dateStr
      }).eq('id', taskId).eq('user_id', user.id);

      if (error) {
        toast.error("Erro ao sincronizar movimento");
        fetchTasks();
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white selection:bg-[#6366f1]/30">
      <header className="h-20 shrink-0 border-b border-white/[0.04] px-8 flex items-center justify-between bg-[#050505]/80 backdrop-blur-xl z-30">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold tracking-tight">Tarefas</h1>
          <div className="flex bg-white/5 p-1 rounded-xl">
            <button 
              onClick={() => setView('weekly')}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                view === 'weekly' ? "bg-[#6366f1] text-white" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Calendar size={12} />
              Semana
            </button>
            <button 
              onClick={() => setView('monthly')}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                view === 'monthly' ? "bg-[#6366f1] text-white" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <LayoutGrid size={12} />
              Mês
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/[0.03]">
            <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-1 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-[11px] font-black uppercase tracking-widest min-w-[120px] text-center">
              {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "dd MMM", { locale: ptBR })} - {format(endOfWeek(currentDate, { weekStartsOn: 1 }), "dd MMM", { locale: ptBR })}
            </span>
            <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-1 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {view === 'weekly' ? (
          <WeeklyBoard 
            tasks={Object.values(columns).flat()} 
            isLoading={isLoading} 
            onUpdateTask={handleUpdateTask}
            onDragEndCallback={handleDragEnd}
          />
        ) : (
          <MonthlyView currentDate={currentDate} />
        )}
      </main>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={() => fetchTasks()} 
        selectedDay={format(new Date(), 'EEEE', { locale: ptBR })} 
      />

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-[#6366f1] rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group hover:shadow-[#6366f1]/40"
      >
        <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500" />
      </button>
    </div>
  );
}