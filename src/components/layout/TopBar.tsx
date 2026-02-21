import { useAuth } from "@/components/providers/AuthProvider";
import { User } from "lucide-react";

export const TopBar = () => {
  const { session } = useAuth();
  const userName = session?.user?.email?.split("@")[0] || "Usuário";

  return (
    <header className="w-full flex justify-between items-center bg-transparent">
      <div>
        <h1 className="text-xl font-bold text-[#e8f5f3]">Dashboard</h1>
        <p className="text-sm text-[#3a6a65]">Bem-vindo de volta, {userName}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-[#38bdf8]">NÍVEL 12</span>
          <div className="w-24 h-1.5 bg-[#1e3a36] rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-[#38bdf8] w-[65%]" />
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#1e3a36] border border-[#2a4a46] flex items-center justify-center text-[#e8f5f3]">
          <User size={18} />
        </div>
      </div>
    </header>
  );
};