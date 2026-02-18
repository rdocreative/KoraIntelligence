import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl w-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-4", // Mais espaço abaixo do título
        caption_label: "text-sm font-bold text-white uppercase tracking-wider",
        nav: "space-x-1 flex items-center absolute inset-x-0 justify-between px-1", // Botões nos extremos
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-white/10 text-white hover:bg-white/10 transition-all rounded-lg z-10"
        ),
        nav_button_previous: "relative", // Removido absolute para usar flex no container 'nav'
        nav_button_next: "relative",
        table: "w-full border-collapse space-y-1 block", // Block para permitir que os filhos sejam Grid
        head_row: "grid grid-cols-7 w-full mb-2", // GRID DE 7 COLUNAS NO CABEÇALHO
        head_cell:
          "text-neutral-500 font-bold text-[0.7rem] uppercase tracking-wider text-center w-full", // Centralizado e largura total da célula do grid
        row: "grid grid-cols-7 w-full mt-1", // GRID DE 7 COLUNAS NAS LINHAS
        cell: "h-9 w-full text-center text-sm p-0 relative flex items-center justify-center [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-neutral-400 hover:bg-white/10 hover:text-white rounded-full transition-all"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-red-600 text-white hover:bg-red-700 hover:text-white focus:bg-red-600 focus:text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] font-bold",
        day_today: "bg-transparent text-white border border-red-500/50 font-bold",
        day_outside:
          "day-outside text-neutral-800 opacity-30 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }