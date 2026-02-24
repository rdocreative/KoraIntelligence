"use client";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { SettingsProvider } from "./hooks/useSettings"; 
import { HabitProvider } from "./hooks/useHabitTracker";
import { MasterplanProvider } from "./hooks/useMasterplan";
import { AuthProvider, useAuth } from "./components/providers/AuthProvider";
import { ColorProvider } from "./components/providers/ColorProvider";
import { SideNav } from "./components/layout/SideNav";
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
    return <div className="h-screen w-full flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SideNav />
      <div className="flex-1 flex flex-col min-h-screen pl-[85px]">
        <TopBar />
        <main className="flex-1 w-full max-w-[100rem] mx-auto px-5 py-5 overflow-visible">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Componente para rotas públicas (Login/Cadastro)
const PublicRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
     return <div className="h-screen w-full flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
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
      defaultTheme="light" 
      enableSystem={false}
      storageKey="kora-theme"
    >
      <AuthProvider>
        <ColorProvider>
          <SettingsProvider>
            <HabitProvider>
              <MasterplanProvider>
                <TooltipProvider>
                  <Sonner theme="light" />
                  <BrowserRouter>
                    <div className="min-h-screen text-foreground font-sans flex flex-col relative overflow-x-hidden bg-background">
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
        </ColorProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;