import React from 'react';
import { PRODUCTS } from '../data';
import { Product } from '../types';

interface BedroomProps {
  onNavigate: (path: string) => void;
}

export const Bedroom: React.FC<BedroomProps> = ({ onNavigate }) => {
  const bedroomProducts = PRODUCTS.filter((p) => p.category === 'bedroom');

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#5A3E2B] font-semibold block mb-4">
            Sanctuary & Rest
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1C1511] mb-6">
            BEDROOM FURNITURE.
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#3A271C] font-light leading-relaxed">
            Create a tranquil retreat with our premium king beds, spacious wardrobes, and matching bedside storage solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bedroomProducts.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-[#D8CEC0] flex flex-col justify-between group"
            >
              <div className="relative h-80 overflow-hidden bg-[#1C1511]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#1C1511]/80 backdrop-blur-sm text-[#C9A45C] text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full">
                  {product.categoryLabel}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-[#1C1511] mb-3">
                    {product.name}
                  </h3>
                  <p className="text-[#3A271C] text-sm font-light leading-relaxed mb-6">
                    {product.description}
                  </p>
                  {product.materials && (
                    <div className="text-xs text-[#5A3E2B] mb-6 font-medium">
                      Materials: <span className="font-light text-[#3A271C]">{product.materials}</span>
                    </div>
                  )}
                </div>

                <a
                  href="/contact"
                  onClick={(e) => handleNav(e, '/contact')}
                  className="inline-flex items-center justify-center w-full rounded-full bg-[#1C1511] hover:bg-[#3A271C] text-[#F6F1E8] font-medium text-xs tracking-wider uppercase py-3.5 transition-colors shadow-md"
                >
                  Enquire Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
