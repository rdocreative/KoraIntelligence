"use client";

import React from "react";

const GoalsPage = () => {
  return (
    <div className="w-full animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Metas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Suas Metas</h2>
          <p className="text-muted-foreground">Defina e acompanhe seus objetivos de longo prazo.</p>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;