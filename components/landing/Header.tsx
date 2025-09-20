"use client";

import React, { useState, useEffect } from "react";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // This function handles the scroll event to show or hide the header.
  const handleScroll = () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      // Scrolling down
      setIsVisible(false);
    } else {
      // Scrolling up
      setIsVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    // Add scroll event listener when the component mounts.
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts.
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-300 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-24"
      }`}
    >
      <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl">
        {/* Subtle white border effect */}
        <div className="absolute inset-0 border-2 border-transparent rounded-2xl bg-clip-border bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-blue-400 tracking-tight">
              LegalSimplifier
            </span>
          </a>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-slate-300 hover:text-white font-medium transition-colors duration-200">
              How it works
            </a>
            <a href="#features" className="text-slate-300 hover:text-white font-medium transition-colors duration-200">
              Features
            </a>
            <a href="#faq" className="text-slate-300 hover:text-white font-medium transition-colors duration-200">
              FAQ
            </a>
          </nav>
          
          {/* CTA Button */}
          <a href="/upload">
            <button className="hidden md:block bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-6 py-2.5 transition-all duration-200 hover:scale-105 border border-blue-500">
              Upload Document
            </button>
          </a>

          {/* Mobile Menu Button (Optional) */}
          <div className="md:hidden">
             <button className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
}

