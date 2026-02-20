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
    <Card className="card-glass border-white/5 overflow-hidden shadow-2xl">
      <CardHeader className="border-b border-white/5 pb-4 bg-black/40">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FF3232]" />
            Evolução de XP
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 bg-black/20">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  {/* Gradiente 30% menor e mais escuro */}
                  <stop offset="2%" stopColor="#FF3232" stopOpacity={0.2}/>
                  <stop offset="50%" stopColor="#FF3232" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }} 
                minTickGap={30}
                dy={10}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  backgroundColor: '#000000',
                  color: '#f0f0f2',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.9)'
                }}
                itemStyle={{ color: '#FF3232', fontWeight: 700 }}
                cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }}
              />
              <Area 
                type="monotone" 
                dataKey="xp" 
                stroke="#FF3232" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorXp)" 
                activeDot={{ r: 4, fill: '#FF3232', stroke: '#000', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};