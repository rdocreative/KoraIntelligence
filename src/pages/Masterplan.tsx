import { useState } from "react";
import { useMasterplan, MasterplanData, TaskItem } from "@/hooks/useMasterplan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Plus, Target, Briefcase, GraduationCap, Heart, User, 
  Calendar, CheckSquare, Trash2, ChevronDown, ChevronUp, Save
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

// --- Components Helpers ---

const TaskList = ({ 
  items, 
  onAdd, 
  onToggle, 
  onDelete, 
  placeholder = "Adicionar item..." 
}: { 
  items: TaskItem[], 
  onAdd: (text: string) => void, 
  onToggle: (id: string) => void,
  onDelete?: (id: string) => void,
  placeholder?: string
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
          <div key={item.id} className="flex items-start gap-3 group">
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
          className="h-8 text-sm bg-neutral-900 border-neutral-800"
        />
        <Button size="sm" onClick={handleAdd} className="h-8 w-8 p-0 bg-neutral-800 hover:bg-neutral-700">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const AreaBlock = ({ 
  title, 
  icon: Icon, 
  items, 
  onAdd, 
  onToggle,
  onDelete
}: { 
  title: string, 
  icon: any, 
  items: TaskItem[], 
  onAdd: (t: string) => void, 
  onToggle: (id: string) => void,
  onDelete: (id: string) => void
}) => (
  <Card className="bg-[#121212] border-white/5">
    <CardHeader className="pb-3 pt-4">
      <CardTitle className="text-sm font-black uppercase text-neutral-400 flex items-center gap-2">
        <Icon className="w-4 h-4 text-red-500" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <TaskList items={items} onAdd={onAdd} onToggle={onToggle} onDelete={onDelete} />
    </CardContent>
  </Card>
);

// --- Main Page ---

const MasterplanPage = () => {
  const { 
    data, updateAnnual, addAreaItem, toggleAreaItem, deleteAreaItem,
    addMonthGoal, toggleMonthGoal, updateMonthReview, updateMonth,
    addWeek, deleteWeek, addWeekTask, toggleWeekTask, updateWeekReview 
  } = useMasterplan();

  const [newWeekStart, setNewWeekStart] = useState("");
  const [newWeekEnd, setNewWeekEnd] = useState("");
  const [newWeekGoal, setNewWeekGoal] = useState("");

  const handleCreateWeek = () => {
    if (!newWeekStart || !newWeekEnd) return;
    
    // Auto calculate review date (Sunday after start date, simplifying to end date for logic)
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
         <h1 className="text-4xl font-black text-white glow-text uppercase italic tracking-tighter">Masterplan</h1>
         <p className="text-neutral-500 font-medium">Arquitetura de Vida & Planejamento Estratégico.</p>
      </header>

      <Tabs defaultValue="annual" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-[#121212] p-1 border border-white/5 rounded-2xl mb-6 h-12">
          <TabsTrigger value="annual" className="rounded-xl font-bold data-[state=active]:bg-red-600 data-[state=active]:text-white">
             ANUAL
          </TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-xl font-bold data-[state=active]:bg-red-600 data-[state=active]:text-white">
             MENSAL
          </TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-xl font-bold data-[state=active]:bg-red-600 data-[state=active]:text-white">
             SEMANAL
          </TabsTrigger>
        </TabsList>

        {/* --- ANNUAL VIEW --- */}
        <TabsContent value="annual" className="space-y-8 outline-none">
          {/* 1. OBJETIVO ANUAL */}
          <section className="bg-gradient-to-br from-[#121212] to-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Target className="w-40 h-40" />
             </div>
             
             <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                   <Label className="text-red-500 font-black tracking-widest uppercase text-xs">Objetivo Principal do Ano</Label>
                   <Input 
                      value={data.annual.objective}
                      onChange={(e) => updateAnnual({ objective: e.target.value })}
                      className="text-2xl md:text-3xl font-black bg-transparent border-none border-b border-white/10 rounded-none focus-visible:ring-0 px-0 h-auto py-2 placeholder:text-neutral-700 text-white"
                      placeholder="Qual é a sua única meta?"
                   />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <Label className="text-neutral-500 font-bold uppercase text-xs">Como saberei que deu certo?</Label>
                      <Textarea 
                        value={data.annual.successCriteria}
                        onChange={(e) => updateAnnual({ successCriteria: e.target.value })}
                        className="bg-neutral-900/50 border-white/5 resize-none h-24 text-sm"
                        placeholder="Critérios tangíveis de sucesso..."
                      />
                   </div>
                   <div className="space-y-4 flex flex-col justify-center">
                      <div className="flex justify-between items-end">
                        <Label className="text-neutral-500 font-bold uppercase text-xs">Progresso Anual</Label>
                        <span className="text-4xl font-black text-white">{data.annual.progress}%</span>
                      </div>
                      <Slider 
                        value={[data.annual.progress]}
                        onValueChange={(vals) => updateAnnual({ progress: vals[0] })}
                        max={100}
                        step={1}
                        className="py-2"
                      />
                   </div>
                </div>
             </div>
          </section>

          {/* 2. AREAS CHAVE */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white border-l-4 border-red-500 pl-3">Áreas-Chave</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <AreaBlock 
                title="Trabalho & Finanças" 
                icon={Briefcase} 
                items={data.areas.work} 
                onAdd={(t) => addAreaItem('work', t)} 
                onToggle={(id) => toggleAreaItem('work', id)}
                onDelete={(id) => deleteAreaItem('work', id)}
              />
              <AreaBlock 
                title="Estudos & Crescimento" 
                icon={GraduationCap} 
                items={data.areas.studies} 
                onAdd={(t) => addAreaItem('studies', t)} 
                onToggle={(id) => toggleAreaItem('studies', id)}
                onDelete={(id) => deleteAreaItem('studies', id)}
              />
              <AreaBlock 
                title="Saúde & Energia" 
                icon={Heart} 
                items={data.areas.health} 
                onAdd={(t) => addAreaItem('health', t)} 
                onToggle={(id) => toggleAreaItem('health', id)}
                onDelete={(id) => deleteAreaItem('health', id)}
              />
              <AreaBlock 
                title="Vida Pessoal" 
                icon={User} 
                items={data.areas.personal} 
                onAdd={(t) => addAreaItem('personal', t)} 
                onToggle={(id) => toggleAreaItem('personal', id)}
                onDelete={(id) => deleteAreaItem('personal', id)}
              />
            </div>
          </section>
        </TabsContent>

        {/* --- MONTHLY VIEW --- */}
        <TabsContent value="monthly" className="space-y-6 outline-none">
           <Accordion type="single" collapsible className="w-full space-y-4">
             {data.months.map((month, index) => {
               // Highlight current month
               const isCurrentMonth = index === new Date().getMonth();
               
               return (
                <AccordionItem key={month.id} value={`month-${month.id}`} className={`border ${isCurrentMonth ? 'border-red-500/30 bg-red-900/5' : 'border-white/5 bg-[#121212]'} rounded-2xl px-4`}>
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4">
                      <span className={`text-xl font-black uppercase ${isCurrentMonth ? 'text-red-500' : 'text-neutral-400'}`}>
                        {month.name}
                      </span>
                      <span className="text-xs font-medium text-neutral-600 bg-neutral-900 px-2 py-0.5 rounded-full">
                         {month.goals.filter(g => g.completed).length}/{month.goals.length} Metas
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 space-y-6">
                    {/* Planejamento */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                         <Label className="text-xs font-black uppercase text-neutral-500">Metas do Mês</Label>
                         <TaskList 
                            items={month.goals} 
                            onAdd={(t) => addMonthGoal(index, t)} 
                            onToggle={(id) => toggleMonthGoal(index, id)}
                         />
                      </div>
                      <div className="space-y-3">
                         <Label className="text-xs font-black uppercase text-neutral-500">Notas / Brainstorm</Label>
                         <Textarea 
                            value={month.notes}
                            onChange={(e) => updateMonth(index, { notes: e.target.value })}
                            className="bg-neutral-900/50 border-white/5 h-[150px] resize-none"
                            placeholder="Ideias e anotações para este mês..."
                         />
                      </div>
                    </div>

                    {/* Revisão (Bloco Fixo) */}
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <h4 className="text-sm font-black uppercase text-white mb-4 flex items-center gap-2">
                        <Save className="w-4 h-4 text-red-500" /> Revisão Mensal
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                           <span className="text-[10px] font-bold text-green-500 uppercase">O que funcionou?</span>
                           <Textarea 
                              value={month.review.worked}
                              onChange={(e) => updateMonthReview(index, 'worked', e.target.value)}
                              className="bg-neutral-900 border-green-900/20 text-xs h-24 resize-none focus:border-green-500/50"
                           />
                        </div>
                        <div className="space-y-2">
                           <span className="text-[10px] font-bold text-red-500 uppercase">O que não funcionou?</span>
                           <Textarea 
                              value={month.review.didntWork}
                              onChange={(e) => updateMonthReview(index, 'didntWork', e.target.value)}
                              className="bg-neutral-900 border-red-900/20 text-xs h-24 resize-none focus:border-red-500/50"
                           />
                        </div>
                        <div className="space-y-2">
                           <span className="text-[10px] font-bold text-yellow-500 uppercase">Ajustes para o próximo</span>
                           <Textarea 
                              value={month.review.adjust}
                              onChange={(e) => updateMonthReview(index, 'adjust', e.target.value)}
                              className="bg-neutral-900 border-yellow-900/20 text-xs h-24 resize-none focus:border-yellow-500/50"
                           />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
               );
             })}
           </Accordion>
        </TabsContent>

        {/* --- WEEKLY VIEW --- */}
        <TabsContent value="weekly" className="space-y-8 outline-none">
           {/* Criar Nova Semana */}
           <Card className="bg-[#121212] border-white/5">
             <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                   <div className="space-y-2 flex-1 w-full">
                      <Label className="text-xs uppercase font-bold text-neutral-400">Objetivo da Semana</Label>
                      <Input 
                        value={newWeekGoal}
                        onChange={(e) => setNewWeekGoal(e.target.value)}
                        placeholder="Foco principal..." 
                        className="bg-neutral-900 border-white/5" 
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-neutral-400">Início</Label>
                        <Input 
                          type="date" 
                          value={newWeekStart}
                          onChange={(e) => setNewWeekStart(e.target.value)}
                          className="bg-neutral-900 border-white/5" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-neutral-400">Fim</Label>
                        <Input 
                          type="date" 
                          value={newWeekEnd}
                          onChange={(e) => setNewWeekEnd(e.target.value)}
                          className="bg-neutral-900 border-white/5" 
                        />
                      </div>
                   </div>
                   <Button onClick={handleCreateWeek} className="w-full md:w-auto bg-red-600 hover:bg-red-500 font-bold">
                     <Plus className="w-4 h-4 mr-2" /> Criar Semana
                   </Button>
                </div>
             </CardContent>
           </Card>

           {/* Lista de Semanas */}
           <div className="space-y-6">
              {data.weeks.length === 0 && (
                <div className="text-center py-10 text-neutral-600 italic">
                   Nenhuma semana planejada. Comece criando uma acima.
                </div>
              )}

              {data.weeks.map((week) => (
                <Card key={week.id} className="bg-[#121212] border-white/5 overflow-hidden">
                  <CardHeader className="bg-neutral-900/30 border-b border-white/5 pb-3">
                     <div className="flex justify-between items-start">
                        <div>
                           <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-1">
                              <span>{new Date(week.startDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}</span>
                              <span>➔</span>
                              <span>{new Date(week.endDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}</span>
                              <span className="ml-2 text-red-500 font-bold">Revisão: {new Date(week.reviewDate).toLocaleDateString('pt-BR', {weekday: 'short', day: '2-digit'})}</span>
                           </div>
                           <CardTitle className="text-lg text-white font-bold">{week.goal || "Sem Objetivo Definido"}</CardTitle>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteWeek(week.id)}
                          className="h-8 w-8 text-neutral-600 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                     </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-neutral-500">Ações da Semana</Label>
                        <TaskList 
                          items={week.tasks} 
                          onAdd={(t) => addWeekTask(week.id, t)} 
                          onToggle={(taskId) => toggleWeekTask(week.id, taskId)}
                          placeholder="Adicionar tarefa para a semana..."
                        />
                     </div>

                     <div className="bg-neutral-900/30 p-4 rounded-xl space-y-4 border border-white/5">
                        <Label className="text-xs font-black uppercase text-neutral-400">Revisão Semanal</Label>
                        <div className="grid md:grid-cols-3 gap-3">
                           <Input 
                              placeholder="O que funcionou?" 
                              value={week.review.worked}
                              onChange={(e) => updateWeekReview(week.id, 'worked', e.target.value)}
                              className="bg-[#121212] border-white/5 text-xs"
                           />
                           <Input 
                              placeholder="O que não funcionou?" 
                              value={week.review.didntWork}
                              onChange={(e) => updateWeekReview(week.id, 'didntWork', e.target.value)}
                              className="bg-[#121212] border-white/5 text-xs"
                           />
                           <Input 
                              placeholder="O que melhorar?" 
                              value={week.review.improve}
                              onChange={(e) => updateWeekReview(week.id, 'improve', e.target.value)}
                              className="bg-[#121212] border-white/5 text-xs"
                           />
                        </div>
                     </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterplanPage;