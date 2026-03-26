import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, ChevronDown, MapPin, User, LogIn, UserPlus, KeyRound, HelpCircle, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import { useAuth } from "../context/AuthContext";





// import Home from '/src/pages/Home';

const destinations = [
  { name: "Goa", path: "/packages?destination=goa" },
  { name: "Gujarat", path: "/packages?destination=gujarat" },
  { name: "Kashmir", path: "/packages?destination=kashmir" },
  { name: "Sikkim", path: "/packages?destination=sikkim" },
  { name: "Kerala", path: "/packages?destination=kerala" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin');
  const [profileOpen, setProfileOpen] = useState(false);
  const [showDestinations, setShowDestinations] = useState(false);

  const profileRef = useRef(null);
  const destinationRef = useRef(null);

  const { logout, isLoggedIn , currentUser} = useAuth();



  // const navigate = useNavigate();



  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close destination dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (destinationRef.current && !destinationRef.current.contains(e.target)) {
        setShowDestinations(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = isScrolled
    ? 'text-black '
    : 'text-white ';

  const handleAuthClick = (tab) => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
    setProfileOpen(false);
  };

  // Handle My Bookings Click - Validate if logged in
  const handleMyBookingsClick = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      // Show Sign In modal if not logged in
      handleAuthClick('signin');
      return;
    }



    // Navigate to My Bookings if logged in
    navigate('/bookings');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center font-bold text-2xl text-white">
                ✈
              </div>
              <div><Link to='/'>
                <span className=" text-black font-bold text-xl ">Bharat</span>
                <span className="text-blue-600 font-bold text-xl"> Yatra</span>
              </Link></div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="font-medium transition-colors">
                Home
              </Link>
              <Link to="/packages" className="font-medium transition-colors">
                Packages
              </Link>

              {/* Destinations Dropdown */}
              <div className="relative" ref={destinationRef}>
                <button
                  onClick={() => setShowDestinations(!showDestinations)}
                  className="text-black font-medium transition-colors flex items-center gap-1"
                >
                  Destination
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showDestinations ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {showDestinations && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border z-50"
                    >
                      {destinations.map((dest) => (
                        <Link
                          key={dest.name}
                          to={dest.path}
                          onClick={() => setShowDestinations(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 transition"
                        >
                          <MapPin className="w-4 h-4 text-blue-500" />
                          {dest.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/about" className="text-black font-medium">
                About Us
              </Link>
              <Link to="/contact" className="text-black font-medium">
                Contact Us
              </Link>
              {/* <Link to="/contact" className="text-black font-medium">
                My Bookings
              </Link> */}
              <button onClick={handleMyBookingsClick} className="text-black font-medium">
                My Bookings
              </button>




            </div>

            {/* Auth Buttons */}

            {/* Profile Icon (both logged in & not logged in) */}
            <div className="relative" ref={profileRef}>
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center bg-black`}
              >
                <User className="w-5 h-5 text-white" />
              </motion.button> */}

              {/* <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => setProfileOpen(!profileOpen)}
  className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center bg-black  text-white`}
>
  {!isLoggedIn ? (
    <User className="w-5 h-5" />
  ) : (
    <>
      <span className="text-sm font-medium">
        Hello, {currentUser?.name?.split(" ")[0]}
      </span>
      <ChevronDown
        className={`w-4 h-4 transition-transform ${
          profileOpen ? "rotate-180" : ""
        }`}
      />
    </>
  )}
</motion.button> */}

<motion.div className="relative">
  {/* 🔓 NOT LOGGED IN */}
  {!isLoggedIn ? (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setProfileOpen(!profileOpen)}
      className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center bg-black"
    >
      <User className="w-5 h-5 text-white" />
    </motion.button>
  ) : (
    /* 🔐 LOGGED IN */
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setProfileOpen(!profileOpen)}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-500 via-blue-400 to-blue-500 text-white shadow-lg hover:shadow-2xl transition-all duration-300"


    >
      <span className="text-sm font-medium">
        Hello, {currentUser?.name?.split(" ")[0]}
      </span>

      <ChevronDown
        className={`w-4 h-4 transition-transform ${
          profileOpen ? "rotate-180" : ""
        }`}
      />
    </motion.button>
  )}

  {/* Dropdown (Same for both) */}
  {profileOpen && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg"
    >
      {/* Your existing dropdown options */}
    </motion.div>
  )}
</motion.div>



              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border z-50"
                  >
                    {!isLoggedIn ? (
                      <>
                        <button
                          onClick={() => handleAuthClick('signin')}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 w-full text-left rounded-t-lg transition"
                        >
                          <LogIn className="w-4 h-4" />
                          Sign In
                        </button>

                        <button
                          onClick={() => handleAuthClick('signup')}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 w-full text-left rounded-b-lg transition"
                        >
                          <UserPlus className="w-4 h-4" />
                          Sign Up
                        </button>
                      </>
                    ) : (
                      <>

                        <button
                          onClick={() => navigate('/dashboard')}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 w-full text-left transition"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </button>

                        {/* <button
                          onClick={() => handleAuthClick('change')}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 w-full text-left transition"
                        >
                          <KeyRound className="w-4 h-4" />
                          Change Password
                        </button>

                        <button
                          onClick={() => handleAuthClick('forgot')}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 w-full text-left transition"
                        >
                          <HelpCircle className="w-4 h-4" />
                          Forgot Password
                        </button> */}

                        <button
                          onClick={() => navigate('/editprofile')}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 w-full text-left transition"
                        >
                          <User className="w-4 h-4" />
                          Edit Profile
                        </button>

                        <button
                          onClick={() => {
                            logout(); // from AuthContext
                            setProfileOpen(false);
                            navigate('/');
                          }}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 w-full text-left rounded-b-lg transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={`md:hidden ${isScrolled ? 'text-black' : 'text-black'}`}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="md:hidden bg-white shadow-lg py-4"
            >
              <Link to="/" className="block px-4 py-2 text-black hover:text-blue-600">
                Home
              </Link>
              <Link to="/packages" className="block px-4 py-2 text-black hover:text-blue-600">
                Packages
              </Link>
              <Link to="/about" className="block px-4 py-2 text-black hover:text-blue-600">
                About Us
              </Link>
              <Link to="/contact" className="block px-4 py-2 text-black hover:text-blue-600">
                Contact Us
              </Link>
              <button
                onClick={handleMyBookingsClick}
                className="block w-full text-left px-4 py-2 text-black hover:text-blue-600"
              >
                My Bookings
              </button>
              {!isLoggedIn && (
                <>
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="w-full text-left px-4 py-2 text-black hover:text-blue-600"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="w-full text-left px-4 py-2 text-black hover:text-blue-600"
                  >
                    Sign Up
                  </button>
                </>
              )}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              )}
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
}


