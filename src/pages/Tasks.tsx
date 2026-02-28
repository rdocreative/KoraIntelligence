"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { WeeklyView } from '@/components/tasks/WeeklyView';
import { MonthlyView } from '@/components/tasks/MonthlyView';
import { Calendar, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

const Tasks = () => {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="flex h-screen bg-[#090a0f] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Minhas Tarefas" />
        
        <main className="flex-1 flex flex-col overflow-hidden pt-6">
          <div className="px-8 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setView('weekly')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  view === 'weekly' ? "bg-white/[0.08] text-white shadow-xl" : "text-white/40 hover:text-white/60"
                )}
              >
                <LayoutGrid size={16} />
                Semanal
              </button>
              <button
                onClick={() => setView('monthly')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  view === 'monthly' ? "bg-white/[0.08] text-white shadow-xl" : "text-white/40 hover:text-white/60"
                )}
              >
                <Calendar size={16} />
                Mensal
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {view === 'weekly' ? (
              <WeeklyView currentDate={currentDate} />
            ) : (
              <MonthlyView currentDate={currentDate} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;