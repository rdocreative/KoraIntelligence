"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TopBar } from './components/layout/TopBar';
import Index from './pages/Index';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#0a0a0b] text-[#f0f0f0] selection:bg-[#e8283a33] selection:text-[#e8283a] overflow-x-hidden">
        {/* Background Gradient Effect - Bottom to Top */}
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: 'linear-gradient(to top, rgba(232, 40, 58, 0.12) 0%, rgba(232, 40, 58, 0.05) 20%, transparent 60%)',
          }}
        />
        
        {/* Glassmorphism Grain Overlay (Optional but looks great) */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <TopBar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 pb-24">
            <Routes>
              <Route path="/" element={<Index />} />
              {/* Adicione outras rotas conforme necessário */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;