"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800 flex flex-col">
      <style>
        {`
        @import url('https://rsms.me/inter/inter.css');
        html { font-family: 'Inter', sans-serif; }
        @supports (font-variation-settings: normal) {
          html { font-family: 'Inter var', sans-serif; }
        }
        `}
      </style>
      
      <header className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white p-6 md:p-8 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <Link href="/" className="flex items-center space-x-4 md:space-x-6" title="Go to homepage">
            <Image 
              src="https://i.ibb.co/XrSYyycN/ngo-logo.png" 
              alt="United Forum Organisation Logo"
              width={120}
              height={120}
              className="h-20 md:h-24 object-contain transition-transform duration-300 transform hover:scale-110"
              onError={(e) => { 
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = "https://placehold.co/120x120/E0E0E0/333333?text=Logo";
              }}
            />
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">United Forum Organisation</h1>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 flex-grow flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 max-w-2xl mx-auto text-center border-t-8 border-green-600">
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-6">
            সফল!
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            সঠিক তথ্য দিয়ে আবেদনের জন্য আপনাকে ধন্যবাদ।
          </p>

          <Link 
            href="/"
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
          >
            হোম
          </Link>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 border-t border-gray-700">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Organization Section */}
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <Link href="/" title="Go to homepage" className="transition-transform duration-300 hover:scale-105">
                <Image
                  src="https://i.ibb.co/XrSYyycN/ngo-logo.png"
                  alt="United Forum Organisation Logo"
                  width={80}
                  height={80}
                  className="h-16 w-16 object-contain"
                  onError={(e) => { 
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = "https://placehold.co/80x80/E0E0E0/333333?text=Logo";
                  }}
                />
              </Link>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                  United Forum Organisation
                </h3>
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-4 text-white border-b border-gray-600 pb-2 inline-block">
                Main Office
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-300 leading-relaxed">
                  Amborkhana, Sylhet Sadar
                </p>
                <p className="text-sm text-gray-300">
                  Sylhet, Bangladesh
                </p>
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-lg mb-4 text-white border-b border-gray-600 pb-2 inline-block">
                Contact
              </h4>
              <div className="space-y-2">
                <a 
                  href="mailto:ufo.org.bd@gmail.com" 
                  className="text-sm text-gray-300 hover:text-blue-400 transition-colors duration-300 inline-flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span>ufo.org.bd@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-10 pt-6">
            <div className="text-center">
              <p className="text-xs text-gray-400 leading-relaxed">
                &copy; {new Date().getFullYear()} United Forum Organisation. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SuccessPage;