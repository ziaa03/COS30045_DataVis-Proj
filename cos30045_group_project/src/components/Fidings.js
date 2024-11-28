'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Findings() {
  const sliderRef = useRef(null); // Create a ref for the slider

  const sections = [
    {
        title: "Key Findings",
        text: [
            "Countries with higher population has higher outdoor particulate matter pollution mortality rate", 
            "The increase and decrease of PM2.5 exposure levels affect more on countries with higher total population such as India and China.",
            "Developed countries has shown a decrease of PM2.5 exposure level by time, while other countries shown a slight increase or maintained their PM2.5 exposure levels.",
            "Coutries such as Niger defied the expected patterns compared to other coutries because altough Niger has the highest PM2.5 exposure level and smaller total population, it's mortality rate is lower than those countries with lower PM2.5 exposure level and higher total population such as China and India."

        ]
    },
    {
        title: "Data-Driven Insights",
        text: [
            "From 1990 to 2020, developed countries such as United States, France and Germany have shown gradually deacrease of PM2.5 Exposure Levels.", 
        ]
    },
    {
        title: "Conclusion",
        text: [
            "The analysis confirms a strong positive correlation between PM2.5 exposure, total population and death rates. It underscores the effectiveness of air quality regulations in reducing health risks in developed nations, while highlighting the need for targeted interventions in developing regions."
        ]
    },
    {
        title: "Actionable Steps",
        text: [
            "Encourage global collaboration on emission reduction technologies.",
            "Implement stricter air quality policies in regions with rising PM2.5 exposure.",
            "Increase public health funding to mitigate the effects of pollution on vulnerable populations."
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
    <div className='relative w-full h-[calc(100vh)] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-row items-start scroll-section'>
      {/* Slider container */}
      <div
        ref={sliderRef} // Attach the ref here
        className='h-screen w-full overflow-hidden flex flex-nowrap text-center bg-[url("/images/findings-bg1.jpg")] bg-cover bg-center'
        id='slider'
      >
        

        {sections.map((section, index) => {
          return (
            <div
              key={section.title + index} // Combine section title with index for uniqueness
              className='bg-transparent text-white space-y-4 flex-none w-full flex flex-col items-center justify-center backdrop-blur-md'
            >
              {/* Title Section */}
              <motion.h2
                key={`title-${section.title + index}`} // Unique key for the title
                className="text-4xl max-w-md"
                initial={{ opacity: 0, x: -100 }}  // Initial state (hidden and off-screen to the left)
                whileInView={{ opacity: 1, x: 0 }}   // Trigger animation when in view
                exit={{ opacity: 0, x: 100 }}        // State when leaving (fade out and slide to the right)
                transition={{ duration: 1 }}         // Transition duration
              >
                {section.title}
              </motion.h2>

              {/* Text Content Section */}
              {section.text && Array.isArray(section.text) ? (
                section.text.map((textItem, idx) => (
                  <motion.li
                    key={`text-${section.title + idx}`} // Unique key for each paragraph
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
                  key={`text-${section.title}`} // Key for empty text
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
