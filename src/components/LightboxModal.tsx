import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../types';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, onNext, onPrev]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Close Button - Perfect Circle */}
        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute top-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full aspect-square bg-[#1C1511]/80 text-[#F6F1E8] hover:bg-[#C9A45C] hover:text-[#1C1511] transition-colors shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Prev Button - Perfect Circle */}
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous image"
          className="absolute left-4 md:left-8 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full aspect-square bg-[#1C1511]/80 text-[#F6F1E8] hover:bg-[#C9A45C] hover:text-[#1C1511] transition-colors shadow-lg"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* Next Button - Perfect Circle */}
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Next image"
          className="absolute right-4 md:right-8 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full aspect-square bg-[#1C1511]/80 text-[#F6F1E8] hover:bg-[#C9A45C] hover:text-[#1C1511] transition-colors shadow-lg"
        >
          <ChevronRight className="w-7 h-7" />
        </button>

        {/* Content Box */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl w-full bg-[#1C1511] text-[#F6F1E8] rounded-2xl overflow-hidden shadow-2xl border border-[#3A271C]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-black flex items-center justify-center min-h-[350px] md:min-h-[500px]">
              <img
                src={item.image}
                alt={item.title}
                className="max-h-[75vh] w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-between bg-[#1C1511]">
              <div>
                <span className="inline-block text-xs uppercase tracking-[0.2em] text-[#C9A45C] mb-2 font-medium">
                  {item.category}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-normal mb-4 text-[#F6F1E8]">
                  {item.title}
                </h3>
                <p className="text-[#D8CEC0] text-sm md:text-base leading-relaxed mb-6 font-light">
                  {item.description}
                </p>
              </div>
              <div className="pt-6 border-t border-[#3A271C]">
                <p className="text-xs text-[#D8CEC0]/70 mb-4">
                  Interested in this style or custom sizing? Contact Tatari Furniture.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center w-full py-3 px-6 rounded-full bg-[#C9A45C] text-[#1C1511] font-medium text-sm hover:bg-[#DFC27A] transition-colors shadow-md"
                >
                  Enquire About Piece
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
