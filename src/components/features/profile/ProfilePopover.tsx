import { Mail, Calendar, ShieldCheck } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

export const ProfilePopover = () => {
  const { settings } = useSettings();

  // Pega as iniciais do nome para o avatar
  const initials = settings.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="w-72 p-5 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-red-600 to-red-900 p-[2px]">
            <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center overflow-hidden border-2 border-black/50">
               <span className="text-2xl font-black text-white">{initials || "ME"}</span>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1 border-2 border-[#0a0a0a]">
            <ShieldCheck className="w-3 h-3 text-white" />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg text-white">{settings.userName}</h3>
          <p className="text-xs text-neutral-500">Membro da Comunidade</p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full pt-4 border-t border-white/5">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Level</p>
            <p className="text-lg font-black text-red-500">1</p>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">XP</p>
            <p className="text-lg font-black text-white">0</p>
          </div>
        </div>

        <div className="w-full space-y-2 text-left pt-2">
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <Mail className="w-3.5 h-3.5" />
            usuario@exemplo.com
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <Calendar className="w-3.5 h-3.5" />
            Membro desde 2024
          </div>
        </div>
      </div>
    </div>
  );
};