"use client";

import React from "react";

const StorePage = () => {
  return (
    <div className="w-full animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Loja e Finanças</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <p className="text-muted-foreground">Gerencie seus recursos e adquira itens.</p>
        </div>
      </div>
    </div>
  );
};

export default StorePage;