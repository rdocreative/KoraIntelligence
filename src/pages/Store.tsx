import { ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const StorePage = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Loja"
        subtitle="Troque seus XP por recompensas"
        icon={ShoppingBag}
        hexColor="#fb923c"
        badge="0 XP"
      >
        <div className="flex gap-6">
          {['Destaques', 'Boosters', 'Cosméticos'].map((tab, i) => (
            <button 
              key={tab}
              className={`text-xs font-rajdhani font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors ${i === 0 ? 'text-white border-[#fb923c]' : 'text-[#6b6b7a] border-transparent hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </PageHeader>
      
      <div className="flex items-center justify-center h-[400px] border border-dashed border-[#2a2a35] rounded-2xl bg-[#141418]/50">
        <p className="text-[#6b6b7a] font-exo2 text-sm">Itens da loja indisponíveis.</p>
      </div>
    </div>
  );
};

export default StorePage;