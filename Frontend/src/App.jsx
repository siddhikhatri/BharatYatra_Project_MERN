import { BrowserRouter as Router, Routes, Route,useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Destinations from './pages/Destinations';
import MyBookings from './pages/MyBookings';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import Dashboard from '/src/pages/Dashboard';
import SignInPage from './pages/SignInPage';
import SignUp from './pages/SignUp';
import { useAuth } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";

import BookingModal from './components/BoookingModal';
import Invoices from './pages/Invoices';
import Reviews from './pages/Reviews';
import EditProfile from './pages/EditProfile';
import BookingInvoice from '/src/components/BookingInvoice';
import BookingDetails from './pages/BookingDetails';
// import PackageDetails from './pages/PackageDetails';

function Layout(){
  const location = useLocation();
  const hideNavbarRoutes = ["/dashboard", "/bookings","/invoices","/reviews","/editprofile","/booking-details"];

  return (<div className="bg-white text-gray-900 min-h-screen">

      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetails />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoices" element={<Invoices/>} />
        <Route path="/reviews" element={<Reviews/>} />
        <Route path="/bookinginvoice" element={<BookingInvoice/>} />
        <Route path="/booking-details" element={<BookingDetails/>} />
        <Route path='/editprofile' element={<EditProfile/>} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/SignInPage" element={<SignInPage />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>

      <Footer />

    </div>
  );
}








function App() {
  const { authModal, closeAuthModal } = useAuth();

  return (
    <Router>

      <Layout />

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialTab={authModal.tab}
      />

    </Router>
  );
}

export default App;