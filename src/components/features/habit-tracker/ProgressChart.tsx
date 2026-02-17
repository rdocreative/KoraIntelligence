import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyRecord } from "@/hooks/useHabitTracker";

interface ProgressChartProps {
  data: DailyRecord[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 h-40 w-full">
            {data?.map((record, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end h-full gap-2">
                    <div 
                        className={`w-full rounded-t-md transition-all ${record.completed ? 'bg-red-600' : 'bg-neutral-800'}`}
                        style={{ height: `${record.score}%` }}
                    />
                </div>
            ))}
            {!data?.length && <p className="text-neutral-500 text-sm">No data available</p>}
        </div>
      </CardContent>
    </Card>
  );
}