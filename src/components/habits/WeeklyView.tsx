"use client";

import React, { useMemo } from 'react';
import { 
  format, 
  startOfWeek, 
  addDays, 
  isSameDay, 
  getDay,
  parse
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Check, Clock } from "lucide-react";

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
    { label: 'Manhã', range: [5, 12] },
    { label: 'Tarde', range: [12, 18] },
    { label: 'Noite', range: [18, 24] },
    { label: 'Madrugada', range: [0, 5] }
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

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-7 gap-3 mb-6">
          {weekDays.map((day) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div key={day.toString()} className="text-center">
                <div className={cn(
                  "text-[11px] font-[800] uppercase tracking-[0.05em] mb-1",
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
        </div>

        <div className="space-y-6">
          {periods.map((period) => (
            <div key={period.label} className="space-y-2">
              <h4 className="text-[11px] font-[700] text-[#9ca3af] uppercase tracking-[0.05em] px-1">
                {period.label}
              </h4>
              <div className="grid grid-cols-7 gap-3">
                {weekDays.map((day) => {
                  const dStr = format(day, 'yyyy-MM-dd');
                  const habitsInPeriod = habits.filter(h => {
                    if (!h.active || !h.weekDays.includes(getDay(day))) return false;
                    const hour = parseInt(h.time.split(':')[0]);
                    return hour >= period.range[0] && hour < period.range[1];
                  });

                  return (
                    <div 
                      key={day.toString() + period.label} 
                      className="bg-[#2a3f4a] border border-[#374151] rounded-[12px] p-2 min-h-[100px] flex flex-col gap-2"
                    >
                      {habitsInPeriod.map(habit => {
                        const isDone = habit.completedDates.includes(dStr);
                        const styles = getHabitStyles(habit.priority);
                        
                        return (
                          <button
                            key={habit.id}
                            onClick={() => onToggleHabit(habit.id, day)}
                            className={cn(
                              "w-full text-left p-1.5 rounded-[8px] border transition-all hover:scale-[1.02] active:scale-[0.98]",
                              styles.bg,
                              styles.border,
                              isDone && "opacity-50 grayscale"
                            )}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className={cn(
                                "h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center shrink-0",
                                isDone ? "bg-[#22d3ee] border-[#22d3ee]" : styles.checkbox
                              )}>
                                {isDone && <Check size={8} className="text-[#111b21] stroke-[4px]" />}
                              </div>
                              <span className={cn(
                                "text-[11px] font-[700] text-[#e5e7eb] truncate",
                                isDone && "line-through"
                              )}>
                                {habit.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={10} className="text-[#d1d5db]" />
                              <span className="text-[10px] font-[500] text-[#d1d5db]">
                                {habit.time}
                              </span>
                            </div>
                          </button>
                        );
                      })}

                      {habitsInPeriod.length === 0 && (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-[#374151]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3 mt-6">
          {weekDays.map((day) => {
            const dStr = format(day, 'yyyy-MM-dd');
            const habitsForDay = habits.filter(h => h.active && h.weekDays.includes(getDay(day)));
            const done = habitsForDay.filter(h => h.completedDates.includes(dStr)).length;
            
            return (
              <div key={day.toString()} className="text-center pt-3 border-t border-[#374151]">
                <span className="text-[11px] font-[700] text-[#9ca3af] uppercase tracking-[0.05em]">
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