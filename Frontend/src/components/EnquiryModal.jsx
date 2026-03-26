import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail, Calendar, MessageSquare } from "lucide-react";
import axios from "axios";

export default function EnquiryModal({ isOpen, onClose, packageData }) {

  const [formData, setFormData] = useState({
    packageId: "",
    packageName: "",
    destination: "",
    price: "",
    travelDate: "",
    adults: "",
    children: "",
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    if (packageData) {
      setFormData(prev => ({
        ...prev,
        packageId: packageData._id,
        packageName: packageData.name,
        destination: packageData.destination,
        price: packageData.price
      }));
    }
  }, [packageData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.travelDate) {
      alert("Please fill required fields");
      return;
    }

    try {
      await axios.post("http://localhost:3000/packageEnquiryMail", formData);
      alert("Enquiry Sent Successfully ✅");
      onClose();
    } catch (err) {
      alert("Failed to send enquiry ❌");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70] p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
        >

          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">📩 Send Enquiry</h2>
              {/* <p className="text-blue-100 text-sm mt-1">
                {formData.packageName}
              </p> */}
            </div>
            <button onClick={onClose}>
              <X size={22} />
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-5">


            
              {/* Name */}
              <div>
                <label className="text-sm font-semibold">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-2 rounded-lg px-4 py-3 bg-gray-50"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-semibold">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-2 rounded-lg px-4 py-3 bg-gray-50"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-2 rounded-lg px-4 py-3 bg-gray-50"
                />
              </div>


              {/* Package Name */}
              <div>
                <label className="text-sm font-semibold">Package Name</label>
                <input
                  type="text"
                  readOnly
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleChange}
                  className="w-full border-2 rounded-lg px-4 py-3 bg-gray-50"
                />
              </div>


              {/* Travel Date */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Travel Date *
                </label>
                <input
                  type="date"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleChange}
                  className="w-full border-2 rounded-lg px-4 py-3 bg-gray-50"
                  required
                />
              </div>

              {/* Adults / Children */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Adults</label>
                  <input
                    type="number"
                    name="adults"
                    min="1"
                    value={formData.adults}
                    onChange={handleChange}
                    className="w-full border-2 rounded-lg px-4 py-3 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Children</label>
                  <input
                    type="number"
                    name="children"
                    min="0"
                    value={formData.children}
                    onChange={handleChange}
                    className="w-full border-2 rounded-lg px-4 py-3 bg-gray-50"
                  />
                </div>
              </div>

              
              {/* Message */}
              <div>
                <label className="text-sm font-semibold">Message</label>
                <textarea
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border-2 rounded-lg px-4 py-3 bg-gray-50"
                  placeholder="Any special request?"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg"
              >
                🚀 Submit Enquiry
              </motion.button>

            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}