"use client";

import React from "react";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/components/providers/AuthProvider";
import { User, Bell, Shield, Palette, LogOut, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const { signOut, user } = useAuth();

  const sections = [
    { 
      title: "Perfil", 
      icon: User, 
      color: "blue",
      items: [
        { label: "Nome de Usuário", value: settings.userName, type: "input" },
        { label: "Email", value: user?.email, type: "text" },
      ]
    },
    { 
      title: "Preferências", 
      icon: Palette, 
      color: "purple",
      items: [
        { label: "Efeitos de Brilho", value: settings.glowEffects, type: "switch" },
        { label: "Versículo Diário", value: settings.showDailyVerse, type: "switch" },
      ]
    },
    { 
      title: "Notificações", 
      icon: Bell, 
      color: "orange",
      items: [
        { label: "Alertas Push", value: settings.notificationsEnabled, type: "switch" },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Ajustes do Sistema</h2>
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-2 px-6 py-3 bg-card-red/10 border-2 border-card-red shadow-red text-card-red rounded-2xl font-black uppercase tracking-widest text-xs hover:-translate-y-0.5 transition-all"
        >
          <LogOut size={16} /> Sair
        </button>
      </div>

      <div className="grid gap-8">
        {sections.map((section, idx) => (
          <div key={idx} className="duo-panel overflow-hidden">
            <div className={cn(
              "p-6 border-b-2 border-border flex items-center gap-4 bg-sidebar/30"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-panel border-2",
                `bg-card-${section.color}/20 border-card-${section.color}/40 text-card-${section.color}`
              )}>
                <section.icon size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest">{section.title}</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div>
                    <div className="text-sm font-black text-white uppercase tracking-tight mb-1">{item.label}</div>
                    <div className="text-xs text-text-muted font-bold">{item.type === 'switch' ? 'Ativar ou desativar esta opção' : item.value}</div>
                  </div>
                  
                  {item.type === 'switch' && (
                    <button 
                      className={cn(
                        "w-14 h-8 rounded-full border-2 transition-all p-1 flex items-center",
                        item.value ? "bg-card-green border-card-green shadow-green" : "bg-sidebar border-duo-gray"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full bg-white transition-all shadow-md",
                        item.value ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  )}

                  {item.type === 'input' && (
                    <button className="px-4 py-2 bg-sidebar border-2 border-duo-gray text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-panel transition-all">
                      Alterar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="duo-panel border-card-red/30 bg-card-red/5 p-8">
           <div className="flex items-center gap-4 mb-6">
              <Shield className="text-card-red" size={32} />
              <div>
                 <h3 className="text-lg font-black text-card-red uppercase tracking-widest">Zona Crítica</h3>
                 <p className="text-xs text-text-muted font-bold">Ações irreversíveis para sua conta</p>
              </div>
           </div>
           <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 flex items-center justify-center gap-3 py-4 bg-sidebar border-2 border-duo-gray text-text-muted font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-card-red hover:text-white hover:border-card-red transition-all group">
                <Trash2 size={18} /> Resetar Dados do Mês
              </button>
              <button className="flex-1 flex items-center justify-center gap-3 py-4 bg-sidebar border-2 border-duo-gray text-text-muted font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-card-red hover:text-white hover:border-card-red transition-all">
                <Shield size={18} /> Excluir Conta Permanentemente
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;