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

  // Monitorar redimensionamento usando BorderBox para precisão
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.borderBoxSize) {
          const borderBoxSize = entry.borderBoxSize[0];
          setDimensions({
            width: borderBoxSize.inlineSize,
            height: borderBoxSize.blockSize
          });
        } else {
          // Fallback
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
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
      const endMinutes = period.endHour * 60; 

      let isCurrentPeriod = false;

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
    const interval = setInterval(checkTime, 10000); // Atualiza a cada 10s para mais fluidez
    return () => clearInterval(interval);
  }, [isToday, period]);

  // Função para gerar o path PERFEITO com Arcos (A)
  const getPath = (w: number, h: number, borderRadius: number, strokeWidth: number) => {
    if (w === 0 || h === 0) return "";
    
    // Ajuste fino: O path deve passar no MEIO da borda. 
    // Se a borda é 2px, o path fica inset em 1px.
    const halfStroke = strokeWidth / 2;
    
    // Dimensões do retângulo do path
    const pathW = w;
    const pathH = h;
    
    // O raio do arco deve ser ajustado pelo inset
    // Se border-radius CSS é 24px, o raio do stroke centralizado é 24 - halfStroke
    const r = Math.max(0, borderRadius - halfStroke);
    
    // Pontos de ancoragem
    const top = halfStroke;
    const bottom = pathH - halfStroke;
    const left = halfStroke;
    const right = pathW - halfStroke;

    // Construção do path no sentido horário começando do Topo-Centro
    // M = Move, L = Line, A = Arc
    return `
      M ${pathW / 2} ${top}
      L ${right - r} ${top}
      A ${r} ${r} 0 0 1 ${right} ${top + r}
      L ${right} ${bottom - r}
      A ${r} ${r} 0 0 1 ${right - r} ${bottom}
      L ${left + r} ${bottom}
      A ${r} ${r} 0 0 1 ${left} ${bottom - r}
      L ${left} ${top + r}
      A ${r} ${r} 0 0 1 ${left + r} ${top}
      L ${pathW / 2} ${top}
    `.replace(/\s+/g, ' ').trim();
  };

  const cssBorderRadius = 24; 
  const strokeWidth = 2.5; // Espessura da linha
  const pathData = getPath(dimensions.width, dimensions.height, cssBorderRadius, strokeWidth);
  
  // Perímetro preciso para a animação
  // P = 2 * (width - 2*r) + 2 * (height - 2*r) + 2 * PI * r
  // Usando as dimensões ajustadas pelo stroke
  const adjustedW = dimensions.width - strokeWidth;
  const adjustedH = dimensions.height - strokeWidth;
  const adjustedR = cssBorderRadius - strokeWidth/2;
  const straightSegments = 2 * (adjustedW - 2 * adjustedR) + 2 * (adjustedH - 2 * adjustedR);
  const curvedSegments = 2 * Math.PI * adjustedR;
  const perimeter = straightSegments + curvedSegments;

  return (
    <div className="relative group">
      {/* SVG de Borda Animada */}
      {isActive && isToday && pathData && (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          // Não precisamos mais de left/top negativos pois usamos border-box dimensions
        >
          <defs>
             {/* Gradiente para suavizar as pontas ou dar um brilho extra */}
             <linearGradient id={`grad-${period.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
               <stop offset="0%" stopColor={period.color} stopOpacity="0.6" />
               <stop offset="50%" stopColor={period.color} stopOpacity="1" />
               <stop offset="100%" stopColor={period.color} stopOpacity="0.6" />
             </linearGradient>
             
             {/* Filtro de brilho para "suavizar" a linha */}
             <filter id={`glow-${period.id}`}>
               <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
               <feMerge>
                 <feMergeNode in="coloredBlur"/>
                 <feMergeNode in="SourceGraphic"/>
               </feMerge>
             </filter>
          </defs>

          {/* Trilha de fundo bem sutil */}
          <path 
            d={pathData} 
            fill="none" 
            stroke={period.color} 
            strokeWidth="1" 
            opacity="0.1"
            strokeLinecap="round"
          />
          
          {/* A linha de progresso */}
          <path 
            d={pathData} 
            fill="none" 
            stroke={period.color} 
            strokeWidth={strokeWidth}
            strokeLinecap="round" 
            strokeDasharray={perimeter}
            strokeDashoffset={perimeter - (perimeter * progress / 100)}
            className="transition-all duration-[1000ms] ease-linear"
            style={{
              filter: `drop-shadow(0 0 4px ${period.color})` // Glow externo
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
          isActive && isToday ? "border-white/[0.05]" : "border-white/[0.03]",
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