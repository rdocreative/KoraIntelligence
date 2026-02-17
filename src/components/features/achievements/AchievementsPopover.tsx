import { Trophy, CheckCircle2, Circle, Star } from "lucide-react";

export const AchievementsPopover = () => {
  const missions = [
    { title: "Completar 3 hábitos", progress: 2, total: 3, done: false },
    { title: "Ler a Bíblia hoje", progress: 1, total: 1, done: true },
  ];

  const achievements = [
    { name: "Primeiros Passos", icon: "🌱", color: "bg-green-500/20" },
    { name: "Mestre da Manhã", icon: "☀️", color: "bg-yellow-500/20" },
    { name: "Consistência de Ferro", icon: "🛡️", color: "bg-red-500/20" },
  ];

  return (
    <div className="w-80 p-5 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="space-y-6">
        <header className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-sm text-white">Conquistas</h3>
          </div>
          <span className="text-[10px] font-bold bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">
            2400 pts
          </span>
        </header>

        <section>
          <p className="text-[10px] font-black text-neutral-500 uppercase mb-3 tracking-widest">Missões Diárias</p>
          <div className="space-y-3">
            {missions.map((m, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                {m.done ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> : <Circle className="w-4 h-4 text-neutral-600 shrink-0" />}
                <div className="flex-1">
                   <p className={`text-xs font-medium ${m.done ? 'text-neutral-500 line-through' : 'text-white'}`}>{m.title}</p>
                   <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-red-600" 
                        style={{ width: `${(m.progress / m.total) * 100}%` }}
                      />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="text-[10px] font-black text-neutral-500 uppercase mb-3 tracking-widest">Gerais</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {achievements.map((a, i) => (
              <div key={i} className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center border border-white/10 ${a.color}`}>
                <span className="text-xl mb-1">{a.icon}</span>
                <p className="text-[8px] font-bold text-center px-1 text-white">{a.name}</p>
              </div>
            ))}
            <div className="flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center border border-dashed border-white/10 bg-transparent opacity-40">
                <Star className="w-4 h-4 text-white" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};