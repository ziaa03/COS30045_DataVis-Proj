import React from 'react'
import * as d3 from 'd3';

export default function Radar({ pm25_radar, population_radar, respiratory_radar, cardiovascular_radar, max_pm25_radar, max_population_radar, max_respiratory_radar, max_cardiovascular_radar }) {
    
    // normalize the data to determine the values if max value is 10
    function normalize_data_array(values, max_values) {
        return values.map((value, index) => value / max_values[index] * 10);
    }

    // array of values
    let maxValues = [max_pm25_radar, max_population_radar, max_respiratory_radar, max_cardiovascular_radar];
    let ori_data = [pm25_radar, population_radar, respiratory_radar, cardiovascular_radar];
    let processed_data = normalize_data_array(ori_data, maxValues);

    // console.log(processed_data);
    // console.log(maxValues);
    // console.log(ori_data);

    // passed in value
    let data = {
        "PM2.5 Exposure Level": processed_data[0], 
        "Population": processed_data[1], 
        "Respiratory": processed_data[2], 
        "Cardiovascular": processed_data[3]
    };

    // captions or labels
    let features = ["PM2.5 Exposure Level", "Population", "Respiratory", "Cardiovascular"];

    // svg dimensions
    let width = 300;
    let height = 300;
    let padding = 20;

    // Append SVG
    let svg = d3.select("#radarChart")
        .attr("width", width)
        .attr("height", height);

    let radialScale = d3.scaleLinear()
        .domain([0, 10]) 
        .range([0, (Math.min(width, height) / 2) - padding]);

    let ticks = [2, 4, 6, 8, 10];

    // Draw grid circles with animation
    svg.selectAll("circle")
        .data(ticks)
        .join("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
        .attr("r", d => radialScale(d))
        .attr("stroke-dasharray", d => 2 * Math.PI * radialScale(d))  // Set the dash array to the circumference of the circle
        .attr("stroke-dashoffset", d => 2 * Math.PI * radialScale(d))  // Set the initial offset to hide the circle
        .transition()
        .duration(1000) 
        .attr("stroke-dashoffset", 0); 

    // Draw tick labels
    svg.selectAll(".ticklabel")
        .data(ticks)
        .join("text")
        .attr("class", "ticklabel")
        .attr("fill", "white")
        .attr("stroke-width", 0.5)
        .attr("y", width / 2 - 5)
        .attr("x", d => height / 2 - radialScale(d) + 5)
        .style("text-anchor", "end")
        .text(d => d.toString());

    function angleToCoordinate(angle, value) {
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return { "x": width / 2 + x, "y": height / 2 - y };
    }

    // Prepare feature data with angles and coordinates
    let featureData = features.map((f, i) => {
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        return {
            name: f,
            angle: angle,
            line_coord: angleToCoordinate(angle, 10), 
            label_coord: angleToCoordinate(angle, 10.5)
        };
    });

    // Define an array of colors for each line
    let colors = ["red", "white", "blue", "lime"]; 

    // Draw axis lines
    svg.selectAll("line")
        .data(featureData)
        .join("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", d => d.line_coord.x)
        .attr("y2", d => d.line_coord.y)
        .attr("stroke-width", 2)
        .attr("stroke", (d, i) => colors[i]);

    // // Draw axis labels
    // svg.selectAll(".axislabel")
    //     .data(featureData)
    //     .join("text")
    //     .attr("x", d => d.label_coord.x)
    //     .attr("y", d => d.label_coord.y)
    //     .text(d => d.name);

    // Function to get path coordinates for the radar chart data
    function getPathCoordinates(data_point) {
        let coordinates = [];
        for (let i = 0; i < features.length; i++) {
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            coordinates.push(angleToCoordinate(angle, data_point[features[i]])); 
        }
        return coordinates;
    }

    // Draw the radar chart path
    let radarPath = svg.selectAll("path")
        .data([data])  
        .join("path")
        .datum(d => getPathCoordinates(d))
        .attr("d", d3.line()
            .x(d => d.x)
            .y(d => d.y))
        .attr("stroke-width", 3)
        .attr("stroke", "darkorange")
        .attr("fill", "darkorange")
        .attr("opacity", 0.5)
        .attr("transform", "scale(0)")
        .attr("transform-origin", "center")  
        .transition()
        .duration(1000) 
        .attr("transform", "scale(1)");

    return (
        <div>
            <svg id="radarChart"></svg>
        </div>
    );
}
