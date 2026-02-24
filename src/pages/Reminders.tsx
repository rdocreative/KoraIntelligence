"use client";

import React from "react";

const RemindersPage = () => {
  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold">Lembretes</h1>
      <div className="space-y-2">
        <div className="p-4 rounded-lg border bg-card">Lembrete 1</div>
        <div className="p-4 rounded-lg border bg-card">Lembrete 2</div>
      </div>
    </div>
  );
};

export default RemindersPage;