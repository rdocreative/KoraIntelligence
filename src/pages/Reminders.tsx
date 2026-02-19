import { Bell, AlarmClock, Calendar, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RemindersPage = () => {
  const reminders = [
    { id: 1, title: 'Beber Água', time: '10:00', type: 'Saúde', color: 'text-blue-500' },
    { id: 2, title: 'Meditação', time: '08:00', type: 'Mental', color: 'text-purple-500' },
    { id: 3, title: 'Leitura', time: '21:00', type: 'Hábito', color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
          <Bell className="text-pink-500" />
          Lembretes
        </h1>
        <p className="text-neutral-400">Gerencie seus alertas e notificações importantes.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.map((reminder) => (
          <Card key={reminder.id} className="bg-white/5 border-white/10 hover:border-pink-500/30 transition-all group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">
                {reminder.title}
              </CardTitle>
              <Clock className="w-5 h-5 text-neutral-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
                <span className={reminder.color}>{reminder.type}</span>
                <span>•</span>
                <span>Diário às {reminder.time}</span>
              </div>
              <Button variant="outline" className="w-full border-white/10 hover:bg-pink-500/10 hover:text-pink-400">
                Editar Lembrete
              </Button>
            </CardContent>
          </Card>
        ))}
        
        <Card className="bg-dashed border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 hover:border-pink-500/50 transition-all cursor-pointer group min-h-[200px]">
          <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Bell className="w-6 h-6 text-pink-500" />
          </div>
          <p className="text-neutral-400 font-medium">Novo Lembrete</p>
        </Card>
      </div>
    </div>
  );
};

export default RemindersPage;
