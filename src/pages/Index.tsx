import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl">
          <LayoutDashboard className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Início</h1>
          <p className="text-muted-foreground">Visão geral do seu progresso</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold mb-2">Hábitos de Hoje</h3>
          <p className="text-2xl font-bold">4/5</p>
          <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[80%]" />
          </div>
        </div>
        
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold mb-2">Próxima Missão</h3>
          <p className="text-sm text-muted-foreground mb-4">Complete 3 tarefas de foco profundo.</p>
          <button className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg">
            Ver detalhes
          </button>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold mb-2">Nível Atual</h3>
          <p className="text-2xl font-bold text-primary">15</p>
          <p className="text-xs text-muted-foreground">240 XP para o próximo nível</p>
        </div>
      </div>
    </div>
  );
};

export default Index;