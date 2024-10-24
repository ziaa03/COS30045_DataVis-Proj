"use client"; // This makes the component a Client Component

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import '../app/globals.css'; // Make sure to include global styles

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleNavbar = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <nav className="navbar bg-white border-gray-200 dark:bg-transparent fixed top-0 w-full z-20">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/about"className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-1xl font-semibold whitespace-nowrap dark:text-white hover:text-blue-500">
              Travis Tan | Zia Tan
            </span>
          </Link>
          <button
            onClick={toggleNavbar}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-transparent md:flex-row space-y-1 md:space-x-2 md:space-y-0 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-transparent md:dark:bg-transparent dark:border-gray-700">
              <li className='mx-0 bg-gray-100 py-2 px-3 rounded-xl'>
                <Link href="/#home" className="text-sm block py-2 px-3 text-gray-950 rounded md:bg-transparent md:p-0 hover:text-blue-700" aria-current="page">Home
                </Link>
              </li>
              <li className='mx-0 bg-gray-100 py-2 px-3 rounded-xl'>
                <Link href="/#introduction" className="text-sm block py-2 px-3 text-gray-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Introduction
                </Link>
              </li>
              <li className='mx-0 bg-gray-100 py-2 px-3 rounded-xl'>
                <Link href="/#objectives" className="text-sm block py-2 px-3 text-gray-950 rounded hover:bg-gray-100 md:hover:bg-ransparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Aim & Objectives
                </Link>
              </li>
              <li className='mx-0 bg-gray-100 py-2 px-3 rounded-xl'>
                <Link href="/#visual" className="text-sm block py-2 px-3 text-gray-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Data Visual
                </Link>
              </li>
              <li className='mx-0 bg-gray-100 py-2 px-3 rounded-xl'>
                <Link href="/#sources" className="text-sm block py-2 px-3 text-gray-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Sources
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
