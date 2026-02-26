"use client";

import React from 'react';
import { TaskColumn } from '@/components/tasks/TaskColumn';

// Mock data para exemplo
const MOCK_TASKS = [
  { id: '1', name: 'Reunião de Alinhamento', time: '09:00', priority: 'Extrema', period: 'Morning', icon: '🤝' },
  { id: '2', name: 'Desenvolvimento Frontend', time: '14:00', priority: 'Média', period: 'Afternoon', icon: '💻' },
  { id: '3', name: 'Academia', time: '18:30', priority: 'Baixa', period: 'Evening', icon: '💪' },
  { id: '4', name: 'Leitura', time: '23:00', priority: 'Baixa', period: 'Evening', icon: '📚' },
  { id: '5', name: 'Meditação', time: '01:00', priority: 'Baixa', period: 'Dawn', icon: '🧘' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8 overflow-x-auto custom-scrollbar">
      <header className="mb-12 max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif italic font-bold tracking-tight mb-2">My Day</h1>
        <p className="text-zinc-500 text-sm font-medium">Organize sua rotina com clareza e elegância.</p>
      </header>

      <main className="flex gap-8 max-w-7xl mx-auto pb-20">
        <TaskColumn 
          id="today" 
          title="Hoje — Segunda-feira" 
          tasks={MOCK_TASKS} 
          isToday={true} 
        />
        <TaskColumn 
          id="tomorrow" 
          title="Amanhã — Terça-feira" 
          tasks={[]} 
          isToday={false} 
        />
      </main>
    </div>
  );
};

export default Index;