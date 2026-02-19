import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { SettingsProvider } from "./hooks/useSettings"; 
import { HabitProvider } from "./hooks/useHabitTracker";
import { MasterplanProvider } from "./hooks/useMasterplan";
import { FloatingNavbar } from "./components/layout/FloatingNavbar";
import { TopBar } from "./components/layout/TopBar"; 
import ParticleBackground from "./components/layout/ParticleBackground";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
      storageKey="app-theme"
    >
      <SettingsProvider>
        <HabitProvider>
          <MasterplanProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner theme="dark" />
              <BrowserRouter>
                <div className="min-h-screen bg-[#060608] text-[#f0f0f2] font-sans flex flex-col relative overflow-x-hidden">
                  
                  {/* Background Layers */}
                  <ParticleBackground />
                  
                  {/* Atmospheric Glows - Enhanced Visibility */}
                  <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {/* Top Left */}
                    <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-red-600/15 blur-[140px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
                    {/* Mid Right */}
                    <div className="absolute top-[20%] -right-[5%] w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '12s' }} />
                    {/* Mid Left */}
                    <div className="absolute top-[45%] -left-[15%] w-[700px] h-[700px] bg-red-600/10 blur-[160px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
                    {/* Bottom Right */}
                    <div className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-red-600/15 blur-[140px] rounded-full animate-pulse" style={{ animationDuration: '9s' }} />
                    {/* Bottom Left */}
                    <div className="absolute bottom-[15%] left-[10%] w-[400px] h-[400px] bg-red-950/20 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: '15s' }} />
                    {/* Top Center */}
                    <div className="absolute -top-[5%] left-[35%] w-[500px] h-[500px] bg-red-600/5 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '11s' }} />
                  </div>
                  
                  {/* Central Glow Gradient - Subtle touch */}
                  <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.04),transparent_80%)]" />

                  <div className="relative z-10 flex flex-col min-h-screen">
                    <TopBar />
                    <main className="flex-1 p-6 pb-32 max-w-5xl mx-auto w-full">
                      <Routes>
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
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <FloatingNavbar />
                  </div>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </MasterplanProvider>
        </HabitProvider>
      </SettingsProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;