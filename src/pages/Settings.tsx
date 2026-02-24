import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useHabitTracker } from "@/hooks/useHabitTracker";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAppColor } from "@/components/providers/ColorProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Trash2, 
  ShieldAlert,
  Save,
  LogOut,
  Palette
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { HexColorPicker } from "react-colorful";

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const { resetAllData } = useHabitTracker();
  const { signOut, user } = useAuth();
  const { color, setColor, presets } = useAppColor();
  const navigate = useNavigate();
  
  const [localName, setLocalName] = useState(settings.userName);
  const [hasChanges, setHasChanges] = useState(false);
  const [tempColor, setTempColor] = useState(color);

  // Sync temp color with global color when it changes
  useEffect(() => {
    setTempColor(color);
  }, [color]);

  // Sincronizar nome com Supabase se disponível
  useEffect(() => {
    if (user?.user_metadata?.name && settings.userName === "Marcos Eduardo") {
       // Se o nome for o padrão e tivermos um nome no Auth, usa o do Auth
       setLocalName(user.user_metadata.name);
       updateSettings({ userName: user.user_metadata.name });
    }
  }, [user]);

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

  const handleColorChange = (newColor: string) => {
    setTempColor(newColor);
    setColor(newColor);
  };

  const handleReset = () => {
    if (confirm("ATENÇÃO: Isso apagará TODOS os seus hábitos, histórico de XP e progresso permanentemente. Deseja continuar?")) {
      resetAllData();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
      toast.success("Você saiu da conta.");
    } catch (error) {
      toast.error("Erro ao sair da conta.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-white">Configurações</h2>
         <div className="flex gap-2">
            <Button 
                onClick={handleSave} 
                disabled={!hasChanges} 
                size="sm" 
                className={`font-rajdhani font-bold px-6 shadow-lg transition-all ${hasChanges ? "bg-[#4adbc8] hover:bg-[#3bc7b6] text-black" : "bg-neutral-800 text-neutral-500 opacity-50"}`}
            >
                <Save className="w-3.5 h-3.5 mr-2" /> Salvar
            </Button>
            <Button 
                onClick={handleLogout}
                size="sm"
                variant="outline"
                className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-white/5"
            >
                <LogOut className="w-3.5 h-3.5 mr-2" /> Sair
            </Button>
         </div>
      </div>

      <div className="grid gap-6">
        <Card className="glass-card border-none bg-[#121212]">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#4adbc8]" />
              <CardTitle className="text-lg font-bold text-white">Perfil</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-neutral-400">Email (Conta)</Label>
                <Input value={user?.email || ""} disabled className="bg-[#0a0a0a] border-white/10 opacity-60" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-neutral-400">Nome de Exibição</Label>
                <Input value={localName} onChange={handleNameChange} className="bg-[#0a0a0a] border-white/10" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Color Section */}
        <Card className="glass-card border-none bg-[#121212]">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5" style={{ color: tempColor }} />
              <CardTitle className="text-lg font-bold text-white">App Color</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col items-center gap-4">
                <div 
                  className="w-24 h-24 rounded-full shadow-lg border-4 border-[#1a1a1a]"
                  style={{ backgroundColor: tempColor }}
                />
                <Input 
                  value={tempColor} 
                  onChange={(e) => handleColorChange(e.target.value)} 
                  className="text-center font-mono w-32 bg-[#0a0a0a] border-white/10"
                />
              </div>
              
              <div className="flex-[2] flex flex-col gap-6">
                <div className="custom-color-picker">
                  <HexColorPicker color={tempColor} onChange={handleColorChange} style={{ width: '100%' }} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-neutral-400">Cores Predefinidas</Label>
                  <div className="flex flex-wrap gap-3">
                    {presets.map((p) => (
                      <button
                        key={p}
                        onClick={() => handleColorChange(p)}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${tempColor === p ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent'}`}
                        style={{ backgroundColor: p }}
                        aria-label={`Select color ${p}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
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
                <p className="text-sm font-bold text-white">Resetar Dados Locais</p>
                <p className="text-xs text-neutral-500">Apaga hábitos, XP e histórico salvos neste navegador.</p>
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