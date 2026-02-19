import { useState, useEffect } from 'react';

export interface Habit {
  id: string;
  title: string;
  points: number;
  days: number[];
  completed: boolean;
  streak: number;
}

export interface DailyRecord {
  date: string;
  points: number;
}

export const useHabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('user_habits');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Meditação Matinal', points: 50, days: [1, 2, 3, 4, 5], completed: false, streak: 5 },
      { id: '2', title: 'Leitura 20min', points: 30, days: [0, 1, 2, 3, 4, 5, 6], completed: false, streak: 12 },
      { id: '3', title: 'Treino Intenso', points: 100, days: [1, 3, 5], completed: false, streak: 3 },
    ];
  });

  const [totalPoints, setTotalPoints] = useState(() => {
    const saved = localStorage.getItem('total_xp');
    return saved ? parseInt(saved) : 450;
  });

  const [history, setHistory] = useState<DailyRecord[]>(() => {
    const saved = localStorage.getItem('xp_history');
    return saved ? JSON.parse(saved) : [];
  });

  const completeHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id && !h.completed) {
        const newPoints = totalPoints + h.points;
        setTotalPoints(newPoints);
        localStorage.setItem('total_xp', newPoints.toString());
        return { ...h, completed: true, streak: h.streak + 1 };
      }
      return h;
    }));
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'completed' | 'streak'>) => {
    const newHabit = { ...habit, id: Math.random().toString(36).substr(2, 9), completed: false, streak: 0 };
    setHabits(prev => [...prev, newHabit]);
  };

  useEffect(() => {
    localStorage.setItem('user_habits', JSON.stringify(habits));
  }, [habits]);

  return { habits, totalPoints, history, completeHabit, addHabit };
};