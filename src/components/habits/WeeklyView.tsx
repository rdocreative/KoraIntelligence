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

  // Períodos fixos
  const allPeriods = [
    { label: 'Manhã', range: [5, 12], icon: Sunrise },
    { label: 'Tarde', range: [12, 18], icon: Sun },
    { label: 'Noite', range: [18, 24], icon: Moon },
    { label: 'Madruga', range: [0, 5], icon: CloudMoon }
  ];

  // Regra 1: Ocultar seções vazias (só renderiza se tiver ao menos 1 hábito no período em qualquer dia da semana)
  const activePeriods = useMemo(() => {
    return allPeriods.filter(period => {
      return habits.some(h => {
        if (!h.active) return false;
        const hour = parseInt(h.time.split(':')[0]);
        // Verifica se o hábito pertence ao período e se está agendado para algum dia desta semana
        const hasDayInWeek = h.weekDays.some(wd => weekDays.some(day => getDay(day) === wd));
        return hour >= period.range[0] && hour < period.range[1] && hasDayInWeek;
      });
    });
  }, [habits, weekDays]);

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

  return (
    <div className="w-full rounded-[24px] overflow-visible border-2 border-[#374151] bg-[#1a262e] h-auto">
      <div className="w-full overflow-visible">
        {/* Grade Principal */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] w-full overflow-visible">
          
          {/* Canto Vazio Superior Esquerdo */}
          <div className="bg-[#161f26] border-b-2 border-r border-[#374151]" />

          {/* Cabeçalho dos Dias (Aumentado conforme Regra 4) */}
          {weekDays.map((day, idx) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div key={day.toString()} className={cn(
                "text-center py-4 border-b-2 border-[#374151] flex flex-col justify-center min-w-0",
                idx !== 6 && "border-r border-[#2a3f4a]"
              )}>
                <div className={cn(
                  "text-[12px] font-[800] uppercase tracking-[0.05em] truncate px-1",
                  isToday ? "text-[#22d3ee]" : "text-[#9ca3af]"
                )}>
                  {format(day, 'EEE', { locale: ptBR }).replace('.', '')}
                </div>
                <div className={cn(
                  "text-[20px] font-[800] leading-none mt-1",
                  isToday ? "text-[#22d3ee]" : "text-[#e5e7eb]"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}

          {/* Linhas de Período (Regra 1: Apenas ativos) */}
          {activePeriods.map((period, pIdx) => (
            <React.Fragment key={period.label}>
              {/* Coluna Lateral de Período (Regra 5: Aumentada) */}
              <div className={cn(
                "flex flex-col items-center justify-center gap-2 bg-[#161f26] border-r border-[#374151] py-6",
                pIdx !== 0 && "border-t border-[#374151]"
              )}>
                <period.icon size={20} className="text-[#9ca3af]/40" />
                <span className="text-[11px] font-[900] text-[#9ca3af]/40 uppercase tracking-[0.05em]">
                  {period.label}
                </span>
              </div>

              {/* Células de Grade (Regra 2: Aumentada) */}
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
                      "p-2 min-h-[80px] flex flex-col gap-2 justify-center min-w-0",
                      dIdx !== 6 && "border-r border-[#2a3f4a]",
                      pIdx !== 0 && "border-t border-[#374151]"
                    )}
                  >
                    {habitsInPeriod.length > 0 ? (
                      habitsInPeriod.map(habit => {
                        const isDone = habit.completedDates.includes(dStr);
                        const styles = getHabitStyles(habit.priority);
                        
                        return (
                          /* Regra 3: Cards de Hábito Aumentados + Scale -10% aplicada no padding/font para balancear */
                          <button
                            key={habit.id}
                            onClick={() => onToggleHabit(habit.id, day)}
                            className={cn(
                              "w-full text-left p-2 rounded-[10px] border transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-center overflow-hidden mb-1.5",
                              styles.bg,
                              styles.border,
                              isDone && "opacity-50 grayscale"
                            )}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <div className={cn(
                                "h-[16px] w-[16px] rounded-full border flex items-center justify-center shrink-0",
                                isDone ? "bg-[#22d3ee] border-[#22d3ee]" : styles.checkbox
                              )}>
                                {isDone && <Check size={10} className="text-[#111b21] stroke-[4px]" />}
                              </div>
                              <span className={cn(
                                "text-[12px] font-[700] text-[#e5e7eb] truncate leading-tight max-w-full",
                                isDone && "line-through opacity-70"
                              )}>
                                {habit.title}
                              </span>
                            </div>
                            <span className="text-[11px] font-[600] text-[#d1d5db] ml-[24px] mt-0.5 leading-none">
                              {habit.time}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="flex-1 flex items-center justify-center p-1 opacity-20 select-none">
                        <span className="text-[8px] font-[800] text-[#374151] uppercase text-center leading-[1.1]">
                          Livre
                        </span>
                      </div>
                    )}
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
                "text-center py-3 border-t-2 border-[#374151] flex flex-col justify-center min-w-0",
                idx !== 6 && "border-r border-[#2a3f4a]"
              )}>
                <span className="text-[10px] font-[900] text-[#9ca3af] uppercase tracking-[0.1em] block leading-none">
                  {done}/{habitsForDay.length}
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