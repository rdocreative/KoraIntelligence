const PeriodContainer = ({ 
  dayId, 
  period, 
  tasks,
  isToday,
  onTaskDropped,
}: { 
  dayId: string; 
  period: typeof PERIODS[0]; 
  tasks: any[];
  isToday?: boolean;
  onTaskDropped?: (taskName: string, newPeriod: string) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${dayId}:${period.id}`,
  });

  const [isActive, setIsActive] = useState(false);
  const [droppedTask, setDroppedTask] = useState<string | null>(null);

  useEffect(() => {
    if (!isToday) { setIsActive(false); return; }
    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      setIsActive(currentHour >= period.startHour && currentHour < period.endHour);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [isToday, period]);

  // Detecta quando uma tarefa é solta neste período
  const prevIsOver = React.useRef(false);
  useEffect(() => {
    if (prevIsOver.current && !isOver && tasks.length > 0) {
      const lastTask = tasks[tasks.length - 1];
      setDroppedTask(lastTask.name);
      setTimeout(() => setDroppedTask(null), 4000);
    }
    prevIsOver.current = isOver;
  }, [isOver, tasks]);

  const activeStyle = isActive && isToday
    ? { background: `linear-gradient(180deg, ${period.color}15 0%, rgba(0,0,0,0) 100%)` }
    : { background: period.gradient };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative flex flex-col p-4 rounded-[24px] border transition-all duration-300 ease-in-out",
        "border-white/[0.03]",
        isOver ? "bg-white/[0.05] border-white/10 scale-[1.01]" : ""
      )}
      style={activeStyle}
    >
      {/* Aviso de alteração de horário */}
      {droppedTask && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-white/10 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <Clock size={12} className="text-yellow-400 shrink-0" />
          <span className="text-[11px] text-zinc-300 font-medium whitespace-nowrap">
            Lembre de atualizar o horário de <span className="text-white font-bold">{droppedTask}</span>
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <period.icon size={16} style={{ color: period.color }} className="transition-all duration-500" />
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-widest leading-none transition-all duration-500" style={{ color: period.color }}>
              {period.label}
            </span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight opacity-70 mt-0.5">
              {period.time}
            </span>
          </div>
        </div>
        {tasks.length > 0 && (
          <span className="text-[9px] font-bold text-zinc-200 bg-white/10 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        )}
      </div>

      <div className="relative flex flex-col gap-3 min-h-[20px] max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={{ ...task, period: period.id }} />
          ))}
        </SortableContext>
        {tasks.length === 0 && !isOver && (
          <div className="flex items-center justify-center py-4 opacity-[0.05]">
            <period.icon size={24} style={{ color: period.color }} />
          </div>
        )}
        {isOver && tasks.length === 0 && (
          <div className="h-10 border-2 border-dashed border-white/10 rounded-[20px] flex items-center justify-center">
            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">Soltar</span>
          </div>
        )}
      </div>
    </div>
  );
};