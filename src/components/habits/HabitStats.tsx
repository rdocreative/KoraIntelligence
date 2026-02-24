"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle2, Flame, Target } from "lucide-react";

interface HabitStatsProps {
  habits: any[];
}

const HabitStats = ({ habits = [] }: HabitStatsProps) => {
  const completedToday = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Concluídos Hoje</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedToday}/{totalHabits}</div>
          <p className="text-xs text-muted-foreground">Continue assim!</p>
        </CardContent>
      </Card>
      
      <Card className="bg-orange-500/5 border-orange-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Melhor Sequência</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12 Dias</div>
          <p className="text-xs text-muted-foreground">Recorde pessoal</p>
        </CardContent>
      </Card>

      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85%</div>
          <p className="text-xs text-muted-foreground">Média mensal</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitStats;