import React from 'react'
import '../app/globals.css'; // Make sure to include global styles

export default function Landing() {
    return (
        <div className='w-full h-dvh scroll-section' id='home'>
            <div className='landing-container absolute'></div>
            <div className='w-full h-screen flex items-center justify-center flex-col absolute z-1'>
                <h1 className='text-4xl text-white'>Exposure to PM2.5 fine particles</h1>
                <br />
                <h4 className='text-white'>Countries and regions</h4>
                <br/>
                <a href='#introduction'><img src='/images/icons/down_white.png' alt='arrow down' className="transition-transform transform duration-300 ease-in-out hover:translate-y-2"/></a>
            </div>
        </div>
    );
}
