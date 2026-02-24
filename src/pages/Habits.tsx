"use client";

import React from "react";

const HabitsPage = () => {
  return (
    <div className="w-full animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Hábitos</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border shadow-sm min-h-[400px]">
          <h2 className="text-lg font-semibold mb-4">Calendário de Hábitos</h2>
          <p className="text-muted-foreground text-sm">Visualize sua consistência ao longo do tempo.</p>
        </div>
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Meus Hábitos</h2>
          <p className="text-muted-foreground text-sm">Lista de hábitos diários e progresso.</p>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;