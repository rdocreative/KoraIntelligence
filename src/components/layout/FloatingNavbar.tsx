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
  ChevronUp,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

// MAPA DE CORES DO NOVO SISTEMA DE DESIGN
const navItems = [
  // Inicio / Dashboard: Geral, mantém o Teal neutro ou usa um mix
  { icon: LayoutDashboard, label: 'INÍCIO', path: '/', color: '#4adbc8', shadowColor: 'rgba(74, 219, 200, 0.6)' },
  
  // Masterplan: Metas/Visão -> ROXO
  { icon: Crown, label: 'MASTERPLAN', path: '/masterplan', color: '#BF5FFF', shadowColor: 'rgba(191, 95, 255, 0.6)' },
  
  // Tarefas: Foco -> CIANO
  { icon: ClipboardList, label: 'TAREFAS', path: '/tarefas', color: '#00E5FF', shadowColor: 'rgba(0, 229, 255, 0.6)' },
  
  // Metas: Visão -> ROXO (Repetindo o conceito de visão)
  { icon: Target, label: 'METAS', path: '/metas', color: '#BF5FFF', shadowColor: 'rgba(191, 95, 255, 0.6)' },
  
  // Lembretes: Geral/Neutro (Rosa para diferenciar ainda)
  { icon: Bell, label: 'LEMBRETES', path: '/lembretes', color: 'rgba(236, 72, 153, 1)', shadowColor: 'rgba(236, 72, 153, 0.6)' },
  
  // Missões: XP/Energia -> DOURADO/LARANJA
  { icon: Swords, label: 'MISSÕES', path: '/missoes', color: '#FFB300', shadowColor: 'rgba(255, 179, 0, 0.6)' },
  
  // Comunidade: Social (Azul/Ciano)
  { icon: Users, label: 'COMUNIDADE', path: '/comunidade', color: '#00E5FF', shadowColor: 'rgba(0, 229, 255, 0.6)' },
  
  // Loja: Recompensa -> DOURADO
  { icon: ShoppingBag, label: 'LOJA', path: '/loja', color: '#FFB300', shadowColor: 'rgba(255, 179, 0, 0.6)' },
  
  // Configs: Neutro
  { icon: Settings, label: 'CONFIGURAÇÕES', path: '/configuracoes', color: 'rgba(148, 163, 184, 1)', shadowColor: 'rgba(148, 163, 184, 0.6)' },
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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      <div 
        onMouseEnter={stopTimer}
        onMouseLeave={() => {
          if (!isMinimized) startTimer();
        }}
        className={cn(
          "transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
          isMinimized ? "translate-y-[120%] opacity-0 pointer-events-none scale-90" : "translate-y-0 opacity-100 scale-100"
        )}
      >
        <nav className="flex items-center gap-1 bg-[#0a0a0c]/90 backdrop-blur-2xl border border-[#222230] px-3 py-3 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                isActive ? "text-white" : "text-neutral-400 hover:text-white"
              )}
            >
              {({ isActive }) => (
                <>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#0a0a0c] border border-[#222230] rounded-xl opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none shadow-xl z-[60]">
                    <span className="text-[10px] font-bold tracking-widest text-white whitespace-nowrap uppercase">
                      {item.label}
                    </span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0a0a0c] border-r border-b border-[#222230] rotate-45"></div>
                  </div>

                  <div className={cn(
                      "relative flex items-center justify-center transition-transform duration-300",
                      isActive && "scale-110"
                  )}>
                      <item.icon 
                          size={20} 
                          style={{ 
                            color: isActive ? item.color : 'inherit',
                            filter: isActive ? `drop-shadow(0 0 8px ${item.shadowColor})` : 'none'
                          }}
                          className={cn(
                              "transition-all duration-300",
                              isActive && "fill-current/10"
                          )} 
                          strokeWidth={isActive ? 2.5 : 2}
                      />
                  </div>

                  <span 
                    style={{ 
                      backgroundColor: item.color,
                      boxShadow: `0 0 10px ${item.color}`
                    }}
                    className={cn(
                      "absolute -bottom-0.5 w-1 h-1 rounded-full transition-all duration-300",
                      isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                    )} 
                  />
                  <div className="absolute inset-0 bg-white/[0.03] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={handleExpand}
        className={cn(
          "absolute bottom-0 p-3 bg-[#4adbc8]/10 hover:bg-[#4adbc8]/20 border border-[#4adbc8]/30 rounded-full text-[#4adbc8] transition-all duration-500 shadow-lg shadow-[#4adbc8]/10 backdrop-blur-md",
          isMinimized ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-50 pointer-events-none"
        )}
      >
        <ChevronUp size={24} className="animate-bounce-slow" />
      </button>
    </div>
  );
};