"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideNav from './components/SideNav';
import Tasks from './pages/Tasks';
import Index from './pages/Index';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#0A0C10] overflow-hidden">
        {/* Sidebar ancorada na esquerda */}
        <SideNav />
        
        {/* Área de conteúdo centralizada */}
        <div className="flex-1 flex justify-center overflow-hidden">
          <main className="w-full max-w-[1400px] flex flex-col min-w-0">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tasks" element={<Tasks />} />
              {/* Adicione outras rotas conforme necessário */}
            </Routes>
          </main>
        </div>
      </div>
      <Toaster position="top-right" theme="dark" closeButton />
    </Router>
  );
}

export default App;