"use client";

import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { Trophy, Star, Zap, TrendingUp, Target, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const DATA_EVOLUTION = [
  { name: 'Seg', habitos: 4, metas: 2 },
  { name: 'Ter', habitos: 3, metas: 3 },
  { name: 'Qua', habitos: 6, metas: 4 },
  { name: 'Qui', habitos: 5, metas: 3 },
  { name: 'Sex', habitos: 7, metas: 5 },
  { name: 'Sáb', habitos: 2, metas: 2 },
  { name: 'Dom', habitos: 5, metas: 4 },
];

const DATA_DISTRIBUTION = [
  { name: 'Saúde', value: 400, color: '#22d3ee' },
  { name: 'Foco', value: 300, color: '#f97316' },
  { name: 'Rotina', value: 300, color: '#4ade80' },
  { name: 'Mente', value: 200, color: '#a855f7' },
];

const DashboardOverview = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sistema de Gamificação / XP */}
      <div className="bg-[#202f36] border border-white/10 rounded-[32px] p-6 shadow-[0_6px_0_0_#020305] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Trophy size={120} className="text-[#22d3ee]" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-[4px] border-[#22d3ee] flex items-center justify-center bg-[#0a0f14] shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <span className="text-[32px] font-[950] text-[#22d3ee]">12</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#22d3ee] text-[#06090e] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
              NÍVEL
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-white font-[900] text-xl uppercase tracking-tight">Mestre da Rotina</h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Você está no top 5% este mês!</p>
              </div>
              <div className="text-right">
                <span className="text-[#22d3ee] font-black text-lg">2.450 / 3.000</span>
                <span className="text-white/20 font-black text-sm ml-1">XP</span>
              </div>
            </div>
            
            <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-1">
              <div 
                className="h-full bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] rounded-full transition-all duration-1000" 
                style={{ width: '75%' }}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[11px] font-bold text-white/70">Streak: 15 Dias</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <Zap size={14} className="text-orange-400 fill-orange-400" />
                <span className="text-[11px] font-bold text-white/70">Combo: x1.5 XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Evolução Semanal */}
        <div className="bg-[#202f36] border border-white/10 rounded-[24px] p-6 shadow-[0_4px_0_0_#020305]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#22d3ee]/10 rounded-lg text-[#22d3ee]">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-white font-[800] text-sm uppercase tracking-widest">Evolução Semanal</h3>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_EVOLUTION}>
                <defs>
                  <linearGradient id="colorHabit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#16222b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="habitos" 
                  stroke="#22d3ee" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorHabit)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza - Distribuição de Foco */}
        <div className="bg-[#202f36] border border-white/10 rounded-[24px] p-6 shadow-[0_4px_0_0_#020305]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#f97316]/10 rounded-lg text-[#f97316]">
                <Target size={18} />
              </div>
              <h3 className="text-white font-[800] text-sm uppercase tracking-widest">Distribuição de Foco</h3>
            </div>
          </div>

          <div className="flex items-center flex-col md:flex-row">
            <div className="h-[200px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DATA_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {DATA_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#16222b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 space-y-3 mt-4 md:mt-0">
              {DATA_DISTRIBUTION.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] font-bold text-white/60 uppercase tracking-tighter">{item.name}</span>
                  </div>
                  <span className="text-[12px] font-black text-white">{Math.round(item.value / 12)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Conquistas */}
      <div className="bg-[#202f36] border border-white/10 rounded-[24px] p-6 shadow-[0_4px_0_0_#020305]">
        <div className="flex items-center gap-3 mb-6">
          <Award size={20} className="text-[#a855f7]" />
          <h3 className="text-white font-[800] text-sm uppercase tracking-widest">Conquistas Recentes</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Madrugador", desc: "5 dias às 6h", color: "#22d3ee" },
            { title: "Foco Total", desc: "10h de leitura", color: "#f97316" },
            { title: "Atleta", desc: "3 treinos seguidos", color: "#4ade80" },
            { title: "Mente Sã", desc: "7 dias meditando", color: "#a855f7" }
          ].map((badge, i) => (
            <div key={i} className="bg-black/20 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center group hover:border-white/20 transition-all cursor-default">
              <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center" style={{ backgroundColor: `${badge.color}15`, border: `2px solid ${badge.color}30` }}>
                <Trophy size={20} style={{ color: badge.color }} />
              </div>
              <span className="text-[10px] font-black text-white uppercase mb-1">{badge.title}</span>
              <span className="text-[8px] font-bold text-white/30 uppercase leading-tight">{badge.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;