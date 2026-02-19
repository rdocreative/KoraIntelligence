import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DailyVerse } from "@/components/features/dashboard/DailyVerse";
import { MonthlyProgress } from "@/components/features/dashboard/MonthlyProgress";
import { MonthlyChart } from "@/components/features/dashboard/MonthlyChart";
import { FAQSection } from "@/components/features/dashboard/FAQSection";
import { HabitTracker } from "@/components/features/habit-tracker/HabitTracker";
import { useHabitTracker } from "@/hooks/useHabitTracker";

const Index = () => {
  const { habits, totalPoints, history, completeHabit, addHabit } = useHabitTracker();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Glows */}
      <div className="corner-glow-tl" />
      <div className="corner-glow-br" />

      <DashboardLayout>
        <div className="relative z-10 space-y-8 pb-12">
          <DailyVerse />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Habits (Main focus) */}
            <div className="lg:col-span-8">
              <HabitTracker 
                habits={habits} 
                totalPoints={totalPoints} 
                onComplete={completeHabit}
                onAdd={addHabit}
              />
            </div>

            {/* Right Column: Stats & Extras */}
            <div className="lg:col-span-4 space-y-8">
              <MonthlyProgress totalPoints={totalPoints} habitsCount={habits.length} />
              <MonthlyChart history={history} />
              <FAQSection />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Index;