import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const TasksPage = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      
      {/* Filtros e Ações (Movidos do Header antigo para o corpo da página) */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {['Hoje', 'Semana', 'Todas'].map((tab, i) => (
            <button 
              key={tab}
              className={`text-xs font-rajdhani font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors ${i === 0 ? 'bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20' : 'text-[#6b6b7a] hover:text-white hover:bg-white/5 border border-transparent'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <Button size="icon" className="h-8 w-8 rounded-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#141418] shadow-[0_0_10px_rgba(56,189,248,0.3)]">
            <Plus size={16} strokeWidth={3} />
        </Button>
      </div>
      
      <div className="flex items-center justify-center h-[400px] border border-dashed border-[#2a2a35] rounded-2xl bg-[#141418]/50">
        <p className="text-[#6b6b7a] font-exo2 text-sm">Sua lista de tarefas está vazia.</p>
      </div>
    </div>
  );
};

export default TasksPage;