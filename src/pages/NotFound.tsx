import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-center h-[60vh] text-center px-4">
      <div className="space-y-6">
        <h1 className="text-6xl font-black text-red-600 glow-text">404</h1>
        <p className="text-xl text-neutral-400 font-medium">Ops! Página não encontrada.</p>
        <p className="text-sm text-neutral-600 max-w-md mx-auto">
          O caminho <span className="text-neutral-500 font-mono bg-neutral-900 px-1 py-0.5 rounded">{location.pathname}</span> não existe no mapa.
        </p>
        <Link to="/">
          <Button variant="outline" className="mt-4 border-white/10 hover:bg-white/5 text-white">
            Retornar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;