"use client";

import React from "react";

const Index = () => {
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao Kora</h1>
        <p className="text-muted-foreground">Sua jornada de evolução pessoal começa aqui.</p>
      </section>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Dashboards e widgets seriam aqui */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold mb-2">Resumo do Dia</h3>
          <p className="text-sm text-muted-foreground">Você completou 80% das suas metas hoje.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;