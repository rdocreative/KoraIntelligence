"use client";

import { useState } from 'react';

export const useHabitTracker = () => {
  const [habits, setHabits] = useState([
    { id: '1', name: 'Treino de Força', completed: true, streak: 5 },
    { id: '2', name: 'Meditação', completed: false, streak: 12 },
    { id: '3', name: 'Beber 2L de Água', completed: true, streak: 3 },
  ]);

  const addHabit = (name: string) => {
    setHabits([...habits, { id: Date.now().toString(), name, completed: false, streak: 0 }]);
  };

  const completeHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const stats = {
    totalPoints: 1250,
    streak: 12,
    badge: 'Fênix',
    nextBadge: 'Mestre'
  };

  const history = [
    { date: '2023-10-01', count: 5 },
    { date: '2023-10-02', count: 8 },
    { date: '2023-10-03', count: 6 },
  ];

  return { habits, addHabit, completeHabit, stats, history };
};