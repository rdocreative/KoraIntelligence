"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export const AddHabitForm = ({ onAdd }: any) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name);
      setName('');
    }
  };

  return (
    <div className="card-ghost p-6">
      <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Novo Objetivo</h3>
      <form onSubmit={handleSubmit} className="relative">
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="O que vamos conquistar hoje?"
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-5 pr-14 focus:outline-none focus:border-red-600/50 transition-all placeholder:text-white/20"
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 bottom-2 aspect-square bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center transition-colors shadow-lg shadow-red-600/20"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};