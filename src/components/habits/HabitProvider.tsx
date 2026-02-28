"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface Habit {
  id: string;
  nome: string;
  categoria: string;
  frequencia: string;
  emoji: string;
  ativo: boolean;
}

interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  refreshHabits: () => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchHabits = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('ativo', true);

      if (error) throw error;
      setHabits(data || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchHabits();
    } else {
      setHabits([]);
      setLoading(false);
    }
  }, [session?.user?.id]);

  return (
    <HabitContext.Provider value={{ habits, loading, refreshHabits: fetchHabits }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits deve ser usado dentro de um HabitProvider');
  }
  return context;
};