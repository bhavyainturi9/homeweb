import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, User, Heart, Menu, X, ChevronRight } from 'lucide-react';

const ZaraStyleWebsite = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  

  const heroImages = [
    {
      url: 'https://i.pinimg.com/1200x/bd/36/de/bd36dec634e8edbf9b5bcb3fe3cef03b.jpg',
      title: 'NEW SEASON',
      subtitle: 'Discover the latest collection'
    },
    {
      url: 'https://i.pinimg.com/736x/dd/94/83/dd94837e110260a860050c6a75495526.jpg',
      title: 'FALL COLLECTION',
      subtitle: 'Timeless elegance'
    },
    {
      url: 'https://i.pinimg.com/736x/ab/78/b4/ab78b4a3758306809895091a07302812.jpg',
      title: 'ESSENTIALS',
      subtitle: 'Household staples'
    }
  ];

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  }, 4000);

  return () => clearInterval(interval);
}, [heroImages.length]);

  const collections = [
    {
      image: 'https://i.pinimg.com/736x/ef/d1/e4/efd1e4bbf1a8a3b22d62585d23bf3a13.jpg',
      title: 'THE NEW',
      subtitle: 'AVANT HOME COLLECTION',
      label: 'NEW SEASON'
    },
    {
      image: 'https://i.pinimg.com/1200x/5b/9e/7e/5b9e7ee02d9b962dde2c3954eac00282.jpg',
      title: 'AVANT ORIGINS',
      subtitle: '+ INFO',
      label: ''
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold tracking-widest">AVANT</h1>
            </div>

            <nav className="hidden lg:flex space-x-8">
              <a href="/" className="text-sm tracking-wide hover:text-gray-600 transition">DUVET</a>
              <a href="/" className="text-sm tracking-wide hover:text-gray-600 transition">BEDSHEETS</a>
              <a href="/" className="text-sm tracking-wide hover:text-gray-600 transition">TABLES</a>
              <a href="/" className="text-sm tracking-wide hover:text-gray-600 transition">COLLECTION</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <Search size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <User size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <Heart size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition relative">
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-4 space-y-3">
              <a href="/" className="block text-sm tracking-wide py-2">ESSENTIALS</a>
              <a href="/" className="block text-sm tracking-wide py-2">BEDSHEETS</a>
              <a href="/" className="block text-sm tracking-wide py-2">DUVET</a>
              <a href="/" className="block text-sm tracking-wide py-2">COLLECTION</a>
            </nav>
          </div>
        )}
      </header>

      <section className="relative h-screen overflow-hidden">
        <div 
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroImages.map((slide, index) => (
            <div key={index} className="min-w-full h-full relative">
              <img 
                src={slide.url}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-5xl md:text-7xl font-light tracking-wider mb-4">{slide.title}</h2>
                  <p className="text-lg md:text-xl mb-8 tracking-wide">{slide.subtitle}</p>
                  <button className="bg-white text-black px-8 py-3 text-sm tracking-widest hover:bg-gray-100 transition">
                    SHOP NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? 'bg-white w-8' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection, index) => (
            <div key={index} className="relative group cursor-pointer overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-8 left-8 text-white">
                {collection.label && (
                  <p className="text-xs tracking-widest mb-2">{collection.label}</p>
                )}
                <h3 className="text-3xl font-light tracking-wide mb-1">{collection.title}</h3>
                <p className="text-sm tracking-wider">{collection.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">JOIN LIFE</h3>
          <p className="text-lg mb-8 text-gray-300">
            Garments made with care for the planet and the people who make them
          </p>
          <button className="border border-white px-8 py-3 text-sm tracking-widest hover:bg-white hover:text-black transition">
            DISCOVER MORE
          </button>
        </div>
      </section>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-semibold mb-4 tracking-wide">HELP</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/" className="hover:underline">Customer Service</a></li>
                <li><a href="/" className="hover:underline">Track Order</a></li>
                <li><a href="/" className="hover:underline">Returns</a></li>
                <li><a href="/" className="hover:underline">Size Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 tracking-wide">COMPANY</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/" className="hover:underline">About Us</a></li>
                <li><a href="/" className="hover:underline">Careers</a></li>
                <li><a href="/" className="hover:underline">Press</a></li>
                <li><a href="/" className="hover:underline">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 tracking-wide">FOLLOW</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/" className="hover:underline">Instagram</a></li>
                <li><a href="/" className="hover:underline">Facebook</a></li>
                <li><a href="/" className="hover:underline">Twitter</a></li>
                <li><a href="/" className="hover:underline">Pinterest</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 tracking-wide">NEWSLETTER</h4>
              <p className="text-sm text-gray-600 mb-4">Subscribe to receive updates and exclusive offers</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email"
                  className="flex-1 px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
                />
                <button className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>© 2026 AVANT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ZaraStyleWebsite;