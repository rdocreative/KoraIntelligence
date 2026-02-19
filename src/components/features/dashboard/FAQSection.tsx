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
    <Card className="bg-[#121212] border border-white/10 rounded-2xl shadow-xl">
      <CardHeader className="pb-2 border-b border-white/5">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
          <HelpCircle className="h-5 w-5 text-red-500" />
          Perguntas Frequentes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-white/5">
            <AccordionTrigger className="text-[#f0f0f2] font-bold hover:no-underline hover:text-red-400">
              Como ganho badges novos?
            </AccordionTrigger>
            <AccordionContent className="text-white/60 font-medium">
              Os badges são desbloqueados automaticamente quando você atinge certos marcos de XP total. Continue completando hábitos diariamente para acumular pontos.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-white/5">
            <AccordionTrigger className="text-[#f0f0f2] font-bold hover:no-underline hover:text-red-400">
              O que acontece se eu quebrar o streak?
            </AccordionTrigger>
            <AccordionContent className="text-white/60 font-medium">
              Se você ficar um dia sem completar nenhuma atividade, seu contador de sequência (streak) voltará a zero. Tente manter a consistência mesmo nos finais de semana!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-white/5">
            <AccordionTrigger className="text-[#f0f0f2] font-bold hover:no-underline hover:text-red-400">
              Posso editar um hábito criado?
            </AccordionTrigger>
            <AccordionContent className="text-white/60 font-medium">
              Atualmente não é possível editar um hábito, mas você pode excluí-lo nos dados (resetando) e criar um novo. Em breve teremos edição completa!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="border-b-0">
            <AccordionTrigger className="text-[#f0f0f2] font-bold hover:no-underline hover:text-red-400">
              Meus dados ficam salvos onde?
            </AccordionTrigger>
            <AccordionContent className="text-white/60 font-medium">
              Todos os seus dados são salvos localmente no seu navegador. Isso garante sua privacidade, mas lembre-se de exportar o backup caso troque de dispositivo.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};