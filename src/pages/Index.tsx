import React from "react";

const Index = () => {
  return (
    <div className="w-full flex flex-col">
      {/* CARDS DE STATS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#0f2220] border border-[#1e3a36] p-4 rounded-xl h-24 flex flex-col justify-center">
            <span className="text-[#3a6a65] text-xs font-semibold uppercase">Stat {i}</span>
            <span className="text-[#e8f5f3] text-xl font-bold">0{i}</span>
          </div>
        ))}
      </section>

      {/* ÁREA CENTRAL */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        {/* Calendário / Conteúdo Principal */}
        <div className="bg-[#0f2220] border border-[#1e3a36] rounded-xl p-5 min-h-[400px]">
          <h3 className="text-[#e8f5f3] font-bold mb-4">Progresso Semanal</h3>
          <div className="w-full h-full border-2 border-dashed border-[#1e3a36] rounded-lg flex items-center justify-center text-[#3a6a65]">
            Visualização do Calendário
          </div>
        </div>

        {/* Hábitos / Lateral Direita */}
        <div className="bg-[#0f2220] border border-[#1e3a36] rounded-xl p-5 min-h-[400px]">
          <h3 className="text-[#e8f5f3] font-bold mb-4">Hábitos de Hoje</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-[#071412] border border-[#1e3a36] rounded-lg flex items-center gap-3">
                <div className="w-5 h-5 rounded border border-[#38bdf8]" />
                <span className="text-sm text-[#e8f5f3]">Hábito {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;