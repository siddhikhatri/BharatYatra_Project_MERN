import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plane, Heart, Trash2 } from "lucide-react";
import axios from 'axios';
import AuthModal from "../components/AuthModal";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, token, isLoggedIn, authModal, openAuthModal, closeAuthModal } = useAuth();

  const [recentBookings, setRecentBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [upcomingTrip, setUpcomingTrip] = useState(null);

  //  Check JWT on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isLoggedIn || !token) {
      openAuthModal("signin");
      navigate("/");
      return;
    }
  }, [isLoggedIn, token, navigate, openAuthModal]);

  // Fetch dashboard data
  useEffect(() => {
    if (!currentUser) return;

    axios.get(`http://localhost:3000/wishlist/${currentUser._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setWishlist(res.data);
        localStorage.setItem("wishlist", JSON.stringify(res.data));
      })
      .catch(err => console.log("Wishlist error", err));

    axios.get('http://localhost:3000/getBookings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const userBookings = res.data.data.filter(
          booking => booking.userEmail === currentUser.email
        );

        setRecentBookings(userBookings);

        if (userBookings.length > 0) {
          setUpcomingTrip(userBookings[0]);
        }
      })
      .catch(err => console.log("Error fetching bookings", err));
  }, [currentUser, token]);

  //  Remove from wishlist
  const removeFromWishlist = async (packageId) => {
    try {
      await axios.delete("http://localhost:3000/wishlist/remove", {
        data: {
          userId: currentUser._id,
          packageId,
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      const updated = wishlist.filter(item => item.packageId._id !== packageId);
      setWishlist(updated);
      localStorage.setItem("wishlist", JSON.stringify(updated));
    } catch (err) {
      console.log("Remove error", err);
    }
  };


  // user is logged in → render full dashboard
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="p-8 bg-gray-50 flex-1">
          <h1 className="text-3xl font-bold mb-6">
            Welcome, {currentUser?.name}
          </h1>

          {/* Top Cards */}
          <div className="grid grid-cols-3 gap-6">
            {/* Upcoming Trip */}
            {/* Upcoming Trip */}
            <div className="bg-pink-100 shadow-lg rounded-2xl p-5">
              <h2 className="font-semibold text-lg mb-4">Upcoming Trip</h2>

              {upcomingTrip ? (
                <>
                  <img
                    src={`http://localhost:3000/Images/${upcomingTrip.image}`}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />

                  <h3 className="font-semibold">{upcomingTrip.packageName}</h3>

                  <div className="text-m text-black mt-3 space-y-1">
                    <p>📅 {new Date(upcomingTrip.travelDate).toLocaleDateString()}</p>
                    <p>👥 {upcomingTrip.adults} Adults</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No Upcoming Trips</p>
              )}
            </div>


            {/* My Bookings */}
            <div className="bg-white shadow-lg rounded-2xl p-5 flex flex-col">
              <h2 className="font-semibold text-lg mb-4">My Bookings</h2>
              {recentBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-10">
                  <p className="text-black mb-4">No Bookings Yet</p>
                  <Link
                    to="/packages"
                    className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition"
                  >
                    <Plane size={18} />
                    Explore Packages
                  </Link>
                </div>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking._id} className="flex gap-3 mb-4 ">
                    <img
                      src={`http://localhost:3000/Images/${booking.image}`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">{booking.packageName}</p>
                      <p className="text-m text-black">Recently Booked</p>
                      <button className="text-blue-600 text-m">Leave Review</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Wishlist */}
            <div className="bg-white rounded-2xl p-5 shadow-lg flex flex-col">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Heart className="text-red-500" size={18} />
                Wishlist
              </h2>
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-10">
                  <p className="text-black mb-4">No Items In Wishlist</p>
                  <Link
                    to="/packages"
                    className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition"
                  >
                    <Plane size={18} />
                    Explore Packages
                  </Link>
                </div>
              ) : (
                wishlist?.map((item) => (
                  <div key={item._id} className="flex gap-3 mb-4">
                    <img
                      src={`http://localhost:3000/Images/${item.packageId?.image}`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {item.packageId?.name}
                      </p>
                      <p className="text-xs text-gray-500">Saved package</p>
                    </div>
                    <button
                      onClick={() => {
                        if (item.packageId?._id) {
                          removeFromWishlist(item.packageId._id);
                        } else {
                          console.log("Package ID missing");
                        }
                      }}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Plane, Heart, Trash2, Calendar, MapPin, ChevronRight, FileText, Users } from "lucide-react";
// import axios from 'axios';
// import AuthModal from "../components/AuthModal";
// import DashboardSidebar from "../components/dashboard/DashboardSidebar";
// import DashboardHeader from "../components/dashboard/DashboardHeader";
// import { useAuth } from "../context/AuthContext";
// import { motion } from "framer-motion";

// const fmtDate = (d) =>
//   d
//     ? new Date(d).toLocaleDateString("en-IN", {
//       day: "numeric", month: "short", year: "numeric",
//     })
//     : "—";

// const STATUS_STYLES = {
//   Paid: "bg-green-100 text-green-700",
//   Confirmed: "bg-green-100 text-green-700",
//   Pending: "bg-amber-100 text-amber-700",
//   Cancelled: "bg-red-100   text-red-700",
// };

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const { currentUser, token, isLoggedIn, authModal, openAuthModal, closeAuthModal } = useAuth();

//   const [recentBookings, setRecentBookings] = useState([]);
//   const [wishlist, setWishlist] = useState([]);
//   const [upcomingTrip, setUpcomingTrip] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // redirect if not logged in
//   useEffect(() => {
//     window.scrollTo(0, 0);
//     if (!isLoggedIn || !token) { openAuthModal("signin"); navigate("/"); return; }
//   }, [isLoggedIn, token]);

//   // fetch data
//   useEffect(() => {
//     if (!currentUser) return;

//     // wishlist
//     axios.get(`http://localhost:3000/wishlist/${currentUser._id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(res => {
//         setWishlist(res.data);
//         localStorage.setItem("wishlist", JSON.stringify(res.data));
//       })
//       .catch(err => console.log("Wishlist error", err));

//     // bookings
//     axios.get("http://localhost:3000/getBookings", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(res => {
//         const mine = (res.data.data || []).filter(
//           b => b.userEmail === currentUser.email
//         );
//         setRecentBookings(mine);

//         // upcoming = nearest future departure
//         const upcoming = mine
//           .filter(b => b.departureDate && new Date(b.departureDate) >= new Date())
//           .sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));
//         setUpcomingTrip(upcoming[0] || mine[0] || null);
//       })
//       .catch(err => console.log("Bookings error", err))
//       .finally(() => setLoading(false));
//   }, [currentUser, token]);

//   const removeFromWishlist = async (packageId) => {
//     try {
//       await axios.delete("http://localhost:3000/wishlist/remove", {
//         data: { userId: currentUser._id, packageId },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const updated = wishlist.filter(item => item.packageId._id !== packageId);
//       setWishlist(updated);
//       localStorage.setItem("wishlist", JSON.stringify(updated));
//     } catch (err) {
//       console.log("Remove error", err);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <DashboardSidebar />
//       <div className="flex-1 flex flex-col">
//         <DashboardHeader />

//         <div className="p-8 flex-1">
//           <h1 className="text-3xl font-bold mb-6 text-gray-900">
//             Welcome back, {currentUser?.name} 👋
//           </h1>

//           {/* ── Top Cards ── */}
//           <div className="grid grid-cols-3 gap-6 mb-6">

//             {/* ── Upcoming Trip ── */}
//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="font-bold text-gray-900">Upcoming Trip</h2>
//                 {upcomingTrip && (
//                   <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[upcomingTrip.status] || "bg-gray-100 text-gray-600"}`}>
//                     {upcomingTrip.status}
//                   </span>
//                 )}
//               </div>

//               {upcomingTrip ? (
//                 <div>
//                   <div className="relative rounded-xl overflow-hidden mb-3">
//                     <img
//                       src={`http://localhost:3000/Images/${upcomingTrip.image}`}
//                       className="w-full h-36 object-cover"
//                       alt={upcomingTrip.packageName}
//                       onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x150?text=Tour"; }}
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
//                   </div>

//                   <h3 className="font-bold text-gray-900 text-sm mb-2 leading-tight">
//                     {upcomingTrip.packageName}
//                   </h3>

//                   <div className="space-y-1.5">
//                     <p className="flex items-center gap-1.5 text-xs text-gray-600">
//                       <MapPin size={12} className="text-gray-400" />
//                       {upcomingTrip.location}
//                     </p>
//                     <p className="flex items-center gap-1.5 text-xs text-gray-600">
//                       <Calendar size={12} className="text-[#00A3E1]" />
//                       {fmtDate(upcomingTrip.departureDate)}
//                       {upcomingTrip.endDate && <> → {fmtDate(upcomingTrip.endDate)}</>}
//                     </p>
//                     <p className="flex items-center gap-1.5 text-xs text-gray-600">
//                       <Users size={12} className="text-gray-400" />
//                       {upcomingTrip.travelers?.length || 1} traveler(s)
//                     </p>
//                   </div>

//                   <button
//                     onClick={() => navigate("/bookinginvoice", { state: { booking: upcomingTrip } })}
//                     className="mt-3 w-full flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-xl hover:bg-gray-100 transition">
//                     <FileText size={12} /> View Invoice
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center py-8 text-center">
//                   <Plane size={32} className="text-gray-300 mb-3" />
//                   <p className="text-sm text-gray-500 mb-3">No upcoming trips</p>
//                   <Link to="/packages"
//                     className="text-xs bg-[#00A3E1] text-white px-4 py-2 rounded-lg hover:bg-[#008cc2] transition font-semibold">
//                     Explore Packages
//                   </Link>
//                 </div>
//               )}
//             </div>

//             {/* ── My Bookings (recent list) ── */}
//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="font-bold text-gray-900">Recent Bookings</h2>
//                 <Link to="/my-bookings"
//                   className="text-xs text-[#00A3E1] font-semibold flex items-center gap-0.5 hover:underline">
//                   View all <ChevronRight size={12} />
//                 </Link>
//               </div>

//               {loading ? (
//                 <div className="flex-1 flex items-center justify-center">
//                   <div className="w-6 h-6 rounded-full border-2 border-[#00A3E1] border-t-transparent animate-spin" />
//                 </div>
//               ) : recentBookings.length === 0 ? (
//                 <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
//                   <p className="text-sm text-gray-500 mb-3">No bookings yet</p>
//                   <Link to="/packages"
//                     className="flex items-center gap-1.5 bg-[#00A3E1] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#008cc2] transition">
//                     <Plane size={13} /> Explore Packages
//                   </Link>
//                 </div>
//               ) : (
//                 <div className="space-y-3 flex-1 overflow-y-auto">
//                   {recentBookings.slice(0, 4).map(booking => (
//                     <motion.div key={booking._id}
//                       whileHover={{ x: 2 }}
//                       className="flex gap-3 items-center cursor-pointer group"
//                       onClick={() => navigate("/invoices", { state: { booking } })}
//                     >
//                       <img
//                         src={`http://localhost:3000/Images/${booking.image}`}
//                         className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
//                         alt={booking.packageName}
//                         onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/48?text=T"; }}
//                       />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-bold text-gray-900 truncate group-hover:text-[#00A3E1] transition">
//                           {booking.packageName}
//                         </p>
//                         <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
//                           <Calendar size={10} /> {fmtDate(booking.departureDate)}
//                         </p>
//                       </div>
//                       <div className="text-right flex-shrink-0">
//                         <p className="text-sm font-bold text-[#00A3E1]">₹{(booking.totalPrice || 0).toLocaleString()}</p>
//                         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_STYLES[booking.status] || "bg-gray-100 text-gray-600"}`}>
//                           {booking.status}
//                         </span>
//                       </div>
//                     </motion.div>
//                   ))}

//                   {recentBookings.length > 4 && (
//                     <Link to="/my-bookings"
//                       className="flex items-center justify-center gap-1 text-xs text-[#00A3E1] font-semibold py-2 border border-dashed border-[#00A3E1]/30 rounded-xl hover:bg-blue-50 transition">
//                       +{recentBookings.length - 4} more bookings <ChevronRight size={11} />
//                     </Link>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* ── Wishlist ── */}
//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
//               <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
//                 <Heart className="text-red-500" size={16} /> Wishlist
//                 <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
//                   {wishlist.length}
//                 </span>
//               </h2>

//               {wishlist.length === 0 ? (
//                 <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
//                   <Heart size={32} className="text-gray-300 mb-3" />
//                   <p className="text-sm text-gray-500 mb-3">Nothing saved yet</p>
//                   <Link to="/packages"
//                     className="flex items-center gap-1.5 bg-[#00A3E1] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#008cc2] transition">
//                     <Plane size={13} /> Explore Packages
//                   </Link>
//                 </div>
//               ) : (
//                 <div className="space-y-3 flex-1 overflow-y-auto">
//                   {wishlist.map(item => (
//                     <div key={item._id} className="flex gap-3 items-center">
//                       <img
//                         src={`http://localhost:3000/Images/${item.packageId?.image || "default.jpg"}`}
//                         alt={item.packageId?.name || "Package"}
//                         className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
//                         onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/48?text=T"; }}
//                       />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-bold text-gray-900 truncate">{item.packageId.name}</p>
//                         <p className="text-xs text-gray-500">
//                           ₹{(item.packageId.price || 0).toLocaleString()} / person
//                         </p>
//                       </div>
//                       <button onClick={() => removeFromWishlist(item.packageId._id)}
//                         className="text-red-400 hover:text-red-600 transition p-1 rounded-lg hover:bg-red-50">
//                         <Trash2 size={15} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ── Quick Stats Row ── */}
//           <div className="grid grid-cols-4 gap-4">
//             {[
//               { label: "Total Bookings", value: recentBookings.length, color: "text-[#00A3E1]" },
//               { label: "Upcoming Trips", value: recentBookings.filter(b => new Date(b.departureDate) >= new Date()).length, color: "text-green-600" },
//               { label: "Total Spent", value: `₹${recentBookings.reduce((s, b) => s + (b.totalPrice || 0), 0).toLocaleString()}`, color: "text-orange-500" },
//               { label: "Wishlist Items", value: wishlist.length, color: "text-red-500" },
//             ].map((stat, i) => (
//               <motion.div key={i}
//                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.08 }}
//                 className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center"
//               >
//                 <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
//                 <p className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</p>
//               </motion.div>
//             ))}
//           </div>

//         </div>
//       </div>

//       {/* Auth Modal */}
//       {authModal.isOpen && (
//         <AuthModal
//           isOpen={authModal.isOpen}
//           mode={authModal.mode}
//           onClose={closeAuthModal}
//         />
//       )}
//     </div>
//   );
// }