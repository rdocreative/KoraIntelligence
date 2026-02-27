"use client";

import React, { useState } from 'react';
import { WeeklyBoard } from '@/components/tasks/WeeklyBoard';

const Index = () => {
  return (
    <div className="h-screen w-full bg-[#09090b] text-zinc-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <WeeklyBoard />
    </div>
  );
};

export default Index;