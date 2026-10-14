import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { HERO_SLIDES, PRODUCTS, BUSINESS_INFO } from '../data';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

interface HomeProps {
  onNavigate: (path: string) => void;
}

type HomeHeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  button_text?: string;
  button_url?: string;
};

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<HomeHeroSlide[]>(HERO_SLIDES);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(PRODUCTS.slice(0, 4));
  const [editorialImage, setEditorialImage] = useState('');
  const [businessAddress, setBusinessAddress] = useState(BUSINESS_INFO.address);
  const [whatsappUrl, setWhatsappUrl] = useState(BUSINESS_INFO.whatsappUrl);

  useEffect(() => {
    let cancelled = false;
    const loadPublishedHero = async () => {
      if (!supabase) return;
      const { data, error } = await supabase.from('hero_slides').select('slide_number,title,subtitle,badge,image_url,button_text,button_url,is_published').eq('is_published', true).order('slide_number');
      if (!cancelled && !error && data?.length === 3 && data.every(row => row.title && row.image_url)) {
        setHeroSlides(data.map(row => ({ id: row.slide_number, title: row.title, subtitle: row.subtitle, badge: row.badge, image: row.image_url, button_text: row.button_text, button_url: row.button_url })));
      }
    };
    void loadPublishedHero();
    const loadPublishedSettings = async () => {
      const { data, error } = await supabase.from('site_settings').select('address,whatsapp_url,editorial_image_url,is_published').eq('id', 'main').eq('is_published', true).maybeSingle();
      if (!cancelled && !error && data) {
        if (data.editorial_image_url) setEditorialImage(data.editorial_image_url);
        if (data.address) setBusinessAddress(data.address);
        if (data.whatsapp_url) setWhatsappUrl(data.whatsapp_url);
      }
    };
    const loadFeaturedProducts = async () => {
      const { data, error } = await supabase.from('products').select('id,name,category,category_label,image_url,description,features,dimensions,materials').eq('is_published', true).order('sort_order').limit(4);
      if (!cancelled && !error && data?.length) {
        setFeaturedProducts(data.map(row => ({ id: row.id, name: row.name, category: row.category as Product['category'], categoryLabel: row.category_label, image: row.image_url, description: row.description, features: Array.isArray(row.features) ? row.features as string[] : [], dimensions: row.dimensions || undefined, materials: row.materials || undefined })));
      }
    };
    if (supabase) {
      void loadPublishedSettings();
      void loadFeaturedProducts();
    }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8]">
      {/* Cinematic Hero Carousel */}
      <section className="relative h-screen w-full overflow-hidden bg-[#1C1511]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1511] via-[#1C1511]/40 to-[#1C1511]/60 z-10" />
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white mt-16">
            <motion.div
              key={`badge-${currentSlide}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#C9A45C]/20 border border-[#C9A45C]/40 text-[#DFC27A] text-xs uppercase tracking-[0.25em]"
            >
              {heroSlides[currentSlide].badge}
            </motion.div>

            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-wide leading-tight mb-6 text-[#F6F1E8]"
            >
              {heroSlides[currentSlide].title}
            </motion.h1>

            <motion.p
              key={`sub-${currentSlide}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-sans text-base sm:text-lg md:text-xl text-[#D8CEC0] max-w-2xl mx-auto font-light mb-10"
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>

            <motion.div
              key={`cta-${currentSlide}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <a
                href={heroSlides[currentSlide].button_url || '/collections'}
                onClick={(e) => {
                  const target = heroSlides[currentSlide].button_url || '/collections';
                  if (target.startsWith('/')) handleNav(e, target);
                }}
                target={(heroSlides[currentSlide].button_url || '/collections').startsWith('/') ? undefined : '_blank'}
                rel={(heroSlides[currentSlide].button_url || '/collections').startsWith('/') ? undefined : 'noopener noreferrer'}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#C9A45C] hover:bg-[#DFC27A] text-[#1C1511] font-medium text-sm tracking-wider uppercase px-8 py-4 transition-all shadow-xl hover:scale-105"
              >
                {heroSlides[currentSlide].button_text || 'Explore Collections'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a
                href="/contact"
                onClick={(e) => handleNav(e, '/contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-transparent hover:bg-white/10 text-white border border-white/40 font-medium text-sm tracking-wider uppercase px-8 py-4 transition-all"
              >
                Contact Us
              </a>
            </motion.div>
          </div>
        </div>

        {/* Carousel Controls - Perfect Circles */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-between max-w-7xl mx-auto px-6">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="flex items-center justify-center w-12 h-12 rounded-full aspect-square bg-[#1C1511]/60 border border-white/20 text-white hover:bg-[#C9A45C] hover:text-[#1C1511] transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-3">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === idx ? 'w-8 h-2 bg-[#C9A45C]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex items-center justify-center w-12 h-12 rounded-full aspect-square bg-[#1C1511]/60 border border-white/20 text-white hover:bg-[#C9A45C] hover:text-[#1C1511] transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Editorial Introduction */}
      <section className="py-24 md:py-32 bg-[#F6F1E8] text-[#1C1511]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#5A3E2B] font-semibold mb-4 block">
            Tatari Furniture Showcase
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-tight mb-8">
            FURNITURE FOR THE WAY YOU LIVE.
          </h2>
          {editorialImage && <img src={editorialImage} alt="Tatari Furniture editorial" className="mx-auto mb-10 max-h-[520px] w-full max-w-4xl rounded-2xl object-cover shadow-lg" loading="lazy" referrerPolicy="no-referrer" />}
          <p className="font-sans text-base sm:text-lg text-[#3A271C] max-w-2xl mx-auto font-light leading-relaxed mb-12">
            Explore furniture created to bring comfort, style and character into everyday spaces. Located in Jos, we offer carefully curated pieces that define modern Nigerian living with elegance and durability.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="/about"
              onClick={(e) => handleNav(e, '/about')}
              className="inline-flex items-center justify-center rounded-full bg-[#1C1511] text-[#F6F1E8] font-medium text-xs tracking-wider uppercase px-8 py-4 hover:bg-[#3A271C] transition-colors shadow-lg"
            >
              Our Story & Showroom
            </a>
            <a
              href="/gallery"
              onClick={(e) => handleNav(e, '/gallery')}
              className="inline-flex items-center justify-center rounded-full bg-transparent border border-[#3A271C] text-[#1C1511] font-medium text-xs tracking-wider uppercase px-8 py-4 hover:bg-[#3A271C] hover:text-[#F6F1E8] transition-colors"
            >
              View Gallery
            </a>
          </div>
        </div>
      </section>

      {/* Featured Collections Grid */}
      <section className="py-20 bg-[#ECE4D8] border-t border-[#D8CEC0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#5A3E2B] font-semibold block mb-2">
                Curated Spaces
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1511]">
                Featured Collections
              </h2>
            </div>
            <a
              href="/collections"
              onClick={(e) => handleNav(e, '/collections')}
              className="mt-4 md:mt-0 inline-flex items-center text-sm uppercase tracking-wider font-semibold text-[#5A3E2B] hover:text-[#1C1511] transition-colors"
            >
              View All Collections <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Living Room Card */}
            <div
              onClick={(e) => handleNav(e, '/living-room')}
              className="group relative h-[480px] rounded-2xl overflow-hidden cursor-pointer shadow-xl bg-[#1C1511]"
            >
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=85"
                alt="Living Room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1511] via-[#1C1511]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C9A45C] block mb-2">
                  Living Room
                </span>
                <h3 className="font-serif text-3xl font-normal mb-4">
                  Sofas & Lounge Sets
                </h3>
                <span className="inline-flex items-center justify-center rounded-full bg-[#C9A45C] text-[#1C1511] font-medium text-xs tracking-wider uppercase px-6 py-3 group-hover:bg-[#DFC27A] transition-colors">
                  Explore Living Room
                </span>
              </div>
            </div>

            {/* Bedroom Card */}
            <div
              onClick={(e) => handleNav(e, '/bedroom')}
              className="group relative h-[480px] rounded-2xl overflow-hidden cursor-pointer shadow-xl bg-[#1C1511]"
            >
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=85"
                alt="Bedroom"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1511] via-[#1C1511]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C9A45C] block mb-2">
                  Bedroom
                </span>
                <h3 className="font-serif text-3xl font-normal mb-4">
                  Beds & Wardrobes
                </h3>
                <span className="inline-flex items-center justify-center rounded-full bg-[#C9A45C] text-[#1C1511] font-medium text-xs tracking-wider uppercase px-6 py-3 group-hover:bg-[#DFC27A] transition-colors">
                  Explore Bedroom
                </span>
              </div>
            </div>

            {/* Custom Furniture Card */}
            <div
              onClick={(e) => handleNav(e, '/custom-furniture')}
              className="group relative h-[480px] rounded-2xl overflow-hidden cursor-pointer shadow-xl bg-[#1C1511]"
            >
              <img
                src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=85"
                alt="Custom Furniture"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1511] via-[#1C1511]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C9A45C] block mb-2">
                  Bespoke
                </span>
                <h3 className="font-serif text-3xl font-normal mb-4">
                  Custom Furniture
                </h3>
                <span className="inline-flex items-center justify-center rounded-full bg-[#C9A45C] text-[#1C1511] font-medium text-xs tracking-wider uppercase px-6 py-3 group-hover:bg-[#DFC27A] transition-colors">
                  Start an Enquiry
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="py-24 bg-[#F6F1E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#5A3E2B] font-semibold block mb-3">
              Masterpieces in Wood & Fabric
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#1C1511] mb-6">
              Featured Pieces
            </h2>
            <p className="text-[#3A271C] font-light text-base">
              A selection of our finest furniture pieces available to view and order through our Jos showroom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: Product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#D8CEC0] flex flex-col justify-between group"
              >
                <div className="relative h-72 overflow-hidden bg-[#1C1511]">
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

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-normal text-[#1C1511] mb-2">
                      {product.name}
                    </h3>
                    <p className="text-[#3A271C]/80 text-xs font-light line-clamp-2 mb-6">
                      {product.description}
                    </p>
                  </div>

                  <a
                    href="/contact"
                    onClick={(e) => handleNav(e, '/contact')}
                    className="inline-flex items-center justify-center w-full rounded-full bg-[#1C1511] hover:bg-[#3A271C] text-[#F6F1E8] font-medium text-xs tracking-wider uppercase py-3 transition-colors shadow-md"
                  >
                    Enquire Now
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a
              href="/collections"
              onClick={(e) => handleNav(e, '/collections')}
              className="inline-flex items-center justify-center rounded-full bg-[#C9A45C] hover:bg-[#DFC27A] text-[#1C1511] font-medium text-xs tracking-wider uppercase px-8 py-4 transition-colors shadow-lg"
            >
              Browse Full Catalog
            </a>
          </div>
        </div>
      </section>

      {/* Jos Store Presence Banner */}
      <section className="py-20 bg-[#1C1511] text-[#F6F1E8] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A45C_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full aspect-square bg-[#C9A45C]/20 text-[#C9A45C] mb-6">
            <MapPin className="w-6 h-6" />
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal mb-6 text-[#F6F1E8]">
            Visit Our Showroom in Jos
          </h2>
          <p className="text-[#D8CEC0] text-base sm:text-lg font-light max-w-xl mx-auto mb-8">
            {businessAddress}. Experience our craftsmanship firsthand or speak with our team directly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/contact"
              onClick={(e) => handleNav(e, '/contact')}
              className="inline-flex items-center justify-center rounded-full bg-[#C9A45C] hover:bg-[#DFC27A] text-[#1C1511] font-medium text-xs tracking-wider uppercase px-8 py-4 transition-colors shadow-lg"
            >
              Get Directions & Contact
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#25D366] text-white font-medium text-xs tracking-wider uppercase px-8 py-4 hover:opacity-90 transition-opacity shadow-lg"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
