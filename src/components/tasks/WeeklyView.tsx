"use client";

import React, { useMemo } from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isToday,
  getDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface WeeklyViewProps {
  currentDate: Date;
  tasks?: any[];
}

const WEEK_DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const WeeklyView = ({ currentDate, tasks = [] }: WeeklyViewProps) => {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: startDate, end: endDate });

  const tasksByDay = useMemo(() => {
    const map: Record<string, any[]> = {};
    
    // Inicializa o mapa com os nomes dos dias para evitar erros de undefined
    WEEK_DAYS.forEach(day => map[day] = []);

    tasks.forEach(task => {
      try {
        const dateParts = task.data.split('-');
        const date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
        const dayIndex = getDay(date);
        const dayName = WEEK_DAYS[dayIndex];
        
        if (dayName && map[dayName]) {
          map[dayName].push(task);
        }
      } catch (err) {
        console.error("Erro ao processar tarefa na WeeklyView:", err);
      }
    });
    return map;
  }, [tasks]);

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'Extrema': return 'bg-red-500';
      case 'Média': case 'Media': return 'bg-orange-500';
      case 'Baixa': return 'bg-sky-500';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="flex-1 overflow-x-auto custom-scrollbar pb-6 px-6">
      <div className="flex gap-4 min-w-[1200px] h-full">
        {weekDays.map((day) => {
          const dayName = WEEK_DAYS[getDay(day)];
          const dayTasks = tasksByDay[dayName] || [];
          const isTodayDay = isToday(day);

          return (
            <div key={day.toString()} className="flex-1 flex flex-col min-h-0">
              <div className={cn(
                "mb-4 p-4 rounded-2xl border transition-all",
                isTodayDay 
                  ? "bg-indigo-500/10 border-indigo-500/20 shadow-lg shadow-indigo-500/5" 
                  : "bg-white/[0.02] border-white/5"
              )}>
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-widest mb-1",
                  isTodayDay ? "text-indigo-400" : "text-zinc-500"
                )}>
                  {format(day, 'EEEE', { locale: ptBR })}
                </p>
                <p className="text-xl font-black text-white">
                  {format(day, 'd')}
                </p>
              </div>

              <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
                {dayTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="group p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white", getPriorityColor(task.prioridade))}>
                        {task.prioridade}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500">
                        <Clock size={10} />
                        {task.horario}
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-tight mb-2 line-clamp-2">{task.nome}</h4>
                    <div className="text-2xl">{task.emoji}</div>
                  </div>
                ))}

                {dayTasks.length === 0 && (
                  <div className="flex-1 border-2 border-dashed border-white/[0.02] rounded-2xl flex items-center justify-center p-8">
                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest text-center">
                      Vazio
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};