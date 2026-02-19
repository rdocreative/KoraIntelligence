import { useState } from "react";
import { Plus, Check, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Habit } from "@/hooks/useHabitTracker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HabitTrackerProps {
  habits: Habit[];
  totalPoints: number;
  onComplete: (id: string) => void;
  onAdd: (title: string) => void;
}

export const HabitTracker = ({ habits, onComplete, onAdd }: HabitTrackerProps) => {
  const [newHabit, setNewHabit] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      onAdd(newHabit);
      setNewHabit("");
      setIsAdding(false);
    }
  };

  return (
    <Card className="h-full bg-white/[0.02] border border-white/20 rounded-2xl backdrop-blur-3xl shadow-xl overflow-hidden flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <div className="p-1.5 bg-red-500/10 rounded-lg">
            <Check className="w-5 h-5 text-red-500" />
          </div>
          Hábitos Diários
        </CardTitle>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          variant="outline" 
          size="sm"
          className="border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
        >
          <Plus className="w-4 h-4 mr-1" /> Novo
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto pt-6 space-y-4">
        {isAdding && (
          <form onSubmit={handleSubmit} className="flex gap-2 animate-in slide-in-from-top-2">
            <Input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Nome do novo hábito..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-red-500/50"
              autoFocus
            />
            <Button type="submit" size="icon" className="bg-red-600 hover:bg-red-700">
              <Check className="w-4 h-4" />
            </Button>
          </form>
        )}

        <div className="grid grid-cols-1 gap-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => onComplete(habit.id)}
              className={cn(
                "group relative overflow-hidden p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between",
                habit.completed 
                  ? "bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(220,38,38,0.15)]" 
                  : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
              )}
            >
              <div className="flex items-center gap-4 z-10">
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  habit.completed 
                    ? "bg-red-500 border-red-500 scale-110" 
                    : "border-white/30 group-hover:border-white/50"
                )}>
                  {habit.completed && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>
                
                <div>
                  <h3 className={cn(
                    "font-medium transition-all duration-300",
                    habit.completed ? "text-white line-through opacity-50" : "text-white"
                  )}>
                    {habit.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 z-10">
                <Flame className={cn(
                  "w-4 h-4 transition-colors",
                  habit.streak > 0 ? "text-orange-500 fill-orange-500" : "text-white/20"
                )} />
                <span className={cn(
                  "text-xs font-bold font-rajdhani",
                  habit.streak > 0 ? "text-orange-500" : "text-white/20"
                )}>
                  {habit.streak}
                </span>
              </div>
              
              {/* Progress bar background effect */}
              <div 
                className={cn(
                  "absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent transition-transform duration-500 ease-out origin-left",
                  habit.completed ? "scale-x-100" : "scale-x-0"
                )} 
              />
            </div>
          ))}

          {habits.length === 0 && !isAdding && (
            <div className="text-center py-10 text-white/30">
              <p>Nenhum hábito cadastrado.</p>
              <p className="text-sm">Clique em "Novo" para começar.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};