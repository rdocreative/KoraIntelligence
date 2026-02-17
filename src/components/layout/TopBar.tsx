import { Bell, Search, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TopBar = () => {
  return (
    <header className="h-20 px-6 flex items-center justify-between sticky top-0 z-40 bg-[#080808]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="bg-red-600/20 p-2 rounded-xl">
           <Flame className="w-5 h-5 text-red-500 fill-red-500/50" />
        </div>
        <span className="font-bold text-lg text-white tracking-wide">Mindset<span className="text-red-500">.AI</span></span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center bg-[#121212] px-4 py-2 rounded-full border border-white/5 text-neutral-400 focus-within:text-white focus-within:border-white/20 transition-colors w-64">
           <Search className="w-4 h-4 mr-2" />
           <input className="bg-transparent border-none outline-none text-sm w-full placeholder:text-neutral-600" placeholder="Buscar..." />
        </div>
        
        {/* User Profile / Notifications */}
        <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" className="relative text-neutral-400 hover:text-white hover:bg-white/5 rounded-full">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
            </Button>
            
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-red-900/20 cursor-pointer hover:scale-105 transition-transform">
                ME
            </div>
        </div>
      </div>
    </header>
  );
};