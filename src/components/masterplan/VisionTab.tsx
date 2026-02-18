import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, GraduationCap, Heart, User, Target, Sparkles, Award } from "lucide-react";

interface VisionTabProps {
  objective: string;
  updateObjective: (val: string) => void;
}

export const VisionTab = ({ objective, updateObjective }: VisionTabProps) => {
  const pillars = [
    { id: 'work', label: 'Trabalho', icon: Briefcase, color: 'text-blue-500', desc: 'Carreira e Negócios' },
    { id: 'studies', label: 'Estudos', icon: GraduationCap, color: 'text-purple-500', desc: 'Conhecimento e Habilidades' },
    { id: 'health', label: 'Saúde', icon: Heart, color: 'text-red-500', desc: 'Corpo e Mente' },
    { id: 'personal', label: 'Pessoal', icon: User, color: 'text-yellow-500', desc: 'Estilo de Vida e Relacionamentos' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* OBJETIVO NORTEADOR ANUAL */}
      <section className="relative">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-[var(--color-year)] opacity-10 blur-3xl pointer-events-none" />
        <Card className="bg-[#0A0A0A] border-white/10 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-year)] to-transparent opacity-30" />
          <CardHeader className="pt-8 px-8 pb-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[var(--color-year)]/10 border border-[var(--color-year)]/20">
                    <Target className="w-5 h-5 text-[var(--color-year)]" />
                </div>
                <CardTitle className="text-sm font-black uppercase tracking-[0.3em] text-[var(--color-year)]">Objetivo Norteador Anual</CardTitle>
             </div>
             <CardDescription className="text-neutral-500 text-xs pl-12 font-medium">O grande troféu que define o sucesso do seu ano.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
              <textarea
                value={objective}
                onChange={(e) => updateObjective(e.target.value)}
                placeholder="Qual o seu grande objetivo para este ano? Seja ambicioso..."
                className="w-full bg-transparent border-none text-2xl md:text-4xl font-black text-white placeholder:text-neutral-800 focus:ring-0 resize-none min-h-[120px] leading-tight selection:bg-[var(--color-year)] selection:text-black"
              />
              <div className="flex items-center gap-2 mt-4 pl-1 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                 <Award className="w-3 h-3 text-[var(--color-year)]" /> Foco Total no Resultado Macro
              </div>
          </CardContent>
        </Card>
      </section>

      {/* OS 4 PILARES DA EVOLUÇÃO */}
      <section>
          <div className="flex items-center gap-3 mb-8">
             <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <Sparkles className="w-5 h-5 text-neutral-400" />
             </div>
             <h2 className="text-xl font-bold text-white tracking-tight uppercase">Os 4 Pilares da Evolução</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pillars.map((p) => (
                  <Card key={p.id} className="bg-[#0E0E0E] border-white/5 hover:border-[var(--color-year)]/20 transition-all duration-500 group">
                      <CardContent className="p-6">
                          <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-[var(--color-year)]/10 group-hover:scale-110", p.color)}>
                              <p.icon className={cn("w-5 h-5 transition-colors group-hover:text-[var(--color-year)]", p.color)} />
                          </div>
                          <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-1">{p.label}</h3>
                          <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-tight">{p.desc}</p>
                      </CardContent>
                  </Card>
              ))}
          </div>
      </section>

    </div>
  );
};