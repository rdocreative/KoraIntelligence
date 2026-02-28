"use client";

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { HabitProvider } from '@/components/habits/HabitProvider';
import SideNav from './components/SideNav';
import Index from './pages/Index';
import TasksPage from './pages/Tasks';
import { Toaster } from 'sonner';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <HabitProvider>
        <BrowserRouter>
          {/* Container Pai: Fundo #12141A e Gap 0 */}
          <div className="flex h-screen overflow-hidden bg-[#12141A]">
            <SideNav />
            
            {/* Container do Conteúdo: Efeito de Card #0A0C10 */}
            <main 
              className="flex-1 flex justify-center"
              style={{ 
                background: '#0A0C10', 
                borderRadius: '20px 0 0 20px', 
                height: '100%',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div className="w-full max-w-[1500px]">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/calendar" element={<TasksPage />} />
                </Routes>
              </div>
            </main>
          </div>
          <Toaster position="top-right" expand={false} richColors theme="dark" />
        </BrowserRouter>
      </HabitProvider>
    </SessionContextProvider>
  );
}

export default App;