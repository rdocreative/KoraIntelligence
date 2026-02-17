import { useHabitTracker } from '@/hooks/useHabitTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Download, 
  Sheet as SheetIcon, 
  Moon, 
  Sun,
  Trash2,
  AlertTriangle,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

const Settings = () => {
  const { history } = useHabitTracker();
  const { theme, setTheme } = useTheme();

  const handleExport = () => {
    const headers = ['Date', 'Points', 'Habit IDs'];
    const rows = history.map(d => [d.date, d.points, d.completedHabitIds.join('|')]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mindset_rewards_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Histórico exportado com sucesso!');
  };

  const handleResetData = () => {
    if (confirm("Tem certeza que deseja apagar todos os seus dados? Isso não pode ser desfeito.")) {
      localStorage.removeItem('mindset_history');
      localStorage.removeItem('mindset_custom_habits');
      toast.success('Todos os dados foram resetados.');
      window.location.reload();
    }
  };

  const handleSaveSettings = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 pt-8 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="mb-6">
           <h1 className="text-2xl font-black text-slate-900 dark:text-white">Configurações</h1>
           <p className="text-slate-500 dark:text-slate-400">Personalize sua experiência</p>
        </header>

        <div className="grid gap-6">
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sun className="dark:hidden" size={20} />
                <Moon className="hidden dark:block" size={20} />
                Aparência
                </CardTitle>
                <CardDescription>Customize como o app se parece para você.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="space-y-0.5">
                    <Label className="text-base font-bold">Modo Escuro</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Ativa o tema escuro para descansar seus olhos.</p>
                </div>
                <Switch 
                    checked={theme === 'dark'} 
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                />
                </div>
            </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-green-600 dark:text-green-400">
                <SheetIcon size={20} />
                Dados e Exportação
                </CardTitle>
                <CardDescription>Gerencie seu histórico de hábitos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <div className="font-bold">Backup em CSV</div>
                    <p className="text-xs text-slate-500">Exporte seu progresso para Excel ou Google Sheets.</p>
                </div>
                <Button 
                    onClick={handleExport}
                    className="w-full sm:w-auto bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 font-bold"
                >
                    <Download size={16} className="mr-2" />
                    Baixar Histórico
                </Button>
                </div>
            </CardContent>
            </Card>

            <Card className="border-red-100 dark:border-red-900/30 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="bg-red-50 dark:bg-red-950/20 px-6 py-4 border-b border-red-100 dark:border-red-900/30">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle size={20} />
                Zona de Perigo
                </CardTitle>
            </div>
            <CardContent className="pt-6">
                <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <div className="font-bold text-red-700 dark:text-red-400">Resetar todos os dados</div>
                    <p className="text-xs text-red-600/70 dark:text-red-400/60">Isso apagará permanentemente todos os seus pontos.</p>
                </div>
                <Button 
                    variant="destructive"
                    onClick={handleResetData}
                    className="w-full sm:w-auto font-bold bg-red-600 hover:bg-red-700"
                >
                    <Trash2 size={16} className="mr-2" />
                    Apagar Tudo
                </Button>
                </div>
            </CardContent>
            </Card>
        </div>

        <div className="flex justify-end pt-4 pb-8">
            <Button 
            onClick={handleSaveSettings}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
            >
            <Save size={20} className="mr-2" />
            Salvar Alterações
            </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;