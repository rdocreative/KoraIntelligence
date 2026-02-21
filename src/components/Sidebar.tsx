"use client";

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BrainCircuit, 
  Settings, 
  Users,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: BrainCircuit, label: 'Knowledge Base', path: '/knowledge' },
    { icon: Users, label: 'Agents', path: '/agents' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside 
      className="w-[230px] h-screen flex flex-col border-none"
      style={{
        background: 'linear-gradient(135deg, #0d1716 0%, #080f0e 60%, #050f0e 100%)'
      }}
    >
      <div className="p-6">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
            <BrainCircuit className="text-white" size={18} />
          </div>
          Dyad AI
        </h1>
      </div>

      <nav className="flex-1 px-3 space-y-1.5 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}
            `}
            style={({ isActive }) => ({
              background: isActive 
                ? 'linear-gradient(135deg, #0a1a18 0%, #070d0c 100%)' 
                : 'transparent'
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #0a1a18 0%, #070d0c 100%)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <item.icon size={18} />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-[#0a1a18] rounded-2xl p-4 border border-[#1a2e2c]">
          <p className="text-[10px] text-gray-400 mb-2 font-medium uppercase tracking-wider">Pro Plan</p>
          <div className="h-1.5 w-full bg-[#1a2e2c] rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-3/4" />
          </div>
          <p className="text-[10px] text-gray-500 mt-2">75% usage</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;