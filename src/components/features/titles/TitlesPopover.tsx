import { Medal, Check } from "lucide-react";

export const TitlesPopover = () => {
  const titles = [
    { name: "Novato", description: "Iniciou sua jornada épica", active: false },
    { name: "Guerreiro de Elite", description: "Completou 30 dias seguidos", active: true },
    { name: "Lenda Urbana", description: "Alcançou o Level 50", active: false, locked: true },
  ];

  return (
    <div className="w-72 max-w-[90vw] p-5 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="space-y-4">
        <header className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Medal className="w-4 h-4 text-red-500" />
          <h3 className="font-bold text-sm text-white">Meus Títulos</h3>
        </header>

        <div className="space-y-2">
          {titles.map((t, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                t.locked ? 'opacity-40 border-transparent bg-white/2' : 
                t.active ? 'border-red-500/50 bg-red-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-black uppercase tracking-wider ${t.active ? 'text-red-500' : 'text-white'}`}>
                    {t.name}
                  </p>
                  <p className="text-[10px] text-neutral-500">{t.description}</p>
                </div>
                {t.active && <Check className="w-4 h-4 text-red-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};