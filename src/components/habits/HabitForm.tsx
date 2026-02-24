"use client";

import React from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useHabitTracker } from "../../hooks/useHabitTracker";

interface HabitFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const HabitForm = ({ onSuccess, onCancel }: HabitFormProps) => {
  const { addHabit } = useHabitTracker();
  const [name, setName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addHabit({ 
        name, 
        completed: false,
        id: Math.random().toString(36).substr(2, 9)
      });
      setName('');
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="habit-name">Nome do Hábito</Label>
        <Input 
          id="habit-name"
          placeholder="Ex: Beber 2L de água" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Hábito
        </Button>
      </div>
    </form>
  );
};

export default HabitForm;