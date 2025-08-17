'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <>
      {/* Skip Links for Accessibility */}
      <div className="skip-links">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
        >
          Skip to main content
        </a>
        <a 
          href="#main-navigation" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 bg-blue-600 text-white px-4 py-2 rounded z-50"
        >
          Skip to navigation
        </a>
      </div>
      
      <header className="bg-white shadow-sm border-b" role="banner">
        <nav id="main-navigation" className="container mx-auto px-6 py-4" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              The Bigger Boss
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button 
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
                data-testid="solutions-dropdown-trigger"
              >
                Solutions
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div 
                className={`absolute top-full left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg transition-all duration-200 z-50 ${
                  isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
                data-testid="solutions-dropdown-menu"
              >
                <Link 
                  href="/solutions/for-smbs" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                  data-testid="nav-smb-link"
                >
                  For SMBs
                </Link>
                <Link 
                  href="/solutions/for-agencies" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                  data-testid="nav-agency-link"
                >
                  For Agencies
                </Link>
              </div>
            </div>
            <Link href="/resources" className="text-gray-700 hover:text-blue-600 font-medium">
              Resources
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 font-medium">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
              Contact
            </Link>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Start Free Trial
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <div className="w-6 h-6 flex flex-col justify-around">
              <span className="w-full h-0.5 bg-gray-600"></span>
              <span className="w-full h-0.5 bg-gray-600"></span>
              <span className="w-full h-0.5 bg-gray-600"></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-3">
              <Link href="/solutions/for-smbs" className="text-gray-700 hover:text-blue-600">
                Solutions for SMBs
              </Link>
              <Link href="/solutions/for-agencies" className="text-gray-700 hover:text-blue-600">
                Solutions for Agencies
              </Link>
              <Link href="/resources" className="text-gray-700 hover:text-blue-600">
                Resources
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">
                Contact
              </Link>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full">
                Start Free Trial
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
    </>
  )
}