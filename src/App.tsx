"use client";

import { useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { SettingsProvider } from "./hooks/useSettings"; 
import { HabitProvider } from "./hooks/useHabitTracker";
import { AuthProvider, useAuth } from "./components/providers/AuthProvider";
import { ColorProvider } from "./components/providers/ColorProvider";
import { SideNav } from "./components/layout/SideNav";
import { Menu } from "lucide-react"; // Importando ícone de menu

// Pages
import Index from "./pages/Index";
import HabitsPage from "./pages/Habits";
import TasksPage from "./pages/Tasks";
import SettingsPage from "./pages/Settings";
import MissionsPage from "./pages/Missions";
import StorePage from "./pages/Store";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";

const queryClient = new QueryClient();

const ProtectedRoute = () => {
  const { session, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#070707]">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-[24px] animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden text-white antialiased relative bg-[#070707]">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SideNav com props de controle */}
      <SideNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      <div className="flex-1 flex flex-col p-4 md:pl-0 z-10 min-w-0 h-full">
        {/* Mobile Header / Toggle Button */}
        <div className="md:hidden flex items-center justify-between mb-4 px-2">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
          >
            <Menu />
          </button>
          <span className="text-lg font-serif italic text-white/50">Néctar.</span>
          <div className="w-8" /> {/* Spacer para centralizar visualmente o logo se necessário */}
        </div>

        <div 
          className="flex-1 flex flex-col rounded-[24px] border overflow-hidden relative min-h-0 w-full" 
          style={{ 
            backgroundColor: '#0b0b0b', 
            borderColor: 'rgba(255,255,255,0.06)' 
          }}
        >
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar relative z-10 min-h-0 px-4 md:px-10">
            <main className="flex-1 flex flex-col py-6 md:py-0">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

const PublicRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
     return <div className="h-screen w-full flex items-center justify-center bg-[#070707]"><div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-[24px] animate-spin"></div></div>;
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
      storageKey="nectar-theme"
    >
      <AuthProvider>
        <ColorProvider>
          <SettingsProvider>
            <HabitProvider>
              <TooltipProvider>
                <Sonner theme="dark" />
                <BrowserRouter>
                  <div className="h-screen w-screen text-white font-sans flex flex-col relative overflow-hidden bg-[#070707]">
                    <Routes>
                      <Route element={<PublicRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/cadastro" element={<SignUp />} />
                        <Route path="/recuperar-senha" element={<ForgotPassword />} />
                      </Route>

                      <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Index />} />
                        <Route path="/tarefas" element={<TasksPage />} />
                        <Route path="/habitos" element={<HabitsPage />} />
                        <Route path="/missoes" element={<MissionsPage />} />
                        <Route path="/loja" element={<StorePage />} />
                        <Route path="/configuracoes" element={<SettingsPage />} />
                      </Route>

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </BrowserRouter>
              </TooltipProvider>
            </HabitProvider>
          </SettingsProvider>
        </ColorProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;