"use client";

import React, { useState, useRef } from "react";
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Sun, 
  Moon, 
  Coffee, 
  Clock, 
  CalendarDays, 
  MoreHorizontal,
  Circle,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

const theme = {
  morning: { bg: 'rgba(251, 146, 60, 0.08)', text: '#FB923C', icon: '#F97316' },
  afternoon: { bg: 'rgba(34, 197, 94, 0.1)', text: '#4ADE80', icon: '#22C55E' },
  evening: { bg: 'rgba(139, 92, 246, 0.1)', text: '#A78BFA', icon: '#8B5CF6' },
  anytime: { bg: 'rgba(156, 163, 175, 0.1)', text: '#D1D5DB', icon: '#9CA3AF' },
  primary: '#38BDF8',
};

const priorityWeight: Record<string, number> = { 'Extrema': 1, 'Média': 2, 'Baixa': 3, undefined: 4 };

export default function TasksPage() {
  const [taskGroups, setTaskGroups] = useState<any>({
    'Qualquer Hora': [{ name: 'Beber água (3L)', time: 'Meta diária', icon: '💧', active: false, priority: 'Média' }],
    'Manhã': [
      { name: 'Rotina Matinal', time: '1h', icon: '🌅', active: false, priority: 'Baixa' }, 
      { name: 'Reunião de Equipa', time: '09:30 → 10:30', icon: '💬', active: true, priority: 'Extrema' }
    ],
    'Tarde': [
      { name: 'Almoço Saudável', time: '12:30 → 13:30', icon: '🥗', active: false, priority: 'Baixa' }, 
      { name: 'Deep Work: Design', time: '14:00 → 16:30', icon: '💻', active: false, priority: 'Extrema' }
    ],
    'Noite': [
      { name: 'Treino (Ginásio)', time: '18:30 → 19:30', icon: '🏋️‍♂️', active: false, priority: 'Média' }, 
      { name: 'Rotina Noturna', time: '1h', icon: '🛌', active: false, priority: 'Baixa' }
    ]
  });

  const dragItem = useRef<any>(null);

  const handleDragStart = (e: any, period: string, index: number) => {
    dragItem.current = { period, index };
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = '0.4';
  };

  const handleDragEnter = (e: any, targetPeriod: string, targetIndex: number) => {
    e.preventDefault();
    if (!dragItem.current) return;

    const source = dragItem.current;
    if (source.period === targetPeriod && source.index === targetIndex) return;

    setTaskGroups((prev: any) => {
      const item = prev[source.period][source.index];
      if (!item) return prev;

      const newGroups = { ...prev };
      
      if (source.period === targetPeriod) {
        const newList = [...prev[source.period]];
        newList.splice(source.index, 1);
        newList.splice(targetIndex, 0, item);
        newGroups[source.period] = newList;
      } else {
        const sourceList = [...prev[source.period]];
        const targetList = [...prev[targetPeriod]];
        sourceList.splice(source.index, 1);
        targetList.splice(targetIndex, 0, item);
        newGroups[source.period] = sourceList;
        newGroups[targetPeriod] = targetList;
      }
      
      dragItem.current = { period: targetPeriod, index: targetIndex };
      return newGroups;
    });
  };

  const handleDragEnd = (e: any) => {
    e.target.style.opacity = '1';
    dragItem.current = null;
  };

  return (
    <div className="flex-1 flex flex-col space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between sticky top-0 backdrop-blur-xl z-20 py-4">
        <div className="flex items-center gap-4">
          <button className="p-1.5 border border-white/10 rounded-xl hover:bg-white/5 text-zinc-400 transition-colors">
            <CalendarDays size={16} />
          </button>
          <div className="flex items-center gap-3">
            <button className="p-1 text-gray-400 hover:text-white transition-colors"><ChevronLeft size={18} /></button>
            <h2 className="text-3xl font-serif text-white tracking-tight">Fevereiro 2026</h2>
            <button className="p-1 text-gray-400 hover:text-white transition-colors"><ChevronRight size={18} /></button>
          </div>
          <span className="text-xs font-medium bg-white/10 px-2.5 py-1 rounded-full ml-2" style={{ color: theme.primary }}>Hoje</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 cursor-pointer">
            <span>Visão</span>
            <ChevronDown size={14} />
          </div>
          <button className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5">
             <MoreHorizontal size={16} className="text-zinc-400" />
          </button>
        </div>
      </header>

      <div className="max-w-3xl space-y-8 pb-12">
        <div className="flex flex-col items-center mb-10 w-16">
          <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-1">QUA</span>
          <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-xl font-serif text-white bg-[#1A1A20] shadow-sm">
            25
          </div>
        </div>

        {[
          { period: 'Qualquer Hora', icon: Clock, theme: theme.anytime, grad: 'linear-gradient(135deg, rgba(156, 163, 175, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)' },
          { period: 'Manhã', icon: Sun, theme: theme.morning, grad: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(255, 255, 255, 0.01) 100%)' },
          { period: 'Tarde', icon: Coffee, theme: theme.afternoon, grad: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(255, 255, 255, 0.01) 100%)' },
          { period: 'Noite', icon: Moon, theme: theme.evening, grad: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(255, 255, 255, 0.01) 100%)' }
        ].map((section, idx) => {
          const tasks = [...(taskGroups[section.period] || [])].sort((a, b) => 
            priorityWeight[a.priority] - priorityWeight[b.priority]
          );

          return (
            <div key={idx} className="relative overflow-hidden rounded-[24px] border border-white/5 p-6 backdrop-blur-2xl" style={{ background: section.grad }}>
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/5 shadow-inner">
                    <section.icon size={18} style={{ color: section.theme.icon }} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: section.theme.text }}>
                    {section.period}
                  </span>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                  <Plus size={16} />
                </button>
              </div>

              <div 
                className="space-y-3 min-h-[60px]"
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => tasks.length === 0 && handleDragEnter(e, section.period, 0)}
              >
                {tasks.map((task: any, tIdx: number) => (
                  <div 
                    key={`${section.period}-${tIdx}`} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, section.period, tIdx)}
                    onDragEnter={(e) => handleDragEnter(e, section.period, tIdx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    className={cn(
                      "group flex items-center justify-between p-4 rounded-[24px] border cursor-grab active:cursor-grabbing transition-all",
                      task.active ? 'bg-white/[0.05] border-white/20 shadow-sm' : 'bg-transparent border-white/[0.02] hover:border-white/10 hover:bg-white/[0.02]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                        {task.icon}
                      </div>
                      <div className="ml-1">
                        <div className="flex items-center gap-4">
                          <h4 className={cn("text-[15px] font-semibold tracking-tight", task.active ? 'text-white' : 'text-zinc-300')}>{task.name}</h4>
                          {task.priority && (
                            <span className={cn(
                              "text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border shadow-sm",
                              task.priority === 'Extrema' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                              task.priority === 'Média' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 
                              'bg-sky-500/20 text-sky-400 border-sky-500/30'
                            )}>
                              {task.priority}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] font-medium text-zinc-500 mt-1.5">{task.time}</p>
                      </div>
                    </div>
                    <Circle size={22} className="text-zinc-600 group-hover:text-zinc-400 transition-colors mr-2" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}