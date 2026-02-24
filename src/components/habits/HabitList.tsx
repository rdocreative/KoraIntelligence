"use client";

import React from 'react';
import { Check, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface HabitListProps {
  habits: any[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const HabitList = ({ habits = [], onToggle, onDelete }: HabitListProps) => {
  if (habits.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
        <p className="text-muted-foreground">Nenhum hábito cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {habits.map((habit) => (
        <div 
          key={habit.id}
          className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => onToggle(habit.id)}
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                habit.completed 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "border-muted-foreground/30 hover:border-primary"
              )}
            >
              {habit.completed && <Check size={14} />}
            </button>
            <div>
              <h4 className={cn("font-medium", habit.completed && "line-through text-muted-foreground")}>
                {habit.name}
              </h4>
              <p className="text-xs text-muted-foreground">{habit.frequency || 'Diário'}</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(habit.id)}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default HabitList;