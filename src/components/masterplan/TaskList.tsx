import { useState } from "react";
import { CheckSquare, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskItem } from "@/hooks/useMasterplan";

export const TaskList = ({ 
  items, onAdd, onToggle, onDelete, placeholder = "Adicionar item..." 
}: { 
  items: TaskItem[], onAdd: (text: string) => void, onToggle: (id: string) => void, onDelete?: (id: string) => void, placeholder?: string
}) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (!newItem.trim()) return;
    onAdd(newItem);
    setNewItem("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-4 group animate-in slide-in-from-left-2 duration-300 hover:bg-white/5 p-3 -mx-3 rounded-xl transition-all border border-transparent hover:border-white/5">
            <div 
              onClick={() => onToggle(item.id)}
              className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center cursor-pointer transition-all duration-300 ease-out active:scale-75 shadow-sm ${item.completed ? 'bg-red-600 border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.4)]' : 'border-neutral-700 hover:border-red-500 hover:scale-110 bg-neutral-900'}`}
            >
              {item.completed && <CheckSquare className="w-3.5 h-3.5 text-white animate-in zoom-in duration-300" />}
            </div>
            <span className={`flex-1 text-sm font-medium transition-all duration-300 ${item.completed ? 'text-neutral-600 line-through' : 'text-neutral-200'}`}>
              {item.text}
            </span>
            {onDelete && (
              <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-500 transition-all duration-300 hover:scale-110 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="relative group">
        <Input 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="h-11 pl-4 pr-10 text-sm bg-black/40 border-white/10 focus:border-red-500/50 transition-all duration-300 focus:ring-1 focus:ring-red-500/20 rounded-xl placeholder:text-neutral-600"
        />
        <Button 
            type="button"
            size="icon" 
            onClick={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="absolute right-1 top-1 h-9 w-9 p-0 bg-neutral-800 hover:bg-red-600 text-neutral-400 hover:text-white transition-all duration-300 rounded-lg z-10"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};