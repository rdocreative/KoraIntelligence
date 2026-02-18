"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ToastProgressProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const ToastProgress = ({ message, isVisible, onClose }: ToastProgressProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300",
        !isVisible && "animate-out slide-out-to-bottom-4 fade-out"
      )}
    >
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3 shadow-xl">
        <p className="text-sm text-white">{message}</p>
      </div>
    </div>
  );
};

// Progress messages to rotate through
export const progressMessages = [
  "Mais uma concluída. Continua.",
  "Progresso real acontece assim.",
  "Isso conta. Vai pro próximo.",
  "Bem feito. Segue em frente.",
  "Uma de cada vez. É assim que se faz.",
];

export const getRandomProgressMessage = () => {
  return progressMessages[Math.floor(Math.random() * progressMessages.length)];
};