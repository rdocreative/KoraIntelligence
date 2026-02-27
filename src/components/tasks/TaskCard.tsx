"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Circle, Clock, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskPopover } from './TaskPopover';

interface TaskCardProps {
  task: {
    id: string;
    name: string;
    time?: string;
    icon?: string;
    priority?: 'Extrema' | 'Alta' | 'Média' | 'Baixa';
    period?: string;
  };
  isAwaitingTime?: boolean;
  onUpdateTime?: (newTime: string) => void;
  onUpdateTask?: (taskId: string, updates: any) => void;
  defaultPeriodTime?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

export const TaskCard = ({ task, isAwaitingTime, onUpdateTime, onUpdateTask, defaultPeriodTime }: TaskCardProps) => {
  const initialTime = task.time || defaultPeriodTime || '09:00';
  const [hour, setHour] = useState(initialTime.split(':')[0] || '09');
  const [minute, setMinute] = useState(initialTime.split(':')[1] || '00');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAwaitingTime) {
      const currentTime = task.time || defaultPeriodTime || '09:00';
      setHour(currentTime.split(':')[0]);
      setMinute(currentTime.split(':')[1]);
    }
  }, [isAwaitingTime, task.time, defaultPeriodTime]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: task.id,
    disabled: isAwaitingTime || isPopoverOpen
  });

  // Função para setar o nó de referência para o dnd-kit e o cardRef local
  const setRefs = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    (cardRef as any).current = node;
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none',
  };

  const priorityColors = {
    Extrema: 'bg-red-500/20 text-red-400 border-red-500/30',
    Alta: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Média: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Baixa: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  const periodStyles: Record<string, string> = {
    Morning: "border-orange-500/10 hover:border-orange-500/30",
    Afternoon: "border-green-500/10 hover:border-green-500/30",
    Evening: "border-indigo-500/10 hover:border-indigo-500/30",
    Dawn: "border-sky-500/10 hover:border-sky-500/30",
  };

  const periodGradients: Record<string, string> = {
    Morning: "linear-gradient(180deg, rgba(249,115,22,0.13) 0%, rgba(249,115,22,0.02) 100%)",
    Afternoon: "linear-gradient(180deg, rgba(34,197,94,0.13) 0%, rgba(34,197,94,0.02) 100%)",
    Evening: "linear-gradient(180deg, rgba(129,140,248,0.13) 0%, rgba(129,140,248,0.02) 100%)",
    Dawn: "linear-gradient(180deg, rgba(56,189,248,0.13) 0%, rgba(56,189,248,0.02) 100%)",
  };

  const handleConfirm = () => {
    onUpdateTime?.(`${hour}:${minute}`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.checkbox-trigger')) return;
    
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPopoverPosition({
        top: rect.top,
        left: rect.right + 10
      });
      setIsPopoverOpen(true);
    }
  };

  return (
    <div
      ref={setRefs}
      style={style}
      {...attributes}
      {...listeners}
      data-draggable="true"
      className="relative group/card"
      onClick={handleCardClick}
    >
      <div
        className={cn(
          "group relative flex flex-col p-4 rounded-[20px] border transition-all cursor-grab active:cursor-grabbing overflow-hidden min-h-[90px]",
          task.period ? periodStyles[task.period] : 'border-white/5 hover:border-white/10',
          isDragging && "z-50 border-[#6366f1]/50 shadow-2xl bg-white/[0.08]"
        )}
        style={{
          background: task.period ? periodGradients[task.period] : 'rgba(255,255,255,0.03)'
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center text-lg">
              {task.icon || '📝'}
            </div>
            <h4 className="text-[13px] font-semibold text-zinc-100 line-clamp-1">{task.name}</h4>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-3">
            {task.priority && (
              <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border", priorityColors[task.priority])}>
                {task.priority}
              </span>
            )}
            {task.time && !isAwaitingTime && (
              <div className="flex items-center gap-1 text-[11px] text-white/75 font-medium">
                <Clock size={10} className="text-zinc-400" />
                {task.time}
              </div>
            )}
          </div>
          <div className="checkbox-trigger">
            <Circle size={16} className="text-zinc-500 hover:text-zinc-200 transition-colors" />
          </div>
        </div>

        {/* Time Adjust Overlay */}
        {isAwaitingTime && (
          <div 
            className="absolute inset-0 bg-[#0C0C0C]/95 backdrop-blur-md z-20 flex flex-col p-4 animate-in fade-in zoom-in-95 duration-200 rounded-[20px]"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock size={12} className="text-[#6366f1]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Novo Horário</span>
            </div>
            
            <div className="flex gap-2 flex-1 items-center">
              <div className="flex-1 flex gap-1.5 h-10">
                <div className="relative flex-1">
                  <select 
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="w-full h-full bg-white/[0.05] border border-white/10 rounded-xl px-2 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-[#6366f1]/50 transition-all text-center"
                  >
                    {HOURS.map(h => (
                      <option key={h} value={h} className="bg-[#0C0C0C]">{h}</option>
                    ))}
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>

                <span className="text-zinc-600 flex items-center">:</span>

                <div className="relative flex-1">
                  <select 
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="w-full h-full bg-white/[0.05] border border-white/10 rounded-xl px-2 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-[#6366f1]/50 transition-all text-center"
                  >
                    {MINUTES.map(m => (
                      <option key={m} value={m} className="bg-[#0C0C0C]">{m}</option>
                    ))}
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                className="w-10 h-10 bg-[#6366f1] text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#6366f1]/20 shrink-0"
              >
                <Check size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </div>

      {isPopoverOpen && createPortal(
        <TaskPopover 
          task={task} 
          position={popoverPosition}
          onClose={() => setIsPopoverOpen(false)}
          onSave={(updates) => onUpdateTask?.(task.id, updates)}
        />,
        document.body
      )}
    </div>
  );
};