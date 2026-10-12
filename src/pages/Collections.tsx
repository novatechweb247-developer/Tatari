import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PRODUCTS } from '../data';
import { Product } from '../types';

interface CollectionsProps {
  onNavigate: (path: string) => void;
}

export const Collections: React.FC<CollectionsProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Collections' },
    { id: 'living-room', name: 'Living Room' },
    { id: 'bedroom', name: 'Bedroom' },
    { id: 'custom', name: 'Custom Furniture' },
    { id: 'other', name: 'Other Furniture' },
  ];

  const filteredProducts = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-[#5A3E2B] font-semibold block mb-4">
            Catalog & Showroom
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1C1511] mb-6">
            OUR COLLECTIONS.
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#3A271C] font-light leading-relaxed">
            Explore our curated selection of fine furniture designed for living rooms, bedrooms, and custom spaces in Jos.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-6 py-3 text-xs uppercase tracking-wider font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#1C1511] text-[#F6F1E8] shadow-lg'
                  : 'bg-white text-[#3A271C] border border-[#D8CEC0] hover:bg-[#D8CEC0]/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product: Product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#D8CEC0] flex flex-col justify-between group"
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

              <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
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
                  Enquire About Piece
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
