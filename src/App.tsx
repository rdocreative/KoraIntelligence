import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SideNav } from "@/components/layout/SideNav";
import Index from "@/pages/Index";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar fixa à esquerda */}
        <SideNav />

        {/* Conteúdo principal que ocupa o restante do espaço */}
        <main className="flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Adicione outras rotas aqui conforme necessário */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;