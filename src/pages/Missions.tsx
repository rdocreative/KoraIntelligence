const MissionsPage = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      
      {/* Abas (Movidas do Header antigo) */}
      <div className="flex gap-2 pb-2 border-b border-[#2a2a35]">
        {['Ativas', 'Diárias', 'Concluídas'].map((tab, i) => (
          <button 
            key={tab}
            className={`text-xs font-rajdhani font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors ${i === 0 ? 'bg-[#f0b429]/10 text-[#f0b429]' : 'text-[#6b6b7a] hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="flex items-center justify-center h-[400px] border border-dashed border-[#2a2a35] rounded-2xl bg-[#141418]/50">
        <p className="text-[#6b6b7a] font-exo2 text-sm">Sem missões ativas no momento.</p>
      </div>
    </div>
  );
};

export default MissionsPage;