import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { Menu, X, Briefcase, Users, Phone, BarChartBig, MessageSquareText, Info, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button'; // from shadcn/ui
import { CIFullLogo } from './logos';

export const Logo = () => {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 md:w-16 md:h-16"
    >
      <text
        x="50"
        y="65"
        fontFamily="'Source Serif 4', Georgia, serif"
        fontSize="60"
        fontWeight="bold"
        fill="#FFD700"
        textAnchor="middle"
      >
        C
      </text>  
    </svg>
  );
};

//import React, { useState } from 'react';
//import { Link, NavLink } from 'react-router-dom';

//import {  } from 'lucide-react';
//import Logo from './Logo';

const navLinks = [
  { href: '/', label: 'Home', icon: <Briefcase className="mr-2 h-4 w-4" /> },
  { href: '/about', label: 'About Us', icon: <Info className="mr-2 h-4 w-4" /> },
  { href: '/plans', label: 'Plans', icon: <BarChartBig className="mr-2 h-4 w-4" /> },
  { href: '/testimonials', label: 'Testimonials', icon: <MessageSquareText className="mr-2 h-4 w-4" /> },
  { href: '/contact', label: 'Contact', icon: <Phone className="mr-2 h-4 w-4" /> },
  { href: '/faq', label: 'FAQ', icon: <HelpCircle className="mr-2 h-4 w-4" /> },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black sticky top-0 z-100 shadow-md"> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <CIFullLogo />
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out flex items-center
                    ${isActive
                      ? 'bg-brand-gold text-brand-black'
                      : 'text-gray-300 hover:bg-brand-darkGray hover:text-brand-gold'
                    }`
                  }
                >
                  {link.icon} {link.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <Link to="/auth">
              <Button variant="outline" className="mr-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black">
                Login
              </Button>
            </Link>
            <Link to="/get-started">
              <Button className="bg-brand-gold text-brand-black hover:bg-opacity-80">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} className="text-brand-gold hover:text-white">
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-darkGray border-b border-brand-lightGray">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium flex items-center
                  ${isActive
                    ? 'bg-brand-gold text-brand-black'
                    : 'text-gray-300 hover:bg-brand-lightGray hover:text-brand-gold'
                  }`
                }
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex flex-col items-center space-y-2 px-5">
              <Link to="/auth" className="w-full" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black">
                  Login
                </Button>
              </Link>
              <Link to="/get-started" className="w-full" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-brand-gold text-brand-black hover:bg-opacity-80">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;