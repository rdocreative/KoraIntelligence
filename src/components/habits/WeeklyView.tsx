"use client";

import React, { useMemo } from "react";
import { 
  format, 
  startOfWeek, 
  addDays, 
  isSameDay, 
  getDay 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Check, Sun, Sunrise, Moon, CloudMoon } from "lucide-react";

interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: 'daily' | 'weekly';
  priority: 'high' | 'medium' | 'low';
  weekDays: number[];
  time: string;
  completedDates: string[];
  active: boolean;
}

interface WeeklyViewProps {
  currentDate: Date;
  habits: Habit[];
  onToggleHabit: (id: string, date: Date) => void;
}

const WeeklyView = ({ currentDate, habits, onToggleHabit }: WeeklyViewProps) => {
  const weekStart = startOfWeek(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getPeriod = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 12) return 'manha';
    if (hour >= 12 && hour < 18) return 'tarde';
    if (hour >= 18 && hour <= 23) return 'noite';
    return 'madrugada';
  };

  const periods = [
    { id: 'manha', label: 'Manhã', icon: Sunrise, color: '#ff9600' },
    { id: 'tarde', label: 'Tarde', icon: Sun, color: '#1cb0f6' },
    { id: 'noite', label: 'Noite', icon: Moon, color: '#ce82ff' },
    { id: 'madrugada', label: 'Madrugada', icon: CloudMoon, color: '#94a3b8' }
  ];

  const habitsByDayAndPeriod = useMemo(() => {
    const data: Record<string, Record<string, Habit[]>> = {};
    
    days.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      data[dayKey] = { manha: [], tarde: [], noite: [], madrugada: [] };
      
      const dayOfWeek = getDay(day);
      habits.forEach(habit => {
        if (habit.active && habit.weekDays.includes(dayOfWeek)) {
          const period = getPeriod(habit.time);
          data[dayKey][period].push(habit);
        }
      });
    });
    
    return data;
  }, [days, habits]);

  // Função para verificar se um período tem algum hábito na semana toda
  const hasHabitsInPeriod = (periodId: string) => {
    return days.some(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      return habitsByDayAndPeriod[dayKey][periodId].length > 0;
    });
  };

  return (
    <div className="w-full overflow-visible h-auto">
      <div className="grid grid-cols-[80px_repeat(7,1fr)] overflow-visible">
        {/* Cabeçalho Vazio */}
        <div className="border-b-2 border-[#374151] bg-transparent" />
        
        {/* Cabeçalho dos Dias */}
        {days.map((day, i) => (
          <div 
            key={i} 
            className={cn(
              "flex flex-col items-center justify-center py-4 border-b-2 border-[#374151] transition-colors",
              isSameDay(day, new Date()) ? "bg-[#22d3ee]/5" : ""
            )}
          >
            <span className="text-[12px] font-[700] text-[#9ca3af] uppercase tracking-widest mb-1">
              {format(day, 'EEE', { locale: ptBR })}
            </span>
            <span className={cn(
              "text-[20px] font-[800] tracking-tight",
              isSameDay(day, new Date()) ? "text-[#22d3ee]" : "text-[#e5e7eb]"
            )}>
              {format(day, 'd')}
            </span>
          </div>
        ))}

        {/* Linhas de Período */}
        {periods.map((period) => {
          // Só renderizar se for manhã/noite OU se tiver hábitos (para tarde/madrugada)
          const isEssential = period.id === 'manha' || period.id === 'noite';
          const hasData = hasHabitsInPeriod(period.id);
          
          if (!isEssential && !hasData) return null;

          return (
            <React.Fragment key={period.id}>
              {/* Label do Período */}
              <div className="flex flex-col items-center justify-center py-[20px] px-2 border-r-2 border-[#374151] bg-[#1a262c]">
                <period.icon size={20} style={{ color: period.color }} className="mb-2" />
                <span className="text-[11px] font-[800] text-[#9ca3af] uppercase tracking-tighter text-center">
                  {period.label}
                </span>
              </div>

              {/* Células de Hábito por Dia */}
              {days.map((day, dayIdx) => {
                const dayKey = format(day, 'yyyy-MM-dd');
                const habitsInCell = habitsByDayAndPeriod[dayKey][period.id];
                
                return (
                  <div 
                    key={dayIdx} 
                    className={cn(
                      "min-h-[80px] p-2 flex flex-col gap-1.5 border-r border-b border-[#374151]/50 last:border-r-0 transition-all",
                      isSameDay(day, new Date()) ? "bg-[#22d3ee]/5" : ""
                    )}
                  >
                    {habitsInCell.map((habit) => {
                      const isCompleted = habit.completedDates.includes(dayKey);
                      
                      return (
                        <button
                          key={habit.id}
                          onClick={() => onToggleHabit(habit.id, day)}
                          className={cn(
                            "flex flex-col w-full text-left py-[7px] px-[10px] rounded-[10px] border-2 transition-all group relative",
                            isCompleted 
                              ? "bg-[#22d3ee]/10 border-[#22d3ee]/30 opacity-60" 
                              : "bg-[#2a3f4a] border-[#374151] hover:border-[#22d3ee]/50"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2 w-full mb-1">
                            <span className={cn(
                              "text-[13px] font-[700] truncate max-w-full transition-all",
                              isCompleted ? "text-[#9ca3af] line-through" : "text-[#e5e7eb]"
                            )}>
                              {habit.title}
                            </span>
                            <div className={cn(
                              "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all",
                              isCompleted ? "bg-[#22d3ee] border-[#22d3ee]" : "border-[#374151]"
                            )}>
                              {isCompleted && <Check size={10} className="text-[#111b21] stroke-[4px]" />}
                            </div>
                          </div>
                          <span className={cn(
                            "text-[12px] font-[700] transition-colors leading-none",
                            isCompleted ? "text-[#9ca3af]/50" : "text-[#9ca3af]"
                          )}>
                            {habit.time}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyView;