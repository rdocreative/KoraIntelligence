import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export type Habit = {
  id: string;
  title: string;
  points: number;
  completed: boolean;
  type: 'fixed' | 'custom';
};

export type DailyRecord = {
  date: string; // YYYY-MM-DD
  points: number;
  completedHabitIds: string[];
};

export const FIXED_HABITS: Habit[] = [
  { id: '1', title: 'Meditei 5 minutos', points: 5, completed: false, type: 'fixed' },
  { id: '2', title: 'Bebi 2L de água', points: 3, completed: false, type: 'fixed' },
  { id: '3', title: 'Fiz exercício 20 min', points: 10, completed: false, type: 'fixed' },
  { id: '4', title: 'Li 10 páginas de livro', points: 4, completed: false, type: 'fixed' },
  { id: '5', title: 'Lavou a louça sem reclamar', points: 5, completed: false, type: 'fixed' },
  { id: '6', title: 'Gratidão: 3 coisas boas', points: 6, completed: false, type: 'fixed' },
];

export const BADGES = [
  { name: 'Iniciante', threshold: 0, color: 'text-slate-600', icon: '🌱' },
  { name: 'Bronze', threshold: 50, color: 'text-amber-600', icon: '🥉' },
  { name: 'Prata', threshold: 150, color: 'text-slate-400', icon: '🥈' },
  { name: 'Ouro', threshold: 300, color: 'text-yellow-500', icon: '🥇' },
  { name: 'Mestre Mindset', threshold: 500, color: 'text-purple-600', icon: '👑' },
];

interface HabitContextType {
  habits: Habit[];
  totalPoints: number;
  history: DailyRecord[];
  streak: number;
  completeHabit: (id: string) => void;
  addCustomHabit: (title: string, points: number) => void;
  getCurrentBadge: () => typeof BADGES[0];
  getNextBadge: () => typeof BADGES[0] | null;
  badges: typeof BADGES;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]); // Start empty to prevent hydration mismatch if possible, but handled in effect
  const [totalPoints, setTotalPoints] = useState(0);
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [streak, setStreak] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper to calculate streak
  const calculateStreak = (historyData: DailyRecord[]) => {
    if (historyData.length === 0) return 0;

    const sortedHistory = [...historyData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    // Map dates to points for easier lookup
    const dateMap = new Map<string, number>();
    sortedHistory.forEach(d => dateMap.set(d.date, d.points));

    let currentStreak = 0;
    let checkDate = new Date();
    
    // Start checking from today if we have points, otherwise from yesterday
    if (!dateMap.has(today) || (dateMap.get(today) || 0) === 0) {
        // If no points today, check if we have points yesterday to maintain streak
        if (!dateMap.has(yesterday) || (dateMap.get(yesterday) || 0) === 0) {
            return 0;
        }
        checkDate = yesterdayDate;
    }

    // Safety loop limit
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
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    setHistory(parsedHistory);

    let parsedCustomHabits: Habit[] = [];
    if (storedCustomHabits) {
        try {
            parsedCustomHabits = JSON.parse(storedCustomHabits);
        } catch (e) {
            console.error("Failed to parse custom habits", e);
        }
    }

    // Calculate total points
    const total = parsedHistory.reduce((sum, day) => sum + day.points, 0);
    setTotalPoints(total);

    // Calculate Streak
    setStreak(calculateStreak(parsedHistory));

    // Initialize Habits for today
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = parsedHistory.find(d => d.date === today);
    const completedIds = todayRecord ? todayRecord.completedHabitIds : [];

    // Merge fixed and custom habits, marking completed ones
    const initialHabits = [...FIXED_HABITS, ...parsedCustomHabits].map(h => ({
      ...h,
      completed: completedIds.includes(h.id)
    }));
    
    setHabits(initialHabits);
    setIsInitialized(true);
  }, []);

  const completeHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habitIndex = habits.findIndex(h => h.id === id);
    if (habitIndex === -1) return;
    
    const habit = habits[habitIndex];
    if (habit.completed) return; // Already completed

    // Optimistic update
    const newHabits = [...habits];
    newHabits[habitIndex] = { ...habit, completed: true };
    setHabits(newHabits);

    // Update History
    setHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const todayIndex = newHistory.findIndex(d => d.date === today);
        
        let newPoints = totalPoints;

        if (todayIndex >= 0) {
            newHistory[todayIndex] = {
                ...newHistory[todayIndex],
                points: newHistory[todayIndex].points + habit.points,
                completedHabitIds: [...newHistory[todayIndex].completedHabitIds, id]
            };
        } else {
            newHistory.push({
                date: today,
                points: habit.points,
                completedHabitIds: [id]
            });
        }
        
        // Save to localStorage
        localStorage.setItem('mindset_history', JSON.stringify(newHistory));
        
        // Recalculate streak
        setStreak(calculateStreak(newHistory));
        
        // Update total points
        const addedPoints = habit.points;
        setTotalPoints(prev => {
            const nextTotal = prev + addedPoints;
            checkBadge(prev, nextTotal);
            return nextTotal;
        });

        return newHistory;
    });
  };

  const checkBadge = (prevPoints: number, newPoints: number) => {
    // Check if we crossed a threshold
    const newBadge = BADGES.find(b => prevPoints < b.threshold && newPoints >= b.threshold);
    if (newBadge && newBadge.threshold > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#C0C0C0', '#CD7F32'] // Gold, Silver, Bronze colors
      });
    } else {
        // Mini confetti for task completion
        confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 },
            disableForReducedMotion: true,
            ticks: 200,
            gravity: 1.2,
            colors: ['#6EE7B7', '#3B82F6', '#F472B6'] // Mint, Blue, Pink
        });
    }
  };

  const addCustomHabit = (title: string, points: number) => {
    const newHabit: Habit = {
      id: `custom-${Date.now()}`,
      title,
      points,
      completed: false, // Starts uncompleted
      type: 'custom'
    };

    const newHabitsList = [...habits, newHabit];
    setHabits(newHabitsList);
    
    // Save only custom habits definition
    const customHabitsToSave = newHabitsList.filter(h => h.type === 'custom').map(h => ({
        ...h,
        completed: false // Don't save completion status in the definition
    }));
    localStorage.setItem('mindset_custom_habits', JSON.stringify(customHabitsToSave));
  };

  const getCurrentBadge = () => {
    let current = BADGES[0];
    for (const badge of BADGES) {
        if (totalPoints >= badge.threshold) {
            current = badge;
        }
    }
    return current;
  };

  const getNextBadge = () => {
    return BADGES.find(b => b.threshold > totalPoints) || null;
  };

  // Only render children when initialized to avoid flashes of empty content
  if (!isInitialized) return null;

  return (
    <HabitContext.Provider value={{
      habits,
      totalPoints,
      history,
      streak,
      completeHabit,
      addCustomHabit,
      getCurrentBadge,
      getNextBadge,
      badges: BADGES
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabitTracker = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabitTracker deve ser usado dentro de um HabitProvider");
  }
  return context;
};