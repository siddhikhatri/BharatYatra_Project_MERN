import {
  Package,
  Calendar,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Users,
  LayoutDashboard,
} from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { useNavigate } from "react-router-dom";

/* -------------------- Simple Card Component -------------------- */
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
    {children}
  </div>
);

/* -------------------- Simple Badge -------------------- */
const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

/* -------------------- Stat Card -------------------- */
const StatCard = ({ title, value, growth, icon: Icon, color,onClick }) => (
  <Card className="p-6 shadow-lg cursor-pointer hover:scale-105 transition"
    >
    <div className="flex items-start justify-between mb-4">
      <div
        className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
       onClick={onClick}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center gap-1 text-sm text-green-600">
        <TrendingUp className="w-4 h-4" />
        <span>+{growth}%</span>
      </div>
    </div>

    <h3 className="text-3xl font-bold text-black">{value}</h3>
    <p className="text-m text-black mt-1">{title}</p>
  </Card>
);

/* -------------------- Status Color -------------------- */
const getStatusColor = (status) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-orange-100 text-orange-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/* -------------------- Main Dashboard -------------------- */
export default function Dashboard() {

  const navigate=useNavigate();

  const [statsData, setStatsData] = useState({
    totalPackages: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [booking, setBooking] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/admin/dashboard_stats"
        );
        setStatsData(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/getBookings"
        );
        setBooking(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchBooking();
  }, []);



  const stats = [
    {
      title: "Total Packages",
      value: statsData.totalPackages,
      // growth: dashboardStats.packageGrowth,
      icon: Package,
      color: "bg-cyan-500",
      onClick: () => navigate("/admin/packages"),
    },
    {
      title: "Total Bookings",
      value: statsData.totalBookings,
      // growth: dashboardStats.bookingGrowth,
      icon: Calendar,
      color: "bg-green-500",
      onClick: () => navigate("/admin/bookings"),
    },
    {
      title: "Enquiries",
      value: statsData.totalEnquiries,
      // growth: dashboardStats.enquiryGrowth,
      icon: MessageSquare,
      color: "bg-orange-500",
      onClick: () => navigate("/admin/enquiries"),
    },
    {
      title: "Users",
      value: statsData.totalUsers,
      // growth: dashboardStats.enquiryGrowth,
      icon: Users,
      color: "bg-blue-500",
      onClick: () => navigate("/admin/users"),
    },
    // {
    //   title: "Revenue",
    //   value: `₹${dashboardStats.revenue}L`,
    //   growth: dashboardStats.revenueGrowth,
    //   icon: DollarSign,
    //   color: "bg-purple-500",
    // },
  ];



  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
          <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          Dashboard
        </h1>
        <p className="text-black text-m mt-1">
          Welcome back! Here's your business overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <div className="p-6 border-b border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold text-black">
              Recent Bookings
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {booking.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-black">
                      {booking.bookingId}
                    </td>
                    <td className="px-6 py-4 font-medium text-black">
                      {booking.travelers?.[0]?.name || "Unknown User"}
                    </td>
                    <td className="px-6 py-4 font-medium text-black">
                      {booking.packageName}
                    </td>
                    <td className="px-6 py-4 font-medium text-black">
                      ₹{booking.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </Badge>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Packages */}
        <Card>
          <div className="p-6 border-b border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Packages
            </h3>
          </div>

          <div className="p-6 space-y-5">
            {/* {topPackages.map((pkg) => (
              <div key={pkg.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">
                    {pkg.name}
                  </span>
                  <span className="text-gray-600">
                    {pkg.bookings} bookings
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{
                      width: `${(pkg.bookings / 510) * 100}%`,
                    }}
                  />
                </div>

                <div className="text-xs text-gray-600">
                  Revenue: ₹{pkg.revenue}L
                </div>
              </div>
            ))} */}
          </div>
        </Card>
      </div>
    </div>
  );
}