import { useState } from "react";


export default function BookingTable({ bookings }) {

  const [filter, setFilter] = useState("all");

  const tabs = [
    "all",
    "complete",
    "pending",
    "processing",
    "cancel"
  ];

  const filteredBookings = bookings.filter((b) => {

    if (filter === "all") return true;

    return b.status === filter;

  });

  const getStatusColor = (status) => {

    if (status === "complete") return "text-green-500";
    if (status === "pending") return "text-yellow-500";
    if (status === "cancel") return "text-gray-400";

    return "text-blue-500";

  };

  return (

    <div className="bg-white rounded-2xl shadow p-6">

      {/* Filter Tabs */}
      <div className="flex gap-6 border-b pb-4 mb-6">

        {tabs.map((tab) => (

          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`capitalize pb-2 
            
            ${filter === tab
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-500"}
            
            `}
          >

            {tab}

          </button>

        ))}

      </div>


      {/* Table */}
      <table className="w-full">

        <thead className="text-gray-500 text-sm">

          <tr>

            <th className="text-left">#ID</th>
            <th className="text-left">TITLE</th>
            <th>ORDER DATE</th>
            <th>PRICE</th>
            <th>STATUS</th>
            <th></th>

          </tr>

        </thead>


        <tbody>

          {filteredBookings.map((booking) => (

            <tr key={booking._id} className="border-t">

              <td className="py-5">
                {booking.bookingId}
              </td>


              <td className="flex items-center gap-4 py-5">

                <img
                  src={`http://localhost:3000/Images/${booking.image}`}
                  className="w-16 h-16 rounded-lg object-cover"
                />

                <div className="font-medium">
                  {booking.packageName}
                </div>

              </td>


              <td>
                {new Date(booking.bookingDate).toLocaleDateString()}
              </td>


              <td>
                ₹{booking.totalPrice}
              </td>


              <td>

                <span className={`${getStatusColor(booking.status)}`}>
                  ● {booking.status}
                </span>

              </td>


              <td>

                <button className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800">
                  Detail
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}