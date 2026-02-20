"use client";

import React, { useMemo } from 'react';

const FallingParticles = () => {
  const particleCount = 12; // Quantidade baixa para manter a otimização máxima

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${15 + Math.random() * 25}s`, // Queda bem lenta e suave
      delay: `${Math.random() * -40}s`, // Delay negativo para as partículas já estarem na tela ao carregar
      size: `${1 + Math.random() * 2}px`, // Partículas bem pequenas
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      <style>
        {`
          @keyframes fall-and-fade {
            0% { 
              transform: translateY(-10vh); 
              opacity: 0.6; 
            }
            30% { 
              opacity: 0; 
            }
            60% { 
              opacity: 0; 
            }
            90% { 
              opacity: 0.6; 
            }
            100% { 
              transform: translateY(110vh); 
              opacity: 0.6; 
            }
          }
        `}
      </style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#4adbc8]"
          style={{
            left: p.left,
            top: '-5%',
            width: p.size,
            height: p.size,
            boxShadow: '0 0 8px rgba(74, 219, 200, 0.4)',
            animation: `fall-and-fade ${p.duration} linear infinite`,
            animationDelay: p.delay,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
};

export default FallingParticles;