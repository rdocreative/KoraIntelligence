"use client";

import React, { useState } from "react";
import { 
  Clock, 
  Plus, 
  CheckCircle2, 
  Circle,
  Sunrise,
  Sun,
  Moon,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  period: 'Manhã' | 'Tarde' | 'Noite';
  time: string;
  completed: boolean;
  priority: 'Baixa' | 'Média' | 'Alta';
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Reunião de Planejamento', period: 'Manhã', time: '09:00', completed: false, priority: 'Alta' },
    { id: '2', title: 'Treino de Pernas', period: 'Manhã', time: '07:00', completed: true, priority: 'Média' },
    { id: '3', title: 'Responder E-mails', period: 'Tarde', time: '14:30', completed: false, priority: 'Baixa' },
    { id: '4', title: 'Estudar TypeScript', period: 'Noite', time: '20:00', completed: false, priority: 'Alta' },
    { id: '5', title: 'Leitura de Boa Noite', period: 'Noite', time: '22:30', completed: false, priority: 'Baixa' },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const sections = [
    { label: 'Manhã', icon: Sunrise, color: '#FF8A3D' },
    { label: 'Tarde', icon: Sun, color: '#FFB366' },
    { label: 'Noite', icon: Moon, color: '#9D4EDD' }
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F6] p-10 font-sans text-[#1A1A1A]">
      <div className="max-w-[800px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-[32px] font-semibold uppercase tracking-tight">Suas Tarefas</h1>
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#9D4EDD] to-[#FF6B4A] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:translate-y-[-2px] transition-all active:translate-y-0">
            <Plus size={18} />
            NOVA TAREFA
          </button>
        </div>

        {/* Periods List */}
        <div className="space-y-10">
          {sections.map((section) => {
            const sectionTasks = tasks.filter(t => t.period === section.label);
            
            return (
              <div key={section.label} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="p-2 rounded-xl bg-white shadow-sm border border-[#E5E5E5]">
                    <section.icon size={20} style={{ color: section.color }} />
                  </div>
                  <h2 className="text-[14px] font-black uppercase tracking-[0.15em] text-[#6B6B6B]">
                    {section.label}
                  </h2>
                </div>

                <div className="grid gap-3">
                  {sectionTasks.map(task => (
                    <div 
                      key={task.id}
                      className={cn(
                        "bg-white rounded-[20px] p-5 flex items-center justify-between border border-[#E5E5E5] transition-all hover:shadow-md group",
                        task.completed && "opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => toggleTask(task.id)}
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                            task.completed ? "text-[#22C55E]" : "text-[#E5E5E5] hover:text-[#9D4EDD]"
                          )}
                        >
                          {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>
                        
                        <div>
                          <h3 className={cn(
                            "text-[16px] font-semibold",
                            task.completed && "line-through text-[#6B6B6B]"
                          )}>
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[12px] font-bold text-[#6B6B6B] flex items-center gap-1">
                              <Clock size={12} /> {task.time}
                            </span>
                            <span className={cn(
                              "text-[10px] font-black uppercase px-2 py-0.5 rounded-md",
                              task.priority === 'Alta' ? "bg-red-50 text-red-500" :
                              task.priority === 'Média' ? "bg-orange-50 text-orange-500" :
                              "bg-blue-50 text-blue-500"
                            )}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="text-[#E5E5E5] hover:text-[#1A1A1A] p-2 transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  ))}
                  
                  {sectionTasks.length === 0 && (
                    <div className="py-8 text-center border-2 border-dashed border-[#E5E5E5] rounded-[24px]">
                      <p className="text-[#6B6B6B] text-[13px] font-medium">Nenhuma tarefa para este período.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;