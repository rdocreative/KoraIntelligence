"use client";

import React from "react";
import { Card } from "@/components/ui/card";

const HabitTracker = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Meus Hábitos</h2>
      <p className="text-muted-foreground">Lista de hábitos aparecerá aqui.</p>
    </Card>
  );
};

export default HabitTracker;