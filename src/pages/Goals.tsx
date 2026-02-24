const GoalsPage = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 w-full">
      
      {/* Stats Cards (Movidos do Header antigo) */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#141418] border border-[#2a2a35] rounded-xl p-4 text-center">
            <span className="text-[10px] uppercase text-[#6b6b7a] font-bold tracking-wider block mb-1">Ativas</span>
            <div className="text-xl font-rajdhani font-bold text-white">0</div>
        </div>
        <div className="bg-[#141418] border border-[#2a2a35] rounded-xl p-4 text-center">
            <span className="text-[10px] uppercase text-[#6b6b7a] font-bold tracking-wider block mb-1">Concluídas</span>
            <div className="text-xl font-rajdhani font-bold text-[#34d399]">0</div>
        </div>
        <div className="bg-[#141418] border border-[#2a2a35] rounded-xl p-4 text-center">
            <span className="text-[10px] uppercase text-[#6b6b7a] font-bold tracking-wider block mb-1">Progresso</span>
            <div className="text-xl font-rajdhani font-bold text-white">0%</div>
        </div>
      </div>
      
      <div className="flex items-center justify-center h-[400px] border border-dashed border-[#2a2a35] rounded-2xl bg-[#141418]/50">
        <p className="text-[#6b6b7a] font-exo2 text-sm">Nenhuma meta definida.</p>
      </div>
    </div>
  );
};

export default GoalsPage;