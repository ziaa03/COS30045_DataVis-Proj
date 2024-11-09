'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Wind, Factory, Leaf } from 'lucide-react';

const ParticleEffect = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  );
};

export default function Introduction() {
  const [activeSection, setActiveSection] = useState(0);
  
  const sections = [
    {
      icon: <AlertCircle className="w-12 h-12 text-red-400" />,
      title: "The PM2.5 Crisis",
      content: "Poor air quality has adversely impacted both health and economic development, making it a priority for government bodies and a growing concern for the public."
    },
    {
      icon: <Wind className="w-12 h-12 text-blue-400" />,
      title: "What is PM2.5?",
      content: "PM2.5 refers to fine particulate matter with diameter of less than or equal to 2.5 microns - smaller than a human hair (70 microns). These particles are small enough to penetrate deeply into the lungs and enter the bloodstream."
    },
    {
      icon: <Factory className="w-12 h-12 text-gray-400" />,
      title: "Sources & Impact",
      content: "Vehicle emissions, industrial activities, forest fires, and other forms of combustion are major sources. Prolonged exposure can lead to serious respiratory and cardiovascular diseases."
    }
  ];

  return (
    <section className="relative w-full min-h-dvh py-24 px-6 md:px-12 overflow-hidden scroll-section" id="introduction">
      {/* Background image with overlays */}
      <div className="absolute inset-0 z-0">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/intro.jpg')",
            filter: "brightness(0.3)"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          {/* Left side - Sticky title */}
          <div className="md:w-1/3 md:sticky md:top-24 md:h-fit">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="inline-block animate-gradient bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent bg-[length:200%_auto]">
                Understanding PM2.5
              </span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Explore the critical impact of fine particulate matter on global health, environment, and urban ecosystems.
            </p>
          </div>

          {/* Right side - Interactive sections */}
          <div className="md:w-2/3">
            <div className="relative flex flex-col space-y-12 md:space-y-24">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className={`group relative flex flex-col gap-6 transition-all duration-700 
                            ${activeSection === index ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-4'}`}
                  onMouseEnter={() => setActiveSection(index)}
                >
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-sm 
                                  transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
                      <div className="relative bg-gray-800/50 p-6 rounded-full border border-white/10 
                                  transform transition-all duration-500 group-hover:scale-110 group-hover:border-white/20
                                  group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                        {section.icon}
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-white tracking-wide 
                                bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {section.title}
                    </h3>
                  </div>

                  <div className="ml-24 transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                    <p className="text-gray-400 leading-relaxed text-lg 
                                transition-all duration-500 group-hover:text-gray-300">
                      {section.content}
                    </p>
                  </div>

                  <div className="absolute left-12 top-24 bottom-0 w-px bg-gradient-to-b from-blue-500/20 to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Client-side only particle effect */}
      <ParticleEffect />
    </section>
  );
}