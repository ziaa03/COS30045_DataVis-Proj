"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import '../app/globals.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleNavbar = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <nav className="navbar bg-transparent fixed top-0 w-full z-20">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/about" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-1xl font-semibold whitespace-nowrap text-white hover:text-blue-500 transition-colors duration-300">
              Travis Tan | Zia Tan
            </span>
          </Link>
          <button
            onClick={toggleNavbar}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white/70 rounded-lg md:hidden hover:bg-white/10 focus:outline-none dark:text-white transition-all duration-300"
            aria-controls="navbar-default"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row space-y-1 md:space-x-2 md:space-y-0 rtl:space-x-reverse md:mt-0 bg-transparent">
              {[
                { href: "/#home", text: "Home" },
                { href: "/#introduction", text: "Introduction" },
                { href: "/#objectives", text: "Aim & Objectives" },
                { href: "/#visual", text: "Data Visual" },
              ].map((item, index) => (
                <li key={index} className="relative group">
                  {/* Glow effect container */}
                  <div className="absolute inset-0 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300" />
                  
                  {/* Button container - removed border */}
                  <div className="relative">
                    <Link 
                      href={item.href} 
                      className="text-md block py-2 px-4 text-white opacity-70 hover:opacity-100 hover:bg-white/10 rounded-lg transition-all duration-300"
                    >
                      {item.text}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    );
}