///
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "/src/components/dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const { currentUser, token, openAuthModal } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!token) {
      openAuthModal("signin");
      navigate("/");
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:3000/getBookings");

        const userBookings = res.data.filter(
          (b) => b.userEmail === currentUser?.email
        );

        setBookings(userBookings);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) fetchBookings();
  }, [currentUser]);

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <div className="p-8 bg-gray-50 flex-1">
          <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

          {/* Filter */}
          <div className="flex gap-6 border-b mb-6">
            {["all", "Confirmed", "Pending", "Cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`pb-2 ${
                  filter === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white p-6 rounded-xl text-left shadow">
            <table className="w-full">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Package</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-t">
                    <td>{booking.bookingId}</td>

                    <td className="flex items-center gap-3 py-3">
                      <img
                        src={`http://localhost:3000/Images/${booking.image}`}
                        className="w-14 h-14 rounded"
                      />
                      {booking.packageName}
                    </td>

                    <td>
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>

                    <td>₹{booking.totalPrice}</td>

                    <td>{booking.status}</td>

                    <td>
                      <button
                        onClick={() => navigate("/invoices", { state: { booking } })}
                        className="bg-black text-white px-4 py-2 rounded-full"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}






// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import DashboardSidebar from "../components/dashboard/DashboardSidebar";
// import DashboardHeader from "/src/components/dashboard/DashboardHeader";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Calendar, MapPin, Users, CreditCard, Clock, FileText, Plane } from "lucide-react";
// import { Link } from "react-router-dom";

// const STATUS_STYLES = {
//   Paid: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
//   Confirmed: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
//   Pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
//   Cancelled: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
// };

// const fmtDate = (d) =>
//   d
//     ? new Date(d).toLocaleDateString("en-IN", {
//       day: "numeric", month: "short", year: "numeric",
//     })
//     : "—";

// export default function MyBookings() {
//   const { currentUser, token, openAuthModal } = useAuth();
//   const [bookings, setBookings] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) { openAuthModal("signin"); navigate("/"); return; }
//     if (!currentUser) return;

//     const fetchBookings = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get("http://localhost:3000/getBookings", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         // filter to current user's bookings
//         const mine = (res.data.data || []).filter(
//           (b) => b.userEmail === currentUser.email
//         );
//         setBookings(mine);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [currentUser, token]);

//   const TABS = ["all", "Paid", "Confirmed", "Pending", "Cancelled"];

//   const filtered = bookings.filter((b) => {
//     if (filter === "all") return true;
//     return b.status === filter;
//   });

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <DashboardSidebar />

//       <div className="flex-1 flex flex-col">
//         <DashboardHeader />

//         <div className="p-8 flex-1">
//           {/* Page header */}
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
//               <p className="text-sm text-gray-500 mt-1">
//                 {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
//               </p>
//             </div>
//             <Link to="/packages"
//               className="flex items-center gap-2 bg-[#00A3E1] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#008cc2] transition shadow-md shadow-blue-200">
//               <Plane size={15} /> Book New Trip
//             </Link>
//           </div>

//           {/* Filter tabs */}
//           <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-6 w-fit">
//             {TABS.map((tab) => (
//               <button key={tab} onClick={() => setFilter(tab)}
//                 className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize
//                   ${filter === tab
//                     ? "bg-[#00A3E1] text-white shadow-sm"
//                     : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
//                 {tab}
//                 {tab !== "all" && (
//                   <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold
//                     ${filter === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
//                     {bookings.filter(b => b.status === tab).length}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* Loading */}
//           {loading && (
//             <div className="flex items-center justify-center py-20">
//               <div className="w-8 h-8 rounded-full border-2 border-[#00A3E1] border-t-transparent animate-spin" />
//             </div>
//           )}

//           {/* Empty state */}
//           {!loading && filtered.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-20 text-center">
//               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                 <Plane size={32} className="text-gray-400" />
//               </div>
//               <h3 className="text-lg font-bold text-gray-700 mb-1">
//                 {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
//               </h3>
//               <p className="text-sm text-gray-500 mb-6">
//                 {filter === "all"
//                   ? "Start your journey by booking a tour package."
//                   : "No bookings match this filter."}
//               </p>
//               <Link to="/packages"
//                 className="bg-[#00A3E1] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#008cc2] transition">
//                 Explore Packages
//               </Link>
//             </div>
//           )}

//           {/* Booking cards */}
//           {!loading && filtered.length > 0 && (
//             <div className="space-y-4">
//               <AnimatePresence>
//                 {filtered.map((booking, idx) => {
//                   const s = STATUS_STYLES[booking.status] || STATUS_STYLES.Pending;
//                   return (
//                     <motion.div key={booking._id}
//                       initial={{ opacity: 0, y: 16 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: idx * 0.05 }}
//                       className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
//                     >
//                       <div className="flex items-stretch">

//                         {/* Image */}
//                         <div className="w-36 flex-shrink-0 relative">
//                           <img
//                             src={`http://localhost:3000/Images/${booking.image}`}
//                             alt={booking.packageName}
//                             className="w-full h-full object-cover"
//                             onError={e => {
//                               e.target.onerror = null;
//                               e.target.src = "https://via.placeholder.com/144x144?text=Tour";
//                             }}
//                           />
//                           <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
//                         </div>

//                         {/* Content */}
//                         <div className="flex-1 p-5">
//                           <div className="flex items-start justify-between gap-3">
//                             <div className="flex-1 min-w-0">
//                               {/* Booking ID + status */}
//                               <div className="flex items-center gap-2 mb-1.5 flex-wrap">
//                                 <span className="text-xs text-gray-400 font-mono">{booking.bookingId}</span>
//                                 <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>
//                                   <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
//                                   {booking.status}
//                                 </span>
//                               </div>

//                               <h3 className="font-bold text-gray-900 text-base leading-tight truncate mb-1">
//                                 {booking.packageName}
//                               </h3>

//                               <p className="flex items-center gap-1 text-sm text-gray-500 mb-3">
//                                 <MapPin size={12} /> {booking.location}
//                               </p>
//                             </div>

//                             {/* Price */}
//                             <div className="text-right flex-shrink-0">
//                               <p className="text-xl font-bold text-[#00A3E1]">
//                                 ₹{(booking.totalPrice || 0).toLocaleString()}
//                               </p>
//                               <p className="text-xs text-gray-400">total paid</p>
//                             </div>
//                           </div>

//                           {/* Meta row */}
//                           <div className="flex items-center gap-5 flex-wrap">
//                             <MetaChip icon={Calendar} label="Departure" value={fmtDate(booking.departureDate)} />
//                             {booking.endDate && (
//                               <MetaChip icon={Clock} label="Return" value={fmtDate(booking.endDate)} />
//                             )}
//                             <MetaChip icon={Users} label="Travelers" value={`${booking.travelers?.length || 1} person(s)`} />
//                             {booking.paymentMethod && (
//                               <MetaChip icon={CreditCard} label="Paid via" value={booking.paymentMethod.toUpperCase()} />
//                             )}
//                           </div>
//                         </div>

//                         {/* Action */}
//                         <div className="flex flex-col items-center justify-center px-5 border-l border-gray-100 gap-2 flex-shrink-0">
//                           <button
//                             onClick={() => navigate("/invoices", { state: { booking } })}
//                             className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-700 transition whitespace-nowrap">
//                             <FileText size={13} /> View Invoice
//                           </button>
//                           <p className="text-[10px] text-gray-400">
//                             Booked {fmtDate(booking.bookingDate)}
//                           </p>
//                         </div>

//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </AnimatePresence>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function MetaChip({ icon: Icon, label, value }) {
//   return (
//     <div className="flex items-center gap-1.5">
//       <Icon size={13} className="text-gray-400 flex-shrink-0" />
//       <div>
//         <p className="text-[10px] text-gray-400 font-semibold leading-none mb-0.5">{label}</p>
//         <p className="text-xs font-bold text-gray-700">{value}</p>
//       </div>
//     </div>
//   );
// }

















//this below is perfect but modal still exists.
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import DashboardSidebar from "../components/dashboard/DashboardSidebar";
// import DashboardHeader from "/src/components/dashboard/DashboardHeader";
// import { useNavigate } from "react-router-dom";

// export default function MyBookings() {
//   const { currentUser, token, openAuthModal } = useAuth();
//   const [bookings, setBookings] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const navigate = useNavigate();

//   useEffect(() => {
//     window.scrollTo(0, 0);

//     if (!token) {
//       openAuthModal("signin");
//       navigate("/");
//       return;
//     }

//     const fetchBookings = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/getBookings");

//         const userBookings = res.data.filter(
//           (b) => b.userEmail === currentUser?.email
//         );

//         setBookings(userBookings);
//       } catch (error) {
//         console.log("Error fetching bookings", error);
//       }
//     };

//     if (currentUser) fetchBookings();
//   }, [currentUser]);

//   const filteredBookings = bookings.filter((b) => {
//     if (filter === "all") return true;
//     return b.status === filter;
//   });

//   return (
//     <div className="flex min-h-screen">
//       <DashboardSidebar />

//       <div className="flex-1 flex flex-col">
//         <DashboardHeader />

//         <div className="p-8 bg-gray-50 flex-1">
//           <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

//           {/* FILTER */}
//           <div className="flex gap-6 border-b mb-6">
//             {["all", "Confirmed", "Pending", "Cancelled"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setFilter(tab)}
//                 className={`pb-2 capitalize ${
//                   filter === tab
//                     ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
//                     : "text-black"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* TABLE */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <table className="w-full">
//               <thead>
//                 <tr>
//                   <th>#ID</th>
//                   <th>Package</th>
//                   <th>Booking Date</th>
//                   <th>Price</th>
//                   <th>Status</th>
//                   <th></th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredBookings.map((booking) => (
//                   <tr key={booking._id} className="border-t">
//                     <td>{booking.bookingId}</td>

//                     <td className="flex items-center gap-4 py-4">
//                       <img
//                         src={`http://localhost:3000/Images/${booking.image}`}
//                         className="w-16 h-16 rounded-lg"
//                       />
//                       {booking.packageName}
//                     </td>

//                     <td>
//                       {new Date(booking.bookingDate).toLocaleDateString()}
//                     </td>

//                     <td>₹{booking.totalPrice}</td>

//                     <td>{booking.status}</td>

//                     {/* 🔥 UPDATED BUTTON */}
//                     <td>
//                       <button
//                         onClick={() =>
//                           navigate("/booking-details", {
//                             state: { booking },
//                           })
//                         }
//                         className="bg-black text-white px-4 py-2 rounded-full"
//                       >
//                         Details
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import DashboardSidebar from "../components/dashboard/DashboardSidebar";
// import DashboardHeader from "/src/components/dashboard/DashboardHeader";
// import { useNavigate } from "react-router-dom";
// import BookingInvoice from "/src/components/BookingInvoice";

// export default function MyBookings() {
//   const { currentUser, token, openAuthModal } = useAuth();
//   const [bookings, setBookings] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showInvoice, setShowInvoice] = useState(false); // ← invoice state
//   const navigate = useNavigate();

//   useEffect(() => {
//     window.scrollTo(0, 0);

//     if (!token) {
//       openAuthModal("signin");
//       navigate("/");
//       return;
//     }

//     const fetchBookings = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/getBookings");
//         const userBookings = res.data.filter(
//           (b) => b.userEmail === currentUser?.email
//         );
//         setBookings(userBookings);
//       } catch (error) {
//         console.log("Error fetching bookings", error);
//       }
//     };

//     if (currentUser) fetchBookings();
//   }, [currentUser]);

//   const filteredBookings = bookings.filter((b) => {
//     if (filter === "all") return true;
//     return b.status === filter;
//   });

//   return (
//     <div className="flex min-h-screen">
//       {/* SIDEBAR */}
//       <DashboardSidebar />

//       {/* RIGHT SECTION */}
//       <div className="flex-1 flex flex-col">
//         {/* HEADER */}
//         <DashboardHeader />

//         {/* CONTENT */}
//         <div className="p-8 bg-gray-50 flex-1">
//           {/* TITLE */}
//           <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

//           {/* FILTER TABS */}
//           <div className="flex gap-6 border-b mb-6">
//             {["all", "Confirmed", "Pending", "Cancelled"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setFilter(tab)}
//                 className={`pb-2 capitalize transition ${
//                   filter === tab
//                     ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
//                     : "text-black hover:text-black"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* TABLE */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <table className="w-full">
//               <thead className="text-black text-sm">
//                 <tr>
//                   <th className="text-left">#ID</th>
//                   <th className="text-left">Package</th>
//                   <th>Booking Date</th>
//                   <th>Price</th>
//                   <th>Status</th>
//                   <th></th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredBookings.map((booking) => (
//                   <tr key={booking._id} className="border-t">
//                     <td className="py-4">{booking.bookingId}</td>

//                     <td className="flex items-center gap-4 py-4">
//                       <img
//                         src={`http://localhost:3000/Images/${booking.image}`}
//                         className="w-16 h-16 rounded-lg object-cover"
//                       />
//                       <span className="font-medium">{booking.packageName}</span>
//                     </td>

//                     <td className="text-center">
//                       {new Date(booking.bookingDate).toLocaleDateString()}
//                     </td>

//                     <td className="text-center">₹{booking.totalPrice}</td>

//                     <td className="text-center">
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm ${
//                           booking.status === "Confirmed"
//                             ? "text-green-600"
//                             : booking.status === "Pending"
//                             ? "text-yellow-500"
//                             : "text-red-500"
//                         }`}
//                       >
//                         ● {booking.status}
//                       </span>
//                     </td>

//                     {/* ── Action Buttons ── */}
//                     <td>
//                       <div className="flex items-center gap-2">
//                         {/* Details button */}
//                         <button
//                           onClick={() => {
//                             setSelectedBooking(booking);
//                             setShowModal(true);
//                           }}
//                           className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition"
//                         >
//                           Details
//                         </button>

//                         {/* Download Invoice button */}
//                         <button
//                           onClick={() => {
//                             setSelectedBooking(booking);
//                             setShowInvoice(true);
//                           }}
//                           className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition"
//                         >
//                           <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
//                             <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
//                             <polyline points="7 10 12 15 17 10"/>
//                             <line x1="12" y1="15" x2="12" y2="3"/>
//                           </svg>
//                           Invoice
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}

//                 {filteredBookings.length === 0 && (
//                   <tr>
//                     <td colSpan={6} className="text-center py-12 text-gray-400">
//                       <div className="text-4xl mb-2">📭</div>
//                       No bookings found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* --Details Modal (existing) -- */}
//       {showModal && selectedBooking && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-[550px] max-h-[90vh] overflow-y-auto relative">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-3 right-3 text-gray-500 text-xl"
//             >
//               ✕
//             </button>

//             <h2 className="text-2xl font-bold mb-4">Booking Details</h2>

//             <img
//               src={`http://localhost:3000/Images/${selectedBooking.image}`}
//               className="w-full h-40 object-cover rounded-lg mb-4"
//             />

//             <div className="space-y-2 text-black mb-6">
//               <p><b>Package:</b> {selectedBooking.packageName}</p>
//               <p><b>Location:</b> {selectedBooking.location}</p>
//               <p><b>Booking ID:</b> {selectedBooking.bookingId}</p>
//               <p><b>Booking Date:</b> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
//               <p><b>Departure Date:</b> {new Date(selectedBooking.departureDate).toLocaleDateString()}</p>
//               <p><b>Price Per Person:</b> ₹{selectedBooking.price}</p>
//               <p><b>Total Price:</b> ₹{selectedBooking.totalPrice}</p>
//               <p>
//                 <b>Status:</b>{" "}
//                 <span className={`font-semibold ${
//                   selectedBooking.status === "Confirmed" ? "text-green-600" :
//                   selectedBooking.status === "Pending" ? "text-yellow-500" :
//                   "text-gray-500"
//                 }`}>
//                   {selectedBooking.status}
//                 </span>
//               </p>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold mb-3">Travelers</h3>
//               {selectedBooking.travelers?.map((traveler, index) => (
//                 <div key={index} className="border rounded-lg p-3 mb-3 bg-gray-50">
//                   <p><b>Name:</b> {traveler.name}</p>
//                   <p><b>Age:</b> {traveler.age}</p>
//                   <p><b>Phone:</b> {traveler.phone}</p>
//                   <p><b>Email:</b> {traveler.email || "N/A"}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Invoice Modal ── */}
//       {showInvoice && selectedBooking && (
//         <BookingInvoice
//           booking={selectedBooking}
//           onClose={() => setShowInvoice(false)}
//         />
//       )}
//     </div>
//   );
// }