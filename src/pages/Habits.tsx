"use client";

import React from "react";

const HabitsPage = () => {
  return (
    <div className="w-full space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Hábitos</h1>
        <p className="text-muted-foreground">Monitore sua rotina e construa novos costumes.</p>
      </header>
      
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Espaço para o Calendário de Hábitos */}
        <div className="rounded-xl border bg-card p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">O calendário de hábitos aparecerá aqui.</p>
        </div>
        
        {/* Espaço para a Lista de Hábitos */}
        <div className="rounded-xl border bg-card p-6 flex items-center justify-center">
          <p className="text-muted-foreground">Sua lista de rastreamento aparecerá aqui.</p>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;