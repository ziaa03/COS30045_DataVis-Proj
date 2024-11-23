'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// parent component - graphmodal.js 
// receive props from parent component 
export default function Graph({ selectedCountry }) {
    // const isFirstRender = useRef(true);
    const [selectedDataset, setSelectedDataset] = useState('population');
    // const [selectedCountry, setSelectedCountry] = useState('Australia');
    if (!selectedCountry || !selectedDataset) {
      return <div className="text-white text-center">Missing required data</div>;
  }

    const [dataset, setDataset] = useState(null);
    // const [width, setWidth] = useState(1400);   
    // cant work as there is not browser window available when nextjs first builds the page on the server 

    console.log('Current graph:', { selectedCountry, selectedDataset });
    
    // replace with: 
    // setting initial width state
    const [width, setWidth] = useState(1100);    

    const handleChange = (event) => {
      setSelectedDataset(event.target.value);
    };

    // const handleCountryChange = (event) => {
    //   setSelectedCountry(event.target.value);
    // };

    var padding_x = 100; // padding
    var padding_y = 50;
    // var w = 1100; // width
    var h = 400; // height

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
    // If it's not the first render, do nothing
    // if (!isFirstRender.current) {
    //     return;
    // }

    // isFirstRender.current = false; // Mark the first render as completed

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
        case 'Respiratory Death Rate':
        case 'respiratory':  // Add case for metric from map
          return { 
            data: d3.csv('/datasets/respiratory_death_rate.csv'), 
            color: '#FFA500', 
            title: datasetType, 
            measurement: 'per 100k'
          };
        case 'Cardiovascular Death Rate':
        case 'cardiovascular':  // Add case for metric from map
          return { 
            data: d3.csv('/datasets/cardiovascular_death_rate.csv'), 
            color: '#FFA500', 
            title: datasetType, 
            measurement: 'per 100k'
          };
        default:
          return { 
            data: d3.csv('/datasets/respiratory_death_rate.csv'), 
            color: '#FFA500', 
            title: datasetType, 
            measurement: 'per 100k'
          };
      }
    };

    // Load the CSV file and process the data
    d3.csv('/datasets/oecd_pm25_exposure.csv').then(function(data_oecd) {
      const { data, color, title, measurement } = loadData(selectedDataset);

      data.then((data_sub) => {

        // console.log(data_sub); // process the dataset
        // console.log(color); // use the color

        setDataset({ oecd: data_oecd, sub: data_sub, color: color, title: title, measurement: measurement});

    }).catch((error) => {
      console.error('Error loading data:', error);
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
    const { oecd, sub, color, title } = dataset;

    // Find the row for "Japan"
    const country_oecd = oecd.find(d => d['Country'] === selectedCountry);
    const country_sub = sub.find(d => d['Country'] === selectedCountry);

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

    var path = svg.append("path")
        .datum(values)
        .attr("class", "line")
        .attr("d", area)
        .attr("fill", "rgba(0, 255, 255, 0.2)")
        .attr("stroke", "#00FFFF") 
        .attr("stroke-width", 0.5);

    var path_sub = svg.append("path")
        .datum(values_sub)
        .attr("class", "line")
        .attr("d", line_sub)
        .attr("fill", "none") 
        .attr("stroke", color)
        .attr("stroke-width", 1.5);

    // Get the total length of the path
    var totalLength = path.node().getTotalLength();
    var totalLength2 = path_sub.node().getTotalLength();

    // set the stroke-dasharray and stroke-dashoffset to the total length
    path
        .attr("stroke-dasharray", totalLength) 
        .attr("stroke-dashoffset", totalLength)

    // Animate the line by transitioning stroke-dashoffset to 0
    path.transition()
        .duration(1000)
        .ease(d3.easeLinear) 
        .attr("stroke-dashoffset", 0);
    
    // Animate for another line
    path_sub
      .attr("stroke-dasharray", totalLength2) 
      .attr("stroke-dashoffset", totalLength2)

    path_sub.transition()
        .duration(1000) 
        .ease(d3.easeLinear)  
        .attr("stroke-dashoffset", 0);

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

  return (
    <section 
      className="relative w-full min-h-dvh text-white/70 flex items-center justify-center scroll-section"
      id="visual"
    >
      <div className="relative">
        <h2 className="text-white/70 w-[100%] text-center text-xl">Country: {selectedCountry}</h2>
        <div className="w-full flex items-center absolute translate-y-4">
          <span className="w-[20%] text-white/70 text-xs bg-transparent ml-0 mr-auto"  style={{ textDecorationColor: '#00FFFF' }}>
            PM2.5 Exposure Level (µg/m³)
          </span>
          <select
            className="w-fit text-white/70 text-xs bg-transparent hover:border rounded transition duration-150"
            value={selectedDataset}
            onChange={handleChange}
          >
            <option className="text-black" value="Respiratory Death Rate">
              Respiratory Death Rate (per 100k)
            </option>
            <option className="text-black" value="Cardiovascular Death Rate">
              Cardiovascular Death Rate (per 100k)
            </option>
            <option className="text-black" value="Population">
              Population
            </option>
          </select>
        </div>
        
        <div id="graph"></div>

        <div className='w-full text-center absolute -translate-y-4'><span>Year</span></div>

        <div className="w-full flex items-center justify-center space-x-6 mt-12">
        
          <div className='w-fit flex items-center space-x-2'>
            <svg width="30" height="2" className="">
              <rect width="100%" height="100%" fill="#00FFFF" />
            </svg>
            <span className="text-sm">PM2.5 Exposure Level</span>
          </div>

          <div className='w-fit flex items-center space-x-2'>
            <svg id='sub-legend-line' width="30" height="2" className="">
              <rect  width="100%" height="100%" fill="#00FFFF" />
            </svg>
            <span id='sub-legend-title' className="text-sm"></span>
          </div>
          
        </div>
      </div>
    </section>
  );
}
