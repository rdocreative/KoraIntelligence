import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle } from "lucide-react";

interface Habit {
  id: string;
  nome: string;
  categoria: string | null;
  emoji: string | null;
  frequencia: string | null;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchHabits();
  }, []);

  async function fetchHabits() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: habitsData } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("ativo", true);

    const { data: logsData } = await supabase
      .from("habit_logs")
      .select("habit_id")
      .eq("user_id", user.id)
      .eq("data", today);

    setHabits(habitsData || []);
    setCompletedToday(logsData?.map((l) => l.habit_id) || []);
    setLoading(false);
  }

  async function toggleHabit(habitId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isCompleted = completedToday.includes(habitId);

    if (isCompleted) {
      await supabase
        .from("habit_logs")
        .delete()
        .eq("habit_id", habitId)
        .eq("user_id", user.id)
        .eq("data", today);

      setCompletedToday((prev) => prev.filter((id) => id !== habitId));
    } else {
      await supabase
        .from("habit_logs")
        .insert({ habit_id: habitId, user_id: user.id, data: today });

      setCompletedToday((prev) => [...prev, habitId]);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <p className="text-zinc-500 text-sm">Carregando hábitos...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 text-white max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-serif font-medium mb-1">Hábitos</h1>
        <p className="text-zinc-500 text-sm uppercase tracking-widest">
          {completedToday.length} de {habits.length} concluídos hoje
        </p>
      </header>

      {habits.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="mb-2">Nenhum hábito cadastrado ainda.</p>
          <p className="text-sm">Adicione seu primeiro hábito abaixo.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => {
            const done = completedToday.includes(habit.id);
            return (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left
                  ${done
                    ? "bg-white/10 border-white/10 opacity-60"
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                  }`}
              >
                {done
                  ? <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
                  : <Circle size={22} className="text-zinc-600 shrink-0" />
                }
                <span className="text-xl mr-1">{habit.emoji || "⚡"}</span>
                <div>
                  <p className={`font-semibold text-sm ${done ? "line-through text-zinc-500" : "text-white"}`}>
                    {habit.nome}
                  </p>
                  {habit.categoria && (
                    <p className="text-xs text-zinc-600 mt-0.5">{habit.categoria}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}