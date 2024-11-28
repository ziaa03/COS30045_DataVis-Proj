'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import GraphModal from './GraphModal';
import Radar from './Radar';
import TopCountries from './TopCountries';
import MortalityComparison from './MortalityComparison';

export default function Visual() {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });
  const [metric, setMetric] = useState('pm25');
  const [allData, setAllData] = useState({
    population: new Map(),
    pm25: new Map(),
    death_by_pm: new Map(),
    median_age: new Map(),
  });
  const [yearData, setYearData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [worldData, setWorldData] = useState(null);

  // state for top 10 countries modal
  const [showTop10, setShowTop10] = useState(false);

  // state for mortality comparison modal
  const [showMortalityComparison, setShowMortalityComparison] = useState(false);

  // states for graph modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountryData, setSelectedCountryData] = useState(null);

  let max_population = Math.max(...allData.population.values());
  let max_pm25 = Math.max(...allData.pm25.values());
  let max_death_by_pm = Math.max(...allData.death_by_pm.values());

  useEffect(() => {
    // load TopoJSON data
    fetch('/json_files/countries-110m.json')
      .then(response => response.json())
      .then(data => setWorldData(data));

    // load all csv data then processed to create a structured data map
    Promise.all([
      d3.csv('/datasets/population.csv'),
      d3.csv('/datasets/oecd_pm25_exposure.csv'),
      d3.csv('/datasets/death_by_pm.csv'),
      d3.csv('/datasets/median_age.csv')
    ]).then(([populationData, pm25Data, deathByPMData, medianAgeData]) => {
      // Process population data first
      const processDataWithYears = (data, keyName) => {
        const yearMap = new Map();
        const years = new Set();

        data.forEach(d => {
          const yearColumns = Object.keys(d).filter(key => key !== keyName && !isNaN(key));
          yearColumns.forEach(year => years.add(year));
          
          const countryName = d[keyName].trim();
          yearColumns.forEach(year => {
            if (!yearMap.has(year)) {
              yearMap.set(year, new Map());
            }
            if (d[year]) {
              yearMap.get(year).set(countryName, +d[year]);
            }
          });
        });
        
        return { yearMap, years: Array.from(years).sort() };
      };

      // Process death data with normalization
      const processDeathData = (deathData, populationYearMap) => {
        const yearMap = new Map();
        const years = new Set();
      
        deathData.forEach(d => {
          const yearColumns = Object.keys(d).filter(key => key !== 'Country' && !isNaN(key));
          yearColumns.forEach(year => years.add(year));
      
          const countryName = d['Country'].trim();
          yearColumns.forEach(year => {
            if (!yearMap.has(year)) {
              yearMap.set(year, new Map());
            }
            
            const population = populationYearMap.get(year)?.get(countryName);
            const deaths = +d[year];
            
            if (population && deaths) {
              // Calculate what percentage of population died from PM2.5
              const normalizedValue = (deaths / population) * 100;  // Convert to percentage
              yearMap.get(year).set(countryName, normalizedValue);
            }
          });
        });
      
        return { yearMap, years: Array.from(years).sort() };
      };

      const populationYearData = processDataWithYears(populationData, 'Country');
      const pm25YearData = processDataWithYears(pm25Data, 'Country');
      const deathByPmYearData = processDeathData(
        deathByPMData, 
        populationYearData.yearMap
      );
      const medianAgeYearData = processDataWithYears(medianAgeData, 'Country');

      // finds the intersection of available years across all datasets 
      const commonYears = pm25YearData.years.filter(year => 
        populationYearData.years.includes(year) &&
        deathByPmYearData.years.includes(year) &&
        medianAgeYearData.years.includes(year)
      );

      setAvailableYears(commonYears);
      setSelectedYear(commonYears[commonYears.length - 1]);

      setYearData({
        population: populationYearData.yearMap,
        pm25: pm25YearData.yearMap,
        death_by_pm: deathByPmYearData.yearMap,
        median_age: medianAgeYearData.yearMap
      });
    });
  }, []);

  // updates data on year change (selected)
  useEffect(() => {
    if (!selectedYear || !yearData.pm25) return;
    
    const currentData = {
      population: yearData.population.get(selectedYear),
      pm25: yearData.pm25.get(selectedYear),
      death_by_pm: yearData.death_by_pm.get(selectedYear),
      median_age: yearData.median_age.get(selectedYear)
    };

    setAllData(currentData);
  }, [selectedYear, yearData]);

  const drawVisualization = () => {
    if (!allData[metric] || !worldData) return;

    const width = 2000;
    const height = 1000;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    drawMap(svg, width, height);
  };

  const drawMap = (svg, width, height) => {
    const projection = d3.geoEqualEarth()
      .scale(250)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const values = Array.from(allData[metric].values()).filter(v => !isNaN(v));
    const maxValue = d3.max(values);

    const colorScale = d3.scaleSequential()
      .domain([0, maxValue])
      .interpolator(getColorInterpolator());

    const g = svg.append('g');

    // Draw graticules
    const graticule = d3.geoGraticule();
    g.append('path')
      .datum(graticule)
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(147, 197, 253)')
      .attr('stroke-width', '0.2')
      .attr('stroke-opacity', '0.3');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Draw countries
    const countries = topojson.feature(worldData, worldData.objects.countries);
    g.selectAll('path.country')
  .data(countries.features)
  .join('path')
  .attr('class', 'country')
  .attr('d', path)
  .attr('fill', d => {
    const value = allData[metric].get(d.properties.name);
    return value ? colorScale(value) : 'rgb(55, 65, 81)';
  })
  .attr('stroke', 'rgb(147, 197, 253)')
  .attr('stroke-width', '0.2')
  .on('mouseover', handleMouseOver)
  .on('mouseout', handleMouseOut)
  .on('click', (event, d) => {
    const countryName = d.properties.name;
    if (countryName && allData[metric].has(countryName)) {
      setSelectedCountryData({
        name: countryName,
        population: allData.population.get(countryName),
        pm25: allData.pm25.get(countryName),
        death_by_pm: allData.death_by_pm.get(countryName),
      });
      setIsModalOpen(true);
    } else {
      console.log('No data available for:', countryName);
    }
});

    // Draw legend
    drawLegend(svg, colorScale, maxValue, width, height);

    // Draw sphere outline
    g.append('path')
      .datum({type: 'Sphere'})
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(147, 197, 253)')
      .attr('stroke-width', '0.5')
      .attr('stroke-opacity', '0.5');
  };

  const getColorInterpolator = () => {
    switch (metric) {
      case 'pm25':
        return d3.interpolateReds;
      default:
        return d3.interpolateReds;
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'pm25':
        return 'PM2.5 Exposure';
      case 'top10':
        return 'Top 10 Countries';
      case 'mortality_comparison':
        return 'Mortality Comparison';
      default:
        return '';
    }
  };
  
  const getMetricUnit = () => {
    switch (metric) {
      case 'pm25':
        return ' µg/m³';
      case 'top10':
        return ' % of population';
      case 'mortality_comparison':
        return ' % of population';
      default:
        return '';
    }
  };
  const drawLegend = (svg, colorScale, maxValue, width, height) => {
    // Keep existing legend dimensions
    const legendWidth = 50;
    const legendHeight = 850;
    const legendPosition = { 
        x: width - 150,
        y: height/2 - legendHeight/2
    };

    const legendScale = d3.scaleLinear()
        .domain([maxValue, 0])
        .range([0, legendHeight]);

    const legendAxis = d3.axisRight(legendScale)
        .ticks(8)
        .tickFormat(d => {
            if (d >= 1000000) {
                return d3.format('.1f')(d/1000000) + 'M';
            } else if (d >= 1000) {
                return d3.format('.1f')(d/1000) + 'k';
            }
            return d3.format('.1f')(d);
        });

    const legendContainer = svg.append('g')
        .attr('transform', `translate(${legendPosition.x}, ${legendPosition.y})`);

    // Combine title and unit into single label
    legendContainer.append('text')
        .attr('x', legendWidth/2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(`${getMetricLabel()} (${getMetricUnit().trim()})`);

    // Enhanced gradient (now vertical)
    const defs = svg.append('defs');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');

    // More gradient stops for smoother transition
    const legendStops = Array.from({ length: 50 }, (_, i) => i / 49);
    linearGradient.selectAll('stop')
      .data(legendStops)
      .join('stop')
      .attr('offset', d => `${d * 100}%`)
      .attr('stop-color', d => colorScale(maxValue - (d * maxValue)))  // Reversed for vertical
      .attr('stop-opacity', 1);

    // Main legend rectangle (now vertical)
    legendContainer.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)')
      .style('stroke', 'rgba(255, 255, 255, 0.3)')
      .style('stroke-width', 1)
      .attr('rx', 4);

    // Enhanced axis
    const axis = legendContainer.append('g')
      .attr('transform', `translate(${legendWidth}, 0)`)
      .call(legendAxis);

    // Style axis text
    axis.selectAll('text')
      .style('fill', 'white')
      .style('font-size', '12px')
      .style('font-weight', '500');

    // Style axis lines
    axis.selectAll('line')
      .style('stroke', 'rgba(255, 255, 255, 0.4)')
      .style('stroke-width', 1);
    
    axis.selectAll('path')
      .style('stroke', 'rgba(255, 255, 255, 0.4)')
      .style('stroke-width', 1);

    // Add min/max labels
    legendContainer.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', legendHeight + 30)
      .attr('text-anchor', 'start')
      .attr('fill', 'rgba(255, 255, 255, 0.7)')
      .attr('font-size', '14px')
      .text('Min');

    legendContainer.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', -10)
      .attr('text-anchor', 'start')
      .attr('fill', 'rgba(255, 255, 255, 0.7)')
      .attr('font-size', '14px')
      .text('Max');
};

// Add a function to calculate vulnerability based on age
const getVulnerabilityLevel = (age) => {
  if (age < 20) return { level: 'Lower', color: 'text-green-400' };
  if (age < 35) return { level: 'Moderate', color: 'text-yellow-400' };
  return { level: 'Higher', color: 'text-red-400' };
};

// Update handleMouseOver function
const handleMouseOver = (event, d) => {
  d3.select(event.currentTarget)
    .attr('stroke-width', '1');
  
  const bounds = event.currentTarget.getBoundingClientRect();
  const countryName = d.properties.name;
  const medianAge = allData.median_age.get(countryName);
  const vulnerability = getVulnerabilityLevel(medianAge);
  
  setTooltip({
    show: true,
    content: {
      name: countryName,
      population: allData.population.get(countryName)?.toLocaleString() || 'No data',
      pm25: allData.pm25.get(countryName)?.toFixed(1) + ' µg/m³' || 'No data',
      death_by_pm: (allData.death_by_pm.get(countryName)?.toFixed(4) || 'No data') + '% of population',
      median_age: medianAge?.toFixed(1) + ' years' || 'No data',
      vulnerability: vulnerability,
      
      population_raw: allData.population.get(countryName) || 0,
      pm25_raw: allData.pm25.get(countryName)?.toFixed(1) || 0,
      death_by_pm_raw: allData.death_by_pm.get(countryName) || 0,
      median_age_raw: medianAge || 0
    },
    x: bounds.left + bounds.width,
    y: bounds.top + (bounds.height / 2)
  });
};

  const handleMouseOut = (event) => {
    d3.select(event.currentTarget)
      .attr('stroke-width', '0.5');
    setTooltip(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    drawVisualization();
  }, [allData, worldData, metric]);

  return (
    <section className="relative w-full h-[calc(100vh)] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-row items-start scroll-section" id="visual">

    {/* Controls Panel - Enhanced with more modern styling */}
    <div className="w-80 h-full bg-slate-900/90 backdrop-blur-lg p-8 flex flex-col space-y-8 border-r border-blue-900/30 pt-24 shadow-2xl">
        <div className="flex flex-col space-y-8">
            {/* Enhanced Title */}
            <div className="space-y-2">
                <h2 className="text-white text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Global PM2.5 Analysis
                </h2>
                <p className="text-slate-400 text-sm">
                    Interactive visualization of global air quality metrics
                </p>
            </div>

            {/* Enhanced Metric Selector */}
            <div className="flex flex-col space-y-3">
                <label className="text-slate-200 text-sm font-semibold">
                    Select Metric
                </label>
                <div className="relative">
                    <select
                        value={metric}
                        onChange={(e) => setMetric(e.target.value)}
                        className="w-full bg-slate-800/90 text-white rounded-lg px-4 py-3 
                        appearance-none border border-blue-900/50 hover:border-blue-400/50 
                        focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 
                        transition-all duration-300 shadow-lg"
                    >
                        <option value="pm25">PM2.5 Exposure</option>
                        <option value="top10">Top 10 Countries</option>
                        <option value="mortality_comparison">Mortality Comparison</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Enhanced Year Selector */}
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <label className="text-slate-200 text-sm font-semibold">
                        Select Year
                    </label>
                    <span className="text-blue-400 text-sm font-bold px-3 py-1 bg-blue-950/50 rounded-full">
                        {selectedYear}
                    </span>
                </div>
                <div className="px-1">
                    <input
                        type="range"
                        min={0}
                        max={availableYears.length - 1}
                        value={availableYears.indexOf(selectedYear)}
                        onChange={(e) => setSelectedYear(availableYears[e.target.value])}
                        className="w-full h-2 bg-slate-700/50 rounded-full appearance-none cursor-pointer 
                        accent-blue-400 hover:accent-blue-300 transition-colors"
                    />
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>{availableYears[0]}</span>
                    <span>{availableYears[availableYears.length - 1]}</span>
                </div>
            </div>

            {/* Enhanced Legend Info */}
            <div className="flex flex-col space-y-4 p-5 bg-gradient-to-br from-slate-800/50 
                to-slate-700/30 rounded-xl border border-blue-900/30 backdrop-blur-lg shadow-xl">
                <h3 className="text-slate-200 text-sm font-semibold">Current Metric</h3>
                <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full shadow-lg"
                        style={{
                            backgroundColor: metric === 'pm25' ? '#cc0000' : '#0077cc',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}
                    />
                    <span className="text-white text-sm font-medium">
                        {getMetricLabel()}
                    </span>
                </div>
                <span className="text-slate-400 text-xs font-medium px-2 py-1 bg-slate-800/50 rounded-md w-fit">
                    Unit: {getMetricUnit()}
                </span>
            </div>
        </div>
    </div>

    {/* Map Container */}
    <div className="relative flex-1 h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <svg ref={svgRef} className="w-full h-full" />

        {/* Overlay for Top10 and Mortality Comparison */}
        {(metric === 'top10' || metric === 'mortality_comparison') && (
          <div 
            className="absolute inset-0 bg-black/40 z-10 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              if (metric === 'top10') setShowTop10(false);
              if (metric === 'mortality_comparison') setShowMortalityComparison(false);
            }}
          />
        )}

        {/* Top10 Modal */}
        {metric === 'top10' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/95 p-8 rounded-xl shadow-2xl z-20 border border-blue-900/30">
            <h3 className="text-2xl font-semibold mb-6 text-white text-center">
              Top 10 Countries by PM2.5 Death Rate
            </h3>
            <TopCountries 
              data={[...allData.death_by_pm.entries()]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([name, death_by_pm]) => ({ name, death_by_pm }))
              }
            />
          </div>
        )}

        {/* Mortality Comparison Modal */}
        {metric === 'mortality_comparison' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/95 p-8 rounded-xl shadow-2xl z-20 border border-blue-900/30">
            <h3 className="text-2xl font-semibold mb-6 text-white text-center">
              Mortality Rates & PM2.5 Levels by Range ({selectedYear})
              </h3>
           
            <MortalityComparison 
              data={allData}
              selectedYear={selectedYear}
            />
          </div>
        )}

        {/* Tooltip (keep existing code) */}
        {tooltip.show && (
        <div className="fixed z-50 bg-slate-900/95 text-white px-8 py-6 rounded-xl shadow-2xl border border-blue-900/50 transition-all duration-300"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(10px, -50%)',
            pointerEvents: 'none',
          }}>
          <h3 className="text-lg font-semibold mb-3 text-blue-400">
            {tooltip.content.name}
          </h3>
          <div className="space-y-2">
            <p className="text-sm flex items-center space-x-3">
              <span className="text-gray-400 font-medium">Population:</span>
              <span className="text-white">{tooltip.content.population}</span>
            </p>
            <p className="text-sm flex items-center space-x-3">
              <span className="text-red-400 font-medium">PM2.5:</span>
              <span className="text-white">{tooltip.content.pm25}</span>
            </p>
            <p className="text-sm flex items-center space-x-3">
              <span className="text-blue-400 font-medium">Death Rate:</span>
              <span className="text-white">{tooltip.content.death_by_pm}</span>
            </p>
            <p className="text-sm flex items-center space-x-3">
              <span className="text-green-400 font-medium">Median Age:</span>
              <span className="text-white">{tooltip.content.median_age}</span>
            </p>
            <p className="text-sm flex items-center space-x-3">
              <span className="text-gray-400 font-medium">Vulnerability:</span>
              <span className={tooltip.content.vulnerability.color}>
                {tooltip.content.vulnerability.level} Risk
              </span>
            </p>
            <Radar
              pm25_radar={tooltip.content.pm25_raw}
              population_radar={tooltip.content.population_raw}
              death_by_pm_radar={tooltip.content.death_by_pm_raw}
              median_age_radar={tooltip.content.median_age_raw}
              max_pm25_radar={max_pm25}
              max_population_radar={max_population}
              max_death_by_pm_radar={max_death_by_pm}
              max_median_age_radar={Math.max(...allData.median_age.values())}
            />
          </div>
        </div>
      )}
      </div>

      {/* Graph Modal */}
      <GraphModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        countryData={selectedCountryData}
        selectedMetric={metric}
      />
    </section>
  );
}