import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Calendar,
  MessageSquare,
  Search,
  Bell,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  Star,Heart,
} from "lucide-react";
import axios from 'axios';

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Packages", href: "/admin/packages", icon: Package },
  { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Reviews", href: "/admin/userreviews", icon: Star },
  { name: "Wishlists", href: "/admin/wishlists", icon: Heart },
  { name: "Settings", href: "/admin/editprofile", icon: Settings },
  ];

export default function AdminLayout() {

  const email = localStorage.getItem("adminEmail");

  const [profile, setProfile] = useState({
    name: "",
    avatar: ""
  });
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {

    if (!email) return;

    const fetchProfile = async () => {
      try {

        const res = await axios.get(
          "http://localhost:3000/admin/getProfile/" + email
        );

        setProfile({
          name: res.data.name,
          avatar: res.data.avatar
        });

      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();

  }, [email]);

  return (
    <div className="min-h-screen bg-white">

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 ${isOpen ? "w-64" : "w-20"
          } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
      >

        {/* Logo */}
        {/* Logo + Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">

          {/* Left Side: Logo + Admin */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              ✈
            </div>

            {isOpen && (
              <span className="text-lg font-semibold text-black">
                Admin
              </span>
            )}
          </div>

          {/* Right Side: Toggle Button */}
          <button onClick={() => setIsOpen(!isOpen)}>
            <span className="text-gray-600 text-lg">
              {isOpen ? "‹" : "›"}
            </span>
          </button>

        </div>
        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">

          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/admin" &&
                location.pathname.startsWith(item.href));

            return (
              <Link key={item.name} to={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
                  ${isActive
                      ? "bg-cyan-500 text-white"
                      : "text-black hover:bg-gray-100"
                    }`}
                >
                  <item.icon className="w-5 h-5" />

                  {isOpen && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </div>
              </Link>
            );
          })}

        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200">

          <button
            onClick={() => {
              localStorage.removeItem("adminEmail");
              window.location.href = "/";
            }}
            className="flex items-center gap-2 text-black hover:text-gray-900"
          >
            <LogOut className="w-5 h-5" />

            {isOpen && <span>Logout</span>}

          </button>

        </div>

      </aside>

      {/* Main Content */}
      <div
        className={`${isOpen ? "pl-64" : "pl-20"
          } transition-all duration-300`}
      >

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

          {/* Search */}
          <div className="relative max-w-md w-full">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />

            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">

            {/* Notification */}
            {/* <button className="relative">

              <Bell className="w-5 h-5 text-gray-600" />

              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>

            </button> */}

            {/* Admin Profile */}
            <div className="flex items-center gap-3 cursor-pointer">

              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-cyan-500 text-white text-sm font-semibold">

                {profile.avatar ? (

                  <img
                    src={"http://localhost:3000" + profile.avatar}
                    alt="admin"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  profile.name?.charAt(0).toUpperCase()

                )}

              </div>

              <span className="font-medium text-gray-700">
                {profile.name}
              </span>
            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
}