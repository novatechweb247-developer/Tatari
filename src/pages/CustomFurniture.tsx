import React from 'react';
import { PRODUCTS } from '../data';
import { Product } from '../types';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CustomFurnitureProps {
  onNavigate: (path: string) => void;
}

export const CustomFurniture: React.FC<CustomFurnitureProps> = ({ onNavigate }) => {
  const customProducts = PRODUCTS.filter((p) => p.category === 'custom');

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
            Tailored Solutions
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1C1511] mb-6">
            CUSTOM FURNITURE.
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#3A271C] font-light leading-relaxed">
            Have specific dimensions or a unique design in mind? Let Tatari Furniture help you source or create furniture tailored precisely to your space.
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="bg-[#1C1511] text-[#F6F1E8] rounded-3xl p-8 sm:p-12 mb-20 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12">
            <Sparkles className="w-96 h-96 text-[#C9A45C]" />
          </div>
          <div className="max-w-2xl relative z-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-semibold block mb-3">
              Bespoke Service
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal mb-6">
              Designed For Your Exact Space
            </h2>
            <p className="text-[#D8CEC0] text-sm sm:text-base font-light leading-relaxed mb-8">
              Every home and office has its own distinctive architecture. Whether you need customized executive desks, dining sets, or specialized living room seating, our team in Jos works closely with you to bring your vision to life.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-[#D8CEC0]">
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-[#C9A45C] mr-3 shrink-0" />
                <span>Tailored dimensions for unique room layouts</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-[#C9A45C] mr-3 shrink-0" />
                <span>Wide selection of wood finishes and upholstery fabrics</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-[#C9A45C] mr-3 shrink-0" />
                <span>Professional guidance on style and spatial coordination</span>
              </li>
            </ul>
            <a
              href="/contact"
              onClick={(e) => handleNav(e, '/contact')}
              className="inline-flex items-center justify-center rounded-full bg-[#C9A45C] hover:bg-[#DFC27A] text-[#1C1511] font-medium text-xs tracking-wider uppercase px-8 py-4 transition-colors shadow-lg"
            >
              Start An Enquiry
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>

        {/* Custom Examples */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-normal text-[#1C1511]">
            Examples of Custom Work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {customProducts.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-[#D8CEC0] flex flex-col justify-between group"
            >
              <div className="relative h-[380px] overflow-hidden bg-[#1C1511]">
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
                  <h3 className="font-serif text-2xl md:text-3xl font-normal text-[#1C1511] mb-3">
                    {product.name}
                  </h3>
                  <p className="text-[#3A271C] text-sm md:text-base font-light leading-relaxed mb-6">
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
                  className="inline-flex items-center justify-center w-full rounded-full bg-[#1C1511] hover:bg-[#3A271C] text-[#F6F1E8] font-medium text-xs tracking-wider uppercase py-4 transition-colors shadow-md"
                >
                  Enquire About Custom Order
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
