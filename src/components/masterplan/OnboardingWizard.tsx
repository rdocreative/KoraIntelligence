"use client";

import { useState, useMemo } from "react";
import { useMasterplan } from "@/hooks/useMasterplan";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Target, CheckCircle2, Briefcase, GraduationCap, Heart, User, 
  Plus, X, ChevronRight, AlertCircle, Sparkles, Check, Info, Layout
} from "lucide-react";

export const OnboardingWizard = ({ onComplete }: { onComplete: () => void }) => {
  const { data, updateAnnual, addAreaItem, deleteAreaItem } = useMasterplan();
  const [step, setStep] = useState(0); 
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  
  const [areaInputs, setAreaInputs] = useState({
    work: "",
    studies: "",
    health: "",
    personal: ""
  });

  const handleAreaInputChange = (key: keyof typeof areaInputs, value: string) => {
    setAreaInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleAddAreaItem = (key: keyof typeof areaInputs) => {
    const text = areaInputs[key];
    if (!text || !text.trim()) return;
    
    addAreaItem(key as any, text.trim());
    setAreaInputs(prev => ({ ...prev, [key]: "" }));
  };

  // Smart Validation Logic
  const objectiveAnalysis = useMemo(() => {
    const text = data.annual.objective.trim();
    const length = text.length;
    
    if (length === 0) return null;
    if (length < 8) return { status: 'weak', message: 'Muito curto. Seja mais específico.', color: 'text-red-500', icon: AlertCircle };
    
    const vagueWords = ['melhor', 'sucesso', 'feliz', 'rico', 'vida', 'coisas'];
    const hasVagueWords = vagueWords.some(w => text.toLowerCase().includes(w));
    
    if (hasVagueWords && length < 20) return { status: 'medium', message: 'Tente definir o que isso significa na prática.', color: 'text-yellow-500', icon: AlertCircle };
    
    return { status: 'strong', message: 'Excelente objetivo.', color: 'text-green-500', icon: Check };
  }, [data.annual.objective]);

  const criteriaAnalysis = useMemo(() => {
    const text = data.annual.successCriteria.trim();
    const length = text.length;
    
    if (length === 0) return null;
    
    const hasNumbers = /\d/.test(text);
    if (!hasNumbers) return { status: 'medium', message: 'Dica: Inclua números ou valores (R$, kg, %).', color: 'text-blue-400', icon: Sparkles };
    
    return { status: 'strong', message: 'Critério mensurável. Ótimo.', color: 'text-green-500', icon: Check };
  }, [data.annual.successCriteria]);
  
  // Strict Blocking
  const isAnnualValid = 
    data.annual.objective.trim().length > 5 && 
    data.annual.successCriteria.trim().length > 5;
  
  const hasAtLeastOneItem = 
    data.areas.work.length > 0 || 
    data.areas.studies.length > 0 || 
    data.areas.health.length > 0 || 
    data.areas.personal.length > 0;

  // Render Helpers
  const Feedback = ({ analysis }: { analysis: any }) => {
    if (!analysis) return null;
    const Icon = analysis.icon;
    return (
        <div className={`flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider mt-2 animate-in slide-in-from-left-2 ${analysis.color}`}>
            <Icon className="w-3 h-3" /> {analysis.message}
        </div>
    );
  };

  // Tactical Background Component (90% Black / 10% Texture)
  const AppBackground = () => (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 bg-black"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.93), rgba(0, 0, 0, 0.97)), url('/Background-MasterPlan.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    />
  );

  // --- WELCOME SCREEN (STEP 0) ---
  if (step === 0 && !hasShownWelcome) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden">
        <AppBackground />
        
        <div className="w-full max-w-4xl space-y-12 relative z-10 flex flex-col items-center">
           {/* Logo Section */}
           <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
               <span className="text-[12px] tracking-[0.4em] text-white/50 uppercase font-bold mb-[-2rem] relative z-0">
                  Bem-vindo ao
               </span>
               <img 
                  src="/MasterPlan.png" 
                  alt="MasterPlan Logo" 
                  style={{ filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.9))' }}
                  className="h-32 md:h-40 w-auto object-contain relative z-10" 
               />
               <span className="text-[10px] tracking-[0.6em] text-white/30 mt-6 uppercase font-medium">Sistema Ativo</span>
           </div>

           {/* Modular Architecture */}
           <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200 fill-mode-backwards px-4 md:px-0 items-stretch">
               <div className="bg-white/[0.03] backdrop-blur-xl border-r-2 border-neutral-800 p-6 flex flex-col gap-3 text-left hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                   <div className="relative z-10">
                       <span className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase">Protocolo de Base</span>
                       <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Hábitos</h2>
                       <p className="text-neutral-400 text-xs font-medium leading-relaxed max-w-xs">
                           Sua manutenção diária. Ações obrigatórias para manter a máquina operando em alta performance. Sem negociação.
                       </p>
                   </div>
               </div>

               <div className="bg-white/[0.03] backdrop-blur-xl border-l-2 border-red-600/50 p-6 flex flex-col gap-3 text-left hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                   <div className="relative z-10">
                       <span className="text-[10px] text-red-500/80 font-bold tracking-widest uppercase">Vetor de Expansão</span>
                       <div className="h-8 flex items-center justify-start">
                           <img 
                              src="/MasterPlan.png" 
                              alt="MasterPlan" 
                              style={{ filter: 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.4))' }}
                              className="h-10 w-auto object-contain object-left opacity-80"
                           />
                       </div>
                       <p className="text-neutral-400 text-xs font-medium leading-relaxed max-w-xs">
                           Sua estratégia de ataque. Projetos táticos com início, meio e fim, desenhados para mover o ponteiro e mudar o seu nível de vida.
                       </p>
                   </div>
               </div>
           </div>

           {/* Footer Command */}
           <div className="w-full max-w-lg mx-auto flex flex-col gap-8 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-500 fill-mode-backwards mt-16">
               <div className="border-y border-white/10 py-6 text-center bg-black/40 backdrop-blur-md">
                   <p className="text-white/60 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.15em] leading-relaxed">
                       O QUE VOCÊ VAI CONFIGURAR AGORA NÃO É UMA LISTINHA DE TAREFAS.<br className="hidden md:block" /> É O SEU PLANO DE ATAQUE.
                   </p>
               </div>

               <div className="w-full max-w-xs mx-auto">
                 <Button 
                     onClick={() => {
                         setHasShownWelcome(true);
                         setStep(1);
                     }}
                     className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-md shadow-[0_0_25px_rgba(220,38,38,0.3)] transition-all duration-300 transform hover:-translate-y-1"
                 >
                     ATIVAR PROTOCOLO
                 </Button>
               </div>
           </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (step === 1) {
        return (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex-1 overflow-y-auto px-1 -mx-1 pb-6 custom-scrollbar pr-2">
                    <div className="space-y-4 text-center mb-6 pt-2">
                         <div className="inline-flex items-center justify-center p-3 bg-red-500/5 rounded-full border border-red-500/10 mb-2 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
                            <Target className="w-6 h-6 text-red-500/70" />
                         </div>
                         <h2 className="text-2xl font-black text-white uppercase tracking-tight">O Alvo Único</h2>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 mb-8 relative overflow-hidden group shadow-lg backdrop-blur-md">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50" />
                        <div className="flex gap-4">
                            <div className="shrink-0 mt-0.5">
                                <Info className="w-5 h-5 text-red-500/60" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-white/90 font-bold text-sm uppercase tracking-wide">A Lei do Foco Extremo</h4>
                                <p className="text-neutral-400 text-sm leading-relaxed">
                                    Qual é a <span className="text-white font-bold">ÚNICA</span> coisa que, se você conquistar este ano, fará todas as outras parecerem fáceis ou irrelevantes?
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3 group relative">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500 group-focus-within:text-white transition-colors pl-1">Objetivo Anual</Label>
                            <Input 
                                autoFocus
                                placeholder="Ex: Atingir liberdade financeira" 
                                value={data.annual.objective}
                                onChange={(e) => updateAnnual({ objective: e.target.value })}
                                className="bg-black/40 backdrop-blur-md border-white/10 h-16 text-lg font-bold px-4 focus-visible:ring-1 focus-visible:ring-red-500/30 text-white"
                            />
                            <Feedback analysis={objectiveAnalysis} />
                        </div>
                        
                        <div className="space-y-3 group">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500 group-focus-within:text-white transition-colors pl-1">Critério de Sucesso</Label>
                            <Textarea 
                                placeholder="Ex: Ter R$ 100k investidos." 
                                value={data.annual.successCriteria}
                                onChange={(e) => updateAnnual({ successCriteria: e.target.value })}
                                className="bg-black/40 backdrop-blur-md border-white/10 min-h-[120px] text-base px-4 py-4 resize-none text-white"
                            />
                            <Feedback analysis={criteriaAnalysis} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-white/5 flex-shrink-0 mt-auto -mx-8 px-8 pb-8">
                    <Button 
                        disabled={!isAnnualValid}
                        onClick={() => setStep(2)}
                        className={`font-bold px-10 rounded-full h-12 transition-all duration-500 ${isAnnualValid ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-900 text-neutral-600 cursor-not-allowed opacity-50'}`}
                    >
                        Próximo <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex-1 overflow-y-auto px-1 -mx-1 pb-6 custom-scrollbar pr-2">
                    <div className="space-y-4 text-center mb-6 pt-2">
                         <div className="inline-flex items-center justify-center p-3 bg-blue-500/5 rounded-full border border-blue-500/10 mb-2">
                            <Layout className="w-6 h-6 text-blue-500/70" />
                         </div>
                         <h2 className="text-2xl font-black text-white uppercase tracking-tight">Os 4 Pilares</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                          { id: 'work', label: 'Trabalho', icon: Briefcase, color: 'text-blue-500/70', items: data.areas.work },
                          { id: 'studies', label: 'Estudos', icon: GraduationCap, color: 'text-purple-500/70', items: data.areas.studies },
                          { id: 'health', label: 'Saúde', icon: Heart, color: 'text-red-500/70', items: data.areas.health },
                          { id: 'personal', label: 'Pessoal', icon: User, color: 'text-yellow-500/70', items: data.areas.personal },
                        ].map((area) => (
                          <div key={area.id} className="p-5 rounded-2xl border bg-black/40 backdrop-blur-md border-white/5">
                              <div className="flex items-center justify-between mb-4">
                                  <Label className={`flex items-center gap-2 text-xs uppercase font-black tracking-widest ${area.color}`}>
                                      <area.icon className="w-4 h-4" /> {area.label}
                                  </Label>
                                  {area.items.length > 0 && <CheckCircle2 className="w-4 h-4 text-green-500/60" />}
                              </div>
                              
                              <div className="flex gap-3 mb-3">
                                  <Input 
                                      value={areaInputs[area.id as keyof typeof areaInputs]}
                                      onChange={(e) => handleAreaInputChange(area.id as keyof typeof areaInputs, e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleAddAreaItem(area.id as keyof typeof areaInputs)}
                                      placeholder="Defina uma meta..." 
                                      className="bg-black/40 border-white/5 text-sm h-11 text-white" 
                                  />
                                  <Button size="icon" className="h-11 w-11 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5" onClick={() => handleAddAreaItem(area.id as keyof typeof areaInputs)}>
                                      <Plus className="w-5 h-5 text-neutral-400"/>
                                  </Button>
                              </div>

                              {area.items.map((i: any) => (
                                  <div key={i.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 mt-2">
                                      <span className="text-sm font-medium text-neutral-400">{i.text}</span>
                                      <button onClick={() => deleteAreaItem(area.id as any, i.id)} className="text-neutral-700 hover:text-red-500/80 transition-colors">
                                          <X className="w-4 h-4" />
                                      </button>
                                  </div>
                              ))}
                          </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-white/5 flex-shrink-0 mt-auto -mx-8 px-8 pb-8">
                    <Button variant="ghost" onClick={() => setStep(1)} className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] hover:text-white hover:bg-white/5">Voltar</Button>
                    <Button 
                        disabled={!hasAtLeastOneItem}
                        onClick={() => setStep(3)}
                        className={`font-bold px-10 rounded-full h-12 transition-all duration-500 ${hasAtLeastOneItem ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-900 text-neutral-600 cursor-not-allowed opacity-50'}`}
                    >
                        Próximo <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="flex flex-col items-center justify-center py-6 space-y-8 animate-in fade-in zoom-in duration-500 h-full overflow-y-auto custom-scrollbar">
                <div className="w-24 h-24 bg-gradient-to-br from-green-900/20 to-black border border-green-500/20 rounded-full flex items-center justify-center relative shadow-2xl">
                    <CheckCircle2 className="w-10 h-10 text-green-500/70 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight text-center">Tudo pronto.<br/>Sistema ativo.</h3>
                <Button onClick={onComplete} className="w-full max-w-sm bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest h-14 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.2)] transition-all">
                    ENTRAR NO CAMPO DE BATALHA
                </Button>
            </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden bg-black">
      <AppBackground />

      <Card className="w-full max-w-lg bg-black/40 backdrop-blur-2xl border-white/5 shadow-2xl relative overflow-hidden h-[90vh] md:h-[760px] flex flex-col ring-1 ring-white/5">
        <div className="px-8 pt-8 pb-6 flex justify-between items-end flex-shrink-0">
            <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600">Passo {step} de 3</span>
                <div className="flex gap-1.5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-red-600/60 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'w-2 bg-neutral-900'}`} />
                    ))}
                </div>
            </div>
        </div>
        <CardContent className="flex-1 px-8 relative z-10 flex flex-col overflow-hidden">
            {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};