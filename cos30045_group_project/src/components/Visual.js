'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function Visual() {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#visual') {
        const element = document.getElementById('visual');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    // Clear existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Dimensions
    const width = 1600;
    const height = 800;

    // Create SVG with better styling
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .style('background', 'rgb(17, 24, 39)'); 

    // Add glow filter
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('height', '300%')
      .attr('width', '300%')
      .attr('x', '-100%')
      .attr('y', '-100%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '2')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // Projection with slight rotation
    const projection = d3.geoMercator()
      .scale(170)
      .center([0, 20])
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Enhanced zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        // Hide tooltip during zoom
        setTooltip({ ...tooltip, show: false });
      });

    svg.call(zoom);

    // Group for map elements
    const g = svg.append('g');

    // Load and render map data
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then(data => {
      g.selectAll('path')
        .data(data.features)
        .join('path')
        .attr('d', path)
        .attr('fill', 'rgb(55, 65, 81)') // Base color
        .attr('stroke', 'rgb(147, 197, 253)') // Glowing blue outline
        .attr('stroke-width', '0.5')
        .style('filter', 'url(#glow)')
        .attr('class', 'transition-all duration-300 ease-in-out')
        .on('mouseover', (event, d) => {
          d3.select(event.currentTarget)
            .attr('fill', 'rgb(59, 130, 246)') // Highlight color
            .attr('stroke-width', '1');

          // Show tooltip
          setTooltip({
            show: true,
            content: d.properties.name,
            x: event.pageX,
            y: event.pageY
          });
        })
        .on('mousemove', (event) => {
          setTooltip(prev => ({
            ...prev,
            x: event.pageX,
            y: event.pageY
          }));
        })
        .on('mouseout', (event) => {
          d3.select(event.currentTarget)
            .attr('fill', 'rgb(55, 65, 81)')
            .attr('stroke-width', '0.5');
          
          setTooltip({ ...tooltip, show: false });
        });
    });
  }, []);

  return (
    <section 
      className="relative w-full min-h-dvh bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center scroll-section"
      id="visual"
    >
      <div className="relative">
        <svg ref={svgRef} className="w-full h-full" />
        {tooltip.show && (
          <div 
            className="absolute pointer-events-none bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg text-white text-sm shadow-xl border border-white/20"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 40,
              transform: 'translate(-50%, -100%)'
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
    </section>
  );
}