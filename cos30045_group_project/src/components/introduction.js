'use client';

import React, { useState } from 'react';
import { AlertCircle, Wind, Factory, Leaf } from 'lucide-react';

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
    },
    {
      icon: <Leaf className="w-12 h-12 text-emerald-400" />,
      title: "The Challenge Ahead",
      content: "Urbanization, industrialization, and increasing energy demands have worsened air quality, particularly in developing regions. Monitoring and visualizing PM2.5 levels is essential for public awareness and policy guidance."
    }
  ];

  return (
    <section className="relative w-full min-h-dvh bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24 px-6 md:px-12 overflow-hidden scroll-section" id="introduction">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] opacity-20" />
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto">
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
                  {/* Icon and title row */}
                  <div className="flex items-center gap-6">
                    {/* Icon container with animations */}
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

                  {/* Content with slide-up animation */}
                  <div className="ml-24 transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                    <p className="text-gray-400 leading-relaxed text-lg 
                                transition-all duration-500 group-hover:text-gray-300">
                      {section.content}
                    </p>
                  </div>

                  {/* Decorative line */}
                  <div className="absolute left-12 top-24 bottom-0 w-px bg-gradient-to-b from-blue-500/20 to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </section>
  );
}