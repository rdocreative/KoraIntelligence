import { useState, useEffect } from "react";

export interface Habit {
  id: string;
  title: string;
  completed: boolean;
  streak: number;
}

export interface DailyRecord {
  date: string;
  points: number;
}

export const useHabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", title: "Beber 2L de água", completed: false, streak: 5 },
    { id: "2", title: "Ler 10 páginas", completed: false, streak: 12 },
    { id: "3", title: "Exercício físico", completed: true, streak: 3 },
  ]);

  const [totalPoints, setTotalPoints] = useState(750);
  
  // Mock history data for the chart
  const [history] = useState<DailyRecord[]>(() => {
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      data.push({
        date: d.toISOString().split('T')[0],
        points: Math.floor(Math.random() * 100) + (i * 20) // Increasing trend mock
      });
    }
    return data;
  });

  const completeHabit = (id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const isCompleting = !habit.completed;
        // Update points
        if (isCompleting) setTotalPoints(p => p + 10);
        else setTotalPoints(p => Math.max(0, p - 10));
        
        return {
          ...habit,
          completed: isCompleting,
          streak: isCompleting ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    }));
  };

  const addHabit = (title: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      completed: false,
      streak: 0
    };
    setHabits(prev => [...prev, newHabit]);
  };

  return {
    habits,
    totalPoints,
    history,
    completeHabit,
    addHabit
  };
};