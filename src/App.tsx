"use client";

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
import { TopBar } from "./components/layout/TopBar";

// Pages
import Index from "./pages/Index";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import HabitsPage from "./pages/Habits";
import TasksPage from "./pages/Tasks";
import MissionsPage from "./pages/Missions";
import StorePage from "./pages/Store";

// Auth Pages
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";

const queryClient = new QueryClient();

// Componente para proteger rotas privadas
const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#080809]">
        <div className="w-8 h-8 border-4 border-[#C4B5FD] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#080809] text-white">
      <SideNav />
      <div className="flex-1 flex flex-col h-full py-3 pr-3">
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar relative bg-[#121216] rounded-[2.5rem] border border-white/5 shadow-2xl p-8 lg:p-14">
          <TopBar />
          <main className="flex-1 h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

// Componente para rotas públicas
const PublicRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
     return <div className="h-screen w-full flex items-center justify-center bg-[#080809]"><div className="w-8 h-8 border-4 border-[#C4B5FD] border-t-transparent rounded-full animate-spin"></div></div>;
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
                  <div className="h-screen w-screen text-white font-sans flex flex-col relative overflow-hidden bg-[#080809]">
                    <Routes>
                      {/* Rotas Públicas */}
                      <Route element={<PublicRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/cadastro" element={<SignUp />} />
                        <Route path="/recuperar-senha" element={<ForgotPassword />} />
                      </Route>

                      {/* Rotas Protegidas */}
                      <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Index />} />
                        <Route path="/habitos" element={<HabitsPage />} />
                        <Route path="/tarefas" element={<TasksPage />} />
                        <Route path="/missoes" element={<MissionsPage />} />
                        <Route path="/loja" element={<StorePage />} />
                        <Route path="/configuracoes" element={<SettingsPage />} />
                        <Route path="/dashboard" element={<Index />} />
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