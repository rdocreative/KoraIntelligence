import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
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

  return (
    <Card className="bg-white/[0.02] border border-white/20 rounded-2xl shadow-xl backdrop-blur-3xl overflow-hidden">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            Evolução de XP
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }} 
                minTickGap={30}
                dy={10}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  backgroundColor: 'rgba(10, 10, 15, 0.95)',
                  color: '#f0f0f2',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)'
                }}
                itemStyle={{ color: '#ef4444', fontWeight: 700 }}
                cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
              />
              <Area 
                type="monotone" 
                dataKey="xp" 
                stroke="#ef4444" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorXp)" 
                activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};