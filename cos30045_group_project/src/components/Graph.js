'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function Graph() {
    // const isFirstRender = useRef(true);
    const [selectedDataset, setSelectedDataset] = useState('population');
    const [dataset, setDataset] = useState(null);

    const handleChange = (event) => {
      setSelectedDataset(event.target.value);
    };

    var padding_x = 100; // padding
    var padding_y = 50;
    var w = 1000; // width
    var h = 500; // height

  useEffect(() => {
    // If it's not the first render, do nothing
    // if (!isFirstRender.current) {
    //     return;
    // }

    // isFirstRender.current = false; // Mark the first render as completed

    // Function to load data based on selection
    const loadData = (datasetType) => {
      switch (datasetType) {
        case 'population':
          return d3.csv('/datasets/population.csv');
        case 'respiratory':
          return d3.csv('/datasets/respiratory_death_rate.csv');
        case 'cardiovascular':
          return d3.csv('/datasets/cardiovascular_death_rate.csv');
        default:
          return Promise.reject('Invalid dataset selected');
      }
    };

    // Load the CSV file and process the data
    d3.csv('/datasets/oecd_pm25_exposure.csv').then(function(data_oecd) {
      loadData(selectedDataset).then((data_sub) => {

        setDataset({ oecd: data_oecd, sub: data_sub });

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
    const { oecd, sub } = dataset;

    // Find the row for "Japan"
    const country_oecd = oecd.find(d => d['Reference area'] === 'Australia');
    const country_sub = sub.find(d => d['Country'] === 'Australia');

    if (!country_oecd && !country_sub) {
      console.error("No data found for Japan");
      return;
    }

    // Extract years and corresponding values for Japan
    const years = Object.keys(country_oecd).filter(key => key !== 'Reference area');
    const values = years.map(year => ({
      year: +year, 
      value: +country_oecd[year]
    }));

    const years_sub = Object.keys(country_sub).filter(key => key !== 'Country');
    const values_sub = years_sub.map(year => ({
      sub_year: +year, 
      sub_value: +country_sub[year]
    }));

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

    var line_sub = d3.line()
                .x(function(d) { return xScale(d.sub_year); })
                .y(function(d) { return yScale_right(d.sub_value); });

    // create a svg element in the body tag
    var svg = d3.select("#graph")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var path = svg.append("path")
        .datum(values)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "slategrey") 
        .attr("stroke-width", 0.5);

    var path_sub = svg.append("path")
        .datum(values_sub)
        .attr("class", "line")
        .attr("d", line_sub)
        .attr("fill", "none") 
        .attr("stroke", "red")
        .attr("stroke-width", 0.5);

    // Get the total length of the path
    var totalLength = path.node().getTotalLength();
    var totalLength2 = path_sub.node().getTotalLength();

    // set the stroke-dasharray and stroke-dashoffset to the total length
    path
        .attr("stroke-dasharray", totalLength) 
        .attr("stroke-dashoffset", totalLength)

    // Animate the line by transitioning stroke-dashoffset to 0
    path.transition()
        .duration(2000)
        .ease(d3.easeLinear) 
        .attr("stroke-dashoffset", 0);
    
    // Animate for another line
    path_sub
      .attr("stroke-dasharray", totalLength2) 
      .attr("stroke-dashoffset", totalLength2)

    path_sub.transition()
        .duration(2000) 
        .ease(d3.easeLinear)  
        .attr("stroke-dashoffset", 0);

    // display the x axis in svg element
    svg.append("g")
    .attr("transform", "translate(0, " + (h- padding_y) + ")")
    .call(xAxis);

    // display the y axis in the svg element
    svg.append("g")
        .attr("transform", "translate(" + (padding_x) + ", 0)")
        .call(yAxis);

    svg.append("g")
        .attr("transform", "translate(" + (w - padding_x) + ", 0)")
        .call(yAxis_right);

    // Add points to the line (optional, for better visibility)
    var dots = svg.selectAll(".dot")
      .data(values)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", function(d) { return xScale(d.year); })
      .attr("cy", function(d) { return yScale(d.value); })
      .attr("r", 2.5)
      .attr("fill", "slategrey")
      .attr("opacity", 0);

    // Animate the dots: fade them in after the line animation
    dots.transition()
      .duration(800)
      .delay(function(d, i) { return 800 + i * 50; })  
      .attr("opacity", 1); 

    dots.on("mouseover", function(event, d) {
        // Change the color of the circle
        d3.select(this)
            .transition()
            .duration(600)
            .attr("r", 5)
            .attr("fill", "orange");

        // Get the position of the circle (cx and cy are the center positions)
        var xPosition = xScale(d.year);
        var yPosition = yScale(d.value);

        // Add the tooltip (use multiple text elements instead of <br/>)
        var tooltip = svg.append("g")
            .attr("id", "tooltip")
            .attr("transform", "translate(" + xPosition + "," + yPosition + ")");

        tooltip.append("rect")
          .attr("x", 5)  
          .attr("y", -30)  
          .attr("width", 120)  
          .attr("height", 50)  
          .attr("fill", "rgba(0, 0, 0, 0.7)")
          .attr("rx", 4)  
          .attr("ry", 4) 
          .style("stroke", "white") 
          .style("stroke-width", 1);  

        tooltip.append("text")
            .attr("x", 10)  
            .attr("y", -10) 
            .attr("text-anchor", "start")
            .attr("font-size", "12px")
            .attr("fill", "white")
            .text("Year: " + d.year);

        tooltip.append("text")
            .attr("x", 10)
            .attr("y", 5)  
            .attr("text-anchor", "start")
            .attr("font-size", "12px")
            .attr("fill", "white")
            .text("Value: " + d.value);
    })
    .on("mouseout", function() {
        // Reset circle color back to original and remove the tooltip
        d3.select(this)
            .transition()
            .duration(600)
            .attr("r", 2.5)
            .attr("fill", "slategrey");

        // Remove tooltip
        d3.select("#tooltip").remove();
    });

    var dots2 = svg.selectAll(".dot2")
      .data(values_sub)
      .enter().append("circle")
      .attr("class", "dot2")
      .attr("cx", function(d) { return xScale(d.sub_year); })
      .attr("cy", function(d) { return yScale_right(d.sub_value); })
      .attr("r", 2.5)
      .attr("fill", "red")
      .attr("opacity", 0);

    // Animate the dots: fade them in after the line animation
    dots2.transition()
      .duration(800) 
      .delay(function(d, i) { return 800 + i * 50; })  
      .attr("opacity", 1); 

    dots2.on("mouseover", function(event, d) {
        // Change the color of the circle
        d3.select(this)
            .transition()
            .duration(600)
            .attr("r", 5)
            .attr("fill", "orange");

        // Get the position of the circle (cx and cy are the center positions)
        var xPosition = xScale(d.sub_year);
        var yPosition = yScale_right(d.sub_value);

        // Add the tooltip
        var tooltip = svg.append("g")
            .attr("id", "tooltip")
            .attr("transform", "translate(" + xPosition + "," + yPosition + ")");

        tooltip.append("rect")
          .attr("x", 5) 
          .attr("y", -30) 
          .attr("width", 120)  
          .attr("height", 50) 
          .attr("fill", "rgba(0, 0, 0, 0.7)") 
          .attr("rx", 4)  
          .attr("ry", 4)  
          .style("stroke", "white") 
          .style("stroke-width", 1); 

        tooltip.append("text")
            .attr("x", 10)  
            .attr("y", -10) 
            .attr("text-anchor", "start")
            .attr("font-size", "12px")
            .attr("fill", "white")
            .text("Year: " + d.sub_year);

        tooltip.append("text")
            .attr("x", 10)
            .attr("y", 5) 
            .attr("text-anchor", "start")
            .attr("font-size", "12px")
            .attr("fill", "white")
            .text("Value: " + d.sub_value);
    })
    .on("mouseout", function() {
        // Reset circle color back to original and remove the tooltip
        d3.select(this)
            .transition()
            .duration(600)
            .attr("r", 2.5)
            .attr("fill", "red");

        // Remove tooltip
        d3.select("#tooltip").remove();
    });
  }, [dataset]);

  return (
    <section 
      className="relative w-full min-h-dvh bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center scroll-section"
      id="visual"
    >
      <div className="relative">
        <h2 className="text-white w-[100%] text-center text-xl">Country</h2>
        <div className="w-full flex items-center absolute translate-y-4">
          <span className="w-[20%] text-white text-xs bg-transparent ml-0 mr-auto">
            PM2.5 Exposure Level
          </span>
          <select
            className="w-[20%] text-white text-xs bg-transparent hover:border rounded transition duration-150"
            value={selectedDataset}
            onChange={handleChange}
          >
            <option className="text-black" value="population">
              Population
            </option>
            <option className="text-black" value="respiratory">
              Respiratory Death Rate
            </option>
            <option className="text-black" value="cardiovascular">
              Cardiovascular Death Rate
            </option>
          </select>
        </div>
        
        <div id="graph"></div>
      </div>
    </section>
  );
}
