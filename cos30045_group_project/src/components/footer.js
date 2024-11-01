import React from 'react'
import '../app/globals.css'; // Make sure to include global styles

export default function Footer() {
  return (
    <div className='footer grid grid-cols-2 fixed bottom-0 z-10 w-full h-16 flex items-center justify-between mx-auto p-4 lg:px-[100px] bg-transparent text-sm'>
        <p className='text-start'>Swinburne Sarawak | COS30045 Data Visualisation</p>
        <p className='text-end'>Last Updated: 24 October 2024</p>
    </div>
  )
}
