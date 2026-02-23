"use client";

import React from 'react';
import { format, startOfWeek, addDays, getDay, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Habit {
  id: string;
  title: string;
  emoji: string;
  weekDays: number[];
  time: string;
  completedDates: string[];
  active: boolean;
  priority: number;
}

interface WeeklyViewProps {
  currentDate: Date;
  habits: Habit[];
  onToggleHabit: (id: string, date: Date) => void;
}

const getPriorityColors = (priority: number, isCompleted: boolean) => {
  if (isCompleted) {
    return {
      bg: "rgba(34, 211, 238, 0.1)",
      border: "rgba(34, 211, 238, 0.3)",
      text: "#22d3ee",
      circle: "#22d3ee"
    };
  }

  switch (priority) {
    case 0: // Máxima
      return {
        bg: "rgba(239, 68, 68, 0.15)",
        border: "rgba(239, 68, 68, 0.3)",
        text: "#ef4444",
        circle: "#ef4444"
      };
    case 1: // Alta
      return {
        bg: "rgba(249, 115, 22, 0.15)",
        border: "rgba(249, 115, 22, 0.3)",
        text: "#f97316",
        circle: "#f97316"
      };
    case 2: // Média
      return {
        bg: "rgba(234, 179, 8, 0.15)",
        border: "rgba(234, 179, 8, 0.3)",
        text: "#eab308",
        circle: "#eab308"
      };
    default: // Normal
      return {
        bg: "rgba(74, 222, 128, 0.15)",
        border: "rgba(74, 222, 128, 0.3)",
        text: "#4ade80",
        circle: "#4ade80"
      };
  }
};

const WeeklyView = ({ currentDate, habits, onToggleHabit }: WeeklyViewProps) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-7 gap-1 md:gap-3 min-h-[400px]">
      {weekDays.map((day, i) => {
        const dStr = format(day, 'yyyy-MM-dd');
        const dayName = format(day, 'EEEE', { locale: ptBR }).toUpperCase();
        const dayNumber = format(day, 'd');
        const isToday = isSameDay(day, new Date());
        
        const dayHabits = habits.filter(h => h.active && h.weekDays.includes(getDay(day)));

        return (
          <div key={i} className="flex flex-col gap-3">
            {/* Header do Dia */}
            <div className={cn(
              "flex flex-col items-center py-3 border-b-2 transition-colors",
              isToday ? "border-[#22d3ee]" : "border-white/5"
            )}>
              <span className={cn(
                "text-[9px] font-[900] tracking-widest",
                isToday ? "text-[#22d3ee]" : "text-white/30"
              )}>
                {dayName}
              </span>
              <span className={cn(
                "text-[22px] font-[950] leading-none mt-1",
                isToday ? "text-white" : "text-white/60"
              )}>
                {dayNumber}
              </span>
            </div>

            {/* Lista de Hábitos do Dia */}
            <div className="flex flex-col gap-2">
              {dayHabits.map((habit) => {
                const isCompleted = habit.completedDates.includes(dStr);
                const colors = getPriorityColors(habit.priority, isCompleted);

                return (
                  <button
                    key={habit.id}
                    onClick={() => onToggleHabit(habit.id, day)}
                    className={cn(
                      "group relative flex flex-col items-start p-2.5 rounded-[14px] border-[1.5px] transition-all duration-200 active:scale-[0.97]",
                      isCompleted ? "opacity-50 grayscale-[0.5]" : "hover:brightness-110"
                    )}
                    style={{
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                    }}
                  >
                    <div className="flex items-center gap-2 w-full mb-0.5">
                      <div 
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                        style={{ 
                          borderColor: colors.circle,
                          backgroundColor: isCompleted ? colors.circle : 'transparent' 
                        }}
                      >
                        {isCompleted && <Check size={10} className="text-[#06090e] stroke-[4px]" />}
                      </div>
                      <span className={cn(
                        "text-[11px] font-[800] truncate text-left",
                        isCompleted ? "line-through" : "text-white"
                      )}>
                        {habit.title}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-white/40 ml-6">
                      {habit.time}
                    </span>
                  </button>
                );
              })}
              
              {dayHabits.length === 0 && (
                <div className="h-10 rounded-[14px] border border-dashed border-white/5 flex items-center justify-center">
                  <span className="text-[8px] font-black text-white/10 uppercase">Vazio</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyView;