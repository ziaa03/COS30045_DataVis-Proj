import React from 'react';
import { X } from 'lucide-react';  // for close button 
import Graph from './Graph'; // child component 

// accepts props isOpen, onClose, countryData
const GraphModal = ({ isOpen, onClose, countryData }) => {
if (!isOpen || !countryData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900/95 w-[90vw] max-w-6xl h-[80vh] rounded-xl border border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h3 className="text-xl font-semibold text-white">
            {`${countryData.name}: Data Trends`}  
          </h3>
        {/* Close button */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Graph Content */}
        <div className="p-6 h-[calc(100%-88px)] overflow-y-auto">
          <Graph 
            selectedCountry={countryData.name}  // pass country name to Graph component
          />
        </div>
      </div>
    </div>
  );
};

export default GraphModal;