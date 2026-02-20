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
    <Card className="card-glass overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FF3232]" />
            Evolução de XP
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3232" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF3232" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} 
                minTickGap={30}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  backgroundColor: '#000',
                  color: '#f0f0f2' 
                }}
                itemStyle={{ color: '#FF3232' }}
              />
              <Area 
                type="monotone" 
                dataKey="xp" 
                stroke="#FF3232" 
                fillOpacity={1} 
                fill="url(#colorXp)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};