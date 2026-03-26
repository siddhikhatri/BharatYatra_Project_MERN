import { useState, useEffect } from "react";
import { Search, Calendar } from "lucide-react";
import axios from "axios";

/* -------- Simple Card -------- */
const Card = ({ children }) => (
  <div className="bg-white rounded-xl border border-gray-200">
    {children}
  </div>
);

/* -------- Simple Badge -------- */
const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

/* -------- Status Color -------- */
const getStatusColor = (status) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-orange-100 text-orange-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    case "Completed":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* -------- Fetch Bookings -------- */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:3000/getBookings");
        setBookings(res.data);
      } catch (error) {
        console.log("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  /* -------- Update Status -------- */
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/updateBookingStatus/${id}`,
        { status: newStatus }
      );

      // Update UI instantly
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: newStatus } : b
        )
      );
    } catch (error) {
      console.log("Error updating status:", error);
    }
  };

  /* -------- Filter Logic -------- */
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /* -------- Status Filters -------- */
  const statusFilters = [
    { label: "All", value: "all", count: bookings.length },
    {
      label: "Pending",
      value: "Pending",
      count: bookings.filter((b) => b.status === "Pending").length,
    },
    {
      label: "Confirmed",
      value: "Confirmed",
      count: bookings.filter((b) => b.status === "Confirmed").length,
    },
    {
      label: "Completed",
      value: "Completed",
      count: bookings.filter((b) => b.status === "Completed").length,
    },
    {
      label: "Cancelled",
      value: "Cancelled",
      count: bookings.filter((b) => b.status === "Cancelled").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
          <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          Bookings
        </h1>
        <p className="text-black text-m mt-1">
          Manage all Customer Bookings
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          <input
            type="text"
            placeholder="Search by email or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm ${
                statusFilter === filter.value
                  ? "bg-cyan-500 text-white"
                  : "bg-white border"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto shadow-lg">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left">Booking ID</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Package</th>
                <th className="px-6 py-4 text-left">Travelers</th>
                <th className="px-6 py-4 text-left">Travel Date</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Update</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6">
                    No Bookings Found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-b">
                    <td className="px-6 py-4 font-medium">{booking.bookingId}</td>

                    <td className="px-6 py-4 font-medium">
                      {booking.travelers?.[0]?.name || "User"}
                      <br />
                      <span className="text-xs text-gray-900 font-medium">
                        {booking.userEmail}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {booking.packageName}
                    </td>

                    <td className="px-6 py-4 text-center font-medium">
                      {booking.travelers?.length}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {new Date(
                        booking.departureDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      ₹{booking.totalPrice}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>

                    {/* Dropdown */}
                    <td className="px-6 py-4 font-medium">
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          updateStatus(booking._id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}





// import { useState, useEffect } from "react";
// import { Search, Eye, Calendar } from "lucide-react";
// import axios from 'axios';

// /* -------- Simple Card -------- */
// const Card = ({ children }) => (
//   <div className="bg-white rounded-xl border border-gray-200">
//     {children}
//   </div>
// );

// /* -------- Simple Badge -------- */
// const Badge = ({ children, className = "" }) => (
//   <span
//     className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${className}`}
//   >
//     {children}
//   </span>
// );



// const getStatusColor = (status) => {
//   switch (status) {
//     case "Confirmed":
//       return "bg-green-100 text-green-700";
//     case "Pending":
//       return "bg-orange-100 text-orange-700";
//     case "Cancelled":
//       return "bg-red-100 text-red-700";
//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// };

// export default function Bookings() {
//   const [bookings, setBookings] = useState([]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const filteredBookings = bookings.filter((booking) => {

//     const matchesSearch =
//       booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" || booking.status === statusFilter;

//     return matchesSearch && matchesStatus;

//   });

//   const statusFilters = [
//     {
//       label: "All",
//       value: "all",
//       count: bookings.length,
//     },
//     {
//       label: "Confirmed",
//       value: "Confirmed",
//       count: bookings.filter((b) => b.status === "Confirmed").length,
//     },
//     {
//       label: "Pending",
//       value: "Pending",
//       count: bookings.filter((b) => b.status === "Pending").length,
//     },
//     {
//       label: "Cancelled",
//       value: "Cancelled",
//       count: bookings.filter((b) => b.status === "Cancelled").length,
//     },
//   ];

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const res = await axios.get('http://localhost:3000/getBookings');
//         setBookings(res.data)
//       }
//       catch (error) {
//         console.log("Error in Fetching Booking Data", error);
//       }
//     };
//     fetchBookings();
//   }, []);



//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
//           <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center">
//             <Calendar className="w-5 h-5 text-white" />
//           </div>
//           Bookings
//         </h1>
//         <p className="text-black text-m mt-1">
//           Manage all customer bookings
//         </p>
//       </div>

//       {/* Search & Filters */}
//       <div className="flex flex-col md:flex-row gap-4">
//         {/* Search */}
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
//           <input
//             type="text"
//             placeholder="Search by name or ID..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
//           />
//         </div>

//         {/* Filters */}
//         <div className="flex gap-2 flex-wrap">
//           {statusFilters.map((filter) => (
//             <button
//               key={filter.value}
//               onClick={() => setStatusFilter(filter.value)}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === filter.value
//                   ? "bg-cyan-500 text-white"
//                   : "bg-white text-black border border-gray-200 hover:bg-gray-50"
//                 }`}
//             >
//               {filter.label} ({filter.count})
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Table */}
//       <Card>
//         <div className="overflow-x-auto shadow-lg">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-black uppercase">
//                   Booking ID
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-black uppercase">
//                   Customer
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-black uppercase">
//                   Package
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-black uppercase">
//                   Travelers
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-black uppercase">
//                   Travel Date
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-black uppercase">
//                   Amount
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-black uppercase">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-black uppercase">
//                   Action
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200">
//               {filteredBookings.map((booking) => (
//                 <tr
//                   key={booking._id}
//                   className="hover:bg-gray-50 transition"
//                 >
//                   <td className="px-6 py-4 text-sm font-medium text-black">
//                     {booking.bookingId}
//                   </td>

//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span className="text-sm font-medium text-black">
//                         {booking.travelers?.[0]?.name || "Unknown User"}
//                       </span>
//                       <span className="text- text-black">
//                         {booking.packageName}
//                       </span>
//                     </div>
//                   </td>

//                   <td className="px-6 py-4 text- text-black">
//                     {booking.packageName}
//                   </td>

//                   <td className="px-6 py-4 text-center text-black">
//                     {booking.travelers?.length}
//                   </td>

//                   <td className="px-6 py-4 text-center text-black">
//                     {new Date(booking.departureDate).toLocaleDateString()}
//                   </td>

//                   <td className="px-6 py-4 text-sm font-semibold text-black">
//                     ₹{booking.totalPrice?.toLocaleString()}
//                   </td>

//                   <td className="px-6 py-4">
//                     <Badge className={getStatusColor(booking.status)}>
//                       {booking.status}
//                     </Badge>
//                   </td>

//                   <td className="px-6 py-4">
//                     <button className="p-2 text-black hover:text-cyan-600">
//                       <Eye className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// }