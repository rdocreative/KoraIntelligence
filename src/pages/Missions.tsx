"use client";

import { Zap, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const MissionsPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Daily vs Weekly tabs as pills */}
      <div className="flex gap-4 border-b-2 border-duo-gray pb-6">
        <Button className="btn-primary h-12 px-8">Diárias</Button>
        <Button className="bg-transparent text-gray-500 font-extrabold uppercase hover:text-white h-12 px-8 border-2 border-transparent hover:border-duo-gray rounded-2xl">
            Semanais
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Mission Card */}
        <div className="panel p-2 pr-6 flex items-center gap-4 group">
           {/* Image/Icon Area */}
           <div className="w-24 h-24 bg-duo-sidebar rounded-2xl border-2 border-duo-gray flex items-center justify-center shrink-0">
              <Zap size={40} className="text-card-orange fill-card-orange" />
           </div>

           <div className="flex-1 py-2">
              <div className="flex justify-between items-center mb-1">
                 <h3 className="text-lg font-extrabold text-white uppercase">Guerreiro do Foco</h3>
                 <span className="text-card-orange font-black flex items-center gap-1 bg-card-orange/10 px-2 py-1 rounded-lg">
                    <Star size={14} fill="currentColor"/> 50 XP
                 </span>
              </div>
              <p className="text-gray-500 font-bold text-sm mb-3">Complete 5 tarefas de alta prioridade.</p>
              
              <div className="h-4 bg-duo-sidebar rounded-full border-2 border-duo-sidebar overflow-hidden relative">
                 <div className="h-full bg-card-orange w-[60%] relative z-10" />
                 <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white z-20 uppercase tracking-widest">
                    3 / 5
                 </span>
              </div>
           </div>

           <Button className="bg-duo-gray text-gray-400 font-bold h-12 px-6 rounded-xl shadow-none cursor-not-allowed uppercase border-2 border-transparent">
              Em andamento
           </Button>
        </div>

        {/* Completed Mission */}
        <div className="panel p-2 pr-6 flex items-center gap-4 opacity-60">
           <div className="w-24 h-24 bg-duo-sidebar rounded-2xl border-2 border-duo-gray flex items-center justify-center shrink-0">
              <Shield size={40} className="text-card-purple fill-card-purple" />
           </div>

           <div className="flex-1 py-2">
              <div className="flex justify-between items-center mb-1">
                 <h3 className="text-lg font-extrabold text-white uppercase">Guardião da Rotina</h3>
                 <span className="text-card-purple font-black flex items-center gap-1 bg-card-purple/10 px-2 py-1 rounded-lg">
                    <Star size={14} fill="currentColor"/> 100 XP
                 </span>
              </div>
              <p className="text-gray-500 font-bold text-sm mb-3">Complete todos os hábitos por 3 dias seguidos.</p>
              
              <div className="h-4 bg-duo-sidebar rounded-full border-2 border-duo-sidebar overflow-hidden relative">
                 <div className="h-full bg-card-purple w-full relative z-10" />
                 <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white z-20 uppercase tracking-widest">
                    COMPLETO
                 </span>
              </div>
           </div>

           <Button className="bg-card-green text-white font-extrabold h-12 px-6 rounded-xl shadow-3d-green uppercase border-2 border-card-green hover:-translate-y-1">
              Coletar
           </Button>
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;