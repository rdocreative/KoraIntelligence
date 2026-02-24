"use client";

import React from "react";
import HabitTracker from "@/components/habits/HabitTracker";
import HabitCalendar from "@/components/habits/HabitCalendar";

const HabitsPage = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 animate-fade-in">
      <div className="flex-1 min-w-0">
        <HabitCalendar />
      </div>
      <div className="w-full lg:w-[400px] shrink-0">
        <HabitTracker />
      </div>
    </div>
  );
};

export default HabitsPage;