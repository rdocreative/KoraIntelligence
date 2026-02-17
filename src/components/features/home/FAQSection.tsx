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
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <HelpCircle className="text-indigo-500" size={20} />
          Perguntas Frequentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Como ganho XP?</AccordionTrigger>
            <AccordionContent>
              Você ganha XP completando hábitos diários, tarefas e alcançando metas. Cada hábito tem uma pontuação específica baseada na dificuldade.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>O que acontece se eu perder um dia?</AccordionTrigger>
            <AccordionContent>
              Seu contador de "Streak" (sequência) será resetado, mas seu XP total permanece salvo. A consistência é a chave!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Posso criar hábitos personalizados?</AccordionTrigger>
            <AccordionContent>
              Sim! Na aba "Hábitos", você pode adicionar qualquer atividade que deseje monitorar e atribuir pontos a ela.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Meus dados estão salvos na nuvem?</AccordionTrigger>
            <AccordionContent>
              Atualmente, os dados são salvos localmente no seu dispositivo. Recomendamos fazer backup (exportar CSV) nas configurações regularmente.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};