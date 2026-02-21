"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { SettingsProvider } from "./hooks/useSettings"; 
import { HabitProvider } from "./hooks/useHabitTracker";
import { MasterplanProvider } from "./hooks/useMasterplan";
import { AuthProvider, useAuth } from "./components/providers/AuthProvider";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar"; 

// Pages
import Index from "./pages/Index";
import MasterplanPage from "./pages/Masterplan";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import HabitsPage from "./pages/Habits";
import GoalsPage from "./pages/Goals";
import MissionsPage from "./pages/Missions";
import CommunityPage from "./pages/Community";
import StorePage from "./pages/Store";
import RemindersPage from "./pages/Reminders";

// Auth Pages
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";

const queryClient = new QueryClient();

// Componente para proteger rotas privadas
const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#071412]"><div className="w-8 h-8 border-4 border-[#4adbc8] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#071412]">
      <Sidebar />
      <main className="flex-1 ml-[52px] w-[calc(100%-52px)] min-h-screen flex flex-col items-center px-[32px] py-[24px] overflow-y-auto">
        <div className="max-w-[1300px] w-full flex flex-col">
          <TopBar />
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

// Componente para rotas públicas (Login/Cadastro)
const PublicRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
     return <div className="h-screen w-full flex items-center justify-center bg-[#071412]"><div className="w-8 h-8 border-4 border-[#4adbc8] border-t-transparent rounded-full animate-spin"></div></div>;
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
      storageKey="app-theme"
    >
      <AuthProvider>
        <SettingsProvider>
          <HabitProvider>
            <MasterplanProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner theme="dark" />
                <BrowserRouter>
                  <div className="min-h-screen text-[#f0f0f2] font-sans flex flex-col relative overflow-x-hidden bg-[#071412]">
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
                        <Route path="/masterplan" element={<MasterplanPage />} />
                        <Route path="/habitos" element={<HabitsPage />} />
                        <Route path="/tarefas" element={<HabitsPage />} />
                        <Route path="/metas" element={<GoalsPage />} />
                        <Route path="/lembretes" element={<RemindersPage />} />
                        <Route path="/missoes" element={<MissionsPage />} />
                        <Route path="/comunidade" element={<CommunityPage />} />
                        <Route path="/financa" element={<StorePage />} />
                        <Route path="/loja" element={<StorePage />} />
                        <Route path="/inventario" element={<StorePage />} />
                        <Route path="/configuracoes" element={<SettingsPage />} />
                      </Route>

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </BrowserRouter>
              </TooltipProvider>
            </MasterplanProvider>
          </HabitProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;