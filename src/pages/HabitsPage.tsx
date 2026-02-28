import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Flame, 
  Calendar,
  X,
  ChevronDown
} from "lucide-react";
import { format, subDays, isSameDay, parseISO, eachDayOfInterval, startOfToday, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Habit {
  id: string;
  nome: string;
  emoji: string;
  categoria: string | null;
  frequencia: string;
  ativo: boolean;
}

interface HabitLog {
  habit_id: string;
  data: string;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form states
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitEmoji, setNewHabitEmoji] = useState("⚡");
  const [newHabitCategory, setNewHabitCategory] = useState("");
  const [newHabitFrequency, setNewHabitFrequency] = useState("Diário");

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const [habitsRes, logsRes] = await Promise.all([
        supabase.from("habits").select("*").eq("user_id", user.id).eq("ativo", true).order("created_at", { ascending: false }),
        supabase.from("habit_logs").select("habit_id, data").eq("user_id", user.id)
      ]);

      if (habitsRes.error) throw habitsRes.error;
      if (logsRes.error) throw logsRes.error;

      setHabits(habitsRes.data || []);
      setLogs(logsRes.data || []);
    } catch (error) {
      console.error("Error fetching habits:", error);
      toast.error("Erro ao carregar hábitos");
    } finally {
      setLoading(false);
    }
  }

  const calculateGeneralStreak = () => {
    if (logs.length === 0) return 0;
    
    // Unique dates where at least 1 habit was done
    const logDates = Array.from(new Set(logs.map(l => l.data))).sort((a, b) => b.localeCompare(a));
    if (logDates.length === 0) return 0;

    const today = startOfToday();
    const yesterday = subDays(today, 1);
    
    let currentStreak = 0;
    let checkDate = parseISO(logDates[0]);

    // If latest log is not today or yesterday, streak is broken
    if (!isSameDay(checkDate, today) && !isSameDay(checkDate, yesterday)) return 0;

    const logSet = new Set(logDates);
    let dateToTest = isSameDay(checkDate, today) ? today : yesterday;

    while (logSet.has(format(dateToTest, "yyyy-MM-dd"))) {
      currentStreak++;
      dateToTest = subDays(dateToTest, 1);
    }

    return currentStreak;
  };

  const calculateIndividualStreak = (habitId: string) => {
    const habitLogs = logs
      .filter(l => l.habit_id === habitId)
      .map(l => l.data)
      .sort((a, b) => b.localeCompare(a));

    if (habitLogs.length === 0) return 0;

    const today = startOfToday();
    const yesterday = subDays(today, 1);
    const lastLogDate = parseISO(habitLogs[0]);

    if (!isSameDay(lastLogDate, today) && !isSameDay(lastLogDate, yesterday)) return 0;

    let streak = 0;
    const logSet = new Set(habitLogs);
    let dateToTest = isSameDay(lastLogDate, today) ? today : yesterday;

    while (logSet.has(format(dateToTest, "yyyy-MM-dd"))) {
      streak++;
      dateToTest = subDays(dateToTest, 1);
    }

    return streak;
  };

  const toggleHabit = async (habitId: string) => {
    if (!userId) return;
    
    const isCompleted = logs.some(l => l.habit_id === habitId && l.data === todayStr);

    try {
      if (isCompleted) {
        const { error } = await supabase
          .from("habit_logs")
          .delete()
          .eq("habit_id", habitId)
          .eq("user_id", userId)
          .eq("data", todayStr);
        
        if (error) throw error;
        setLogs(prev => prev.filter(l => !(l.habit_id === habitId && l.data === todayStr)));
      } else {
        const { error } = await supabase
          .from("habit_logs")
          .insert({ habit_id: habitId, user_id: userId, data: todayStr });
        
        if (error) throw error;
        setLogs(prev => [...prev, { habit_id: habitId, data: todayStr }]);
      }
    } catch (error) {
      console.error("Error toggling habit:", error);
      toast.error("Erro ao atualizar hábito");
    }
  };

  const handleAddHabit = async () => {
    if (!userId || !newHabitName.trim()) return;

    try {
      const { data, error } = await supabase
        .from("habits")
        .insert({
          user_id: userId,
          nome: newHabitName,
          emoji: newHabitEmoji || "⚡",
          categoria: newHabitCategory || "Geral",
          frequencia: newHabitFrequency,
          ativo: true
        })
        .select()
        .single();

      if (error) throw error;

      setHabits(prev => [data, ...prev]);
      setIsAddModalOpen(false);
      setNewHabitName("");
      setNewHabitEmoji("⚡");
      setNewHabitCategory("");
      setNewHabitFrequency("Diário");
      toast.success("Hábito adicionado!");
    } catch (error) {
      console.error("Error adding habit:", error);
      toast.error("Erro ao adicionar hábito");
    }
  };

  const doneTodayCount = habits.filter(h => logs.some(l => l.habit_id === h.id && l.data === todayStr)).length;

  if (loading) {
    return (
      <div className="flex-1 max-w-2xl mx-auto w-full pt-4">
        <div className="flex justify-between items-end mb-8 animate-pulse">
          <div className="h-9 w-32 bg-white/5 rounded-lg" />
          <div className="h-4 w-24 bg-white/5 rounded-lg" />
        </div>
        <div className="h-24 w-full bg-white/5 rounded-[14px] mb-8 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 w-full bg-white/5 rounded-[14px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full pb-20 pt-4 relative">
      {/* TOPBAR */}
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold text-white">Hábitos</h1>
        <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
          {doneTodayCount} de {habits.length} feitos hoje
        </span>
      </div>

      {/* GENERAL STREAK BANNER */}
      <div 
        className="mb-8 p-4 px-5 flex items-center gap-4"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "14px"
        }}
      >
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <Flame size={24} className="text-orange-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-white/60">Sequência atual</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-bold text-white leading-none">
              {calculateGeneralStreak()}
            </span>
            <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
              dias seguidos
            </span>
          </div>
        </div>
      </div>

      {/* HABIT LIST */}
      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-4xl mb-4">🌱</span>
          <h3 className="text-lg font-medium text-white mb-1">Nenhum hábito ainda</h3>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            Toque em + para adicionar seu primeiro hábito
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => {
            const isDoneToday = logs.some(l => l.habit_id === habit.id && l.data === todayStr);
            const streak = calculateIndividualStreak(habit.id);

            return (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className="cursor-pointer transition-all duration-200"
                style={{
                  background: isDoneToday ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.03)",
                  border: isDoneToday ? "1px solid rgba(99,102,241,0.2)" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                  padding: "16px"
                }}
              >
                {/* Upper line */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {isDoneToday ? (
                        <CheckCircle2 size={24} className="text-[#6366f1]" />
                      ) : (
                        <Circle size={24} className="text-white/20" />
                      )}
                    </div>
                    <span className="text-xl">{habit.emoji}</span>
                    <span 
                      className="font-semibold text-white transition-opacity duration-200"
                      style={{ opacity: isDoneToday ? 0.6 : 1 }}
                    >
                      {habit.nome}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                    <Flame size={14} className={streak > 0 ? "text-orange-500 fill-orange-500/20" : "text-white/20"} />
                    <span className="text-xs font-bold text-white/80">{streak}</span>
                  </div>
                </div>

                {/* Bottom line: Mini calendar */}
                <div className="flex items-center gap-2 pl-9">
                  {last7Days.map((day, idx) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const isDone = logs.some(l => l.habit_id === habit.id && l.data === dateStr);
                    const dayInitial = format(day, "eeeee", { locale: ptBR }).toUpperCase();

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <div 
                          className="w-3 h-3 rounded-full transition-colors duration-200"
                          style={{
                            background: isDone ? "rgba(99,102,241,0.8)" : "rgba(255,255,255,0.1)"
                          }}
                        />
                        <span className="text-[8px] font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {dayInitial}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FLOATING BUTTON */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogTrigger asChild>
          <button 
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 z-50"
            style={{ background: "#6366f1" }}
          >
            <Plus size={24} />
          </button>
        </DialogTrigger>
        <DialogContent 
          className="sm:max-w-[400px] border-white/10 p-6"
          style={{ 
            background: "#0f1117",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px"
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Novo Hábito</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            <div className="flex gap-4">
              <div className="space-y-2 flex-shrink-0 w-16">
                <Label className="text-xs font-medium text-white/60">Emoji</Label>
                <Input 
                  value={newHabitEmoji}
                  onChange={(e) => setNewHabitEmoji(e.target.value.slice(-1))}
                  placeholder="⚡"
                  className="bg-white/5 border-white/10 text-center text-xl h-11"
                />
              </div>
              <div className="space-y-2 flex-grow">
                <Label className="text-xs font-medium text-white/60">Nome do hábito</Label>
                <Input 
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Ex: Beber 2L de água"
                  className="bg-white/5 border-white/10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-white/60">Categoria (opcional)</Label>
              <Input 
                value={newHabitCategory}
                onChange={(e) => setNewHabitCategory(e.target.value)}
                placeholder="Ex: Saúde, Foco, Rotina"
                className="bg-white/5 border-white/10 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-white/60">Frequência</Label>
              <select 
                value={newHabitFrequency}
                onChange={(e) => setNewHabitFrequency(e.target.value)}
                className="w-full h-11 bg-white/5 border border-white/10 rounded-md px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#6366f1]"
              >
                <option value="Diário">Diário</option>
                <option value="Dias úteis">Dias úteis</option>
                <option value="Fins de semana">Fins de semana</option>
                <option value="Personalizado">Personalizado</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddHabit}
              className="flex-1 bg-[#6366f1] text-white hover:bg-[#6366f1]/90"
            >
              Salvar Hábito
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
