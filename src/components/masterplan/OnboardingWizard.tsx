import { useState, useMemo } from "react";
import { useMasterplan } from "@/hooks/useMasterplan";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Target, ArrowRight, CheckCircle2, Briefcase, GraduationCap, Heart, User, 
  Plus, X, ChevronRight, AlertCircle, Sparkles, Check, Shield, Sword
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
      <div className="fixed inset-0 z-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-black flex items-center justify-center p-6 animate-in fade-in duration-1000">
        
        {/* Ambient Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 blur-[150px] rounded-full animate-pulse duration-[6000ms]" />
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
        </div>
        
        <div className="w-full max-w-2xl text-center space-y-10 relative z-10 flex flex-col items-center">
           
           {/* Icon with Breathing Animation */}
           <div className="relative group">
             <div className="absolute inset-0 bg-red-500/20 blur-[60px] rounded-full animate-pulse" />
             <div className="w-24 h-24 bg-gradient-to-br from-[#1E1E1E] to-black border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl relative z-10 animate-[bounce_3s_infinite]">
                 <div className="absolute inset-0 rounded-3xl border border-white/5 mask-image-gradient" />
                 <Target className="w-10 h-10 text-red-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
             </div>
           </div>

           {/* Typography - Emotional Impact */}
           <div className="space-y-4">
               <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none animate-in slide-in-from-bottom-4 fade-in duration-1000">
                 BEM-VINDO AO SEU <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">MASTERPLAN.</span>
               </h1>
               <p className="text-sm md:text-base text-neutral-400 font-bold uppercase tracking-widest max-w-lg mx-auto animate-in slide-in-from-bottom-5 fade-in duration-1000 delay-200">
                 O método japonês da clareza absoluta, adaptado para a execução implacável.
               </p>
           </div>

           {/* Manifesto Card */}
           <div className="w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 text-left space-y-6 animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-300 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Target className="w-32 h-32 text-white transform rotate-12 translate-x-10 -translate-y-10" />
              </div>

              <p className="text-neutral-300 font-medium leading-relaxed relative z-10">
                 A maioria das pessoas falha porque mistura rotina com evolução. Aqui, nós separamos os dois:
              </p>
              
              <div className="space-y-4 relative z-10">
                 <div className="flex gap-4 items-start">
                    <div className="p-2 bg-blue-500/10 rounded-lg shrink-0 mt-1">
                       <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                       <h4 className="text-white font-bold text-sm uppercase tracking-wide">Seus Hábitos são sua Armadura</h4>
                       <p className="text-neutral-400 text-sm mt-1">Ações diárias de manutenção (treino, água, leitura). Eles te mantêm vivo.</p>
                    </div>
                 </div>

                 <div className="flex gap-4 items-start">
                    <div className="p-2 bg-red-500/10 rounded-lg shrink-0 mt-1">
                       <Sword className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                       <h4 className="text-white font-bold text-sm uppercase tracking-wide">Seu Masterplan é sua Espada</h4>
                       <p className="text-neutral-400 text-sm mt-1">Ações táticas, com começo, meio e fim. Elas servem para atacar o seu futuro e te subir de nível.</p>
                    </div>
                 </div>
              </div>

              <div className="pt-4 border-t border-white/5 relative z-10">
                 <p className="text-neutral-300 font-medium italic text-center text-sm">
                    "O que você vai configurar agora não é uma lista de tarefas. É o seu Sistema Operacional de Vida."
                 </p>
              </div>
           </div>

           {/* Call to Action - System Activation */}
           <div className="w-full max-w-sm mx-auto animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-500 pt-4">
             <Button 
                 onClick={() => {
                     setHasShownWelcome(true);
                     setStep(1);
                 }}
                 className="w-full h-14 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-sm uppercase tracking-widest rounded-full shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:shadow-[0_0_60px_rgba(220,38,38,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 border border-white/10 group relative overflow-hidden"
             >
                 <span className="relative z-10 flex items-center justify-center gap-3">
                    INICIAR CONFIGURAÇÃO DO SISTEMA
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </span>
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
             </Button>
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
                    <div className="space-y-4 text-center mb-8 pt-2">
                         <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full border border-red-500/20 mb-2 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                            <Target className="w-6 h-6 text-red-500" />
                         </div>
                         <h2 className="text-2xl font-black text-white uppercase tracking-tight">O Alvo Único</h2>
                         <p className="text-neutral-400 text-sm max-w-xs mx-auto">
                            O sucesso vem da clareza. Escolha um único objetivo central para o seu ano.
                         </p>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3 group relative">
                            <div className="flex justify-between items-baseline">
                               <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500 group-focus-within:text-white transition-colors pl-1">Objetivo Anual</Label>
                               {objectiveAnalysis?.status === 'strong' && <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider animate-in fade-in">Validado</span>}
                            </div>
                            <Input 
                                autoFocus
                                placeholder="Ex: Atingir liberdade financeira" 
                                value={data.annual.objective}
                                onChange={(e) => updateAnnual({ objective: e.target.value })}
                                className={`bg-[#0E0E0E] border-white/10 h-16 text-lg font-bold px-4 focus-visible:ring-2 focus-visible:ring-red-500/50 transition-all duration-300 shadow-inner group-hover:border-white/20 ${objectiveAnalysis?.status === 'strong' ? 'border-green-500/30' : ''}`}
                            />
                            <Feedback analysis={objectiveAnalysis} />
                        </div>
                        
                        <div className="space-y-3 group">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500 group-focus-within:text-white transition-colors pl-1">Critério de Sucesso</Label>
                            <Textarea 
                                placeholder="Como você saberá que venceu? Ex: Ter R$ 100k investidos." 
                                value={data.annual.successCriteria}
                                onChange={(e) => updateAnnual({ successCriteria: e.target.value })}
                                className="bg-[#0E0E0E] border-white/10 min-h-[120px] text-base px-4 py-4 focus-visible:ring-2 focus-visible:ring-red-500/50 transition-all duration-300 resize-none shadow-inner group-hover:border-white/20"
                            />
                            <Feedback analysis={criteriaAnalysis} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-white/5 flex-shrink-0 mt-auto bg-[#0A0A0A]/90 backdrop-blur-sm -mx-8 px-8 pb-8">
                    <Button 
                        disabled={!isAnnualValid}
                        onClick={() => setStep(2)}
                        className={`font-bold px-10 rounded-full h-12 transition-all duration-500 ${isAnnualValid ? 'bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50'}`}
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
                    <div className="text-center space-y-2 mb-8 pt-2">
                         <h2 className="text-2xl font-black text-white uppercase tracking-tight">Os 4 Pilares</h2>
                         <p className="text-neutral-400 text-sm">
                            Para o sistema funcionar, adicione ao menos <span className="text-white font-bold">1 meta</span>.
                         </p>
                    </div>

                    <div className="space-y-4">
                        {[
                          { 
                            id: 'work', 
                            label: 'Trabalho', 
                            icon: Briefcase, 
                            color: 'text-blue-500', 
                            items: data.areas.work,
                            placeholder: "Ex: Novo emprego" 
                          },
                          { 
                            id: 'studies', 
                            label: 'Estudos', 
                            icon: GraduationCap, 
                            color: 'text-purple-500', 
                            items: data.areas.studies,
                            placeholder: "Ex: Inglês fluente" 
                          },
                          { 
                            id: 'health', 
                            label: 'Saúde', 
                            icon: Heart, 
                            color: 'text-red-500', 
                            items: data.areas.health,
                            placeholder: "Ex: Correr 5km" 
                          },
                          { 
                            id: 'personal', 
                            label: 'Pessoal', 
                            icon: User, 
                            color: 'text-yellow-500', 
                            items: data.areas.personal,
                            placeholder: "Ex: Ler 12 livros" 
                          },
                        ].map((area) => {
                            const hasItems = area.items.length > 0;
                            return (
                              <div 
                                key={area.id} 
                                className={`p-5 rounded-2xl border transition-all duration-300 group ${hasItems ? 'bg-[#0E0E0E] border-green-500/20' : 'bg-[#0A0A0A] border-white/5 hover:border-white/10'}`}
                              >
                                  <div className="flex items-center justify-between mb-4">
                                      <Label className={`flex items-center gap-2 text-xs uppercase font-black tracking-widest ${area.color}`}>
                                          <area.icon className="w-4 h-4" /> {area.label}
                                      </Label>
                                      {hasItems && <CheckCircle2 className="w-4 h-4 text-green-500 animate-in zoom-in duration-300" />}
                                  </div>
                                  
                                  <div className="flex gap-3 mb-3">
                                      <Input 
                                          value={areaInputs[area.id as keyof typeof areaInputs]}
                                          onChange={(e) => handleAreaInputChange(area.id as keyof typeof areaInputs, e.target.value)}
                                          onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                  e.preventDefault();
                                                  handleAddAreaItem(area.id as keyof typeof areaInputs);
                                              }
                                          }}
                                          placeholder={area.placeholder} 
                                          className="bg-black/40 border-white/10 text-sm h-11 focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all rounded-lg" 
                                      />
                                      <Button 
                                          type="button"
                                          size="icon" 
                                          className="h-11 w-11 bg-white/5 hover:bg-white/10 border border-white/5 shrink-0 transition-transform active:scale-95 rounded-lg" 
                                          onClick={(e) => {
                                              e.preventDefault();
                                              handleAddAreaItem(area.id as keyof typeof areaInputs);
                                          }}
                                      >
                                          <Plus className="w-5 h-5"/>
                                      </Button>
                                  </div>

                                  {hasItems && (
                                      <div className="space-y-2 animate-in fade-in duration-300">
                                          {area.items.map((i: any) => (
                                              <div key={i.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-white/5 to-transparent border border-white/5 animate-in slide-in-from-left-2 zoom-in-95 duration-300 group/item hover:border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                                                  <span className="text-sm font-medium text-neutral-200 pl-1">{i.text}</span>
                                                  <button onClick={() => deleteAreaItem(area.id as any, i.id)} className="text-neutral-600 hover:text-red-500 transition-colors p-1">
                                                      <X className="w-4 h-4" />
                                                  </button>
                                              </div>
                                          ))}
                                      </div>
                                  )}
                              </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-white/5 flex-shrink-0 mt-auto bg-[#0A0A0A]/90 backdrop-blur-sm -mx-8 px-8 pb-8">
                    <Button variant="ghost" onClick={() => setStep(1)} className="text-neutral-500 hover:text-white transition-colors h-12 px-6 font-bold uppercase tracking-widest text-[10px]">Voltar</Button>
                    <Button 
                        disabled={!hasAtLeastOneItem}
                        onClick={() => setStep(3)}
                        className={`font-bold px-10 rounded-full h-12 transition-all duration-500 ${hasAtLeastOneItem ? 'bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50'}`}
                    >
                        Próximo <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="flex flex-col items-center justify-center py-8 space-y-10 animate-in fade-in zoom-in duration-500 h-full">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
                  <div className="w-32 h-32 bg-gradient-to-br from-green-900/40 to-black border border-green-500/30 rounded-full flex items-center justify-center relative z-10 shadow-2xl hover:scale-105 transition-transform duration-500">
                      <CheckCircle2 className="w-12 h-12 text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                  </div>
                </div>
                
                <div className="text-center space-y-4">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tight">Tudo pronto.<br/>Sistema ativo.</h3>
                   <p className="text-neutral-400 font-medium text-base max-w-xs mx-auto">
                      Vamos começar a execução?
                   </p>
                </div>

                <Button 
                    onClick={onComplete} 
                    className="w-full max-w-xs bg-red-600 hover:bg-red-500 text-white font-bold h-14 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                >
                    ACESSAR DASHBOARD
                </Button>
            </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020202]/95 backdrop-blur-xl flex items-center justify-center p-4">
      {/* Ambient background for the modal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 blur-[100px] rounded-full" />
      </div>

      <Card className="w-full max-w-lg bg-[#0A0A0A] border-white/10 shadow-2xl relative overflow-hidden h-[90vh] md:h-[760px] flex flex-col ring-1 ring-white/5">
        
        {/* Step Indicator */}
        <div className="px-8 pt-8 pb-6 flex justify-between items-end flex-shrink-0 bg-[#0A0A0A]">
            <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                    Passo {step} de 3
                </span>
                <div className="flex gap-1.5">
                    {[1, 2, 3].map((i) => (
                        <div 
                            key={i} 
                            className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'w-2 bg-neutral-800'}`} 
                        />
                    ))}
                </div>
            </div>
            {step === 1 && <span className="text-xs font-medium text-neutral-400">Definição do Alvo</span>}
            {step === 2 && <span className="text-xs font-medium text-neutral-400">Estrutura Base</span>}
            {step === 3 && <span className="text-xs font-medium text-neutral-400">Ativação</span>}
        </div>

        <CardContent className="flex-1 px-8 relative z-10 flex flex-col overflow-hidden">
            {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};