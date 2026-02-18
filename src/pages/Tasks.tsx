import { ClipboardList, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";

const TasksPage = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Tarefas"
        subtitle="0 pendentes hoje"
        icon={ClipboardList}
        hexColor="#38bdf8"
        rightAction={
          <Button size="icon" className="h-8 w-8 rounded-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#141418]">
            <Plus size={16} strokeWidth={3} />
          </Button>
        }
      >
        <div className="flex gap-6">
          {['Hoje', 'Semana', 'Todas'].map((tab, i) => (
            <button 
              key={tab}
              className={`text-xs font-rajdhani font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors ${i === 0 ? 'text-white border-[#38bdf8]' : 'text-[#6b6b7a] border-transparent hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </PageHeader>
      
      <div className="flex items-center justify-center h-[400px] border border-dashed border-[#2a2a35] rounded-2xl bg-[#141418]/50">
        <p className="text-[#6b6b7a] font-exo2 text-sm">Sua lista de tarefas está vazia.</p>
      </div>
    </div>
  );
};

export default TasksPage;