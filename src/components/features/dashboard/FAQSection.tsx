"use client";

import React from 'react';
import { HelpCircle } from 'lucide-react';

export const FAQSection = () => {
  return (
    <div className="card-ghost p-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="text-white/30 w-4 h-4" />
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Dica Rápida</h3>
      </div>
      <p className="text-sm text-white/60 italic">
        "A consistência é o que transforma o comum em extraordinário."
      </p>
    </div>
  );
};