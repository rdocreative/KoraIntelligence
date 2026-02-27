"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskPopoverProps {
  task: any;
  onClose: () => void;
  onSave: (updates: any) => void;
  position?: { top: number; left: number };
}

const PRIORITIES = ['Baixa', 'Média', 'Alta', 'Extrema'] as const;
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

export const TaskPopover = ({ task, onClose, onSave, position }: TaskPopoverProps) => {
  const [name, setName] = useState(task.name || "");
  const [icon, setIcon] = useState(task.icon || '📝');
  const [priority, setPriority] = useState(task.priority || 'Baixa');
  const [hour, setHour] = useState(task.time?.split(':')[0] || '09');
  const [minute, setMinute] = useState(task.time?.split(':')[1] || '00');
  
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSave = () => {
    onSave({
      name,
      icon: icon.charAt(0),
      priority,
      time: `${hour}:${minute}`
    });
    onClose();
  };

  const inputBaseClasses = "bg-white/[0.05] border border-white/[0.08] rounded-[10px] text-white focus:outline-none focus:border-[#6366f1]/50 transition-all placeholder:text-white/20";

  return (
    <div 
      ref={popoverRef}
      style={{
        background: '#0f1117',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        width: '280px',
        zIndex: 9999,
        position: 'fixed',
        top: position ? position.top : '50%',
        left: position ? position.left : '50%',
        transform: position ? 'none' : 'translate(-50%, -50%)',
      }}
      className="rounded-[10px] p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-1 duration-150 ease-out"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Editar Tarefa</span>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-white/5 rounded-full text-white/30 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Linha 1: Emoji + Nome */}
      <div className="flex gap-2">
        <input 
          type="text" 
          value={icon}
          onChange={(e) => setIcon(e.target.value.slice(-1))}
          className={cn(inputBaseClasses, "w-10 h-10 text-center text-lg p-0")}
          maxLength={1}
        />
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={cn(inputBaseClasses, "flex-1 px-3 py-2 text-sm")}
          placeholder="Nome da tarefa"
        />
      </div>

      {/* Linha 2: Prioridade */}
      <div className="relative">
        <select 
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className={cn(inputBaseClasses, "w-full h-10 px-3 text-xs font-medium appearance-none cursor-pointer")}
        >
          {PRIORITIES.map(p => <option key={p} value={p} className="bg-[#0f1117] text-white">{p}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
      </div>

      {/* Linha 3: Horário */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <select 
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className={cn(inputBaseClasses, "w-full h-10 px-3 text-sm appearance-none cursor-pointer text-center")}
          >
            {HOURS.map(h => <option key={h} value={h} className="bg-[#0f1117] text-white">{h}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
        </div>
        <span className="text-white/20 font-medium">:</span>
        <div className="relative flex-1">
          <select 
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className={cn(inputBaseClasses, "w-full h-10 px-3 text-sm appearance-none cursor-pointer text-center")}
          >
            {MINUTES.map(m => <option key={m} value={m} className="bg-[#0f1117] text-white">{m}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
        </div>
      </div>

      {/* Linha 4: Botão Salvar */}
      <button
        onClick={handleSave}
        className="w-full py-2.5 rounded-[10px] bg-[#6366f1] text-white font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#6366f1]/20 mt-1"
      >
        Salvar
      </button>
    </div>
  );
};