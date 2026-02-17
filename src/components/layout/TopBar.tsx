import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TopBar = () => {
  return (
    <header className="h-20 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40 bg-[#080808]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-4 lg:hidden">
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="w-6 h-6" />
        </Button>
        <span className="font-bold text-lg">Mindset<span className="text-red-500">.AI</span></span>
      </div>
      
      <div className="hidden lg:block">
        <h2 className="text-neutral-400 text-sm font-medium">Bem-vindo de volta, <span className="text-white font-bold">Campeão</span></h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-[#121212] px-4 py-2 rounded-full border border-white/5 text-neutral-400 focus-within:text-white focus-within:border-white/20 transition-colors w-64">
           <Search className="w-4 h-4 mr-2" />
           <input className="bg-transparent border-none outline-none text-sm w-full placeholder:text-neutral-600" placeholder="Buscar..." />
        </div>
        
        <Button size="icon" variant="ghost" className="relative text-neutral-400 hover:text-white hover:bg-white/5 rounded-full">
           <Bell className="w-5 h-5" />
           <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
        </Button>
      </div>
    </header>
  );
};