"use client";

import React, { useMemo } from "react";
import { 
  format, 
  startOfWeek, 
  eachDayOfInterval, 
  addDays, 
  isSameDay, 
  parse
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sun, CloudSun, Moon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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

const periods = [
  { id: 'morning', label: 'Manhã', icon: Sun, range: [6, 12] },
  { id: 'afternoon', label: 'Tarde', icon: CloudSun, range: [12, 18] },
  { id: 'night', label: 'Noite', icon: Moon, range: [18, 24] },
];

const WeeklyView = ({ currentDate, habits, onToggleHabit }: WeeklyViewProps) => {
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({
      start,
      end: addDays(start, 6),
    });
  }, [currentDate]);

  const getHabitsForCell = (day: Date, periodRange: number[]) => {
    const dayOfWeek = day.getDay();
    const [start, end] = periodRange;
    
    return habits.filter(h => {
      if (!h.active || !h.weekDays.includes(dayOfWeek)) return false;
      const hour = parseInt(h.time.split(':')[0]);
      return hour >= start && hour < end;
    });
  };

  const priorityGradients = {
    high: "bg-[linear-gradient(135deg,#2a0808,#0a0505)]",
    medium: "bg-[linear-gradient(135deg,#2a1800,#0a0800)]",
    low: "bg-[linear-gradient(135deg,#002a12,#000a05)]"
  };

  return (
    <div className="w-full bg-[#071412] border border-[#1e3a36] rounded-[14px] overflow-hidden flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex border-b border-[#1e3a36]">
        <div className="w-[80px] shrink-0 border-r border-[#1e3a36] bg-[#0d1e1c]" />
        {weekDays.map((day, i) => {
          const isToday = isSameDay(day, new Date());
          return (
            <div key={i} className="flex-1 p-3 text-center border-r border-[#1e3a36] last:border-r-0">
              <div className={cn(
                "text-[11px] font-[700] uppercase tracking-wider mb-1",
                isToday ? "text-[#38bdf8]" : "text-[#5a8a85]"
              )}>
                {format(day, 'eee', { locale: ptBR })}
              </div>
              <div className={cn(
                "text-[18px] font-[800]",
                isToday ? "text-[#38bdf8]" : "text-[#e8f5f3]"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Content */}
      <div className="flex-1">
        {periods.map((period) => (
          <div key={period.id} className="flex min-h-[120px] border-b border-[#1e3a36] last:border-b-0">
            {/* Period Label Column */}
            <div className="w-[80px] shrink-0 border-r border-[#1e3a36] flex flex-col items-center justify-center gap-1 bg-[#0d1e1c]">
              <period.icon size={16} className="text-[#5a8a85]" />
              <span className="text-[10px] font-[700] text-[#5a8a85] uppercase tracking-tighter">
                {period.label}
              </span>
            </div>

            {/* Day Columns */}
            {weekDays.map((day, i) => {
              const cellHabits = getHabitsForCell(day, period.range);
              const isToday = isSameDay(day, new Date());
              const dateStr = format(day, 'yyyy-MM-dd');

              return (
                <div 
                  key={i} 
                  className={cn(
                    "flex-1 p-[6px] border-r border-[#1e3a36] last:border-r-0 overflow-hidden",
                    isToday ? "bg-[#0f2824]/40" : "bg-[linear-gradient(135deg,#0a1e1c_0%,#071412_100%)]"
                  )}
                >
                  {cellHabits.map(habit => {
                    const isCompleted = habit.completedDates.includes(dateStr);
                    return (
                      <div 
                        key={habit.id}
                        onClick={() => onToggleHabit(habit.id, day)}
                        className={cn(
                          "p-[4px_7px] mb-1.5 rounded-[6px] flex items-center gap-[5px] cursor-pointer transition-all",
                          priorityGradients[habit.priority],
                          isCompleted ? "opacity-40" : "opacity-100 hover:brightness-125"
                        )}
                      >
                        <div className={cn(
                          "h-[10px] w-[10px] rounded-full border border-[#5a8a85] shrink-0 flex items-center justify-center transition-all",
                          isCompleted && "bg-[#00e5cc] border-[#00e5cc]"
                        )}>
                          {isCompleted && <Check size={6} className="text-[#071412] stroke-[4px]" />}
                        </div>
                        <span className={cn(
                          "text-[11px] font-[600] text-[#e8f5f3] truncate flex-1",
                          isCompleted && "line-through"
                        )}>
                          {habit.title.length > 12 ? habit.title.slice(0, 11) + '...' : habit.title}
                        </span>
                        <span className="text-[9px] font-[700] text-[#5a8a85] shrink-0">
                          {habit.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex bg-[#0d1e1c]">
        <div className="w-[80px] shrink-0 border-r border-[#1e3a36]" />
        {weekDays.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayOfWeek = day.getDay();
          const scheduled = habits.filter(h => h.active && h.weekDays.includes(dayOfWeek));
          const completed = scheduled.filter(h => h.completedDates.includes(dateStr)).length;
          
          return (
            <div key={i} className="flex-1 py-1.5 text-center border-r border-[#1e3a36] last:border-r-0">
              <span className="text-[10px] font-[700] text-[#5a8a85] uppercase">
                {completed}/{scheduled.length} feitos
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyView;