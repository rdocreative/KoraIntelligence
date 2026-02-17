import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHabitTracker } from "@/hooks/useHabitTracker";
import { HabitCard } from "@/components/features/habit-tracker/HabitCard";
import { HabitMonthView } from "@/components/features/habit-tracker/HabitMonthView";
import { MonthlyChart } from "@/components/features/dashboard/MonthlyChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, CalendarDays, Activity, CheckCircle2, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const HabitsPage = () => {
  const { habits, completeHabit, history, addCustomHabit, totalPoints } = useHabitTracker();
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitDesc, setNewHabitDesc] = useState("");
  const [newHabitPoints, setNewHabitPoints] = useState([5]);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Padrão: dias de semana
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddHabit = () => {
    if (!newHabitTitle.trim() || selectedDays.length === 0) return;
    addCustomHabit(newHabitTitle, newHabitPoints[0], selectedDays, newHabitDesc);
    setNewHabitTitle("");
    setNewHabitDesc("");
    setNewHabitPoints([5]);
    setSelectedDays([1, 2, 3, 4, 5]);
    setIsDialogOpen(false);
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const DAY_NAMES = [
    { label: 'D', value: 0 },
    { label: 'S', value: 1 },
    { label: 'T', value: 2 },
    { label: 'Q', value: 3 },
    { label: 'Q', value: 4 },
    { label: 'S', value: 5 },
    { label: 'S', value: 6 },
  ];

  // Dashboard calculations
  const totalCompletions = history.reduce((acc, day) => acc + day.completedHabitIds.length, 0);
  const bestDay = history.length > 0 
    ? history.reduce((prev, current) => (prev.points > current.points) ? prev : current)
    : { points: 0, date: null };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-white glow-text uppercase italic tracking-tighter">Meus Hábitos</h1>
           <p className="text-neutral-500 font-medium">Construa sua rotina, forje seu destino.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-6 font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all">
              <Plus className="w-5 h-5 mr-2" /> NOVO HÁBITO
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#121212] border-white/10 text-white sm:max-w-md overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase italic">Criar Novo Hábito</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 pt-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-neutral-500 tracking-widest">Nome do Hábito</Label>
                <Input 
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder="Ex: Treinar, Meditar..."
                  className="bg-[#0a0a0a] border-white/10 focus:border-red-500/50 h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-neutral-500 tracking-widest">Descrição (Opcional)</Label>
                <Textarea 
                  value={newHabitDesc}
                  onChange={(e) => setNewHabitDesc(e.target.value)}
                  placeholder="Detalhes sobre este hábito..."
                  className="bg-[#0a0a0a] border-white/10 focus:border-red-500/50 min-h-[80px] rounded-xl resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-black text-neutral-500 tracking-widest">Dias da Semana</Label>
                <div className="flex justify-between gap-1">
                  {DAY_NAMES.map((day) => (
                    <button
                      key={day.value}
                      onClick={() => toggleDay(day.value)}
                      className={cn(
                        "w-10 h-10 rounded-xl font-black text-xs transition-all border",
                        selectedDays.includes(day.value) 
                          ? "bg-red-600 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]" 
                          : "bg-[#0a0a0a] border-white/5 text-neutral-600 hover:border-white/20"
                      )}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-black text-neutral-500 tracking-widest">Recompensa</Label>
                    <span className="text-red-500 font-black text-lg">{newHabitPoints[0]} XP</span>
                 </div>
                 <Slider 
                    value={newHabitPoints} 
                    onValueChange={setNewHabitPoints} 
                    max={20} 
                    min={1}
                    step={1} 
                    className="py-2"
                 />
              </div>

              <Button onClick={handleAddHabit} className="w-full bg-red-600 hover:bg-red-500 font-black h-14 rounded-2xl shadow-xl shadow-red-900/20">
                FORJAR HÁBITO
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <Tabs defaultValue="hoje" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-[#121212] p-1.5 border border-white/5 rounded-2xl mb-8 h-14">
          <TabsTrigger value="hoje" className="rounded-xl h-full font-bold data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
             <LayoutGrid className="w-4 h-4 mr-2" /> HOJE
          </TabsTrigger>
          <TabsTrigger value="mes" className="rounded-xl h-full font-bold data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
             <CalendarDays className="w-4 h-4 mr-2" /> MÊS
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="rounded-xl h-full font-bold data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
             <Activity className="w-4 h-4 mr-2" /> DASHBOARD
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hoje" className="space-y-4 focus-visible:outline-none animate-in slide-in-from-left-4 duration-300">
           {habits.map((habit, i) => (
             <HabitCard key={habit.id} habit={habit} onComplete={completeHabit} index={i} />
           ))}
           {habits.length === 0 && (
             <div className="text-center py-20 bg-[#121212] rounded-3xl border border-white/5 border-dashed">
               <p className="text-neutral-500 mb-4 font-medium">Você ainda não tem hábitos cadastrados.</p>
               <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-xl font-bold">
                 Criar Primeiro Hábito
               </Button>
             </div>
           )}
        </TabsContent>

        <TabsContent value="mes" className="focus-visible:outline-none animate-in zoom-in-95 duration-300">
           <HabitMonthView />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6 focus-visible:outline-none animate-in slide-in-from-right-4 duration-300">
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-[#121212] border-white/5 glass-card">
                <CardHeader className="pb-2">
                   <CardTitle className="text-xs font-black uppercase text-neutral-500 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Conclusões
                   </CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="text-3xl font-black text-white">{totalCompletions}</div>
                   <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">Hábitos totais realizados</p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#121212] border-white/5 glass-card">
                <CardHeader className="pb-2">
                   <CardTitle className="text-xs font-black uppercase text-neutral-500 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" /> XP Total
                   </CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="text-3xl font-black text-white">{totalPoints}</div>
                   <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">Pontos acumulados</p>
                </CardContent>
              </Card>

              <Card className="bg-[#121212] border-white/5 glass-card col-span-2 md:col-span-1">
                <CardHeader className="pb-2">
                   <CardTitle className="text-xs font-black uppercase text-neutral-500 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-red-500" /> Melhor Dia
                   </CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="text-3xl font-black text-red-500">{bestDay.points} XP</div>
                   <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">
                     {bestDay.date ? new Date(bestDay.date).toLocaleDateString('pt-BR') : 'N/A'}
                   </p>
                </CardContent>
              </Card>
           </div>
           
           <div className="pt-4">
             <h3 className="text-lg font-bold text-white mb-4 pl-1 border-l-4 border-red-500">Evolução de XP</h3>
             <MonthlyChart history={history} />
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HabitsPage;