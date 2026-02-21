"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import Index from './pages/Index';
import HabitsPage from './pages/Habits';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#071412] text-white selection:bg-[#00e5cc]/30">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 ml-20 transition-none overflow-x-hidden">
          <div className="container mx-auto max-w-7xl p-6 lg:p-10 transition-none">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/habitos" element={<HabitsPage />} />
              {/* Other routes can be added here */}
            </Routes>
          </div>
        </main>

        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0f2220',
              color: '#e8f5f3',
              border: '1px solid #2d5550',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;