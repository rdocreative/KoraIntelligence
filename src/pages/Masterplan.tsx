import { OnboardingWizard } from "@/components/masterplan/OnboardingWizard";
import { useState, useEffect } from "react";
import { useMasterplan } from "@/hooks/useMasterplan";

const MasterPlan = () => {
  const { data } = useMasterplan();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Se o objetivo anual estiver vazio, assume-se que o onboarding ainda não foi feito
    if (!data.annual.objective) {
      setShowOnboarding(true);
    }
  }, [data.annual.objective]);

  return (
    <div 
      className="min-h-screen w-full relative overflow-x-hidden bg-[#050505]"
      style={{ 
        backgroundImage: "url('/Background-MasterPlan.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay para garantir legibilidade dos componentes */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />

      {/* Conteúdo Principal */}
      <div className="relative z-10 container mx-auto p-6 md:p-10">
        {showOnboarding && (
          <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
        )}
        
        {!showOnboarding && (
          <div className="space-y-8 animate-in fade-in duration-700">
             <header className="flex flex-col gap-2">
                <span className="text-red-500 font-bold tracking-[0.3em] uppercase text-xs">Vetor de Expansão</span>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                  Master<span className="text-red-600">Plan</span>
                  <div className="h-1 flex-1 bg-gradient-to-r from-red-600/50 to-transparent" />
                </h1>
             </header>

             {/* Aqui entrarão os componentes de visualização do MasterPlan (Timeline, Pilares, etc) */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0A0A0A]/80 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                   <h3 className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-4">Alvo Anual</h3>
                   <p className="text-2xl font-bold text-white uppercase tracking-tight leading-tight">
                     {data.annual.objective || "Aguardando definição estratégica..."}
                   </p>
                </div>
                
                <div className="bg-[#0A0A0A]/80 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                   <h3 className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-4">Critério de Sucesso</h3>
                   <p className="text-lg font-medium text-neutral-300">
                     {data.annual.successCriteria || "Defina os números do seu alvo."}
                   </p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterPlan;