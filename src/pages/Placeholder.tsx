import React from 'react';
import { useLocation } from 'react-router-dom';

const Placeholder = () => {
  const { pathname } = useLocation();
  const title = pathname.substring(1).charAt(0).toUpperCase() + pathname.slice(2);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">Esta página está em construção.</p>
      </div>
      
      <div className="rounded-xl border border-dashed p-10 flex items-center justify-center text-muted-foreground bg-muted/20">
        Conteúdo para {pathname} será exibido aqui.
      </div>
    </div>
  );
};

export default Placeholder;