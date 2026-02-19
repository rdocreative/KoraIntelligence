import { Bell, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RemindersPage = () => {
  const reminders = [
    { id: 1, title: 'Beber Água', time: '10:00', type: 'Saúde', color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
    { id: 2, title: 'Meditação', time: '08:00', type: 'Mental', color: 'text-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
    { id: 3, title: 'Leitura', time: '21:00', type: 'Hábito', color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header removido pois agora temos o TopBar global */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.map((reminder) => (
          <Card key={reminder.id} className="bg-transparent border border-[#222230] hover:border-[#2d2d3d] hover:bg-white/[0.02] transition-all group rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors">
                {reminder.title}
              </CardTitle>
              <Clock className="w-5 h-5 text-[#6b6b7a]" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-sm text-[#6b6b7a] mb-6 font-medium">
                <span className={`px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-bold ${reminder.color} bg-transparent border ${reminder.borderColor}`}>
                  {reminder.type}
                </span>
                <span className="font-rajdhani font-bold text-white text-base">{reminder.time}</span>
              </div>
              <Button variant="outline" className="w-full bg-transparent border-[#222230] hover:bg-white/[0.03] hover:text-white text-[#f0f0f2]">
                Editar
              </Button>
            </CardContent>
          </Card>
        ))}
        
        <Card className="bg-transparent border border-dashed border-[#222230] flex flex-col items-center justify-center p-8 hover:border-[#2d2d3d] hover:bg-white/[0.02] transition-all cursor-pointer group min-h-[200px] rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-transparent border border-[#222230] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Bell className="w-5 h-5 text-[#6b6b7a] group-hover:text-white" />
          </div>
          <p className="text-[#6b6b7a] font-medium text-sm group-hover:text-white transition-colors">Criar Novo Lembrete</p>
        </Card>
      </div>
    </div>
  );
};

export default RemindersPage;