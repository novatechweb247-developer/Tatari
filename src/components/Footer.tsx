import React from 'react';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1511] text-[#F6F1E8] pt-20 pb-12 border-t border-[#3A271C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-[#3A271C]">
          {/* Brand Info */}
          <div>
            <div className="flex flex-col mb-6">
              <span className="font-serif text-2xl font-light tracking-[0.2em] text-[#F6F1E8]">
                TATARI
              </span>
              <span className="text-xs font-sans tracking-[0.3em] text-[#C9A45C] uppercase">
                Furniture
              </span>
            </div>
            <p className="text-[#D8CEC0] text-sm leading-relaxed font-light mb-6">
              {BUSINESS_INFO.description}
            </p>
            <div className="flex items-center space-x-3">
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex items-center justify-center w-10 h-10 rounded-full aspect-square bg-[#25D366] text-white hover:scale-105 transition-transform"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
              </a>
              <a
                href={`tel:${BUSINESS_INFO.phoneInternational}`}
                aria-label="Phone Call"
                className="flex items-center justify-center w-10 h-10 rounded-full aspect-square bg-[#3A271C] text-[#C9A45C] hover:bg-[#C9A45C] hover:text-[#1C1511] transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-lg font-medium text-[#C9A45C] tracking-wide mb-6 uppercase">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm text-[#D8CEC0]">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Collections', path: '/collections' },
                { name: 'Living Room', path: '/living-room' },
                { name: 'Bedroom', path: '/bedroom' },
              ].map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    onClick={(e) => handleLinkClick(e, item.path)}
                    className="hover:text-[#C9A45C] transition-colors font-light"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="font-serif text-lg font-medium text-[#C9A45C] tracking-wide mb-6 uppercase">
              Showroom & Custom
            </h4>
            <ul className="space-y-3 text-sm text-[#D8CEC0]">
              {[
                { name: 'Custom Furniture', path: '/custom-furniture' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Contact Us', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    onClick={(e) => handleLinkClick(e, item.path)}
                    className="hover:text-[#C9A45C] transition-colors font-light"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-lg font-medium text-[#C9A45C] tracking-wide mb-6 uppercase">
              Visit Store
            </h4>
            <div className="space-y-4 text-sm text-[#D8CEC0] font-light">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-[#C9A45C] mr-3 shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-[#C9A45C] mr-3 shrink-0" />
                <span>{BUSINESS_INFO.phone}</span>
              </div>
            </div>
            <div className="mt-6">
              <a
                href="/contact"
                onClick={(e) => handleLinkClick(e, '/contact')}
                className="inline-flex items-center justify-center rounded-full bg-[#C9A45C] text-[#1C1511] font-medium text-xs tracking-wider uppercase px-6 py-3 hover:bg-[#DFC27A] transition-colors shadow-md"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#D8CEC0]/60 font-light">
          <p>© {new Date().getFullYear()} Tatari Furniture. All rights reserved.</p>
          <p className="mt-4 md:mt-0">179 Dogon Karfi, Jos, Plateau State, Nigeria</p>
        </div>
      </div>
    </footer>
  );
};
