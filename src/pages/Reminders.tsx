"use client";

import React from "react";

const RemindersPage = () => {
  return (
    <div className="w-full animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Lembretes</h1>
      <div className="bg-card p-6 rounded-2xl border shadow-sm">
        <p className="text-muted-foreground">Seus lembretes e notificações importantes.</p>
      </div>
    </div>
  );
};

export default RemindersPage;