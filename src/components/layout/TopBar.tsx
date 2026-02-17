import { Bell, Search, Trophy, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProfilePopover } from '../features/profile/ProfilePopover';
import { AchievementsPopover } from '../features/achievements/AchievementsPopover';
import { TitlesPopover } from '../features/titles/TitlesPopover';

export const TopBar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#080808]/40">
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Search Bar Container - Flexible width */}
        <div className="flex-1 max-w-md flex items-center bg-[#121212]/50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-white/10 text-neutral-400 focus-within:text-white focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/20 transition-all duration-300 shadow-inner group">
           <Search className="w-4 h-4 mr-2 sm:mr-3 text-red-500 group-focus-within:text-red-400 shrink-0" />
           <input 
             className="bg-transparent border-none outline-none text-xs sm:text-sm w-full placeholder:text-neutral-600 font-medium text-ellipsis" 
             placeholder="Pesquisar..." 
           />
        </div>
        
        {/* Grupo de Ações - Right aligned, non-shrinking */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Títulos - Hidden on very small screens if needed, or condensed */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 sm:w-11 sm:h-11 text-neutral-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                    <Medal className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 border-none bg-transparent shadow-none w-[90vw] max-w-md mx-auto">
                <TitlesPopover />
              </DialogContent>
            </Dialog>

            {/* Conquistas */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 sm:w-11 sm:h-11 text-neutral-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 border-none bg-transparent shadow-none w-[90vw] max-w-md mx-auto">
                <AchievementsPopover />
              </DialogContent>
            </Dialog>

            {/* Notificações */}
            <Button 
              size="icon" 
              variant="ghost" 
              className="relative w-9 h-9 sm:w-11 sm:h-11 text-neutral-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
            >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse"></span>
            </Button>
            
            {/* Divisor Vertical */}
            <div className="w-[1px] h-4 sm:h-6 bg-white/10 mx-0.5 sm:mx-1" />

            {/* Perfil */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#1a1a1a] to-[#2a2a2a] border border-white/10 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-lg cursor-pointer hover:border-red-500/50 hover:scale-105 transition-all shrink-0">
                  ME
                </div>
              </DialogTrigger>
              <DialogContent className="p-0 border-none bg-transparent shadow-none w-[90vw] max-w-md mx-auto">
                <ProfilePopover />
              </DialogContent>
            </Dialog>
        </div>
      </div>
    </header>
  );
};