"use client";

import React from "react";

const Index = () => {
  return (
    <div className="w-full animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Visão Geral</h2>
          <p className="text-muted-foreground">Bem-vindo ao Kora. Aqui está o resumo das suas atividades.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;