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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Botão de Salvar (Movido do Header) */}
      <div className="flex justify-end">
         <Button 
            onClick={handleSave} 
            disabled={!hasChanges} 
            size="sm" 
            className={`font-rajdhani font-bold px-6 shadow-lg transition-all ${hasChanges ? "bg-red-600 hover:bg-red-500 text-white" : "bg-neutral-800 text-neutral-500 opacity-50"}`}
         >
            <Save className="w-3.5 h-3.5 mr-2" /> Salvar Alterações
         </Button>
      </div>

      <div className="grid gap-6">
        <Card className="glass-card border-none bg-white/[0.10] backdrop-blur-md">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-red-500" />
              <CardTitle className="text-lg font-bold text-white">Perfil</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-neutral-400">Nome de Exibição</Label>
              <Input value={localName} onChange={handleNameChange} className="bg-black/20 border-white/10 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-red-900/20 bg-red-950/10 backdrop-blur-md">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="w-5 h-5" />
              <CardTitle className="text-lg font-bold">Zona de Perigo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-2xl border border-red-900/10">
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