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

  const handleAddTip = (key: keyof typeof areaInputs, tip: string) => {
    // @ts-ignore
    if (data.areas[key].length >= 3) return;
    
    setAreaInputs(prev => ({ ...prev, [key]: tip }));
    setActiveTipPillar(null);
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
    
    return { status: 'strong', message: '✓ EXCELENTE OBJETIVO.', color: 'text-[#4adbc8]', icon: Check };
  }, [data.annual.objective]);

  const criteriaAnalysis = useMemo(() => {
    const text = data.annual.successCriteria.trim();
    const length = text.length;
    
    if (length === 0) return null;
    
    const hasNumbers = /\d/.test(text);
    if (!hasNumbers) return { status: 'medium', message: 'Dica: Inclua números ou valores (R$, kg, %).', color: 'text-blue-400', icon: Sparkles };
    
    return { status: 'strong', message: 'Critério mensurável. Ótimo.', color: 'text-[#4adbc8]', icon: Check };
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
                  style={{ filter: 'drop-shadow(0 0 20px rgba(74, 219, 200, 0.9))' }}
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
                           Sua manutenção diária. Ações obrigatórias para manter a máquina operando em alta performance. Sem negociação.
                       </p>
                   </div>
               </div>

               <div className="bg-black/60 backdrop-blur-xl border-l-[4px] border-[#4adbc8] p-6 flex flex-col gap-3 text-left hover:bg-black/80 transition-colors relative overflow-hidden group">
                   <div className="relative z-10">
                       <span className="text-[10px] text-[#4adbc8] font-bold tracking-widest uppercase">Vetor de Expansão</span>
                       <div className="h-8 flex items-center justify-start">
                           <img 
                              src="/MasterPlan.png" 
                              alt="MasterPlan" 
                              style={{ filter: 'drop-shadow(0 0 8px rgba(74, 219, 200, 0.5))' }}
                              className="h-10 w-auto object-contain object-left"
                           />
                       </div>
                       <p className="text-neutral-300 text-xs font-medium leading-relaxed max-w-xs">
                           Sua estratégia de ataque. Projetos táticos com início, meio e fim, desenhados para mover o ponteiro e mudar o seu nível de vida.
                       </p>
                   </div>
               </div>
           </div>

           <div className="w-full max-w-lg mx-auto flex flex-col gap-8 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-500 fill-mode-backwards mt-16">
               <div className="border-y border-white/20 py-6 text-center bg-black/50 backdrop-blur-md">
                   <p className="text-white font-mono text-[10px] md:text-[11px] uppercase tracking-[0.15em] leading-relaxed">
                       O QUE VOCÊ VAI CONFIGURAR AGORA NÃO É UMA LISTINHA DE TAREFAS.<br className="hidden md:block" /> É O SEU PLANO DE ATAQUE.
                   </p>
               </div>

               <div className="w-full max-w-xs mx-auto">
                 <Button 
                     onClick={() => {
                         setHasShownWelcome(true);
                         setStep(1);
                     }}
                     className="w-full h-12 bg-[#4adbc8] hover:bg-[#3bc7b6] text-black font-bold text-xs uppercase tracking-widest rounded-[8px] shadow-[0_0_25px_rgba(74,219,200,0.4)] transition-all duration-300 transform hover:-translate-y-1"
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
        <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-700 relative">
             <div className="flex-1 flex flex-col px-10 py-12 text-left overflow-y-auto custom-scrollbar">
                 <div className="mb-12 text-center flex flex-col items-center">
                     <div className="w-12 h-12 bg-[#4adbc8]/10 rounded-xl border border-[#4adbc8]/20 flex items-center justify-center mb-6">
                        <Layers className="w-6 h-6 text-[#4adbc8]" />
                     </div>
                     <h2 className="text-[32px] font-extrabold text-white uppercase tracking-tight whitespace-nowrap">
                         A CIÊNCIA POR TRÁS DA FORJA
                     </h2>
                 </div>

                 <div className="space-y-10">
                     <div className="border-l-[3px] border-[#4adbc8] pl-5 space-y-2">
                         <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.25em]">O Método</h4>
                         <p className="text-[#AAAAAA] font-light text-[13px] leading-[1.7]">
                            Adaptamos o <span className="text-white font-medium">Nenkan Mokuhyo</span> — um método japonês de planejamento milenar — para o ritmo da vida digital. Ficamos com o que importa: a <span className="text-[#4adbc8] font-medium">Cascata de Foco</span>.
                         </p>
                     </div>

                     <div className="border-l-[3px] border-[#4adbc8] pl-5 space-y-2">
                         <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.25em]">O Que Nos Diferencia</h4>
                         <p className="text-[#AAAAAA] font-light text-[13px] leading-[1.7]">
                            A maioria dos apps trata suas metas como itens de uma lista. Aqui é diferente: separamos o que te mantém no trilho (<span className="text-white font-medium">Hábitos</span>) do que vai te levar longe (<span className="text-white font-medium">Masterplan</span>).
                         </p>
                     </div>

                     <div className="bg-[#0A0A0A] rounded-xl relative overflow-hidden p-6 pl-7 mt-4">
                         <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#4adbc8]" />
                         
                         <h4 className="text-[#4adbc8] text-[10px] font-bold uppercase tracking-[0.25em] mb-4">A Regra de Ouro</h4>
                         
                         <div className="space-y-1.5 text-[13px] text-neutral-400 font-light">
                             <p><span className="text-white font-bold">O Ano</span> dita o Mês.</p>
                             <p><span className="text-white font-bold">O Mês</span> dita a Semana.</p>
                             <p>A Semana dita o <span className="text-[#4adbc8] font-bold">foco de hoje.</span></p>
                         </div>
                     </div>
                 </div>

                 <div className="mt-12 flex justify-center pb-2">
                     <Button 
                         onClick={() => setStep(2)}
                         className="w-[320px] h-14 bg-[#4adbc8] hover:bg-[#3bc7b6] text-black font-bold text-[13px] uppercase tracking-[0.15em] rounded-[10px] shadow-[0_4px_24px_rgba(74,219,200,0.25)] hover:shadow-[0_8px_32px_rgba(74,219,200,0.4)] transition-all transform hover:-translate-y-[1px]"
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
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500 px-8 pt-6">
                <div className="flex-1 overflow-y-auto px-1 -mx-1 pb-6 custom-scrollbar pr-2">
                    <div className="space-y-4 text-center mb-6 pt-2">
                         <div className="inline-flex items-center justify-center p-3 bg-[#4adbc8]/10 rounded-full border border-[#4adbc8]/20 mb-2 relative">
                            <div className="absolute inset-0 bg-[#4adbc8]/30 rounded-full animate-ping opacity-20" />
                            <Target className="w-6 h-6 text-[#4adbc8] relative z-10" />
                         </div>
                         <h2 className="text-2xl font-black text-white uppercase tracking-tight">O Alvo Único</h2>
                    </div>

                    <div className="bg-[#0D0D0D] border-l-[3px] border-l-[#4adbc8] rounded-r-xl p-5 mb-8 relative overflow-hidden group shadow-lg">
                        <div className="flex gap-4">
                            <div className="shrink-0 mt-0.5">
                                <Info className="w-5 h-5 text-[#4adbc8]" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-white font-bold text-sm uppercase tracking-wide">A Lei do Foco Extremo</h4>
                                <p className="text-neutral-300 text-sm leading-relaxed">
                                    Qual é a <span className="text-white font-bold">ÚNICA</span> coisa que, se você conquistar este ano, fará todas as outras parecerem fáceis ou irrelevantes?
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3 group relative">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-white transition-colors pl-1">Objetivo Anual</Label>
                            <Input 
                                autoFocus
                                placeholder="Ex: Faturar R$10k/mês com meu negócio digital" 
                                value={data.annual.objective}
                                onChange={(e) => updateAnnual({ objective: e.target.value })}
                                className="bg-black/60 backdrop-blur-md border-white/10 h-16 text-lg font-bold px-4 focus-visible:ring-2 focus-visible:ring-[#4adbc8] text-white"
                            />
                            <Feedback analysis={objectiveAnalysis} />
                        </div>
                        
                        <div className="space-y-3 group">
                            <div className="flex items-center gap-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-white transition-colors pl-1">COMO VOCÊ VAI SABER QUE CHEGOU LÁ?</Label>
                                <TooltipProvider>
                                    <Tooltip delayDuration={300}>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="w-3.5 h-3.5 text-neutral-500 hover:text-white cursor-help transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-black border border-white/10 text-xs text-neutral-300 max-w-[200px] p-3">
                                            <p>Defina um número ou resultado concreto. Objetivos vagos não se concretizam.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            
                            <Textarea 
                                placeholder="Ex: Receita recorrente de R$10k por 3 meses seguidos" 
                                value={data.annual.successCriteria}
                                onChange={(e) => updateAnnual({ successCriteria: e.target.value })}
                                className="bg-black/60 backdrop-blur-md border-white/10 min-h-[120px] text-base px-4 py-4 resize-none text-white focus-visible:ring-2 focus-visible:ring-[#4adbc8]"
                            />
                            <Feedback analysis={criteriaAnalysis} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-white/5 flex-shrink-0 mt-auto pb-8">
                    <Button 
                        disabled={!isAnnualValid}
                        onClick={() => setStep(3)}
                        className={`font-bold px-10 rounded-[10px] h-12 transition-all duration-300 
                            ${isAnnualValid 
                                ? 'bg-[#4adbc8] hover:bg-[#3bc7b6] text-black shadow-[0_4px_20px_rgba(74,219,200,0.3)] hover:shadow-[0_4px_25px_rgba(74,219,200,0.5)] transform hover:-translate-y-0.5' 
                                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50'
                            }`}
                    >
                        PRÓXIMO PASSO →
                    </Button>
                </div>
            </div>
        );
    }

    if (step === 3) {
        const areasConfig = [
            { id: 'work', label: 'Trabalho', icon: Briefcase, colorClass: 'text-blue-500', borderColor: 'border-blue-500', placeholder: "Escreva sua meta...", items: data.areas.work, tips: ["Conseguir aumento", "Fechar X clientes"] },
            { id: 'studies', label: 'Estudos', icon: GraduationCap, colorClass: 'text-violet-500', borderColor: 'border-violet-500', placeholder: "Escreva sua meta...", items: data.areas.studies, tips: ["Terminar curso", "Ler X livros"] },
            { id: 'health', label: 'Saúde', icon: Heart, colorClass: 'text-emerald-500', borderColor: 'border-emerald-500', placeholder: "Escreva sua meta...", items: data.areas.health, tips: ["Correr X km", "Perder X kg"] },
            { id: 'personal', label: 'Pessoal', icon: User, colorClass: 'text-amber-500', borderColor: 'border-amber-500', placeholder: "Escreva sua meta...", items: data.areas.personal, tips: ["Fazer viagem", "Hobby novo"] },
        ];

        return (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500 px-8 pt-6">
                <div className="flex-1 overflow-y-auto px-1 -mx-1 pb-6 custom-scrollbar pr-2">
                    <div className="space-y-2 text-center mb-8 pt-2">
                         <span className="text-[10px] font-bold text-[#4adbc8] uppercase tracking-[0.2em]">
                            Seus 4 Pilares
                         </span>
                         <h2 className="text-xl font-medium text-neutral-400">
                             Defina pelo menos 1 meta para cada área.
                         </h2>
                    </div>

                    <div className="space-y-4">
                        {areasConfig.map((area) => {
                          const isFull = area.items.length >= 3;
                          const hasItems = area.items.length > 0;
                          const borderStyle = hasItems ? `${area.borderColor} border-opacity-100` : `${area.borderColor} border-opacity-40 animate-pulse`;

                          return (
                            <div key={area.id} className={`p-5 rounded-2xl bg-[#0A0A0A] border-l-[2px] border-y border-r border-y-white/5 border-r-white/5 ${borderStyle} transition-all duration-500`}>
                                <div className="flex items-center justify-between mb-4">
                                    <Label className={`flex items-center gap-2 text-xs uppercase font-black tracking-widest ${area.colorClass}`}>
                                        <area.icon className="w-4 h-4" /> {area.label}
                                    </Label>
                                    {hasItems && <CheckCircle2 className={`w-4 h-4 ${area.colorClass}`} />}
                                </div>
                                
                                <div className="flex gap-3 mb-3">
                                    {!isFull ? (
                                        <>
                                            <Input 
                                                value={areaInputs[area.id as keyof typeof areaInputs]}
                                                onChange={(e) => handleAreaInputChange(area.id as keyof typeof areaInputs, e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddAreaItem(area.id as keyof typeof areaInputs)}
                                                placeholder={area.placeholder}
                                                className="bg-black/40 border-white/10 text-sm h-11 text-white focus:border-white/20" 
                                            />
                                            <Button size="icon" className="h-11 w-11 bg-white/5 hover:bg-white/10 border border-white/5 shrink-0" onClick={() => handleAddAreaItem(area.id as keyof typeof areaInputs)}>
                                                <Plus className="w-5 h-5"/>
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="w-full h-11 flex items-center justify-center bg-white/5 rounded-md border border-white/5">
                                            <span className="text-xs text-neutral-500 font-medium">Máximo de 3 metas.</span>
                                        </div>
                                    )}
                                </div>

                                {area.items.map((i: any) => (
                                    <div key={i.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 mt-2 animate-in slide-in-from-top-2">
                                        <span className="text-sm font-medium text-neutral-200">{i.text}</span>
                                        <button onClick={() => deleteAreaItem(area.id as any, i.id)} className="text-neutral-600 hover:text-[#4adbc8] transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                          );
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-4 pt-4 border-t border-white/5 flex-shrink-0 mt-auto pb-6">
                    <div className="w-full space-y-2">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                            {allPillarsFilled ? (
                                <span className="text-green-500 flex items-center gap-1.5"><Check className="w-3 h-3"/> Tudo pronto.</span>
                            ) : (
                                <span className="text-neutral-500">{filledPillarsCount} de 4 pilares preenchidos</span>
                            )}
                            <span className="text-neutral-600">{(filledPillarsCount / 4) * 100}%</span>
                        </div>
                        <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${allPillarsFilled ? 'bg-green-500' : 'bg-[#4adbc8]'}`} 
                                style={{ width: `${(filledPillarsCount / 4) * 100}%` }} 
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <Button variant="ghost" onClick={() => setStep(2)} className="text-neutral-500 hover:text-white font-medium text-xs">VOLTAR</Button>
                        <Button 
                            disabled={!allPillarsFilled}
                            onClick={() => setStep(4)}
                            className={`font-bold px-8 h-12 transition-all duration-300 
                                ${allPillarsFilled 
                                    ? 'bg-[#4adbc8] hover:bg-[#3bc7b6] text-black shadow-[0_4px_20px_rgba(74,219,200,0.3)]' 
                                    : 'bg-[#2A2A2A] text-[#555] cursor-not-allowed border border-white/5'
                                }`}
                        >
                            ATIVAR SISTEMA →
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 4) {
        return (
            <div className="flex flex-col items-center justify-center py-6 h-full overflow-hidden px-8 relative">
                <div className="relative mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full animate-in fade-in duration-1000" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', transform: 'scale(2.5)' }} />
                    <svg width="100" height="100" viewBox="0 0 100 100" className="relative z-10">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#10B981" strokeWidth="4" strokeDasharray="283" strokeDashoffset="283" className="animate-[circle-draw_0.8s_ease-out_forwards]" />
                        <path d="M30 52 L45 67 L70 35" fill="none" stroke="#10B981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100" strokeDashoffset="100" className="animate-[check-draw_0.5s_ease-out_0.6s_forwards]" />
                    </svg>
                </div>

                <div className="text-center space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-700 fill-mode-backwards">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">
                        Tudo pronto.<br/>
                        <span className="text-[#10B981]">Seu Masterplan está ativo.</span>
                    </h3>
                </div>

                <div className="mt-12 w-full max-sm animate-in slide-in-from-bottom-8 fade-in duration-700 delay-1000 fill-mode-backwards relative overflow-hidden rounded-[10px]">
                    <Button 
                        onClick={onComplete} 
                        className="w-full bg-[#4adbc8] hover:bg-[#3bc7b6] text-black font-black uppercase tracking-widest h-14 rounded-[10px] shadow-[0_0_30px_rgba(74,219,200,0.3)] transition-all relative overflow-hidden group"
                    >
                        <span className="relative z-10">ENTRAR NO CAMPO DE BATALHA</span>
                    </Button>
                </div>
            </div>
        );
    }
  };

  const cardStyles = "w-full max-w-lg bg-[#111111] border-white/10 ring-1 ring-white/10 shadow-2xl relative overflow-hidden h-[90vh] md:h-[760px] flex flex-col";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden bg-[#0A0A0A]">
      <AppBackground />
      <Card className={cardStyles}>
        {step >= 2 && step <= 3 && (
            <div className="px-8 pt-8 pb-6 flex justify-between items-end flex-shrink-0 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Passo {step - 1} de 2</span>
                    <div className="flex gap-1.5">
                        {[2, 3].map((i) => (
                            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-[#4adbc8] shadow-[0_0_10px_rgba(74,219,200,0.5)]' : 'w-2 bg-neutral-800'}`} />
                        ))}
                    </div>
                </div>
            </div>
        )}
        <CardContent className="flex-1 p-0 relative z-10 flex flex-col overflow-hidden">
            {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};