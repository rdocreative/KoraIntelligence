"use client";

import React from "react";

const SettingsPage = () => {
  return (
    <div className="w-full space-y-8">
      <h1 className="text-3xl font-bold">Configurações</h1>
      <div className="max-w-2xl space-y-6">
        {/* Aqui mantemos o max-w interno para formulários se necessário, mas o container externo da página é w-full */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Perfil</h2>
          <div className="grid gap-4">
            <div className="h-10 w-full rounded-md border bg-muted" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;