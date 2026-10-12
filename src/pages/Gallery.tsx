import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GALLERY_ITEMS } from '../data';
import { GalleryItem } from '../types';
import { LightboxModal } from '../components/LightboxModal';
import { Eye } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const categories = ['All', 'Living Room', 'Bedroom', 'Furniture', 'Showroom', 'Interiors'];

  const filteredItems = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const handleOpenLightbox = (index: number) => {
    setSelectedItemIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedItemIndex(null);
  };

  const handleNext = () => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((prev) => (prev! + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-[#5A3E2B] font-semibold block mb-4">
            Visual Showroom & Interiors
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1C1511] mb-6">
            GALLERY.
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#3A271C] font-light leading-relaxed">
            Immerse yourself in our editorial showcase of furniture craftsmanship and showroom displays in Jos.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-6 py-3 text-xs uppercase tracking-wider font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#1C1511] text-[#F6F1E8] shadow-lg'
                  : 'bg-white text-[#3A271C] border border-[#D8CEC0] hover:bg-[#D8CEC0]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item: GalleryItem, index: number) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => handleOpenLightbox(index)}
              className="group relative h-[380px] rounded-2xl overflow-hidden cursor-pointer shadow-lg bg-[#1C1511]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1511]/90 via-[#1C1511]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C9A45C] mb-2 font-medium">
                  {item.category}
                </span>
                <h3 className="font-serif text-2xl text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#D8CEC0] font-light line-clamp-2">
                  {item.description}
                </p>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full aspect-square bg-[#1C1511]/80 text-[#C9A45C] flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        item={selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null}
        onClose={handleCloseLightbox}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};
