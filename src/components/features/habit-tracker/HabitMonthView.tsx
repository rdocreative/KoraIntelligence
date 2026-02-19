"use client";

import { useHabitTracker } from "@/hooks/useHabitTracker";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export const HabitMonthView = () => {
  const { habits, history } = useHabitTracker();
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return {
      date: d.toISOString().split('T')[0],
      day: i + 1,
      weekday: d.toLocaleDateString('pt-BR', { weekday: 'narrow' })
    };
  });

  return (
    <div className="card-glass p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
         <h3 className="font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Visão Mensal
         </h3>
         <span className="text-xs font-black text-neutral-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
            {today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
         </span>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex flex-col gap-3 min-w-max">
          {/* Header Row */}
          <div className="flex gap-1 ml-48 border-b border-white/5 pb-2">
             {days.map((d) => {
                const isToday = d.date === new Date().toISOString().split('T')[0];
                return (
                    <div key={d.day} className={cn(
                      "w-8 flex flex-col items-center gap-1",
                      isToday ? "text-red-500 font-bold scale-110" : "text-neutral-600"
                    )}>
                       <span className="text-[9px] uppercase font-black opacity-70">{d.weekday}</span>
                       <span className="text-xs">{d.day}</span>
                    </div>
                );
             })}
          </div>

          {/* Habit Rows */}
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center gap-1 group hover:bg-white/5 p-1 rounded-lg transition-colors">
               <div className="w-48 sticky left-0 z-10 bg-transparent group-hover:bg-white/5 backdrop-blur-md transition-colors pr-4 flex items-center justify-end border-r border-white/5 shadow-[5px_0_10px_-5px_rgba(0,0,0,0.5)]">
                  <span className="text-xs font-bold text-neutral-400 truncate text-right w-full uppercase tracking-tight group-hover:text-white transition-colors">
                    {habit.title}
                  </span>
               </div>
               
               {days.map((d) => {
                 const record = history.find(h => h.date === d.date);
                 const isCompleted = record?.completedHabitIds.includes(habit.id);
                 const isFuture = new Date(d.date) > new Date();
                 const isToday = d.date === new Date().toISOString().split('T')[0];

                 return (
                   <div key={d.date} className="w-8 flex justify-center items-center">
                      <div className={cn(
                        "w-6 h-6 rounded-md transition-all duration-300 border flex items-center justify-center",
                        isCompleted 
                            ? "bg-red-600 border-red-500 shadow-[0_0_8px_rgba(220,38,38,0.6)]" 
                            : "bg-white/[0.05] border-white/5",
                        !isCompleted && !isFuture && "opacity-50",
                        !isCompleted && isFuture && "opacity-20 border-dashed border-white/20 bg-transparent",
                        isToday && !isCompleted && "border-red-500/50 animate-pulse bg-red-900/10"
                      )} />
                   </div>
                 );
               })}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="bg-neutral-900" />
      </ScrollArea>
    </div>
  );
};