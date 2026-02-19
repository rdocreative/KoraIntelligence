"use client";

import React, { useEffect, useState, useMemo } from 'react';

const BackgroundParticles = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-red-600 blur-[1px]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `particle-float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes particle-float {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: inherit;
          }
          80% {
            opacity: inherit;
          }
          100% {
            transform: translate(\${Math.random() * 100 - 50}px, -150px) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BackgroundParticles;