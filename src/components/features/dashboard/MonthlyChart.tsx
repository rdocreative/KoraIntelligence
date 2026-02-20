import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyRecord } from "@/hooks/useHabitTracker";
import { Activity } from "lucide-react";

interface MonthlyChartProps {
  history: DailyRecord[];
}

export const MonthlyChart = ({ history }: MonthlyChartProps) => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const record = history.find(h => h.date === dateStr);
    
    data.push({
      date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      xp: record ? record.points : 0
    });
  }

  // Cor XP: Dourado (#FFB300)
  const CHART_COLOR = "#FFB300";

  return (
    <Card className="card-glass border-white/10 overflow-hidden shadow-2xl shadow-black/60">
      <CardHeader className="border-b border-white/5 pb-4 bg-gradient-to-r from-white/[0.03] to-transparent">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FFB300]" />
            Evolução de XP
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 bg-gradient-to-r from-transparent to-white/[0.02]">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFB300" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FFB300" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={true} 
                stroke="rgba(255,255,255,0.03)" 
              />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 500 }} 
                minTickGap={30}
                dy={10}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 500 }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  backgroundColor: '#1a1a1a',
                  color: '#f0f0f2',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)'
                }}
                itemStyle={{ color: '#FFB300', fontWeight: 700 }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
              />
              <Area 
                type="monotone" 
                dataKey="xp" 
                stroke="#FFB300" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorXp)" 
                activeDot={{ r: 6, fill: '#FFB300', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};