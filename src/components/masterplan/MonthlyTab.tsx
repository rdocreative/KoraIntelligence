import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TaskList } from "@/components/masterplan/TaskList";
import { TaskItem } from "@/hooks/useMasterplan";

interface MonthlyTabProps {
  months: any[];
  currentMonthIndex: number;
  addMonthGoal: (monthIndex: number, task: TaskItem) => void;
  toggleMonthGoal: (monthIndex: number, taskId: string) => void;
  updateMonth: (monthIndex: number, data: any) => void;
}

export const MonthlyTab = ({ months, currentMonthIndex, addMonthGoal, toggleMonthGoal, updateMonth }: MonthlyTabProps) => {
  // Use current month ID for default open value if available, or fallback
  const currentMonthId = months[currentMonthIndex]?.id;
  const defaultValue = currentMonthId ? `month-${currentMonthId}` : undefined;

  return (
    <div className="space-y-6 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={defaultValue}>
        {months.map((month, index) => {
          const isCurrent = index === currentMonthIndex;
          return (
            <AccordionItem key={month.id} value={`month-${month.id}`} className={`border ${isCurrent ? 'border-red-500/20 bg-gradient-to-r from-red-950/10 to-transparent' : 'border-white/5 bg-[#0A0A0A]'} rounded-2xl px-2 transition-all duration-300`}>
              <AccordionTrigger className="hover:no-underline py-5 px-4 group">
                <div className="flex items-center gap-6 w-full">
                  <span className={`text-2xl font-black uppercase tracking-tight group-hover:pl-2 transition-all duration-300 ${isCurrent ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                    {month.name}
                  </span>
                  {isCurrent && (
                    <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse">
                      Mês Atual
                    </span>
                  )}
                  <div className="flex-1 h-px bg-white/5 mx-4" />
                  <span className="text-xs font-medium text-neutral-600 mr-4">
                    {month.goals.filter((g: any) => g.completed).length}/{month.goals.length} Metas
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-8 pt-2 px-4 animate-in slide-in-from-top-2 duration-300">
                <div className="grid lg:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em]">Metas do Mês</Label>
                    <TaskList
                      items={month.goals}
                      onAdd={(t) => addMonthGoal(index, t)}
                      onToggle={(id) => toggleMonthGoal(index, id)}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em]">Notas & Ideias</Label>
                    <Textarea
                      value={month.notes}
                      onChange={(e) => updateMonth(index, { notes: e.target.value })}
                      className="bg-black/40 border-white/5 h-[200px] resize-none transition-all focus:ring-1 focus:ring-white/20 text-neutral-300 leading-relaxed p-4"
                      placeholder="Escreva suas reflexões..."
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};