import React from 'react';
import { Outlet } from 'react-router-dom';
import { SideNav } from './SideNav';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SideNav />
      {/* 
        Main content area offset by sidebar width (200px) 
        The inner container uses mx-auto to center content horizontally
      */}
      <main className="flex-1 ml-[200px] w-[calc(100%-200px)] min-h-screen">
        <div className="container mx-auto px-8 py-10 max-w-6xl animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;