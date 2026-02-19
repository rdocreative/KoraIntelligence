"use client";

import React from 'react';
import { useHabitTracker } from '@/hooks/useHabitTracker';
import { DashboardHeader } from '@/components/features/dashboard/DashboardHeader';
import { MonthlyProgress } from '@/components/features/dashboard/MonthlyProgress';
import { MonthlyChart } from '@/components/features/dashboard/MonthlyChart';
import { FAQSection } from '@/components/features/dashboard/FAQSection';
import { HabitList } from '@/components/features/habit-tracker/HabitList';
import { Gamification } from '@/components/features/habit-tracker/Gamification';
import { AddHabitForm } from '@/components/features/habit-tracker/AddHabitForm';
import BackgroundParticles from '@/components/ui/BackgroundParticles';

const Index = () => {
  const { 
    habits, 
    addHabit, 
    completeHabit, 
    stats, 
    history 
  } = useHabitTracker();

  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden">
      {/* Background Elements */}
      <div className="corner-glow-tl" />
      <div className="corner-glow-br" />
      <BackgroundParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <DashboardHeader stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Left Column - Habits & Actions */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AddHabitForm onAdd={addHabit} />
              <Gamification 
                currentBadge={stats.badge}
                nextBadge={stats.nextBadge}
                totalPoints={stats.totalPoints}
                streak={stats.streak}
              />
            </div>
            
            <HabitList 
              habits={habits} 
              onComplete={completeHabit} 
            />
          </div>

          {/* Right Column - Stats & Charts */}
          <div className="lg:col-span-4 space-y-8">
            <MonthlyProgress 
              totalPoints={stats.totalPoints} 
              habitsCount={habits.length} 
            />
            <MonthlyChart history={history} />
            <FAQSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;