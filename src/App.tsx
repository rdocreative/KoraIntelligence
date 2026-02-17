import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { FloatingNavbar } from "./components/layout/FloatingNavbar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400">Esta seção está em desenvolvimento...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem={true}
      storageKey="app-theme-preference"
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 pb-28">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/habitos" element={<Index />} />
              <Route path="/tarefas" element={<PlaceholderPage title="Tarefas" />} />
              <Route path="/metas" element={<PlaceholderPage title="Metas" />} />
              <Route path="/financa" element={<PlaceholderPage title="Finanças" />} />
              <Route path="/loja" element={<PlaceholderPage title="Loja" />} />
              <Route path="/inventario" element={<PlaceholderPage title="Inventário" />} />
              <Route path="/configuracoes" element={<PlaceholderPage title="Configurações" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <FloatingNavbar />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;