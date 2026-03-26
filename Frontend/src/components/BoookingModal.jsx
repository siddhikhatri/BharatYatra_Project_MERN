// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Users, Calendar, MapPin, IndianRupee, Check } from 'lucide-react';
// import axios from 'axios';

// export default function BookingModal({ packageData, onClose }) {
//   const [bookingData, setBookingData] = useState({
//     email: "",
//     numTravelers: 1,
//     travelers: [{ name: '', phone: '', age: '' }],
//     departureDate: '',
//     specialRequests: '',
//   });

//   const [currentStep, setCurrentStep] = useState(1); // Step 1: Traveler, Step 2: Confirmation, Step 3: Payment

//   const totalPrice = bookingData.numTravelers * packageData.price;
//   const [paymentMethod, setPaymentMethod] = useState("upi");

//   const [paymentDetails, setPaymentDetails] = useState({
//     upiId: "",
//     cardNumber: "",
//     cardName: "",
//     expiry: "",
//     cvv: "",
//     bank: "",
//     wallet: ""
//   });
//   const handlePayment = async () => {

//     // basic validation
//     if (paymentMethod === "upi" && !paymentDetails.upiId) {
//       alert("Please enter UPI ID")
//       return
//     }

//     if (paymentMethod === "card" && (!paymentDetails.cardNumber || !paymentDetails.cvv)) {
//       alert("Please enter card details")
//       return
//     }

//     if (paymentMethod === "netbanking" && !paymentDetails.bank) {
//       alert("Please select bank")
//       return
//     }

//     alert("Processing Payment...");

//     setTimeout(async () => {

//       const currentUser = JSON.parse(localStorage.getItem("currentUser"));

//       const payload = {
//         bookingId: "BT-" + Date.now(),
//         userEmail: bookingData.email,
//         packageName: packageData.name,
//         location: packageData.location,
//         image: packageData.image,
//         travelers: bookingData.travelers,
//         departureDate: bookingData.departureDate,
//         price: packageData.price,
//         totalPrice: totalPrice,
//         paymentMethod: paymentMethod,
//         status: "Paid"
//       };

//       const res = await axios.post("http://localhost:3000/addBookingDetails", payload)

//       if (res.data.flag === 1) {
//         alert("Payment Successful! Booking Confirmed")
//         onClose()
//       }

//     }, 1500)

//   }

//   const handleNumTravelersChange = (num) => {
//     const newNum = Math.max(1, parseInt(num));
//     setBookingData((prev) => {
//       const newTravelers = [...prev.travelers];
//       if (newNum > prev.travelers.length) {
//         for (let i = prev.travelers.length; i < newNum; i++) {
//           newTravelers.push({ name: '', email: '', phone: '', age: '' });
//         }
//       } else {
//         newTravelers.splice(newNum);
//       }
//       return { ...prev, numTravelers: newNum, travelers: newTravelers };
//     });
//   };

//   const handleTravelerChange = (index, field, value) => {
//     setBookingData((prev) => {
//       const newTravelers = [...prev.travelers];
//       newTravelers[index] = { ...newTravelers[index], [field]: value };
//       return { ...prev, travelers: newTravelers };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (currentStep < 3) {
//       setCurrentStep(currentStep + 1);
//       return;
//     }

//     try {
//       const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//       const payload = {
//         bookingId: 'BT-' + Date.now(),
//         userEmail: bookingData.email,
//         packageName: packageData.name,
//         location: packageData.location,
//         image: packageData.image,
//         travelers: bookingData.travelers,
//         departureDate: bookingData.departureDate,
//         price: packageData.price,
//         totalPrice: totalPrice,
//         status: 'Pending',
//       };

//       const response = await axios.post(
//         'http://localhost:3000/addBookingDetails',
//         payload
//       );

//       if (response.data.flag === 1) {
//         alert('Payment Successful. Booking Confirmed!');
//         onClose();
//       } else {
//         alert('Booking failed! Please try again.');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Booking failed due to server error!');
//     }
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
//       >
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95, y: 20 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.95, y: 20 }}
//           onClick={(e) => e.stopPropagation()}
//           className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
//         >
//           {/* Header */}
//           <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex justify-between items-center z-10">
//             <div>
//               <h2 className="text-2xl font-bold">Complete Your Booking</h2>
//               <p className="text-blue-100 text-sm mt-1">{packageData.name}</p>
//             </div>
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={onClose}
//               className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all"
//             >
//               <X size={24} />
//             </motion.button>
//           </div>

//           {/* Step Indicator */}
//           <div className="px-6 py-4 bg-gray-50 flex justify-between items-center border-b">
//             {[1, 2, 3].map((step) => (
//               <div key={step} className="flex items-center gap-2">
//                 <motion.div
//                   animate={{ scale: currentStep >= step ? 1 : 0.8 }}
//                   className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${currentStep >= step ? 'bg-blue-500' : 'bg-gray-300'
//                     }`}
//                 >
//                   {currentStep > step ? <Check size={20} /> : step}
//                 </motion.div>
//                 <span className="font-semibold text-gray-700">
//                   {step === 1
//                     ? 'Traveler Details'
//                     : step === 2
//                       ? 'Confirmation'
//                       : 'Payment'}
//                 </span>
//                 {step !== 3 && (
//                   <div className="flex-1 h-1 mx-2 bg-gray-300">
//                     <motion.div
//                       animate={{ width: currentStep > step ? '100%' : '0%' }}
//                       className="h-full bg-blue-500"
//                     />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Form Content */}
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             {currentStep === 1 && (
//               <div className="space-y-6">
//                 {/* Travelers Info */}
//                 <div>
//                   <label className="block text-sm font-bold text-gray-900 mb-2">
//                     Number of Travelers
//                   </label>
//                   <div className="flex items-center gap-4">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         handleNumTravelersChange(bookingData.numTravelers - 1)
//                       }
//                       className="w-10 h-10 bg-blue-500 text-white rounded-full font-bold"
//                     >
//                       −
//                     </button>
//                     <input
//                       type="number"
//                       min="1"
//                       value={bookingData.numTravelers}
//                       onChange={(e) =>
//                         handleNumTravelersChange(e.target.value)
//                       }
//                       className="w-20 px-4 py-2 border rounded text-center"
//                     />
//                     <button
//                       type="button"
//                       onClick={() =>
//                         handleNumTravelersChange(bookingData.numTravelers + 1)
//                       }
//                       className="w-10 h-10 bg-blue-500 text-white rounded-full font-bold"
//                     >
//                       +
//                     </button>
//                     <span>Total: ₹{totalPrice.toLocaleString()}</span>
//                   </div>
//                 </div>


//                 {/* Email */}
                
//                 <div>
//                   <label className="block text-sm font-bold text-gray-900 mb-2">
//                     Email
//                   </label>

//                   <input
//                     type="email"
//                     placeholder="abc@email.com"
//                     value={bookingData.email}
//                     onChange={(e) =>
//                       setBookingData({
//                         ...bookingData,
//                         email: e.target.value
//                       })
//                     }
//                     required
//                     className="w-full border rounded px-3 py-2"
//                   />
//                 </div>

//                 {/* Traveler Details */}
//                 {bookingData.travelers.map((traveler, index) => (
//                   <div
//                     key={index}
//                     className="p-4 border rounded space-y-2 bg-gray-50"
//                   >
//                     <h4 className="font-bold">Traveler {index + 1}</h4>
//                     <input
//                       type="text"
//                       placeholder="Name"
//                       value={traveler.name}
//                       onChange={(e) =>
//                         handleTravelerChange(index, 'name', e.target.value)
//                       }
//                       required
//                       className="w-full border rounded px-3 py-2"
//                     />
//                     <input
//                       type="tel"
//                       placeholder="Phone"
//                       value={traveler.phone}
//                       onChange={(e) =>
//                         handleTravelerChange(index, 'phone', e.target.value)
//                       }
//                       required
//                       className="w-full border rounded px-3 py-2"
//                     />
//                     <input
//                       type="number"
//                       placeholder="Age"
//                       min="1"
//                       max="120"
//                       value={traveler.age}
//                       onChange={(e) =>
//                         handleTravelerChange(index, 'age', e.target.value)
//                       }
//                       required
//                       className="w-full border rounded px-3 py-2"
//                     />
//                   </div>
//                 ))}

//                 {/* Departure Date */}
//                 <div>
//                   <label className="block text-sm font-bold text-gray-900 mb-2">
//                     Departure Date
//                   </label>
//                   <input
//                     type="date"
//                     value={bookingData.departureDate}
//                     onChange={(e) =>
//                       setBookingData({
//                         ...bookingData,
//                         departureDate: e.target.value,
//                       })
//                     }
//                     required
//                     className="w-full border rounded px-3 py-2"
//                   />
//                 </div>

//                 {/* Special Requests */}
//                 <div>
//                   <label className="block text-sm font-bold text-gray-900 mb-2">
//                     Special Requests
//                   </label>
//                   <textarea
//                     rows="3"
//                     placeholder="Any preferences..."
//                     value={bookingData.specialRequests}
//                     onChange={(e) =>
//                       setBookingData({
//                         ...bookingData,
//                         specialRequests: e.target.value,
//                       })
//                     }
//                     className="w-full border rounded px-3 py-2 resize-none"
//                   />
//                 </div>
//               </div>
//             )}

//             {currentStep === 2 && (
//               <div className="space-y-4">
//                 <h3 className="text-xl font-bold">Booking Summary</h3>
//                 <div className="p-4 border rounded bg-gray-50 space-y-2">
//                   <div className="flex justify-between">
//                     <span>Package:</span>
//                     <span className="font-bold">{packageData.name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Location:</span>
//                     <span className="font-bold">{packageData.location}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Departure:</span>
//                     <span className="font-bold">
//                       {new Date(bookingData.departureDate).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between border-t pt-2">
//                     <span>Total:</span>
//                     <span className="font-bold text-blue-600">
//                       ₹{totalPrice.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>

//                 <label className="flex items-start gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     required
//                     className="w-5 h-5 mt-1 accent-blue-500"
//                   />
//                   <span className="text-sm text-gray-700">
//                     I agree to terms and conditions
//                   </span>
//                 </label>
//               </div>
//             )}

//             {currentStep === 3 && (
//               <div className="space-y-6">

//                 <h3 className="text-xl font-bold text-gray-900">Select Payment Method</h3>

//                 {/* Payment Options */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

//                   <button
//                     type="button"
//                     onClick={() => setPaymentMethod("upi")}
//                     className={`p-3 border rounded-lg ${paymentMethod === "upi" ? "border-blue-500 bg-blue-50" : ""}`}
//                   >
//                     UPI
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => setPaymentMethod("card")}
//                     className={`p-3 border rounded-lg ${paymentMethod === "card" ? "border-blue-500 bg-blue-50" : ""}`}
//                   >
//                     Card
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => setPaymentMethod("netbanking")}
//                     className={`p-3 border rounded-lg ${paymentMethod === "netbanking" ? "border-blue-500 bg-blue-50" : ""}`}
//                   >
//                     Net Banking
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => setPaymentMethod("wallet")}
//                     className={`p-3 border rounded-lg ${paymentMethod === "wallet" ? "border-blue-500 bg-blue-50" : ""}`}
//                   >
//                     Wallet
//                   </button>

//                 </div>

//                 {/* UPI */}
//                 {paymentMethod === "upi" && (
//                   <div className="space-y-3">
//                     <label className="font-semibold">Enter UPI ID</label>

//                     <input
//                       type="text"
//                       placeholder="example@upi"
//                       className="w-full border rounded-lg px-4 py-2"
//                       onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
//                     />

//                   </div>
//                 )}

//                 {/* Card */}
//                 {paymentMethod === "card" && (
//                   <div className="space-y-3">

//                     <input
//                       type="text"
//                       placeholder="Card Number"
//                       className="w-full border rounded-lg px-4 py-2"
//                       onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
//                     />

//                     <input
//                       type="text"
//                       placeholder="Card Holder Name"
//                       className="w-full border rounded-lg px-4 py-2"
//                       onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
//                     />

//                     <div className="grid grid-cols-2 gap-3">

//                       <input
//                         type="text"
//                         placeholder="MM/YY"
//                         className="border rounded-lg px-4 py-2"
//                         onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
//                       />

//                       <input
//                         type="password"
//                         placeholder="CVV"
//                         className="border rounded-lg px-4 py-2"
//                         onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
//                       />

//                     </div>

//                   </div>
//                 )}

//                 {/* Net Banking */}
//                 {paymentMethod === "netbanking" && (

//                   <select
//                     className="w-full border rounded-lg px-4 py-2"
//                     onChange={(e) => setPaymentDetails({ ...paymentDetails, bank: e.target.value })}
//                   >

//                     <option value="">Select Bank</option>
//                     <option>SBI</option>
//                     <option>HDFC</option>
//                     <option>ICICI</option>
//                     <option>Axis Bank</option>
//                     <option>Kotak</option>

//                   </select>

//                 )}

//                 {/* Wallet */}
//                 {paymentMethod === "wallet" && (

//                   <select
//                     className="w-full border rounded-lg px-4 py-2"
//                     onChange={(e) => setPaymentDetails({ ...paymentDetails, wallet: e.target.value })}
//                   >

//                     <option value="">Select Wallet</option>
//                     <option>Paytm</option>
//                     <option>PhonePe</option>
//                     <option>Amazon Pay</option>

//                   </select>

//                 )}

//                 {/* Pay Button */}
//                 <button
//                   type="button"
//                   onClick={handlePayment}
//                   className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600"
//                 >

//                   Pay ₹{totalPrice}

//                 </button>

//               </div>
//             )}

//             {/* Footer Buttons */}
//             <div className="flex gap-3 mt-4">
//               {currentStep > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => setCurrentStep(currentStep - 1)}
//                   className="flex-1 border border-gray-300 rounded py-3 font-bold hover:bg-gray-50"
//                 >
//                   Back
//                 </button>
//               )}
//               <button
//                 type="submit"
//                 className="flex-1 bg-orange-500 text-white rounded py-3 font-bold hover:bg-orange-600"
//               >
//                 {currentStep === 1
//                   ? 'Continue'
//                   : currentStep === 2
//                     ? 'Confirm & Pay'
//                     : 'Confirm Booking'}
//               </button>
//             </div>
//           </form>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }


//below is of claude
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   X, Users, MapPin, CheckCircle, ChevronRight, ChevronLeft,
//   Calendar, Clock, CreditCard, Smartphone, Building2, Wallet,
//   Shield, Lock, Star, AlertCircle, Loader2
// } from 'lucide-react';
// import axios from 'axios';

// // ─── helpers ───────────────────────────────────────────────────────────────────
// const fmtDate = (d) =>
//   d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

// const STEPS = [
//   { id: 1, label: 'Trip Details' },
//   { id: 2, label: 'Travelers'    },
//   { id: 3, label: 'Summary'      },
//   { id: 4, label: 'Payment'      },
// ];

// const PAYMENT_METHODS = [
//   { id: 'upi',        label: 'UPI',         icon: Smartphone,  desc: 'Pay via any UPI app'       },
//   { id: 'card',       label: 'Card',        icon: CreditCard,  desc: 'Credit / Debit card'       },
//   { id: 'netbanking', label: 'Net Banking', icon: Building2,   desc: 'All major banks supported' },
//   { id: 'wallet',     label: 'Wallet',      icon: Wallet,      desc: 'Paytm, PhonePe & more'     },
// ];

// const UPI_APPS   = ['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'];
// const BANKS      = ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'PNB', 'Bank of Baroda'];
// const WALLETS    = ['Paytm', 'PhonePe', 'Amazon Pay', 'MobiKwik', 'Freecharge'];

// // ─── main component ────────────────────────────────────────────────────────────
// export default function BookingModal({ packageData, onClose }) {

//   // step
//   const [step, setStep] = useState(1);

//   // departure selection
//   const [selectedDeparture, setSelectedDeparture] = useState(null);

//   // traveler data
//   const [email, setEmail]               = useState('');
//   const [numTravelers, setNumTravelers] = useState(1);
//   const [travelers, setTravelers]       = useState([{ name: '', phone: '', age: '' }]);
//   const [specialRequests, setSpecialRequests] = useState('');

//   // payment
//   const [paymentMethod, setPaymentMethod]   = useState('upi');
//   const [selectedUpiApp, setSelectedUpiApp] = useState('');
//   const [paymentDetails, setPaymentDetails] = useState({
//     upiId: '', cardNumber: '', cardName: '', expiry: '', cvv: '', bank: '', wallet: '',
//   });
//   const [agreed, setAgreed]     = useState(false);
//   const [loading, setLoading]   = useState(false);
//   const [success, setSuccess]   = useState(false);
//   const [bookingRef, setBookingRef] = useState('');
//   const [error, setError]       = useState('');

//   // computed
//   const departures      = packageData?.departures || [];
//   const pricePerPerson  = selectedDeparture?.priceOverride || packageData?.price || 0;
//   const totalPrice      = numTravelers * pricePerPerson;
//   const seatsLeft       = selectedDeparture
//     ? selectedDeparture.totalSeats - (selectedDeparture.bookedCount || 0)
//     : null;

//   // sync travelers array length
//   useEffect(() => {
//     setTravelers((prev) => {
//       const updated = [...prev];
//       while (updated.length < numTravelers) updated.push({ name: '', phone: '', age: '' });
//       return updated.slice(0, numTravelers);
//     });
//   }, [numTravelers]);

//   // ── navigation ───────────────────────────────────────────────────────────────
//   const canProceed = () => {
//     if (step === 1) return !!selectedDeparture;
//     if (step === 2) {
//       if (!email) return false;
//       return travelers.every(t => t.name && t.phone && t.age);
//     }
//     if (step === 3) return agreed;
//     return true;
//   };

//   const next = () => { setError(''); if (canProceed()) setStep(s => s + 1); };
//   const back = () => { setError(''); setStep(s => s - 1); };

//   // ── payment ──────────────────────────────────────────────────────────────────
//   const handlePayment = async () => {
//     setError('');

//     // validate payment fields
//     if (paymentMethod === 'upi' && !paymentDetails.upiId && !selectedUpiApp) {
//       setError('Please enter UPI ID or select a UPI app.'); return;
//     }
//     if (paymentMethod === 'card') {
//       if (!paymentDetails.cardNumber || !paymentDetails.cardName || !paymentDetails.expiry || !paymentDetails.cvv) {
//         setError('Please fill all card details.'); return;
//       }
//     }
//     if (paymentMethod === 'netbanking' && !paymentDetails.bank) {
//       setError('Please select a bank.'); return;
//     }
//     if (paymentMethod === 'wallet' && !paymentDetails.wallet) {
//       setError('Please select a wallet.'); return;
//     }

//     setLoading(true);
//     try {
//       // 1. Decrement departure seats
//       await axios.post(
//         `http://localhost:3000/bookDeparture/${packageData._id}/${selectedDeparture._id}`,
//         { travellers: numTravelers }
//       );

//       // 2. Save booking record
//       const ref = 'BT-' + Date.now();
//       const payload = {
//         bookingId:      ref,
//         userEmail:      email,
//         packageId:      packageData._id,
//         packageName:    packageData.name,
//         location:       packageData.location,
//         image:          packageData.image,
//         travelers:      travelers,
//         departureId:    selectedDeparture._id,
//         departureDate:  selectedDeparture.startDate,
//         endDate:        selectedDeparture.endDate,
//         price:          pricePerPerson,
//         totalPrice:     totalPrice,
//         paymentMethod:  paymentMethod,
//         specialRequests,
//         status:         'Paid',
//       };

//       const res = await axios.post('http://localhost:3000/addBookingDetails', payload);

//       if (res.data.flag === 1) {
//         setBookingRef(ref);
//         setSuccess(true);
//       } else {
//         setError('Booking record could not be saved. Please contact support.');
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.msg || 'Payment failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── traveler helpers ─────────────────────────────────────────────────────────
//   const updateTraveler = (i, field, val) =>
//     setTravelers(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val } : t));

//   const formatCard = (val) =>
//     val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

//   const formatExpiry = (val) => {
//     const clean = val.replace(/\D/g, '').slice(0, 4);
//     return clean.length >= 2 ? clean.slice(0, 2) + '/' + clean.slice(2) : clean;
//   };

//   // ── success screen ───────────────────────────────────────────────────────────
//   if (success) {
//     return (
//       <AnimatePresence>
//         <motion.div
//           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
//         >
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
//             transition={{ type: 'spring', stiffness: 200, damping: 20 }}
//             className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl"
//           >
//             <motion.div
//               initial={{ scale: 0 }} animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
//               className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
//             >
//               <CheckCircle className="w-12 h-12 text-green-500" />
//             </motion.div>

//             <h2 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed!</h2>
//             <p className="text-gray-500 text-sm mb-6">Your trip is all set. Have a great journey 🎉</p>

//             <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 mb-6 border border-gray-100">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Booking Ref</span>
//                 <span className="font-bold text-[#00A3E1] font-mono">{bookingRef}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Package</span>
//                 <span className="font-semibold text-gray-800 text-right max-w-[55%]">{packageData.name}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Departure</span>
//                 <span className="font-semibold text-gray-800">{fmtDate(selectedDeparture?.startDate)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Travelers</span>
//                 <span className="font-semibold text-gray-800">{numTravelers}</span>
//               </div>
//               <div className="flex justify-between text-sm border-t pt-3">
//                 <span className="text-gray-500">Amount Paid</span>
//                 <span className="font-bold text-green-600 text-base">₹{totalPrice.toLocaleString()}</span>
//               </div>
//             </div>

//             <p className="text-xs text-gray-400 mb-5">Confirmation has been sent to <b>{email}</b></p>

//             <button
//               onClick={onClose}
//               className="w-full py-3 bg-[#00A3E1] text-white font-bold rounded-xl hover:bg-[#008cc2] transition"
//             >
//               Done
//             </button>
//           </motion.div>
//         </motion.div>
//       </AnimatePresence>
//     );
//   }

//   // ── main modal ───────────────────────────────────────────────────────────────
//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
//       >
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95, y: 20 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.95, y: 20 }}
//           onClick={(e) => e.stopPropagation()}
//           className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
//         >

//           {/* ── Header ── */}
//           <div className="bg-[#00A3E1] text-white px-7 py-5 flex items-center justify-between flex-shrink-0">
//             <div>
//               <h2 className="text-xl font-bold">Complete Your Booking</h2>
//               <p className="text-blue-100 text-sm mt-0.5 truncate max-w-xs">{packageData?.name}</p>
//             </div>
//             <button onClick={onClose}
//               className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
//               <X size={20} />
//             </button>
//           </div>

//           {/* ── Step bar ── */}
//           <div className="flex items-center px-7 py-4 bg-gray-50 border-b gap-2 flex-shrink-0">
//             {STEPS.map((s, i) => (
//               <div key={s.id} className="flex items-center flex-1 last:flex-none">
//                 <div className="flex items-center gap-2 flex-shrink-0">
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
//                     ${step > s.id ? 'bg-green-500 text-white' : step === s.id ? 'bg-[#00A3E1] text-white' : 'bg-gray-200 text-gray-400'}`}>
//                     {step > s.id ? <CheckCircle size={16} /> : s.id}
//                   </div>
//                   <span className={`text-xs font-semibold whitespace-nowrap ${step >= s.id ? 'text-gray-800' : 'text-gray-400'}`}>
//                     {s.label}
//                   </span>
//                 </div>
//                 {i < STEPS.length - 1 && (
//                   <div className="flex-1 h-[2px] mx-2 bg-gray-200 rounded-full overflow-hidden">
//                     <motion.div animate={{ width: step > s.id ? '100%' : '0%' }}
//                       className="h-full bg-[#00A3E1]" transition={{ duration: 0.3 }} />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* ── Scrollable content ── */}
//           <div className="flex-1 overflow-y-auto px-7 py-6 custom-scrollbar">
//             <AnimatePresence mode="wait">
//               <motion.div key={step}
//                 initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
//                 className="space-y-5"
//               >

//                 {/* ══ STEP 1: SELECT DEPARTURE ══ */}
//                 {step === 1 && (
//                   <div className="space-y-5">
//                     <div>
//                       <h3 className="text-base font-bold text-gray-900 mb-1">Select Your Departure Date</h3>
//                       <p className="text-sm text-gray-500">Pick a slot that works for you. Seats are limited.</p>
//                     </div>

//                     {departures.length === 0 ? (
//                       <div className="flex items-center gap-3 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
//                         <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
//                         <p className="text-sm text-amber-700">No departure slots available for this package yet. Please check back later.</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-3">
//                         {departures.map((dep) => {
//                           const left   = dep.totalSeats - (dep.bookedCount || 0);
//                           const isFull = left <= 0;
//                           const isSelected = selectedDeparture?._id === dep._id;
//                           const price  = dep.priceOverride || packageData.price;

//                           return (
//                             <button
//                               key={dep._id}
//                               type="button"
//                               disabled={isFull}
//                               onClick={() => !isFull && setSelectedDeparture(dep)}
//                               className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-200
//                                 ${isFull ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50'
//                                   : isSelected ? 'border-[#00A3E1] bg-blue-50 shadow-md shadow-blue-100'
//                                   : 'border-gray-200 hover:border-[#00A3E1]/40 hover:bg-gray-50 cursor-pointer'}`}
//                             >
//                               <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                   {/* Selection indicator */}
//                                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
//                                     ${isSelected ? 'border-[#00A3E1] bg-[#00A3E1]' : 'border-gray-300'}`}>
//                                     {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
//                                   </div>

//                                   <div>
//                                     <div className="flex items-center gap-2">
//                                       <Calendar size={14} className="text-[#00A3E1]" />
//                                       <span className="font-bold text-gray-900 text-sm">
//                                         {fmtDate(dep.startDate)}
//                                       </span>
//                                       <span className="text-gray-400 text-sm">→</span>
//                                       <span className="font-semibold text-gray-700 text-sm">
//                                         {fmtDate(dep.endDate)}
//                                       </span>
//                                     </div>
//                                     <div className="flex items-center gap-3 mt-1.5">
//                                       <div className="flex items-center gap-1">
//                                         <Clock size={12} className="text-gray-400" />
//                                         <span className="text-xs text-gray-500">
//                                           {packageData.days}D / {packageData.nights}N
//                                         </span>
//                                       </div>
//                                       <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
//                                         ${isFull ? 'bg-red-100 text-red-600'
//                                           : left <= 5 ? 'bg-amber-100 text-amber-700'
//                                           : 'bg-green-100 text-green-700'}`}>
//                                         {isFull ? 'Sold Out' : `${left} seats left`}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 <div className="text-right flex-shrink-0">
//                                   <p className="text-lg font-bold text-[#00A3E1]">₹{price.toLocaleString()}</p>
//                                   <p className="text-xs text-gray-400">per person</p>
//                                 </div>
//                               </div>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     )}

//                     {/* Number of travelers — shown after selecting a slot */}
//                     {selectedDeparture && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//                         className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4"
//                       >
//                         <div>
//                           <label className="text-sm font-bold text-gray-800 block mb-3">Number of Travelers</label>
//                           <div className="flex items-center gap-4">
//                             <button type="button"
//                               onClick={() => setNumTravelers(n => Math.max(1, n - 1))}
//                               className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 font-bold text-gray-600 hover:border-[#00A3E1] hover:text-[#00A3E1] transition flex items-center justify-center text-lg">
//                               −
//                             </button>
//                             <span className="text-2xl font-bold text-gray-900 w-8 text-center">{numTravelers}</span>
//                             <button type="button"
//                               onClick={() => setNumTravelers(n => Math.min(seatsLeft, n + 1))}
//                               className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 font-bold text-gray-600 hover:border-[#00A3E1] hover:text-[#00A3E1] transition flex items-center justify-center text-lg">
//                               +
//                             </button>
//                             <div className="ml-2">
//                               <p className="text-sm text-gray-500">Total amount</p>
//                               <p className="text-xl font-bold text-[#00A3E1]">₹{totalPrice.toLocaleString()}</p>
//                             </div>
//                           </div>
//                           {numTravelers >= seatsLeft && (
//                             <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
//                               <AlertCircle size={12} /> Max seats available for this departure
//                             </p>
//                           )}
//                         </div>
//                       </motion.div>
//                     )}

//                     {!selectedDeparture && departures.length > 0 && (
//                       <p className="text-xs text-gray-400 text-center">← Select a departure slot to continue</p>
//                     )}
//                   </div>
//                 )}

//                 {/* ══ STEP 2: TRAVELER DETAILS ══ */}
//                 {step === 2 && (
//                   <div className="space-y-5">
//                     <div>
//                       <h3 className="text-base font-bold text-gray-900 mb-1">Traveler Details</h3>
//                       <p className="text-sm text-gray-500">Fill in details for all {numTravelers} traveler(s).</p>
//                     </div>

//                     {/* Email */}
//                     <div>
//                       <label className="text-sm font-bold text-gray-700 block mb-1.5">Contact Email *</label>
//                       <input type="email" value={email} placeholder="abc@email.com" required
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm" />
//                     </div>

//                     {/* Traveler cards */}
//                     {travelers.map((t, i) => (
//                       <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden">
//                         <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b">
//                           <div className="w-7 h-7 rounded-full bg-[#00A3E1]/10 text-[#00A3E1] text-xs font-bold flex items-center justify-center">
//                             {i + 1}
//                           </div>
//                           <span className="font-semibold text-gray-800 text-sm">Traveler {i + 1}</span>
//                           {i === 0 && <span className="text-xs bg-[#00A3E1]/10 text-[#00A3E1] px-2 py-0.5 rounded-full font-medium">Primary</span>}
//                         </div>
//                         <div className="p-5 grid grid-cols-3 gap-4">
//                           <div className="col-span-3">
//                             <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name *</label>
//                             <input type="text" value={t.name} placeholder="e.g. Rahul Sharma" required
//                               onChange={(e) => updateTraveler(i, 'name', e.target.value)}
//                               className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm" />
//                           </div>
//                           <div className="col-span-2">
//                             <label className="text-xs font-semibold text-gray-600 block mb-1">Phone *</label>
//                             <input type="tel" value={t.phone} placeholder="9876543210" required maxLength={10}
//                               onChange={(e) => updateTraveler(i, 'phone', e.target.value)}
//                               className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm" />
//                           </div>
//                           <div>
//                             <label className="text-xs font-semibold text-gray-600 block mb-1">Age *</label>
//                             <input type="number" value={t.age} placeholder="28" min={1} max={120} required
//                               onChange={(e) => updateTraveler(i, 'age', e.target.value)}
//                               className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm" />
//                           </div>
//                         </div>
//                       </div>
//                     ))}

//                     {/* Special requests */}
//                     <div>
//                       <label className="text-sm font-bold text-gray-700 block mb-1.5">
//                         Special Requests <span className="text-gray-400 font-normal">(optional)</span>
//                       </label>
//                       <textarea rows={3} value={specialRequests} placeholder="Vegetarian meals, wheelchair access, anniversary celebration..."
//                         onChange={(e) => setSpecialRequests(e.target.value)}
//                         className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm resize-none" />
//                     </div>
//                   </div>
//                 )}

//                 {/* ══ STEP 3: BOOKING SUMMARY ══ */}
//                 {step === 3 && (
//                   <div className="space-y-5">
//                     <h3 className="text-base font-bold text-gray-900">Review Your Booking</h3>

//                     {/* Package card */}
//                     <div className="rounded-2xl border border-gray-200 overflow-hidden">
//                       {packageData.image && (
//                         <img
//                           src={`http://localhost:3000/Images/${packageData.image}`}
//                           alt={packageData.name}
//                           className="w-full h-36 object-cover"
//                           onError={(e) => e.target.style.display = 'none'}
//                         />
//                       )}
//                       <div className="p-5 space-y-3">
//                         <div className="flex items-start justify-between gap-2">
//                           <div>
//                             <h4 className="font-bold text-gray-900">{packageData.name}</h4>
//                             <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
//                               <MapPin size={13} /> {packageData.destination}
//                             </div>
//                           </div>
//                           <span className="bg-[#00A3E1]/10 text-[#00A3E1] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
//                             {packageData.days}D / {packageData.nights}N
//                           </span>
//                         </div>

//                         <div className="border-t pt-3 space-y-2">
//                           <Row label="Departure" value={fmtDate(selectedDeparture?.startDate)} />
//                           <Row label="Return"     value={fmtDate(selectedDeparture?.endDate)} />
//                           <Row label="Travelers"  value={`${numTravelers} person(s)`} />
//                           <Row label="Contact"    value={email} />
//                         </div>

//                         <div className="border-t pt-3 space-y-2">
//                           <Row label={`₹${pricePerPerson.toLocaleString()} × ${numTravelers}`}
//                                value={`₹${totalPrice.toLocaleString()}`} />
//                           <Row label="Taxes & Fees" value="Included" valueClass="text-green-600" />
//                           <div className="flex justify-between pt-2 border-t">
//                             <span className="font-bold text-gray-900">Total Payable</span>
//                             <span className="font-bold text-xl text-[#00A3E1]">₹{totalPrice.toLocaleString()}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Terms */}
//                     <label className="flex items-start gap-3 cursor-pointer group">
//                       <div
//                         onClick={() => setAgreed(a => !a)}
//                         className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer
//                           ${agreed ? 'bg-[#00A3E1] border-[#00A3E1]' : 'border-gray-300 group-hover:border-[#00A3E1]'}`}>
//                         {agreed && <CheckCircle size={12} className="text-white" strokeWidth={3} />}
//                       </div>
//                       <span className="text-sm text-gray-600 leading-snug">
//                         I agree to the <span className="text-[#00A3E1] font-semibold underline cursor-pointer">Terms & Conditions</span> and{' '}
//                         <span className="text-[#00A3E1] font-semibold underline cursor-pointer">Cancellation Policy</span>.
//                         I confirm all traveler details are correct.
//                       </span>
//                     </label>
//                   </div>
//                 )}

//                 {/* ══ STEP 4: PAYMENT ══ */}
//                 {step === 4 && (
//                   <div className="space-y-5">

//                     {/* Amount pill */}
//                     <div className="flex items-center justify-between bg-[#00A3E1]/8 border border-[#00A3E1]/20 rounded-2xl px-5 py-4">
//                       <div>
//                         <p className="text-xs text-gray-500 font-medium">Amount to Pay</p>
//                         <p className="text-2xl font-bold text-[#00A3E1]">₹{totalPrice.toLocaleString()}</p>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-gray-400">
//                         <Shield size={14} className="text-green-500" />
//                         <span>100% Secure</span>
//                         <Lock size={14} className="text-green-500" />
//                         <span>Encrypted</span>
//                       </div>
//                     </div>

//                     {/* Payment method tabs */}
//                     <div>
//                       <p className="text-sm font-bold text-gray-700 mb-3">Select Payment Method</p>
//                       <div className="grid grid-cols-2 gap-3">
//                         {PAYMENT_METHODS.map((m) => {
//                           const Icon = m.icon;
//                           return (
//                             <button key={m.id} type="button"
//                               onClick={() => setPaymentMethod(m.id)}
//                               className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all
//                                 ${paymentMethod === m.id
//                                   ? 'border-[#00A3E1] bg-blue-50 shadow-sm'
//                                   : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
//                               <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
//                                 ${paymentMethod === m.id ? 'bg-[#00A3E1] text-white' : 'bg-gray-100 text-gray-500'}`}>
//                                 <Icon size={18} />
//                               </div>
//                               <div>
//                                 <p className={`text-sm font-bold ${paymentMethod === m.id ? 'text-[#00A3E1]' : 'text-gray-700'}`}>
//                                   {m.label}
//                                 </p>
//                                 <p className="text-xs text-gray-400">{m.desc}</p>
//                               </div>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>

//                     {/* ── UPI ── */}
//                     {paymentMethod === 'upi' && (
//                       <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
//                         className="space-y-4">
//                         {/* UPI app quick-select */}
//                         <div>
//                           <p className="text-xs font-semibold text-gray-500 mb-2">Quick Select App</p>
//                           <div className="flex gap-2 flex-wrap">
//                             {UPI_APPS.map(app => (
//                               <button key={app} type="button"
//                                 onClick={() => setSelectedUpiApp(app)}
//                                 className={`px-4 py-2 rounded-xl text-sm font-medium border transition
//                                   ${selectedUpiApp === app ? 'bg-[#00A3E1] text-white border-[#00A3E1]' : 'border-gray-200 text-gray-600 hover:border-[#00A3E1]/50'}`}>
//                                 {app}
//                               </button>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <div className="flex-1 h-px bg-gray-200" />
//                           <span className="text-xs text-gray-400">or enter manually</span>
//                           <div className="flex-1 h-px bg-gray-200" />
//                         </div>
//                         <div>
//                           <label className="text-xs font-semibold text-gray-600 block mb-1.5">UPI ID</label>
//                           <input type="text" placeholder="yourname@upi"
//                             value={paymentDetails.upiId}
//                             onChange={(e) => setPaymentDetails(p => ({ ...p, upiId: e.target.value }))}
//                             className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm" />
//                         </div>
//                       </motion.div>
//                     )}

//                     {/* ── CARD ── */}
//                     {paymentMethod === 'card' && (
//                       <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
//                         className="space-y-4">
//                         {/* Card preview */}
//                         <div className="h-40 bg-gradient-to-br from-[#00A3E1] to-[#0072a3] rounded-2xl p-5 text-white relative overflow-hidden">
//                           <div className="absolute inset-0 opacity-10">
//                             <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white" />
//                             <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-white" />
//                           </div>
//                           <div className="relative z-10 h-full flex flex-col justify-between">
//                             <div className="flex justify-between items-start">
//                               <CreditCard size={28} />
//                               <span className="text-xs font-semibold opacity-75">DEBIT / CREDIT</span>
//                             </div>
//                             <div>
//                               <p className="font-mono text-lg tracking-widest">
//                                 {paymentDetails.cardNumber
//                                   ? paymentDetails.cardNumber.padEnd(19, '·').slice(0, 19)
//                                   : '•••• •••• •••• ••••'}
//                               </p>
//                               <div className="flex justify-between mt-2 text-xs opacity-80">
//                                 <span>{paymentDetails.cardName || 'CARD HOLDER NAME'}</span>
//                                 <span>{paymentDetails.expiry || 'MM/YY'}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <div>
//                           <label className="text-xs font-semibold text-gray-600 block mb-1.5">Card Number</label>
//                           <input type="text" placeholder="1234 5678 9012 3456" maxLength={19}
//                             value={paymentDetails.cardNumber}
//                             onChange={(e) => setPaymentDetails(p => ({ ...p, cardNumber: formatCard(e.target.value) }))}
//                             className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm font-mono" />
//                         </div>
//                         <div>
//                           <label className="text-xs font-semibold text-gray-600 block mb-1.5">Card Holder Name</label>
//                           <input type="text" placeholder="As on card"
//                             value={paymentDetails.cardName}
//                             onChange={(e) => setPaymentDetails(p => ({ ...p, cardName: e.target.value.toUpperCase() }))}
//                             className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm uppercase" />
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <label className="text-xs font-semibold text-gray-600 block mb-1.5">Expiry Date</label>
//                             <input type="text" placeholder="MM/YY" maxLength={5}
//                               value={paymentDetails.expiry}
//                               onChange={(e) => setPaymentDetails(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
//                               className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm font-mono" />
//                           </div>
//                           <div>
//                             <label className="text-xs font-semibold text-gray-600 block mb-1.5">CVV</label>
//                             <input type="password" placeholder="•••" maxLength={4}
//                               value={paymentDetails.cvv}
//                               onChange={(e) => setPaymentDetails(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))}
//                               className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm font-mono" />
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}

//                     {/* ── NET BANKING ── */}
//                     {paymentMethod === 'netbanking' && (
//                       <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
//                         className="space-y-3">
//                         <p className="text-xs font-semibold text-gray-500 mb-2">Popular Banks</p>
//                         <div className="grid grid-cols-2 gap-2">
//                           {BANKS.map(bank => (
//                             <button key={bank} type="button"
//                               onClick={() => setPaymentDetails(p => ({ ...p, bank }))}
//                               className={`py-3 px-4 rounded-xl border text-sm font-medium text-left transition
//                                 ${paymentDetails.bank === bank ? 'border-[#00A3E1] bg-blue-50 text-[#00A3E1]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
//                               {bank}
//                             </button>
//                           ))}
//                         </div>
//                       </motion.div>
//                     )}

//                     {/* ── WALLET ── */}
//                     {paymentMethod === 'wallet' && (
//                       <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
//                         className="grid grid-cols-3 gap-3">
//                         {WALLETS.map(w => (
//                           <button key={w} type="button"
//                             onClick={() => setPaymentDetails(p => ({ ...p, wallet: w }))}
//                             className={`py-4 rounded-2xl border-2 text-sm font-semibold transition
//                               ${paymentDetails.wallet === w ? 'border-[#00A3E1] bg-blue-50 text-[#00A3E1]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
//                             {w}
//                           </button>
//                         ))}
//                       </motion.div>
//                     )}

//                     {/* Error message */}
//                     {error && (
//                       <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
//                         <AlertCircle size={15} className="flex-shrink-0" />
//                         {error}
//                       </div>
//                     )}

//                     {/* Pay button */}
//                     <button type="button" onClick={handlePayment} disabled={loading}
//                       className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition shadow-lg shadow-orange-200 flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed">
//                       {loading
//                         ? <><Loader2 size={20} className="animate-spin" /> Processing…</>
//                         : <>Pay ₹{totalPrice.toLocaleString()} <ChevronRight size={18} /></>
//                       }
//                     </button>

//                     <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
//                       <Shield size={12} className="text-green-500" />
//                       Your payment is 256-bit SSL encrypted and secure
//                     </p>
//                   </div>
//                 )}

//               </motion.div>
//             </AnimatePresence>
//           </div>

//           {/* ── Footer nav ── */}
//           {step < 4 && (
//             <div className="px-7 py-5 border-t bg-gray-50/50 flex items-center gap-3 flex-shrink-0">
//               {step > 1 && (
//                 <button type="button" onClick={back}
//                   className="flex items-center gap-1.5 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:border-gray-300 transition">
//                   <ChevronLeft size={16} /> Back
//                 </button>
//               )}
//               <button type="button" onClick={next} disabled={!canProceed()}
//                 className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00A3E1] text-white font-bold hover:bg-[#008cc2] transition shadow-md shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed">
//                 {step === 3 ? 'Proceed to Payment' : 'Continue'}
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           )}

//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }

// // ── small helper component ────────────────────────────────────────────────────
// function Row({ label, value, valueClass = 'text-gray-800' }) {
//   return (
//     <div className="flex justify-between items-center text-sm">
//       <span className="text-gray-500">{label}</span>
//       <span className={`font-semibold ${valueClass}`}>{value}</span>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle, ChevronRight, ChevronLeft,
  Calendar, Clock, CreditCard, Smartphone, Building2,
  Wallet, Shield, Lock, AlertCircle, Loader2, MapPin,
  QrCode, ScanLine, Copy, Check,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext';

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—';

const STEPS = [
  { id: 1, label: 'Select Date' },
  { id: 2, label: 'Travelers'  },
  { id: 3, label: 'Summary'    },
  { id: 4, label: 'Payment'    },
];

const PAYMENT_METHODS = [
  { id: 'upi',        label: 'UPI',         icon: Smartphone,  desc: 'Any UPI app'           },
  { id: 'qr',         label: 'Scan & Pay',  icon: QrCode,      desc: 'Scan QR to pay'        },
  { id: 'card',       label: 'Card',        icon: CreditCard,  desc: 'Credit / Debit card'   },
  { id: 'netbanking', label: 'Net Banking', icon: Building2,   desc: 'All major banks'       },
  { id: 'wallet',     label: 'Wallet',      icon: Wallet,      desc: 'Paytm, PhonePe & more' },
];

const BANKS   = ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'PNB', 'Bank of Baroda'];
const WALLETS = ['Paytm', 'PhonePe', 'Amazon Pay', 'MobiKwik'];
const UPI_APPS = ['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'];

// ─── component ───────────────────────────────────────────────────────────────
export default function BookingModal({ packageData, onClose }) {
  const navigate   = useNavigate();
  const { currentUser, token } = useAuth();

  // steps
  const [step, setStep] = useState(1);

  // step 1 — departure
  const [selectedDep, setSelectedDep]   = useState(null);
  const [numTravelers, setNumTravelers] = useState(1);

  // step 2 — traveler info
  const [email, setEmail]             = useState(currentUser?.email || '');
  const [travelers, setTravelers]     = useState([{ name: '', phone: '', age: '' }]);
  const [specialReq, setSpecialReq]   = useState('');

  // step 3
  const [agreed, setAgreed] = useState(false);

  // step 4 — payment
  const [paymentMethod, setPaymentMethod]   = useState('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '', cardNumber: '', cardName: '', expiry: '', cvv: '', bank: '', wallet: '',
  });
  const [copied, setCopied]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // QR countdown
  const [qrTimer, setQrTimer] = useState(300); // 5 min
  const qrInterval = useRef(null);
  useEffect(() => {
    if (paymentMethod === 'qr' && step === 4) {
      setQrTimer(300);
      qrInterval.current = setInterval(() => setQrTimer(t => t > 0 ? t - 1 : 0), 1000);
    } else {
      clearInterval(qrInterval.current);
    }
    return () => clearInterval(qrInterval.current);
  }, [paymentMethod, step]);

  // computed
  const departures     = packageData?.departures || [];
  const pricePerPerson = packageData?.price || 0;
  const totalPrice     = numTravelers * pricePerPerson;
  const seatsLeft      = selectedDep
    ? selectedDep.totalSeats - (selectedDep.bookedCount || 0)
    : null;

  // keep travelers array in sync
  useEffect(() => {
    setTravelers(prev => {
      const arr = [...prev];
      while (arr.length < numTravelers) arr.push({ name: '', phone: '', age: '' });
      return arr.slice(0, numTravelers);
    });
  }, [numTravelers]);

  // ── nav guards ──────────────────────────────────────────────────────────────
  const canProceed = () => {
    if (step === 1) return !!selectedDep;
    if (step === 2) return !!email && travelers.every(t => t.name && t.phone && t.age);
    if (step === 3) return agreed;
    return true;
  };
  const next = () => { setError(''); if (canProceed()) setStep(s => s + 1); };
  const back = () => { setError(''); setStep(s => s - 1); };

  // ── helpers ─────────────────────────────────────────────────────────────────
  const updateTraveler = (i, field, val) =>
    setTravelers(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val } : t));

  const fmtCard   = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const fmtExpiry = v => { const c = v.replace(/\D/g,'').slice(0,4); return c.length>=2 ? c.slice(0,2)+'/'+c.slice(2) : c; };

  const copyUpi = () => {
    navigator.clipboard.writeText('bharatyatra@upi');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── pay ─────────────────────────────────────────────────────────────────────
  const handlePayment = async () => {
    setError('');
    // validate
    if (paymentMethod === 'upi' && !paymentDetails.upiId && !selectedUpiApp) {
      setError('Please enter UPI ID or select a UPI app.'); return;
    }
    if (paymentMethod === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.cardName || !paymentDetails.expiry || !paymentDetails.cvv) {
        setError('Please fill all card details.'); return;
      }
    }
    if (paymentMethod === 'netbanking' && !paymentDetails.bank) {
      setError('Please select a bank.'); return;
    }
    if (paymentMethod === 'wallet' && !paymentDetails.wallet) {
      setError('Please select a wallet.'); return;
    }

    setLoading(true);
    try {
      // 1. reserve seats
      await axios.post(
        `http://localhost:3000/bookDeparture/${packageData._id}/${selectedDep._id}`,
        { travellers: numTravelers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. save booking
      const ref = 'BT-' + Date.now();
      const payload = {
        bookingId:       ref,
        userEmail:       email,
        packageId:       packageData._id,
        packageName:     packageData.name,
        location:        packageData.location,
        image:           packageData.image,
        travelers,
        departureId:     selectedDep._id,
        departureDate:   selectedDep.startDate,
        endDate:         selectedDep.endDate,
        price:           pricePerPerson,
        totalPrice,
        paymentMethod,
        specialRequests: specialReq,
        status:          'Paid',
      };

      const res = await axios.post(
        'http://localhost:3000/addBookingDetails',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.flag === 1) {
        setBookingRef(ref);
        setSuccess(true);
      } else {
        setError('Booking could not be saved. Please contact support.');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── success screen ───────────────────────────────────────────────────────────
  if (success) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl"
          >
            {/* Animated tick */}
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed! 🎉</h2>
            <p className="text-gray-500 text-sm mb-6">Have a wonderful journey ahead.</p>

            <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 mb-6 border border-gray-100">
              <Row label="Booking Ref"  value={bookingRef}                   valueClass="text-[#00A3E1] font-mono font-bold" />
              <Row label="Package"      value={packageData.name}             />
              <Row label="Departure"    value={fmtDate(selectedDep?.startDate)} />
              <Row label="Return"       value={fmtDate(selectedDep?.endDate)}   />
              <Row label="Travelers"    value={`${numTravelers} person(s)`}  />
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-500 text-sm">Amount Paid</span>
                <span className="font-bold text-green-600 text-base">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-5">
              Confirmation sent to <b>{email}</b>
            </p>

            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition text-sm">
                Stay Here
              </button>
              <button
                onClick={() => { onClose(); navigate('/bookings'); }}
                className="flex-1 py-3 bg-[#00A3E1] text-white font-bold rounded-xl hover:bg-[#008cc2] transition text-sm">
                View My Bookings
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── main modal ───────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        >

          {/* ── Header ── */}
          <div className="bg-[#00A3E1] text-white px-7 py-5 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold">Complete Your Booking</h2>
              <p className="text-blue-100 text-sm mt-0.5 truncate max-w-xs">{packageData?.name}</p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
              <X size={20} />
            </button>
          </div>

          {/* ── Step bar ── */}
          <div className="flex items-center px-7 py-4 bg-gray-50 border-b gap-1 flex-shrink-0 overflow-x-auto">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0
                    ${step > s.id ? 'bg-green-500 text-white' : step === s.id ? 'bg-[#00A3E1] text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {step > s.id ? <CheckCircle size={14}/> : s.id}
                  </div>
                  <span className={`text-xs font-semibold whitespace-nowrap ${step >= s.id ? 'text-gray-800' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-[2px] mx-2 bg-gray-200 rounded-full overflow-hidden min-w-[12px]">
                    <motion.div animate={{ width: step > s.id ? '100%' : '0%' }}
                      className="h-full bg-[#00A3E1]" transition={{ duration: 0.3 }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Scrollable content ── */}
          <div className="flex-1 overflow-y-auto px-7 py-6">
            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
                className="space-y-5"
              >

                {/* ══ STEP 1: SELECT DEPARTURE ══ */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Select Departure Date</h3>
                      <p className="text-sm text-gray-500 mt-0.5">Pick a slot. Seats are limited — book early!</p>
                    </div>

                    {departures.length === 0 ? (
                      <div className="flex gap-3 items-start p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-700">No departure slots available yet. Please check back soon.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {departures.map(dep => {
                          const left       = dep.totalSeats - (dep.bookedCount || 0);
                          const isFull     = left <= 0;
                          const isSelected = selectedDep?._id === dep._id;

                          return (
                            <button key={dep._id} type="button" disabled={isFull}
                              onClick={() => !isFull && setSelectedDep(dep)}
                              className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200
                                ${isFull
                                  ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50'
                                  : isSelected
                                    ? 'border-[#00A3E1] bg-blue-50 shadow-md shadow-blue-100'
                                    : 'border-gray-200 hover:border-[#00A3E1]/50 hover:bg-gray-50 cursor-pointer'}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {/* radio dot */}
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                                    ${isSelected ? 'border-[#00A3E1] bg-[#00A3E1]' : 'border-gray-300'}`}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Calendar size={13} className="text-[#00A3E1]" />
                                      <span className="font-bold text-gray-900 text-sm">{fmtDate(dep.startDate)}</span>
                                      <span className="text-gray-400 text-sm">→</span>
                                      <span className="font-semibold text-gray-700 text-sm">{fmtDate(dep.endDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <span className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock size={11}/> {packageData.days}D/{packageData.nights}N
                                      </span>
                                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                        ${isFull ? 'bg-red-100 text-red-600'
                                          : left <= 5 ? 'bg-amber-100 text-amber-700'
                                          : 'bg-green-100 text-green-700'}`}>
                                        {isFull ? 'Sold Out' : `${left} seats left`}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                  <p className="text-base font-bold text-[#00A3E1]">₹{pricePerPerson.toLocaleString()}</p>
                                  <p className="text-xs text-gray-400">/ person</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Traveler count — appears after slot selected */}
                    {selectedDep && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                        <label className="text-sm font-bold text-gray-800 block mb-3">Number of Travelers</label>
                        <div className="flex items-center gap-4">
                          <button type="button"
                            onClick={() => setNumTravelers(n => Math.max(1, n - 1))}
                            className="w-10 h-10 rounded-full border-2 border-gray-200 font-bold text-gray-600 hover:border-[#00A3E1] hover:text-[#00A3E1] transition flex items-center justify-center text-xl bg-white">
                            −
                          </button>
                          <span className="text-2xl font-bold text-gray-900 w-8 text-center">{numTravelers}</span>
                          <button type="button"
                            onClick={() => setNumTravelers(n => Math.min(seatsLeft, n + 1))}
                            className="w-10 h-10 rounded-full border-2 border-gray-200 font-bold text-gray-600 hover:border-[#00A3E1] hover:text-[#00A3E1] transition flex items-center justify-center text-xl bg-white">
                            +
                          </button>
                          <div className="ml-2">
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="text-xl font-bold text-[#00A3E1]">₹{totalPrice.toLocaleString()}</p>
                          </div>
                        </div>
                        {numTravelers >= seatsLeft && (
                          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                            <AlertCircle size={11}/> Max available seats selected
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}

                {/* ══ STEP 2: TRAVELER DETAILS ══ */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Traveler Details</h3>
                      <p className="text-sm text-gray-500 mt-0.5">Fill details for all {numTravelers} traveler(s).</p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1.5">Contact Email *</label>
                      <input type="email" value={email} placeholder="abc@email.com" required
                        onChange={e => setEmail(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm" />
                    </div>

                    {travelers.map((t, i) => (
                      <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b">
                          <div className="w-6 h-6 rounded-full bg-[#00A3E1]/10 text-[#00A3E1] text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </div>
                          <span className="font-semibold text-gray-800 text-sm">Traveler {i + 1}</span>
                          {i === 0 && (
                            <span className="text-[10px] bg-[#00A3E1]/10 text-[#00A3E1] px-2 py-0.5 rounded-full font-semibold">Primary</span>
                          )}
                        </div>
                        <div className="p-4 grid grid-cols-3 gap-3">
                          <div className="col-span-3">
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Full Name *</label>
                            <input type="text" value={t.name} placeholder="e.g. Rahul Sharma" required
                              onChange={e => updateTraveler(i, 'name', e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm" />
                          </div>
                          <div className="col-span-2">
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Phone *</label>
                            <input type="tel" value={t.phone} placeholder="9876543210" required maxLength={10}
                              onChange={e => updateTraveler(i, 'phone', e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Age *</label>
                            <input type="number" value={t.age} placeholder="25" min={1} max={120} required
                              onChange={e => updateTraveler(i, 'age', e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm" />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1.5">
                        Special Requests <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <textarea rows={3} value={specialReq} placeholder="Vegetarian meals, wheelchair access..."
                        onChange={e => setSpecialReq(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm resize-none" />
                    </div>
                  </div>
                )}

                {/* ══ STEP 3: SUMMARY ══ */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-gray-900">Review Your Booking</h3>

                    <div className="rounded-2xl border border-gray-200 overflow-hidden">
                      {packageData.image && (
                        <img src={`http://localhost:3000/Images/${packageData.image}`}
                          alt={packageData.name}
                          className="w-full h-32 object-cover"
                          onError={e => e.target.style.display = 'none'} />
                      )}
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-gray-900">{packageData.name}</h4>
                            <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                              <MapPin size={12}/> {packageData.destination}
                            </p>
                          </div>
                          <span className="bg-[#00A3E1]/10 text-[#00A3E1] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                            {packageData.days}D/{packageData.nights}N
                          </span>
                        </div>

                        <div className="border-t pt-3 space-y-2">
                          <Row label="Departure"  value={fmtDate(selectedDep?.startDate)} />
                          <Row label="Return"     value={fmtDate(selectedDep?.endDate)}   />
                          <Row label="Travelers"  value={`${numTravelers} person(s)`}     />
                          <Row label="Contact"    value={email}                            />
                        </div>

                        <div className="border-t pt-3 space-y-2">
                          <Row label={`₹${pricePerPerson.toLocaleString()} × ${numTravelers}`}
                               value={`₹${totalPrice.toLocaleString()}`} />
                          <Row label="Taxes & Fees" value="Included" valueClass="text-green-600" />
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-bold text-gray-900">Total Payable</span>
                            <span className="font-bold text-xl text-[#00A3E1]">₹{totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3 cursor-pointer" onClick={() => setAgreed(a => !a)}>
                      <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all
                        ${agreed ? 'bg-[#00A3E1] border-[#00A3E1]' : 'border-gray-300 hover:border-[#00A3E1]'}`}>
                        {agreed && <Check size={11} className="text-white" strokeWidth={3}/>}
                      </div>
                      <span className="text-sm text-gray-600 leading-snug select-none">
                        I agree to the{' '}
                        <span className="text-[#00A3E1] font-semibold">Terms & Conditions</span> and{' '}
                        <span className="text-[#00A3E1] font-semibold">Cancellation Policy</span>.
                        All traveler details are correct.
                      </span>
                    </div>
                  </div>
                )}

                {/* ══ STEP 4: PAYMENT ══ */}
                {step === 4 && (
                  <div className="space-y-5">

                    {/* Amount pill */}
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Amount to Pay</p>
                        <p className="text-2xl font-bold text-[#00A3E1]">₹{totalPrice.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Shield size={13} className="text-green-500"/>Secure</span>
                        <span className="flex items-center gap-1"><Lock size={13} className="text-green-500"/>Encrypted</span>
                      </div>
                    </div>

                    {/* Method tabs — 5 options in a tight grid */}
                    <div className="grid grid-cols-5 gap-2">
                      {PAYMENT_METHODS.map(m => {
                        const Icon = m.icon;
                        const active = paymentMethod === m.id;
                        return (
                          <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all
                              ${active ? 'border-[#00A3E1] bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center
                              ${active ? 'bg-[#00A3E1] text-white' : 'bg-gray-100 text-gray-500'}`}>
                              <Icon size={16}/>
                            </div>
                            <span className={`text-[10px] font-bold text-center leading-tight
                              ${active ? 'text-[#00A3E1]' : 'text-gray-600'}`}>
                              {m.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* ── UPI ── */}
                    {paymentMethod === 'upi' && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Quick Select</p>
                          <div className="flex gap-2 flex-wrap">
                            {UPI_APPS.map(app => (
                              <button key={app} type="button" onClick={() => setSelectedUpiApp(app)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition
                                  ${selectedUpiApp === app ? 'bg-[#00A3E1] text-white border-[#00A3E1]' : 'border-gray-200 text-gray-600 hover:border-[#00A3E1]/40'}`}>
                                {app}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-px bg-gray-200"/><span className="text-xs text-gray-400">or enter manually</span><div className="flex-1 h-px bg-gray-200"/>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1.5">UPI ID</label>
                          <input type="text" placeholder="yourname@upi" value={paymentDetails.upiId}
                            onChange={e => setPaymentDetails(p => ({ ...p, upiId: e.target.value }))}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm" />
                        </div>
                      </motion.div>
                    )}

                    {/* ── QR SCAN & PAY ── */}
                    {paymentMethod === 'qr' && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col items-center gap-4">

                          {/* QR code — generated via a free API */}
                          <div className="relative">
                            <div className="w-44 h-44 bg-white rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shadow-inner">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=176x176&data=upi://pay?pa=bharatyatra@upi%26pn=BharatYatra%26am=${totalPrice}%26cu=INR%26tn=TourBooking`}
                                alt="UPI QR"
                                className="w-40 h-40 object-contain"
                                onError={e => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              {/* Fallback if image fails */}
                              <div style={{display:'none'}} className="flex-col items-center gap-2 text-gray-400">
                                <QrCode size={48}/>
                                <p className="text-xs text-center">QR unavailable<br/>Use UPI ID below</p>
                              </div>
                            </div>
                            {/* Corner decorators */}
                            <ScanLine className="absolute -bottom-1 -right-1 w-5 h-5 text-[#00A3E1] opacity-60"/>
                          </div>

                          {/* Timer */}
                          <div className={`text-sm font-semibold flex items-center gap-1.5 ${qrTimer < 60 ? 'text-red-500' : 'text-gray-600'}`}>
                            <Clock size={14}/>
                            QR expires in {Math.floor(qrTimer/60)}:{String(qrTimer%60).padStart(2,'0')}
                          </div>

                          {/* UPI ID to copy */}
                          <div className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] text-gray-400 font-semibold">UPI ID</p>
                              <p className="text-sm font-bold text-gray-800">bharatyatra@upi</p>
                            </div>
                            <button type="button" onClick={copyUpi}
                              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition
                                ${copied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                              {copied ? <><Check size={12}/>Copied!</> : <><Copy size={12}/>Copy</>}
                            </button>
                          </div>

                          <p className="text-xs text-gray-500 text-center max-w-xs">
                            Open any UPI app (GPay, PhonePe, Paytm) → Scan QR or send to UPI ID above →
                            Enter amount <b>₹{totalPrice.toLocaleString()}</b> → Complete payment → Click Pay below
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* ── CARD ── */}
                    {paymentMethod === 'card' && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        {/* Live card preview */}
                        <div className="h-36 bg-gradient-to-br from-[#00A3E1] to-[#005f85] rounded-2xl p-5 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/10 -translate-y-8 translate-x-8"/>
                          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/10 translate-y-6 -translate-x-6"/>
                          <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                              <CreditCard size={24}/>
                              <span className="text-[10px] font-semibold opacity-70">DEBIT / CREDIT</span>
                            </div>
                            <div>
                              <p className="font-mono text-base tracking-widest opacity-90">
                                {paymentDetails.cardNumber
                                  ? paymentDetails.cardNumber.padEnd(19,'·').slice(0,19)
                                  : '•••• •••• •••• ••••'}
                              </p>
                              <div className="flex justify-between mt-1 text-[10px] opacity-70">
                                <span>{paymentDetails.cardName || 'CARD HOLDER'}</span>
                                <span>{paymentDetails.expiry || 'MM/YY'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1.5">Card Number</label>
                          <input type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                            value={paymentDetails.cardNumber}
                            onChange={e => setPaymentDetails(p => ({ ...p, cardNumber: fmtCard(e.target.value) }))}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm font-mono" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1.5">Card Holder Name</label>
                          <input type="text" placeholder="As on card"
                            value={paymentDetails.cardName}
                            onChange={e => setPaymentDetails(p => ({ ...p, cardName: e.target.value.toUpperCase() }))}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm uppercase" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Expiry</label>
                            <input type="text" placeholder="MM/YY" maxLength={5}
                              value={paymentDetails.expiry}
                              onChange={e => setPaymentDetails(p => ({ ...p, expiry: fmtExpiry(e.target.value) }))}
                              className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm font-mono" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1.5">CVV</label>
                            <input type="password" placeholder="•••" maxLength={4}
                              value={paymentDetails.cvv}
                              onChange={e => setPaymentDetails(p => ({ ...p, cvv: e.target.value.replace(/\D/g,'') }))}
                              className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm font-mono" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ── NET BANKING ── */}
                    {paymentMethod === 'netbanking' && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 gap-2">
                        {BANKS.map(bank => (
                          <button key={bank} type="button" onClick={() => setPaymentDetails(p => ({ ...p, bank }))}
                            className={`py-3 px-4 rounded-xl border text-sm font-semibold text-left transition
                              ${paymentDetails.bank === bank ? 'border-[#00A3E1] bg-blue-50 text-[#00A3E1]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                            {bank}
                          </button>
                        ))}
                      </motion.div>
                    )}

                    {/* ── WALLET ── */}
                    {paymentMethod === 'wallet' && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 gap-3">
                        {WALLETS.map(w => (
                          <button key={w} type="button" onClick={() => setPaymentDetails(p => ({ ...p, wallet: w }))}
                            className={`py-4 rounded-2xl border-2 text-sm font-bold transition
                              ${paymentDetails.wallet === w ? 'border-[#00A3E1] bg-blue-50 text-[#00A3E1]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                            {w}
                          </button>
                        ))}
                      </motion.div>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                        <AlertCircle size={14} className="flex-shrink-0"/>{error}
                      </div>
                    )}

                    {/* Pay button */}
                    <button type="button" onClick={handlePayment} disabled={loading}
                      className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition shadow-lg shadow-orange-200 flex items-center justify-center gap-2 text-base">
                      {loading
                        ? <><Loader2 size={20} className="animate-spin"/>Processing…</>
                        : <>Pay ₹{totalPrice.toLocaleString()} <ChevronRight size={18}/></>
                      }
                    </button>

                    <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                      <Shield size={11} className="text-green-500"/>
                      256-bit SSL encrypted · Your data is safe
                    </p>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Footer nav (steps 1–3 only; step 4 has its own Pay button) ── */}
          {step < 4 && (
            <div className="px-7 py-5 border-t bg-gray-50/50 flex items-center gap-3 flex-shrink-0">
              {step > 1 && (
                <button type="button" onClick={back}
                  className="flex items-center gap-1.5 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:border-gray-300 transition text-sm">
                  <ChevronLeft size={15}/> Back
                </button>
              )}
              <button type="button" onClick={next} disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00A3E1] text-white font-bold hover:bg-[#008cc2] transition shadow-md shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm">
                {step === 3 ? 'Proceed to Payment' : 'Continue'}
                <ChevronRight size={15}/>
              </button>
            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── tiny helper ────────────────────────────────────────────────────────────────
function Row({ label, value, valueClass = 'text-gray-800' }) {
  return (
    <div className="flex justify-between items-start gap-2 text-sm">
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <span className={`font-semibold text-right ${valueClass}`}>{value}</span>
    </div>
  );
}