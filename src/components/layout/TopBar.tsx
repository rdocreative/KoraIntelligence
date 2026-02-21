"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth"; // Assumindo o uso de um hook de autenticação
import { Coins, Zap } from "lucide-react";

const TopBar = () => {
  const { profile } = useAuth() as any; // Cast temporário para evitar erros de interface

  const stats = {
    xp: profile?.xp_total || 0,
    coins: (profile as any)?.moedas || 0, 
    nextLevelXp: (profile?.nivel || 1) * 1000
  };

  return (
    <div className="h-16 border-b border-[#2d5550] bg-[#071412]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#38bdf820] flex items-center justify-center">
            <Zap size={16} className="text-[#38bdf8]" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/40 uppercase leading-none">Nível {profile?.nivel || 1}</span>
            <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-[#38bdf8] transition-all" 
                style={{ width: `${(stats.xp % 1000) / 10}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#f59e0b10] px-3 py-1.5 rounded-full border border-[#f59e0b20]">
          <Coins size={14} className="text-[#f59e0b]" />
          <span className="text-sm font-bold text-[#f59e0b]">{stats.coins}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-white leading-none">{profile?.display_name || 'Usuário'}</p>
          <p className="text-[10px] font-medium text-white/40 mt-1 uppercase tracking-wider">Membro Premium</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00e5cc] to-[#38bdf8] p-[2px]">
          <div className="w-full h-full rounded-full bg-[#071412] flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-black text-[#00e5cc]">
                {(profile?.display_name || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;