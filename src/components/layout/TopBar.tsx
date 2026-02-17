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
    <header className="h-20 px-6 lg:px-10 flex items-center justify-center sticky top-0 z-40 bg-[#080808]/40 backdrop-blur-2xl border-b border-white/5">
      <div className="flex items-center gap-4 md:gap-8 w-full max-w-4xl justify-center">
        
        {/* Search Bar */}
        <div className="flex-1 max-w-md flex items-center bg-[#121212]/50 px-4 py-2.5 rounded-2xl border border-white/10 text-neutral-400 focus-within:text-white focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/20 transition-all duration-300 shadow-inner">
           <Search className="w-4 h-4 mr-3 text-red-500" />
           <input 
             className="bg-transparent border-none outline-none text-sm w-full placeholder:text-neutral-600 font-medium" 
             placeholder="Pesquisar..." 
           />
        </div>
        
        {/* Grupo de Ações */}
        <div className="flex items-center gap-2">
            {/* Títulos */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-11 h-11 text-neutral-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                    <Medal className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-fit">
                <TitlesPopover />
              </DialogContent>
            </Dialog>

            {/* Conquistas */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-11 h-11 text-neutral-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                    <Trophy className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-fit">
                <AchievementsPopover />
              </DialogContent>
            </Dialog>

            {/* Notificações */}
            <Button 
              size="icon" 
              variant="ghost" 
              className="relative w-11 h-11 text-neutral-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
            >
                <Bell className="w-5 h-5" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse"></span>
            </Button>
            
            {/* Divisor Vertical */}
            <div className="w-[1px] h-6 bg-white/10 mx-1" />

            {/* Perfil */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1a1a1a] to-[#2a2a2a] border border-white/10 flex items-center justify-center text-white font-bold text-xs shadow-lg cursor-pointer hover:border-red-500/50 hover:scale-105 transition-all">
                  ME
                </div>
              </DialogTrigger>
              <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-fit">
                <ProfilePopover />
              </DialogContent>
            </Dialog>
        </div>
      </div>
    </header>
  );
};