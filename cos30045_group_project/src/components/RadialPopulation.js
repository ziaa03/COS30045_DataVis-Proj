'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function RadialPopulationChart({ selectedCountry, dataset, width }) {
    const svgRef = useRef(null);
    const padding_x = 100;
    // Make sure SVG takes up most of modal space
    const h = Math.min(window.innerHeight * 0.75, 650);
    
    useEffect(() => {
        if (!dataset) return;

        // Calculate width based on modal dimensions
        const w = Math.min(window.innerWidth * 0.85, 1000);
        // Increase radius for larger visualization
        const radius = Math.min(w, h) / 3;

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .append("g")
            .attr("transform", `translate(${w/2}, ${h/2})`);

        const { oecd, sub } = dataset;
        const country_oecd = oecd.find(d => d['Country'] === selectedCountry);
        const country_sub = sub.find(d => d['Country'] === selectedCountry);

        if (!country_oecd || !country_sub) {
            console.error(`No data found for ${selectedCountry}`);
            return;
        }

        // Process data
        const years = Object.keys(country_oecd).filter(key => key !== 'Country');
        const baseYear = Math.min(...years.map(y => +y));
        const combinedData = years.map(year => ({
            year: +year,
            pm25: +country_oecd[year],
            population: +country_sub[year],
            populationChange: year > years[0] ? 
                ((+country_sub[year] - +country_sub[years[0]]) / +country_sub[years[0]] * 100) : 0,
            pm25Change: year > years[0] ? 
                ((+country_oecd[year] - +country_oecd[years[0]]) / +country_oecd[years[0]] * 100) : 0,
            angle: ((+year - baseYear) / (years.length - 1)) * 2 * Math.PI
        })).filter(d => !isNaN(d.pm25) && !isNaN(d.population));

        

        // Enhanced scales with better domain padding
        const radiusScale = d3.scaleLinear()
            .domain([0, d3.max(combinedData, d => d.pm25) * 1.2])
            .range([0, radius])
            .nice();

        const populationScale = d3.scalePow()
            .exponent(0.5)
            .domain(d3.extent(combinedData, d => d.population))
            .range([6, 24]);

        // Color scales
        const colorScale = d3.scaleSequential()
            .domain(d3.extent(combinedData, d => d.populationChange))
            .interpolator(d3.interpolateRdYlBu);

        // Add defs for filters and gradients
        const defs = svg.append("defs");

        // Glow effect
        const glow = defs.append("filter")
            .attr("id", "glow")
            .attr("x", "-40%")
            .attr("y", "-40%")
            .attr("width", "180%")
            .attr("height", "180%");
        
        glow.append("feGaussianBlur")
            .attr("stdDeviation", "3")
            .attr("result", "coloredBlur");
        
        const feMerge = glow.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "coloredBlur");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        // Area gradient
        const areaGradient = defs.append("radialGradient")
            .attr("id", "area-gradient")
            .attr("gradientUnits", "userSpaceOnUse");

        areaGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "rgba(56,189,248,0.3)");

        areaGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "rgba(56,189,248,0.05)");

        // Grid system
        const gridCircles = d3.range(0.2, 1.2, 0.2);
        gridCircles.forEach(d => {
            // Grid circles
            svg.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", radius * d)
                .attr("fill", "none")
                .attr("stroke", "rgba(148,163,184,0.1)")
                .attr("stroke-dasharray", "4,4");

            // Grid labels
            const label = svg.append("text")
                .attr("x", 5)
                .attr("y", -radius * d)
                .attr("fill", "rgba(226,232,240,0.8)")
                .attr("font-size", "12px")
                .attr("font-weight", "500")
                .text(`${Math.round(d * d3.max(combinedData, d => d.pm25))} µg/m³`);

            // Label background
            const bbox = label.node().getBBox();
            svg.insert("rect", "text")
                .attr("x", bbox.x - 2)
                .attr("y", bbox.y - 1)
                .attr("width", bbox.width + 4)
                .attr("height", bbox.height + 2)
                .attr("fill", "rgba(15,23,42,0.8)")
                .attr("rx", 3);
        });

        // Year labels 
        const yearLabels = svg.selectAll(".year-label")
            .data(combinedData)
            .enter()
            .append("g")
            .attr("class", "year-label")
            .attr("transform", d => {
                const angle = d.angle - Math.PI/2;
                const x = (radius + 30) * Math.cos(angle);
                const y = (radius + 30) * Math.sin(angle);
                return `translate(${x},${y})`;
            });

        yearLabels.append("rect")
            .attr("fill", "rgba(15,23,42,0.9)")
            .attr("rx", 4)
            .attr("x", -18)
            .attr("y", -12)
            .attr("width", 36)
            .attr("height", 24);

        yearLabels.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("fill", "rgba(226,232,240,0.9)")
            .attr("font-size", "12px")
            .attr("font-weight", "500")
            .text(d => d.year);

        // Area visualization
        const area = d3.areaRadial()
            .angle(d => d.angle - Math.PI/2)
            .innerRadius(0)
            .outerRadius(d => radiusScale(d.pm25))
            .curve(d3.curveCatmullRomClosed);

        svg.append("path")
            .datum(combinedData)
            .attr("d", area)
            .attr("fill", "url(#area-gradient)")
            .attr("stroke", "rgba(56,189,248,0.5)")
            .attr("stroke-width", 1.5)
            .style("filter", "url(#glow)")
            .attr("opacity", 0)
            .transition()
            .duration(1500)
            .attr("opacity", 1);

        // Data points
        const points = svg.selectAll(".point")
            .data(combinedData)
            .enter()
            .append("g")
            .attr("class", "point")
            .attr("transform", d => {
                const x = radiusScale(d.pm25) * Math.cos(d.angle - Math.PI/2);
                const y = radiusScale(d.pm25) * Math.sin(d.angle - Math.PI/2);
                return `translate(${x},${y})`;
            });

        points.append("circle")
            .attr("r", d => populationScale(d.population))
            .attr("fill", d => colorScale(d.populationChange))
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .style("filter", "url(#glow)")
            .attr("opacity", 0)
            .attr("cursor", "pointer")
            .transition()
            .delay((d, i) => i * 100)
            .duration(1000)
            .attr("opacity", 0.8);

        // Tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "rgba(15,23,42,0.95)")
            .style("border", "1px solid rgba(56,189,248,0.2)")
            .style("border-radius", "8px")
            .style("padding", "16px")
            .style("color", "#e2e8f0")
            .style("font-size", "14px")
            .style("pointer-events", "none")
            .style("z-index", "1000")
            .style("box-shadow", "0 4px 6px rgba(0,0,0,0.1), 0 0 16px rgba(56,189,248,0.1)");

        points
            .on("mouseover", function(event, d) {
                const point = d3.select(this);
                
                point.select("circle")
                    .transition()
                    .duration(200)
                    .attr("r", populationScale(d.population) * 1.3)
                    .attr("opacity", 1);

                tooltip.html(`
                    <div style="font-weight:600;font-size:16px;margin-bottom:8px;color:#38bdf8">
                        ${d.year}
                    </div>
                    <div style="margin-bottom:4px">
                        <span style="color:#94a3b8">PM2.5:</span> 
                        <span style="font-weight:500">${d.pm25.toFixed(1)} µg/m³</span>
                        <span style="color:#94a3b8;font-size:12px">
                            (${d.pm25Change > 0 ? '+' : ''}${d.pm25Change.toFixed(1)}%)
                        </span>
                    </div>
                    <div style="margin-bottom:4px">
                        <span style="color:#94a3b8">Population:</span>
                        <span style="font-weight:500">${d3.format(",")(d.population)}</span>
                    </div>
                    <div>
                        <span style="color:#94a3b8">Growth:</span>
                        <span style="font-weight:500;color:${colorScale(d.populationChange)}">
                            ${d.populationChange > 0 ? '+' : ''}${d.populationChange.toFixed(1)}%
                        </span>
                    </div>
                `)
                .style("visibility", "visible")
                .style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY - 12) + "px");

                // Guide line
                svg.append("line")
                    .attr("class", "guide")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", radiusScale(d.pm25) * Math.cos(d.angle - Math.PI/2))
                    .attr("y2", radiusScale(d.pm25) * Math.sin(d.angle - Math.PI/2))
                    .attr("stroke", "rgba(226,232,240,0.3)")
                    .attr("stroke-width", 1.5)
                    .attr("stroke-dasharray", "4,4");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .select("circle")
                    .transition()
                    .duration(200)
                    .attr("r", d => populationScale(d.population))
                    .attr("opacity", 0.8);

                tooltip.style("visibility", "hidden");
                svg.selectAll(".guide").remove();
            });

        // Center label
        const centerLabel = svg.append("g")
            .attr("class", "center-label");

        centerLabel.append("circle")
            .attr("r", 45)
            .attr("fill", "rgba(15,23,42,0.9)")
            .attr("stroke", "rgba(56,189,248,0.3)")
            .style("filter", "url(#glow)");

        centerLabel.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("fill", "#e2e8f0")
            .attr("font-size", "16px")
            .attr("font-weight", "600")
            .text(selectedCountry);

        // Modified legend section - positioned on the left side
        const legend = svg.append("g")
            .attr("transform", `translate(${-w/2 + 20}, ${-h/2 + 30})`);  

        // Legend background
        legend.append("rect")
            .attr("width", 180)
            .attr("height", 400)
            .attr("fill", "rgba(15,23,42,0.9)")
            .attr("rx", 8)
            .style("filter", "url(#glow)");

        // Population Growth section
        const populationSection = legend.append("g")
            .attr("transform", `translate(20, 40)`);

        populationSection.append("text")
            .attr("fill", "#94a3b8")
            .attr("font-size", "14px")
            .attr("font-weight", "600")
            .text("Population Growth");

        // Gradient for Population Growth
        const gradientId = "legend-gradient-population";
        const legendGradient = defs.append("linearGradient")
            .attr("id", gradientId)
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "100%")
            .attr("y2", "0%");

        d3.range(0, 1.1, 0.1).forEach(stop => {
            legendGradient.append("stop")
                .attr("offset", `${stop * 100}%`)
                .attr("stop-color", colorScale(d3.extent(combinedData, d => d.populationChange)[0] + 
                    stop * (d3.extent(combinedData, d => d.populationChange)[1] - d3.extent(combinedData, d => d.populationChange)[0])));
        });

        // Population Growth color bar
        populationSection.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 20)
            .attr("height", 150)
            .attr("fill", `url(#${gradientId})`)
            .attr("rx", 2);

        const popScale = d3.scaleLinear()
            .domain(d3.extent(combinedData, d => d.populationChange))
            .range([150, 0]);

        const popAxis = d3.axisRight(popScale)
            .ticks(8)
            .tickFormat(d => `${d > 0 ? '+' : ''}${d.toFixed(1)}%`);

        populationSection.append("g")
            .attr("transform", "translate(20, 20)")
            .call(popAxis)
            .call(g => {
                g.select(".domain").remove();
                g.selectAll(".tick line")
                    .attr("stroke", "#475569")
                    .attr("x2", 6);
                g.selectAll(".tick text")
                    .attr("fill", "#94a3b8")
                    .attr("font-size", "11px")
                    .attr("x", 9);
            });

        // PM2.5 section with increased vertical spacing
        const pm25Section = legend.append("g")
            .attr("transform", `translate(20, 280)`);  // Increased y-position to push entire PM2.5 section down

        pm25Section.append("text")
            .attr("fill", "#94a3b8")
            .attr("font-size", "14px")
            .attr("font-weight", "600")
            .text("PM2.5 Range:");

        pm25Section.append("text")
            .attr("x", 0)
            .attr("y", 30)
            .attr("fill", "#e2e8f0")
            .attr("font-size", "12px")
            .text(`${d3.extent(combinedData, d => d.pm25)[0].toFixed(1)} -`)
            .append("tspan")
            .attr("x", 0)
            .attr("dy", "1.2em")
            .text(`${d3.extent(combinedData, d => d.pm25)[1].toFixed(1)} µg/m³`);

        return () => {
            tooltip.remove();
        };
    }, [dataset, selectedCountry, width]);

    return (
        <div ref={svgRef} className="w-full h-full flex items-center justify-center" />
    );
}