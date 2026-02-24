"use client";

import { useState, useMemo } from "react";
import { useMasterplan } from "@/hooks/useMasterplan";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Target, CheckCircle2, Briefcase, GraduationCap, Heart, User, 
  Plus, X, AlertCircle, Sparkles, Check, Info, Layers, HelpCircle, Lock, Lightbulb
} from "lucide-react";

export const OnboardingWizard = ({ onComplete }: { onComplete: () => void }) => {
  const { data, updateAnnual, addAreaItem, deleteAreaItem } = useMasterplan();
  const [step, setStep] = useState(0); 
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [activeTipPillar, setActiveTipPillar] = useState<string | null>(null);
  
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
    
    // @ts-ignore
    if (data.areas[key].length >= 3) return;

    addAreaItem(key as any, text.trim());
    setAreaInputs(prev => ({ ...prev, [key]: "" }));
  };

  const objectiveAnalysis = useMemo(() => {
    const text = data.annual.objective.trim();
    const length = text.length;
    
    if (length === 0) return null;
    if (length < 8) return { status: 'weak', message: 'Muito curto. Seja mais específico.', color: 'text-red-500', icon: AlertCircle };
    
    return { status: 'strong', message: '✓ EXCELENTE OBJETIVO.', color: 'text-primary', icon: Check };
  }, [data.annual.objective]);

  const criteriaAnalysis = useMemo(() => {
    const text = data.annual.successCriteria.trim();
    const length = text.length;
    
    if (length === 0) return null;
    
    const hasNumbers = /\d/.test(text);
    if (!hasNumbers) return { status: 'medium', message: 'Dica: Inclua números ou valores (R$, kg, %).', color: 'text-blue-400', icon: Sparkles };
    
    return { status: 'strong', message: 'Critério mensurável. Ótimo.', color: 'text-primary', icon: Check };
  }, [data.annual.successCriteria]);
  
  const isAnnualValid = 
    data.annual.objective.trim().length > 5 && 
    data.annual.successCriteria.trim().length > 5;
  
  const filledPillarsCount = [
    data.areas.work.length > 0,
    data.areas.studies.length > 0,
    data.areas.health.length > 0,
    data.areas.personal.length > 0
  ].filter(Boolean).length;

  const allPillarsFilled = filledPillarsCount === 4;

  const Feedback = ({ analysis }: { analysis: any }) => {
    if (!analysis) return null;
    const Icon = analysis.icon;
    return (
        <div className={`flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider mt-2 animate-in slide-in-from-left-2 ${analysis.color}`}>
            <Icon className="w-3 h-3" /> {analysis.message}
        </div>
    );
  };

  const AppBackground = () => (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 bg-[#0A0A0A]"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.85), rgba(10, 10, 10, 0.9)), url('/Background-MasterPlan.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    />
  );

  if (step === 0 && !hasShownWelcome) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden">
        <AppBackground />
        
        <div className="w-full max-w-4xl space-y-12 relative z-10 flex flex-col items-center">
           <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
               <span className="text-[12px] tracking-[0.4em] text-white/80 uppercase font-bold mb-[-2rem] relative z-0">
                  Bem-vindo ao
               </span>
               <img 
                  src="/MasterPlan.png" 
                  alt="MasterPlan Logo" 
                  style={{ filter: 'drop-shadow(0 0 20px var(--accent-color))' }}
                  className="h-32 md:h-40 w-auto object-contain relative z-10" 
               />
               <span className="text-[10px] tracking-[0.6em] text-white/60 mt-6 uppercase font-medium">Sistema Ativo</span>
           </div>

           <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200 fill-mode-backwards px-4 md:px-0 items-stretch">
               <div className="bg-black/60 backdrop-blur-xl border-l-[4px] border-neutral-600 p-6 flex flex-col gap-3 text-left hover:bg-black/80 transition-colors relative overflow-hidden group">
                   <div className="relative z-10">
                       <span className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase">Protocolo de Base</span>
                       <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Hábitos</h2>
                       <p className="text-neutral-300 text-xs font-medium leading-relaxed max-w-xs">
                           Sua manutenção diária. Sem negociação.
                       </p>
                   </div>
               </div>

               <div className="bg-black/60 backdrop-blur-xl border-l-[4px] border-primary p-6 flex flex-col gap-3 text-left hover:bg-black/80 transition-colors relative overflow-hidden group">
                   <div className="relative z-10">
                       <span className="text-[10px] text-primary font-bold tracking-widest uppercase">Vetor de Expansão</span>
                       <div className="h-8 flex items-center justify-start">
                           <img 
                              src="/MasterPlan.png" 
                              alt="MasterPlan" 
                              style={{ filter: 'drop-shadow(0 0 8px var(--accent-color))' }}
                              className="h-10 w-auto object-contain object-left"
                           />
                       </div>
                       <p className="text-neutral-300 text-xs font-medium leading-relaxed max-w-xs">
                           Sua estratégia de ataque. Projetos táticos desenhados para mover o ponteiro.
                       </p>
                   </div>
               </div>
           </div>

           <div className="w-full max-w-xs mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700 delay-500 fill-mode-backwards mt-16">
             <Button 
                 onClick={() => {
                     setHasShownWelcome(true);
                     setStep(1);
                 }}
                 className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-widest rounded-[8px] shadow-[0_0_25px_var(--accent-color)] transition-all duration-300 transform hover:-translate-y-1"
             >
                 ATIVAR PROTOCOLO
             </Button>
           </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (step === 1) {
      return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-700 relative">
             <div className="flex-1 flex flex-col px-10 py-12 text-left overflow-y-auto custom-scrollbar">
                 <div className="mb-12 text-center flex flex-col items-center">
                     <div className="w-12 h-12 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center mb-6">
                        <Layers className="w-6 h-6 text-primary" />
                     </div>
                     <h2 className="text-[32px] font-extrabold text-white uppercase tracking-tight whitespace-nowrap">
                         A CIÊNCIA POR TRÁS DA FORJA
                     </h2>
                 </div>

                 <div className="space-y-10">
                     <div className="border-l-[3px] border-primary pl-5 space-y-2">
                         <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.25em]">O Método</h4>
                         <p className="text-[#AAAAAA] font-light text-[13px] leading-[1.7]">
                            Adaptamos o <span className="text-white font-medium">Nenkan Mokuhyo</span> para a <span className="text-primary font-medium">Cascata de Foco</span>.
                         </p>
                     </div>

                     <div className="bg-[#0A0A0A] rounded-xl relative overflow-hidden p-6 pl-7 mt-4">
                         <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary" />
                         <h4 className="text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-4">A Regra de Ouro</h4>
                         <div className="space-y-1.5 text-[13px] text-neutral-400 font-light">
                             <p><span className="text-white font-bold">O Ano</span> dita o Mês.</p>
                             <p><span className="text-white font-bold">O Mês</span> dita a Semana.</p>
                             <p>A Semana dita o <span className="text-primary font-bold">foco de hoje.</span></p>
                         </div>
                     </div>
                 </div>

                 <div className="mt-12 flex justify-center pb-2">
                     <Button 
                         onClick={() => setStep(2)}
                         className="w-[320px] h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[13px] uppercase tracking-[0.15em] rounded-[10px] shadow-[0_4px_24px_var(--accent-color)] transition-all transform hover:-translate-y-[1px]"
                     >
                         Começar Agora →
                     </Button>
                 </div>
             </div>
        </div>
      );
    }

    if (step === 2) {
        return (
            <div className="flex flex-col h-full px-8 pt-6">
                <div className="flex-1 overflow-y-auto px-1">
                    <div className="space-y-4 text-center mb-6 pt-2">
                         <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full border border-primary/20 mb-2">
                            <Target className="w-6 h-6 text-primary" />
                         </div>
                         <h2 className="text-2xl font-black text-white uppercase tracking-tight">O Alvo Único</h2>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3 group relative">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Objetivo Anual</Label>
                            <Input 
                                autoFocus
                                value={data.annual.objective}
                                onChange={(e) => updateAnnual({ objective: e.target.value })}
                                className="bg-black/60 border-white/10 h-16 text-lg font-bold px-4 focus-visible:ring-2 focus-visible:ring-primary text-white"
                            />
                            <Feedback analysis={objectiveAnalysis} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 mt-auto pb-8">
                    <Button 
                        disabled={!isAnnualValid}
                        onClick={() => setStep(3)}
                        className={`font-bold px-10 rounded-[10px] h-12 transition-all duration-300 ${isAnnualValid ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_4px_20px_var(--accent-color)]' : 'bg-neutral-800 text-neutral-500'}`}
                    >
                        PRÓXIMO PASSO →
                    </Button>
                </div>
            </div>
        );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden bg-[#0A0A0A]">
      <AppBackground />
      <Card className="w-full max-w-lg bg-[#111111] border-white/10 shadow-2xl h-[90vh] md:h-[760px] flex flex-col">
        {step >= 2 && (
            <div className="px-8 pt-8 pb-6 flex justify-between items-end flex-shrink-0">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Passo {step - 1} de 2</span>
                    <div className="flex gap-1.5">
                        {[2, 3].map((i) => (
                            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-primary shadow-[0_0_10px_var(--accent-color)]' : 'w-2 bg-neutral-800'}`} />
                        ))}
                    </div>
                </div>
            </div>
        )}
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
            {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};