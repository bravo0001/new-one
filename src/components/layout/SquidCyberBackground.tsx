'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const SquidCyberBackground: React.FC = () => {
  // Floating playful Super Mario & Clash of Clans village particles
  const floatingItems = [
    { icon: '🪙', x: '6%', delay: 0, duration: 14, size: '22px' },
    { icon: '🍄', x: '16%', delay: 4, duration: 18, size: '24px' },
    { icon: '⭐', x: '26%', delay: 1, duration: 16, size: '20px' },
    { icon: '💧', x: '36%', delay: 6, duration: 12, size: '18px' },
    { icon: '🌿', x: '46%', delay: 3, duration: 20, size: '22px' },
    { icon: '🪙', x: '56%', delay: 7, duration: 15, size: '22px' },
    { icon: '🏰', x: '66%', delay: 2, duration: 22, size: '22px' },
    { icon: '⭐', x: '76%', delay: 5, duration: 17, size: '20px' },
    { icon: '🧪', x: '86%', delay: 8, duration: 13, size: '22px' },
    { icon: '🍀', x: '94%', delay: 3.5, duration: 19, size: '24px' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Clash of Clans & Super Mario Village Scenic Landscape */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 filter saturate-110"
        style={{
          backgroundImage: 'url(/coc-mario-bg.jpg)',
        }}
      />

      {/* 2. Soft White Radiant Morning Wash - Guarantees 100% Crisp Contrast & High Readability */}
      <div className="absolute inset-0 bg-white/78 backdrop-blur-[2px] transition-all duration-500" />

      {/* 3. Subtle Sunny Village Gradients - Gentle Sky Blue Top & Lush Green Bottom Aura */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-transparent to-emerald-500/10" />

      {/* 4. Floating Animated Super Mario Coins, Clash Elixir & Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ y: '105vh', opacity: 0, rotate: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.75, 0.75, 0],
              rotate: [0, 15, -15, 360],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              left: item.x,
              bottom: 0,
              fontSize: item.size,
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
