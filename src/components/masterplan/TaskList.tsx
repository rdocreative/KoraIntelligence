import { useState } from "react";
import { Check, Trash2, Plus, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskItem } from "@/hooks/useMasterplan";

export const TaskList = ({ 
  items, onAdd, onToggle, onDelete, placeholder = "Adicionar item..." 
}: { 
  items: TaskItem[], onAdd: (text: string) => void, onToggle: (id: string) => void, onDelete?: (id: string) => void, placeholder?: string
}) => {
  const [newItem, setNewItem] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleAdd = () => {
    if (!newItem.trim()) return;
    onAdd(newItem);
    setNewItem("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  // Função auxiliar para extrair texto seguro
  const getSafeText = (text: any) => {
    if (typeof text === 'string') return text;
    if (typeof text === 'object' && text !== null && 'text' in text) {
        return text.text;
    }
    return String(text);
  };

  return (
    <div className="space-y-6">
      
      {/* Lista de Itens (Cards) */}
      <div className="space-y-2">
        {items.map(item => (
          <div 
            key={item.id} 
            className={cn(
                "group flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-2",
                item.completed 
                    ? "bg-black/20 border-white/5 opacity-60" // Estilo 'Missão Cumprida'
                    : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20 shadow-sm backdrop-blur-sm" // Estilo Ativo
            )}
          >
            {/* Checkbox Customizado */}
            <button 
                onClick={() => onToggle(item.id)}
                className={cn(
                    "relative w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0 overflow-hidden",
                    item.completed 
                        ? "bg-red-600 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" 
                        : "border-neutral-600 hover:border-red-500 bg-transparent"
                )}
            >
                <Check 
                    className={cn(
                        "w-3.5 h-3.5 text-white transition-all duration-300", 
                        item.completed ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    )} 
                    strokeWidth={4} 
                />
            </button>
            
            {/* Texto da Tarefa */}
            <span className={cn(
              "flex-1 text-sm font-medium transition-all duration-300 leading-relaxed",
              item.completed 
                ? "text-neutral-500 line-through decoration-neutral-600 decoration-2" 
                : "text-neutral-200"
            )}>
              {getSafeText(item.text)}
            </span>

            {/* Botão Excluir (Hover Only) */}
            {onDelete && (
                <button 
                    onClick={() => onDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transform hover:scale-105"
                    aria-label="Excluir tarefa"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
          </div>
        ))}
      </div>

      {/* Input de Novo Item - Visual Premium */}
      <div 
        className={cn(
            "relative flex items-center gap-3 p-1 pl-4 pr-1 rounded-xl border transition-all duration-500 ease-out group/input mt-4",
            isFocused 
                ? "bg-[#0E0E0E] border-red-500/40 shadow-[0_0_20px_rgba(220,38,38,0.1)]" 
                : "bg-white/[0.03] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
        )}
      >
        <Plus 
            className={cn(
                "w-5 h-5 transition-all duration-300", 
                isFocused ? "text-red-500 opacity-100 scale-110" : "text-neutral-500 opacity-50 group-hover/input:opacity-80"
            )} 
        />
        
        <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none h-12 text-sm text-white placeholder:text-neutral-500/60 placeholder:font-medium placeholder:tracking-wide"
        />

        <div className="flex items-center gap-2">
            {isFocused && !newItem && (
                <span className="text-[10px] text-neutral-600 font-medium uppercase tracking-wider mr-3 animate-in fade-in slide-in-from-right-2">
                    Pressione Enter
                </span>
            )}
            
            <Button 
                size="sm"
                onClick={handleAdd}
                disabled={!newItem.trim()}
                className={cn(
                    "h-9 px-3 rounded-lg transition-all duration-300",
                    newItem.trim() 
                        ? "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20 w-auto opacity-100" 
                        : "bg-transparent text-transparent w-0 p-0 opacity-0 overflow-hidden"
                )}
            >
                <CornerDownLeft className="w-4 h-4" />
            </Button>
        </div>
      </div>

    </div>
  );
};