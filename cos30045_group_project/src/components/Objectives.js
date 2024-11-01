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
      title: "Performance",
      description: "Optimize system performance and response times",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20"
    },
    {
      id: 2,
      icon: Globe,
      title: "Global Reach",
      description: "Expand presence in international markets",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20"
    },
    {
      id: 3,
      icon: Brain,
      title: "Innovation",
      description: "Drive technological advancement and creative solutions",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20"
    },
    {
      id: 4,
      icon: Factory,
      title: "Efficiency",
      description: "Streamline operations and reduce waste",
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/20"
    },
    {
      id: 5,
      icon: Users,
      title: "Community",
      description: "Build and nurture user communities",
      color: "text-teal-400",
      bgColor: "bg-teal-400/10",
      borderColor: "border-teal-400/20"
    }
  ];

  // TO DO: calculate the position of each objective on the circle based on the total number of objectives
  const getPosition = (index, total) => {
    const angleStep = (2 * Math.PI) / total;
    const angle = index * angleStep + (rotation * Math.PI) / 180;
    const roundedAngle = Math.round(angle * 1000) / 1000;
    
    const radius = 200;
    const x = Math.cos(roundedAngle) * radius;
    const y = Math.sin(roundedAngle) * radius;

    return { x, y };
  };

  // hook to handle the continuous rotation of the objectives when no objective is selected. once an objective is selected, the rotation stops
  // requestAnimationFrame - for smooth animation
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

  // TO DO: doesnt close directly yet 
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
    <section id="objectives" className="relative w-full min-h-dvh bg-gradient-to-b from-gray-900 to-gray-800 py-20 px-4 md:px-8 pt-32 scroll-section overflow-hidden">
      
      {/* background gradient */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200 via-blue-400 to-purple-700 z-0"></div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Our Objectives
          </h2>
          <p className="text-xl text-gray-300 text-lg max-w-2xl mx-auto">
            Key goals and milestones we aim to achieve through our platform
          </p>
        </div>

        {/* objectives Circle */}
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
          
          {/* each obj is rendered as a button, position calculated using getPosition */}
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
                            transition-all duration-500 backdrop-blur-sm
                            flex items-center justify-center`}
                >
                  <Icon className={`w-8 h-8 ${objective.color}`} />
                </button>
              </div>
            );
          })}
        </div>

        {/* sliding Info Panel */}
        <div
          className={`fixed top-0 right-0 w-96 h-full bg-gray-800/95 backdrop-blur-sm
                    transform transition-transform duration-500 ease-in-out z-50
                    border-l border-gray-700 ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
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
                
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Key Features:</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Advanced analytics and monitoring</li>
                    <li>Real-time performance tracking</li>
                    <li>Automated optimization tools</li>
                    <li>Comprehensive reporting system</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}