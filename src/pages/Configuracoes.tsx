import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Trash2, AlertTriangle, Save } from 'lucide-react';
import { toast } from 'sonner';

const Configuracoes = () => {
  const { theme, setTheme } = useTheme();

  const handleResetData = () => {
    if (confirm("Apagar todos os dados permanentemente?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 pt-12 space-y-8 pb-24">
      <h1 className="text-3xl font-black">Configurações</h1>

      <div className="grid gap-6">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <Label className="font-bold">Modo Escuro</Label>
              <Switch checked={theme === 'dark'} onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-100 dark:border-red-900/30">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle size={20} />
              Perigo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleResetData} className="w-full">
              <Trash2 size={16} className="mr-2" /> Apagar Todos os Dados
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuracoes;