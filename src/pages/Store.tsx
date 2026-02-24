"use client";

import React from "react";

const StorePage = () => {
  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold">Loja & Inventário</h1>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square rounded-xl border bg-card p-4">
            <div className="w-full h-full bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePage;