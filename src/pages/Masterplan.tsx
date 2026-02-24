"use client";

import React from "react";

const MasterplanPage = () => {
  return (
    <div className="w-full space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Masterplan</h1>
        <p className="text-muted-foreground">Planeje seu futuro com clareza.</p>
      </header>
      <div className="grid gap-6">
        {/* Conteúdo do Masterplan */}
        <div className="h-[400px] rounded-xl border border-dashed flex items-center justify-center">
          <p className="text-muted-foreground">Seu plano estratégico aparecerá aqui.</p>
        </div>
      </div>
    </div>
  );
};

export default MasterplanPage;