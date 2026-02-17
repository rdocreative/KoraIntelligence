import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TopBar = () => {
  return (
    <header className="h-20 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40 bg-[#080808]/40 backdrop-blur-2xl border-b border-white/5">
      {/* Esquerda - Espaço Vazio ou Saudação Sutil */}
      <div className="flex-1 hidden md:block">
        <span className="text-xs font-bold tracking-[0.2em] text-neutral-600 uppercase">
          Mindset Evolution
        </span>
      </div>
      
      {/* Direita - Ações de Busca e Notificações */}
      <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-end">
        
        {/* Search Bar - Mais destacada com brilho sutil */}
        <div className="flex-1 md:flex-none flex items-center bg-[#121212] px-4 py-2.5 rounded-2xl border border-white/10 text-neutral-400 focus-within:text-white focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/20 transition-all duration-300 w-full md:w-72 shadow-inner">
           <Search className="w-4 h-4 mr-3 text-red-500" />
           <input 
             className="bg-transparent border-none outline-none text-sm w-full placeholder:text-neutral-600 font-medium" 
             placeholder="Pesquisar missões..." 
           />
        </div>
        
        {/* Notificações */}
        <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="relative w-11 h-11 text-neutral-400 hover:text-white hover:bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-all"
            >
                <Bell className="w-5 h-5" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse"></span>
            </Button>
            
            <div className="hidden sm:flex w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1a1a1a] to-[#2a2a2a] border border-white/10 items-center justify-center text-white font-bold text-xs shadow-lg cursor-pointer hover:border-red-500/50 hover:scale-105 transition-all">
                ME
            </div>
        </div>
      </div>
    </header>
  );
};