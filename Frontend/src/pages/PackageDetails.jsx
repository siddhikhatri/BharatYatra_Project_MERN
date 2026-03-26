import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Clock, Check, Star, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BookingModal from "/src/components/BoookingModal";
import { useAuth } from "/src/context/AuthContext";
import axios from "axios";
import EnquiryModal from "/src/components/EnquiryModal";

const FAQ_DATA = [
  {
    question: "What is the cancellation policy for this package?",
    answer:
      "You can cancel your booking up to 48 hours before the trip start date for a full refund. Cancellations made within 48 hours of departure are non-refundable. Please contact our support team to initiate a cancellation.",
  },
  {
    question: "Are flights included in the package price?",
    answer:
      "No, flights are not included unless explicitly mentioned in the 'What's Included' section. The package price covers ground transportation, accommodation, meals, and activities as specified in the itinerary.",
  },
  {
    question: "Can I customize the itinerary or add extra days?",
    answer:
      "Yes! We offer customization options for most packages. You can add extra days, upgrade accommodation, or include additional activities. Please use the 'Send Enquiry' button to discuss your custom requirements with our travel experts.",
  },
  {
    question: "Is travel insurance included?",
    answer:
      "Travel insurance is not included in the package price but is highly recommended. We can help you arrange comprehensive travel insurance that covers medical emergencies, trip cancellations, and lost luggage.",
  },
  {
    question: "What documents do I need to carry?",
    answer:
      "You will need a valid government-issued photo ID (Aadhaar, Passport, or Voter ID), your booking confirmation email, and any permits mentioned in the itinerary. International destinations require a valid passport and applicable visas.",
  },
  {
    question: "How do I make a payment?",
    answer:
      "We accept all major credit/debit cards, UPI, net banking, and EMI options. A 30% advance payment is required to confirm your booking, and the remaining amount is due 7 days before departure.",
  },
];

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <motion.div
      className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
      layout
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-7 py-5 text-left gap-4"
      >
        <span className="text-gray-900 font-semibold text-lg leading-snug">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center"
        >
          <ChevronDown size={18} className="text-blue-600" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-7 pb-6 text-gray-600 leading-relaxed text-base border-t border-gray-50 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PackageDetails() {
  const { id } = useParams(); //used for fetching package id in url.
  const navigate = useNavigate();
  const { isLoggedIn, openAuthModal, currentUser } = useAuth();
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);//packageEnquiry
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);//for image gallery
  const galleryRef = useRef(null);//for Image Gallery Scroll
  const [showBookingModal, setShowBookingModal] = useState(false);//for booking 
  const [packageData, setPackageData] = useState(null);

  //const [canReview, setCanReview] = useState(false);

  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [openFAQ, setOpenFAQ] = useState(null);

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
        reviews.reduce((sum, r) => sum + Number(r.rating), 0) /
        totalReviews
      ).toFixed(1)
      : 0;


  const ratingBreakdown = {
    5: reviews.filter(r => Number(r.rating) === 5).length,
    4: reviews.filter(r => Number(r.rating) === 4).length,
    3: reviews.filter(r => Number(r.rating) === 3).length,
    2: reviews.filter(r => Number(r.rating) === 2).length,
    1: reviews.filter(r => Number(r.rating) === 1).length,
  };

  const galleryImages =
    packageData?.images && packageData.images.length > 0
      ? packageData.images.map(
        (img) => `http://localhost:3000/Images/${img}`
      )
      : [`http://localhost:3000/Images/${packageData?.image}`];


  const scrollGallery = (direction) => {
    if (!galleryRef.current) return;

    const scrollAmount = 300;

    galleryRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  console.log("URL id:", id);

  //  FETCH PACKAGE
  useEffect(() => {
    axios
      .get(`http://localhost:3000/packages/${id}`)
      .then((res) => {
        console.log("Selected Package Fetched:", res.data);
        setPackageData(res.data);
      })
      .catch((err) => {
        console.log("Error Fetching Package Details:", err);
      });
  }, [id]);

  // useEffect(() => {
  //   if (!user) return;

  //   axios
  //     .get("http://localhost:3000/getBookings")
  //     .then((res) => {
  //       const booked = res.data.some(
  //         (b) => b.userEmail === user.email && b.packageId === id
  //       );
  //       setCanReview(booked);
  //     })
  //     .catch((err) => console.log(err));
  // }, [user, id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/getReviews/${id}`)
      .then((res) => {
        console.log("Reviews:", res.data);
        setReviews(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;

      if (e.key === "ArrowRight") {
        setSelectedImageIndex(
          (prev) => (prev + 1) % galleryImages.length
        );
      }

      if (e.key === "ArrowLeft") {
        setSelectedImageIndex(
          (prev) =>
            (prev - 1 + galleryImages.length) % galleryImages.length
        );
      }

      if (e.key === "Escape") {
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, galleryImages.length]);

  const submitReview = () => {
    if (!isLoggedIn) {
      alert("Please log in to add a review.");
      openAuthModal("signin");
      return;
    }

    // if (!canReview) {
    //   alert("You can only review this package after booking it.");
    //   return;
    // }

    if (!rating || !review) {
      alert("Please add rating and review");
      return;
    }

    axios
      .post("http://localhost:3000/addReview", {
        packageId: id,
        rating,
        review,
        userName: currentUser.name,
        userEmail: currentUser.email
      })
      .then((res) => {
        alert(res.data.message);
        setRating("");
        setReview("");

        axios
          .get(`http://localhost:3000/getReviews/${id}`)
          .then((res) => setReviews(Array.isArray(res.data) ? res.data : []));
      })
      .catch((err) => {
        console.log(err);
        alert("Error adding review");
      });
  };

  if (!packageData) {
    return (
      <div className="pt-40 text-center text-xl">
        Loading package...
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b sticky top-20 z-40 px-4 py-4 bg-white">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link to="/" className="text-blue-600 font-medium">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link to="/packages" className="text-blue-600 font-medium">
            Packages
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-medium">{packageData.name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gray-100 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-lg">
                        
            {/* MAIN Single IMAGE */}
            <div className=" w-full h-[400px] overflow-hidden">
              <img
                src={`http://localhost:3000/Images/${packageData.image}`}
                                
                alt={packageData.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            {/* Back Button */}
            <button
              onClick={() => navigate("/packages")}
              className="absolute top-6 left-6 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full z-10"
            >
              ← Back
            </button>

            {/* Bottom Content */}
            <div className="absolute bottom-10 left-10 text-white z-10">
              <div className="flex items-center gap-2 mb-3 text-sm">
                <MapPin size={16} /> {packageData.location}
              </div>

              <h1 className="text-5xl font-bold mb-4">
                {packageData.name}
              </h1>

              <div className="flex items-center gap-6 text-sm">

                <div className="flex items-center gap-2">

                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${star <= Math.round(averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>

                  <span>
                    {averageRating} ({totalReviews} reviews)
                  </span>

                </div>

                <span>
                  🕒 {packageData.days} Days / {packageData.nights} Nights
                </span>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-7xl mx-auto">

          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Photo Gallery</h2>
              <p className="text-gray-500 text-sm mt-1">Click any photo to view full screen</p>
            </div>
            {/* Nav arrows — top-right */}
            {/* <div className="flex gap-2">
              <button
                onClick={() => scrollGallery("left")}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scrollGallery("right")}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div> */}
          </div>

          {/* Featured image (left) + Thumbnail column (right) */}
          <div className="flex gap-4 h-[420px]">

            {/* Featured — first image, large */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedImageIndex(0)}
              className="relative w-[55%] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group shadow-md"
            >
              {/* <img
                src={galleryImages[0]}
                alt="featured"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              /> */}
              {galleryImages.length > 0 && (
                <img src={galleryImages[0]} alt="featured" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Featured
              </span>
              <span className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                View Photo
              </span>
            </motion.div>

            {/* Thumbnails — 2×2 grid of remaining 4 images */}
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
              {galleryImages.slice(1).map((img, index) => (
                <motion.div
                  key={index + 1}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedImageIndex(index + 1)}
                  className="relative rounded-xl overflow-hidden cursor-pointer group shadow-sm"
                >
                  <img
                    src={img}
                    alt={`gallery-${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition duration-300 flex items-end justify-start p-2">
                    <span className="opacity-0 group-hover:opacity-100 transition text-white text-xs font-medium">
                      Photo {index + 2}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-5">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className={`rounded-full transition-all duration-300 ${i === 0
                  ? "w-6 h-2 bg-blue-600"
                  : "w-2 h-2 bg-gray-300 hover:bg-blue-400"
                  }`}
              />
            ))}
          </div>

        </div>
      </section>


      {/* Main Content */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* About Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About This Package</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {packageData.description}
              </p>

              {/* Highlights */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Highlights</h3>
                <div className="flex flex-wrap gap-3">
                  {packageData.highlights.map((highlight, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-medium"
                    >
                      {highlight}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* Day-wise Itinerary */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Day-wise Itinerary</h2>

              <div className="space-y-8">
                {packageData?.itinerary?.length > 0 && (
                  <div className="space-y-8">
                    {packageData.itinerary.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-6"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {item.day}
                          </div>
                          {idx < packageData.itinerary.length - 1 && (
                            <div className="w-1 h-16 bg-blue-200 mx-auto mt-2"></div>
                          )}
                        </div>

                        <div className="flex-grow pb-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-blue-600 font-medium mb-4">
                            {item.subtitle}
                          </p>

                          <ul className="space-y-2">
                            {item.activities?.map((activity, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-3 text-gray-700"
                              >
                                <Check size={18} className="text-green-500 flex-shrink-0" />
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Included Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packageData.included.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <Check size={20} className="text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Excluded Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What's Excluded</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packageData.excluded.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-red-500 font-bold text-xl flex-shrink-0">✕</span>
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl sticky top-32 h-fit">
              {/* Price Section */}
              <div className="mb-8">
                <p className="text-gray-600 text-sm mb-2">Price per person</p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-blue-600">
                    ₹{packageData.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{packageData.originalPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-green-600 font-semibold text-sm">
                  Save ₹{(packageData.originalPrice - packageData.price).toLocaleString()}
                </p>
              </div>

              {/* Package Details */}
              <div className="space-y-5 mb-8 pb-8 border-b">
                {/* Duration */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Duration</p>
                    <p className="text-gray-900 font-bold">
                      {packageData.days} Days / {packageData.nights} Nights
                    </p>
                  </div>
                </div>

                {/* Best Season */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Best Season</p>
                    <p className="text-gray-900 font-bold">
                      {packageData.bestSeason?.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (isLoggedIn) {
                      setShowBookingModal(true);
                    } else {
                      openAuthModal("signin");
                    }
                  }}
                  className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all text-lg"
                >
                  Book Now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEnquiryModal(true)}
                  className="w-full border-2 border-blue-500 text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition-all"
                >
                  Send Enquiry
                </motion.button>
              </div>

              {/* Benefits */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <Check size={18} />
                  <span>Free cancellation up to 48 hours</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Check size={18} />
                  <span>Instant confirmation</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Ratings & Reviews Section */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">

            {/* Section Title */}
            <h2 className="text-4xl font-bold mb-8 text-gray-900">
              Ratings & Reviews
            </h2>

            {/* Average Rating + Breakdown */}
            <div className="flex flex-col md:flex-row items-start gap-10 mb-10">

              {/* Average Rating */}
              <div className="flex flex-col items-center md:items-start min-w-[160px]">
                <div className="text-6xl font-extrabold text-gray-900">{averageRating}</div>
                <div className="flex mt-2 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={26}
                      className={`${star <= Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-lg text-black">{totalReviews} Reviews</p>
              </div>

              {/* Rating Breakdown Bars */}
              <div className="flex-1 max-w-lg space-y-4">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = ratingBreakdown[star] || 0;
                  const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-4">
                      <span className="text-lg w-6">{star}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                        <motion.div
                          className="bg-yellow-400 h-6"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percentage}%` }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-lg w-8 text-right text-gray-700">{count}</span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Add a Review Form */}
            <div className="mb-10">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-black mb-4">Add a Review</h3>

                {/* Star Rating Input */}
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={28}
                      onClick={() => setRating(star)}
                      className={`cursor-pointer transition ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>

                {/* Review Textarea */}
                <textarea
                  placeholder="Write your experience..."
                  className="border w-full p-4 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                />

                <button
                  onClick={submitReview}
                  className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
                >
                  Submit Review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {Array.isArray(reviews) && reviews.length > 0 ? (
                reviews.map((rev, index) => (
                  <div key={index} className="border-b pb-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-black text-lg">{rev.userName}</p>
                      <p className="text-yellow-500 text-lg">{"⭐".repeat(rev.rating)}</p>
                    </div>
                    <p className="text-black text-lg">{rev.review}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-lg">No reviews yet. Be the first to review!</p>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <span className="inline-block bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
                  Got Questions?
                </span>
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                  Frequently Asked{" "}
                  <span className="text-blue-600">Questions</span>
                </h2>
              </div>
              <p className="text-gray-500 md:max-w-xs text-base leading-relaxed">
                Can't find the answer you're looking for? Our travel experts are just a message away.
              </p>
            </div>

            {/* FAQ Accordion Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
              {FAQ_DATA.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                >
                  <FAQItem
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFAQ === index}
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  />
                </motion.div>
              ))}
            </div>

            {/* CTA Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="text-white text-center md:text-left">
                <h3 className="text-2xl font-bold mb-1">Still have questions?</h3>
                <p className="text-blue-100 text-base">
                  Our travel experts are available 24/7 to help you plan your perfect trip.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowEnquiryModal(true)}
                  className="bg-white text-blue-600 font-bold px-7 py-3 rounded-xl hover:bg-blue-50 transition text-base shadow-md"
                >
                  Send Enquiry
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-blue-500 text-white font-bold px-7 py-3 rounded-xl hover:bg-blue-400 transition text-base border border-blue-400"
                >
                  📞 Call Us
                </motion.button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Image Preview Modal — animated lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[80]"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Counter badge */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
              {selectedImageIndex + 1} / {galleryImages.length}
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-5 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X size={20} />
            </button>

            {/* Left arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(
                  (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
                );
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition backdrop-blur-sm"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Main image */}
            <motion.img
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.22 }}
              src={galleryImages[selectedImageIndex]}
              alt="preview"
              className="max-h-[78vh] max-w-[80vw] rounded-2xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Right arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length);
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition backdrop-blur-sm"
            >
              <ChevronRight size={22} />
            </button>

            {/* Thumbnail strip at bottom */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-14 h-9 rounded-lg overflow-hidden transition-all duration-200 ${i === selectedImageIndex
                    ? "ring-2 ring-white scale-110"
                    : "opacity-50 hover:opacity-80"
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        packageData={packageData}
        onClose={() => setShowEnquiryModal(false)}
      />

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          packageData={packageData}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
}

