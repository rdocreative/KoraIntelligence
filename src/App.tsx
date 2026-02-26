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
    return <div className="h-screen w-full flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-[#f5eeee] dark:bg-[#212121] overflow-hidden">
      <SideNav />
      {/* Container Principal "Floating Card" sem sombra e com margem de 7px */}
      <div className="flex-1 flex flex-col mt-[7px] mb-[7px] mr-[7px] ml-0 bg-background rounded-[16px] overflow-hidden transition-all duration-300 ease-in-out border border-black/[0.04] dark:border-white/[0.04] relative">
        <TopBar />
        <main className="flex-1 px-8 py-5 w-full max-w-[100rem] mx-auto overflow-y-auto scrollbar-none">
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
              <TooltipProvider>
                <Sonner theme="light" />
                <BrowserRouter>
                  <div className="h-screen w-screen text-foreground font-sans flex flex-col relative overflow-hidden bg-[#f5eeee] dark:bg-[#212121]">
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
                        <Route path="/tarefas" element={<HabitsPage />} />
                        <Route path="/missoes" element={<MissionsPage />} />
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
            </HabitProvider>
          </SettingsProvider>
        </ColorProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;