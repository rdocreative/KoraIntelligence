"use client";

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideNav from './components/SideNav';
import Index from './pages/Index';
import TasksPage from './pages/Tasks';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      {/* Container Pai: Fundo #12141A e Gap 0 */}
      <div className="flex h-screen overflow-hidden bg-[#12141A]">
        <SideNav />
        
        {/* Container do Conteúdo: Efeito de Card #0A0C10 */}
        <main 
          style={{ 
            background: '#0A0C10', 
            borderRadius: '20px 0 0 20px', 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Miolo Centralizado: Trava de 1400px */}
          <div 
            style={{ 
              width: '100%', 
              maxWidth: '1400px', 
              margin: '0 auto', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/calendar" element={<TasksPage />} />
              {/* Adicione outras rotas conforme necessário */}
            </Routes>
          </div>
        </main>
      </div>
      <Toaster position="top-right" expand={false} richColors theme="dark" />
    </BrowserRouter>
  );
}

export default App;