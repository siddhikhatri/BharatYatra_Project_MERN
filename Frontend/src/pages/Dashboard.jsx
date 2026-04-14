import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plane, Heart, Trash2 } from "lucide-react";
import axios from "axios";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    currentUser,
    token,
    isLoggedIn,
    openAuthModal,
  } = useAuth();

  const [recentBookings, setRecentBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [upcomingTrip, setUpcomingTrip] = useState(null);

  //  Auth check
  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isLoggedIn || !token) {
      openAuthModal("signin");
      navigate("/");
    }
  }, [isLoggedIn, token]);

  //  Fetch Data
  useEffect(() => {
    if (!currentUser) return;

    // Wishlist
    axios
      .get(`http://localhost:3000/wishlist/${currentUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setWishlist(res.data);
        localStorage.setItem("wishlist", JSON.stringify(res.data));
      })
      .catch((err) => console.log("Wishlist error", err));

    // Bookings
    axios
      .get("http://localhost:3000/getBookings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const userBookings = res.data.filter(
          (booking) => booking.userEmail === currentUser.email
        );

        setRecentBookings(userBookings);

        if (userBookings.length > 0) {
          setUpcomingTrip(userBookings[0]);
        }
      })
      .catch((err) => console.log("Booking error", err));
  }, [currentUser, token]);

  //  Remove Wishlist
  const removeFromWishlist = async (packageId) => {
    try {
      const res = await axios.delete(
        "http://localhost:3000/wishlist/remove",
        {
          data: {
            userId: currentUser._id,
            packageId,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Delete response:", res.data);

      // update UI instantly
      const updated = wishlist.filter(
        (item) =>
          item.packageId?._id?.toString() !== packageId.toString()
      );

      setWishlist(updated);
      localStorage.setItem("wishlist", JSON.stringify(updated));
    } catch (err) {
      console.log("Remove error", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <div className="p-8 bg-gray-50 flex-1">
          <h1 className="text-3xl font-bold mb-6">
            Welcome, {currentUser?.name}
          </h1>

          <div className="grid grid-cols-3 gap-6">

            {/* Upcoming Trip */}
            <div className="bg-pink-100 shadow-lg rounded-2xl p-5">
              <h2 className="font-semibold text-lg mb-4">
                Upcoming Trip
              </h2>

              {upcomingTrip ? (
                <>
                  <img
                    src={`http://localhost:3000/Images/${upcomingTrip.image}`}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />

                  <h3 className="font-semibold">
                    {upcomingTrip.packageName}
                  </h3>

                  <div className="text-m text-black mt-3 space-y-1">
                    <p>
                      📅{" "}
                      {new Date(upcomingTrip.departureDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p>👥 {upcomingTrip.travelers.length} Travellers</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">
                  No Upcoming Trips
                </p>
              )}
            </div>

            {/* Bookings */}
            <div className="bg-white shadow-lg rounded-2xl p-5 flex flex-col">
              <h2 className="font-semibold text-lg mb-4">
                My Bookings
              </h2>

              {recentBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-10">
                  {/* Icon */}
                  <Plane className="text-gray-300 mb-3" size={40} />

                  {/* Text */}
                  <p className="text-gray-500 mb-4 font-medium">
                    No bookings yet
                  </p>

                  {/* Button */}
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
                  <div key={booking._id} className="flex gap-3 mb-4">
                    <img
                      src={`http://localhost:3000/Images/${booking.image}`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div>
                      <p className="font-semibold text-sm">
                        {booking.packageName}
                      </p>

                      <Link to={`/packages/${booking.packageId}?review=true`}>
                        <button className="text-blue-600 text-sm hover:underline">
                          Leave Review
                        </button>
                      </Link>
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
                  <Heart className="text-gray-300 mb-3" size={40} />

                  <p className="text-gray-500 mb-4 font-medium">
                    No items in your wishlist
                  </p>

                  <Link
                    to="/packages"
                    className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition"
                  >
                    <Plane size={18} />
                    Explore Packages
                  </Link>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div key={item._id} className="flex gap-3 mb-4">
                    <img
                      src={`http://localhost:3000/Images/${item.packageId?.image}`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {item.packageId?.name}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        removeFromWishlist(item.packageId._id)
                      }
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
