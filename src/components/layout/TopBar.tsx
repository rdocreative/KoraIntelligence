"use client";

import React from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useProfile } from '@/hooks/useProfile';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export const TopBar = () => {
  const { theme, setTheme } = useTheme();
  const { profile } = useProfile();

  return (
    <header className="h-[75px] bg-[var(--topbar)] border-b border-[var(--border-ui)] px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 bg-[var(--input-bg)] px-4 py-2 rounded-2xl border border-[var(--border-ui)] w-[400px]">
        <Search size={18} className="text-[var(--muted-foreground)]" />
        <input 
          type="text" 
          placeholder="Pesquisar no sistema..." 
          className="bg-transparent border-none outline-none text-[13px] font-bold w-full placeholder:text-[var(--muted-foreground)] text-[var(--foreground)]"
        />
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-xl bg-[var(--panel)] border border-[var(--border-ui)] text-[var(--foreground)] hover:border-[#A50104] transition-all"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative p-2.5 rounded-xl bg-[var(--panel)] border border-[var(--border-ui)] text-[var(--foreground)]">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#A50104] rounded-full border-2 border-[var(--panel)]"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-ui)]">
          <div className="text-right">
            <p className="text-[13px] font-black text-[var(--foreground)] leading-none mb-1">
              {profile?.nome || 'Guerreiro'}
            </p>
            <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
              Level 42
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#A50104] flex items-center justify-center text-white font-black text-sm">
            {profile?.nome?.[0] || 'K'}
          </div>
        </div>
      </div>
    </header>
  );
};