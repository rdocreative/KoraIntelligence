import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export type Habit = {
  id: string;
  title: string;
  description?: string;
  points: number;
  completed: boolean;
  type: 'fixed' | 'custom';
  days: number[]; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
};

export type DailyRecord = {
  date: string; // YYYY-MM-DD
  points: number;
  completedHabitIds: string[];
};

export const FIXED_HABITS: Habit[] = [];

export const BADGES = [
  { name: 'Iniciante', threshold: 0, color: 'text-slate-600', icon: '🌱' },
  { name: 'Bronze', threshold: 100, color: 'text-amber-600', icon: '🥉' },
  { name: 'Prata', threshold: 500, color: 'text-slate-400', icon: '🥈' },
  { name: 'Ouro', threshold: 1000, color: 'text-yellow-500', icon: '🥇' },
  { name: 'Mestre Mindset', threshold: 2500, color: 'text-purple-600', icon: '👑' },
];

interface HabitContextType {
  habits: Habit[];
  totalPoints: number;
  history: DailyRecord[];
  streak: number;
  completeHabit: (id: string) => void;
  addCustomHabit: (title: string, points: number, days: number[], description?: string) => void;
  getCurrentBadge: () => typeof BADGES[0];
  getNextBadge: () => typeof BADGES[0] | null;
  badges: typeof BADGES;
  resetAllData: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [streak, setStreak] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const calculateStreak = (historyData: DailyRecord[]) => {
    if (historyData.length === 0) return 0;
    const sortedHistory = [...historyData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    const dateMap = new Map<string, number>();
    sortedHistory.forEach(d => dateMap.set(d.date, d.points));

    let currentStreak = 0;
    let checkDate = new Date();
    
    if (!dateMap.has(today) || (dateMap.get(today) || 0) === 0) {
        if (!dateMap.has(yesterday) || (dateMap.get(yesterday) || 0) === 0) return 0;
        checkDate = yesterdayDate;
    }

    for(let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (dateMap.has(dateStr) && (dateMap.get(dateStr) || 0) > 0) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    return currentStreak;
  };

  useEffect(() => {
    const storedHistory = localStorage.getItem('mindset_history');
    const storedCustomHabits = localStorage.getItem('mindset_custom_habits');
    
    let parsedHistory: DailyRecord[] = [];
    if (storedHistory) {
      try {
        parsedHistory = JSON.parse(storedHistory);
      } catch (e) { console.error(e); }
    }
    setHistory(parsedHistory);

    let parsedCustomHabits: Habit[] = [];
    if (storedCustomHabits) {
        try {
            parsedCustomHabits = JSON.parse(storedCustomHabits);
        } catch (e) { console.error(e); }
    }

    setTotalPoints(parsedHistory.reduce((sum, day) => sum + day.points, 0));
    setStreak(calculateStreak(parsedHistory));

    const today = new Date().toISOString().split('T')[0];
    const todayRecord = parsedHistory.find(d => d.date === today);
    const completedIds = todayRecord ? todayRecord.completedHabitIds : [];

    setHabits([...FIXED_HABITS, ...parsedCustomHabits].map(h => ({
      ...h,
      completed: completedIds.includes(h.id)
    })));
    setIsInitialized(true);
  }, []);

  const completeHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habitIndex = habits.findIndex(h => h.id === id);
    if (habitIndex === -1) return;
    
    const habit = habits[habitIndex];
    if (habit.completed) return;

    const newHabits = [...habits];
    newHabits[habitIndex] = { ...habit, completed: true };
    setHabits(newHabits);

    setHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const todayIndex = newHistory.findIndex(d => d.date === today);
        
        if (todayIndex >= 0) {
            newHistory[todayIndex] = {
                ...newHistory[todayIndex],
                points: newHistory[todayIndex].points + habit.points,
                completedHabitIds: [...newHistory[todayIndex].completedHabitIds, id]
            };
        } else {
            newHistory.push({ date: today, points: habit.points, completedHabitIds: [id] });
        }
        
        localStorage.setItem('mindset_history', JSON.stringify(newHistory));
        setStreak(calculateStreak(newHistory));
        
        setTotalPoints(prev => {
            const nextTotal = prev + habit.points;
            const newBadge = BADGES.find(b => prev < b.threshold && nextTotal >= b.threshold);
            if (newBadge && newBadge.threshold > 0) {
              confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            } else {
              confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 }, ticks: 200, gravity: 1.2 });
            }
            return nextTotal;
        });

        return newHistory;
    });
  };

  const addCustomHabit = (title: string, points: number, days: number[], description?: string) => {
    const newHabit: Habit = {
      id: `custom-${Date.now()}`,
      title,
      description,
      points,
      days,
      completed: false,
      type: 'custom'
    };
    const newHabitsList = [...habits, newHabit];
    setHabits(newHabitsList);
    localStorage.setItem('mindset_custom_habits', JSON.stringify(newHabitsList.filter(h => h.type === 'custom').map(h => ({ ...h, completed: false }))));
  };

  const resetAllData = () => {
    localStorage.removeItem('mindset_history');
    localStorage.removeItem('mindset_custom_habits');
    setHabits([]);
    setTotalPoints(0);
    setHistory([]);
    setStreak(0);
    window.location.reload();
  };

  const getCurrentBadge = () => {
    let current = BADGES[0];
    for (const badge of BADGES) { if (totalPoints >= badge.threshold) current = badge; }
    return current;
  };

  const getNextBadge = () => BADGES.find(b => b.threshold > totalPoints) || null;

  if (!isInitialized) return null;

  return (
    <HabitContext.Provider value={{
      habits, totalPoints, history, streak, completeHabit, addCustomHabit, getCurrentBadge, getNextBadge, badges: BADGES, resetAllData
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabitTracker = () => {
  const context = useContext(HabitContext);
  if (!context) throw new Error("useHabitTracker deve ser usado dentro de um HabitProvider");
  return context;
};