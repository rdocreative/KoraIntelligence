"use client";

import React from "react";
import HabitTracker from "../components/habits/HabitTracker";
import HabitCalendar from "../components/habits/HabitCalendar";

const HabitsPage = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex-1 w-full overflow-hidden">
        <HabitCalendar />
      </div>
      <div className="w-full lg:w-[380px] shrink-0">
        <HabitTracker />
      </div>
    </div>
  );
};

export default HabitsPage;