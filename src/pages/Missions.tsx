"use client";

import React from "react";

const MissionsPage = () => {
  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold">Missões</h1>
      <div className="rounded-xl border p-12 text-center">
        <p className="text-muted-foreground">Nenhuma missão ativa no momento.</p>
      </div>
    </div>
  );
};

export default MissionsPage;