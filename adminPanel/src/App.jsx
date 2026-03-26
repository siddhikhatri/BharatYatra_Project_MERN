

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AdminLayout from "./AdminLayout";
// import Dashboard from "./pages/Dashboard";
// import { Enquiries } from "./pages/Enquiries";
// import Bookings from "./pages/Bookings";
// import { Packages } from "./pages/Packages";
// import Users from "./pages/Users";
// import AddPackageModal from "./AddPackageModal";
// import AdminLogin from "/src/pages/admin/AdminLogin";
// import AdminSignup from "/src/pages/admin/AdminSignup";
// import AdminEditProfile from "/src/pages/admin/AdminEditProfile";
// import AdminForgotPassword from "/src/pages/admin/AdminForgotPassword";

// export default function App() {
//   return (<>

    
//     <BrowserRouter>
//   <Routes>
//     <Route path="/" element={<AdminLayout />}>
//       <Route index element={<Dashboard />} />
//       <Route path="dashboard" element={<Dashboard />} />
//       <Route path="packages" element={<Packages />} />
//       <Route path="enquiries" element={<Enquiries />} />
//       <Route path="bookings" element={<Bookings />} />
//       <Route path="users" element={<Users/>}/>
//       <Route path="adminlogin" element={<AdminLogin/>}/>
//       <Route path="adminsignup" element={<AdminSignup/>}/>
//       <Route path="editprofile" element={<AdminEditProfile/>}/>
//       <Route path="forgotpassword" element={<AdminForgotPassword/>}/>
//     </Route>
//   </Routes>
// </BrowserRouter>
//   </>);
// }

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLayout from "./AdminLayout";

import Dashboard from "./pages/Dashboard";
import { Enquiries } from "./pages/Enquiries";
import Bookings from "./pages/Bookings";
import { Packages } from "./pages/Packages";
import Users from "./pages/Users";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminEditProfile from "./pages/admin/AdminEditProfile";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import UserReviews from "./pages/admin/UserReviews";
import Wishlists from "./pages/admin/Wishlists";

export default function App() {

  return (

    <Router>

      <Routes>

        {/* PUBLIC ROUTES (No Sidebar / No Header) */}

        <Route path="/" element={<AdminLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminsignup" element={<AdminSignup />} />
        <Route path="/forgotpassword" element={<AdminForgotPassword />} />



        {/* ADMIN PANEL ROUTES */}

        <Route path="/admin" element={<AdminLayout />}>

          <Route index element={<Dashboard />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="packages" element={<Packages />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="users" element={<Users />} />
          <Route path="editprofile" element={<AdminEditProfile />} />
          <Route path="userreviews" element={<UserReviews />} />
          <Route path="wishlists" element={<Wishlists />} />

        </Route>

      </Routes>

    </Router>

  );

}