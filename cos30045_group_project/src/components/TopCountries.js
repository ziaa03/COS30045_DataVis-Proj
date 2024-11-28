import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const TopCountries = ({ data, width = 900, height = 600 }) => {
  const svgRef = useRef();
  const margin = { top: 40, right: 10, bottom: 60, left: 250 };

  useEffect(() => {
    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current);
    
    // Add gradient definition
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3182ce");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#63b3ed");

    // Scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.death_by_pm) * 1.1]) // Add 10% padding
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.3);

    // Add grid lines
    svg.selectAll("line.grid")
      .data(x.ticks(5))
      .join("line")
      .attr("class", "grid")
      .attr("x1", d => x(d))
      .attr("x2", d => x(d))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "rgba(148, 163, 184, 0.1)")
      .attr("stroke-width", 1);

    // Add bars with gradient and animation
    const bars = svg.selectAll("rect.bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", margin.left)
      .attr("y", d => y(d.name))
      .attr("height", y.bandwidth())
      .attr("rx", 4)
      .attr("fill", "url(#bar-gradient)")
      .attr("opacity", 0.9)
      .on("mouseover", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 1)
          .attr("height", y.bandwidth() * 1.1)
          .attr("y", d => y(d.name) - (y.bandwidth() * 0.05));
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 0.9)
          .attr("height", y.bandwidth())
          .attr("y", d => y(d.name));
      });

    // Animate bars
    bars.transition()
      .duration(1000)
      .attr("width", d => x(d.death_by_pm) - margin.left)
      .delay((d, i) => i * 100);

    // Add country labels with rank numbers
    svg.selectAll("text.label")
      .data(data)
      .join("text")
      .attr("class", "label")
      .attr("x", margin.left - 15)
      .attr("y", d => y(d.name) + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", "16px")
      .text((d, i) => `${i + 1}. ${d.name}`);

    // Add value labels with fade-in animation
    const valueLabels = svg.selectAll("text.value")
      .data(data)
      .join("text")
      .attr("class", "value")
      .attr("x", d => x(d.death_by_pm) + 5)
      .attr("y", d => y(d.name) + y.bandwidth() / 2)
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("opacity", 0);

    valueLabels.transition()
      .duration(1000)
      .attr("opacity", 1)
      .delay((d, i) => i * 100)
      .textTween(function(d) {
        const i = d3.interpolate(0, d.death_by_pm);
        return function(t) {
          return `${i(t).toFixed(2)}%`;
        };
      });

    // Add x-axis label
    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "16px")
      .text("Death Rate (% of population)");

  }, [data, width, height]);

  return (
    <div className="relative">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
      />
    </div>
  );
};

export default TopCountries;