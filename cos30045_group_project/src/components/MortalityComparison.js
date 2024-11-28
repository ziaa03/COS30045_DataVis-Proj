import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

const MortalityComparison = ({ data, selectedYear }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const processData = () => {
      const countries = [];
      for (const country of data.pm25.keys()) {
        const pm25Value = data.pm25.get(country);
        const deathRate = data.death_by_pm.get(country);
        
        if (pm25Value && deathRate) {
          const pm25Range = Math.floor(pm25Value / 10) * 10;
          countries.push({
            country,
            pm25: pm25Value,
            deathRate,
            pm25Range
          });
        }
      }

      const grouped = _.groupBy(countries, 'pm25Range');
      
      return Object.entries(grouped).map(([range, countries]) => {
        const sortedCountries = _.orderBy(countries, ['deathRate'], ['desc']);
        return {
          range: `${range}-${Number(range) + 10}`,
          countries: sortedCountries.slice(0, 5),
          avgDeathRate: _.meanBy(countries, 'deathRate'),
          avgPM25: _.meanBy(countries, 'pm25'),
          count: countries.length
        };
      });
    };

    const groupedData = _.orderBy(processData(), ['range'], ['asc']);

    // Set up dimensions with more height
    const margin = { top: 60, right: 120, left: 80, bottom: 80 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(groupedData.map(d => d.range))
      .padding(0.3);

    const y1 = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(groupedData, d => d.avgDeathRate) * 1.2]);

    const y2 = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(groupedData, d => d.avgPM25) * 1.2]);

    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(y1)
        .tickSize(-width)
        .tickFormat(''))
      .style('color', 'rgb(148, 163, 184)');

    // Add the X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style('color', 'rgb(148, 163, 184)')
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')
      .style('font-size', '12px');

    // Add the left Y axis
    svg.append('g')
      .call(d3.axisLeft(y1))
      .style('color', 'rgb(148, 163, 184)')
      .selectAll('text')
      .style('font-size', '12px');

    // Add the right Y axis
    svg.append('g')
      .attr('transform', `translate(${width}, 0)`)
      .call(d3.axisRight(y2))
      .style('color', 'rgb(148, 163, 184)')
      .selectAll('text')
      .style('font-size', '12px');

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('z-index', '1000')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(15, 23, 42, 0.95)')
      .style('border', '1px solid rgba(59, 130, 246, 0.3)')
      .style('border-radius', '8px')
      .style('padding', '12px')
      .style('color', '#fff')
      .style('pointer-events', 'none')
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');

    // Add bars for death rate
    const deathRateBars = svg.selectAll('.death-rate-bar')
      .data(groupedData)
      .enter()
      .append('rect')
      .attr('class', 'death-rate-bar')
      .attr('x', d => x(d.range))
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', 'rgba(239, 68, 68, 0.6)')
      .attr('stroke', 'rgba(239, 68, 68, 0.8)')
      .attr('stroke-width', 1)
      .attr('rx', 4);

    // Add line for PM2.5
    const line = d3.line()
      .x(d => x(d.range) + x.bandwidth() / 2)
      .y(d => y2(d.avgPM25))
      .curve(d3.curveMonotoneX);

    const path = svg.append("path")
      .datum(groupedData)
      .attr("fill", "none")
      .attr("stroke", "rgba(59, 130, 246, 0.8)")
      .attr("stroke-width", 3)
      .attr("d", line);

    const pathLength = path.node().getTotalLength();

    path.attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);

    // Add circles for PM2.5 values
    const circles = svg.selectAll('.pm25-circle')
      .data(groupedData)
      .enter()
      .append('circle')
      .attr('class', 'pm25-circle')
      .attr('cx', d => x(d.range) + x.bandwidth() / 2)
      .attr('cy', d => y2(d.avgPM25))
      .attr('r', 6)
      .attr('fill', 'rgb(59, 130, 246)')
      .attr('opacity', 0)
      .style('cursor', 'pointer');

    // Animate bars and circles
    deathRateBars.transition()
      .duration(1000)
      .attr('y', d => y1(d.avgDeathRate))
      .attr('height', d => height - y1(d.avgDeathRate));

    circles.transition()
      .duration(1000)
      .delay(1000)
      .attr('opacity', 1);

    // Add hover interactions
    const handleMouseOver = function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 0.8);

      tooltip
        .style('visibility', 'visible')
        .html(`
          <div class="font-semibold text-blue-400 mb-2">
            PM2.5 Range: ${d.range} µg/m³
          </div>
          <div class="space-y-2">
            <div class="text-sm">
              <span class="text-red-400">Avg Death Rate: </span>
              <span class="text-white">${d.avgDeathRate.toFixed(4)}%</span>
            </div>
            <div class="text-sm">
              <span class="text-blue-400">Avg PM2.5: </span>
              <span class="text-white">${d.avgPM25.toFixed(1)} µg/m³</span>
            </div>
            <div class="mt-2 pt-2 border-t border-blue-900/30">
              <div class="text-gray-400 text-xs mb-1">Top Countries:</div>
              ${d.countries.map(c => `
                <div class="text-sm">
                  <span class="text-white">${c.country}: </span>
                  <span class="text-gray-400">${c.deathRate.toFixed(4)}%</span>
                </div>
              `).join('')}
            </div>
          </div>
        `);
    };

    const handleMouseMove = (event) => {
      tooltip
        .style('top', `${event.pageY - 10}px`)
        .style('left', `${event.pageX + 10}px`);
    };

    const handleMouseOut = function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 1);
      
      tooltip.style('visibility', 'hidden');
    };

    deathRateBars
      .on('mouseover', handleMouseOver)
      .on('mousemove', handleMouseMove)
      .on('mouseout', handleMouseOut);

    circles
      .on('mouseover', handleMouseOver)
      .on('mousemove', handleMouseMove)
      .on('mouseout', handleMouseOut);

    // Add axes labels
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left)
      .attr('x', -(height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', 'rgb(239, 68, 68)')
      .text('Death Rate (%)');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', width + margin.right / 2)
        .attr('x', -(height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('fill', 'rgb(59, 130, 246)')
        .text('PM2.5 Level (µg/m³)');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgb(148, 163, 184)')
      .text('PM2.5 Range (µg/m³)');

// Add legend
// Estimate legend width
const legendWidth = 200; // Adjusted width for side by side items
const legendX = (width / 2) - (legendWidth / 2);

// Add legend group centered above the chart
const legend = svg.append('g')
  .attr('transform', `translate(${legendX}, -40)`);

// Death Rate Legend Item
const deathRateLegend = legend.append('g')
  .attr('transform', 'translate(-20, 0)');

deathRateLegend.append('rect')
  .attr('x', 0)
  .attr('width', 15)
  .attr('height', 15)
  .attr('fill', 'rgba(239, 68, 68, 0.6)');

deathRateLegend.append('text')
  .attr('x', 20)
  .attr('y', 12)
  .style('fill', 'rgb(239, 68, 68)')
  .text('Death Rate');

// PM2.5 Level Legend Item
const pm25Legend = legend.append('g')
  .attr('transform', 'translate(120, 0)'); // Adjust x-value for spacing

pm25Legend.append('circle')
  .attr('cx', 7.5)
  .attr('cy', 7.5)
  .attr('r', 6)
  .attr('fill', 'rgb(59, 130, 246)');

pm25Legend.append('text')
  .attr('x', 20)
  .attr('y', 12)
  .style('fill', 'rgb(59, 130, 246)')
  .text('PM2.5 Level');

    return () => {
      tooltip.remove();
    };
  }, [data, selectedYear]);

  return (
    <div className="w-full p-6">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default MortalityComparison;