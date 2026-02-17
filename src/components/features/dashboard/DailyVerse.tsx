"use client";

import React, { useState, useEffect } from 'react';
import { Quote, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const verses = [
  { text: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13" },
  { text: "O Senhor é o meu pastor; nada me faltará.", reference: "Salmo 23:1" },
  { text: "O que vem a mim jamais terá fome.", reference: "João 6:35" },
  { text: "Seja forte e corajoso! Não se apavore nem desanime.", reference: "Josué 1:9" },
  { text: "O amor é paciente, o amor é bondoso.", reference: "1 Coríntios 13:4" }
];

export const DailyVerse = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [verse, setVerse] = useState(verses[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * verses.length);
    setVerse(verses[randomIndex]);

    // Define o timer para esconder após 15 segundos (15000ms)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right-full duration-700">
      <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-red-500/20 shadow-2xl shadow-red-500/10 p-5 max-w-sm relative group overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/10 blur-3xl rounded-full group-hover:bg-red-500/20 transition-all duration-500" />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6 text-slate-500 hover:text-white hover:bg-white/5"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3 w-3" />
        </Button>

        <div className="flex gap-4 items-start relative">
          <div className="bg-red-500/10 p-2 rounded-xl border border-red-500/20">
            <Quote className="h-5 w-5 text-red-500" />
          </div>
          <div className="space-y-2">
            <p className="text-slate-200 font-medium leading-relaxed italic">
              "{verse.text}"
            </p>
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest">
              — {verse.reference}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};