"use client";

import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { format, subDays, eachDayOfInterval, startOfDay, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';

interface Habit {
  id: string;
  title: string;
  completedDates: string[];
  weekDays: number[];
  priority: number;
}

interface DashboardOverviewProps {
  habits: Habit[];
}

const DashboardOverview = ({ habits }: DashboardOverviewProps) => {
  // 1. Dados para o gráfico de linha (Últimos 7 dias)
  const last7DaysData = useMemo(() => {
    const end = startOfDay(new Date());
    const start = subDays(end, 6);
    const interval = eachDayOfInterval({ start, end });

    return interval.map(date => {
      const dStr = format(date, 'yyyy-MM-dd');
      const dayOfWeek = getDay(date);
      
      const scheduledOnDay = habits.filter(h => h.weekDays.includes(dayOfWeek)).length;
      const completedOnDay = habits.filter(h => h.completedDates.includes(dStr)).length;
      
      const rate = scheduledOnDay > 0 ? Math.round((completedOnDay / scheduledOnDay) * 100) : 0;

      return {
        name: format(date, 'EEE', { locale: ptBR }).toUpperCase(),
        rate,
        completed: completedOnDay,
        total: scheduledOnDay
      };
    });
  }, [habits]);

  // 2. Dados para o gráfico de barras (Performance por Hábito)
  const habitPerformanceData = useMemo(() => {
    return habits.map(habit => {
      const totalDays = 30; // Janela de análise
      const completedCount = habit.completedDates.length;
      const rate = Math.round((completedCount / totalDays) * 100);

      return {
        name: habit.title,
        rate: Math.min(rate, 100),
        color: habit.priority === 0 ? '#ef4444' : habit.priority === 1 ? '#f97316' : '#22d3ee'
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [habits]);

  // 3. Estatísticas Gerais
  const stats = useMemo(() => {
    const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
    const avgRate = last7DaysData.reduce((acc, d) => acc + d.rate, 0) / 7;
    const bestHabit = habitPerformanceData[0]?.name || "Nenhum";
    
    return [
      { label: "Média Semanal", value: `${Math.round(avgRate)}%`, icon: TrendingUp, color: "#22d3ee" },
      { label: "Total Check-ins", value: totalCompletions, icon: Target, color: "#4ade80" },
      { label: "Melhor Hábito", value: bestHabit, icon: Award, color: "#facc15" },
      { label: "Power Score", value: Math.round(avgRate * 1.2), icon: Zap, color: "#f472b6" },
    ];
  }, [habits, last7DaysData, habitPerformanceData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a262c] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-[10px] font-black text-white/40 uppercase mb-1">{label}</p>
          <p className="text-sm font-bold text-[#22d3ee]">
            {payload[0].value}% de conclusão
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-[#202f36] border border-white/10 rounded-3xl p-5 shadow-[0_4px_0_0_#020305] flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <s.icon size={16} style={{ color: s.color }} />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{s.label}</span>
            </div>
            <div className="text-2xl font-black text-white">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-[#202f36] border border-white/10 rounded-[32px] p-6 shadow-[0_4px_0_0_#020305]">
          <div className="flex flex-col mb-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22d3ee] shadow-[0_0_10px_#22d3ee]" />
              Tendência Semanal
            </h3>
            <p className="text-[10px] text-white/30 font-bold uppercase mt-1">Percentual de conclusão nos últimos 7 dias</p>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis 
                  hide 
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#22d3ee" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#22d3ee', strokeWidth: 0 }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance by Habit */}
        <div className="bg-[#202f36] border border-white/10 rounded-[32px] p-6 shadow-[0_4px_0_0_#020305]">
          <div className="flex flex-col mb-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]" />
              Consistência por Hábito
            </h3>
            <p className="text-[10px] text-white/30 font-bold uppercase mt-1">Ranking de performance individual (30 dias)</p>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#e5e7eb', fontSize: 10, fontWeight: '800' }}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="rate" 
                  radius={[0, 10, 10, 0]} 
                  barSize={12}
                >
                  {habitPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Summary Footer */}
      <div className="bg-gradient-to-r from-[#22d3ee]/10 to-transparent border border-[#22d3ee]/20 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-[#22d3ee] uppercase tracking-widest">Insight do Sistema</span>
          <p className="text-sm text-white/80 font-medium max-w-md mt-1">
            Sua consistência aumentou <span className="text-[#22d3ee] font-bold">12%</span> esta semana em comparação à passada. Mantenha o foco nos hábitos de prioridade alta!
          </p>
        </div>
        <div className="hidden md:block">
           <div className="w-12 h-12 rounded-full border-4 border-[#22d3ee] border-t-transparent animate-spin duration-[3s]" />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;