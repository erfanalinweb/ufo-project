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
      
      {/* Header Section */}
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

      {/* Main Success Content */}
      <main className="container mx-auto p-4 md:p-8 flex-grow flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 max-w-2xl mx-auto text-center border-t-8 border-green-600">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-6">
            সফল!
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            সঠিক তথ্য দিয়ে আবেদনের জন্য আপনাকে ধন্যবাদ।
          </p>

          {/* Home Button */}
          <Link 
            href="/"
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
          >
            হোম
          </Link>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">
            {/* Logo and About Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <Link href="/" title="Go to homepage">
                <Image
                  src="https://i.ibb.co/XrSYyycN/ngo-logo.png"
                  alt="United Forum Organisation Logo"
                  width={100}
                  height={100}
                  className="h-16 md:h-20 object-contain"
                  onError={(e) => { 
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = "https://placehold.co/100x100/E0E0E0/333333?text=Logo";
                  }}
                />
              </Link>
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-xl font-bold mb-2">United Forum Organisation</h3>
              </div>
            </div>
            
            {/* Main Office */}
            <div>
              <h4 className="font-semibold text-lg mb-2">Main Office</h4>
              <p className="text-sm opacity-80">Amborkhana, Sylhet Sadar, Sylhet</p>
            </div>
            
            {/* Sub Offices */}
            <div>
              <h4 className="font-semibold text-lg mb-2">Sub Offices</h4>
              <ul className="text-sm opacity-80 space-y-1">
                <li>Sacna Bazar, Jamalganj, Sunamganj</li>
                <li>Hazi Super Market, Dhormopasha, Sunamganj</li>
                <li>Chatok, Sunamganj</li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
                <h4 className="font-semibold text-lg mb-2">Contact Us</h4>
                <ul className="text-sm opacity-80 space-y-1">
                    <li>Email: info@unitedforum.org</li>
                    <li>Phone: +880 1234 567890</li>
                </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs opacity-60">
            &copy; {new Date().getFullYear()} United Forum Organisation. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SuccessPage;