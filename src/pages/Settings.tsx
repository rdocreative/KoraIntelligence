import { useState, useEffect, useRef } from "react";
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
  const { color, setColor, saveColor, cancelColor, presets } = useAppColor();
  const navigate = useNavigate();
  
  const [localName, setLocalName] = useState(settings.userName);
  const [nameHasChanges, setNameHasChanges] = useState(false);
  const [colorHasChanges, setColorHasChanges] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Estado local para o input hex permitir digitação livre
  const [localHex, setLocalHex] = useState(color.replace('#', ''));

  const shouldRevertRef = useRef(true);

  // Sincroniza o input local quando a cor muda externamente (picker ou presets)
  useEffect(() => {
    const cleanColor = color.replace('#', '');
    if (cleanColor.toUpperCase() !== localHex.toUpperCase()) {
      setLocalHex(cleanColor);
    }
  }, [color]);

  useEffect(() => {
    if (user?.user_metadata?.name && settings.userName === "Marcos Eduardo") {
       setLocalName(user.user_metadata.name);
       updateSettings({ userName: user.user_metadata.name });
    }
  }, [user]);

  useEffect(() => {
    setLocalName(settings.userName);
  }, [settings.userName]);

  useEffect(() => {
    return () => {
      if (shouldRevertRef.current) {
        cancelColor();
      }
    };
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalName(e.target.value);
    setNameHasChanges(e.target.value !== settings.userName);
  };

  const handleSave = () => {
    if (nameHasChanges) {
      updateSettings({ userName: localName });
      setNameHasChanges(false);
    }

    if (colorHasChanges) {
      saveColor();
      setColorHasChanges(false);
      shouldRevertRef.current = false;
      setTimeout(() => { shouldRevertRef.current = true; }, 100);
    }
    
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
    toast.success("Configurações salvas!");
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    setColorHasChanges(true);
    shouldRevertRef.current = true;
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '');
    if (val.length <= 6) {
      setLocalHex(val);
      // Aplica a cor se for um hex válido (3 ou 6 caracteres)
      if (val.length === 3 || val.length === 6) {
        handleColorChange(`#${val}`);
      }
    }
  };

  const handleHexBlur = () => {
    // Ao sair do campo, restaura o hex completo se estiver incompleto
    setLocalHex(color.replace('#', ''));
  };

  const handleReset = () => {
    if (confirm("ATENÇÃO: Isso apagará TODOS os seus dados permanentemente.")) {
      resetAllData();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
      toast.success("Você saiu da conta.");
    } catch (error) {
      toast.error("Erro ao sair.");
    }
  };

  const hasAnyChanges = nameHasChanges || colorHasChanges;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 w-full">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-white">Configurações</h2>
         <div className="flex gap-2">
            <Button 
                onClick={handleSave} 
                disabled={!hasAnyChanges && !justSaved} 
                size="sm" 
                className={`font-rajdhani font-bold px-6 shadow-lg transition-all ${hasAnyChanges || justSaved ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-neutral-800 text-neutral-500 opacity-50"}`}
            >
                <Save className="w-3.5 h-3.5 mr-2" /> 
                {justSaved ? "Salvo!" : "Salvar"}
            </Button>
            <Button onClick={handleLogout} size="sm" variant="outline" className="border-neutral-700 text-neutral-300 hover:text-white">
                <LogOut className="w-3.5 h-3.5 mr-2" /> Sair
            </Button>
         </div>
      </div>

      <div className="grid gap-6">
        <Card className="glass-card border-none bg-[#121212]">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-bold text-white">Perfil</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-neutral-400">Email</Label>
                <Input value={user?.email || ""} disabled className="bg-[#0a0a0b] border-white/10 opacity-60" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-neutral-400">Nome</Label>
                <Input value={localName} onChange={handleNameChange} className="bg-[#0a0a0a] border-white/10" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none bg-[#121212]">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5" style={{ color: color }} />
              <CardTitle className="text-lg font-bold text-white">Cor do App</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col items-center gap-4">
                <div 
                  className="w-24 h-24 rounded-full shadow-lg border-4 border-[#1a1a1a]"
                  style={{ backgroundColor: color }}
                />
                <div className="flex items-center relative">
                   <span className="absolute left-3 text-neutral-500">#</span>
                   <Input 
                    value={localHex}
                    onChange={handleHexInputChange}
                    onBlur={handleHexBlur}
                    className="text-center font-mono w-32 bg-[#0a0a0a] border-white/10 pl-4 uppercase"
                    maxLength={6}
                  />
                </div>
              </div>
              
              <div className="flex-[2] flex flex-col gap-6">
                <HexColorPicker color={color} onChange={handleColorChange} style={{ width: '100%' }} />
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-neutral-400">Presets</Label>
                  <div className="flex flex-wrap gap-3">
                    {presets.map((p) => (
                      <button
                        key={p}
                        onClick={() => handleColorChange(p)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${color.toLowerCase() === p.toLowerCase() ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: p }}
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
                <p className="text-sm font-bold text-white">Resetar Dados</p>
                <p className="text-xs text-neutral-500">Apaga tudo o que está salvo localmente.</p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleReset} className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white">
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