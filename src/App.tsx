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

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#080B14]">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-[24px] animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full text-white antialiased bg-[#080B14] overflow-hidden border-none outline-none ring-0">
      <SideNav />
      <div className="flex-1 flex flex-col p-4 pl-0 min-w-0 bg-[#080B14]">
        <div 
          className="flex-1 flex flex-col rounded-[24px] overflow-hidden relative min-h-0 w-full border-none outline-none shadow-none ring-0" 
          style={{ 
            background: 'radial-gradient(ellipse 80% 60% at 60% 0%, rgba(99,102,241,0.08) 0%, transparent 60%), #080B14' 
          }}
        >
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar relative z-10 min-h-0 px-10">
            <main className="flex-1 flex flex-col">
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
  if (loading) return <div className="h-screen w-full bg-[#080B14]" />;
  if (session) return <Navigate to="/" replace />;
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