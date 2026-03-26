import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Destinations() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const destinations = [
    {
      id: 1,
      name: 'Kashmir Paradise Tour',
      location: 'Kashmir',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=350&fit=crop',
      days: 6,
      nights: 5,
      rating: 4.9,
      reviews: 324,
      tags: ['Nature', 'Honeymoon', 'Family'],
      originalPrice: 35999,
      price: 28999,
      discount: 19,
    },
    {
      id: 2,
      name: 'Goa',
      location: 'Goa',
      image: '/goa.jpeg',
      days: 4,
      nights: 3,
      rating: 4.7,
      reviews: 512,
      tags: ['Adventure', 'Honeymoon', 'Family'],
      originalPrice: 19999,
      price: 15999,
      discount: 20,
      destination : 'goa',
    },
    {
      id: 3,
      name: 'Kerala Backwater Magic',
      location: 'Kerala',
      image: 'https://images.unsplash.com/photo-1537909352847-f1cea10b1a5b?w=500&h=350&fit=crop',
      days: 5,
      nights: 4,
      rating: 4.8,
      reviews: 428,
      tags: ['Nature', 'Cultural', 'Honeymoon'],
      originalPrice: 29999,
      price: 24999,
      discount: 17,
    },
    {
      id: 4,
      name: 'Sikkim Himalayan Heights',
      location: 'Sikkim',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=350&fit=crop',
      days: 7,
      nights: 6,
      rating: 4.9,
      reviews: 186,
      tags: ['Adventure', 'Nature', 'Spiritual'],
      originalPrice: 39999,
      price: 32999,
      discount: 18,
    },
    {
      id: 5,
      name: 'Rajasthan Royal Tour',
      location: 'Rajasthan',
      image: 'https://images.unsplash.com/photo-1567946154212-d74db8f17b49?w=500&h=350&fit=crop',
      days: 5,
      nights: 4,
      rating: 4.8,
      reviews: 395,
      tags: ['Cultural', 'Heritage', 'Honeymoon'],
      originalPrice: 28999,
      price: 23999,
      discount: 17,
    },
  ];

  const scroll = (direction) => {
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % destinations.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
    }
  };

  const visibleDestinations = [
    destinations[currentIndex],
    destinations[(currentIndex + 1) % destinations.length],
    destinations[(currentIndex + 2) % destinations.length],
    destinations[(currentIndex + 3) % destinations.length],
  ];

  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      {/* Header */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <p className="text-primary font-semibold text-lg mb-4">POPULAR CHOICES</p>
            <h2 className="text-5xl font-bold text-dark mb-4">
              Top Destinations
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our most loved travel packages, handpicked by thousands of happy travelers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Carousel */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Carousel Grid */}
          <div
            ref={carouselRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {visibleDestinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full font-bold text-sm">
                      {dest.discount}% OFF
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-sm text-dark">
                        {dest.rating} ({dest.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Location & Duration */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} className="text-primary" />
                        <span>{dest.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-primary" />
                        <span>{dest.days}D / {dest.nights}N</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-dark mb-3">{dest.name}</h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dest.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-blue-100 text-primary px-3 py-1 rounded-full text-xs font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Starting from</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">
                            ₹{dest.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{dest.originalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 border-2 border-primary text-primary font-bold py-2 rounded-lg hover:bg-blue-50 transition-all"
                      >
                        Details
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-secondary text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition-all"
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Carousel Controls */}
          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('prev')}
              className="w-12 h-12 bg-gray-200 hover:bg-primary hover:text-white text-dark rounded-full flex items-center justify-center font-bold transition-all"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('next')}
              className="w-12 h-12 bg-gray-200 hover:bg-primary hover:text-white text-dark rounded-full flex items-center justify-center font-bold transition-all"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}