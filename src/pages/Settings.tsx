"use client";

import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Trash2, 
  LogOut,
  Bell,
  Moon,
  Volume2,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const { signOut, user } = useAuth();
  
  const [localName, setLocalName] = useState(settings.userName);

  const handleSave = () => {
    updateSettings({ userName: localName });
    toast.success("Configurações salvas!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Profile Section */}
      <div className="panel overflow-hidden">
         <div className="p-6 border-b-2 border-duo-gray bg-duo-sidebar/50">
            <h2 className="text-xl font-extrabold text-white uppercase flex items-center gap-2">
               <User className="text-duo-primary" /> Perfil
            </h2>
         </div>
         <div className="p-6 space-y-6">
            <div className="grid gap-2">
               <label className="text-xs font-black uppercase text-gray-500 tracking-widest">Nome de Exibição</label>
               <Input 
                  value={localName} 
                  onChange={(e) => setLocalName(e.target.value)}
                  className="bg-duo-bg border-2 border-duo-gray h-12 rounded-xl text-white font-bold focus:border-duo-primary focus:ring-0" 
               />
            </div>
            <div className="grid gap-2">
               <label className="text-xs font-black uppercase text-gray-500 tracking-widest">Email</label>
               <div className="h-12 flex items-center px-4 rounded-xl bg-duo-sidebar border-2 border-duo-gray text-gray-500 font-bold">
                  {user?.email || "usuario@exemplo.com"}
               </div>
            </div>
            
            <div className="flex justify-end">
               <Button onClick={handleSave} className="btn-primary h-12 px-8">Salvar Alterações</Button>
            </div>
         </div>
      </div>

      {/* Preferences Section */}
      <div className="panel overflow-hidden">
         <div className="p-6 border-b-2 border-duo-gray bg-duo-sidebar/50">
            <h2 className="text-xl font-extrabold text-white uppercase flex items-center gap-2">
               <Settings className="text-card-purple" /> Preferências
            </h2>
         </div>
         <div className="divide-y-2 divide-duo-gray">
            <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-duo-sidebar border-2 border-duo-gray flex items-center justify-center group-hover:border-card-purple group-hover:text-card-purple transition-colors">
                     <Bell size={20} />
                  </div>
                  <span className="font-bold text-white uppercase">Notificações</span>
               </div>
               <div className="w-12 h-6 bg-card-green rounded-full relative shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
               </div>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-duo-sidebar border-2 border-duo-gray flex items-center justify-center group-hover:border-card-purple group-hover:text-card-purple transition-colors">
                     <Moon size={20} />
                  </div>
                  <span className="font-bold text-white uppercase">Tema Escuro</span>
               </div>
               <div className="w-12 h-6 bg-card-green rounded-full relative shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
               </div>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-duo-sidebar border-2 border-duo-gray flex items-center justify-center group-hover:border-card-purple group-hover:text-card-purple transition-colors">
                     <Volume2 size={20} />
                  </div>
                  <span className="font-bold text-white uppercase">Efeitos Sonoros</span>
               </div>
               <div className="w-12 h-6 bg-duo-gray rounded-full relative shadow-inner">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full shadow-sm" />
               </div>
            </div>
         </div>
      </div>

      {/* Danger Zone */}
      <div className="flex flex-col gap-4 pt-4">
         <Button 
            variant="outline" 
            className="h-14 bg-duo-panel border-2 border-duo-gray hover:bg-card-red/10 hover:border-card-red hover:text-card-red text-gray-400 font-extrabold uppercase tracking-wider rounded-2xl justify-between group"
            onClick={() => signOut()}
         >
            <span className="flex items-center gap-3"><LogOut /> Sair da Conta</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform"/>
         </Button>
         
         <Button 
            variant="outline" 
            className="h-14 bg-duo-panel border-2 border-duo-gray hover:bg-card-red/10 hover:border-card-red hover:text-card-red text-gray-400 font-extrabold uppercase tracking-wider rounded-2xl justify-between group"
         >
            <span className="flex items-center gap-3"><Trash2 /> Excluir Dados</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform"/>
         </Button>
      </div>
    </div>
  );
};

export default Settings;