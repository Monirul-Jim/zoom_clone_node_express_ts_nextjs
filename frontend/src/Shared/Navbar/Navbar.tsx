'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="text-xl font-semibold text-gray-800">
            Meet
          </div>

          {/* Hamburger icon */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Right side menu (desktop) */}
          <div className="hidden md:flex space-x-6 items-center text-gray-700">
            <a href="#" className="hover:text-blue-600">Join as guest</a>
            <a href="/login" className="hover:text-blue-600">Login</a>
            <a href="/register" className="hover:text-blue-600">Register</a>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-2">
          <a href="#" className="block text-gray-700 hover:text-blue-600">Join as guest</a>
          <a href="/login" className="block text-gray-700 hover:text-blue-600">Login</a>
          <a href="/register" className="block text-gray-700 hover:text-blue-600">Register</a>
        </div>
      )}
    </nav>
  );
}
