import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data';

export const WhatsAppButton: React.FC = () => {
  return (
    <a
      href={BUSINESS_INFO.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full aspect-square bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
    >
      <MessageCircle className="w-7 h-7 md:w-8 md:h-8 fill-current" />
    </a>
  );
};
