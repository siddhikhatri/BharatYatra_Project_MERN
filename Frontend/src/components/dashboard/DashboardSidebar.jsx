// import { Link, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   BookOpen,
//   Heart,
//   Star,
//   LogOut,
//   FileText,
//   Pencil
// } from "lucide-react";

// export default function DashboardSidebar() {

//   const location = useLocation();

//   const menu = [
//     { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
//     { name: "Bookings", icon: BookOpen, path: "/bookings" },
//     // { name: "Wishlist", icon: Heart, path: "/wishlist" },
//     { name: "Invoices", icon: FileText, path: "/invoices" },
//     { name: "Reviews", icon: Star, path: "/reviews" },
//     { name: "Edit Profile", icon: Pencil, path: "/editprofile" }
//   ];

//   return (
//     <div className="w-64 bg-white shadow-lg p-6 min-h-screen">

//       {/* Logo */}
//       <Link to="/" className="flex items-center gap-3 mb-10">

//         <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
//           ✈
//         </div>

//         <span className="text-lg font-bold">
//           Bharat<span className="text-blue-600">Yatra</span>
//         </span>
//         <br/><br/>
//         <Link to="/" className="text-gray-500 hover:text-black">
//         ← 
//       </Link>

//       </Link> 
      

//       {/* Menu */}
//       <div className="space-y-3">

//         {menu.map((item) => {

//           const Icon = item.icon;

//           return (
//             <Link
//               key={item.name}
//               to={item.path}
//               className={`flex items-center gap-3 p-3 rounded-lg transition
              
//               ${location.pathname === item.path
//                   ? "bg-blue-50 text-blue-600 font-semibold"
//                   : "text-black hover:bg-gray-100"}
              
//               `}
//             >

//               <Icon size={18} />

//               {item.name}

//             </Link>
//           );

//         })}

//       </div>

//       {/* Logout */}
//       <button className="flex items-center gap-3 text-gray-600 mt-10 hover:text-red-500">
//         <LogOut size={18} />
//         Logout
//       </button>

//     </div>
//   );
// }
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Star,
  LogOut,
  FileText,
  Pencil,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function DashboardSidebar() {

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [open, setOpen] = useState(true);

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Bookings", icon: BookOpen, path: "/bookings" },
    // { name: "Invoices", icon: FileText, path: "/invoices" },
    { name: "Reviews", icon: Star, path: "/reviews" },
    { name: "Edit Profile", icon: Pencil, path: "/editprofile" }
  ];

  const handleLogout = () => {
    logout();      // clear user
    navigate("/"); // go to home page
  };

  return (

    <div className={`${open ? "w-64" : "w-20"} bg-white border-r border-gray-300 p-5 min-h-screen transition-all duration-300`}>

      {/* Logo + Toggle */}
      <div className="flex items-center justify-between mb-10">

        <Link to="/" className="flex items-center gap-3">

          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
            ✈
          </div>

          {open && (
            <span className="text-lg font-bold">
              Bharat<span className="text-blue-600">Yatra</span>
            </span>
          )}

        </Link>

        <button onClick={() => setOpen(!open)}>
          {open ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
        </button>

      </div>


      {/* Menu */}
      <div className="space-y-3">

        {menu.map((item) => {

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition
              
              ${location.pathname === item.path
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-black hover:bg-gray-100"}
              `}
            >

              <Icon size={18} />

              {open && item.name}

            </Link>
          );

        })}

      </div>


      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 text-gray-600 mt-10 hover:text-red-500"
      >

        <LogOut size={18} />

        {open && "Logout"}

      </button>

    </div>
  );
}