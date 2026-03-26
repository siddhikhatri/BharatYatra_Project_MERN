import { motion } from 'framer-motion';
import { Search, Play, Star, MapPin, Users, TrendingUp, ChevronRight, ChevronLeft, Calendar, Waves, Mountain, Palmtree, Landmark } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ThemesSection from '/src/components/ThemesSection';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import TestimonialsSection from '/src/components/TestimonialsSection';


// const carouselDestinations = [
//   { id: 1, name: "Kashmir", image: "/kashmir.jpeg", icon: Mountain },
//   { id: 2, name: "Goa", image: "/goa.jpeg", icon: Palmtree },
//   { id: 3, name: "Rajasthan", image: "/rajasthan.jpeg", icon: Landmark },
// ];




export default function Home() {
  // const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const stats = [
    { number: '500+', label: 'Happy Travelers', icon: Users },
    { number: '50+', label: 'Destinations', icon: MapPin },
    { number: '100+', label: 'Tour Packages', icon: TrendingUp },
    { number: '4.9', label: 'Customer Rating', icon: Star },
  ];

  //for about us page scroll on home page
  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash);

      if (section) {
        section.scrollIntoView({ behavior: "smooth" });

        // Remove hash from URL after scrolling
        setTimeout(() => {
          window.history.replaceState(null, null, window.location.pathname);
        }, 500);
      }
    } else {
      // If no hash → always go to top
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location]);



  // Carousel Destinations Data
  const carouselDestinations = [
    { id: 1, name: "Gujarat", image: "/Gujarats.jpeg", icon: Landmark },
    { id: 2, name: "Kashmir", image: "/kashmir.jpeg", icon: Mountain },
    { id: 3, name: "Goa", image: "/goa.jpeg", icon: Palmtree },
    { id: 4, name: "Kerala", image: "/kerala.jpeg", icon: Waves },
    { id: 5, name: "Rajasthan", image: "/rajasthsn.jpeg", icon: Landmark },
    { id: 6, name: "Sikkim", image: "/sikkim.jpeg", icon: Mountain },
  ];


  const infiniteDestinations = [
    ...carouselDestinations,
    ...carouselDestinations,
    ...carouselDestinations,
  ];




  // Get visible carousel items (4 items at a time)
  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < 4; i++) {
      items.push(carouselDestinations[(currentIndex + i) % carouselDestinations.length]);
    }
    return items;
  };


  const scroll = (direction) => {
    if (!carouselRef.current) return;

    const card = carouselRef.current.querySelector(".group");
    const cardWidth = card.offsetWidth + 24; // card + gap

    carouselRef.current.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };



  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const handleScroll = () => {
      const singleWidth = el.scrollWidth / 3;

      // If reached right end → jump to middle
      if (el.scrollLeft >= singleWidth * 2) {
        el.scrollLeft = singleWidth;
      }

      // If reached left end → jump to middle
      if (el.scrollLeft <= 0) {
        el.scrollLeft = singleWidth;
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    // Start from middle copy
    el.scrollLeft = el.scrollWidth / 3;
  }, []);


  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      scroll("next");
    }, 2500);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };








  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative w-full h-screen bg-cover bg-center pt-20 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop)',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-blue-500 bg-opacity-20 backdrop-blur-md border border-blue-400 rounded-full px-6 py-2 mb-8"
          >
            <span className="text-2xl">✨</span>
            <span className="text-white font-semibold">Discover Incredible India</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-4 text-white"
          >
            Your Journey to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
              Amazing India
            </span>
            <br />
            Starts Here
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-2xl text-gray-200 mb-8"
          >
            Explore breathtaking destinations, cultural wonders, and unforgettable experiences
            across the diverse landscapes of India.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            <Link to="/packages">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 transition-all"
              >
                <Search size={20} /> Explore Packages
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: '#0EA5E9' }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 transition-all hover:bg-blue-500 hover:bg-opacity-10"
            >
              <Play size={20} /> Watch Video
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <Icon size={32} className="text-blue-400" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white">{stat.number}</h3>
                  <p className="text-gray-300 text-sm">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>




      {/* Top Destinations Carousel Section */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex justify-between items-start mb-12"
          >
            <div>
              <p className="text-blue-500 font-semibold text-lg mb-2">POPULAR CHOICES</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Top Destinations
              </h2>
              <p className="text-gray-600 text-lg">
                Explore our most loved travel packages, handpicked by thousands of happy travelers.
              </p>
            </div>
            {/* Carousel Controls */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll('prev')}
                className="w-12 h-12 bg-white border-2 border-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white text-gray-900 rounded-full flex items-center justify-center font-bold transition-all shadow-lg"
              >
                <ChevronLeft size={24} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll('next')}
                className="w-12 h-12 bg-white border-2 border-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white text-gray-900 rounded-full flex items-center justify-center font-bold transition-all shadow-lg"
              >
                <ChevronRight size={24} />
              </motion.button>
            </div>
          </motion.div>

          {/* Carousel Grid */}
          <div ref={carouselRef}
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide} className="flex gap-6 overflow-x-hidden scroll-smooth"
          >

            {/* infiniteDestinationCode */}
            {infiniteDestinations.map((dest, idx) => {
              const Icon = dest.icon;
              return (
                <motion.div
                  key={`${dest.id}-${idx}`}
                  whileHover={{ y: -10 }}
                  className="group min-w-[280px] md:min-w-[320px] lg:min-w-[300px] 
                 h-[380px] relative rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                  onClick={() => navigate(`/packages?destination=${dest.name}`)}
                >
                  {/* Image */}
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover 
                   group-hover:scale-110 
                   transition-transform duration-700"
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />

                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">

                    {/* Icon */}
                    <Icon
                      size={36}
                      className="mb-4 drop-shadow-lg 
                     group-hover:scale-110 
                     transition-transform duration-300"
                    />

                    {/* Destination Name */}
                    <h3 className="text-3xl font-bold tracking-wide drop-shadow-lg text-center">
                      {dest.name}
                    </h3>
                  </div>
                </motion.div>
              );
            })}


          </div>
        </div>
      </section>

      {/* Travel by Theme */}
      <ThemesSection />




      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-600 px-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Start exploring amazing destinations today and create memories that last a lifetime.
            </p>
            <Link to="/packages">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all"
              >
                Explore All Packages
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* <br/><br/><br/> */}

      {/* About Section*/}

      <AboutUs />

      {/* Testimonials Section*/}

      <TestimonialsSection />

      {/* Contact Section*/}

      <ContactUs />

      {/* <br/><br/><br/> */}
    </div>
  );
}




{/* Why Choose Us */ }
// {infiniteDestinations.map((dest, idx) => (

//               <motion.div
//                 key={`${dest.id}-${idx}`}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//                 whileHover={{ y: -10 }}
//                 className="group min-w-[280px] md:min-w-[320px] lg:min-w-[300px]"
//               >
//                 <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
//                   {/* Image Container */}
//                   <div className="relative h-48 overflow-hidden">
//                     <img
//                       src={dest.image}
//                       alt={dest.name}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                     />

//                     {/* Discount Badge */}
//                     <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
//                       {dest.discount}% OFF
//                     </div>

//                     {/* Rating Badge */}
//                     <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
//                       <Star size={16} className="fill-yellow-400 text-yellow-400" />
//                       <span className="font-bold text-sm text-gray-900">
//                         {dest.rating} ({dest.reviews})
//                       </span>
//                     </div>
//                   </div>

//                   {/* Content */}
//                   <div className="p-6">
//                     {/* Location & Duration */}
//                     <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
//                       <div className="flex items-center gap-1">
//                         <MapPin size={16} className="text-blue-500" />
//                         <span>{dest.location}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Calendar size={16} className="text-blue-500" />
//                         <span>{dest.days}D / {dest.nights}N</span>
//                       </div>
//                     </div>

//                     {/* Title */}
//                     <h3 className="text-xl font-bold text-gray-900 mb-3">{dest.name}</h3>

//                     {/* Tags */}
//                     <div className="flex flex-wrap gap-2 mb-4">
//                       {dest.tags.map((tag) => (
//                         <span
//                           key={tag}
//                           className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>

//                     {/* Price */}
//                     <div className="mb-4">
//                       <p className="text-xs text-gray-600 mb-1">Starting from</p>
//                       <div className="flex items-center gap-2">
//                         <span className="text-2xl font-bold text-blue-600">
//                           ₹{dest.price.toLocaleString()}
//                         </span>
//                         <span className="text-sm text-gray-400 line-through">
//                           ₹{dest.originalPrice.toLocaleString()}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Buttons */}
//                     <div className="flex gap-3">
//                       <Link to="/packages">
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="flex-1 border-2 border-blue-500 text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-50 transition-all"
//                       >
//                         Details
//                       </motion.button>
//                       </Link>
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="flex-1 bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition-all"
//                       >
//                         Book Now
//                       </motion.button>

//                     </div>
//                   </div>
//                 </div>
//               </motion.div>





//             ))}







{/* <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-500">Bharat Yatra</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Curated Experiences',
                description: 'Handpicked tours designed for unforgettable memories',
              },
              {
                icon: '💰',
                title: 'Best Prices',
                description: 'Competitive pricing with best value for money',
              },
              {
                icon: '🤝',
                title: '24/7 Support',
                description: 'Dedicated customer support throughout your journey',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

