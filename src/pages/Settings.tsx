import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Trash2, 
  Sparkles, 
  BookOpen,
  LogOut,
  ShieldAlert,
  Save
} from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { settings, updateSettings, resetData } = useSettings();
  const [localName, setLocalName] = useState(settings.userName);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalName(settings.userName);
  }, [settings.userName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalName(e.target.value);
    setHasChanges(e.target.value !== settings.userName);
  };

  const handleSave = () => {
    updateSettings({ userName: localName });
    setHasChanges(false);
    toast.success("Configurações salvas com sucesso!", {
      description: "Suas preferências foram atualizadas."
    });
  };

  const handleReset = () => {
    if (confirm("Isso apagará todo o seu progresso, hábitos e configurações. Deseja continuar?")) {
      resetData();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-white glow-text uppercase italic tracking-tighter">
            Configurações
          </h1>
          <p className="text-neutral-500 font-medium">Ajuste sua experiência e gerencie seus dados.</p>
        </div>
        
        <Button 
          onClick={handleSave}
          disabled={!hasChanges}
          className={`
            font-bold px-6 shadow-lg transition-all duration-300
            ${hasChanges 
              ? "bg-red-600 hover:bg-red-500 text-white shadow-red-900/20 hover:shadow-red-500/30 scale-100" 
              : "bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50 scale-95"
            }
          `}
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Perfil */}
        <Card className="glass-card border-none bg-[#121212]">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-red-500" />
              <div>
                <CardTitle className="text-lg font-bold text-white">Perfil Público</CardTitle>
                <CardDescription className="text-neutral-500">Como os outros (e o sistema) verão você.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-black uppercase text-neutral-400 tracking-widest">Nome de Exibição</Label>
              <Input 
                id="username" 
                value={localName} 
                onChange={handleNameChange}
                className="bg-[#0a0a0a] border-white/10 rounded-xl focus:border-red-500/50 focus:ring-red-500/20 text-white"
                placeholder="Digite seu nome..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferências */}
        <Card className="glass-card border-none bg-[#121212]">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500" />
              <div>
                <CardTitle className="text-lg font-bold text-white">Preferências de Interface</CardTitle>
                <CardDescription className="text-neutral-500">Personalize o visual e as notificações.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-neutral-400" />
                  <Label className="text-sm font-bold text-white">Frase do Dia (Daily Verse)</Label>
                </div>
                <p className="text-xs text-neutral-500">Exibir motivação ao abrir o app.</p>
              </div>
              <Switch 
                checked={settings.showDailyVerse} 
                onCheckedChange={(checked) => updateSettings({ showDailyVerse: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-neutral-400" />
                  <Label className="text-sm font-bold text-white">Efeitos de Brilho (Glow)</Label>
                </div>
                <p className="text-xs text-neutral-500">Habilitar efeitos visuais neon.</p>
              </div>
              <Switch 
                checked={settings.glowEffects} 
                onCheckedChange={(checked) => updateSettings({ glowEffects: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-neutral-400" />
                  <Label className="text-sm font-bold text-white">Notificações In-App</Label>
                </div>
                <p className="text-xs text-neutral-500">Alertas de progresso e XP.</p>
              </div>
              <Switch 
                checked={settings.notificationsEnabled} 
                onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Zona de Perigo */}
        <Card className="glass-card border border-red-900/20 bg-red-950/5">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <div>
                <CardTitle className="text-lg font-bold text-red-500">Zona de Perigo</CardTitle>
                <CardDescription className="text-red-900/60 font-medium">Ações irreversíveis para sua conta.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a]/50 rounded-2xl border border-red-900/10">
              <div>
                <p className="text-sm font-bold text-white">Resetar Todo o Progresso</p>
                <p className="text-xs text-neutral-500">Limpa XP, hábitos e histórico permanentemente.</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleReset}
                className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Resetar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
           <Button variant="ghost" className="text-neutral-600 hover:text-red-500 gap-2 font-bold text-xs uppercase tracking-widest">
             <LogOut className="w-4 h-4" />
             Sair da Sessão
           </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;