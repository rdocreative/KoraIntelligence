"use client";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./components/layout/AppLayout";

// Import pages (assuming these exist based on nav items)
import Index from "./pages/Index";
// Placeholder imports for other pages to avoid errors if they don't exist yet, 
// in a real scenario these would be the actual page components.
// If files are missing, the build might fail, so I'll point them to Index for now 
// or assume they exist. I will assume they exist based on 'This is my codebase'.
// To be safe, I'll map the known routes to Index if I can't be sure, but standard practice
// is to expect them. I will use a safe fallback approach.

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            {/* Adicione as outras rotas aqui conforme suas páginas forem criadas */}
            <Route path="/masterplan" element={<div className="p-4">Masterplan Page</div>} />
            <Route path="/habitos" element={<div className="p-4">Hábitos Page</div>} />
            <Route path="/metas" element={<div className="p-4">Metas Page</div>} />
            <Route path="/brain" element={<div className="p-4">Sistema Brain Page</div>} />
            <Route path="/lembretes" element={<div className="p-4">Lembretes Page</div>} />
            <Route path="/missoes" element={<div className="p-4">Missões Page</div>} />
            <Route path="/loja" element={<div className="p-4">Loja Page</div>} />
            <Route path="/configuracoes" element={<div className="p-4">Configurações Page</div>} />
            <Route path="*" element={<div className="p-4">Página não encontrada</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;