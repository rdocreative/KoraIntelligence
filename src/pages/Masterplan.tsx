import { useState, useEffect, useMemo } from "react";
import { useMasterplan, MasterplanData, TaskItem } from "@/hooks/useMasterplan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Plus, Target, Briefcase, GraduationCap, Heart, User, 
  Calendar, CheckSquare, Trash2, ArrowRight, ArrowLeft, Play,
  BookOpen, HelpCircle, Save, CheckCircle2, Trophy, Clock, Sparkles, Crown, Loader2, Zap, LayoutDashboard,
  TrendingUp, TrendingDown, Activity, BarChart3, AlertCircle, CalendarDays, Award, Check, ChevronRight, X
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

// ==========================================
// CONFIGURAÇÃO DE ESTILO (Theme Constants)
// ==========================================
const THEME = {
  bg: "bg-[#0B0B0B]",
  card: "bg-white/[0.02] backdrop-blur-sm",
  cardHover: "hover:bg-white/[0.04] transition-colors duration-500",
  border: "border-white/[0.03]", // Extremely subtle
  textMain: "text-white/90",
  textMuted: "text-white/40",
  accent: "text-red-500",
  accentGlow: "shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]",
};

// ==========================================
// COMPONENTES AUXILIARES
// ==========================================

const TaskList = ({ 
  items, onAdd, onToggle, onDelete, placeholder = "Adicionar item..." 
}: { 
  items: TaskItem[], onAdd: (text: string) => void, onToggle: (id: string) => void, onDelete?: (id: string) => void, placeholder?: string
}) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (!newItem.trim()) return;
    onAdd(newItem);
    setNewItem("");
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-4 group animate-in slide-in-from-left-2 duration-300 hover:bg-white/[0.02] p-2.5 -mx-2.5 rounded-lg transition-all">
            <div 
              onClick={() => onToggle(item.id)}
              className={`w-4 h-4 mt-1 rounded-[4px] border flex items-center justify-center cursor-pointer transition-all duration-300 ease-out active:scale-75 ${item.completed ? 'bg-red-600 border-red-600 shadow-[0_0_8px_rgba(220,38,38,0.4)]' : 'border-white/10 hover:border-red-500/50 bg-transparent'}`}
            >
              {item.completed && <CheckSquare className="w-3 h-3 text-white animate-in zoom-in duration-200" />}
            </div>
            <span className={`flex-1 text-sm font-medium transition-all duration-300 ${item.completed ? 'text-white/30 line-through' : 'text-white/80'}`}>
              {item.text}
            </span>
            {onDelete && (
              <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-500 transition-all duration-300 hover:scale-110 p-1">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="relative group">
        <Input 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="h-10 pl-3 pr-9 text-sm bg-transparent border-white/[0.05] focus:border-white/10 focus:bg-white/[0.02] transition-all duration-300 rounded-lg placeholder:text-white/20"
        />
        <Button 
            type="button"
            size="icon" 
            onClick={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="absolute right-1 top-1 h-8 w-8 p-0 bg-transparent hover:bg-white/5 text-white/30 hover:text-white transition-all duration-300 rounded-md"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// ==========================================
// PREMIUM LOADING SCREEN
// ==========================================

const LoadingScreen = ({ onFinished }: { onFinished: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [phrase, setPhrase] = useState("");

  const phrases = [
    "Sincronizando ambições...",
    "Estabelecendo foco...",
    "Carregando sistema..."
  ];

  useEffect(() => {
    setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    const duration = 1200; 
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const easeOutQuad = (t: number) => t * (2 - t);
      const rawProgress = currentStep / steps;
      setProgress(Math.min(easeOutQuad(rawProgress) * 100, 100));
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onFinished, 300);
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] ${THEME.bg} flex flex-col items-center justify-center p-8`}>
       <div className="w-full max-w-xs space-y-6 text-center">
          <div className="w-16 h-16 mx-auto bg-white/[0.03] rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl">
             <Target className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div className="space-y-4">
             <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 transition-all duration-75 ease-out" style={{ width: `${progress}%` }} />
             </div>
             <p className="text-[10px] uppercase font-bold text-white/30 tracking-[0.3em] animate-pulse">{phrase}</p>
          </div>
       </div>
    </div>
  );
};

// ==========================================
// ONBOARDING WIZARD (MANTIDO MAS ESTILIZADO)
// ==========================================

const OnboardingWizard = ({ onComplete }: { onComplete: () => void }) => {
  const { data, updateAnnual, addAreaItem, deleteAreaItem } = useMasterplan();
  const [step, setStep] = useState(0); 
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  
  const [areaInputs, setAreaInputs] = useState({ work: "", studies: "", health: "", personal: "" });

  const handleAreaInputChange = (key: keyof typeof areaInputs, value: string) => {
    setAreaInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleAddAreaItem = (key: keyof typeof areaInputs) => {
    const text = areaInputs[key];
    if (!text || !text.trim()) return;
    addAreaItem(key as any, text.trim());
    setAreaInputs(prev => ({ ...prev, [key]: "" }));
  };

  const objectiveAnalysis = useMemo(() => {
    const text = data.annual.objective.trim();
    if (text.length === 0) return null;
    if (text.length < 8) return { status: 'weak', message: 'Muito curto.', color: 'text-red-500', icon: AlertCircle };
    return { status: 'strong', message: 'Ok.', color: 'text-green-500', icon: Check };
  }, [data.annual.objective]);

  const isAnnualValid = data.annual.objective.trim().length > 5;
  const hasAtLeastOneItem = 
    data.areas.work.length > 0 || data.areas.studies.length > 0 || 
    data.areas.health.length > 0 || data.areas.personal.length > 0;

  // --- WELCOME SCREEN ---
  if (step === 0 && !hasShownWelcome) {
    return (
      <div className={`fixed inset-0 z-50 ${THEME.bg} flex items-center justify-center p-6 animate-in fade-in duration-1000`}>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        <div className="w-full max-w-xl text-center space-y-10 relative z-10 flex flex-col items-center">
           <div className="w-20 h-20 bg-white/[0.03] border border-white/5 rounded-full flex items-center justify-center shadow-2xl mb-4">
               <Target className="w-8 h-8 text-red-500" />
           </div>
           <div className="space-y-4">
               <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight">Masterplan 2.0</h1>
               <p className="text-lg text-white/40 font-light max-w-md mx-auto">Design your year. Control your life.</p>
           </div>
           <Button onClick={() => { setHasShownWelcome(true); setStep(1); }} className="h-12 px-8 bg-white text-black hover:bg-white/90 font-bold rounded-full transition-all">
                INICIAR SETUP
           </Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (step === 1) {
        return (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex-1 overflow-y-auto px-1 -mx-1 pb-6 custom-scrollbar pr-2 space-y-8">
                    <div className="text-center space-y-2 pt-4">
                         <h2 className="text-xl font-medium text-white tracking-tight">Definição do Alvo</h2>
                         <p className="text-white/40 text-sm">Qual é a única coisa que importa este ano?</p>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Objetivo Anual</Label>
                            <Input 
                                autoFocus
                                placeholder="Ex: Liberdade Financeira" 
                                value={data.annual.objective}
                                onChange={(e) => updateAnnual({ objective: e.target.value })}
                                className="bg-white/[0.03] border-white/5 h-14 text-lg px-4 focus:bg-white/[0.05] transition-all rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Critério de Sucesso</Label>
                            <Textarea 
                                placeholder="Como você saberá que venceu?" 
                                value={data.annual.successCriteria}
                                onChange={(e) => updateAnnual({ successCriteria: e.target.value })}
                                className="bg-white/[0.03] border-white/5 min-h-[100px] text-base px-4 py-4 focus:bg-white/[0.05] transition-all resize-none rounded-xl"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pt-6 border-t border-white/5 flex-shrink-0 mt-auto bg-[#0B0B0B]/95 backdrop-blur-sm -mx-8 px-8 pb-8">
                    <Button disabled={!isAnnualValid} onClick={() => setStep(2)} className="bg-white text-black hover:bg-white/90 font-bold rounded-full px-8">
                        Continuar
                    </Button>
                </div>
            </div>
        );
    }
    // Simplificando steps 2 e 3 para brevidade no código, mantendo lógica original mas estilo novo
    if (step === 2) {
         return (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex-1 overflow-y-auto px-1 -mx-1 pb-6 custom-scrollbar pr-2 space-y-6">
                     <div className="text-center space-y-2 pt-4">
                         <h2 className="text-xl font-medium text-white tracking-tight">Pilares de Vida</h2>
                         <p className="text-white/40 text-sm">Adicione metas para equilibrar o sistema.</p>
                    </div>
                    {/* ... (Lógica de áreas mantida, apenas styling atualizado) ... */}
                    <div className="grid gap-4">
                        {['work', 'studies', 'health', 'personal'].map(id => {
                            const area = {id, label: id, items: (data.areas as any)[id]}; // Simplified
                            return (
                                <div key={id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="flex gap-2 mb-3">
                                        <Input 
                                            placeholder={`Meta para ${id}...`}
                                            value={(areaInputs as any)[id]}
                                            onChange={(e) => handleAreaInputChange(id as any, e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddAreaItem(id as any)}
                                            className="bg-transparent border-white/5 h-9 text-sm"
                                        />
                                        <Button size="icon" onClick={() => handleAddAreaItem(id as any)} className="h-9 w-9 bg-white/5 hover:bg-white/10"><Plus className="w-4 h-4"/></Button>
                                    </div>
                                    <div className="space-y-1">
                                        {area.items.map((i:any) => <div key={i.id} className="text-sm text-white/70 py-1 flex justify-between">{i.text} <X className="w-3 h-3 cursor-pointer opacity-50 hover:opacity-100" onClick={() => deleteAreaItem(id as any, i.id)}/></div>)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="flex justify-between pt-6 border-t border-white/5 flex-shrink-0 mt-auto bg-[#0B0B0B]/95 backdrop-blur-sm -mx-8 px-8 pb-8">
                     <Button variant="ghost" onClick={() => setStep(1)} className="text-white/40">Voltar</Button>
                     <Button disabled={!hasAtLeastOneItem} onClick={() => setStep(3)} className="bg-white text-black hover:bg-white/90 font-bold rounded-full px-8">Finalizar</Button>
                </div>
            </div>
         )
    }
    if (step === 3) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
                <h3 className="text-2xl font-medium text-white">Sistema Pronto</h3>
                <Button onClick={onComplete} className="bg-white text-black hover:bg-white/90 font-bold rounded-full px-10 h-12">ACESSAR DASHBOARD</Button>
            </div>
        )
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${THEME.bg} flex items-center justify-center p-4`}>
      <Card className="w-full max-w-lg bg-[#121212] border-white/[0.05] shadow-2xl relative overflow-hidden h-[80vh] flex flex-col">
        <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-[#121212]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Passo {step}/3</span>
            <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-white' : 'w-2 bg-white/10'}`} />)}
            </div>
        </div>
        <CardContent className="flex-1 px-8 relative z-10 flex flex-col overflow-hidden">
            {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

// ==========================================
// DASHBOARD PRINCIPAL (REFATORADO)
// ==========================================

const MasterplanPage = () => {
  const { 
    data, completeTutorial, resetTutorial, updateAnnual, addAreaItem, toggleAreaItem, deleteAreaItem,
    addMonthGoal, toggleMonthGoal, updateMonthReview, updateMonth,
    addWeek, deleteWeek, addWeekTask, toggleWeekTask, updateWeekReview 
  } = useMasterplan();

  const [isLoading, setIsLoading] = useState(true);
  
  // Weekly State
  const [newWeekStart, setNewWeekStart] = useState("");
  const [newWeekEnd, setNewWeekEnd] = useState("");
  const [newWeekGoal, setNewWeekGoal] = useState("");

  const handleCreateWeek = () => {
    if (!newWeekStart || !newWeekEnd) return;
    addWeek({ startDate: newWeekStart, endDate: newWeekEnd, goal: newWeekGoal, reviewDate: newWeekEnd });
    setNewWeekStart(""); setNewWeekEnd(""); setNewWeekGoal("");
  };

  const currentMonthIndex = new Date().getMonth();
  const currentMonth = data.months[currentMonthIndex];
  const activeWeeks = data.weeks.filter(w => new Date(w.endDate) >= new Date());

  if (isLoading) return <LoadingScreen onFinished={() => setIsLoading(false)} />;
  if (!data.isTutorialCompleted) return <OnboardingWizard onComplete={completeTutorial} />;

  return (
    <div className={`min-h-screen ${THEME.bg} text-white selection:bg-red-500/20 selection:text-white pb-20`}>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[120px]" />
          <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-white/[0.01] to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-12 space-y-12">
        
        {/* 1) BLOCO DE OBJETIVO (HEADER) - NOVO DESIGN */}
        <div className="relative group rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.03] transition-all duration-700 hover:bg-white/[0.03]">
           {/* Glow Effect on Hover */}
           <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           
           <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-8 md:items-end justify-between">
              <div className="space-y-4 max-w-2xl">
                 <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-red-500/10 border border-red-500/20">
                        <Target className="w-3.5 h-3.5 text-red-500" />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.25em] text-white/30 uppercase">Objetivo Principal do Ano</span>
                 </div>
                 
                 <div>
                    <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tight leading-snug">
                       {data.annual.objective || "Definir Objetivo"}
                    </h1>
                    <p className="mt-2 text-white/50 text-sm font-light leading-relaxed max-w-lg border-l-2 border-white/5 pl-3">
                       {data.annual.successCriteria || "Estabeleça seu critério de sucesso para manter o foco."}
                    </p>
                 </div>
              </div>

              {/* Annual Progress Widget */}
              <div className="w-full md:w-64 space-y-3 flex-shrink-0 bg-white/[0.01] p-4 rounded-2xl border border-white/[0.02]">
                  <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Progresso Anual</span>
                      <span className="text-sm font-medium text-white">{data.annual.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.3)] transition-all duration-1000" style={{ width: `${data.annual.progress}%` }} />
                  </div>
                  <Button variant="ghost" onClick={resetTutorial} size="sm" className="w-full h-7 text-[9px] uppercase tracking-widest text-white/20 hover:text-white hover:bg-white/5 rounded-lg mt-1">
                      Ajustar Plano
                  </Button>
              </div>
           </div>
        </div>

        {/* 2) NAVEGAÇÃO & CONTEÚDO */}
        <Tabs defaultValue="overview" className="w-full space-y-10">
          
          <TabsList className="w-full flex justify-start bg-transparent p-0 gap-6 border-b border-white/[0.05] pb-px">
            {['Overview', 'Weekly', 'Monthly', 'Annual'].map((tab) => (
                <TabsTrigger 
                    key={tab} 
                    value={tab.toLowerCase()} 
                    className="relative h-10 px-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white text-white/30 hover:text-white/60 transition-colors rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 font-medium text-sm tracking-wide"
                >
                    {tab === 'Weekly' ? 'Foco Semanal' : tab === 'Monthly' ? 'Planejamento Mensal' : tab === 'Overview' ? 'Visão Geral' : 'Análise Anual'}
                </TabsTrigger>
            ))}
          </TabsList>

          {/* VISÃO GERAL */}
          <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="grid lg:grid-cols-3 gap-6">
                {/* Active Focus Card */}
                <div className={`lg:col-span-2 ${THEME.card} ${THEME.border} border rounded-3xl p-8 relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity scale-150">
                        <Target className="w-40 h-40" />
                    </div>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-2">
                             <span className="flex h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></span>
                             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/80">Foco Atual</span>
                        </div>
                        
                        {activeWeeks.length > 0 ? (
                            <div className="space-y-6">
                                <h3 className="text-2xl md:text-3xl font-medium text-white tracking-tight">"{activeWeeks[0].goal}"</h3>
                                <div className="flex gap-8">
                                    <div className="space-y-1">
                                        <div className="text-2xl font-light text-white">{Math.round((activeWeeks[0].tasks.filter(t => t.completed).length / (activeWeeks[0].tasks.length || 1)) * 100)}%</div>
                                        <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Execução</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-2xl font-light text-white">{activeWeeks[0].tasks.filter(t => t.completed).length} <span className="text-sm text-white/30">/ {activeWeeks[0].tasks.length}</span></div>
                                        <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Tarefas</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-4">
                                <p className="text-white/40 mb-4 font-light">Nenhum ciclo de foco ativo no momento.</p>
                                <Button onClick={() => document.querySelector('[data-value="weekly"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))} variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/5">Criar Sprint</Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Current Month Mini */}
                <div className={`${THEME.card} ${THEME.border} border rounded-3xl p-8 flex flex-col justify-between`}>
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Mês Atual</span>
                        <h3 className="text-2xl font-medium text-white tracking-tight">{currentMonth.name}</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-light text-white">{currentMonth.goals.filter(g => g.completed).length}</span>
                            <span className="text-sm text-white/40">/ {currentMonth.goals.length} Metas</span>
                        </div>
                        <Progress value={(currentMonth.goals.filter(g => g.completed).length / (currentMonth.goals.length || 1)) * 100} className="h-1 bg-white/5" indicatorClassName="bg-white" />
                    </div>
                </div>
             </div>

             {/* Areas Quick View */}
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 {[
                     { title: "Trabalho", items: data.areas.work, icon: Briefcase },
                     { title: "Estudos", items: data.areas.studies, icon: GraduationCap },
                     { title: "Saúde", items: data.areas.health, icon: Heart },
                     { title: "Pessoal", items: data.areas.personal, icon: User },
                 ].map((area, i) => (
                     <div key={i} className={`${THEME.card} ${THEME.border} border rounded-2xl p-6 hover:bg-white/[0.04] transition-colors group cursor-default`}>
                         <div className="flex flex-col items-center text-center gap-3">
                             <area.icon className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
                             <div>
                                 <span className="block text-xs font-bold uppercase tracking-widest text-white/70">{area.title}</span>
                                 <span className="text-[10px] text-white/30 mt-1 block">{area.items.filter(i => i.completed).length}/{area.items.length} Concluídos</span>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
          </TabsContent>

          {/* SPRINT SEMANAL */}
          <TabsContent value="weekly" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
             {/* New Sprint Form */}
             <div className={`${THEME.card} border ${THEME.border} rounded-3xl p-8`}>
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-1.5 bg-white/5 rounded-lg"><Zap className="w-4 h-4 text-white/70" /></div>
                    <h3 className="text-lg font-medium text-white tracking-tight">Nova Sprint</h3>
                 </div>
                 <div className="flex flex-col xl:flex-row gap-6 items-end">
                    <div className="w-full space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30 pl-1">Objetivo da Semana</Label>
                        <Input 
                            value={newWeekGoal} onChange={(e) => setNewWeekGoal(e.target.value)}
                            placeholder="Defina um foco claro..." 
                            className="bg-black/20 border-white/5 h-12 focus:border-white/10 focus:bg-black/40 transition-all rounded-xl"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full xl:w-auto">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30 pl-1">Início</Label>
                            <Input type="date" value={newWeekStart} onChange={(e) => setNewWeekStart(e.target.value)} className="bg-black/20 border-white/5 h-12 rounded-xl text-sm" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30 pl-1">Fim</Label>
                            <Input type="date" value={newWeekEnd} onChange={(e) => setNewWeekEnd(e.target.value)} className="bg-black/20 border-white/5 h-12 rounded-xl text-sm" />
                        </div>
                    </div>
                    <Button onClick={handleCreateWeek} className="h-12 px-8 bg-white text-black hover:bg-white/90 font-bold rounded-xl w-full xl:w-auto">CRIAR</Button>
                 </div>
             </div>

             {/* Active Sprints */}
             <div className="space-y-6">
                {data.weeks.map((week) => (
                    <div key={week.id} className={`${THEME.card} border ${THEME.border} rounded-3xl p-8 space-y-8 relative overflow-hidden`}>
                        <div className="flex justify-between items-start">
                             <div className="space-y-2">
                                 <div className="flex items-center gap-3">
                                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/70">Sprint Ativa</span>
                                     <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                     <span className="text-[10px] font-medium text-white/30">{new Date(week.startDate).toLocaleDateString()} - {new Date(week.endDate).toLocaleDateString()}</span>
                                 </div>
                                 <h3 className="text-2xl font-medium text-white">{week.goal}</h3>
                             </div>
                             <button onClick={() => deleteWeek(week.id)} className="text-white/20 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        
                        <div className="grid lg:grid-cols-2 gap-12 pt-4">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Plano de Ação</Label>
                                <TaskList items={week.tasks} onAdd={(t) => addWeekTask(week.id, t)} onToggle={(id) => toggleWeekTask(week.id, id)} />
                            </div>
                            <div className="space-y-4 lg:border-l border-white/5 lg:pl-12">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Review Rápido</Label>
                                <div className="grid gap-3">
                                    <Textarea placeholder="O que funcionou?" value={week.review.worked} onChange={(e) => updateWeekReview(week.id, 'worked', e.target.value)} className="bg-black/20 border-white/5 rounded-xl min-h-[60px] text-sm resize-none" />
                                    <Textarea placeholder="O que melhorar?" value={week.review.improve} onChange={(e) => updateWeekReview(week.id, 'improve', e.target.value)} className="bg-black/20 border-white/5 rounded-xl min-h-[60px] text-sm resize-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </TabsContent>

          {/* MENSAL */}
          <TabsContent value="monthly" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="grid gap-4">
               {data.months.map((month, index) => {
                 const isCurrent = index === currentMonthIndex;
                 return (
                  <Accordion type="single" collapsible key={month.id}>
                    <AccordionItem value="item-1" className={`border ${isCurrent ? 'border-red-500/20 bg-red-500/[0.02]' : 'border-white/[0.03] bg-white/[0.01]'} rounded-2xl px-2 transition-all`}>
                      <AccordionTrigger className="hover:no-underline py-6 px-4">
                        <div className="flex items-center gap-6 w-full">
                          <span className={`text-xl font-medium ${isCurrent ? 'text-white' : 'text-white/40'}`}>{month.name}</span>
                          {isCurrent && <span className="text-[9px] font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded uppercase tracking-wider">Atual</span>}
                          <div className="flex-1" />
                          <span className="text-xs text-white/30 font-medium mr-4">{month.goals.filter(g => g.completed).length}/{month.goals.length} Metas</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 px-4">
                         <div className="grid lg:grid-cols-2 gap-12 pt-2">
                             <div className="space-y-4">
                                 <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Metas Prioritárias</Label>
                                 <TaskList items={month.goals} onAdd={(t) => addMonthGoal(index, t)} onToggle={(id) => toggleMonthGoal(index, id)} />
                             </div>
                             <div className="space-y-4">
                                 <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Notas</Label>
                                 <Textarea value={month.notes} onChange={(e) => updateMonth(index, { notes: e.target.value })} className="bg-black/20 border-white/5 rounded-xl h-[150px] resize-none text-white/70" placeholder="Anotações do mês..." />
                             </div>
                         </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                 );
               })}
             </div>
          </TabsContent>

          {/* ANUAL (DASHBOARD) */}
          <TabsContent value="annual" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="grid md:grid-cols-2 gap-8">
                 <div className={`${THEME.card} border ${THEME.border} rounded-3xl p-8 space-y-6`}>
                     <h3 className="text-lg font-medium text-white tracking-tight">Editar Objetivo</h3>
                     <div className="space-y-4">
                         <div className="space-y-2">
                             <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Título</Label>
                             <Input value={data.annual.objective} onChange={(e) => updateAnnual({ objective: e.target.value })} className="bg-black/20 border-white/5 rounded-xl h-12" />
                         </div>
                         <div className="space-y-2">
                             <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Critério de Sucesso</Label>
                             <Textarea value={data.annual.successCriteria} onChange={(e) => updateAnnual({ successCriteria: e.target.value })} className="bg-black/20 border-white/5 rounded-xl min-h-[100px] resize-none" />
                         </div>
                     </div>
                 </div>

                 <div className={`${THEME.card} border ${THEME.border} rounded-3xl p-8 space-y-6`}>
                     <h3 className="text-lg font-medium text-white tracking-tight">Progresso Manual</h3>
                     <div className="space-y-8 py-4">
                         <div className="flex justify-between items-end">
                             <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Ajuste Fino</Label>
                             <span className="text-3xl font-light text-white">{data.annual.progress}%</span>
                         </div>
                         <Slider value={[data.annual.progress]} onValueChange={(vals) => updateAnnual({ progress: vals[0] })} max={100} step={1} className="cursor-pointer" />
                         <p className="text-xs text-white/30">O progresso anual é calculado manualmente para manter você no controle da percepção de avanço.</p>
                     </div>
                 </div>
             </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default MasterplanPage;