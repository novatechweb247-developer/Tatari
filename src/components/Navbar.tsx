import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BUSINESS_INFO } from '../data';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Collections', path: '/collections' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#1C1511]/95 backdrop-blur-md py-4 shadow-xl border-b border-[#3A271C]'
          : 'bg-gradient-to-b from-[#1C1511]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="flex flex-col group text-left"
        >
          <span className="font-serif text-xl sm:text-2xl font-light tracking-[0.2em] text-[#F6F1E8] group-hover:text-[#C9A45C] transition-colors">
            TATARI
          </span>
          <span className="text-[10px] sm:text-xs font-sans tracking-[0.3em] text-[#C9A45C] uppercase">
            Furniture
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`text-xs uppercase tracking-[0.15px] font-medium transition-colors py-1 relative ${
                  isActive ? 'text-[#C9A45C]' : 'text-[#F6F1E8]/80 hover:text-[#F6F1E8]'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A45C]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA & Phone */}
        <div className="hidden lg:flex items-center space-x-4">
          <a
            href={`tel:${BUSINESS_INFO.phoneInternational}`}
            className="hidden xl:flex items-center text-xs text-[#D8CEC0] hover:text-[#C9A45C] transition-colors tracking-wider"
          >
            <Phone className="w-3.5 h-3.5 mr-2 text-[#C9A45C]" />
            {BUSINESS_INFO.phone}
          </a>
          <a
            href="/contact"
            onClick={(e) => handleLinkClick(e, '/contact')}
            className="inline-flex items-center justify-center rounded-full bg-[#C9A45C] hover:bg-[#DFC27A] text-[#1C1511] font-medium text-xs tracking-wider uppercase px-6 py-2.5 transition-all shadow-md hover:scale-105"
          >
            Contact Us
          </a>
        </div>

        {/* Mobile Hamburger Button - Perfect Circle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
          className="xl:hidden flex items-center justify-center w-11 h-11 rounded-full aspect-square bg-[#3A271C] text-[#F6F1E8] hover:bg-[#C9A45C] hover:text-[#1C1511] transition-colors focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="xl:hidden bg-[#1C1511] border-t border-[#3A271C] overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <a
                    href={link.path}
                    onClick={(e) => handleLinkClick(e, link.path)}
                    className={`block font-serif text-xl py-2 border-b border-[#3A271C]/50 transition-colors ${
                      currentPath === link.path ? 'text-[#C9A45C] pl-2' : 'text-[#F6F1E8] hover:text-[#C9A45C]'
                    }`}
                  >
                    {link.name}
                  </a>
                </motion.div>
              ))}

              <div className="pt-4 flex flex-col space-y-3">
                <a
                  href={`tel:${BUSINESS_INFO.phoneInternational}`}
                  className="flex items-center text-sm text-[#D8CEC0] py-2"
                >
                  <Phone className="w-4 h-4 mr-3 text-[#C9A45C]" />
                  {BUSINESS_INFO.phone}
                </a>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, '/contact')}
                  className="w-full text-center rounded-full bg-[#C9A45C] text-[#1C1511] font-medium text-xs tracking-wider uppercase py-3 shadow-md"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
