import React from "react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#060606]/80 backdrop-blur-md">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center pl-4 md:pl-0">
            <div className="h-6 w-6 rounded bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
            <span className="text-lg font-bold tracking-wider text-white">FOCUS</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              {/* Add navigation items here if needed */}
            </nav>
          </div>
        </div>
      </header>
      <main className={cn("flex-1 container py-6 md:py-10", className)}>
        {children}
      </main>
    </div>
  );
};