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

const queryClient = new QueryClient();

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-black text-white glow-text">{title}</h1>
      <p className="text-neutral-500">Módulo em desenvolvimento...</p>
    </div>
  </div>
);

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
                {/* Container principal com a nova cor de fundo e overflow controlado */}
                <div className="min-h-screen bg-[#060606] text-foreground font-sans flex flex-col relative overflow-x-hidden">
                  
                  {/* Camadas de fundo fixas */}
                  <div className="bg-circuit-pattern" />
                  <div className="bg-cyber-glow" />

                  {/* Conteúdo principal com z-index elevado para ficar acima do fundo */}
                  <div className="relative z-10 flex flex-col min-h-screen">
                    <TopBar />
                    <main className="flex-1 p-6 pb-32 max-w-5xl mx-auto w-full">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/masterplan" element={<MasterplanPage />} />
                        <Route path="/habitos" element={<MasterplanPage />} />
                        <Route path="/tarefas" element={<PlaceholderPage title="Tarefas" />} />
                        <Route path="/metas" element={<PlaceholderPage title="Metas" />} />
                        <Route path="/missoes" element={<PlaceholderPage title="Missões" />} />
                        <Route path="/comunidade" element={<PlaceholderPage title="Comunidade" />} />
                        <Route path="/financa" element={<PlaceholderPage title="Finanças" />} />
                        <Route path="/loja" element={<PlaceholderPage title="Loja" />} />
                        <Route path="/inventario" element={<PlaceholderPage title="Inventário" />} />
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