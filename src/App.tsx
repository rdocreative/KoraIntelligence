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
import Index from "./pages/Index";
import MasterplanPage from "./pages/Masterplan";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// New Pages
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
                {/* Reverted background to simple dark #060606 */}
                <div className="min-h-screen bg-[#060606] text-[#f0f0f2] font-sans flex flex-col relative overflow-x-hidden">
                  
                  {/* Conteúdo principal */}
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