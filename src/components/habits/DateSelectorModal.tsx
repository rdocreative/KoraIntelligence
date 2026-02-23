"use client";

import React from "react";
import { format, setMonth, setYear, getYear, getMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
  onSelectDate: (date: Date) => void;
}

const DateSelectorModal = ({ isOpen, onClose, currentDate, onSelectDate }: DateSelectorModalProps) => {
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(2000, i, 1);
    return { index: i, name: format(d, "MMMM", { locale: ptBR }) };
  });

  const selectedYear = getYear(currentDate);
  const selectedMonth = getMonth(currentDate);

  const handleYearChange = (offset: number) => {
    onSelectDate(setYear(currentDate, selectedYear + offset));
  };

  const handleMonthSelect = (monthIndex: number) => {
    onSelectDate(setMonth(currentDate, monthIndex));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-border text-foreground rounded-[24px] max-w-[340px] p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-center uppercase tracking-[0.2em] text-[12px] text-muted-foreground font-[800] mb-4">
            Selecionar Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Year Selector */}
          <div className="flex items-center justify-between bg-input p-2 rounded-[16px] border border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleYearChange(-1)}
              className="text-primary hover:bg-primary/10"
            >
              <ChevronLeft size={20} />
            </Button>
            <span className="text-[18px] font-[900] text-foreground tracking-wider">
              {selectedYear}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleYearChange(1)}
              className="text-primary hover:bg-primary/10"
            >
              <ChevronRight size={20} />
            </Button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((m) => (
              <button
                key={m.index}
                onClick={() => handleMonthSelect(m.index)}
                className={cn(
                  "py-3 px-2 rounded-[12px] text-[11px] font-[800] uppercase tracking-wider transition-all duration-200",
                  selectedMonth === m.index
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-input text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {m.name.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DateSelectorModal;