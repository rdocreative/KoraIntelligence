"use client";

import React, { useMemo } from 'react';
import { 
  format, 
  startOfWeek, 
  addDays, 
  isSameDay, 
  getDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Check, Sun, Moon, Sunrise, CloudMoon } from "lucide-react";

interface Habit {
  id: string;
  title: string;
  emoji: string;
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
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const periods = [
    { label: 'Manhã', range: [5, 12], icon: Sunrise },
    { label: 'Tarde', range: [12, 18], icon: Sun },
    { label: 'Noite', range: [18, 24], icon: Moon },
    { label: 'Madruga', range: [0, 5], icon: CloudMoon }
  ];

  const getHabitStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          bg: "bg-[linear-gradient(135deg,rgba(255,75,75,0.40),rgba(180,20,20,0.20))]",
          border: "border-[rgba(255,75,75,0.50)]",
          checkbox: "border-[#ff4b4b]"
        };
      case 'medium':
        return {
          bg: "bg-[linear-gradient(135deg,rgba(255,150,0,0.40),rgba(180,90,0,0.20))]",
          border: "border-[rgba(255,150,0,0.50)]",
          checkbox: "border-[#ff9600]"
        };
      case 'low':
      default:
        return {
          bg: "bg-[linear-gradient(135deg,rgba(88,204,2,0.40),rgba(40,100,0,0.20))]",
          border: "border-[rgba(88,204,2,0.50)]",
          checkbox: "border-[#58cc02]"
        };
    }
  };

  const activePeriods = periods.filter(period => {
    return habits.some(h => {
      if (!h.active) return false;
      const hour = parseInt(h.time.split(':')[0]);
      const inPeriod = hour >= period.range[0] && hour < period.range[1];
      return inPeriod && weekDays.some(day => h.weekDays.includes(getDay(day)));
    });
  });

  return (
    <div className="w-full overflow-x-auto rounded-[24px] overflow-hidden">
      <div className="min-w-[900px]">
        {/* Grade Principal */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          
          {/* Canto Vazio Superior Esquerdo */}
          <div className="bg-[#161f26] border-b-2 border-r border-[#374151]" />

          {/* Cabeçalho dos Dias */}
          {weekDays.map((day, idx) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div key={day.toString()} className={cn(
                "text-center py-4 border-b-2 border-[#374151]",
                idx !== 6 && "border-r border-[#2a3f4a]"
              )}>
                <div className={cn(
                  "text-[10px] font-[800] uppercase tracking-[0.08em] mb-0.5",
                  isToday ? "text-[#22d3ee]" : "text-[#9ca3af]"
                )}>
                  {format(day, 'EEEE', { locale: ptBR }).split('-')[0]}
                </div>
                <div className={cn(
                  "text-[18px] font-[800]",
                  isToday ? "text-[#22d3ee]" : "text-[#e5e7eb]"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}

          {/* Linhas de Período */}
          {activePeriods.map((period, pIdx) => (
            <React.Fragment key={period.label}>
              {/* Coluna Lateral de Período */}
              <div className={cn(
                "flex flex-col items-center justify-center gap-1.5 bg-[#161f26] border-r border-[#374151] py-6",
                pIdx !== 0 && "border-t border-[#374151]"
              )}>
                <period.icon size={18} className="text-[#9ca3af]" />
                <span className="text-[10px] font-[800] text-[#9ca3af] uppercase tracking-[0.1em]">
                  {period.label}
                </span>
              </div>

              {/* Conteúdo dos Hábitos para este período */}
              {weekDays.map((day, dIdx) => {
                const dStr = format(day, 'yyyy-MM-dd');
                const habitsInPeriod = habits.filter(h => {
                  if (!h.active || !h.weekDays.includes(getDay(day))) return false;
                  const hour = parseInt(h.time.split(':')[0]);
                  return hour >= period.range[0] && hour < period.range[1];
                });

                return (
                  <div 
                    key={day.toString() + period.label} 
                    className={cn(
                      "p-1.5 min-h-[80px]",
                      dIdx !== 6 && "border-r border-[#2a3f4a]",
                      pIdx !== 0 && "border-t border-[#374151]"
                    )}
                  >
                    <div className="flex flex-col gap-1.5">
                      {habitsInPeriod.map(habit => {
                        const isDone = habit.completedDates.includes(dStr);
                        const styles = getHabitStyles(habit.priority);
                        
                        return (
                          <button
                            key={habit.id}
                            onClick={() => onToggleHabit(habit.id, day)}
                            className={cn(
                              "w-full text-left p-[5px] px-2 rounded-[8px] border transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-center",
                              styles.bg,
                              styles.border,
                              isDone && "opacity-50 grayscale"
                            )}
                          >
                            <div className="flex items-center gap-1.5 w-full">
                              <div className={cn(
                                "h-[14px] w-[14px] rounded-full border-2 flex items-center justify-center shrink-0",
                                isDone ? "bg-[#22d3ee] border-[#22d3ee]" : styles.checkbox
                              )}>
                                {isDone && <Check size={8} className="text-[#111b21] stroke-[4px]" />}
                              </div>
                              <span className={cn(
                                "text-[12px] font-[700] text-[#e5e7eb] truncate",
                                isDone && "line-through"
                              )}>
                                {habit.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 ml-[20px] mt-[0.5px]">
                              <span className="text-[10px] font-[600] text-[#d1d5db]">
                                {habit.time}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}

          {/* Rodapé de Contagem */}
          <div className="bg-[#161f26] border-r border-[#374151] border-t-2 border-[#374151]" />
          {weekDays.map((day, idx) => {
            const dStr = format(day, 'yyyy-MM-dd');
            const habitsForDay = habits.filter(h => h.active && h.weekDays.includes(getDay(day)));
            const done = habitsForDay.filter(h => h.completedDates.includes(dStr)).length;
            
            return (
              <div key={day.toString()} className={cn(
                "text-center py-3 border-t-2 border-[#374151]",
                idx !== 6 && "border-r border-[#2a3f4a]"
              )}>
                <span className="text-[10px] font-[800] text-[#9ca3af] uppercase tracking-[0.08em] block">
                  {done}/{habitsForDay.length} FEITOS
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyView;