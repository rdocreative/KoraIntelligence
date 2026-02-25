"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface ParticleEffectProps {
  trigger: boolean;
  startX: number;
  startY: number;
  color: string;
  onComplete: () => void;
}

export const ParticleEffect = ({ trigger, startX, startY, color, onComplete }: ParticleEffectProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + i,
        x: startX,
        y: startY,
        color: color,
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, startX, startY, color, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {particles.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ 
              x: p.x, 
              y: p.y, 
              scale: 0,
              opacity: 1 
            }}
            animate={{ 
              // Explosão inicial
              x: [
                p.x, 
                p.x + (Math.random() - 0.5) * 100, // Espalha horizontalmente
                window.innerWidth - 200 // Voa para os status no TopBar (aproximadamente)
              ],
              y: [
                p.y, 
                p.y - 50 - Math.random() * 50, // Sobe um pouco
                20 // Sobe para o topo
              ],
              scale: [0, 1.5, 0.5],
              opacity: [1, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              times: [0, 0.2, 1]
            }}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              borderRadius: '2px', // Estilo Pixel
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};