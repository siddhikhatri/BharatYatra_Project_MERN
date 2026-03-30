import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const quickLinks = [
    { label: 'Home', path : '/' },
    { label: 'Packages', path : '/packages' },
    { label: 'About Us', path : '/about' },
    { label: 'Contact Us', contact : '/contactus' },
    { label: 'My Bookings', href: '/bookings' },
  ];

  const destinations = [
    { label: 'Kashmir', href: '#' },
    { label: 'Goa', href: '#' },
    { label: 'Kerala', href: '#' },
    { label: 'Sikkim', href: '#' },
    { label: 'Gujarat', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-orange-400 rounded-full flex items-center justify-center font-bold text-2xl">
                ✈
              </div>
              <div>
                <span className="font-bold text-xl">Bharat</span>
                <span className="text-blue-400 font-bold text-xl"> Yatra</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for exploring the incredible beauty of India. Creating memories that last a 
              lifetime.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.2, backgroundColor: 'rgba(14, 165, 233, 0.2)' }}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Icon size={18} />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
          to={link.path}
          className="text-gray-400 hover:text-blue-400 transition-colors"
        >
          {link.label}
        </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Top Destinations */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h4 className="font-bold text-lg mb-6">Top Destinations</h4>
            <ul className="space-y-3">
              {destinations.map((dest) => (
                <li key={dest.label} className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-400" />
                  <button className="text-gray-400 hover:text-blue-400 transition-colors">
                    {dest.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-400 flex-shrink-0 mt-1" />
                <p className="text-gray-400">123 Travel Street, MG Road, New Delhi, India - 110001</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-blue-400 flex-shrink-0" />
                <p className="text-gray-400">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-blue-400 flex-shrink-0" />
                <p className="text-gray-400">info@bharatyatra.com</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="border-t border-gray-800 py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 Bharat Yatra. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">We Accept</span>
              <div className="flex gap-3">
                <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center">
                  💳
                </div>
                <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-bold">
                  VISA
                </div>
                <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-bold">
                  UPI
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}