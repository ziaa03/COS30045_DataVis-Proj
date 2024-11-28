import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

const MortalityComparison = ({ data, selectedYear }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    // Clear previous content with fade out
    d3.select(svgRef.current).selectAll("*")
      .transition()
      .duration(300)
      .style("opacity", 0)
      .remove();

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

    // Set up dimensions
    const margin = { top: 60, right: 80, left: 100, bottom: 80 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add gradients
    const barGradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    barGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#ef4444");

    barGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#f87171");

    const lineGradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    lineGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3b82f6");

    lineGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#60a5fa");

    // Create scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(groupedData.map(d => d.range))
      .padding(0.3);

    const y1 = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(groupedData, d => d.avgDeathRate) * 1.1])
      .nice();

    const y2 = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(groupedData, d => d.avgPM25) * 1.1])
      .nice();

    // Add grid lines with animation
    const grid = svg.append('g')
      .attr('class', 'grid')
      .style('opacity', 0);

    grid.selectAll("line.grid")
      .data(y1.ticks(5))
      .join("line")
      .attr("class", "grid")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", d => y1(d))
      .attr("y2", d => y1(d))
      .attr("stroke", "rgba(148, 163, 184, 0.1)")
      .attr("stroke-width", 1);

    grid.transition()
      .duration(1000)
      .style('opacity', 1);

    // Enhanced axes with animations
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .style('color', 'rgb(148, 163, 184)')
      .call(d3.axisBottom(x));

    xAxis.selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')
      .style('font-size', '12px')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .style('opacity', 1);

    const yAxisLeft = svg.append('g')
      .style('color', 'rgb(148, 163, 184)')
      .call(d3.axisLeft(y1));

    yAxisLeft.selectAll('text')
      .style('font-size', '12px')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1);

    const yAxisRight = svg.append('g')
      .attr('transform', `translate(${width},0)`)
      .style('color', 'rgb(148, 163, 184)')
      .call(d3.axisRight(y2));

    yAxisRight.selectAll('text')
      .style('font-size', '12px')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1);

    // Enhanced tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('z-index', '1000')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(15, 23, 42, 0.95)')
      .style('border', '1px solid rgba(59, 130, 246, 0.3)')
      .style('border-radius', '8px')
      .style('padding', '16px')
      .style('color', '#fff')
      .style('pointer-events', 'none')
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1)')
      .style('backdrop-filter', 'blur(8px)')
      .style('transform', 'scale(0.95)')
      .style('transition', 'all 0.2s ease-out');

    // Add bars with enhanced animation
    const bars = svg.selectAll('.death-rate-bar')
      .data(groupedData)
      .enter()
      .append('rect')
      .attr('class', 'death-rate-bar')
      .attr('x', d => x(d.range))
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', 'url(#bar-gradient)')
      .attr('rx', 4)
      .style('opacity', 0.9);

    bars.transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr('y', d => y1(d.avgDeathRate))
      .attr('height', d => height - y1(d.avgDeathRate))
      .ease(d3.easeBounceOut);

    // Add PM2.5 line with enhanced animation
    const line = d3.line()
      .x(d => x(d.range) + x.bandwidth() / 2)
      .y(d => y2(d.avgPM25))
      .curve(d3.curveMonotoneX);

    const path = svg.append("path")
      .datum(groupedData)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradient)")
      .attr("stroke-width", 3)
      .attr("d", line)
      .style("opacity", 0);

    const pathLength = path.node().getTotalLength();

    path.attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .style("opacity", 1)
      .transition()
      .duration(2000)
      .delay(1000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Add circles with pop animation
    const circles = svg.selectAll('.pm25-circle')
      .data(groupedData)
      .enter()
      .append('circle')
      .attr('class', 'pm25-circle')
      .attr('cx', d => x(d.range) + x.bandwidth() / 2)
      .attr('cy', d => y2(d.avgPM25))
      .attr('r', 0)
      .attr('fill', '#60a5fa')
      .style('cursor', 'pointer');

    circles.transition()
      .duration(400)
      .delay((d, i) => 3000 + i * 100)
      .attr('r', 6)
      .transition()
      .duration(200)
      .attr('r', 5);

    // Enhanced hover interactions
    const handleMouseOver = function(event, d) {
      const element = d3.select(this);
      
      element.transition()
        .duration(200)
        .style('opacity', 1)
        .attr('filter', 'brightness(1.2)');

      if (element.classed('death-rate-bar')) {
        element
          .attr('y', y1(d.avgDeathRate) - 2)
          .attr('height', height - y1(d.avgDeathRate) + 2);
      } else {
        element.attr('r', 7);
      }

      tooltip
        .style('visibility', 'visible')
        .style('transform', 'scale(1)')
        .html(`
          <div class="space-y-4">
            <div class="text-lg font-semibold text-blue-400 border-b border-blue-900/30 pb-2">
              PM2.5 Range: ${d.range} µg/m³
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-red-400 font-medium mb-2">Death Rate</div>
                <div class="space-y-1 text-sm">
                  <div>
                    <span class="text-gray-400">Average: </span>
                    <span class="text-white font-medium">${d.avgDeathRate.toFixed(4)}%</span>
                  </div>
                </div>
              </div>
              <div>
                <div class="text-blue-400 font-medium mb-2">PM2.5 Stats</div>
                <div class="space-y-1 text-sm">
                  <div>
                    <span class="text-gray-400">Average: </span>
                    <span class="text-white font-medium">${d.avgPM25.toFixed(1)} µg/m³</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Countries: </span>
                    <span class="text-white font-medium">${d.count}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-2 pt-3 border-t border-blue-900/30">
              <div class="text-gray-400 text-xs mb-2">Top 5 Countries:</div>
              <div class="grid grid-cols-2 gap-2">
                ${d.countries.map((c, i) => `
                  <div class="text-sm flex items-center space-x-2">
                    <span class="text-gray-400">${i + 1}.</span>
                    <span class="text-white font-medium">${c.country}:</span>
                    <span class="text-gray-400">${c.deathRate.toFixed(4)}%</span>
                  </div>
                `).join('')}
              </div>
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
      const element = d3.select(this);
      
      element.transition()
        .duration(200)
        .style('opacity', 0.9)
        .attr('filter', null);

      if (element.classed('death-rate-bar')) {
        element
          .attr('y', d => y1(d.avgDeathRate))
          .attr('height', d => height - y1(d.avgDeathRate));
      } else {
        element.attr('r', 5);
      }

      tooltip
        .style('visibility', 'hidden')
        .style('transform', 'scale(0.95)');
    };

    bars
      .on('mouseover', handleMouseOver)
      .on('mousemove', handleMouseMove)
      .on('mouseout', handleMouseOut);

    circles
      .on('mouseover', handleMouseOver)
      .on('mousemove', handleMouseMove)
      .on('mouseout', handleMouseOut);

    // Add legend with animation
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${width / 2 - 100}, -40)`)
      .style('opacity', 0);

    const deathRateLegend = legendGroup.append('g')
      .attr('transform', 'translate(-20, 0)');

    deathRateLegend.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', 'url(#bar-gradient)');

    deathRateLegend.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('fill', '#ef4444')
      .text('Death Rate');

    const pm25Legend = legendGroup.append('g')
      .attr('transform', 'translate(120, 0)');

    pm25Legend.append('circle')
      .attr('cx', 7.5)
      .attr('cy', 7.5)
      .attr('r', 6)
      .attr('fill', '#3b82f6');

    pm25Legend.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('fill', '#3b82f6')
      .text('PM2.5 Level');

    legendGroup.transition()
      .duration(800)
      .delay(3500)
      .style('opacity', 1);

    // Add axes labels with animation
    const axesLabels = svg.append('g')
      .attr('class', 'axes-labels')
      .style('opacity', 0);

    axesLabels.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 10)
      .attr('x', -(height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#ef4444')
      .style('font-size', '14px')
      .text('Death Rate (%)');

    axesLabels.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', width + margin.right - 20)
      .attr('x', -(height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#3b82f6')
      .style('font-size', '14px')
      .text('PM2.5 Level (µg/m³)');

    axesLabels.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgb(148, 163, 184)')
      .style('font-size', '14px')
      .text('PM2.5 Range (µg/m³)');

    axesLabels.transition()
      .duration(1000)
      .delay(2000)
      .style('opacity', 1);

    // Add values above bars with animation
    const valueLabels = svg.selectAll('.value-label')
      .data(groupedData)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', d => x(d.range) + x.bandwidth() / 2)
      .attr('y', d => y1(d.avgDeathRate) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ef4444')
      .attr('font-size', '12px')
      .style('opacity', 0);

    valueLabels.transition()
      .duration(1000)
      .delay((d, i) => 1500 + i * 100)
      .style('opacity', 1)
      .textTween(function(d) {
        const i = d3.interpolate(0, d.avgDeathRate);
        return function(t) {
          return `${i(t).toFixed(2)}%`;
        };
      });

    return () => {
      tooltip.remove();
    };
  }, [data, selectedYear]);

  return (
      <div className="w-full mb-6">
        <p className="text-slate-400 text-sm">
          Analysis of death rates across different PM2.5 concentration ranges, showing average trends and country-specific details
        </p>
      <div className="w-full overflow-x-auto">
        <svg 
          ref={svgRef} 
          className="min-w-[800px] mx-auto"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }}
        ></svg>
      </div>
    </div>
  );
};

export default MortalityComparison;