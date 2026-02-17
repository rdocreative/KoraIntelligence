import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Crown, 
  ClipboardList,
  Target, 
  Swords,
  Users,
  ShoppingBag, 
  Settings,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'INÍCIO', path: '/' },
  { icon: Crown, label: 'MASTERPLAN', path: '/masterplan' },
  { icon: ClipboardList, label: 'TAREFAS', path: '/tarefas' },
  { icon: Target, label: 'METAS', path: '/metas' },
  { icon: Swords, label: 'MISSÕES', path: '/missoes' },
  { icon: Users, label: 'COMUNIDADE', path: '/comunidade' },
  { icon: ShoppingBag, label: 'LOJA', path: '/loja' },
  { icon: Settings, label: 'CONFIGURAÇÕES', path: '/configuracoes' },
];

export const FloatingNavbar = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    stopTimer();
    timeoutRef.current = setTimeout(() => {
      setIsMinimized(true);
    }, 5000);
  };

  const stopTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const handleExpand = () => {
    setIsMinimized(false);
    startTimer();
  };

  return (
    <div 
      className="fixed left-1/2 -translate-x-1/2 z-50 flex flex-col items-center w-full pointer-events-none"
      style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
    >
      {/* Container Principal */}
      <div 
        onMouseEnter={stopTimer}
        onMouseLeave={() => {
          if (!isMinimized) startTimer();
        }}
        className={cn(
          "pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] max-w-[95vw]",
          isMinimized ? "translate-y-[150%] opacity-0 pointer-events-none scale-90" : "translate-y-0 opacity-100 scale-100"
        )}
      >
        <nav className="flex items-center gap-1 sm:gap-1 bg-[#121212]/90 backdrop-blur-2xl border border-white/10 px-2 sm:px-3 py-2 sm:py-3 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)] overflow-x-auto no-scrollbar touch-pan-x">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "relative group flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full transition-all duration-300",
                isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              {({ isActive }) => (
                <>
                  {/* Tooltip Pop-up - Only on larger screens or hover capable devices */}
                  <div className="hidden sm:block absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#181818] border border-white/10 rounded-xl opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none shadow-2xl z-[60]">
                    <span className="text-[10px] font-bold tracking-widest text-white whitespace-nowrap uppercase">
                      {item.label}
                    </span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#181818] border-r border-b border-white/10 rotate-45"></div>
                  </div>

                  {/* Icon */}
                  <div className={cn(
                      "relative flex items-center justify-center transition-transform duration-300",
                      isActive && "scale-110"
                  )}>
                      <item.icon 
                          size={18} // Smaller size for mobile default
                          className={cn(
                              "transition-all duration-300 sm:w-5 sm:h-5", // Responsive size
                              isActive && "drop-shadow-[0_0_12px_rgba(239,68,68,0.6)] fill-red-500/10"
                          )} 
                          strokeWidth={isActive ? 2.5 : 2}
                      />
                  </div>

                  {/* Active Dot Indicator */}
                  <span className={cn(
                    "absolute -bottom-0.5 w-1 h-1 rounded-full bg-red-500 transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,1)]",
                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  )} />

                  {/* Hover Background Glow */}
                  <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Trigger Button (Seta para cima) */}
      <button
        onClick={handleExpand}
        className={cn(
          "pointer-events-auto absolute bottom-0 p-3 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 rounded-full text-red-500 transition-all duration-500 shadow-lg shadow-red-500/10 backdrop-blur-md",
          isMinimized ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-50 pointer-events-none"
        )}
      >
        <ChevronUp size={24} className="animate-bounce-slow" />
      </button>
    </div>
  );
};