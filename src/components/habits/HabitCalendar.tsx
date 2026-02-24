"use client";

import React from "react";
import { Card } from "@/components/ui/card";

const HabitCalendar = () => {
  return (
    <Card className="p-6 w-full">
      <h2 className="text-xl font-bold mb-4">Calendário de Hábitos</h2>
      <div className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg">
        Visualização do Calendário
      </div>
    </Card>
  );
};

export default HabitCalendar;