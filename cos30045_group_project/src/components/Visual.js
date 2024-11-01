// TO DO: set dimensions, create SVG, create projection, create path generator, create zoom behavior, apply zoom to SVG, create group for map elements, load world map data, render map

'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function Visual() {
  const svgRef = useRef(null);

  // useEffect for hash-based scrolling
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
    // clear existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // dimensions
    const width = 1200;
    const height = 600;

    // SVG creation
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('class', 'bg-white');

    // map projection - mercator
    const projection = d3.geoMercator()
      .scale(150)
      .center([0, 0])
      .translate([width / 2, height / 2]);

    // convert data into svg paths 
    const path = d3.geoPath().projection(projection);

    // zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    // apply zoom to SVG
    svg.call(zoom);

    // group all elements - countries 
    const g = svg.append('g');

    // bind map data to to path elements 
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then(data => {
      g.selectAll('path')
        .data(data.features)
        .join('path')
        .attr('d', path)
        .attr('class', 'fill-gray-200 hover:fill-blue-300 stroke-gray-400 cursor-pointer transition-colors duration-200')
        .on('mouseover', (event, d) => {
          console.log('Country hovered:', d.properties.name);
        });
    });
  }, []);

  // render map 
  return (
    <section 
      className="relative w-full min-h-dvh bg-gradient-to-b from-gray-900 to-gray-800 py-20 px-4 md:px-8 scroll-section" 
      id="visual"
    >
      <h2 className="text-center mb-8 pt-[80px] md:text-5xl font-extrabold leading-tight tracking-tight">
        Map Projection
      </h2>
      <div className="relative w-full h-[600px] flex justify-center items-center">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </section>
  );
}