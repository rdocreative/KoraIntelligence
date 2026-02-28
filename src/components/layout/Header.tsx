"use client";

import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export const Header = ({ title }: { title?: string }) => {
  return (
    <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0b0b0b]/50 backdrop-blur-md sticky top-0 z-50">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          {title || "Minhas Tarefas"}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar tarefas..."
            className="bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/20 w-64 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0b0b0b]" />
          </button>
          
          <div className="w-px h-8 bg-white/10 mx-2" />
          
          <div className="flex items-center gap-3 pl-2 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-none mb-1">Usuário</p>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Pro Plan</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5 transition-all">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};