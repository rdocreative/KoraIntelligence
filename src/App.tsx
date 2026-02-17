import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-[#080808]">
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
      <TooltipProvider>
        <Toaster />
        <Sonner theme="dark" />
        <BrowserRouter>
          <div className="flex min-h-screen bg-[#080808] text-foreground font-sans">
            {/* Left Sidebar */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
              <TopBar />
              <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/habitos" element={<Index />} />
                  <Route path="/tarefas" element={<PlaceholderPage title="Tarefas" />} />
                  <Route path="/metas" element={<PlaceholderPage title="Metas" />} />
                  <Route path="/financa" element={<PlaceholderPage title="Finanças" />} />
                  <Route path="/loja" element={<PlaceholderPage title="Loja" />} />
                  <Route path="/inventario" element={<PlaceholderPage title="Inventário" />} />
                  <Route path="/configuracoes" element={<Index />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;