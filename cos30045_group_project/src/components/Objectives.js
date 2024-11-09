'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Globe, Brain, Factory, Users, X } from 'lucide-react';

export default function Objectives() {
  const [activeObjective, setActiveObjective] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const objectives = [
    {
      id: 1,
      icon: Activity,
      title: "Track Air Quality",
      description: "Monitor real-time PM2.5 levels and track historical trends across different regions",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20"
    },
    {
      id: 2,
      icon: Globe,
      title: "Global Coverage",
      description: "Analyze air quality patterns across different countries and urban centers worldwide",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20"
    },
    {
      id: 3,
      icon: Brain,
      title: "Data Analysis",
      description: "Advanced statistical analysis of PM2.5 data to identify patterns and correlations",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20"
    },
    {
      id: 4,
      icon: Factory,
      title: "Source Tracking",
      description: "Identify and monitor major pollution sources and their impact on air quality",
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/20"
    },
    {
      id: 5,
      icon: Users,
      title: "Health Impact",
      description: "Assess the relationship between PM2.5 levels and public health metrics",
      color: "text-teal-400",
      bgColor: "bg-teal-400/10",
      borderColor: "border-teal-400/20"
    }
  ];

  // Position calculation logic remains the same
  const getPosition = (index, total) => {
    const angleStep = (2 * Math.PI) / total;
    const angle = index * angleStep + (rotation * Math.PI) / 180;
    const roundedAngle = Math.round(angle * 1000) / 1000;
    
    const radius = 200;
    const x = Math.cos(roundedAngle) * radius;
    const y = Math.sin(roundedAngle) * radius;

    return { x, y };
  };

  // Animation hooks remain the same
  useEffect(() => {
    let animationFrame;
    const animate = () => {
      if (!activeObjective) {
        setRotation(prev => (prev + 0.1) % 360);
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [activeObjective]);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#objectives') {
        const element = document.getElementById('objectives');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleObjectiveClick = (objective) => {
    if (activeObjective?.id === objective.id) {
      setActiveObjective(null);
      setIsPanelOpen(false);
    } else {
      setActiveObjective(objective);
      setIsPanelOpen(true);
    }
  };

  return (
    <section id="objectives" className="relative w-full min-h-dvh py-20 pt-48 px-4 md:px-8 scroll-section overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/objective-bg.jpg')",
            filter: "brightness(0.2)"
          }}
        />
        
        
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Interactive circle */}
          <div className="relative h-[600px] flex items-center justify-center">
            <div className={`absolute w-64 h-64 rounded-full bg-gray-800/50 backdrop-blur-sm 
                          border-2 border-gray-700 transition-all duration-500
                          ${activeObjective ? 'scale-125' : 'scale-100'}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  {activeObjective ? activeObjective.title : "Objectives"}
                </span>
              </div>
            </div>
            
            {/* Objective lines */}
            {objectives.map((objective, index) => {
              const pos = getPosition(index, objectives.length);
              return (
                <div
                  key={`line-${objective.id}`}
                  className={`absolute left-1/2 top-1/2 w-[200px] h-[2px] origin-left
                            transition-all duration-500 ${objective.color} opacity-30
                            ${activeObjective?.id === objective.id ? 'opacity-100' : ''}`}
                  style={{
                    transform: `translate(-50%, -50%) rotate(${Math.atan2(pos.y, pos.x)}rad)`
                  }}
                />
              );
            })}

            {/* Objective buttons */}
            {objectives.map((objective, index) => {
              const pos = getPosition(index, objectives.length);
              const Icon = objective.icon;
              const isActive = activeObjective?.id === objective.id;

              return (
                <div
                  key={objective.id}
                  className={`absolute left-1/2 top-1/2 transition-all duration-500
                            ${isActive ? 'scale-110' : 'scale-100 hover:scale-105'}`}
                  style={{
                    transform: `translate(${pos.x}px, ${pos.y}px)`
                  }}
                >
                  <button
                    onClick={() => handleObjectiveClick(objective)}
                    className={`relative -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full 
                              ${objective.bgColor} ${objective.borderColor} border-2
                              transition-all duration-500 backdrop-blur-sm group
                              flex items-center justify-center`}
                  >
                    <Icon className={`w-8 h-8 ${objective.color} group-hover:scale-110 transition-transform`} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right column - Text content (moved from left) */}
          <div className="space-y-8 lg:pl-12">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
                Project<br/>Objectives
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-transparent rounded-full" />
              <p className="text-xl text-gray-300 leading-relaxed">
                Our visualization project focuses on several key aspects of global PM2.5 pollution, 
                aiming to provide comprehensive insights into air quality patterns and their impacts.
              </p>
            </div>

            <div className="hidden lg:block">
              {activeObjective ? (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 
                               transform transition-all duration-500 hover:border-gray-600/50">
                  <div className={`${activeObjective.bgColor} ${activeObjective.borderColor} border-2 
                                w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                    <activeObjective.icon className={`w-8 h-8 ${activeObjective.color}`} />
                  </div>
                  <h3 className={`text-2xl font-bold ${activeObjective.color} mb-4`}>
                    {activeObjective.title}
                  </h3>
                  <p className="text-gray-300 text-lg">
                    {activeObjective.description}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/30">
                  <p className="text-gray-400 italic">
                    Select an objective to learn more about our approach
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sliding panel */}
      <div className={`lg:hidden fixed top-0 right-0 w-96 h-full bg-gray-800/95 backdrop-blur-sm
                    transform transition-transform duration-500 ease-in-out z-50
                    border-l border-gray-700 ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {activeObjective && (
          <div className="p-8 h-full relative">
            <button
              onClick={() => {
                setActiveObjective(null);
                setIsPanelOpen(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mt-8">
              <div className={`${activeObjective.bgColor} ${activeObjective.borderColor} border-2 
                            w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                <activeObjective.icon className={`w-8 h-8 ${activeObjective.color}`} />
              </div>
              
              <h3 className={`text-2xl font-bold ${activeObjective.color} mb-4`}>
                {activeObjective.title}
              </h3>
              
              <p className="text-gray-300 text-lg mb-6">
                {activeObjective.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}