"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  Circle, 
  Calendar, 
  PlusCircle, 
  TrendingUp,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulated Assistant Response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getSimulatedResponse(text),
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getSimulatedResponse = (input: string) => {
    const lower = input.toLowerCase();
    if (lower.includes('hábito')) return "Claro! Você tem 3 hábitos pendentes para hoje: Beber água, Ler e Meditar. Gostaria que eu te lembrasse de algum deles mais tarde?";
    if (lower.includes('tarefa')) return "Com certeza. Qual o título da nova tarefa que você deseja criar? Posso também sugerir um prazo baseado na sua rotina atual.";
    if (lower.includes('progresso')) return "Sua semana está sendo produtiva! Você completou 85% das suas metas até agora. Terça-feira foi seu dia mais eficiente.";
    return "Entendi! Estou aqui para ajudar você a manter o foco e a produtividade. O que mais podemos planejar para hoje?";
  };

  const suggestions = [
    { label: "Ver meus hábitos de hoje", icon: Calendar },
    { label: "Criar uma nova tarefa", icon: PlusCircle },
    { label: "Mostrar meu progresso semanal", icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-[1000px] mx-auto gap-6 p-10 font-sans text-[#1A1A1A]">
      
      {/* HEADER DO CHAT */}
      <header className="bg-white rounded-[24px] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9D4EDD] to-[#FF6B4A] flex items-center justify-center shadow-lg">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-serif text-[28px] font-semibold leading-none mb-1">Kora</h1>
            <p className="text-[14px] text-[#6B6B6B] font-medium tracking-tight">Seu assistente de produtividade</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-[#F8F8F6] px-4 py-2 rounded-full border border-[#E5E5E5]">
          <Circle size={8} fill="#22C55E" className="text-[#22C55E]" />
          <span className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-widest">ONLINE</span>
        </div>
      </header>

      {/* ÁREA DE MENSAGENS */}
      <div className="flex-grow bg-white rounded-[24px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col relative">
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-8 flex flex-col gap-6 scroll-smooth"
        >
          {messages.length === 0 ? (
            /* ESTADO INICIAL */
            <div className="flex-grow flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-[32px] bg-gradient-to-br from-[#9D4EDD]/10 to-[#FF6B4A]/10 flex items-center justify-center mb-6 border border-[#9D4EDD]/20">
                <Sparkles size={40} className="text-[#9D4EDD]" />
              </div>
              <h2 className="font-serif text-[24px] font-semibold mb-8">Como posso te ajudar hoje?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-[700px]">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s.label)}
                    className="p-4 bg-white border border-[#E5E5E5] rounded-[16px] flex flex-col items-center gap-3 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-[#9D4EDD]/30 group"
                  >
                    <s.icon size={20} className="text-[#6B6B6B] group-hover:text-[#9D4EDD] transition-colors" />
                    <span className="text-[14px] font-semibold text-[#1A1A1A]">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* LISTA DE MENSAGENS */
            <>
              {messages.map((m) => (
                <div 
                  key={m.id}
                  className={cn(
                    "flex flex-col max-w-[70%;] animate-in slide-in-from-bottom-2 duration-300",
                    m.sender === 'user' ? "self-end items-end" : "self-start items-start"
                  )}
                >
                  <div className="flex items-end gap-3 w-full">
                    {m.sender === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-[#F8F8F6] border border-[#E5E5E5] flex items-center justify-center shrink-0">
                        <Bot size={16} className="text-[#9D4EDD]" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "p-4 px-5 text-[15px] leading-relaxed shadow-sm",
                        m.sender === 'user' 
                          ? "bg-gradient-to-br from-[#9D4EDD] to-[#FF6B4A] text-white rounded-[16px] rounded-tr-[4px]" 
                          : "bg-[#F8F8F6] text-[#1A1A1A] rounded-[16px] rounded-tl-[4px] border border-[#E5E5E5]"
                      )}
                    >
                      {m.text}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#6B6B6B] font-bold mt-1 uppercase tracking-widest opacity-50 px-1">
                    {format(m.timestamp, 'HH:mm')}
                  </span>
                </div>
              ))}

              {/* INDICADOR DIGITANDO */}
              {isTyping && (
                <div className="self-start flex items-end gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-[#F8F8F6] border border-[#E5E5E5] flex items-center justify-center">
                    <Bot size={16} className="text-[#9D4EDD]" />
                  </div>
                  <div className="bg-[#F8F8F6] p-3 px-5 rounded-[16px] rounded-tl-[4px] border border-[#E5E5E5]">
                    <MoreHorizontal className="text-[#6B6B6B] animate-bounce" size={20} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* INPUT DE MENSAGEM */}
      <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-4"
        >
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-grow bg-[#F8F8F6] rounded-[16px] p-4 px-6 text-[15px] font-medium outline-none transition-all focus:ring-2 focus:ring-[#9D4EDD]/20 placeholder:text-[#6B6B6B]/60"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
              !inputValue.trim() || isTyping
                ? "bg-[#E5E5E5] text-[#6B6B6B] scale-95 opacity-50"
                : "bg-gradient-to-br from-[#9D4EDD] to-[#FF6B4A] text-white hover:scale-105 hover:shadow-[0_4px_20px_rgba(157,78,221,0.4)] active:scale-95"
            )}
          >
            <Send size={20} className="translate-x-0.5 -translate-y-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default Index;