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
  TrendingUp, TrendingDown, Activity, BarChart3, AlertCircle, CalendarDays, Award
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

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
    <div className="space-y-4">
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-4 group animate-in slide-in-from-left-2 duration-300 hover:bg-white/5 p-3 -mx-3 rounded-xl transition-all border border-transparent hover:border-white/5">
            <div 
              onClick={() => onToggle(item.id)}
              className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center cursor-pointer transition-all duration-300 ease-out active:scale-75 shadow-sm ${item.completed ? 'bg-red-600 border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.4)]' : 'border-neutral-700 hover:border-red-500 hover:scale-110 bg-neutral-900'}`}
            >
              {item.completed && <CheckSquare className="w-3.5 h-3.5 text-white animate-in zoom-in duration-300" />}
            </div>
            <span className={`flex-1 text-sm font-medium transition-all duration-300 ${item.completed ? 'text-neutral-600 line-through' : 'text-neutral-200'}`}>
              {item.text}
            </span>
            {onDelete && (
              <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-500 transition-all duration-300 hover:scale-110 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="relative group">
        <Input 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={placeholder}
          className="h-11 pl-4 pr-10 text-sm bg-black/40 border-white/10 focus:border-red-500/50 transition-all duration-300 focus:ring-1 focus:ring-red-500/20 rounded-xl placeholder:text-neutral-600"
        />
        <Button 
            size="sm" 
            onClick={handleAdd} 
            className="absolute right-1 top-1 h-9 w-9 p-0 bg-neutral-800 hover:bg-red-600 text-neutral-400 hover:text-white transition-all duration-300 rounded-lg"
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
    "Parabéns. Sua nova fase começa agora.",
    "Você acabou de ativar o melhor método para mudar sua vida.",
    "Preparando seu novo sistema de foco.",
    "Construindo sua melhor versão...",
    "Seu plano está sendo ativado.",
    "Bem-vindo ao controle total."
  ];

  useEffect(() => {
    setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);

    const duration = 1800; 
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const easeOutQuad = (t: number) => t * (2 - t);
      const rawProgress = currentStep / steps;
      const easedProgress = easeOutQuad(rawProgress) * 100;
      
      setProgress(Math.min(easedProgress, 100));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onFinished, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none animate-pulse duration-[3000ms]" />
       
       <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-10">
          <div className="relative group">
             <div className="w-20 h-20 bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl rotate-45 transform transition-transform duration-1000 ease-out scale-100 group-hover:border-red-500/30">
                <Crown className="w-8 h-8 text-red-600 -rotate-45 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
             </div>
             <div className="absolute inset-0 bg-red-600/10 blur-2xl rounded-full -z-10" />
          </div>

          <div className="w-full space-y-8 text-center">
             <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug animate-in slide-in-from-bottom-2 fade-in duration-700 max-w-[280px] mx-auto">
                {phrase}
             </h2>
             
             <div className="space-y-3">
                <div className="h-1.5 w-full bg-neutral-900/50 rounded-full overflow-hidden border border-white/5">
                   <div 
                      className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 transition-all duration-75 ease-out rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)]"
                      style={{ width: `${progress}%` }}
                   />
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-neutral-500 tracking-[0.2em]">
                   <span>Inicializando</span>
                   <span className="text-red-500">{Math.round(progress)}%</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

// ==========================================
// WIZARD / TUTORIAL STEP-BY-STEP
// ==========================================

const OnboardingWizard = ({ onComplete }: { onComplete: () => void }) => {
  const { data, updateAnnual, addAreaItem } = useMasterplan();
  const [step, setStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  
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
    
    // Chamada direta para o hook
    addAreaItem(key as any, text.trim());
    
    // Limpa o input específico
    setAreaInputs(prev => ({ ...prev, [key]: "" }));
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center p-4 animate-in fade-in duration-1000">
        <div className="w-full max-w-lg text-center space-y-10 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
           
           <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="w-24 h-24 bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:shadow-red-900/20 group">
                  <Crown className="w-10 h-10 text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
              </div>

              <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic animate-in slide-in-from-bottom-2 fade-in duration-700">
                    Masterplan
                  </h1>
                  <p className="text-lg text-neutral-400 font-medium max-w-sm mx-auto leading-relaxed animate-in slide-in-from-bottom-3 fade-in duration-1000 delay-150">
                    Sua vida, organizada no <span className="text-red-500 font-bold">melhor método</span> do mundo.
                  </p>
              </div>

              <div className="space-y-4 w-full max-w-xs mx-auto animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-300">
                <Button 
                    onClick={() => setShowIntro(false)}
                    className="w-full bg-white hover:bg-neutral-200 text-black font-black text-base h-14 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                >
                    INICIAR CONFIGURAÇÃO <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <button onClick={onComplete} className="text-[10px] text-neutral-600 hover:text-white uppercase font-bold tracking-[0.2em] transition-colors duration-300">
                    Pular Introdução
                </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  const steps = [
    {
      title: "Método Nenkan Mokuhyō",
      subtitle: "Simplifique o impossível.",
      content: (
        <div className="space-y-6">
          <p className="text-neutral-300 text-center text-lg leading-relaxed">
            Um sistema japonês que transforma grandes sonhos em passos executáveis.
          </p>
          <div className="grid gap-4 my-6">
            <div className="flex items-center gap-5 bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all duration-300 hover:translate-x-1">
                <div className="p-3 bg-red-500/10 rounded-xl"><Target className="text-red-500 w-6 h-6" /></div>
                <div className="text-left">
                  <span className="block text-base font-bold text-white">1. Foco Absoluto</span>
                  <span className="text-xs text-neutral-500 uppercase tracking-wide">Um grande objetivo.</span>
                </div>
            </div>
            <div className="flex items-center gap-5 bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:translate-x-1">
                <div className="p-3 bg-blue-500/10 rounded-xl"><Calendar className="text-blue-500 w-6 h-6" /></div>
                <div className="text-left">
                  <span className="block text-base font-bold text-white">2. Ritmo Semanal</span>
                  <span className="text-xs text-neutral-500 uppercase tracking-wide">Planeje o ano, viva a semana.</span>
                </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "O Alvo Único",
      subtitle: "Seu foco principal para o ano.",
      content: (
        <div className="space-y-6">
          <div className="bg-red-950/20 border border-red-500/20 p-5 rounded-2xl space-y-4">
            <h4 className="text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3 animate-pulse" /> Exemplos
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-neutral-300"><strong className="text-white">Financeiro:</strong> "Faturar R$ 100k"</p>
              <p className="text-sm text-neutral-300"><strong className="text-white">Saúde:</strong> "Correr uma maratona"</p>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Objetivo Anual</Label>
                <Input 
                    placeholder="Sua missão principal..." 
                    value={data.annual.objective}
                    onChange={(e) => updateAnnual({ objective: e.target.value })}
                    className="bg-black/40 border-white/10 h-14 text-lg font-bold focus-visible:ring-red-500 transition-all duration-300"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Critério de Sucesso</Label>
                <Textarea 
                    placeholder="Como você saberá que venceu?" 
                    value={data.annual.successCriteria}
                    onChange={(e) => updateAnnual({ successCriteria: e.target.value })}
                    className="bg-black/40 border-white/10 focus-visible:ring-red-500 min-h-[100px] text-base transition-all duration-300"
                />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Os 4 Pilares",
      subtitle: "Equilíbrio é a chave da consistência.",
      content: (
        <div className="space-y-6">
          <div className="grid gap-4">
            {[
                {
                  id: 'work',
                  label: 'Trabalho & Dinheiro',
                  icon: Briefcase,
                  color: 'text-blue-500',
                  ring: 'focus:ring-blue-500/50',
                  items: data.areas.work,
                  placeholder: "Ex: Faturar R$ 10k/mês"
                },
                {
                  id: 'studies',
                  label: 'Estudos',
                  icon: GraduationCap,
                  color: 'text-purple-500',
                  ring: 'focus:ring-purple-500/50',
                  items: data.areas.studies,
                  placeholder: "Ex: Ler 1 livro por mês"
                },
                {
                  id: 'health',
                  label: 'Saúde',
                  icon: Heart,
                  color: 'text-red-500',
                  ring: 'focus:ring-red-500/50',
                  items: data.areas.health,
                  placeholder: "Ex: Treinar 4x por semana"
                },
                {
                  id: 'personal',
                  label: 'Pessoal',
                  icon: User,
                  color: 'text-yellow-500',
                  ring: 'focus:ring-yellow-500/50',
                  items: data.areas.personal,
                  placeholder: "Ex: Viajar com a família"
                },
            ].map((area) => (
                <div key={area.id} className="space-y-2">
                    <Label className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest ${area.color}`}>
                        <area.icon className="w-3 h-3" /> {area.label}
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            value={areaInputs[area.id as keyof typeof areaInputs]}
                            onChange={(e) => handleAreaInputChange(area.id as any, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAddAreaItem(area.id as any);
                                }
                            }}
                            placeholder={area.placeholder}
                            className={`bg-black/40 border-white/10 text-sm h-10 transition-all focus:ring-1 ${area.ring}`}
                        />
                        <Button
                            type="button"
                            size="icon"
                            className="h-10 w-10 bg-white/5 hover:bg-white/10 border border-white/5 shrink-0 transition-transform active:scale-90"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddAreaItem(area.id as any);
                            }}
                        >
                            <Plus className="w-4 h-4"/>
                        </Button>
                    </div>
                    {area.items && area.items.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {area.items.map((i: any) => (
                                <span key={i.id} className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5 text-neutral-400 animate-in zoom-in duration-200">
                                    {i.text}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Tudo Pronto",
      subtitle: "Seu sistema está ativo.",
      content: (
        <div className="flex flex-col items-center justify-center py-8 space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="w-24 h-24 bg-gradient-to-br from-green-900/40 to-black border border-green-500/30 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
             <h3 className="text-xl font-bold text-white">Vamos começar a execução?</h3>
             <p className="text-neutral-400 text-sm max-w-xs mx-auto">
                Lembre-se: O plano não é nada sem a ação diária. Fique focado.
             </p>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-50 bg-[#020202] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-[#0A0A0A] border-white/10 shadow-2xl relative overflow-hidden transition-all duration-500 h-[600px] flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-neutral-900">
            <div className="h-full bg-red-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>

        <CardHeader className="text-center pt-10 pb-2">
          <CardTitle className="text-3xl font-black text-white uppercase tracking-tight">{currentStep.title}</CardTitle>
          <CardDescription className="text-base font-medium text-neutral-500">{currentStep.subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar px-8 py-4">
            <div key={step} className="animate-in fade-in slide-in-from-right-8 duration-500 ease-out w-full">
                {currentStep.content}
            </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-white/5 p-8 bg-black/20">
            <Button 
                variant="ghost" 
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className="text-neutral-500 hover:text-white hover:bg-white/5"
            >
                Voltar
            </Button>

            {step < steps.length - 1 ? (
                <Button 
                    onClick={() => setStep(s => s + 1)} 
                    className="bg-white text-black hover:bg-neutral-200 font-bold px-8 rounded-full"
                >
                    Próximo
                </Button>
            ) : (
                <Button 
                    onClick={onComplete} 
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all"
                >
                    ACESSAR DASHBOARD
                </Button>
            )}
        </CardFooter>
      </Card>
    </div>
  );
};

// ==========================================
// DASHBOARD PRINCIPAL
// ==========================================

const MasterplanPage = () => {
  const { 
    data, completeTutorial, resetTutorial, updateAnnual, addAreaItem, toggleAreaItem, deleteAreaItem,
    addMonthGoal, toggleMonthGoal, updateMonthReview, updateMonth,
    addWeek, deleteWeek, addWeekTask, toggleWeekTask, updateWeekReview 
  } = useMasterplan();

  const [isLoading, setIsLoading] = useState(true);
  const [newWeekStart, setNewWeekStart] = useState("");
  const [newWeekEnd, setNewWeekEnd] = useState("");
  const [newWeekGoal, setNewWeekGoal] = useState("");

  const handleCreateWeek = () => {
    if (!newWeekStart || !newWeekEnd) return;
    const reviewDate = newWeekEnd; 
    addWeek({
      startDate: newWeekStart,
      endDate: newWeekEnd,
      goal: newWeekGoal,
      reviewDate: reviewDate
    });
    setNewWeekStart("");
    setNewWeekEnd("");
    setNewWeekGoal("");
  };

  // ==========================================
  // CÁLCULOS ANALÍTICOS (DASHBOARD)
  // ==========================================
  const analytics = useMemo(() => {
    // Dias e Progresso Temporal
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const yearProgress = (dayOfYear / 365) * 100;

    // Status do Ano
    let yearStatus = "No Ritmo";
    let statusColor = "text-yellow-500";
    let statusMessage = "Continue consistente.";
    
    if (data.annual.progress < yearProgress - 10) {
        yearStatus = "Atenção Necessária";
        statusColor = "text-red-500";
        statusMessage = "Acelere o ritmo para alcançar a meta.";
    } else if (data.annual.progress > yearProgress + 5) {
        yearStatus = "Excelente";
        statusColor = "text-green-500";
        statusMessage = "Você está superando as expectativas.";
    }

    // Performance das Áreas
    const calculateAreaStats = (items: TaskItem[]) => {
        const total = items.length;
        const completed = items.filter(i => i.completed).length;
        const percentage = total === 0 ? 0 : (completed / total) * 100;
        return { total, completed, percentage };
    };

    const areaStats = [
        { id: 'work', label: 'Trabalho', ...calculateAreaStats(data.areas.work), color: 'text-blue-500', barColor: 'bg-blue-500' },
        { id: 'studies', label: 'Estudos', ...calculateAreaStats(data.areas.studies), color: 'text-purple-500', barColor: 'bg-purple-500' },
        { id: 'health', label: 'Saúde', ...calculateAreaStats(data.areas.health), color: 'text-red-500', barColor: 'bg-red-500' },
        { id: 'personal', label: 'Pessoal', ...calculateAreaStats(data.areas.personal), color: 'text-yellow-500', barColor: 'bg-yellow-500' },
    ];

    const strongestArea = [...areaStats].sort((a, b) => b.percentage - a.percentage)[0];
    const weakestArea = [...areaStats].sort((a, b) => a.percentage - b.percentage)[0];

    // KPIs Gerais
    const totalTasks = areaStats.reduce((acc, curr) => acc + curr.total, 0) + 
                       data.weeks.reduce((acc, w) => acc + w.tasks.length, 0) +
                       data.months.reduce((acc, m) => acc + m.goals.length, 0);
                       
    const completedTasks = areaStats.reduce((acc, curr) => acc + curr.completed, 0) + 
                           data.weeks.reduce((acc, w) => acc + w.tasks.filter(t => t.completed).length, 0) +
                           data.months.reduce((acc, m) => acc + m.goals.filter(g => g.completed).length, 0);

    const executionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return {
        yearProgress,
        yearStatus,
        statusColor,
        statusMessage,
        areaStats,
        strongestArea,
        weakestArea,
        totalTasks,
        completedTasks,
        executionRate
    };
  }, [data]);


  if (isLoading) {
    return <LoadingScreen onFinished={() => setIsLoading(false)} />;
  }

  if (!data.isTutorialCompleted) {
    return <OnboardingWizard onComplete={completeTutorial} />;
  }

  const currentMonthIndex = new Date().getMonth();
  const currentMonth = data.months[currentMonthIndex];
  const activeWeeks = data.weeks.filter(w => new Date(w.endDate) >= new Date());

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-red-900/30 selection:text-white pb-32">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neutral-900/20 to-transparent" />
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* HEADER PREMIUM */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 animate-in slide-in-from-top-4 duration-700">
           <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                  <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                      Masterplan 2.0
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetTutorial} className="h-6 text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest hover:bg-white/5 rounded-full">
                      Tutorial
                  </Button>
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 uppercase italic tracking-tighter leading-[0.9]">
                  {data.annual.objective || "Objetivo Não Definido"}
                </h1>
                <p className="mt-2 text-neutral-400 font-medium text-lg max-w-lg">
                    {data.annual.successCriteria || "Defina seu critério de sucesso na aba Anual."}
                </p>
              </div>
           </div>
           
           <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
              <div className="flex justify-between w-full lg:w-72 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                  <span>Conclusão Anual</span>
                  <span className="text-white text-shadow-sm">{data.annual.progress}%</span>
              </div>
              <div className="w-full lg:w-72 h-3 bg-neutral-900 rounded-full border border-white/5 relative overflow-hidden shadow-inner">
                 <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-1000 ease-out"
                    style={{ width: `${data.annual.progress}%` }}
                 />
              </div>
           </div>
        </header>

        <Tabs defaultValue="overview" className="w-full space-y-8">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 bg-[#0A0A0A] p-1.5 border border-white/10 rounded-2xl h-14 shadow-2xl">
            <TabsTrigger value="overview" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-black text-[10px] uppercase tracking-wider transition-all duration-300">Visão</TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-xl font-bold data-[state=active]:bg-red-600 data-[state=active]:text-white text-[10px] uppercase tracking-wider transition-all duration-300">Foco</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-xl font-bold data-[state=active]:bg-neutral-800 data-[state=active]:text-white text-[10px] uppercase tracking-wider transition-all duration-300">Mês</TabsTrigger>
            <TabsTrigger value="annual" className="rounded-xl font-bold data-[state=active]:bg-neutral-800 data-[state=active]:text-white text-[10px] uppercase tracking-wider transition-all duration-300">Ano</TabsTrigger>
          </TabsList>

          {/* --- 1. VISÃO GERAL (DASHBOARD) --- */}
          <TabsContent value="overview" className="space-y-8 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
             <div className="grid lg:grid-cols-3 gap-6">
                {/* HERO CARD - WEEKLY FOCUS */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-[#121212] to-black border-white/10 shadow-2xl relative overflow-hidden group hover:border-red-500/30 transition-all duration-500">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 scale-150">
                      <Target className="w-64 h-64" />
                   </div>
                   <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   
                   <CardHeader className="relative z-10 pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">Foco da Semana</span>
                      </div>
                   </CardHeader>
                   <CardContent className="relative z-10 space-y-6">
                      {activeWeeks.length > 0 ? (
                          <div className="space-y-6">
                              <h3 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                                "{activeWeeks[0].goal}"
                              </h3>
                              <div className="flex items-center gap-6">
                                  <div className="flex flex-col">
                                      <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Progresso</span>
                                      <span className="text-2xl font-bold text-white">{Math.round((activeWeeks[0].tasks.filter(t => t.completed).length / (activeWeeks[0].tasks.length || 1)) * 100)}%</span>
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Tarefas</span>
                                      <span className="text-2xl font-bold text-white">{activeWeeks[0].tasks.filter(t => t.completed).length} <span className="text-base text-neutral-600 font-medium">/ {activeWeeks[0].tasks.length}</span></span>
                                  </div>
                              </div>
                              <Button onClick={() => document.querySelector('[data-value="weekly"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))} className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg">
                                Ver Detalhes <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                          </div>
                      ) : (
                          <div className="py-8 flex flex-col items-start gap-4">
                              <p className="text-neutral-500 text-lg">Você ainda não definiu o foco desta semana.</p>
                              <Button className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 shadow-lg shadow-red-900/20">
                                  Definir Agora
                              </Button>
                          </div>
                      )}
                   </CardContent>
                </Card>

                {/* MONTH CARD */}
                <Card className="bg-[#0A0A0A] border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
                   <CardHeader>
                      <CardTitle className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em]">Mês Atual</CardTitle>
                      <div className="text-3xl font-black text-white uppercase">{currentMonth.name}</div>
                   </CardHeader>
                   <CardContent className="space-y-6">
                      <div className="flex items-end justify-between">
                          <div className="text-5xl font-black text-white tracking-tighter">
                            {currentMonth.goals.filter(g => g.completed).length}
                            <span className="text-lg text-neutral-600 font-medium ml-1">/ {currentMonth.goals.length}</span>
                          </div>
                          <Trophy className="w-12 h-12 text-neutral-800" />
                      </div>
                      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                        <div 
                           className="h-full bg-white rounded-full transition-all duration-1000"
                           style={{ width: `${(currentMonth.goals.filter(g => g.completed).length / (currentMonth.goals.length || 1)) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-neutral-500 font-medium">
                          Cada pequena vitória conta. Continue avançando.
                      </p>
                   </CardContent>
                </Card>
             </div>
             
             {/* AREAS GRID */}
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                      { title: "Trabalho", items: data.areas.work, icon: Briefcase, color: "text-blue-500", border: "hover:border-blue-500/30" },
                      { title: "Estudos", items: data.areas.studies, icon: GraduationCap, color: "text-purple-500", border: "hover:border-purple-500/30" },
                      { title: "Saúde", items: data.areas.health, icon: Heart, color: "text-red-500", border: "hover:border-red-500/30" },
                      { title: "Pessoal", items: data.areas.personal, icon: User, color: "text-yellow-500", border: "hover:border-yellow-500/30" },
                  ].map((area, i) => (
                      <Card key={i} className={`bg-[#0A0A0A] border-white/5 transition-all duration-300 ${area.border} group`}>
                          <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                              <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors`}>
                                <area.icon className={`w-6 h-6 ${area.color}`} />
                              </div>
                              <div>
                                <span className="block font-bold text-sm text-white uppercase tracking-wider">{area.title}</span>
                                <span className="text-xs text-neutral-500 mt-1 block">{area.items.filter(i => i.completed).length}/{area.items.length} Concluídos</span>
                              </div>
                          </CardContent>
                      </Card>
                  ))}
             </div>
          </TabsContent>

          {/* --- 2. WEEKLY (EXECUÇÃO) --- */}
          <TabsContent value="weekly" className="space-y-8 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
             {/* NEW SPRINT CREATOR */}
             <Card className="bg-[#0A0A0A] border-white/10">
               <CardHeader className="border-b border-white/5 pb-6">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="p-2 bg-red-500/10 rounded-lg"><Zap className="w-5 h-5 text-red-500" /></div>
                     <CardTitle className="text-lg font-black uppercase text-white tracking-wide">Nova Sprint Semanal</CardTitle>
                  </div>
                  <CardDescription className="text-neutral-500">Planeje os próximos 7 dias com intencionalidade.</CardDescription>
               </CardHeader>
               <CardContent className="pt-8">
                  <div className="flex flex-col xl:flex-row gap-6 items-end">
                     <div className="space-y-2 flex-1 w-full">
                        <Label className="text-xs uppercase font-bold text-neutral-500 tracking-widest">Objetivo Único</Label>
                        <Input 
                          value={newWeekGoal}
                          onChange={(e) => setNewWeekGoal(e.target.value)}
                          placeholder="Qual é a única coisa que fará essa semana valer a pena?" 
                          className="bg-black/40 border-white/10 h-14 text-base focus:border-red-500/50 transition-all focus:ring-1 focus:ring-red-500/20" 
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4 w-full xl:w-auto">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase font-bold text-neutral-500 tracking-widest">Início</Label>
                          <Input 
                            type="date" 
                            value={newWeekStart}
                            onChange={(e) => setNewWeekStart(e.target.value)}
                            className="bg-black/40 border-white/10 h-14 px-4 transition-all focus:ring-1 focus:ring-red-500/20" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase font-bold text-neutral-500 tracking-widest">Fim</Label>
                          <Input 
                            type="date" 
                            value={newWeekEnd}
                            onChange={(e) => setNewWeekEnd(e.target.value)}
                            className="bg-black/40 border-white/10 h-14 px-4 transition-all focus:ring-1 focus:ring-red-500/20" 
                          />
                        </div>
                     </div>
                     <Button onClick={handleCreateWeek} className="w-full xl:w-auto h-14 bg-white text-black hover:bg-neutral-200 font-bold px-10 rounded-lg transition-all active:scale-95">
                       CRIAR SPRINT
                     </Button>
                  </div>
               </CardContent>
             </Card>

             <div className="space-y-8">
                {data.weeks.length === 0 && (
                  <div className="text-center py-24 opacity-30 border-2 border-dashed border-white/10 rounded-3xl animate-in fade-in duration-500">
                      <LayoutDashboard className="w-20 h-20 mx-auto mb-6 text-neutral-500" />
                      <p className="text-xl font-medium">Nenhuma sprint ativa.</p>
                  </div>
                )}

                {data.weeks.map((week) => (
                  <div key={week.id} className="relative group">
                     {/* GLOW EFFECT */}
                     <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                     
                     <Card className="bg-[#0E0E0E] border-white/10 overflow-hidden shadow-2xl">
                        <CardHeader className="bg-white/[0.02] border-b border-white/5 py-6">
                           <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                 <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase text-red-500 tracking-[0.2em] bg-red-950/30 px-2 py-1 rounded border border-red-500/20">
                                       Semana de {new Date(week.startDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                                    </span>
                                 </div>
                                 <h3 className="text-2xl md:text-3xl text-white font-black uppercase italic tracking-tight">{week.goal}</h3>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => deleteWeek(week.id)} className="text-neutral-600 hover:text-red-500 hover:bg-red-500/10 transition-all">
                                <Trash2 className="w-5 h-5" />
                              </Button>
                           </div>
                        </CardHeader>
                        <CardContent className="pt-8 grid lg:grid-cols-2 gap-12">
                           <div className="space-y-6">
                              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                  <CheckSquare className="w-4 h-4 text-neutral-500" />
                                  <Label className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em]">Plano de Ação</Label>
                              </div>
                              <TaskList 
                                items={week.tasks} 
                                onAdd={(t) => addWeekTask(week.id, t)} 
                                onToggle={(taskId) => toggleWeekTask(week.id, taskId)}
                                placeholder="Adicionar tarefa chave..."
                              />
                           </div>

                           <div className="space-y-6 lg:border-l border-white/5 lg:pl-12">
                              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                  <Save className="w-4 h-4 text-neutral-500" />
                                  <Label className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em]">Review Semanal</Label>
                              </div>
                              <div className="space-y-4">
                                 <div className="space-y-2">
                                     <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">O que funcionou?</span>
                                     <Textarea 
                                        value={week.review.worked}
                                        onChange={(e) => updateWeekReview(week.id, 'worked', e.target.value)}
                                        className="bg-black/40 border-white/5 text-sm min-h-[60px] resize-none focus:border-green-500/50 transition-all"
                                     />
                                 </div>
                                 <div className="space-y-2">
                                     <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">O que falhou?</span>
                                     <Textarea 
                                        value={week.review.didntWork}
                                        onChange={(e) => updateWeekReview(week.id, 'didntWork', e.target.value)}
                                        className="bg-black/40 border-white/5 text-sm min-h-[60px] resize-none focus:border-red-500/50 transition-all"
                                     />
                                 </div>
                                 <div className="space-y-2">
                                     <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider">Como melhorar?</span>
                                     <Textarea 
                                        value={week.review.improve}
                                        onChange={(e) => updateWeekReview(week.id, 'improve', e.target.value)}
                                        className="bg-black/40 border-white/5 text-sm min-h-[60px] resize-none focus:border-yellow-500/50 transition-all"
                                     />
                                 </div>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
                ))}
             </div>
          </TabsContent>

          {/* --- 3. MONTHLY (PLANEJAMENTO) --- */}
          <TabsContent value="monthly" className="space-y-6 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
             <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={`month-${currentMonth.id}`}>
               {data.months.map((month, index) => {
                 const isCurrent = index === currentMonthIndex;
                 return (
                  <AccordionItem key={month.id} value={`month-${month.id}`} className={`border ${isCurrent ? 'border-red-500/20 bg-gradient-to-r from-red-950/10 to-transparent' : 'border-white/5 bg-[#0A0A0A]'} rounded-2xl px-2 transition-all duration-300`}>
                    <AccordionTrigger className="hover:no-underline py-5 px-4 group">
                      <div className="flex items-center gap-6 w-full">
                        <span className={`text-2xl font-black uppercase tracking-tight group-hover:pl-2 transition-all duration-300 ${isCurrent ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                          {month.name}
                        </span>
                        {isCurrent && (
                            <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse">
                                Mês Atual
                            </span>
                        )}
                        <div className="flex-1 h-px bg-white/5 mx-4" />
                        <span className="text-xs font-medium text-neutral-600 mr-4">
                           {month.goals.filter(g => g.completed).length}/{month.goals.length} Metas
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pt-2 px-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid lg:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <Label className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em]">Metas do Mês</Label>
                           <TaskList 
                              items={month.goals} 
                              onAdd={(t) => addMonthGoal(index, t)} 
                              onToggle={(id) => toggleMonthGoal(index, id)}
                           />
                        </div>
                        <div className="space-y-4">
                           <Label className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em]">Notas & Ideias</Label>
                           <Textarea 
                              value={month.notes}
                              onChange={(e) => updateMonth(index, { notes: e.target.value })}
                              className="bg-black/40 border-white/5 h-[200px] resize-none transition-all focus:ring-1 focus:ring-white/20 text-neutral-300 leading-relaxed p-4"
                              placeholder="Escreva suas reflexões..."
                           />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                 );
               })}
             </Accordion>
          </TabsContent>

          {/* --- 4. ANNUAL (DASHBOARD ANALÍTICO) --- */}
          <TabsContent value="annual" className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              
              {/* 1. STATUS GERAL */}
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-[#0A0A0A] border-white/10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10"><Activity className="w-48 h-48 text-white" /></div>
                   <CardHeader>
                      <CardTitle className="text-lg font-black uppercase text-white flex items-center gap-3">
                          <BarChart3 className="text-red-500" /> Performance Geral do Ano
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-8 relative z-10">
                      <div className="flex items-end justify-between">
                         <div>
                            <span className="text-6xl font-black text-white tracking-tighter">{data.annual.progress}%</span>
                            <span className="text-neutral-500 font-bold ml-2">Concluído</span>
                         </div>
                         <div className="text-right">
                            <div className={`text-xl font-black uppercase ${analytics.statusColor}`}>{analytics.yearStatus}</div>
                            <div className="text-xs text-neutral-400 font-medium">{analytics.statusMessage}</div>
                         </div>
                      </div>
                      
                      {/* Comparison Bar */}
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] uppercase font-bold text-neutral-500 tracking-widest">
                            <span>Progresso Real</span>
                            <span>Tempo Decorrido ({Math.round(analytics.yearProgress)}%)</span>
                         </div>
                         <div className="h-4 bg-neutral-900 rounded-full overflow-hidden relative border border-white/5">
                            {/* Time Progress (Background Bar) */}
                            <div className="absolute top-0 left-0 h-full bg-white/10 w-full" style={{ width: `${analytics.yearProgress}%` }} />
                            {/* User Progress (Foreground Bar) */}
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all duration-1000" style={{ width: `${data.annual.progress}%` }} />
                         </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4">
                         <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                            <div className="text-2xl font-bold text-white">{analytics.totalTasks}</div>
                            <div className="text-[10px] uppercase text-neutral-500 font-bold">Total Tarefas</div>
                         </div>
                         <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                            <div className="text-2xl font-bold text-white">{analytics.completedTasks}</div>
                            <div className="text-[10px] uppercase text-neutral-500 font-bold">Concluídas</div>
                         </div>
                         <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                            <div className="text-2xl font-bold text-white">{analytics.executionRate}%</div>
                            <div className="text-[10px] uppercase text-neutral-500 font-bold">Taxa Execução</div>
                         </div>
                      </div>
                   </CardContent>
                </Card>

                {/* KPI CARD: Strongest Area */}
                <Card className="bg-[#0A0A0A] border-white/10 flex flex-col justify-between">
                   <CardHeader>
                      <CardTitle className="text-xs font-bold uppercase text-neutral-500 tracking-widest">Área de Destaque</CardTitle>
                   </CardHeader>
                   <CardContent className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                         <Award className="w-10 h-10 text-green-500" />
                      </div>
                      <div>
                         <div className="text-2xl font-black text-white uppercase">{analytics.strongestArea.label}</div>
                         <div className="text-sm text-neutral-400">{Math.round(analytics.strongestArea.percentage)}% de Conclusão</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl text-xs text-neutral-300">
                         "Você tem mostrado grande consistência em {analytics.strongestArea.label}. Mantenha o foco!"
                      </div>
                   </CardContent>
                </Card>
              </div>

              {/* 2. ÁREAS DETALHADAS */}
              <div className="space-y-4">
                 <Label className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em] pl-1">Progresso por Pilar</Label>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {analytics.areaStats.map((area) => (
                       <Card key={area.id} className="bg-[#0A0A0A] border-white/5 hover:border-white/20 transition-all duration-300 group">
                          <CardContent className="pt-6 space-y-4">
                             <div className="flex justify-between items-start">
                                <span className={`text-xs font-bold uppercase tracking-wider ${area.color}`}>{area.label}</span>
                                <span className="text-xl font-black text-white">{Math.round(area.percentage)}%</span>
                             </div>
                             <Progress value={area.percentage} className="h-1.5 bg-neutral-900" indicatorClassName={`${area.barColor} transition-all duration-1000`} />
                             <div className="flex justify-between text-[10px] text-neutral-500 font-medium">
                                <span>{area.completed} Feitos</span>
                                <span>{area.total} Total</span>
                             </div>
                          </CardContent>
                       </Card>
                    ))}
                 </div>
              </div>

              {/* 3. MAPA DE CALOR MENSAL */}
              <div className="space-y-4">
                 <Label className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em] pl-1">Consistência Mensal</Label>
                 <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {data.months.map((month, idx) => {
                       const completed = month.goals.filter(g => g.completed).length;
                       const total = month.goals.length;
                       const percent = total === 0 ? 0 : (completed / total) * 100;
                       
                       let bgClass = "bg-[#0E0E0E] border-white/5";
                       let textClass = "text-neutral-500";
                       
                       if (total > 0) {
                          if (percent === 100) { bgClass = "bg-green-950/20 border-green-500/30"; textClass = "text-green-500"; }
                          else if (percent >= 50) { bgClass = "bg-yellow-950/20 border-yellow-500/30"; textClass = "text-yellow-500"; }
                          else if (percent > 0) { bgClass = "bg-red-950/20 border-red-500/30"; textClass = "text-red-500"; }
                       }

                       return (
                          <div key={idx} className={`p-4 rounded-xl border ${bgClass} transition-all duration-300 flex flex-col justify-between h-24`}>
                             <span className={`text-xs font-bold uppercase tracking-wider ${textClass}`}>{month.name.substring(0, 3)}</span>
                             <div className="space-y-1">
                                <div className="text-xl font-black text-white">{Math.round(percent)}%</div>
                                <div className="text-[10px] text-neutral-600">{completed}/{total} Metas</div>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>

              {/* 4. OBJETIVO & EDIÇÃO */}
              <div className="grid lg:grid-cols-2 gap-10 border-t border-white/5 pt-10">
                 <div className="space-y-6">
                    <div className="flex items-center gap-2">
                       <Target className="text-red-500 w-5 h-5" />
                       <Label className="text-white font-bold uppercase tracking-widest text-sm">Objetivo Central</Label>
                    </div>
                    <div className="space-y-4">
                        <Input 
                              value={data.annual.objective}
                              onChange={(e) => updateAnnual({ objective: e.target.value })}
                              className="text-2xl md:text-3xl font-black bg-transparent border-none border-b border-white/10 rounded-none focus-visible:ring-0 px-0 h-auto py-2 placeholder:text-neutral-800 text-white transition-all focus:border-red-500"
                              placeholder="Defina seu objetivo..."
                        />
                        <Textarea 
                              value={data.annual.successCriteria}
                              onChange={(e) => updateAnnual({ successCriteria: e.target.value })}
                              className="bg-[#0E0E0E] border-white/10 resize-none h-32 text-sm transition-all focus:ring-1 focus:ring-red-500/20 p-4 leading-relaxed"
                              placeholder="Critérios de sucesso..."
                        />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center gap-2">
                       <LayoutDashboard className="text-blue-500 w-5 h-5" />
                       <Label className="text-white font-bold uppercase tracking-widest text-sm">Gestão Rápida de Áreas</Label>
                    </div>
                    <div className="grid gap-3">
                        {['work', 'studies', 'health', 'personal'].map((areaId) => {
                            const areaLabel = { work: 'Trabalho', studies: 'Estudos', health: 'Saúde', personal: 'Pessoal' }[areaId];
                            const areaColor = { work: 'text-blue-500', studies: 'text-purple-500', health: 'text-red-500', personal: 'text-yellow-500' }[areaId];
                            
                            return (
                                <Accordion type="single" collapsible key={areaId} className="bg-[#0E0E0E] border border-white/5 rounded-lg px-4">
                                    <AccordionItem value="item-1" className="border-none">
                                        <AccordionTrigger className="hover:no-underline py-3">
                                            <span className={`text-xs font-bold uppercase ${areaColor}`}>{areaLabel}</span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <TaskList 
                                                items={(data.areas as any)[areaId]} 
                                                onAdd={(t) => addAreaItem(areaId as any, t)} 
                                                onToggle={(id) => toggleAreaItem(areaId as any, id)} 
                                                onDelete={(id) => deleteAreaItem(areaId as any, id)} 
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            );
                        })}
                    </div>
                    
                    <div className="pt-4">
                        <div className="flex justify-between items-end mb-4">
                            <Label className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-xs">Ajuste Manual de Progresso</Label>
                            <span className="text-2xl font-black text-white">{data.annual.progress}%</span>
                        </div>
                        <Slider 
                            value={[data.annual.progress]}
                            onValueChange={(vals) => updateAnnual({ progress: vals[0] })}
                            max={100}
                            step={1}
                            className="cursor-pointer"
                        />
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