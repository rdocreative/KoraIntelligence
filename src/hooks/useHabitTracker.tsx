"use client";

import { useContext, createContext } from 'react';
import { useHabits } from '@/components/habits/HabitProvider';

// Se você já tem uma implementação complexa em useHabitTracker, 
// este arquivo garante que o hook useHabitTracker utilize o contexto correto.

export const useHabitTracker = () => {
  const context = useHabits();
  
  // Aqui você pode adicionar lógica adicional de rastreamento se necessário
  return context;
};