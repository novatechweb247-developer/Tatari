import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, MapPin, Phone, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO } from '../data';

interface AboutProps {
  onNavigate: (path: string) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8] pt-28 pb-20">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-[#5A3E2B] font-semibold block mb-4">
            About Tatari Furniture
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1C1511] mb-6">
            FURNITURE WITH CHARACTER.
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#3A271C] font-light leading-relaxed">
            Serving customers in Jos, Plateau State, Tatari Furniture is dedicated to bringing exceptional comfort, lasting quality, and distinctive style into every home.
          </p>
        </div>
      </div>

      {/* Editorial Image & Story */}
      <section className="py-16 bg-white border-y border-[#D8CEC0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px]">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85"
                alt="Tatari Furniture Showroom"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C9A45C] font-semibold block mb-3">
                Our Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1511] mb-6">
                Crafting Spaces That Inspire Comfort & Style
              </h2>
              <p className="text-[#3A271C] text-base leading-relaxed font-light mb-6">
                Your home is your sanctuary. At Tatari Furniture, we believe that every sofa, bed, and custom living piece should do more than simply fill a room—it should enrich your daily living experience.
              </p>
              <p className="text-[#3A271C] text-base leading-relaxed font-light mb-8">
                Located at {BUSINESS_INFO.address}, we welcome clients to explore our showroom and discover pieces selected for their visual elegance, ergonomic comfort, and enduring durability.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/collections"
                  onClick={(e) => handleNav(e, '/collections')}
                  className="inline-flex items-center justify-center rounded-full bg-[#1C1511] hover:bg-[#3A271C] text-[#F6F1E8] font-medium text-xs tracking-wider uppercase px-8 py-4 transition-colors shadow-md"
                >
                  Explore Collections
                </a>
                <a
                  href="/contact"
                  onClick={(e) => handleNav(e, '/contact')}
                  className="inline-flex items-center justify-center rounded-full bg-transparent border border-[#1C1511] text-[#1C1511] font-medium text-xs tracking-wider uppercase px-8 py-4 hover:bg-[#1C1511] hover:text-[#F6F1E8] transition-colors"
                >
                  Visit Showroom
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-[#F6F1E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#5A3E2B] font-semibold block mb-2">
              Commitment to Excellence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1511]">
              The Tatari Standard
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D8CEC0] text-center">
              <div className="w-14 h-14 rounded-full bg-[#C9A45C]/20 text-[#5A3E2B] flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#1C1511] mb-4">
                Visual Elegance
              </h3>
              <p className="text-[#3A271C] text-sm leading-relaxed font-light">
                Carefully selected finishes, luxurious fabrics, and sophisticated silhouettes designed to elevate modern interiors.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D8CEC0] text-center">
              <div className="w-14 h-14 rounded-full bg-[#C9A45C]/20 text-[#5A3E2B] flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#1C1511] mb-4">
                Lasting Durability
              </h3>
              <p className="text-[#3A271C] text-sm leading-relaxed font-light">
                Built with robust frames, premium cushioning, and resilient materials meant to withstand everyday family life gracefully.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D8CEC0] text-center">
              <div className="w-14 h-14 rounded-full bg-[#C9A45C]/20 text-[#5A3E2B] flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#1C1511] mb-4">
                Local Presence in Jos
              </h3>
              <p className="text-[#3A271C] text-sm leading-relaxed font-light">
                Conveniently located at 179 Dogon Karfi, providing personalized customer service and reliable furniture solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#1C1511] text-[#F6F1E8]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-5xl font-normal mb-6 text-[#F6F1E8]">
            Experience Tatari Furniture Today
          </h2>
          <p className="text-[#D8CEC0] font-light text-base mb-8 max-w-xl mx-auto">
            Have questions about our pieces or looking for custom furniture? Get in touch with our team in Jos.
          </p>
          <a
            href="/contact"
            onClick={(e) => handleNav(e, '/contact')}
            className="inline-flex items-center justify-center rounded-full bg-[#C9A45C] hover:bg-[#DFC27A] text-[#1C1511] font-medium text-xs tracking-wider uppercase px-8 py-4 transition-colors shadow-lg"
          >
            Contact Tatari Furniture
          </a>
        </div>
      </section>
    </div>
  );
};
