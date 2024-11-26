import React from 'react';
import { X } from 'lucide-react';
import Graph from './Graph';

const GraphModal = ({ isOpen, onClose, countryData }) => {
  if (!isOpen || !countryData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Enhanced Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal with matching gradient background */}
      <div className="relative w-[90vw] max-w-6xl h-[85vh] rounded-2xl 
                    shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden">
        {/* Gradient background wrapper */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" />
        
        {/* Content wrapper with glass effect */}
        <div className="relative h-full bg-slate-900/20 backdrop-blur-sm">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between px-8 py-6 
                         border-b border-blue-900/30 bg-slate-900/40">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold tracking-tight 
                           bg-gradient-to-r from-blue-400 to-cyan-400 
                           bg-clip-text text-transparent">
                {countryData.name}
              </h3>
              <p className="text-slate-400 text-sm">
                Detailed metrics analysis
              </p>
            </div>
            
            {/* Enhanced Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white 
                       hover:bg-white/10 transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-400/20"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Graph Content with enhanced padding and scroll handling */}
          <div className="p-8 h-[calc(100%-88px)] overflow-y-auto">
  <div className="h-full min-h-[600px]">
    <Graph selectedCountry={countryData.name} />
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default GraphModal;