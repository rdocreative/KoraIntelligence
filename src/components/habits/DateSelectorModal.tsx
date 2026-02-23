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
      <DialogContent className="bg-[#202f36] border-2 border-[#374151] text-[#e5e7eb] rounded-[24px] max-w-[340px] p-6 shadow-[0_8px_0_0_#0b1116]">
        <DialogHeader>
          <DialogTitle className="text-center uppercase tracking-[0.2em] text-[12px] text-[#9ca3af] font-[800] mb-4">
            Selecionar Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Year Selector */}
          <div className="flex items-center justify-between bg-[#131f24] p-2 rounded-[16px] border border-[#374151]">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleYearChange(-1)}
              className="text-[#22d3ee] hover:bg-[#22d3ee]/10"
            >
              <ChevronLeft size={20} />
            </Button>
            <span className="text-[18px] font-[900] text-white tracking-wider">
              {selectedYear}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleYearChange(1)}
              className="text-[#22d3ee] hover:bg-[#22d3ee]/10"
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
                    ? "bg-[#22d3ee] text-[#111b21] shadow-[0_4px_0_0_#06b6d4]"
                    : "bg-[#131f24] text-[#9ca3af] hover:text-white hover:bg-[#374151]"
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