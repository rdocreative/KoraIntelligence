import React from "react";
import { HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface InfoTooltipProps {
  title: string;
  purpose: string;
  action: string;
}

export const InfoTooltip = ({ title, purpose, action }: InfoTooltipProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="group outline-none">
          <HelpCircle 
            className="w-4 h-4 text-neutral-600 transition-all duration-300 group-hover:text-white group-hover:scale-110" 
            strokeWidth={2}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        side="right" 
        align="start" 
        sideOffset={10}
        className="w-64 p-4 bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <h4 className="text-xs font-black text-white uppercase tracking-widest">
            {title}
          </h4>
        </div>

        <div className="space-y-3">
          {/* Section 1: Purpose */}
          <div>
            <span className="block text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-1">
              Para que serve?
            </span>
            <p className="text-[11px] text-neutral-400 leading-snug font-medium">
              {purpose}
            </p>
          </div>

          {/* Section 2: Action */}
          <div>
            <span className="block text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-1">
              Como executar:
            </span>
            <p className="text-[11px] text-neutral-300 leading-snug">
              {action}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};