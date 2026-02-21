"use client";

import { useState, useEffect } from "react";

// Interface básica para o perfil do usuário
export interface Profile {
  display_name: string;
  avatar_url: string | null;
  xp_total: number;
  moedas: number;
  nivel: number;
}

export const useAuth = () => {
  // Estado inicial mockado para evitar que a aplicação quebre
  // Em uma aplicação real, aqui viriam as chamadas ao Supabase ou Firebase
  const [profile, setProfile] = useState<Profile | null>({
    display_name: "Explorador",
    avatar_url: null,
    xp_total: 1250,
    moedas: 450,
    nivel: 2
  });

  const [loading, setLoading] = useState(false);

  return {
    profile,
    loading,
    isAuthenticated: !!profile
  };
};