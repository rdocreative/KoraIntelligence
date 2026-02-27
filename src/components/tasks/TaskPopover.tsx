"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Clock, ChevronDown } from 'lucide-react';
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

  return (
    <div 
      ref={popoverRef}
      style={{
        background: '#1a1c24',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        width: '260px',
        zIndex: 9999,
        position: position ? 'fixed' : 'absolute',
        top: position ? position.top : 0,
        left: position ? position.left : '105%',
      }}
      className="rounded-[16px] p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-left-2 duration-200"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Editar</span>
        <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full text-zinc-500 transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={icon}
            onChange={(e) => setIcon(e.target.value.slice(-1))}
            className="w-12 h-10 bg-white/[0.03] border border-white/5 rounded-xl text-center text-lg focus:outline-none focus:border-[#6366f1]/50 transition-all"
            maxLength={1}
          />
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#6366f1]/50 transition-all"
          />
        </div>

        <div className="relative">
          <select 
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="w-full h-10 bg-white/[0.03] border border-white/5 rounded-xl px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-300 appearance-none cursor-pointer focus:outline-none focus:border-[#6366f1]/50 transition-all"
          >
            {PRIORITIES.map(p => <option key={p} value={p} className="bg-[#1a1c24]">{p}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>

        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <select 
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="w-full h-10 bg-white/[0.03] border border-white/5 rounded-xl px-2 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-[#6366f1]/50 transition-all text-center"
            >
              {HOURS.map(h => <option key={h} value={h} className="bg-[#1a1c24]">{h}</option>)}
            </select>
            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
          <span className="text-zinc-600 font-bold">:</span>
          <div className="relative flex-1">
            <select 
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="w-full h-10 bg-white/[0.03] border border-white/5 rounded-xl px-2 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-[#6366f1]/50 transition-all text-center"
            >
              {MINUTES.map(m => <option key={m} value={m} className="bg-[#1a1c24]">{m}</option>)}
            </select>
            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-2.5 rounded-xl bg-[#6366f1] text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-[#6366f1]/10 hover:bg-[#6366f1]/90 transition-all"
      >
        Salvar
      </button>
    </div>
  );
};