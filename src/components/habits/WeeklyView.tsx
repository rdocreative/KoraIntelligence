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
    { label: 'Manhã', range: [5, 12], icon: Sunrise },
    { label: 'Tarde', range: [12, 18], icon: Sun },
    { label: 'Noite', range: [18, 24], icon: Moon }
  ];

  const getHabitStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          bg: "bg-[#FF4B4B15]",
          border: "border-[#FF4B4B44]",
          checkbox: "border-[#FF4B4B]",
          text: "text-[#FF4B4B]"
        };
      case 'medium':
        return {
          bg: "bg-[#FF960015]",
          border: "border-[#FF960044]",
          checkbox: "border-[#FF9600]",
          text: "text-[#FF9600]"
        };
      default:
        return {
          bg: "bg-[#58CC0215]",
          border: "border-[#58CC0244]",
          checkbox: "border-[#58CC02]",
          text: "text-[#58CC02]"
        };
    }
  };

  return (
    <div className="w-full rounded-[16px] overflow-hidden border-2 border-[var(--border-ui)] bg-[var(--card)] h-auto shadow-md">
      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-[80px_repeat(7,1fr)] w-full min-w-[800px]">
          
          <div className="bg-[var(--input-bg)] border-b-2 border-r-2 border-[var(--border-ui)]" />

          {weekDays.map((day, idx) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div key={day.toString()} className={cn(
                "text-center py-5 border-b-2 border-[var(--border-ui)] flex flex-col justify-center",
                idx !== 6 && "border-r border-[var(--border-ui)]"
              )}>
                <div className={cn(
                  "text-[12px] font-[800] uppercase tracking-[0.05em]",
                  isToday ? "text-[#33C5FF]" : "text-[var(--muted-foreground)]"
                )}>
                  {format(day, 'EEE', { locale: ptBR }).replace('.', '')}
                </div>
                <div className={cn(
                  "text-[22px] font-[900] leading-none mt-1.5",
                  isToday ? "text-[#33C5FF]" : "text-[var(--foreground)]"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}

          {allPeriods.map((period, pIdx) => {
            return (
              <React.Fragment key={period.label}>
                <div className={cn(
                  "flex flex-col items-center justify-center gap-2 bg-[var(--input-bg)] border-r-2 border-[var(--border-ui)] py-8",
                  pIdx !== 0 && "border-t border-[var(--border-ui)]"
                )}>
                  <period.icon size={22} className="text-[var(--muted-foreground)]" />
                  <span className="text-[10px] font-[900] text-[var(--muted-foreground)] uppercase tracking-widest">
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
                        "p-3 min-h-[100px] flex flex-col gap-2 justify-center",
                        dIdx !== 6 && "border-r border-[var(--border-ui)]",
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
                                "w-full text-left p-2.5 rounded-[16px] border-2 transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-center",
                                styles.bg,
                                styles.border,
                                isDone && "opacity-40"
                              )}
                            >
                              <div className="flex items-center gap-2.5 w-full">
                                <div className={cn(
                                  "h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center shrink-0",
                                  isDone ? "bg-[#33C5FF] border-[#33C5FF]" : styles.checkbox
                                )}>
                                  {isDone && <Check size={12} className="text-white stroke-[4px]" />}
                                </div>
                                <span className={cn(
                                  "text-[12px] font-[800] text-[var(--foreground)] truncate",
                                  isDone && "line-through opacity-50"
                                )}>
                                  {habit.title}
                                </span>
                              </div>
                              <span className="text-[10px] font-[700] text-[var(--muted-foreground)] ml-[28px] mt-1 uppercase tracking-tighter">
                                {habit.time}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="flex-1 flex items-center justify-center opacity-10">
                           <div className="w-2 h-2 rounded-full bg-[var(--muted-foreground)]" />
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