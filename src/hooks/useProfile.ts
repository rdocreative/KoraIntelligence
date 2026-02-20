import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  nome: string;
  nivel: number;
  xp_total: number;
  streak_atual: number;
  avatar_emoji: string;
  coins: number;
}

const DEFAULT_PROFILE = {
  nivel: 1,
  xp_total: 0,
  streak_atual: 0,
  avatar_emoji: "👤",
  coins: 0
};

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        // Tenta buscar o perfil existente
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Erro ao buscar perfil:", error);
          setLoading(false);
          return;
        }

        if (data) {
          if (mounted) {
            setProfile(data as Profile);
            setLoading(false);
          }
        } else {
          // Se não existir, cria um novo
          const newProfile = {
            id: user.id,
            nome: user.user_metadata.name || user.email?.split("@")[0] || "Usuário",
            ...DEFAULT_PROFILE
          };

          const { data: newData, error: insertError } = await supabase
            .from("profiles")
            .insert([newProfile])
            .select()
            .single();

          if (insertError) {
            console.error("Erro ao criar perfil:", insertError);
          } else if (mounted) {
            setProfile(newData as Profile);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Erro inesperado em useProfile:", err);
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  return { profile, loading };
};