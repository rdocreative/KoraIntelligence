"use client";

import React from "react";

const GoalsPage = () => {
  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold">Metas</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 rounded-xl border bg-card">
          <h3 className="font-medium">Meta de Longo Prazo</h3>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;