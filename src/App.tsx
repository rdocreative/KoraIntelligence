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
import { FloatingNavbar } from "./components/layout/FloatingNavbar";
import { TopBar } from "./components/layout/TopBar"; 

// Pages
import Index from "./pages/Index";
import MasterplanPage from "./pages/Masterplan";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TasksPage from "./pages/Tasks";
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
    return <div className="h-screen w-full flex items-center justify-center bg-[#020807]"><div className="w-8 h-8 border-4 border-[#4adbc8] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      <TopBar />
      <main className="flex-1 p-6 pb-32 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>
      <FloatingNavbar />
    </div>
  );
};

// Componente para rotas públicas (Login/Cadastro) - Redireciona se já estiver logado
const PublicRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
     return <div className="h-screen w-full flex items-center justify-center bg-[#020807]"><div className="w-8 h-8 border-4 border-[#4adbc8] border-t-transparent rounded-full animate-spin"></div></div>;
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
                  <div className="min-h-screen text-[#f0f9f8] font-sans flex flex-col relative overflow-x-hidden">
                    
                    {/* Background Layers - Tinted Teal-Black */}
                    <div className="fixed inset-0 pointer-events-none bg-[#020807] -z-30" />
                    
                    {/* Top Center Theme Glow - Teal Tinted */}
                    <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-45%,rgba(74,219,200,0.15)_0%,transparent_70%)] -z-20" />
                    
                    {/* Subtle Overlay Gradient */}
                    <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(0,0,0,0)_60%,rgba(2,8,7,0.8)_100%)] -z-10" />

                    <Routes>
                      <Route element={<PublicRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/cadastro" element={<SignUp />} />
                        <Route path="/recuperar-senha" element={<ForgotPassword />} />
                      </Route>

                      <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Index />} />
                        <Route path="/masterplan" element={<MasterplanPage />} />
                        <Route path="/habitos" element={<MasterplanPage />} />
                        <Route path="/tarefas" element={<TasksPage />} />
                        <Route path="/metas" element={<GoalsPage />} />
                        <Route path="/lembretes" element={<RemindersPage />} />
                        <Route path="/missoes" element={<MissionsPage />} />
                        <Route path="/comunidade" element={<CommunityPage />} />
                        <Route path="/financa" element={<StorePage />} />
                        <Route path="/loja" element={<StorePage />} />
                        <Route path="/inventario" element={<StorePage />} />
                        <Route path="/configuracoes" element={<Settings />} />
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