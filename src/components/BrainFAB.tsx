"use client";

import React from 'react';
import { Brain } from 'lucide-react';

interface BrainFABProps {
  onClick?: () => void;
}

const BrainFAB: React.FC<BrainFABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-[58px] h-[58px] rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 z-50 border-none"
      style={{
        background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
        boxShadow: '0 4px 20px #38bdf840'
      }}
      aria-label="Cérebro"
    >
      <Brain size={28} />
    </button>
  );
};

export default BrainFAB;