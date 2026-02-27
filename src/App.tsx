"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Tasks from './pages/Tasks';
import Index from './pages/Index';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#0A0C10] overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative bg-[#0A0C10]">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;