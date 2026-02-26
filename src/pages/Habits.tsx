"use client";

import React from 'react';
import { 
  Sun, 
  Moon, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Plus, 
  Sparkles 
} from 'lucide-react';

const theme = {
  primary: '#C4B5FD',
  accent: '#F472B6',
  gradMorning: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
  gradAfternoon: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
  gradEvening: 'linear-gradient(135deg, #6366F1 0%, #312E81 100%)',
  gradPrimary: 'linear-gradient(135deg, #C4B5FD 0%, #A855F7 100%)',
  primaryGlow: '0 0 20px rgba(196, 181, 253, 0.25)',
  gradSaude: 'linear-gradient(135deg, rgba(45, 212, 191, 0.12) 0%, rgba(20, 184, 166, 0.02) 100%)',
  gradEstudos: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(217, 70, 239, 0.02) 100%)',
  gradMente: 'linear-gradient(135deg, rgba(251, 146, 60, 0.12) 0%, rgba(244, 63, 94, 0.02) 100%)',
  border: 'rgba(255, 255, 255, 0.04)',
};

const getHabitGradient = (cat: string) => {
  if (cat === 'Saúde') return theme.gradSaude;
  if (cat === 'Estudos') return theme.gradEstudos;
  if (cat === 'Mente') return theme.gradMente;
  return 'rgba(255,255,255,0.02)';
};

const HabitsPage = () => {
  return (
    <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700">
      <div className="fixed top-[-10%] left-[10%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ background: theme.primary }} />
      <div className="fixed bottom-[10%] right-[5%] w-[300px] h-[300px] rounded-full blur-[100px] opacity-15 pointer-events-none" style={{ background: theme.accent }} />

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-12 lg:col-span-7 space-y-12">
          {[
            { period: 'Manhã', icon: Sun, grad: theme.gradMorning, habits: [
              { name: 'Meditação Ritual', time: '07:30', done: true, cat: 'Mente' },
              { name: 'Hidratação Profunda', time: '08:00', done: false, cat: 'Saúde' }
            ]},
            { period: 'Noite', icon: Moon, grad: theme.gradEvening, habits: [
              { name: 'Deep Work: UX', time: '21:30', done: false, cat: 'Estudos' }
            ]}
          ].map((section) => (
            <section key={section.period}>
              <div className="flex items-center gap-4 mb-8 opacity-50">
                <section.icon size={16} style={{ color: theme.primary }} />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em]">{section.period}</h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              
              <div className="space-y-4">
                {section.habits.map((h, i) => (
                  <div key={`habit-${h.name}-${i}`} className={`group relative p-6 rounded-[2.5rem] border transition-all duration-300 ${h.done ? 'opacity-40 border-transparent bg-transparent' : 'border-white/5 hover:border-white/10'}`}
                       style={{ background: h.done ? 'transparent' : getHabitGradient(h.cat) }}>
                    
                    <div className="flex flex-1 items-center gap-6 relative z-10">
                      <button className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${h.done ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white hover:bg-white/10 shadow-inner'}`}>
                        {h.done ? <CheckCircle2 size={24} strokeWidth={3} /> : <div className="w-5 h-5 rounded-full border-2 border-dashed border-white/30" />}
                      </button>
                      
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg tracking-tight transition-all ${h.done ? 'text-slate-500 line-through' : 'text-white'}`}>{h.name}</h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-white/5 text-slate-300">{h.cat}</span>
                          <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest flex items-center gap-1"><Clock size={10}/> {h.time}</span>
                        </div>
                      </div>
                      
                      {!h.done && (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-white/5 border border-white/5">
                          <ChevronRight size={18} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
          
          <button className="w-full py-8 rounded-[3rem] border-2 border-dashed border-white/5 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white hover:border-white/10 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-4 group">
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> CRIAR NOVO HÁBITO
          </button>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-10">
          <div className="p-10 rounded-[3rem] border bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden" style={{ borderColor: theme.border }}>
            <div className="absolute -top-10 -right-10 w-40 h-40 blur-[80px] opacity-10 rounded-full" style={{ background: theme.gradPrimary }} />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h3 className="text-2xl font-serif italic tracking-tight">Fevereiro</h3>
              <div className="flex gap-1">
                <button className="p-2 opacity-30 hover:opacity-100 transition-opacity"><ChevronRight size={18} className="rotate-180" /></button>
                <button className="p-2 opacity-30 hover:opacity-100 transition-opacity"><ChevronRight size={18} /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-3 relative z-10">
              {['S','T','Q','Q','S','S','D'].map((d, index) => (
                <div key={`weekday-${index}`} className="text-center text-[10px] font-black opacity-20 mb-3 tracking-widest">{d}</div>
              ))}
              {Array.from({length: 28}).map((_, i) => (
                <div key={`day-${i}`} className="flex flex-col items-center gap-1.5">
                  <div className={`w-9 h-9 flex items-center justify-center text-xs font-black rounded-2xl transition-all cursor-pointer ${i+1 === 25 ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-110' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
                    {i+1}
                  </div>
                  {i+1 < 25 && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.primary, boxShadow: theme.primaryGlow }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 rounded-[3rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-2xl transition-transform group-hover:scale-110" style={{ background: theme.gradPrimary, boxShadow: theme.primaryGlow }}>
                <Sparkles size={28} color="#000" fill="#000" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Meta do Ciclo</p>
              <h4 className="text-xl font-bold italic font-serif tracking-tight">Arquitecto Visual</h4>
              <div className="mt-6 flex items-center gap-1.5">
                {[1,2,3,4].map(x => (
                  <div key={`progress-${x}`} className={`h-1.5 rounded-full transition-all ${x <= 3 ? 'w-8' : 'w-2 bg-white/10'}`} 
                       style={{ background: x <= 3 ? theme.gradPrimary : '' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;