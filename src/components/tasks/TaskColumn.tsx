"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Sun, Moon, Coffee, CloudMoon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
  isToday?: boolean;
}

const PERIODS = [
  { 
    id: 'Morning', 
    label: 'Manhã', 
    time: '06:00 — 12:00',
    icon: Sun, 
    color: '#FDBA74',
    gradient: 'linear-gradient(180deg, rgba(253, 186, 116, 0.08) 0%, rgba(253, 186, 116, 0.01) 100%)',
    startHour: 6,
    endHour: 12
  },
  { 
    id: 'Afternoon', 
    label: 'Tarde', 
    time: '12:00 — 18:00',
    icon: Coffee, 
    color: '#4ADE80',
    gradient: 'linear-gradient(180deg, rgba(74, 222, 128, 0.08) 0%, rgba(74, 222, 128, 0.01) 100%)',
    startHour: 12,
    endHour: 18
  },
  { 
    id: 'Evening', 
    label: 'Noite', 
    time: '18:00 — 00:00',
    icon: Moon, 
    color: '#A78BFA',
    gradient: 'linear-gradient(180deg, rgba(167, 139, 250, 0.08) 0%, rgba(167, 139, 250, 0.01) 100%)',
    startHour: 18,
    endHour: 24
  },
  { 
    id: 'Dawn', 
    label: 'Madrugada', 
    time: '00:00 — 06:00',
    icon: CloudMoon, 
    color: '#818CF8',
    gradient: 'linear-gradient(180deg, rgba(129, 140, 248, 0.08) 0%, rgba(129, 140, 248, 0.01) 100%)',
    startHour: 0,
    endHour: 6
  },
];

const PeriodContainer = ({ 
  dayId, 
  period, 
  tasks,
  isToday
}: { 
  dayId: string; 
  period: typeof PERIODS[0]; 
  tasks: any[];
  isToday?: boolean;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${dayId}:${period.id}`,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Monitorar redimensionamento do container para desenhar o SVG corretamente
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calcular progresso do tempo
  useEffect(() => {
    if (!isToday) return;

    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const totalCurrentMinutes = currentHour * 60 + currentMinute;

      const startMinutes = period.startHour * 60;
      const endMinutes = period.endHour * 60; // Nota: 24 * 60 = 1440

      let isCurrentPeriod = false;

      // Lógica especial para virada do dia (ex: se precisasse cruzar meia noite, mas aqui definimos Dawn como 0-6 e Evening como 18-24, o que simplifica)
      if (currentHour >= period.startHour && currentHour < period.endHour) {
        isCurrentPeriod = true;
      }

      setIsActive(isCurrentPeriod);

      if (isCurrentPeriod) {
        const durationMinutes = endMinutes - startMinutes;
        const elapsedMinutes = totalCurrentMinutes - startMinutes;
        const percentage = Math.min(100, Math.max(0, (elapsedMinutes / durationMinutes) * 100));
        setProgress(percentage);
      } else {
        setProgress(0);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, [isToday, period]);

  // Função para gerar o path do SVG começando do Topo-Centro
  const getPath = (w: number, h: number, r: number) => {
    if (w === 0 || h === 0) return "";
    // M = Move to (topo centro)
    // L = Line to
    // Q = Quadratic Curve (para as bordas arredondadas)
    return `
      M ${w / 2} 0 
      L ${w - r} 0 
      Q ${w} 0 ${w} ${r} 
      L ${w} ${h - r} 
      Q ${w} ${h} ${w - r} ${h} 
      L ${r} ${h} 
      Q 0 ${h} 0 ${h - r} 
      L 0 ${r} 
      Q 0 0 ${r} 0 
      L ${w / 2} 0
    `.replace(/\s+/g, ' ').trim();
  };

  const borderRadius = 24; // Igual ao rounded-[24px] do CSS
  const pathData = getPath(dimensions.width, dimensions.height, borderRadius);
  // Cálculo aproximado do perímetro para o stroke-dasharray
  // Perímetro de retângulo arredondado = 2(w-2r) + 2(h-2r) + 2*pi*r
  const perimeter = 2 * (dimensions.width - 2 * borderRadius) + 2 * (dimensions.height - 2 * borderRadius) + 2 * Math.PI * borderRadius;

  return (
    <div className="relative group">
      {/* SVG de Borda Animada (Apenas se for período ativo e Hoje) */}
      {isActive && isToday && pathData && (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          style={{ 
            left: -1, top: -1, // Compensar borda de 1px
            width: 'calc(100% + 2px)', 
            height: 'calc(100% + 2px)' 
          }}
        >
          {/* Fundo da borda (opcional, para dar profundidade) */}
          <path 
            d={pathData} 
            fill="none" 
            stroke={period.color} 
            strokeWidth="1" 
            opacity="0.1"
          />
          
          {/* A borda de progresso */}
          <path 
            d={pathData} 
            fill="none" 
            stroke={period.color} 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeDasharray={perimeter}
            strokeDashoffset={perimeter - (perimeter * progress / 100)}
            className="transition-all duration-[1000ms] ease-linear"
            style={{
              filter: `drop-shadow(0 0 6px ${period.color})` // Glow effect
            }}
          />
        </svg>
      )}

      <div 
        ref={(node) => {
          setNodeRef(node);
          // @ts-ignore
          containerRef.current = node;
        }}
        className={cn(
          "relative flex flex-col p-4 rounded-[24px] border transition-all duration-200",
          // Se estiver ativo, removemos a borda padrão para deixar o SVG brilhar, ou deixamos ela muito sutil
          isActive && isToday ? "border-transparent bg-white/[0.02]" : "border-white/[0.03]",
          isOver ? "border-[#38BDF8] bg-[#38BDF8]/10 scale-[1.01]" : ""
        )}
        style={{ 
          background: (!isActive || !isToday) && !isOver ? period.gradient : undefined 
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center pl-[9px] z-10">
              <period.icon size={14} style={{ color: period.color }} className="bg-[#09090b]/40 rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-widest leading-none" style={{ color: period.color }}>
                {period.label}
              </span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight opacity-70 mt-0.5">
                {period.time}
              </span>
            </div>
          </div>
          {tasks.length > 0 && (
            <span className="text-[9px] font-bold text-zinc-200 bg-white/10 px-2 py-0.5 rounded-full">
              {tasks.length}
            </span>
          )}
        </div>
        
        <div className="relative space-y-3 min-h-[20px]">
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={{ ...task, period: period.id }} />
            ))}
          </SortableContext>
          
          {tasks.length === 0 && !isOver && (
             <div className="flex items-center justify-center py-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
               <period.icon size={24} style={{ color: period.color }} />
             </div>
          )}

          {isOver && tasks.length === 0 && (
            <div className="h-10 border-2 border-dashed border-[#38BDF8]/20 rounded-[20px] flex items-center justify-center ml-8">
               <span className="text-[8px] font-black text-[#38BDF8] uppercase tracking-tighter">Soltar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TaskColumn = ({ id, title, tasks, isToday }: TaskColumnProps) => {
  return (
    <div className="flex flex-col w-80 shrink-0 h-full">
      <div className="flex items-center justify-between mb-4 px-3">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            "text-sm font-serif italic font-bold tracking-tight",
            isToday ? "text-[#38BDF8]" : "text-zinc-200"
          )}>
            {title}
          </h3>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-zinc-300 font-bold">
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "flex-1 relative flex flex-col gap-5 p-2 rounded-[28px] bg-white/[0.01] border border-white/[0.03] custom-scrollbar overflow-y-auto pb-10",
          isToday && "bg-[#38BDF8]/[0.01] border-[#38BDF8]/10"
        )}
      >
        {PERIODS.map((period) => (
          <PeriodContainer 
            key={period.id}
            dayId={id}
            period={period}
            tasks={tasks.filter(t => t.period === period.id)}
            isToday={isToday}
          />
        ))}
      </div>
    </div>
  );
};