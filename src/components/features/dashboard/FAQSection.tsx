import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export const FAQSection = () => {
  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50/50 dark:bg-slate-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <HelpCircle className="h-5 w-5 text-indigo-500" />
          Perguntas Frequentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-slate-200 dark:border-slate-800">
            <AccordionTrigger className="text-slate-700 dark:text-slate-300 font-medium hover:no-underline hover:text-indigo-600 dark:hover:text-indigo-400">
              Como ganho badges novos?
            </AccordionTrigger>
            <AccordionContent className="text-slate-500 dark:text-slate-400">
              Os badges são desbloqueados automaticamente quando você atinge certos marcos de XP total. Continue completando hábitos diariamente para acumular pontos.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-slate-200 dark:border-slate-800">
            <AccordionTrigger className="text-slate-700 dark:text-slate-300 font-medium hover:no-underline hover:text-indigo-600 dark:hover:text-indigo-400">
              O que acontece se eu quebrar o streak?
            </AccordionTrigger>
            <AccordionContent className="text-slate-500 dark:text-slate-400">
              Se você ficar um dia sem completar nenhuma atividade, seu contador de sequência (streak) voltará a zero. Tente manter a consistência mesmo nos finais de semana!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-slate-200 dark:border-slate-800">
            <AccordionTrigger className="text-slate-700 dark:text-slate-300 font-medium hover:no-underline hover:text-indigo-600 dark:hover:text-indigo-400">
              Posso editar um hábito criado?
            </AccordionTrigger>
            <AccordionContent className="text-slate-500 dark:text-slate-400">
              Atualmente não é possível editar um hábito, mas você pode excluí-lo nos dados (resetando) e criar um novo. Em breve teremos edição completa!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="border-b-0">
            <AccordionTrigger className="text-slate-700 dark:text-slate-300 font-medium hover:no-underline hover:text-indigo-600 dark:hover:text-indigo-400">
              Meus dados ficam salvos onde?
            </AccordionTrigger>
            <AccordionContent className="text-slate-500 dark:text-slate-400">
              Todos os seus dados são salvos localmente no seu navegador. Isso garante sua privacidade, mas lembre-se de exportar o backup caso troque de dispositivo.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};