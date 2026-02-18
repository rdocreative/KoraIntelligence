import { useState, useMemo } from "react";
import { useMasterplan } from "@/hooks/useMasterplan";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Target, ArrowRight, CheckCircle2, Briefcase, GraduationCap, Heart, User, 
  Plus, X, ChevronRight, AlertCircle, Sparkles, Check, Info, Layout,
  ArrowDown, ArrowUp, Zap, Settings
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

  // --- WELCOME SCREEN (STEP 0) ---
  if (step === 0 && !hasShownWelcome) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center p-6 animate-in fade-in duration-1000">
        
        {/* Ambient Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
            {/* Scanner Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-[scan_4s_linear_infinite]" />
        </div>
        
        <div className="w-full max-w-3xl space-y-12 relative z-10 flex flex-col items-center">
           
           {/* Logo Section */}
           <div className="flex flex-col items-center space-y-4">
               <div className="w-16 h-16 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-center relative group">
                   <Target className="w-8 h-8 text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                   <div className="absolute -inset-1 border border-red-600/20 rounded-xl animate-pulse" />
               </div>
               
               <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none flex flex-col items-center">
                 <span className="text-[10px] tracking-[0.4em] text-neutral-500 mb-2">SISTEMA ATIVO</span>
                 <img 
                    src="/MasterPlan.png" 
                    alt="MasterPlan Logo" 
                    className="h-28 md:h-36 w-auto object-contain" 
                 />
               </h1>
           </div>

           {/* HIGH-TECH DOSSIER CARD */}
           <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
              
              {/* Header Info */}
              <div className="border-b border-white/10 px-6 py-3 flex justify-between items-center bg-white/[0.02]">
                  <div className="flex gap-4 items-center">
                      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      <span className="text-[10px] font-bold text-neutral-400 tracking-[0.2em] uppercase">Status: Em Configuração</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-600">ID: MP-CORE-2024</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 relative">
                  {/* Vertical Divider */}
                  <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-[1px] bg-neutral-800/50 -translate-x-1/2" />

                  {/* Left Column: Hábitos */}
                  <div className="p-8 md:p-10 space-y-4 text-center md:text-left">
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                         HÁBITOS
                      </h2>
                      <div className="h-[2px] w-8 bg-white/20 mx-auto md:mx-0" />
                      <p className="text-neutral-500 text-xs font-medium leading-relaxed uppercase tracking-wide">
                         A base operacional. Sua obrigação diária para manter a disciplina. Ações que você executa no automático, sem questionamento.
                      </p>
                  </div>

                  {/* Right Column: Masterplan */}
                  <div className="p-8 md:p-10 space-y-4 text-center md:text-left bg-white/[0.01]">
                      <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter">
                         MASTERPLAN
                      </h2>
                      <div className="h-[2px] w-8 bg-red-600/50 mx-auto md:mx-0" />
                      <p className="text-neutral-500 text-xs font-medium leading-relaxed uppercase tracking-wide">
                         O vetor de ataque. Metas de guerra com data de conclusão. Onde você quebra o ciclo e sobe seu nível de vida.
                      </p>
                  </div>
              </div>

              {/* Mission Stamp Footer */}
              <div className="p-8 flex justify-center border-t border-white/5 bg-black">
                 <div className="border border-red-600/40 px-6 py-4 rounded-md bg-red-600/[0.02] relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-red-600/20" />
                    <p className="text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-center leading-tight">
                       O QUE VOCÊ VAI CONFIGURAR AGORA NÃO É UMA LISTINHA DE TAREFAS. <br className="hidden md:block" /> É O SEU PLANO DE ATAQUE.
                    </p>
                 </div>
              </div>
           </div>

           {/* Call to Action */}
           <div className="w-full max-w-sm mx-auto">
             <Button 
                 onClick={() => {
                     setHasShownWelcome(true);
                     setStep(1);
                 }}
                 className="w-full h-14 bg-white text-black hover:bg-neutral-200 font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
             >
                 <span className="relative z-10 flex items-center justify-center gap-3">
                    ATIVAR PROTOCOLO
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </span>
             </Button>
           </div>
        </div>
        
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}} />
      </div>
    );
  }

  const renderContent = () => {
    if (step === 1) {
        return (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex-1 overflow-y-auto px-1 -mx-1 pb-6 custom-scrollbar pr-2">
                    <div className="space-y-4 text-center mb-6 pt-2">
                         <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full border border-red-500/20 mb-2 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                            <Target className="w-6 h-6 text-red-500" />
                         </div>
                         <h2 className="text-2xl font-black text-white uppercase tracking-tight">O Alvo Único</h2>
                    </div>

                    <div className="bg-[#0E0E0E] border border-white/10 rounded-xl p-5 mb-8 relative overflow-hidden group shadow-lg">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
                        <div className="flex gap-4">
                            <div className="shrink-0 mt-0.5">
                                <Info className="w-5 h-5 text-red-500" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-white font-bold text-sm uppercase tracking-wide">A Lei do Foco Extremo</h4>
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
                                className="bg-[#0E0E0E] border-white/10 h-16 text-lg font-bold px-4 focus-visible:ring-2 focus-visible:ring-red-500/50 transition-all duration-300"
                            />
                            <Feedback analysis={objectiveAnalysis} />
                        </div>
                        
                        <div className="space-y-3 group">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500 group-focus-within:text-white transition-colors pl-1">Critério de Sucesso</Label>
                            <Textarea 
                                placeholder="Ex: Ter R$ 100k investidos." 
                                value={data.annual.successCriteria}
                                onChange={(e) => updateAnnual({ successCriteria: e.target.value })}
                                className="bg-[#0E0E0E] border-white/10 min-h-[120px] text-base px-4 py-4 resize-none shadow-inner"
                            />
                            <Feedback analysis={criteriaAnalysis} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-white/5 flex-shrink-0 mt-auto bg-[#0A0A0A]/90 backdrop-blur-sm -mx-8 px-8 pb-8">
                    <Button 
                        disabled={!isAnnualValid}
                        onClick={() => setStep(2)}
                        className={`font-bold px-10 rounded-full h-12 transition-all duration-500 ${isAnnualValid ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50'}`}
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
                         <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full border border-blue-500/20 mb-2">
                            <Layout className="w-6 h-6 text-blue-500" />
                         </div>
                         <h2 className="text-2xl font-black text-white uppercase tracking-tight">Os 4 Pilares</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                          { id: 'work', label: 'Trabalho', icon: Briefcase, color: 'text-blue-500', items: data.areas.work },
                          { id: 'studies', label: 'Estudos', icon: GraduationCap, color: 'text-purple-500', items: data.areas.studies },
                          { id: 'health', label: 'Saúde', icon: Heart, color: 'text-red-500', items: data.areas.health },
                          { id: 'personal', label: 'Pessoal', icon: User, color: 'text-yellow-500', items: data.areas.personal },
                        ].map((area) => (
                          <div key={area.id} className="p-5 rounded-2xl border bg-[#0E0E0E] border-white/5">
                              <div className="flex items-center justify-between mb-4">
                                  <Label className={`flex items-center gap-2 text-xs uppercase font-black tracking-widest ${area.color}`}>
                                      <area.icon className="w-4 h-4" /> {area.label}
                                  </Label>
                                  {area.items.length > 0 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                              </div>
                              
                              <div className="flex gap-3 mb-3">
                                  <Input 
                                      value={areaInputs[area.id as keyof typeof areaInputs]}
                                      onChange={(e) => handleAreaInputChange(area.id as keyof typeof areaInputs, e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleAddAreaItem(area.id as keyof typeof areaInputs)}
                                      placeholder="Defina uma meta..." 
                                      className="bg-black/40 border-white/10 text-sm h-11" 
                                  />
                                  <Button size="icon" className="h-11 w-11 bg-white/5 hover:bg-white/10 border border-white/5" onClick={() => handleAddAreaItem(area.id as keyof typeof areaInputs)}>
                                      <Plus className="w-5 h-5"/>
                                  </Button>
                              </div>

                              {area.items.map((i: any) => (
                                  <div key={i.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 mt-2">
                                      <span className="text-sm font-medium text-neutral-200">{i.text}</span>
                                      <button onClick={() => deleteAreaItem(area.id as any, i.id)} className="text-neutral-600 hover:text-red-500">
                                          <X className="w-4 h-4" />
                                      </button>
                                  </div>
                              ))}
                          </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-white/5 flex-shrink-0 mt-auto bg-[#0A0A0A]/90 backdrop-blur-sm -mx-8 px-8 pb-8">
                    <Button variant="ghost" onClick={() => setStep(1)} className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Voltar</Button>
                    <Button 
                        disabled={!hasAtLeastOneItem}
                        onClick={() => setStep(3)}
                        className={`font-bold px-10 rounded-full h-12 transition-all duration-500 ${hasAtLeastOneItem ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50'}`}
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
                <div className="w-24 h-24 bg-gradient-to-br from-green-900/40 to-black border border-green-500/30 rounded-full flex items-center justify-center relative shadow-2xl">
                    <CheckCircle2 className="w-10 h-10 text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight text-center">Tudo pronto.<br/>Sistema ativo.</h3>
                <Button onClick={onComplete} className="w-full max-w-sm bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest h-14 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all">
                    ENTRAR NO CAMPO DE BATALHA
                </Button>
            </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020202]/95 backdrop-blur-xl flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-[#0A0A0A] border-white/10 shadow-2xl relative overflow-hidden h-[90vh] md:h-[760px] flex flex-col ring-1 ring-white/5">
        <div className="px-8 pt-8 pb-6 flex justify-between items-end flex-shrink-0 bg-[#0A0A0A]">
            <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Passo {step} de 3</span>
                <div className="flex gap-1.5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'w-2 bg-neutral-800'}`} />
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