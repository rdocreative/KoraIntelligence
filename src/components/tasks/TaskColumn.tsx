"use client";

import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Sun, Moon, Coffee, CloudMoon, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
  isToday?: boolean;
  lastMovedTaskId?: string | null;
  onUpdateTaskTime?: (taskId: string, newTime: string) => void;
}

const PERIODS = [
  { 
    id: 'Morning', 
    label: 'Manhã', 
    time: '06:00 — 12:00',
    icon: Sun, 
    color: '#FDBA74',
    gradient: 'linear-gradient(180deg, rgba(253, 186, 116, 0.05) 0%, rgba(253, 186, 116, 0) 100%)',
    startHour: 6,
    endHour: 12,
    defaultTime: '09:00'
  },
  { 
    id: 'Afternoon', 
    label: 'Tarde', 
    time: '12:00 — 18:00',
    icon: Coffee, 
    color: '#4ADE80',
    gradient: 'linear-gradient(180deg, rgba(74, 222, 128, 0.05) 0%, rgba(74, 222, 128, 0) 100%)',
    startHour: 12,
    endHour: 18,
    defaultTime: '15:00'
  },
  { 
    id: 'Evening', 
    label: 'Noite', 
    time: '18:00 — 00:00',
    icon: Moon, 
    color: '#A78BFA',
    gradient: 'linear-gradient(180deg, rgba(167, 139, 250, 0.05) 0%, rgba(167, 139, 250, 0) 100%)',
    startHour: 18,
    endHour: 24,
    defaultTime: '21:00'
  },
  { 
    id: 'Dawn', 
    label: 'Madrugada', 
    time: '00:00 — 06:00',
    icon: CloudMoon, 
    color: '#818CF8',
    gradient: 'linear-gradient(180deg, rgba(129, 140, 248, 0.05) 0%, rgba(129, 140, 248, 0) 100%)',
    startHour: 0,
    endHour: 6,
    defaultTime: '03:00'
  },
];

const PeriodContainer = ({ 
  dayId, 
  period, 
  tasks,
  isToday,
  lastMovedTaskId,
  onUpdateTaskTime
}: { 
  dayId: string; 
  period: typeof PERIODS[0]; 
  tasks: any[];
  isToday?: boolean;
  lastMovedTaskId?: string | null;
  onUpdateTaskTime?: (taskId: string, newTime: string) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${dayId}:${period.id}`,
  });

  const [isActive, setIsActive] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [tempTime, setTempTime] = useState(period.defaultTime);
  const prevIsOver = useRef(isOver);
  const hasAppliedDefault = useRef(false);

  useEffect(() => {
    if (prevIsOver.current === true && isOver === false) {
      const movedTask = tasks.find(t => t.id === lastMovedTaskId);
      if (movedTask) {
        setTempTime(movedTask.time || period.defaultTime);
        setShowWarning(true);
        hasAppliedDefault.current = false;
        
        const timer = setTimeout(() => {
          if (!hasAppliedDefault.current && lastMovedTaskId) {
             onUpdateTaskTime?.(lastMovedTaskId, period.defaultTime);
             setShowWarning(false);
          }
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
    prevIsOver.current = isOver;
  }, [isOver, tasks, lastMovedTaskId, period.defaultTime, onUpdateTaskTime]);

  const handleSaveTime = () => {
    if (lastMovedTaskId) {
      onUpdateTaskTime?.(lastMovedTaskId, tempTime);
      hasAppliedDefault.current = true;
      setShowWarning(false);
    }
  };

  useEffect(() => {
    if (!isToday) {
      setIsActive(false);
      return;
    }

    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour >= period.startHour && currentHour < period.endHour) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); 
    return () => clearInterval(interval);
  }, [isToday, period]);

  const activeStyle = isActive && isToday ? {
    background: `linear-gradient(180deg, ${period.color}15 0%, rgba(0,0,0,0) 100%)`, 
  } : {
    background: period.gradient
  };

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "relative flex flex-col p-4 rounded-[24px] border transition-all duration-300 ease-in-out",
        "border-white/[0.03]",
        isOver ? "bg-white/[0.05] border-white/10 scale-[1.01]" : ""
      )}
      style={activeStyle}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center z-10">
            <period.icon 
              size={16} 
              style={{ color: period.color }} 
              className="transition-all duration-500" 
            />
          </div>
          <div className="flex flex-col">
            <span 
              className="text-[11px] font-black uppercase tracking-widest leading-none transition-all duration-500" 
              style={{ color: period.color }}
            >
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
      
      <div className="relative flex flex-col gap-3 min-h-[20px] max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <React.Fragment key={task.id}>
              <TaskCard task={{ ...task, period: period.id }} />
              
              {/* Aviso integrado ao fluxo, abaixo da tarefa movida */}
              {showWarning && lastMovedTaskId === task.id && (
                <div className="flex flex-col gap-2 p-3 mx-1 bg-[#111] border border-white/10 rounded-xl shadow-lg animate-in zoom-in-95 slide-in-from-top-2 duration-300 relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={12} className="text-yellow-400" />
                    <span className="text-[10px] text-zinc-100 font-medium whitespace-nowrap">
                      Atualizar horário
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      type="time" 
                      value={tempTime}
                      onChange={(e) => setTempTime(e.target.value)}
                      className="flex-1 bg-white/[0.05] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]/50 [color-scheme:dark]"
                    />
                    <button 
                      onClick={handleSaveTime}
                      className="px-3 py-1.5 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-black text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
                    >
                      <Check size={12} />
                      Salvar
                    </button>
                  </div>
                  
                  <div className="h-0.5 bg-white/5 w-full rounded-full overflow-hidden mt-1">
                     <div className="h-full bg-yellow-400/30 animate-shrink-width origin-left" style={{ animationDuration: '5s' }} />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </SortableContext>
        
        {tasks.length === 0 && !isOver && (
           <div className="flex items-center justify-center py-4 opacity-[0.05]">
             <period.icon size={24} style={{ color: period.color }} />
           </div>
        )}

        {isOver && tasks.length === 0 && (
          <div className="h-10 border-2 border-dashed border-white/10 rounded-[20px] flex items-center justify-center">
             <span className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">Soltar</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const TaskColumn = forwardRef<HTMLDivElement, TaskColumnProps>(({ id, title, tasks, isToday, lastMovedTaskId, onUpdateTaskTime }, ref) => {
  return (
    <div 
      ref={ref} 
      data-day={id}
      className="flex flex-col w-72 shrink-0 h-full scroll-snap-align-center"
    >
      <div className="flex items-center justify-center mb-4 px-3 relative">
        <div className="flex items-center gap-3">
          <h3 className={cn(
            "text-lg font-serif font-medium tracking-tight transition-colors duration-500",
            isToday ? "text-[#38BDF8]" : "text-zinc-100"
          )}>
            {title}
          </h3>
          {isToday ? (
            <span className="text-[9px] font-black uppercase tracking-widest text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded-full border border-[#38BDF8]/20 animate-pulse">
              Hoje
            </span>
          ) : (
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-zinc-400 font-bold">
              {tasks.length}
            </span>
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex-1 relative flex flex-col gap-4 p-2 rounded-[28px] border custom-scrollbar overflow-y-auto pb-10 transition-all duration-500",
          isToday 
            ? "bg-[#38BDF8]/[0.02] border-[#38BDF8]/10 shadow-[0_0_40px_rgba(56,189,248,0.02)]" 
            : "bg-white/[0.01] border-white/[0.03]"
        )}
      >
        {PERIODS.map((period) => (
          <PeriodContainer 
            key={period.id}
            dayId={id}
            period={period}
            tasks={tasks.filter(t => t.period === period.id)}
            isToday={isToday}
            lastMovedTaskId={lastMovedTaskId}
            onUpdateTaskTime={onUpdateTaskTime}
          />
        ))}
      </div>
    </div>
  );
});

TaskColumn.displayName = "TaskColumn";