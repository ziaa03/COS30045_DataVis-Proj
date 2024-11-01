import React from 'react';
import '../app/globals.css'; // Make sure to include global styles

export default function Landing() {
    return (
        <div className='w-full h-dvh scroll-section relative' id='home'>
            {/* Video Background */}
            <div className='landing-container absolute w-full h-full'>
                <video 
                    className="w-full h-full object-cover" 
                    autoPlay 
                    muted 
                    loop
                >
                    {/* change the background to video instead of 3d rendering due to performance */}
                    <source src='/videos/world.mp4' type='video/mp4' />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Content */}
            <div className='w-full h-screen flex items-center justify-center flex-col absolute z-10'>
                <h1 className='title text-5xl text-white'>Mapping PM2.5</h1>

                <br />
                <h4 className='text-white text-xl'>A Visual Journey Through Global Air Pollution</h4>
                <br/>
                <a href='#introduction'>
                    <img 
                        src='/images/icons/down_white.png' 
                        alt='arrow down' 
                        className="transition-transform transform duration-300 ease-in-out hover:translate-y-2"
                    />
                </a>
            </div>
        </div>
    );
}