import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { SettingsProvider } from "./hooks/useSettings"; 
import { HabitProvider } from "./hooks/useHabitTracker";
import { MasterplanProvider } from "./hooks/useMasterplan"; // Novo provider
import { FloatingNavbar } from "./components/layout/FloatingNavbar";
import { TopBar } from "./components/layout/TopBar";
import Index from "./pages/Index";
import MasterplanPage from "./pages/Masterplan"; // Nova página
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#080808]">
    <div className="text-center space-y-4 max-w-md mx-auto w-full px-4">
      <h1 className="text-3xl sm:text-4xl font-black text-white glow-text break-words">{title}</h1>
      <p className="text-neutral-500 text-sm sm:text-base">Módulo em desenvolvimento...</p>
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
        <HabitProvider> {/* Mantido pois Index.tsx ainda usa */}
          <MasterplanProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner theme="dark" />
              <BrowserRouter>
                <div className="min-h-[100dvh] bg-[#080808] text-foreground font-sans flex flex-col overflow-hidden relative">
                  <TopBar />
                  
                  {/* 
                      Main Content Wrapper 
                      - pt-0 because TopBar is sticky (or we might need pt if it was fixed)
                      - pb-32 to account for FloatingNavbar + spacing
                      - px-4 sm:px-6 for responsive horizontal padding
                      - max-w-7xl to prevent content from stretching too wide on large screens
                  */}
                  <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pb-32 md:pb-40 overflow-x-hidden">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/masterplan" element={<MasterplanPage />} /> {/* Rota Atualizada */}
                      <Route path="/habitos" element={<MasterplanPage />} /> {/* Redirecionamento de segurança */}
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
              </BrowserRouter>
            </TooltipProvider>
          </MasterplanProvider>
        </HabitProvider>
      </SettingsProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;