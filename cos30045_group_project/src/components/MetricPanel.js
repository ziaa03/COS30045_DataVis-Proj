import React from 'react';
import { Globe, BarChart2, LineChart } from 'lucide-react';

const MetricPanel = ({ metric, setMetric }) => {
  const metrics = [
    {
      id: 'pm25',
      name: 'Global PM2.5 Distribution',
      description: 'Interactive world map showing PM2.5 exposure levels',
      icon: Globe,
      color: 'text-red-400',
      details: 'Click on countries to view detailed metrics and radar analysis'
    },
    {
      id: 'top10',
      name: 'Most Vulnerable Nations',
      description: 'Identify countries with highest PM2.5-related mortality rates',
      icon: BarChart2,
      color: 'text-amber-400',
      details: 'Compare mortality rates and demographic factors'
    },
    {
      id: 'mortality_comparison',
      name: 'Concentration Impact Study',
      description: 'Analyze death rates across PM2.5 concentration ranges and identify critical thresholds',
      icon: LineChart,
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="flex flex-col space-y-3">
      <label className="text-slate-200 text-sm font-semibold">
        Select Analysis View
      </label>
      <div className="space-y-2">
        {metrics.map((item) => {
          const Icon = item.icon;
          const isSelected = metric === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setMetric(item.id)}
              className={`w-full p-4 rounded-lg border transition-all duration-300
                ${isSelected 
                  ? 'bg-slate-800/90 border-slate-600' 
                  : 'border-slate-800 hover:border-slate-700 bg-slate-800/50'}
                group`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-slate-700' : 'bg-slate-700/50'}`}>
                  <Icon className={`w-5 h-5 ${isSelected ? item.color : 'text-slate-400'}`} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {item.description}
                  </p>
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                      <p className="text-sm text-slate-400">
                        {item.details}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {metric === 'mortality_comparison' && (
        <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
          <h4 className="text-sm font-medium text-blue-400 mb-2">
            Understanding the Analysis
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start space-x-2">
              <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-red-400 shrink-0" />
              <span>Red bars show average mortality rates for each PM2.5 range</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" />
              <span>Blue line tracks average PM2.5 levels within each range</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MetricPanel;