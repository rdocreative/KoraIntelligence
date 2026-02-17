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
    <div className="space-y-3">
      <div className="space-y-1">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-3 group animate-in slide-in-from-left-2 duration-300 hover:bg-white/5 p-2 -mx-2 rounded-lg transition-all border border-transparent">
            <div 
              onClick={() => onToggle(item.id)}
              className={`w-4 h-4 mt-1 rounded border flex items-center justify-center cursor-pointer transition-all duration-300 ease-out active:scale-75 shadow-sm flex-shrink-0 ${item.completed ? 'bg-red-600 border-red-600 shadow-[0_0_8px_rgba(220,38,38,0.4)]' : 'border-neutral-700 hover:border-red-500 hover:bg-neutral-900'}`}
            >
              {item.completed && <CheckSquare className="w-3 h-3 text-white animate-in zoom-in duration-300" />}
            </div>
            <span className={`flex-1 text-sm font-medium transition-all duration-300 leading-tight ${item.completed ? 'text-neutral-600 line-through' : 'text-neutral-300'}`}>
              {item.text}
            </span>
            {onDelete && (
              <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-500 transition-all duration-300 p-0.5">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="relative group flex items-end gap-2 pt-2">
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
          className="h-8 py-0 pl-0 pr-8 text-sm bg-transparent border-0 border-b border-white/10 rounded-none focus-visible:ring-0 focus-visible:border-red-500 transition-all placeholder:text-neutral-700 text-neutral-300"
        />
        <Button 
            type="button"
            variant="ghost"
            size="icon" 
            onClick={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="h-8 w-8 text-neutral-600 hover:text-white hover:bg-transparent"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};