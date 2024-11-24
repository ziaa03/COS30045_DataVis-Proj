'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import GraphModal from './GraphModal';
import Radar from './Radar';

export default function Visual() {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });
  const [metric, setMetric] = useState('pm25');
  const [allData, setAllData] = useState({
    population: new Map(),
    pm25: new Map(),
    cardiovascular: new Map(),
    respiratory: new Map()
  });
  const [yearData, setYearData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [worldData, setWorldData] = useState(null);

  // states for graph modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountryData, setSelectedCountryData] = useState(null);

  let max_population = Math.max(...allData.population.values());
  let max_pm25 = Math.max(...allData.pm25.values());
  let max_cardiovascular = Math.max(...allData.cardiovascular.values());
  let max_respiratory = Math.max(...allData.respiratory.values());

  useEffect(() => {
    // load TopoJSON data
    fetch('/json_files/countries-110m.json')
      .then(response => response.json())
      .then(data => setWorldData(data));

    // load all csv data then processsed to create a structured data map
    Promise.all([
      d3.csv('/datasets/population.csv'),
      d3.csv('/datasets/oecd_pm25_exposure.csv'),
      d3.csv('/datasets/cardiovascular_death_rate.csv'),
      d3.csv('/datasets/respiratory_death_rate.csv')
    ]).then(([populationData, pm25Data, cardioData, respData]) => {
      // convert raw csv data into structured maps keyed by year and country 
      // and extract the list of available years for the data
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

      const populationYearData = processDataWithYears(populationData, 'Country');
      const pm25YearData = processDataWithYears(pm25Data, 'Country');
      const cardioYearData = processDataWithYears(cardioData, 'Country');
      const respYearData = processDataWithYears(respData, 'Country');

      // finds the intersection of available years across all datasets 
      const commonYears = pm25YearData.years.filter(year => 
        populationYearData.years.includes(year) &&
        cardioYearData.years.includes(year) &&
        respYearData.years.includes(year)
      );

      setAvailableYears(commonYears);
      setSelectedYear(commonYears[commonYears.length - 1]);

      setYearData({
        population: populationYearData.yearMap,
        pm25: pm25YearData.yearMap,
        cardiovascular: cardioYearData.yearMap,
        respiratory: respYearData.yearMap
      });
    });
  }, []);

  // updates data on year change (selected)
  useEffect(() => {
    if (!selectedYear || !yearData.pm25) return;
    
    const currentData = {
      population: yearData.population.get(selectedYear),
      pm25: yearData.pm25.get(selectedYear),
      cardiovascular: yearData.cardiovascular.get(selectedYear),
      respiratory: yearData.respiratory.get(selectedYear)
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
  .attr('stroke-width', '0.5')
  .on('mouseover', handleMouseOver)
  .on('mouseout', handleMouseOut)
  .on('click', (event, d) => {
    const countryName = d.properties.name;
    if (countryName && allData[metric].has(countryName)) {
      setSelectedCountryData({
        name: countryName,
        population: allData.population.get(countryName),
        pm25: allData.pm25.get(countryName),
        cardiovascular: allData.cardiovascular.get(countryName),
        respiratory: allData.respiratory.get(countryName)
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
      case 'respiratory':
        return d3.interpolateBlues;
      case 'cardiovascular':
        return d3.interpolateGreens;
      default:
        return d3.interpolateReds;
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'pm25':
        return 'PM2.5 Exposure';
      case 'respiratory':
        return 'Respiratory Deaths';
      case 'cardiovascular':
        return 'Cardiovascular Deaths';
      default:
        return '';
    }
  };

  const getMetricUnit = () => {
    switch (metric) {
      case 'pm25':
        return ' µg/m³';
      case 'respiratory':
      case 'cardiovascular':
        return ' per 100k';
      default:
        return '';
    }
  };

  const drawLegend = (svg, colorScale, maxValue, width, height) => {
    // Increased dimensions and adjusted positioning
    const legendWidth = 400;  // Made wider
    const legendHeight = 25;   // Made taller
    const legendPosition = { 
      x: 50, 
      y: height - 120  // Moved up slightly
    };

    const legendScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, legendWidth]);

    // More ticks for finer granularity
    const legendAxis = d3.axisBottom(legendScale)
      .ticks(8)  // Increased number of ticks
      .tickFormat(d => {
        // Format numbers with appropriate units
        if (d >= 1000) {
          return d3.format('.1f')(d/1000) + 'k';
        }
        return d3.format('.1f')(d);
      });

    const legendContainer = svg.append('g')
      .attr('transform', `translate(${legendPosition.x}, ${legendPosition.y})`);

    // Enhanced background with gradient
    legendContainer.append('rect')
      .attr('x', -15)
      .attr('y', -30)
      .attr('width', legendWidth + 30)
      .attr('height', legendHeight + 60)
      .attr('fill', 'rgba(0, 0, 0, 0.7)')  // Darker background
      .attr('rx', 8)  // Rounded corners
      .attr('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))');  // Shadow effect

    // Enhanced title with subtitle
    legendContainer.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')  // Made bold
      .text(`${getMetricLabel()}`);

    // Add subtitle with units
    legendContainer.append('text')
      .attr('x', legendWidth)
      .attr('y', -10)
      .attr('text-anchor', 'end')
      .attr('fill', 'rgba(255, 255, 255, 0.7)')  // Slightly transparent
      .attr('font-size', '12px')
      .text(`(${getMetricUnit().trim()})`);

    // Enhanced gradient
    const defs = svg.append('defs');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', '0%')
      .attr('x2', '100%');

    // More gradient stops for smoother transition
    const legendStops = Array.from({ length: 20 }, (_, i) => i / 19);
    linearGradient.selectAll('stop')
      .data(legendStops)
      .join('stop')
      .attr('offset', d => `${d * 100}%`)
      .attr('stop-color', d => colorScale(d * maxValue))
      .attr('stop-opacity', 0.9);  // Slight transparency

    // Main legend rectangle with border
    legendContainer.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)')
      .style('stroke', 'rgba(255, 255, 255, 0.2)')  // Subtle border
      .style('stroke-width', 1)
      .attr('rx', 4);  // Rounded corners

    // Enhanced axis
    const axis = legendContainer.append('g')
      .attr('transform', `translate(0, ${legendHeight})`)
      .call(legendAxis);

    // Style axis text
    axis.selectAll('text')
      .style('fill', 'white')
      .style('font-size', '12px')
      .style('font-weight', '500');

    // Style axis lines
    axis.selectAll('line')
      .style('stroke', 'rgba(255, 255, 255, 0.4)');
    
    axis.selectAll('path')
      .style('stroke', 'rgba(255, 255, 255, 0.4)');
};

  const handleMouseOver = (event, d) => {
    d3.select(event.currentTarget)
      .attr('stroke-width', '1');
    
    const bounds = event.currentTarget.getBoundingClientRect();
    const countryName = d.properties.name;
    
    setTooltip({
      show: true,
      content: {
        name: countryName,
        population: allData.population.get(countryName)?.toLocaleString() || 'No data',
        pm25: allData.pm25.get(countryName)?.toFixed(1) + ' µg/m³' || 'No data',
        cardiovascular: allData.cardiovascular.get(countryName)?.toFixed(1) + ' per 100k' || 'No data',
        respiratory: allData.respiratory.get(countryName)?.toFixed(1) + ' per 100k' || 'No data',
        population_raw: allData.population.get(countryName) || 0,
        pm25_raw: allData.pm25.get(countryName)?.toFixed(1) || 0,
        cardiovascular_raw: allData.cardiovascular.get(countryName)?.toFixed(1) || 0,
        respiratory_raw: allData.respiratory.get(countryName)?.toFixed(1) || 0
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
    <section
      className="relative w-full h-[calc(100vh)] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-row items-start scroll-section"
      id="visual"
    >
      {/* Controls Panel */}
      <div className="w-72 h-full bg-gray-900/80 backdrop-blur-md p-6 flex flex-col space-y-8 border-r border-gray-700/50 pt-24 shadow-xl">
        <div className="flex flex-col space-y-6">
          {/* Title */}
          <h2 className="text-white text-xl font-semibold tracking-wide">
            Global PM2.5 Analysis
          </h2>
  
          {/* Metric Selector */}
          <div className="flex flex-col space-y-3">
            <label className="text-gray-300 text-sm font-medium">
              Select Metric
            </label>
            <div className="relative">
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-2.5 appearance-none border border-gray-600/50 hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-lg"
              >
                <option value="pm25">PM2.5 Exposure</option>
                <option value="respiratory">Respiratory Deaths</option>
                <option value="cardiovascular">Cardiovascular Deaths</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
  
          {/* Year Selector */}
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-gray-300 text-sm font-medium">
                Select Year
              </label>
              <span className="text-blue-400 text-sm font-semibold">
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
                className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{availableYears[0]}</span>
              <span>{availableYears[availableYears.length - 1]}</span>
            </div>
          </div>
  
          {/* Legend Info */}
          <div className="flex flex-col space-y-2 mt-6 p-4 bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-lg">
            <h3 className="text-gray-300 text-sm font-medium">Current Metric</h3>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full shadow-inner"
                style={{
                  backgroundColor: metric === 'pm25' ? '#ef4444' :
                    metric === 'respiratory' ? '#3b82f6' : '#22c55e',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }}
              />
              <span className="text-white text-sm">
                {getMetricLabel()}
              </span>
            </div>
            <span className="text-gray-400 text-xs">
              Unit: {getMetricUnit()}
            </span>
          </div>
        </div>
  
        {/* Credits */}
        <div className="mt-auto text-xs text-gray-400/80 bg-gray-800/30 p-3 rounded-lg border border-gray-700/30">
          <p>Data source: OECD Statistics</p>
        </div>
      </div>
  
      {/* Map Container */}
      <div className="relative flex-1 h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <svg ref={svgRef} className="w-full h-full" />
        {tooltip.show && (
          <div
            className="fixed z-50 bg-gray-900/95 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-2xl border border-gray-700/50"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: 'translate(10px, -50%)',
              pointerEvents: 'none',
            }}
          >
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
                <span className="text-green-400 font-medium">Cardiovascular:</span>
                <span className="text-white">{tooltip.content.cardiovascular}</span>
              </p>
              <p className="text-sm flex items-center space-x-3">
                <span className="text-blue-400 font-medium">Respiratory:</span>
                <span className="text-white">{tooltip.content.respiratory}</span>
              </p>
              <Radar
                pm25_radar={tooltip.content.pm25_raw}
                population_radar={tooltip.content.population_raw}
                respiratory_radar={tooltip.content.respiratory_raw}
                cardiovascular_radar={tooltip.content.cardiovascular_raw}
                max_pm25_radar={max_pm25}
                max_population_radar={max_population}
                max_respiratory_radar={max_respiratory}
                max_cardiovascular_radar={max_cardiovascular}
              />
            </div>
          </div>
        )}
      </div>
      {/* Add the GraphModal here, right before the closing section tag */}
      <GraphModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        countryData={selectedCountryData}
        selectedMetric={metric}
      />
    </section>
  );
}