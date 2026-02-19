"use client";

import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export const HabitList = ({ habits, onComplete }: any) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6 font-['Rajdhani']">
        <div className="w-2 h-2 bg-red-600 rounded-full" />
        HÁBITOS DIÁRIOS
      </h2>
      {habits.map((habit: any) => (
        <div 
          key={habit.id}
          onClick={() => onComplete(habit.id)}
          className={`item-ghost p-5 flex items-center justify-between cursor-pointer group ${habit.completed ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center gap-4">
            {habit.completed ? (
              <CheckCircle2 className="text-red-600 w-6 h-6" />
            ) : (
              <Circle className="text-white/20 group-hover:text-red-600/50 w-6 h-6 transition-colors" />
            )}
            <div>
              <h3 className={`font-semibold ${habit.completed ? 'line-through' : ''}`}>{habit.name}</h3>
              <p className="text-xs text-white/30 uppercase tracking-widest">{habit.streak} dias de sequência</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};