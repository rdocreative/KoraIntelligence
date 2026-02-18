import { Zap } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const MissionsPage = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Missões"
        subtitle="Complete e ganhe XP"
        icon={Zap}
        hexColor="#f0b429"
        badge="+XP"
      >
        <div className="flex gap-6">
          {['Ativas', 'Diárias', 'Concluídas'].map((tab, i) => (
            <button 
              key={tab}
              className={`text-xs font-rajdhani font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors ${i === 0 ? 'text-white border-[#f0b429]' : 'text-[#6b6b7a] border-transparent hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </PageHeader>
      
      <div className="flex items-center justify-center h-[400px] border border-dashed border-[#2a2a35] rounded-2xl bg-[#141418]/50">
        <p className="text-[#6b6b7a] font-exo2 text-sm">Sem missões ativas no momento.</p>
      </div>
    </div>
  );
};

export default MissionsPage;