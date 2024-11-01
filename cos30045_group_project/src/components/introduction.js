'use client'; // forces a component to be rendered on the client side only - because of the interactiveness 

import React, { useState } from 'react';
import { AlertCircle, Wind, Factory, Leaf } from 'lucide-react';

export default function Introduction() {
  const [activeSection, setActiveSection] = useState(0);
  
  // Section data - crisis, definition, sources, challenge
  const sections = [
    {
      icon: <AlertCircle className="w-12 h-12 text-red-500" />,
      title: "The PM2.5 Crisis",
      content: "Poor air quality has adversely impacted both health and economic development, making it a priority for government bodies and a growing concern for the public."
    },
    {
      icon: <Wind className="w-12 h-12 text-blue-500" />,
      title: "What is PM2.5?",
      content: "PM2.5 refers to fine particulate matter with diameter of less than or equal to 2.5 microns - smaller than a human hair (70 microns). These particles are small enough to penetrate deeply into the lungs and enter the bloodstream."
    },
    {
      icon: <Factory className="w-12 h-12 text-gray-500" />,
      title: "Sources & Impact",
      content: "Vehicle emissions, industrial activities, forest fires, and other forms of combustion are major sources. Prolonged exposure can lead to serious respiratory and cardiovascular diseases."
    },
    {
      icon: <Leaf className="w-12 h-12 text-green-500" />,
      title: "The Challenge Ahead",
      content: "Urbanization, industrialization, and increasing energy demands have worsened air quality, particularly in developing regions. Monitoring and visualizing PM2.5 levels is essential for public awareness and policy guidance."
    }
  ];

  return (
    <section className="relative w-full min-h-dvh bg-gradient-to-b from-gray-900 to-gray-800 py-20 px-4 md:px-8 scroll-section" id="introduction">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200 via-blue-400 to-purple-700 z-0"></div>
      
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        {/* Left Side Content - More emphasis and left-aligned */}
        <div className="w-full md:w-2/5 text-left mb-12 md:mb-0 md:pr-16 z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Understanding <br />PM2.5
          </h2>
          <p className="text-xl text-gray-300 max-w-md leading-relaxed">
            Delve into the critical impact of fine particulate matter on global health, environment, and urban ecosystems.
          </p>
        </div>

        {/* Right Side Cards */}
        <div className="w-full md:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-6 z-10 mt-14">
          {sections.map((section, index) => (
            <div
              key={index}
              className="group relative bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 
                         transition-all duration-500 ease-in-out transform hover:scale-[1.03] hover:bg-gray-800/80
                         hover:border-blue-500/50 shadow-xl hover:shadow-2xl"
              onMouseEnter={() => setActiveSection(index)}
            >
              {/* Subtle hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl" />
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  {section.icon}
                </div>
                <h3 className="text-xl font-semibold text-white tracking-wide">{section.title}</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-base opacity-90">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
