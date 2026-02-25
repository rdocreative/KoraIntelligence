"use client";

import React from "react";
import { Outlet } from "react-router-dom";
import { SideNav } from "./SideNav";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-[#fcfcfc] dark:bg-[#1a1a1a]">
      <SideNav />
      {/* Área principal com margem para a sidebar e container centralizado */}
      <main className="flex-1 ml-[200px] p-8 w-full max-w-[1200px] mx-auto animate-in fade-in duration-500">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;