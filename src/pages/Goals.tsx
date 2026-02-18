import { Target } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const GoalsPage = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Metas"
        subtitle="0 de 0 concluídas"
        icon={Target}
        hexColor="#34d399"
        badge="Mensal"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
                <span className="text-[10px] uppercase text-[#6b6b7a] font-bold tracking-wider">Ativas</span>
                <div className="text-lg font-rajdhani font-bold text-white">0</div>
            </div>
            <div className="space-y-1 border-x border-[#2a2a35]">
                <span className="text-[10px] uppercase text-[#6b6b7a] font-bold tracking-wider">Concluídas</span>
                <div className="text-lg font-rajdhani font-bold text-[#34d399]">0</div>
            </div>
            <div className="space-y-1">
                <span className="text-[10px] uppercase text-[#6b6b7a] font-bold tracking-wider">Progresso</span>
                <div className="text-lg font-rajdhani font-bold text-white">0%</div>
            </div>
        </div>
      </PageHeader>
      
      <div className="flex items-center justify-center h-[400px] border border-dashed border-[#2a2a35] rounded-2xl bg-[#141418]/50">
        <p className="text-[#6b6b7a] font-exo2 text-sm">Nenhuma meta definida.</p>
      </div>
    </div>
  );
};

export default GoalsPage;