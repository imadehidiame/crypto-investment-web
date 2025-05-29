import React from 'react';
import { Link } from 'react-router';
import { Facebook, Twitter, Linkedin, Mail, MapPin, PhoneCall } from 'lucide-react';
import { Logo } from './navbar';
import { CIShortLogo } from './logos';
//import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-brand-darkGray text-gray-300 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & About */}
          <div>
            <CIShortLogo />
            <p className="mt-4 text-sm text-gray-400">
              Securely invest in cryptocurrency and watch your portfolio grow. CoinInvest offers transparent plans and reliable returns.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-brand-gold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-brand-gold transition-colors text-sm">About Us</Link></li>
              <li><Link to="/plans" className="hover:text-brand-gold transition-colors text-sm">Investment Plans</Link></li>
              <li><Link to="/testimonials" className="hover:text-brand-gold transition-colors text-sm">Testimonials</Link></li>
              <li><Link to="/faq" className="hover:text-brand-gold transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-brand-gold transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-lg font-semibold text-brand-gold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-brand-gold transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-gold transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-brand-gold transition-colors text-sm">Risk Disclaimer</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-brand-gold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {/*<li className="flex items-start">
                <MapPin size={20} className="text-brand-gold mr-3 mt-1 flex-shrink-0" />
                <span className="text-sm"></span>
              </li>*/}
              <li className="flex items-center">
                <Mail size={20} className="text-brand-gold mr-3 flex-shrink-0" />
                <a href="mailto:support@coininvest.com" className="hover:text-brand-gold transition-colors text-sm">support@coininvestdesk.com</a>
              </li>
              <li className="flex items-center">
                <PhoneCall size={20} className="text-brand-gold mr-3 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-brand-gold transition-colors text-sm">+1 (309) 407 190</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-brand-lightGray text-center text-sm">
          <p>&copy; {currentYear} CoinInvest. All rights reserved. Investing in cryptocurrency involves risk. Please invest responsibly.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;