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
import { Check, Sun, Moon, Sunrise } from "lucide-react";

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

  const allPeriods = [
    { label: 'Manhã', range: [5, 12], icon: Sunrise, color: "#FFCC00" },
    { label: 'Tarde', range: [12, 18], icon: Sun, color: "#FF9500" },
    { label: 'Noite', range: [18, 24], icon: Moon, color: "#5856D6" }
  ];

  const getHabitStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          bg: "bg-[#FF4B4B10]",
          border: "border-[#FF4B4B33]",
          checkbox: "border-[#FF4B4B]",
          text: "text-[#FF4B4B]"
        };
      case 'medium':
        return {
          bg: "bg-[#FF960010]",
          border: "border-[#FF960033]",
          checkbox: "border-[#FF9600]",
          text: "text-[#FF9600]"
        };
      default:
        return {
          bg: "bg-[#58CC0210]",
          border: "border-[#58CC0233]",
          checkbox: "border-[#58CC02]",
          text: "text-[#58CC02]"
        };
    }
  };

  return (
    <div className="w-full rounded-[24px] overflow-hidden border-2 border-[var(--border-ui)] bg-[var(--card)] h-auto shadow-lg">
      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-[100px_repeat(7,1fr)] w-full min-w-[900px] gap-x-1">
          
          <div className="bg-[var(--input-bg)] border-b-2 border-r-2 border-[var(--border-ui)]" />

          {weekDays.map((day, idx) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div key={day.toString()} className={cn(
                "text-center py-6 border-b-2 border-[var(--border-ui)] flex flex-col justify-center transition-all",
                isToday && "bg-[#FF3B30] text-white border-b-[#FF3B30]"
              )}>
                <div className={cn(
                  "text-[11px] font-[900] uppercase tracking-[0.1em]",
                  isToday ? "text-white/80" : "text-[var(--muted-foreground)]"
                )}>
                  {format(day, 'EEE', { locale: ptBR }).replace('.', '')}
                </div>
                <div className={cn(
                  "text-[24px] font-[950] leading-none mt-1",
                  isToday ? "text-white" : "text-[var(--foreground)]"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}

          {allPeriods.map((period, pIdx) => {
            // Verifica se há hábitos neste período em qualquer dia da semana
            const hasHabitsInPeriod = habits.some(h => {
              const hour = parseInt(h.time.split(':')[0]);
              return h.active && hour >= period.range[0] && hour < period.range[1];
            });

            return (
              <React.Fragment key={period.label}>
                <div className={cn(
                  "flex flex-col items-center justify-center gap-2 bg-[var(--input-bg)] border-r-2 border-[var(--border-ui)] py-6 transition-all",
                  pIdx !== 0 && "border-t border-[var(--border-ui)]",
                  !hasHabitsInPeriod && "opacity-40 grayscale"
                )}>
                  <period.icon size={24} style={{ color: period.color }} strokeWidth={2.5} />
                  <span className="text-[10px] font-[950] uppercase tracking-[0.15em]" style={{ color: period.color }}>
                    {period.label}
                  </span>
                </div>

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
                        "p-3 flex flex-col gap-2 justify-center transition-all",
                        !hasHabitsInPeriod ? "min-h-[40px]" : "min-h-[100px]",
                        dIdx !== 6 && "border-r border-[var(--border-ui)]/30",
                        pIdx !== 0 && "border-t border-[var(--border-ui)]"
                      )}
                    >
                      {habitsInPeriod.length > 0 ? (
                        habitsInPeriod.map(habit => {
                          const isDone = habit.completedDates.includes(dStr);
                          const styles = getHabitStyles(habit.priority as any);
                          
                          return (
                            <button
                              key={habit.id}
                              onClick={() => onToggleHabit(habit.id, day)}
                              className={cn(
                                "w-full text-left p-2 rounded-[12px] border-2 transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center gap-2",
                                styles.bg,
                                styles.border,
                                isDone && "opacity-30 grayscale"
                              )}
                            >
                              <div className={cn(
                                "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
                                isDone ? "bg-primary border-primary" : styles.checkbox
                              )}>
                                {isDone && <Check size={10} className="text-white stroke-[4px]" />}
                              </div>
                              <span className={cn(
                                "text-[11px] font-[900] text-[var(--foreground)] truncate leading-tight",
                                isDone && "line-through opacity-50"
                              )}>
                                {habit.title}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="flex-1 flex items-center justify-center opacity-5">
                           <div className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyView;