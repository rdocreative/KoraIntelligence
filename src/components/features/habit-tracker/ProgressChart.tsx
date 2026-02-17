import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyRecord } from "../hooks/useHabitTracker";

interface ProgressChartProps {
  history: DailyRecord[];
}

export const ProgressChart = ({ history }: ProgressChartProps) => {
  // Process history data for the last 7 days
  const data = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Format date for display (e.g. "Seg")
    const dayName = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(d);
    
    // Find points for this day
    const record = history.find(h => h.date === dateStr);
    
    data.push({
      name: dayName.toUpperCase().replace('.', ''),
      pontos: record ? record.points : 0
    });
  }

  return (
    <Card className="col-span-1 shadow-sm border-slate-100">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-slate-700">Progresso Semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar 
                dataKey="pontos" 
                fill="#818cf8" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
