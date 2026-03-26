import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, Filter, X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import AuthModal from '/src/components/AuthModal'; // adjust path if needed
import { useAuth } from '../context/AuthContext';


export default function Packages() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser } = useAuth()
  const destinationParam = searchParams.get("destination");
  const themeFromURL = searchParams.get("theme"); //read theme from url[theme on home page]

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


  // Filter States
  const [filters, setFilters] = useState({
    priceRange: [12499, 80000],
    daysMin: 1,
    daysMax: 30,
    nightsMin: 1,
    nightsMax: 30,
    themes: [],
    bestSeason: '',
  });
  const [searchPackage, setSearchPackage] = useState("")

  // All Packages Data
  const [allPackages, setAllPackages] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3000/getPackages")
      .then((res) => {
        console.log("Packages fetched:", res.data);
        setAllPackages(res.data);
      })
      .catch((err) => {
        console.log("Error fetching packages:", err);
      });
  }, []);

  // Theme options for checkboxes
  const themeOptions = ['Adventure', 'Nature', 'Wildlife', 'Family', 'Spiritual', 'Heritage', 'Honeymoon'];

  const filteredPackages = useMemo(() => {
    return allPackages.filter((pkg) => {

      // Search filter
      if (searchPackage) {
        const query = searchPackage.toLowerCase();

        const matchesSearch =
          pkg.name?.toLowerCase().includes(query) ||
          pkg.location?.toLowerCase().includes(query) ||
          pkg.destination?.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      //  Destination filter
      if (destinationParam && pkg.destination?.toLowerCase() !== destinationParam.toLowerCase()) {
        return false;
      }

      //  Price filter
      if (pkg.price < filters.priceRange[0] || pkg.price > filters.priceRange[1]) {
        return false;
      }

      //  Theme filter
      if (filters.themes.length > 0) {
        const hasMatchingTheme = filters.themes.some((theme) =>
          pkg.themes.includes(theme)
        );
        if (!hasMatchingTheme) return false;
      }

      //  Season filter
      if (filters.season) {
        if (!pkg.bestSeason?.includes(filters.season)) {
          return false;
        }
      }

      return true;
    });
  }, [filters, destinationParam, allPackages, searchPackage]);


  // Handle theme checkbox change
  const handleThemeChange = (theme) => {
    setFilters((prev) => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter((t) => t !== theme)
        : [...prev.themes, theme],
    }));
  };

  // Handle season radio change
  const handleSeasonChange = (season) => {
    setFilters((prev) => ({
      ...prev,
      season: prev.season === season ? '' : season,
    }));
  };

  useEffect(() => {
    if (themeFromURL) {
      setFilters((prev) => ({
        ...prev,
        themes: [themeFromURL.charAt(0).toUpperCase() + themeFromURL.slice(1)]
      }));
    }
  }, [themeFromURL]);




  const resetFilters = () => {
    setFilters({
      priceRange: [12499, 80000],
      daysMin: 1,
      daysMax: 30,
      nightsMin: 1,
      nightsMax: 30,
      themes: [],
      season: '',
    });

    //  Clear URL parameters
    setSearchParams({});

    //Clear Search Bar
    setSearchPackage("");
  };

  const handleWishlist = async (pkg) => {
  if (!currentUser) {
    alert("Please login first");
    setShowAuthModal(true);
    return;
  }

  try {
    // 🔥 CALL BACKEND API
    const res = await axios.post("http://localhost:3000/wishlist/add", {
      userId: currentUser._id,
      packageId: pkg._id,
    });

    alert(res.data.message);

    // ✅ OPTIONAL: update localStorage (for fast UI)
    const existingWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    const alreadyExists = existingWishlist.find(
      (item) => item._id === pkg._id
    );

    if (!alreadyExists) {
      existingWishlist.push(pkg);
      localStorage.setItem("wishlist", JSON.stringify(existingWishlist));
    }

  } catch (err) {
    console.log("Wishlist add error", err);
  }
};

  // const handleWishlist = (pkg) => {

  //   if (!currentUser) {
  //     alert("Please login first");
  //     setShowAuthModal(true);
  //     return;
  //   }

  //   const existingWishlist =
  //     JSON.parse(localStorage.getItem("wishlist")) || [];

  //   const alreadyExists = existingWishlist.find(
  //     (item) =>
  //       item._id === pkg._id &&
  //       item.userEmail === currentUser.email
  //   );

  //   if (alreadyExists) {
  //     alert("Already in wishlist ❤️");
  //     return;
  //   }

  //   const newItem = {
  //     ...pkg,
  //     userEmail: currentUser.email,
  //   };

  //   existingWishlist.push(newItem);

  //   localStorage.setItem(
  //     "wishlist",
  //     JSON.stringify(existingWishlist)
  //   );

  //   alert("Added to wishlist ❤️");
  // };



  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      {/* Header */}
      <section className="bg-white py-16 px-4 border-b">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Explore Our <span className="text-blue-500">Packages</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Discover handcrafted travel experiences across India's most beautiful destinations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Filters */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl p-6 sticky top-32 shadow-lg">
                {/* Filters Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    Reset
                  </button>
                </div>

                {/* Search Filter */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search Packages..."
                    value={searchPackage}
                    onChange={(e) => setSearchPackage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Price Range Filter */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-900 mb-4">
                    Budget Range
                  </label>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="range"
                        min="12499"
                        max="80000"
                        step="1000"
                        value={filters.priceRange[0]}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            priceRange: [parseInt(e.target.value), filters.priceRange[1]],
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-xs text-gray-600 mt-2">
                        <span>₹{filters.priceRange[0].toLocaleString()}</span>
                        <span>₹{filters.priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>



                {/* Theme Checkboxes */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-900 mb-4">
                    Travel Theme
                  </label>
                  <div className="space-y-3">
                    {themeOptions.map((theme) => (
                      <label
                        key={theme}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={filters.themes.includes(theme)}
                          onChange={() => handleThemeChange(theme)}
                          className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer accent-blue-500"
                        />
                        <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                          {theme}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Season Radio Buttons */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-900 mb-4">
                    Season
                  </label>
                  <div className="space-y-3">
                    {['Winter', 'Summer', 'Monsoon'].map((season) => (
                      <label
                        key={season}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="season"
                          value={season}
                          checked={filters.season === season}
                          onChange={() => handleSeasonChange(season)}
                          className="w-5 h-5 cursor-pointer accent-blue-500"
                        />
                        <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                          {season}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Packages Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              {/* Results Count */}
              <p className="text-black font-semibold mb-6">
                {filteredPackages.length} Packages Found
              </p>

              {filteredPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg, idx) => (
                    <motion.div
                      key={pkg._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -10 }}
                      className="group"
                    >
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                        {/* Image Container */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={`http://localhost:3000/Images/${pkg.image}`}
                            alt={pkg.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />

                          {/* Discount Badge */}
                          {/* <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                            {pkg.discount}% OFF
                          </div> */}

                          {/* Rating Badge */}
                          
                          {/* <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-sm text-gray-900">
                              {pkg.rating ? pkg.rating.toFixed(1) : "0.0"} ({pkg.reviews || 0})
                            </span>
                          </div> */}

                          {/* Wishlist Icon */}
                          <button
                            onClick={() => handleWishlist(pkg)}
                            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-all"
                          >
                            <Heart size={18} className="text-red-500" />
                          </button>

                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {/* Location & Duration */}
                          <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin size={16} className="text-blue-500" />
                              <span>{pkg.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={16} className="text-blue-500" />
                              <span>{pkg.days}D / {pkg.nights}N</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                            {pkg.name}
                          </h3>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {pkg.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Price */}
                          <div className="mb-4">
                            <p className="text-xs text-gray-600 mb-1">Starting from</p>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-blue-600">
                                ₹{pkg.price.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                ₹{pkg.originalPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Buttons */}
                          <div>
                            <Link to={`/packages/${pkg.id}`}>

                            </Link>
                            <Link to={`/packages/${pkg._id}`}>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full flex-1 bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition-all justify-center"
                              >
                                View Details
                              </motion.button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl">
                  <p className="text-gray-600 text-lg">
                    No packages found matching your filters. Please try adjusting your filters.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* AuthModal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

