"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, CalendarDays, Flame, 
  BarChart3, CheckCircle2, Target, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useHabitTracker } from "@/hooks/useHabitTracker";
import { HabitCard } from "@/components/features/habit-tracker/HabitCard";

const HabitsPage = () => {
  const { habits, completeHabit, addCustomHabit, totalPoints, streak } = useHabitTracker();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const currentDate = new Date();

  // Stats calculation
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const activeHabits = habits.filter(h => h.type !== 'fixed' || h.active !== false); // Assuming active property
  const scheduledToday = activeHabits.filter(h => h.days.includes(getDay(new Date())));
  const completedToday = activeHabits.filter(h => h.completed && h.days.includes(getDay(new Date()))).length; // Simplify check

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const startDate = monthStart; // Simplification for UI
    const endDate = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    return days;
  }, []);

  const handleCreateHabit = () => {
    if(!newHabitName) return;
    addCustomHabit(newHabitName, 10, [0,1,2,3,4,5,6]);
    setNewHabitName("");
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card-blue p-5 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-sm font-extrabold uppercase tracking-wider text-white/90">Total</span>
            <Target className="w-6 h-6 text-white/40" />
          </div>
          <span className="text-4xl font-black">{activeHabits.length}</span>
        </div>
        <div className="stat-card-orange p-5 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-sm font-extrabold uppercase tracking-wider text-white/90">Streak</span>
            <Flame className="w-6 h-6 text-white/40" />
          </div>
          <span className="text-4xl font-black">{streak} dias</span>
        </div>
        <div className="stat-card-green p-5 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-sm font-extrabold uppercase tracking-wider text-white/90">Hoje</span>
            <CheckCircle2 className="w-6 h-6 text-white/40" />
          </div>
          <span className="text-4xl font-black">{completedToday}/{scheduledToday.length}</span>
        </div>
        <div className="stat-card-purple p-5 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
             <span className="text-sm font-extrabold uppercase tracking-wider text-white/90">XP Mês</span>
             <BarChart3 className="w-6 h-6 text-white/40" />
          </div>
          <span className="text-4xl font-black">1.2k</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Habits List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-extrabold text-white uppercase tracking-wide">Meus Hábitos</h2>
             
             <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                   <Button className="btn-primary h-12 px-6 flex items-center gap-2 text-duo-bg">
                      <Plus size={20} strokeWidth={3} /> NOVO HÁBITO
                   </Button>
                </DialogTrigger>
                <DialogContent className="bg-duo-panel border-2 border-duo-gray text-white rounded-3xl shadow-3d-panel">
                   <DialogHeader>
                      <DialogTitle className="uppercase font-extrabold tracking-wider text-duo-primary">Criar Novo Hábito</DialogTitle>
                   </DialogHeader>
                   <div className="space-y-4 py-4">
                      <div className="space-y-2">
                         <Label className="uppercase font-bold text-gray-500 text-xs tracking-widest">Nome do Hábito</Label>
                         <Input 
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            className="bg-duo-bg border-2 border-duo-gray rounded-xl h-12 text-white font-bold focus:border-duo-primary focus:ring-0" 
                            placeholder="Ex: Ler 10 páginas"
                         />
                      </div>
                   </div>
                   <DialogFooter>
                      <Button onClick={handleCreateHabit} className="btn-primary w-full h-12">Criar Hábito</Button>
                   </DialogFooter>
                </DialogContent>
             </Dialog>
          </div>

          <div className="space-y-3">
             {activeHabits.length === 0 ? (
                <div className="panel p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                   <CalendarDays size={48} className="text-duo-gray mb-4" />
                   <p className="text-gray-500 font-bold uppercase">Nenhum hábito criado ainda.</p>
                </div>
             ) : (
                activeHabits.map((habit, index) => (
                   <HabitCard 
                      key={habit.id} 
                      habit={habit} 
                      onComplete={completeHabit} 
                      index={index} 
                   />
                ))
             )}
          </div>
        </div>

        {/* Sidebar: Calendar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="panel p-6">
              <div className="flex items-center gap-2 mb-6 text-gray-400 font-extrabold uppercase tracking-widest text-sm border-b-2 border-duo-gray pb-4">
                 <Calendar size={16} /> Visão Mensal
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center mb-2">
                 {['D','S','T','Q','Q','S','S'].map(d => (
                    <span key={d} className="text-xs font-bold text-duo-primary">{d}</span>
                 ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                 {calendarDays.map((day, i) => (
                    <div 
                       key={i}
                       className={cn(
                          "aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                          isSameDay(day, new Date()) 
                             ? "bg-duo-primary text-duo-bg border-2 border-duo-primary" 
                             : "bg-duo-sidebar text-gray-500",
                          // Fake logic for completed days visualization
                          Math.random() > 0.7 && !isSameDay(day, new Date()) && "bg-card-green text-white"
                       )}
                    >
                       {format(day, 'd')}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;