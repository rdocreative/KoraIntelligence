"use client";

import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { Trophy, Star, Zap, TrendingUp, Target, Award, Flame, CheckCircle2, CalendarDays } from "lucide-react";
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
  { name: 'Saúde', value: 400, color: '#3F3047' },
  { name: 'Foco', value: 300, color: '#FF9600' },
  { name: 'Rotina', value: 300, color: '#58CC02' },
  { name: 'Mente', value: 200, color: '#CE82FF' },
];

interface DashboardOverviewProps {
  stats?: {
    total: number | string;
    today: string;
    streak: string;
    progress: string;
  };
}

const DashboardOverview = ({ stats }: DashboardOverviewProps) => {
  const displayStats = stats || {
    total: 4,
    today: "0/4",
    streak: "7d",
    progress: "0%"
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "TOTAL HÁBITOS", value: displayStats.total, icon: Target, color: "#3F3047", shadow: "#261D2E" },
          { label: "SEQUÊNCIA", value: displayStats.streak, icon: Flame, color: "#FF9600", shadow: "#E58700" },
          { label: "HOJE", value: displayStats.today, icon: CheckCircle2, color: "#58CC02", shadow: "#46A302" },
          { label: "MÊS", value: displayStats.progress, icon: CalendarDays, color: "#CE82FF", shadow: "#A855F7" }
        ].map((s, i) => (
          <div
            key={i}
            className="py-6 px-7 rounded-[32px] flex items-center gap-5 border-2 transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: s.color,
              borderColor: 'transparent',
              boxShadow: `0 4px 0 0 ${s.shadow}`,
              color: 'white'
            }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-black/10">
              <s.icon size={28} className="text-white fill-white/10" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-[900] uppercase tracking-widest leading-tight mb-1 opacity-80">{s.label}</span>
              <span className="text-[28px] font-[950] leading-none tracking-tight">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--panel)] border-2 border-[var(--border-ui)] rounded-[40px] p-10 shadow-[var(--shadow-ui)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Trophy size={140} className="text-[var(--foreground)]" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-[6px] border-[#3F3047] flex items-center justify-center bg-[var(--background)] shadow-xl">
              <span className="text-[36px] font-[950] text-[#3F3047]">12</span>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#3F3047] text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-lg">
              NÍVEL
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-[var(--foreground)] font-[950] text-2xl uppercase tracking-tight">Mestre da Rotina</h2>
                <p className="text-[var(--muted-foreground)] text-sm font-bold uppercase tracking-widest mt-1">Você superou 95% dos guerreiros este mês!</p>
              </div>
              <div className="text-right">
                <span className="text-[#3F3047] font-black text-xl">2.450 / 3.000</span>
                <span className="text-[var(--muted-foreground)] font-black text-sm ml-1 uppercase">XP</span>
              </div>
            </div>
            
            <div className="h-5 w-full bg-[var(--border-ui)] rounded-full overflow-hidden p-1 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#3F3047] to-[#261D2E] rounded-full transition-all duration-1000" 
                style={{ width: '75%' }}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-2.5 bg-[var(--card)] px-4 py-2 rounded-2xl border-2 border-[var(--border-ui)] shadow-sm">
                <Star size={16} className="text-[#FF9600] fill-[#FF9600]" />
                <span className="text-[12px] font-[800] text-[var(--foreground)]">Streak: 15 Dias</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[var(--card)] px-4 py-2 rounded-2xl border-2 border-[var(--border-ui)] shadow-sm">
                <Zap size={16} className="text-[#3F3047] fill-[#3F3047]" />
                <span className="text-[12px] font-[800] text-[var(--foreground)]">Combo: x1.5 XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--panel)] border-2 border-[var(--border-ui)] rounded-[32px] p-8 shadow-[var(--shadow-ui)]">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-[#3F3047]/10 rounded-xl text-[#3F3047]">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-[var(--foreground)] font-[900] text-sm uppercase tracking-widest">Evolução Semanal</h3>
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_EVOLUTION}>
                <defs>
                  <linearGradient id="colorHabit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3F3047" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3F3047" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-ui)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontWeight: 800 }} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', border: '2px solid var(--border-ui)', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', color: 'var(--foreground)' }}
                  itemStyle={{ color: '#3F3047' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="habitos" 
                  stroke="#3F3047" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorHabit)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--panel)] border-2 border-[var(--border-ui)] rounded-[32px] p-8 shadow-[var(--shadow-ui)]">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-[#FF9600]/10 rounded-xl text-[#FF9600]">
              <Target size={20} />
            </div>
            <h3 className="text-[var(--foreground)] font-[900] text-sm uppercase tracking-widest">Distribuição de Foco</h3>
          </div>

          <div className="flex items-center flex-col md:flex-row h-full">
            <div className="h-[220px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DATA_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {DATA_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', border: '2px solid var(--border-ui)', borderRadius: '16px', color: 'var(--foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 space-y-4 mt-6 md:mt-0 px-4">
              {DATA_DISTRIBUTION.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-[12px] font-[800] text-[var(--muted-foreground)] uppercase tracking-tighter">{item.name}</span>
                  </div>
                  <span className="text-[14px] font-[950] text-[var(--foreground)]">{Math.round(item.value / 12)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;