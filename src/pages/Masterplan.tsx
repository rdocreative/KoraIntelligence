import { useState } from "react";
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
  BookOpen, HelpCircle, Save, CheckCircle2, Trophy, Clock
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
    <div className="space-y-3">
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-3 group animate-in slide-in-from-left-2 duration-300">
            <div 
              onClick={() => onToggle(item.id)}
              className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center cursor-pointer transition-colors ${item.completed ? 'bg-red-600 border-red-600' : 'border-neutral-600 hover:border-red-500'}`}
            >
              {item.completed && <CheckSquare className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className={`flex-1 text-sm ${item.completed ? 'text-neutral-500 line-through' : 'text-neutral-200'}`}>
              {item.text}
            </span>
            {onDelete && (
              <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-500 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={placeholder}
          className="h-9 text-sm bg-neutral-900 border-neutral-800 focus:border-red-500/50"
        />
        <Button size="sm" onClick={handleAdd} className="h-9 w-9 p-0 bg-neutral-800 hover:bg-neutral-700">
          <Plus className="w-4 h-4" />
        </Button>
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

  const steps = [
    // 0: Introdução
    {
      title: "Método Nenkan Mokuhyō",
      subtitle: "Bem-vindo ao Masterplan",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-300">
            Este é um método japonês de planejamento que transforma um grande objetivo anual em ações diárias simples.
          </p>
          <div className="grid gap-3 my-6">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <Target className="text-red-500" /> 
                <span className="text-sm font-medium">1 Objetivo Anual Claro</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <Target className="text-blue-500" /> 
                <span className="text-sm font-medium">4 Áreas de Equilíbrio</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <Target className="text-green-500" /> 
                <span className="text-sm font-medium">Execução Semanal Focada</span>
            </div>
          </div>
          <p className="text-sm text-neutral-500 italic">"Em vez de depender de motivação, crie um sistema que te force a avançar."</p>
        </div>
      )
    },
    // 1: Objetivo Anual
    {
      title: "Passo 1: O Único Objetivo",
      subtitle: "Elimine a confusão. Foque em um alvo.",
      content: (
        <div className="space-y-6">
          <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl space-y-2">
            <h4 className="text-red-500 text-xs font-black uppercase">Exemplo Prático</h4>
            <p className="text-sm text-neutral-300"><strong>Objetivo:</strong> Atingir R$ 20.000/mês de faturamento.</p>
            <p className="text-sm text-neutral-300"><strong>Sucesso:</strong> Receber esse valor por 3 meses seguidos até Dezembro.</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
                <Label>Qual é o seu Grande Objetivo do Ano?</Label>
                <Input 
                    placeholder="Escreva aqui..." 
                    value={data.annual.objective}
                    onChange={(e) => updateAnnual({ objective: e.target.value })}
                    className="bg-neutral-900 border-white/10 h-12 text-lg"
                />
            </div>
            <div className="space-y-2">
                <Label>Como você saberá que deu certo? (Seja específico)</Label>
                <Textarea 
                    placeholder="Critério mensurável de sucesso..." 
                    value={data.annual.successCriteria}
                    onChange={(e) => updateAnnual({ successCriteria: e.target.value })}
                    className="bg-neutral-900 border-white/10"
                />
            </div>
          </div>
        </div>
      )
    },
    // 2: Áreas Chave
    {
      title: "Passo 2: Os 4 Pilares",
      subtitle: "O sucesso exige equilíbrio. Se a saúde falha, o objetivo cai.",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-neutral-400">Adicione pelo menos 1 meta principal para cada área da sua vida.</p>
          
          <div className="grid gap-4">
            <div className="space-y-2">
                <Label className="flex items-center gap-2"><Briefcase className="w-3 h-3 text-blue-500" /> Trabalho & Dinheiro</Label>
                <div className="flex gap-2">
                    <Input id="area-work" placeholder="Ex: Criar reserva de emergência" className="bg-neutral-900 border-white/10 text-sm" />
                    <Button size="sm" onClick={() => {
                        const el = document.getElementById('area-work') as HTMLInputElement;
                        if(el.value) { addAreaItem('work', el.value); el.value = ''; }
                    }}><Plus className="w-4 h-4"/></Button>
                </div>
                <div className="text-xs text-neutral-500 pl-2">
                    {data.areas.work.map(i => <div key={i.id}>• {i.text}</div>)}
                </div>
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-2"><Heart className="w-3 h-3 text-red-500" /> Saúde & Energia</Label>
                <div className="flex gap-2">
                    <Input id="area-health" placeholder="Ex: Treinar 4x na semana" className="bg-neutral-900 border-white/10 text-sm" />
                    <Button size="sm" onClick={() => {
                        const el = document.getElementById('area-health') as HTMLInputElement;
                        if(el.value) { addAreaItem('health', el.value); el.value = ''; }
                    }}><Plus className="w-4 h-4"/></Button>
                </div>
                <div className="text-xs text-neutral-500 pl-2">
                    {data.areas.health.map(i => <div key={i.id}>• {i.text}</div>)}
                </div>
            </div>
          </div>
        </div>
      )
    },
    // 3: Explicação Final
    {
      title: "Sistema Pronto!",
      subtitle: "A estrutura foi criada. Agora é execução.",
      content: (
        <div className="space-y-6 text-center py-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <p className="text-neutral-300">
             O Masterplan não é sobre planejar o ano todo de uma vez.<br/>
             É sobre ter clareza do ano, mas focar na <strong>Semana Atual</strong>.
          </p>
          <div className="bg-white/5 p-4 rounded-xl text-left text-sm space-y-2 border border-white/5">
             <p>👉 <strong>Mensalmente:</strong> Defina as metas do mês.</p>
             <p>👉 <strong>Semanalmente:</strong> Crie um plano de ação (Domingo).</p>
             <p>👉 <strong>Diariamente:</strong> Execute o que está no plano.</p>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-[#121212] border-white/10 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-neutral-900">
            <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>

        <CardHeader className="text-center pt-8">
          <CardTitle className="text-2xl font-black text-white uppercase tracking-tight">{currentStep.title}</CardTitle>
          <CardDescription className="text-base font-medium text-neutral-500">{currentStep.subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="min-h-[300px] flex flex-col justify-center">
            {currentStep.content}
        </CardContent>

        <CardFooter className="flex justify-between border-t border-white/5 pt-6 bg-black/20">
            <Button 
                variant="ghost" 
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className="text-neutral-500"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>

            {step < steps.length - 1 ? (
                <Button 
                    onClick={() => setStep(s => s + 1)} 
                    className="bg-white text-black hover:bg-neutral-200 font-bold"
                >
                    Próximo <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            ) : (
                <Button 
                    onClick={onComplete} 
                    className="bg-red-600 hover:bg-red-500 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                >
                    Começar a Executar <Play className="w-4 h-4 ml-2 fill-current" />
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

  // Se o tutorial não foi completado, mostra o Wizard
  if (!data.isTutorialCompleted) {
    return <OnboardingWizard onComplete={completeTutorial} />;
  }

  const currentMonthIndex = new Date().getMonth();
  const currentMonth = data.months[currentMonthIndex];
  const activeWeeks = data.weeks.filter(w => new Date(w.endDate) >= new Date());

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      
      {/* HEADER DE STATUS */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
         <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-red-500/20">
                    Nenkan Mokuhyō
                </span>
                <Button variant="ghost" size="sm" onClick={resetTutorial} className="h-5 text-[10px] text-neutral-600 hover:text-white px-2">
                    <HelpCircle className="w-3 h-3 mr-1" /> Ver Tutorial
                </Button>
            </div>
            <h1 className="text-4xl font-black text-white glow-text uppercase italic tracking-tighter">Masterplan</h1>
            <p className="text-neutral-500 font-medium max-w-md">
                {data.annual.objective || "Defina seu objetivo anual..."}
            </p>
         </div>
         
         <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <div className="flex justify-between w-full md:w-48 text-xs font-bold uppercase text-neutral-400">
                <span>Progresso do Ano</span>
                <span className="text-white">{data.annual.progress}%</span>
            </div>
            <Progress value={data.annual.progress} className="h-2 w-full md:w-48 bg-neutral-900" indicatorClassName="bg-red-600" />
         </div>
      </header>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-[#121212] p-1 border border-white/5 rounded-2xl mb-6 h-12">
          <TabsTrigger value="overview" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-black text-[10px] md:text-xs">
             VISÃO GERAL
          </TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-xl font-bold data-[state=active]:bg-red-600 data-[state=active]:text-white text-[10px] md:text-xs">
             SEMANAL <span className="hidden md:inline ml-1">(Foco)</span>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-xl font-bold data-[state=active]:bg-neutral-800 data-[state=active]:text-white text-[10px] md:text-xs">
             MENSAL
          </TabsTrigger>
          <TabsTrigger value="annual" className="rounded-xl font-bold data-[state=active]:bg-neutral-800 data-[state=active]:text-white text-[10px] md:text-xs">
             ANUAL
          </TabsTrigger>
        </TabsList>

        {/* --- 1. VISÃO GERAL (DASHBOARD) --- */}
        <TabsContent value="overview" className="space-y-6 outline-none animate-in slide-in-from-bottom-4 duration-500">
           {/* Cartão de Foco Atual */}
           <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-red-900/20 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Clock className="w-32 h-32" />
                 </div>
                 <CardHeader>
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                        <Target className="text-red-500" /> Foco da Semana
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    {activeWeeks.length > 0 ? (
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-white leading-tight">"{activeWeeks[0].goal}"</h3>
                            <div className="flex gap-4 text-xs font-mono text-neutral-400">
                                <span>{activeWeeks[0].tasks.filter(t => t.completed).length} Concluídas</span>
                                <span>{activeWeeks[0].tasks.length} Total</span>
                            </div>
                            <Progress value={(activeWeeks[0].tasks.filter(t => t.completed).length / (activeWeeks[0].tasks.length || 1)) * 100} className="h-1.5" />
                        </div>
                    ) : (
                        <div className="text-neutral-500 italic py-4">
                            Nenhuma semana ativa. Vá para a aba "Semanal" para planejar.
                        </div>
                    )}
                 </CardContent>
              </Card>

              <Card className="bg-[#121212] border-white/5">
                 <CardHeader>
                    <CardTitle className="text-sm font-bold text-neutral-400 uppercase">Mês Atual: {currentMonth.name}</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="text-3xl font-black text-white mb-2">
                        {currentMonth.goals.filter(g => g.completed).length} <span className="text-neutral-600 text-sm font-normal">/ {currentMonth.goals.length} Metas</span>
                    </div>
                    <div className="text-xs text-neutral-500">
                        Continue avançando uma meta por vez.
                    </div>
                 </CardContent>
              </Card>
           </div>
           
           {/* Áreas Resumo */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { title: "Trabalho", items: data.areas.work, icon: Briefcase, color: "text-blue-500" },
                    { title: "Estudos", items: data.areas.studies, icon: GraduationCap, color: "text-purple-500" },
                    { title: "Saúde", items: data.areas.health, icon: Heart, color: "text-red-500" },
                    { title: "Pessoal", items: data.areas.personal, icon: User, color: "text-yellow-500" },
                ].map((area, i) => (
                    <Card key={i} className="bg-[#121212] border-white/5 hover:border-white/10 transition-colors">
                        <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                            <area.icon className={`w-6 h-6 ${area.color}`} />
                            <span className="font-bold text-sm text-white">{area.title}</span>
                            <span className="text-xs text-neutral-500">{area.items.filter(i => i.completed).length}/{area.items.length} Concluídos</span>
                        </CardContent>
                    </Card>
                ))}
           </div>
        </TabsContent>

        {/* --- 2. WEEKLY (EXECUÇÃO) --- */}
        <TabsContent value="weekly" className="space-y-8 outline-none">
           <Card className="bg-[#121212] border-white/5">
             <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-lg font-black uppercase text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-red-500" /> Nova Sprint Semanal
                </CardTitle>
                <CardDescription>O sucesso é construído em ciclos de 7 dias.</CardDescription>
             </CardHeader>
             <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                   <div className="space-y-2 flex-1 w-full">
                      <Label className="text-xs uppercase font-bold text-neutral-400">Objetivo Único da Semana</Label>
                      <Input 
                        value={newWeekGoal}
                        onChange={(e) => setNewWeekGoal(e.target.value)}
                        placeholder="Ex: Finalizar o módulo X..." 
                        className="bg-neutral-900 border-white/5 h-12" 
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-neutral-400">Início</Label>
                        <Input 
                          type="date" 
                          value={newWeekStart}
                          onChange={(e) => setNewWeekStart(e.target.value)}
                          className="bg-neutral-900 border-white/5 h-12" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-neutral-400">Fim (Revisão)</Label>
                        <Input 
                          type="date" 
                          value={newWeekEnd}
                          onChange={(e) => setNewWeekEnd(e.target.value)}
                          className="bg-neutral-900 border-white/5 h-12" 
                        />
                      </div>
                   </div>
                   <Button onClick={handleCreateWeek} className="w-full md:w-auto h-12 bg-red-600 hover:bg-red-500 font-bold px-8">
                     CRIAR
                   </Button>
                </div>
             </CardContent>
           </Card>

           <div className="space-y-6">
              {data.weeks.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
                    <p>Nenhuma semana planejada.</p>
                </div>
              )}

              {data.weeks.map((week) => (
                <Card key={week.id} className="bg-[#121212] border-white/5 overflow-hidden animate-in slide-in-from-bottom-2">
                  <CardHeader className="bg-neutral-900/30 border-b border-white/5 pb-3">
                     <div className="flex justify-between items-start">
                        <div>
                           <div className="flex items-center gap-2 text-[10px] font-black uppercase text-red-500 tracking-wider mb-1">
                              <span>SEMANA DE {new Date(week.startDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}</span>
                           </div>
                           <CardTitle className="text-xl text-white font-black uppercase italic">{week.goal}</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteWeek(week.id)} className="text-neutral-600 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                     </div>
                  </CardHeader>
                  <CardContent className="pt-6 grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <Label className="text-xs font-black uppercase text-neutral-500 flex items-center gap-2">
                            <CheckSquare className="w-4 h-4" /> Plano de Ação
                        </Label>
                        <TaskList 
                          items={week.tasks} 
                          onAdd={(t) => addWeekTask(week.id, t)} 
                          onToggle={(taskId) => toggleWeekTask(week.id, taskId)}
                          placeholder="Adicionar tarefa chave..."
                        />
                     </div>

                     <div className="space-y-4 border-l border-white/5 pl-0 md:pl-8">
                        <Label className="text-xs font-black uppercase text-neutral-500 flex items-center gap-2">
                            <Save className="w-4 h-4" /> Revisão Semanal
                        </Label>
                        <div className="space-y-3">
                           <div className="space-y-1">
                               <span className="text-[10px] font-bold text-green-500 uppercase">Funcionou</span>
                               <Input 
                                  value={week.review.worked}
                                  onChange={(e) => updateWeekReview(week.id, 'worked', e.target.value)}
                                  className="bg-neutral-900/50 border-white/5 text-xs h-8"
                               />
                           </div>
                           <div className="space-y-1">
                               <span className="text-[10px] font-bold text-red-500 uppercase">Não Funcionou</span>
                               <Input 
                                  value={week.review.didntWork}
                                  onChange={(e) => updateWeekReview(week.id, 'didntWork', e.target.value)}
                                  className="bg-neutral-900/50 border-white/5 text-xs h-8"
                               />
                           </div>
                           <div className="space-y-1">
                               <span className="text-[10px] font-bold text-yellow-500 uppercase">Melhorar</span>
                               <Input 
                                  value={week.review.improve}
                                  onChange={(e) => updateWeekReview(week.id, 'improve', e.target.value)}
                                  className="bg-neutral-900/50 border-white/5 text-xs h-8"
                               />
                           </div>
                        </div>
                     </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        </TabsContent>

        {/* --- 3. MONTHLY (PLANEJAMENTO) --- */}
        <TabsContent value="monthly" className="space-y-6 outline-none">
           <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={`month-${currentMonth.id}`}>
             {data.months.map((month, index) => {
               const isCurrent = index === currentMonthIndex;
               return (
                <AccordionItem key={month.id} value={`month-${month.id}`} className={`border ${isCurrent ? 'border-red-500/30 bg-red-900/5' : 'border-white/5 bg-[#121212]'} rounded-2xl px-4 transition-all`}>
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4">
                      <span className={`text-xl font-black uppercase ${isCurrent ? 'text-red-500' : 'text-neutral-400'}`}>
                        {month.name}
                      </span>
                      {isCurrent && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Atual</span>}
                      <span className="text-xs font-medium text-neutral-600">
                         {month.goals.filter(g => g.completed).length}/{month.goals.length} Metas
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-2">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <Label className="text-xs font-black uppercase text-neutral-500">Metas do Mês</Label>
                         <TaskList 
                            items={month.goals} 
                            onAdd={(t) => addMonthGoal(index, t)} 
                            onToggle={(id) => toggleMonthGoal(index, id)}
                         />
                      </div>
                      <div className="space-y-3">
                         <Label className="text-xs font-black uppercase text-neutral-500">Notas</Label>
                         <Textarea 
                            value={month.notes}
                            onChange={(e) => updateMonth(index, { notes: e.target.value })}
                            className="bg-neutral-900/50 border-white/5 h-[150px] resize-none"
                            placeholder="Ideias..."
                         />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
               );
             })}
           </Accordion>
        </TabsContent>

        {/* --- 4. ANNUAL (ESTRUTURA) --- */}
        <TabsContent value="annual" className="space-y-8 outline-none">
            <div className="space-y-2">
                <Label className="text-red-500 font-black tracking-widest uppercase text-xs">Objetivo Principal do Ano</Label>
                <Input 
                    value={data.annual.objective}
                    onChange={(e) => updateAnnual({ objective: e.target.value })}
                    className="text-2xl font-black bg-transparent border-none border-b border-white/10 rounded-none focus-visible:ring-0 px-0 h-auto py-2 placeholder:text-neutral-700 text-white"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-neutral-500 font-bold uppercase text-xs">Critério de Sucesso</Label>
                <Textarea 
                    value={data.annual.successCriteria}
                    onChange={(e) => updateAnnual({ successCriteria: e.target.value })}
                    className="bg-neutral-900/50 border-white/5 resize-none h-20 text-sm"
                />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-end">
                    <Label className="text-neutral-500 font-bold uppercase text-xs">Progresso Anual Manual</Label>
                    <span className="text-xl font-black text-white">{data.annual.progress}%</span>
                </div>
                <Slider 
                    value={[data.annual.progress]}
                    onValueChange={(vals) => updateAnnual({ progress: vals[0] })}
                    max={100}
                    step={1}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-8">
                <Card className="bg-[#121212] border-white/5">
                    <CardHeader><CardTitle className="text-sm">Trabalho & Dinheiro</CardTitle></CardHeader>
                    <CardContent><TaskList items={data.areas.work} onAdd={(t) => addAreaItem('work', t)} onToggle={(id) => toggleAreaItem('work', id)} onDelete={(id) => deleteAreaItem('work', id)} /></CardContent>
                </Card>
                <Card className="bg-[#121212] border-white/5">
                    <CardHeader><CardTitle className="text-sm">Estudos</CardTitle></CardHeader>
                    <CardContent><TaskList items={data.areas.studies} onAdd={(t) => addAreaItem('studies', t)} onToggle={(id) => toggleAreaItem('studies', id)} onDelete={(id) => deleteAreaItem('studies', id)} /></CardContent>
                </Card>
                <Card className="bg-[#121212] border-white/5">
                    <CardHeader><CardTitle className="text-sm">Saúde</CardTitle></CardHeader>
                    <CardContent><TaskList items={data.areas.health} onAdd={(t) => addAreaItem('health', t)} onToggle={(id) => toggleAreaItem('health', id)} onDelete={(id) => deleteAreaItem('health', id)} /></CardContent>
                </Card>
                <Card className="bg-[#121212] border-white/5">
                    <CardHeader><CardTitle className="text-sm">Pessoal</CardTitle></CardHeader>
                    <CardContent><TaskList items={data.areas.personal} onAdd={(t) => addAreaItem('personal', t)} onToggle={(id) => toggleAreaItem('personal', id)} onDelete={(id) => deleteAreaItem('personal', id)} /></CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterplanPage;