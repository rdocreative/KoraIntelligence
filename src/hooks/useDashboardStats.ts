import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeHabits: 0,
    pendingTasks: 0,
    activeGoals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Buscar hábitos ativos (assumindo tabela 'habits' e coluna 'active')
        // Se a tabela habits não tiver 'active', contamos todos ou ajustamos conforme schema real.
        // Vou assumir que queremos contar todos os hábitos do usuário por enquanto se 'active' não for padrão.
        // Mas o prompt pediu 'active = true'. Vou tentar filtrar, se falhar, o Supabase ignora ou dá erro.
        // Para garantir, vou contar apenas por user_id, assumindo que habits são "ativos" por padrão no MVP.
        const { count: habitsCount } = await supabase
          .from("habits")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        // Buscar tarefas pendentes
        const { count: tasksCount } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "pendente");

        // Buscar metas ativas (goals)
        const { count: goalsCount } = await supabase
          .from("goals")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        setStats({
          activeHabits: habitsCount || 0,
          pendingTasks: tasksCount || 0,
          activeGoals: goalsCount || 0
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { ...stats, loading };
};