'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen bg-black font-sourceSans overflow-hidden scroll-section">
      {/* Video Background with Enhanced Parallax */}
      <div 
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ 
          transform: `scale(1.1) translateY(${scrollY * 0.2}px)`,
        }}
      >
        <video 
          className="w-full h-full object-cover"
          autoPlay 
          muted 
          loop
          playsInline
          style={{ filter: 'brightness(0.5) saturate(1.2)' }}
        >
          <source src='/videos/world.mp4' type='video/mp4' />
        </video>
      </div>

      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/70 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-[1]" />

      {/* Main Content */}
      <div className="relative z-[2]">
        <div className="container mx-auto px-6 min-h-screen flex flex-col justify-center">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced Title with Gradient */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-12"
            >
              <h1 className="title text-4xl lg:text-7xl xl:text-7xl text-white leading-tight font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                A World in Haze:
                <span className="block text-3xl lg:text-4xl xl:text-4xl mt-4 font-light text-white/90">
                  Mapping Global Air Pollution
                </span>
              </h1>
            </motion.div>

            {/* Story Text with Enhanced Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="space-y-8"
              >
                <p className="text-xl lg:text-xl text-white/90 leading-relaxed">
                In a world where clean air is essential, millions face an unseen challenge. Across cities, a quiet struggle unfolds—one that affects us all, no matter where we live.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="h-px w-24 bg-gradient-to-r from-rose-400/50 to-transparent" />
                  <p className="text-lg text-rose-400/70 italic font-light">
                    An exploration of air quality
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="space-y-8"
              >
                <p className="text-xl lg:text-xl text-white/90 leading-relaxed">
                Together, we can make a difference and create a healthier environment. This isn’t just data—it’s about the air we all breathe and the responsibility we share for the future.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center gap-4"
          >
            <div className="h-16 w-[1px] bg-gradient-to-b from-rose-400/40 to-transparent" />
            <a 
              href="#introduction"
              className="group transition-all duration-300 ease-in-out"
            >
              <ChevronDown 
                size={32} 
                className="text-white/80 transition-transform duration-300 transform group-hover:translate-y-1" 
              />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}