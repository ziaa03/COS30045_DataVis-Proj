'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Findings() {
  const sliderRef = useRef(null);

  const sections = [
    {
        title: "Key Findings",
        text: [
            "The increase and decrease in PM2.5 exposure levels impact countries with larger populations and higher median age, such as India and China, more significantly.",
            "Countries with higher populations and larger median ages have higher outdoor particulate matter pollution mortality rates.", 
            "Western developed countries such as United States, Germany and France have shown a decrease in PM2.5 exposure levels over time, while other countries have exhibited a slight increase or maintained their PM2.5 exposure levels.",
        ]
    },
    {
        title: "Data-Driven Insights",
        text: [
            "In India, PM2.5 exposure levels increased drastically from 50.10 µg/m³ in 2010 to 79.04 µg/m³ in 2014. During the same period, the outdoor particulate matter pollution mortality rate also rose from 0.036% to 0.061%.",
            "Countries with PM2.5 exposure levels below 6.3 µg/m³, such as Sweden, Norway, and Finland, have outdoor particulate matter pollution mortality rates below 0.001%." ,
            "In 2020, Niger had a low mortality rate of 0.0187% despite having the highest PM2.5 exposure level (85.1 µg/m³) and a smaller total population (24,333,639). This may be attributed to its relatively low median age of 14.8 years."
        ]
    },
    {
        title: "Conclusion",
        text: [
            "There is a strong correlation between a country’s PM2.5 exposure level, population size, median age, and outdoor particulate matter pollution mortality rate.",
            "Higher exposure levels, larger populations, and older median ages collectively contribute to increased mortality rates, while countries with lower exposure and younger populations tend to have lower mortality rates."
        ]
    },
    {
        title: "Actionable Steps",
        text: [
            "Enforce stricter emissions controls and adopt clean energy in populous, industrial regions.",
            "Increase healthcare access and awareness in countries with older populations and high PM2.5 exposure.",
            "Offer financial and technical aid to help nations reduce PM2.5 while developing sustainably."
        ]
    }
  ]

//   useEffect(() => {
//     const slider = sliderRef.current;

//     // Set up the auto-scrolling logic when the component mounts
//     const moveSlide = () => {
//       const max = slider.scrollWidth - slider.clientWidth;
//       const left = slider.clientWidth;

//       if (max === slider.scrollLeft) {
//         slider.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         slider.scrollBy({ left, behavior: 'smooth' });
//       }

//       setTimeout(moveSlide, 2000); // Repeat the function every 2 seconds
//     };

//     // Start the auto-scrolling after 2 seconds when the component is mounted
//     const timer = setTimeout(moveSlide, 2000);

//     // Cleanup function to clear the timer when the component unmounts
//     return () => clearTimeout(timer);
//   }, []);

  // Function to scroll the slider to the left
  const scrollLeft = () => {
    const slider = sliderRef.current;
    const left = slider.clientWidth;
    slider.scrollBy({ left: -left, behavior: 'smooth' });
  };

  // Function to scroll the slider to the right
  const scrollRight = () => {
    const slider = sliderRef.current;
    const left = slider.clientWidth;
    slider.scrollBy({ left, behavior: 'smooth' });
  };

  return (
    <div className='relative w-full h-[calc(100vh)] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-row items-start scroll-section' id='analysis'>
      {/* Slider container */}
      <div
        ref={sliderRef} 
        className='h-screen w-full overflow-hidden flex flex-nowrap text-center bg-[url("/images/findings-bg1.jpg")] bg-cover bg-center'
        id='slider'
      >
        

        {sections.map((section, index) => {
          return (
            <div
              key={section.title + index}
              className='bg-transparent text-white space-y-4 flex-none w-full flex flex-col items-center justify-center backdrop-blur-md'
            >
              <motion.h2
                key={`title-${section.title + index}`} 
                className="text-4xl max-w-md"
                initial={{ opacity: 0, x: -100 }}  
                whileInView={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}       
                transition={{ duration: 1 }}         
              >
                {section.title}
              </motion.h2>

              {section.text && Array.isArray(section.text) ? (
                section.text.map((textItem, idx) => (
                  <motion.li
                    key={`text-${section.title + idx}`} 
                    className="max-w-md"
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 1 + (idx / 2) }}
                  >
                    {textItem}
                  </motion.li>
                ))
              ) : (
                <motion.li
                  key={`text-${section.title}`}
                  className="max-w-md"
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 1 }}
                >
                  {section.text}
                </motion.li>
              )}
            </div>
          );
        })}

      </div>

      {/* Left and Right Buttons */}
      <button
        onClick={scrollLeft}
        className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-4 rounded-full hover:shadow-xl'
      >
        &#8592; {/* Left Arrow */}
      </button>
      <button
        onClick={scrollRight}
        className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-4 rounded-full hover:shadow-xl'
      >
        &#8594; {/* Right Arrow */}
      </button>
    </div>
  );
}
