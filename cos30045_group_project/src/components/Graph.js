'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ChevronDown } from 'lucide-react';
import RadialPopulationChart from './RadialPopulation';

// parent component - graphmodal.js 
// receive props from parent component 
export default function Graph({ selectedCountry }) {
    const [selectedDataset, setSelectedDataset] = useState('pm_death_rate');
    if (!selectedCountry || !selectedDataset) {
      return <div className="text-white text-center">Missing required data</div>;
  }

    const [dataset, setDataset] = useState(null);
    const [width, setWidth] = useState(1200);    

    // dropdown menu 
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Dropdown options
    const options = [
      {
        value: 'pm_death_rate',
        label: 'Outdoor Particulate Matter Pollution Death Rate',
        description: '% of total country population'
      },
      {
          value: 'population',
          label: 'Population',
          description: 'Total population count'
      }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

    const handleChange = (event) => {
      setSelectedDataset(event.target.value);
    };

    var padding_x = 100; // padding
    var padding_y = 50;
    var h = 500; // height

    // code only runs in the browser, after the component mounts 
    useEffect(() => {
      // Update width state on resize
      const handleResize = () => {
          setWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []);

  useEffect(() => {

    // Function to load data based on selection
    const loadData = (datasetType) => {
      switch (datasetType) {
        case 'Population':
        case 'population':  // Add lowercase case
          return { 
            data: d3.csv('/datasets/population.csv'), 
            color: '#FFA500', 
            title: datasetType, 
            measurement: ''
          };
        case 'Particulate Matter Death Rate':
        case 'pm_death_rate':  // Add case for metric from map
          return { 
            data: d3.csv('/datasets/death_by_pm.csv'), 
            color: '#FFA500', 
            title: 'Particulate Matter Death Rate', 
            measurement: '%'
          };
  
        default:
          return { 
            data: d3.csv('/datasets/death_by_pm.csv'), 
            color: '#FFA500', 
            title: datasetType, 
            measurement: '%'
          };
      }
    };

    // Load the CSV file and process the data
    d3.csv('/datasets/oecd_pm25_exposure.csv').then(function(data_oecd) {
        d3.csv('/datasets/population.csv').then(function(data_pop) {
      const { data, color, title, measurement } = loadData(selectedDataset);

      data.then((data_sub) => {

        console.log(data_sub); // process the dataset
        // console.log(color); // use the color

        setDataset({ oecd: data_oecd, sub: data_sub, pop: data_pop, color: color, title: title, measurement: measurement});

    }).catch((error) => {
      console.error('Error loading data:', error);
    });

    }).catch(error => {
        console.error("Error loading CSV data:", error);
    });

    }).catch(error => {
        console.error("Error loading CSV data:", error);
    });

  }, [selectedDataset]);

  useEffect(() => {
    if (!dataset) return; // Don't render the graph if no dataset is loaded

    // Clear the graph before rendering
    d3.select('#graph').selectAll('*').remove();

    // Extracting and processing data for rendering
    const { oecd, sub, pop, color, title } = dataset;

    // Find the row for selected country
    const country_oecd = oecd.find(d => d['Country'] === selectedCountry);
    const country_rate = sub.find(d => d['Country'] === selectedCountry);
    const country_pop = pop.find(d => d['Country'] === selectedCountry);

    // Initialize an empty object to store the combined data
    const country_sub = {
        Country: selectedCountry
    };
  
  // Iterate over each year in country_pop (excluding the "Country" key)
  Object.keys(country_pop).forEach(year => {
    // Skip the "Country" key since it's not a year
    if (year !== "Country") {
      // Add the values for each year (population + sub values)
      country_sub[year] = (country_rate[year] / country_pop[year] * 100).toFixed(3) ;
    }
  });
  
  console.log(country_sub);

    if (!country_oecd && !country_sub) {
      console.error(`No data found for ${selectedCountry}`);
      return;
    }

    // Extract years and corresponding values for Japan
    const years = Object.keys(country_oecd).filter(key => key !== 'Country');
    const values = years.map(year => ({
      year: +year, 
      value: +country_oecd[year]
    }));

    const years_sub = Object.keys(country_sub).filter(key => key !== 'Country');
    const values_sub = years_sub.map(year => ({
      sub_year: +year, 
      sub_value: +country_sub[year]
    }));

    const w = width - padding_x * 2; // Use screen width minus padding

    // setting up x Scale
    var xScale = d3.scaleLinear() // Use scaleTime for time-based data like years
        .domain([
            d3.min(values, function(d) { return d.year; }),
            d3.max(values, function(d) { return d.year; }) 
        ])
        .range([padding_x, w - padding_x]);

    // setting up y Scale
    var yScale = d3.scaleLinear()
                    .domain([
                      0,
                      d3.max(values, function(d) {return d.value; })
                    ])
                    .range([h - padding_y, 10 + padding_y]);

    var yScale_right = d3.scaleLinear()
                    .domain([
                      0,
                      d3.max(values_sub, function(d) {return d.sub_value; })
                    ])
                    .range([h - padding_y, 10 + padding_y]);

    // create x axis
    var xAxis = d3.axisBottom()
        .ticks(15)
        .scale(xScale)
        .tickFormat(d3.format("d"));

    // create the y axis
    var yAxis = d3.axisLeft()
        .ticks(10)
        .scale(yScale);

    var yAxis_right = d3.axisRight()
        .ticks(10)
        .scale(yScale_right);

    // create a point line for each data
    var line = d3.line()
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return yScale(d.value); });

var area = d3.area()
        .x(function(d) { return xScale(d.year); })
        .y0(function() { return yScale.range()[0]; })
        .y1(function(d) { return yScale(d.value); })

var line_sub = d3.line()
            .x(function(d) { return xScale(d.sub_year); })
            .y(function(d) { return yScale_right(d.sub_value); });

// Update the legend styles
d3.select('#sub-legend-line')
                .append('rect')
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", color);

d3.select('#sub-legend-title')
        .selectAll('*').remove();

d3.select('#sub-legend-title')
                .append('text')
                .text(title);

// create a svg element in the body tag
var svg = d3.select("#graph")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

// Add paths with safer animation handling
var path = svg.append("path")
    .datum(values)
    .attr("class", "line")
    .attr("d", area)
    .attr("fill", "rgba(0, 255, 255, 0.2)")
    .attr("stroke", "#00FFFF") 
    .attr("stroke-width", 0.5)
    .style("opacity", 0);  // Start with opacity 0

var path_sub = svg.append("path")
    .datum(values_sub)
    .attr("class", "line")
    .attr("d", line_sub)
    .attr("fill", "none") 
    .attr("stroke", color)
    .attr("stroke-width", 1.5)
    .style("opacity", 0);  // Start with opacity 0

// Safer animation approach
function animatePath(pathElement) {
    if (!pathElement.node()) return;  // Safety check
    
    const totalLength = pathElement.node().getTotalLength();
    
    pathElement
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .style("opacity", 1)  // Make visible
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
}

// Only animate if paths exist
if (path.node()) animatePath(path);
if (path_sub.node()) animatePath(path_sub);

    // display the x axis in svg element
    svg.append("g")
    .attr("transform", "translate(0, " + (h- padding_y) + ")")
    .call(xAxis);

    // display the y axis in the svg element
    svg.append("g")
        .attr("transform", "translate(" + (padding_x) + ", 0)")
        .style("color", "#00FFFF")
        .call(yAxis);

    svg.append("g")
        .attr("transform", "translate(" + (w - padding_x) + ", 0)")
        .style("color", color)
        .call(yAxis_right);

    // Add points to the line (optional, for better visibility)
    var dots = svg.selectAll(".dot")
      .data(values)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", function(d) { return xScale(d.year); })
      .attr("cy", function(d) { return yScale(d.value); })
      .attr("r", 2)
      .style("z-index", 98) 
      .attr("fill", "#00FFFF")
      .attr("opacity", 0);

    // Animate the dots: fade them in after the line animation
    dots.transition()
      .duration(500)
      .delay(function(d, i) { return 500 + i * 20; })  
      .attr("opacity", 1); 

    dots.on("mouseover", function(event, d) {
        // Change the color of the circle
        d3.select(this)
            .transition()
            .duration(600)
            .attr("r", 6)
            .attr("fill", "red");

        // Get the position of the circle (cx and cy are the center positions)
        var xPosition = xScale(d.year);
        var yPosition = yScale(d.value);

        // Add the tooltip (use multiple text elements instead of <br/>)
        var tooltip = svg.append("g")
            .attr("id", "tooltip")
            .attr("transform", "translate(" + xPosition + "," + yPosition + ")");

        tooltip.append("rect")
          .attr("x", -110)  
          .attr("y", -60)  
          .attr("width", 120)  
          .attr("height", 50)  
          .attr("fill", "rgb(0, 0, 0)")
          .attr("rx", 4)  
          .attr("ry", 4) 
          .style("stroke", "white") 
          .style("z-index", 99) 
          .style("stroke-width", 0);  

        tooltip.append("text")
            .attr("x", -100)  
            .attr("y", -38) 
            .attr("text-anchor", "start")
            .attr("font-size", "12px")
            .attr("fill", "white")
            .text("Year: " + d.year);

        tooltip.append("text")
            .attr("x", -100)
            .attr("y", -22)  
            .attr("text-anchor", "start")
            .attr("font-size", "12px")
            .attr("fill", "white")
            .text("Value: " + d.value + " µg/m³");

        // Add dotted line to X axis
        svg.append("line")
          .attr("x1", xPosition)
          .attr("y1", yPosition + 5)
          .attr("x2", xPosition)
          .attr("y2", yPosition + 5) // Y axis position
          .attr("stroke", "grey")
          .attr("z-index", 0)
          .style("stroke-dasharray", "4,4") // Dotted line style
          .attr("stroke-width", 1)
          .transition()
          .duration(500)
          .attr("x2", xPosition)
          .attr("y2", yScale.range()[0]) // Y axis position
          .ease(d3.easeLinear);

        // Add dotted line to Y axis
        svg.append("line")
            .attr("x1", xPosition - 5)
            .attr("y1", yPosition)
            .attr("x2", xPosition - 5) // X axis position
            .attr("y2", yPosition)
            .attr("stroke", "grey")
            .attr("z-index", 0)
            .attr("stroke-dasharray", "4,4") // Dotted line style
            .attr("stroke-width", 1)
            .transition()
            .duration(500)
            .attr("x2", xScale.range()[0])
            .attr("y2", yPosition) // Y axis position
            .ease(d3.easeLinear);
    })
    .on("mouseout", function() {
        // Reset circle color back to original and remove the tooltip
        d3.select(this)
            .transition()
            .duration(600)
            .attr("r", 2.5)
            .attr("fill", "#00FFFF");

        // Remove tooltip
        d3.select("#tooltip").remove();

        // Remove the dotted lines
        svg.selectAll("line").remove();
    });

    var dots2 = svg.selectAll(".dot2")
      .data(values_sub)
      .enter().append("circle")
      .attr("class", "dot2")
      .attr("cx", function(d) { return xScale(d.sub_year); })
      .attr("cy", function(d) { return yScale_right(d.sub_value); })
      .attr("r", 2.5)
      .attr("fill", color)
      .style("z-index", 98) 
      .attr("opacity", 0);

    // Animate the dots: fade them in after the line animation
    dots2.transition()
      .duration(500) 
      .delay(function(d, i) { return 500 + i * 20; })  
      .attr("opacity", 1); 

    dots2.on("mouseover", function(event, d) {
        // Change the color of the circle
        d3.select(this)
            .transition()
            .duration(600)
            .attr("r", 6)
            .attr("fill", "violet");

        // Get the position of the circle (cx and cy are the center positions)
        var xPosition = xScale(d.sub_year);
        var yPosition = yScale_right(d.sub_value);

        // Add the tooltip
        var tooltip = svg.append("g")
            .attr("id", "tooltip")
            .attr("transform", "translate(" + xPosition + "," + yPosition + ")");

          tooltip.append("rect")
            .attr("x", -110)  
            .attr("y", -60)  
            .attr("width", 150)  
            .attr("height", 50)  
            .attr("fill", "rgb(0, 0, 0)")
            .attr("rx", 4)  
            .attr("ry", 4) 
            .style("stroke", "white") 
            .style("z-index", 99) 
            .style("stroke-width", 0);  
  
          tooltip.append("text")
              .attr("x", -100)  
              .attr("y", -38) 
              .attr("text-anchor", "start")
              .attr("font-size", "12px")
              .attr("fill", "white")
              .text("Year: " + d.sub_year);
  
          tooltip.append("text")
              .attr("x", -100)
              .attr("y", -22)  
              .attr("text-anchor", "start")
              .attr("font-size", "12px")
              .attr("fill", "white")
              .text("Value: " + d.sub_value + ` ${dataset.measurement}`);

        // Add dotted line to X axis
        svg.append("line")
          .attr("x1", xPosition)
          .attr("y1", yPosition + 5)
          .attr("x2", xPosition)
          .attr("y2", yPosition + 5) // Y axis position
          .attr("stroke", "grey")
          .style("z-index", 0)
          .attr("stroke-dasharray", "4,4") // Dotted line style
          .attr("stroke-width", 1)
          .transition()
          .duration(500)
          .attr("x2", xPosition)
          .attr("y2", yScale_right.range()[0]) // Y axis position
          .ease(d3.easeLinear);

        // Add dotted line to Y axis
        svg.append("line")
            .attr("x1", xPosition + 5)
            .attr("y1", yPosition)
            .attr("x2", xPosition + 5) // X axis position
            .attr("y2", yPosition)
            .attr("stroke", "grey")
            .style("z-index", 0)
            .attr("stroke-dasharray", "4,4") // Dotted line style
            .attr("stroke-width", 1)
            .transition()
            .duration(500)
            .attr("x2", xScale.range()[1]) // X axis position
            .attr("y2", yPosition)
            .ease(d3.easeLinear);
    })
    .on("mouseout", function() {
        // Reset circle color back to original and remove the tooltip
        d3.select(this)
            .transition()
            .duration(600)
            .attr("r", 2.5)
            .attr("fill", color);

        // Remove tooltip
        d3.select("#tooltip").remove();

        // Remove the dotted lines
        svg.selectAll("line").remove();
    });
  }, [dataset, selectedCountry, width]);

  // In your main Graph component, add this condition in the return statement
  return (
    <section 
        className="relative w-full h-[100%] text-white/70 flex items-center justify-center scroll-section"
        id="visual"
    >
        <div className="relative">
            <div className="w-full flex items-center justify-between mb-6 px-4">
                {/* Left side - Title and PM2.5 label */}
                <div className="flex flex-col">
                    <h2 className="text-xl font-medium text-white mb-2">{selectedCountry}</h2>
                    <span className="text-sm text-white/70">
                        PM2.5 Exposure Level (µg/m³)
                    </span>
                </div>

                {/* Custom Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 
                                 rounded-lg transition-all duration-200 min-w-[240px]
                                 border border-white/10 hover:border-white/20"
                    >
                        <div className="flex-1 text-left">
                            <p className="text-white text-sm">
                                {options.find(opt => opt.value === selectedDataset)?.label || 'Select metric'}
                            </p>
                            <p className="text-white/50 text-xs">
                                {options.find(opt => opt.value === selectedDataset)?.description}
                            </p>
                        </div>
                        <ChevronDown 
                            className={`w-4 h-4 transition-transform duration-200 
                                      ${isDropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-[240px] py-1 bg-black/90 backdrop-blur-lg 
                                      rounded-lg shadow-lg border border-white/10 z-50">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSelectedDataset(option.value);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left transition-colors
                                              hover:bg-white/10 group
                                              ${selectedDataset === option.value ? 'bg-white/5' : ''}`}
                                >
                                    <p className={`text-sm ${selectedDataset === option.value 
                                        ? 'text-white' 
                                        : 'text-white/70 group-hover:text-white'}`}>
                                        {option.label}
                                    </p>
                                    <p className="text-white/50 text-xs">
                                        {option.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedDataset === 'population' ? (
                <RadialPopulationChart 
                    selectedCountry={selectedCountry}
                    dataset={dataset}
                    width={width}
                />
            ) : (
                <>
                    <div id="graph"></div>
                    <div className='w-full text-center absolute -translate-y-4'>
                        <span>Year</span>
                    </div>
                    
                    {/* Legend - Only show for non-population datasets */}
                    <div className="w-full flex items-center justify-center space-x-6 mt-12">
                        <div className="flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-lg">
                            <div className="w-8 h-0.5 bg-[#00FFFF]"></div>
                            <span className="text-sm text-white">PM2.5 Exposure Level</span>
                        </div>

                        <div className="flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-lg">
                            <div className="w-8 h-0.5" style={{ backgroundColor: dataset?.color }}></div>
                            <span className="text-sm text-white">{dataset?.title}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    </section>
);
}
