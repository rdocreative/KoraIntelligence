import { useState, useEffect, createContext, useContext } from 'react';

export type TaskItem = {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
};

export type KeyArea = {
  id: string;
  title: string;
  items: TaskItem[];
};

export type MonthlyData = {
  id: number; // 0-11
  name: string;
  goals: TaskItem[];
  notes: string;
  review: {
    worked: string;
    didntWork: string;
    adjust: string;
  };
};

export type WeeklyData = {
  id: string;
  goal: string;
  startDate: string;
  endDate: string;
  reviewDate: string;
  tasks: TaskItem[];
  review: {
    worked: string;
    didntWork: string;
    improve: string;
  };
};

export type MasterplanData = {
  isTutorialCompleted: boolean; // Novo campo
  annual: {
    objective: string;
    successCriteria: string;
    progress: number;
  };
  areas: {
    work: TaskItem[];
    studies: TaskItem[];
    health: TaskItem[];
    personal: TaskItem[];
  };
  months: MonthlyData[];
  weeks: WeeklyData[];
};

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DEFAULT_DATA: MasterplanData = {
  isTutorialCompleted: false,
  annual: { objective: "", successCriteria: "", progress: 0 },
  areas: { work: [], studies: [], health: [], personal: [] },
  months: MONTH_NAMES.map((name, i) => ({
    id: i,
    name,
    goals: [],
    notes: "",
    review: { worked: "", didntWork: "", adjust: "" }
  })),
  weeks: []
};

interface MasterplanContextType {
  data: MasterplanData;
  completeTutorial: () => void;
  resetTutorial: () => void;
  updateAnnual: (updates: Partial<MasterplanData['annual']>) => void;
  addAreaItem: (area: keyof MasterplanData['areas'], text: string) => void;
  toggleAreaItem: (area: keyof MasterplanData['areas'], id: string) => void;
  deleteAreaItem: (area: keyof MasterplanData['areas'], id: string) => void;
  updateMonth: (monthIndex: number, updates: Partial<MonthlyData>) => void;
  addMonthGoal: (monthIndex: number, text: string) => void;
  toggleMonthGoal: (monthIndex: number, id: string) => void;
  updateMonthReview: (monthIndex: number, field: keyof MonthlyData['review'], value: string) => void;
  addWeek: (week: Omit<WeeklyData, 'id' | 'tasks' | 'review'>) => void;
  deleteWeek: (id: string) => void;
  addWeekTask: (weekId: string, text: string) => void;
  toggleWeekTask: (weekId: string, taskId: string) => void;
  updateWeekReview: (weekId: string, field: keyof WeeklyData['review'], value: string) => void;
}

const MasterplanContext = createContext<MasterplanContextType | undefined>(undefined);

export const MasterplanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MasterplanData>(DEFAULT_DATA);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dyad_masterplan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({ ...DEFAULT_DATA, ...parsed });
      } catch (e) {
        console.error("Failed to load masterplan", e);
      }
    }
    setLoaded(true);
  }, []);

  // Auto-save
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('dyad_masterplan', JSON.stringify(data));
    }
  }, [data, loaded]);

  const completeTutorial = () => {
    setData(prev => ({ ...prev, isTutorialCompleted: true }));
  };

  const resetTutorial = () => {
    setData(prev => ({ ...prev, isTutorialCompleted: false }));
  };

  const updateAnnual = (updates: Partial<MasterplanData['annual']>) => {
    setData(prev => ({ ...prev, annual: { ...prev.annual, ...updates } }));
  };

  const addAreaItem = (area: keyof MasterplanData['areas'], text: string) => {
    const newItem: TaskItem = { id: Date.now().toString(), text, completed: false };
    setData(prev => ({
      ...prev,
      areas: { ...prev.areas, [area]: [...prev.areas[area], newItem] }
    }));
  };

  const toggleAreaItem = (area: keyof MasterplanData['areas'], id: string) => {
    setData(prev => ({
      ...prev,
      areas: {
        ...prev.areas,
        [area]: prev.areas[area].map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      }
    }));
  };
  
  const deleteAreaItem = (area: keyof MasterplanData['areas'], id: string) => {
    setData(prev => ({
      ...prev,
      areas: {
        ...prev.areas,
        [area]: prev.areas[area].filter(item => item.id !== id)
      }
    }));
  };

  const updateMonth = (monthIndex: number, updates: Partial<MonthlyData>) => {
    setData(prev => ({
      ...prev,
      months: prev.months.map((m, i) => i === monthIndex ? { ...m, ...updates } : m)
    }));
  };

  const addMonthGoal = (monthIndex: number, text: string) => {
    const newItem: TaskItem = { id: Date.now().toString(), text, completed: false };
    setData(prev => ({
      ...prev,
      months: prev.months.map((m, i) => i === monthIndex ? { ...m, goals: [...m.goals, newItem] } : m)
    }));
  };

  const toggleMonthGoal = (monthIndex: number, id: string) => {
    setData(prev => ({
      ...prev,
      months: prev.months.map((m, i) => 
        i === monthIndex ? { 
          ...m, 
          goals: m.goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g) 
        } : m
      )
    }));
  };

  const updateMonthReview = (monthIndex: number, field: keyof MonthlyData['review'], value: string) => {
    setData(prev => ({
      ...prev,
      months: prev.months.map((m, i) => 
        i === monthIndex ? { ...m, review: { ...m.review, [field]: value } } : m
      )
    }));
  };

  const addWeek = (weekData: Omit<WeeklyData, 'id' | 'tasks' | 'review'>) => {
    const newWeek: WeeklyData = {
      ...weekData,
      id: Date.now().toString(),
      tasks: [],
      review: { worked: "", didntWork: "", improve: "" }
    };
    setData(prev => ({ ...prev, weeks: [newWeek, ...prev.weeks] }));
  };

  const deleteWeek = (id: string) => {
    setData(prev => ({ ...prev, weeks: prev.weeks.filter(w => w.id !== id) }));
  };

  const addWeekTask = (weekId: string, text: string) => {
    const newItem: TaskItem = { id: Date.now().toString(), text, completed: false };
    setData(prev => ({
      ...prev,
      weeks: prev.weeks.map(w => w.id === weekId ? { ...w, tasks: [...w.tasks, newItem] } : w)
    }));
  };

  const toggleWeekTask = (weekId: string, taskId: string) => {
    setData(prev => ({
      ...prev,
      weeks: prev.weeks.map(w => 
        w.id === weekId ? { 
          ...w, 
          tasks: w.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) 
        } : w
      )
    }));
  };

  const updateWeekReview = (weekId: string, field: keyof WeeklyData['review'], value: string) => {
    setData(prev => ({
      ...prev,
      weeks: prev.weeks.map(w => 
        w.id === weekId ? { ...w, review: { ...w.review, [field]: value } } : w
      )
    }));
  };

  return (
    <MasterplanContext.Provider value={{
      data, completeTutorial, resetTutorial, updateAnnual, addAreaItem, toggleAreaItem, deleteAreaItem, updateMonth, addMonthGoal, toggleMonthGoal, updateMonthReview,
      addWeek, deleteWeek, addWeekTask, toggleWeekTask, updateWeekReview
    }}>
      {children}
    </MasterplanContext.Provider>
  );
};

export const useMasterplan = () => {
  const context = useContext(MasterplanContext);
  if (!context) throw new Error("useMasterplan must be used within MasterplanProvider");
  return context;
};