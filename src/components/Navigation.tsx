'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#blog', label: 'Resources' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">EC</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Executive Coach</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/admin"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Admin
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Suite
            </Link>
            <a
              href="#booking"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-3 text-gray-600 hover:text-blue-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/admin"
              className="block py-3 text-gray-600 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
            <Link
              href="/login"
              className="block py-3 text-purple-600 hover:text-purple-700 font-medium"
              onClick={() => setIsOpen(false)}
            >
              AI Suite
            </Link>
            <a
              href="#booking"
              className="block mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-center hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              Book a Call
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
