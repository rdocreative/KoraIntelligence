"use client";

import React, { useState, useEffect, forwardRef } from 'react';
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

const TimeWarning = ({ 
  initialTime, 
  onSave, 
  periodLabel 
}: { 
  initialTime: string; 
  onSave: (time: string) => void;
  periodLabel: string;
}) => {
  const [time, setTime] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      onSave(time);
    }, 4000);

    return () => clearTimeout(timer);
  }, [time, onSave, isPaused]);

  return (
    <div 
      className="flex flex-col gap-2 p-3 my-1 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 slide-in-from-top-2 duration-300 overflow-hidden relative z-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center gap-2 mb-0.5">
        <Clock size={10} className="text-[#38BDF8]" />
        <span className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest">
          Ajustar horário ({periodLabel})
        </span>
      </div>
      
      <div className="flex items-center gap-2 relative z-10">
        <input 
          type="time" 
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="flex-1 bg-white/[0.05] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#38BDF8]/50 [color-scheme:dark]"
        />
        <button 
          onClick={() => onSave(time)}
          className="px-2.5 py-1 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-black text-[9px] font-black uppercase rounded-lg transition-all flex items-center gap-1 active:scale-95 whitespace-nowrap"
        >
          <Check size={10} />
          Salvar
        </button>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/5">
         <div 
           className={cn("h-full bg-[#38BDF8]/40 origin-left transition-all duration-[4000ms] ease-linear", isPaused && "paused")} 
           style={{ 
             width: '100%', 
             animation: isPaused ? 'none' : 'shrink-width 4s linear forwards' 
            }} 
         />
      </div>
    </div>
  );
};

const PeriodContainer = ({ 
  dayId, 
  period, 
  tasks,
  isToday,
  warningState,
  onSaveTime
}: { 
  dayId: string; 
  period: typeof PERIODS[0]; 
  tasks: any[];
  isToday?: boolean;
  warningState: { taskId: string; periodId: string; defaultTime: string } | null;
  onSaveTime: (time: string) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${dayId}:${period.id}`,
  });

  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const hasTasks = tasks.length > 0;
  const isExpanded = hasTasks || isOver || isHovered;

  const activeStyle = isActive && isToday ? {
    background: `linear-gradient(180deg, ${period.color}15 0%, rgba(0,0,0,0) 100%)`, 
  } : isExpanded ? {
    background: period.gradient
  } : {};

  return (
    <div 
      ref={setNodeRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex flex-col rounded-[24px] border transition-all duration-300 ease-in-out",
        "border-white/[0.03]",
        isOver ? "bg-white/[0.05] border-white/10 scale-[1.01]" : "",
        isExpanded ? "p-4" : "p-3 bg-white/[0.01] hover:bg-white/[0.03] cursor-default"
      )}
      style={activeStyle}
    >
      <div className={cn("flex items-center justify-between transition-all", isExpanded ? "mb-4" : "mb-0")}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center z-10">
            <period.icon 
              size={isExpanded ? 16 : 14} 
              style={{ color: period.color }} 
              className="transition-all duration-500" 
            />
          </div>
          <div className="flex flex-col">
            <span 
              className={cn(
                "font-black uppercase tracking-widest leading-none transition-all duration-500",
                isExpanded ? "text-[11px]" : "text-[10px]"
              )}
              style={{ color: period.color }}
            >
              {period.label}
            </span>
            <span className={cn(
                "text-[9px] font-bold text-zinc-400 uppercase tracking-tight opacity-70 mt-0.5 transition-all duration-300",
                !isExpanded && "h-0 overflow-hidden opacity-0 mt-0"
            )}>
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
      
      <div className={cn(
          "relative flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1 transition-all duration-300 ease-in-out origin-top",
          isExpanded ? "min-h-[20px] max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden min-h-0"
      )}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <React.Fragment key={task.id}>
              {warningState?.taskId === task.id && (
                <TimeWarning 
                  initialTime={warningState.defaultTime}
                  periodLabel={period.label}
                  onSave={onSaveTime}
                />
              )}
              <TaskCard task={{ ...task, period: period.id }} />
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
  const [warningState, setWarningState] = useState<{
    taskId: string;
    periodId: string;
    defaultTime: string;
  } | null>(null);

  useEffect(() => {
    if (lastMovedTaskId) {
      const task = tasks.find(t => t.id === lastMovedTaskId);
      if (task) {
        const periodDef = PERIODS.find(p => p.id === task.period);
        setWarningState({
          taskId: task.id,
          periodId: task.period,
          defaultTime: periodDef?.defaultTime || '00:00'
        });
      }
    } else {
      setWarningState(null);
    }
  }, [lastMovedTaskId, tasks]);

  const handleSaveTime = (newTime: string) => {
    if (warningState && onUpdateTaskTime) {
      onUpdateTaskTime(warningState.taskId, newTime);
      setWarningState(null);
    }
  };

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
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500/80 border border-white/5 px-2 py-0.5 rounded-md">
              Hoje
            </span>
          ) : tasks.length > 0 && (
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
            warningState={warningState?.periodId === period.id ? warningState : null}
            onSaveTime={handleSaveTime}
          />
        ))}
      </div>
    </div>
  );
});

TaskColumn.displayName = "TaskColumn";