import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useHabitTracker } from "@/hooks/useHabitTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Trash2, 
  ShieldAlert,
  Save
} from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const { resetAllData } = useHabitTracker();
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
    toast.success("Configurações salvas!", { description: "Suas preferências foram atualizadas." });
  };

  const handleReset = () => {
    if (confirm("ATENÇÃO: Isso apagará TODOS os seus hábitos, histórico de XP e progresso permanentemente. Deseja continuar?")) {
      resetAllData();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-white glow-text uppercase italic tracking-tighter">Configurações</h1>
          <p className="text-neutral-500 font-medium">Ajuste sua experiência e gerencie seus dados.</p>
        </div>
        
        <Button onClick={handleSave} disabled={!hasChanges} className={`font-bold px-6 shadow-lg transition-all ${hasChanges ? "bg-red-600 hover:bg-red-500 text-white" : "bg-neutral-800 text-neutral-500 opacity-50"}`}>
          <Save className="w-4 h-4 mr-2" /> Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="glass-card border-none bg-[#121212]">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-red-500" />
              <CardTitle className="text-lg font-bold text-white">Perfil</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-neutral-400">Nome de Exibição</Label>
              <Input value={localName} onChange={handleNameChange} className="bg-[#0a0a0a] border-white/10" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-red-900/20 bg-red-950/5">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="w-5 h-5" />
              <CardTitle className="text-lg font-bold">Zona de Perigo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a]/50 rounded-2xl border border-red-900/10">
              <div>
                <p className="text-sm font-bold text-white">Resetar Tudo</p>
                <p className="text-xs text-neutral-500">Apaga hábitos, XP e histórico.</p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleReset} className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20">
                <Trash2 className="w-4 h-4 mr-2" /> Resetar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;