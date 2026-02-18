import { Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const CommunityPage = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Comunidade"
        subtitle="Conecte-se e evolua junto"
        icon={Users}
        hexColor="#a78bfa"
      >
        <div className="flex gap-6">
          {['Feed', 'Ranking', 'Grupos'].map((tab, i) => (
            <button 
              key={tab}
              className={`text-xs font-rajdhani font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors ${i === 0 ? 'text-white border-[#a78bfa]' : 'text-[#6b6b7a] border-transparent hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </PageHeader>
      
      <div className="flex items-center justify-center h-[400px] border border-dashed border-[#2a2a35] rounded-2xl bg-[#141418]/50">
        <p className="text-[#6b6b7a] font-exo2 text-sm">A comunidade está silenciosa.</p>
      </div>
    </div>
  );
};

export default CommunityPage;