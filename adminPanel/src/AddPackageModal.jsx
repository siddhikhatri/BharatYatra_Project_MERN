// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   Plus,
//   Trash2,
//   ChevronRight,
//   ChevronLeft,
//   Package,
//   Tag,
//   DollarSign,
//   Calendar,
//   CheckCircle,
// } from "lucide-react";
// import axios from "axios";

// const STEPS = [
//   { id: 1, label: "Basic Info", icon: Package },
//   { id: 2, label: "Details", icon: Tag },
//   { id: 3, label: "Pricing", icon: DollarSign },
//   { id: 4, label: "Itinerary", icon: Calendar },
//   { id: 5, label: "Inclusions", icon: CheckCircle },
// ];

// const THEMES = ["Family", "Adventure", "Spiritual", "Nature", "Honeymoon", "Cultural", "Wildlife"];
// const SEASONS = ["Winter", "Summer", "Monsoon"];
// const DISCOUNT_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 40, 50];

// const initialForm = {
//   name: "",
//   location: "",
//   destination: "",
//   image: "",
//   days: "",
//   nights: "",
//   // rating: 0,
//   // reviews: 0,
//   price: "",
//   originalPrice: "",
//   discount: 0,
//   description: "",
//   tags: [""],
//   themes: [],
//   //season: "",
//   bestSeason: [],
//   highlights: [""],
//   itinerary: [{ day: 1, title: "", subtitle: "", activities: [""] }],
//   included: [""],
//   excluded: [""],
// };

// export default function AddPackageModal({ open, onClose, onSave, packageData, isEditMode }) {
//   const [step, setStep] = useState(1);
//   const [form, setForm] = useState(initialForm);
//   const isViewMode = !!packageData && !isEditMode;

//   const [itinerary, setItinerary] = useState([
//     { day: 1, title: "", description: "" }
//   ]);

//   const update = (field, value) =>
//     setForm((prev) => ({ ...prev, [field]: value }));

//   const toggleArray = (field, value) => {
//     setForm(prev => {
//       const exists = prev[field].includes(value);

//       // THEMES VALIDATION
//       if (field === "themes") {
//         if (!exists && prev.themes.length >= 3) {
//           alert("You can select maximum 3 themes only.");
//           return prev;
//         }
//       }

//       return {
//         ...prev,
//         [field]: exists
//           ? prev[field].filter(v => v !== value)
//           : [...prev[field], value],
//       };
//     });
//   };

//   const originalPrice = Number(form.originalPrice) || 0;
//   const discount = Number(form.discount) || 0;

//   // Calculate savings first
//   const rawSavings = (originalPrice * discount) / 100;

//   // Convert to integer
//   const savings = Math.round(rawSavings);

//   // Calculate selling price and round
//   const sellingPrice = Math.round(originalPrice - savings);


//   const addDynamicField = (field, dayIndex = null, subField = null) => {

//     // STEP 2 → Add Highlight
//     if (field === "highlights") {
//       update("highlights", [...form.highlights, ""]);
//     }

//     // STEP 4 → Add New Day
//     else if (field === "itinerary" && dayIndex === null) {
//       const newItinerary = [
//         ...form.itinerary,
//         {
//           day: form.itinerary.length + 1,   // ADD THIS
//           title: "",
//           subtitle: "",
//           activities: [""],
//         },
//       ];
//       update("itinerary", newItinerary);
//     }

//     // STEP 4 → Add Activity inside Day
//     else if (field === "itinerary" && subField === "activities") {
//       const newItinerary = [...form.itinerary];
//       newItinerary[dayIndex].activities.push("");
//       update("itinerary", newItinerary);
//     }

//     //  STEP 5 → Add Included
//     else if (field === "included") {
//       update("included", [...form.included, ""]);
//     }

//     //  STEP 5 → Add Excluded
//     else if (field === "excluded") {
//       update("excluded", [...form.excluded, ""]);
//     }
//   };





//   const handleNext = () => {
//     if (step < STEPS.length) {
//       setStep(step + 1);
//     }
//   };

//   const handleBack = () => {
//     if (step > 1) {
//       setStep(step - 1);
//     } else {
//       onClose();
//     }
//   };



//   // dynamic itinery useeffect
//   useEffect(() => {
//     const totalDays = Number(form.days);

//     if (!totalDays || totalDays <= 0) return;

//     let updatedItinerary = [...form.itinerary];

//     // If days increased → add new days
//     if (totalDays > updatedItinerary.length) {
//       for (let i = updatedItinerary.length; i < totalDays; i++) {
//         updatedItinerary.push({
//           day: i + 1,
//           title: "",
//           subtitle: "",
//           activities: [""]
//         });
//       }
//     }

//     // If days decreased → remove extra days
//     if (totalDays < updatedItinerary.length) {
//       updatedItinerary = updatedItinerary.slice(0, totalDays);
//     }

//     // Reassign correct day numbers
//     updatedItinerary = updatedItinerary.map((item, index) => ({
//       ...item,
//       day: index + 1
//     }));

//     update("itinerary", updatedItinerary);

//   }, [form.days]);




//   const handleSave = async () => {
//     try {
//       //  Season Validation (Only 1 required)
//       if (form.bestSeason.length !== 1) {
//         alert("Please select exactly one Best Season.");
//         return;
//       }

//       //  Theme Validation (Min 1, Max 3)
//       if (form.themes.length < 1) {
//         alert("Please select at least 1 theme.");
//         return;
//       }

//       if (form.themes.length > 3) {
//         alert("You can select maximum 3 themes only.");
//         return;
//       }

//       //  If validation passes
//       const finalData = {
//         ...form,
//         tags: form.themes,
//         price: sellingPrice,
//       };

//       const formData = new FormData();

//       formData.append("name", form.name);
//       formData.append("location", form.location);
//       formData.append("destination", form.destination);
//       formData.append("days", form.days);
//       formData.append("nights", form.nights);
//       formData.append("price", sellingPrice);
//       formData.append("originalPrice", form.originalPrice);
//       formData.append("discount", form.discount);
//       formData.append("description", form.description);

//       // formData.append("image", form.image);
//       if (form.image) {
//         formData.append("image", form.image); // new image
//       } else {
//         formData.append("existingImage", form.existingImage); // old image
//       }
//       // MULTIPLE IMAGES
//       // if (form.images && form.images.length > 0) {
//       //   form.images.forEach((img) => {
//       //     formData.append("images", img);
//       //   });
//       // }
//       if (form.images && form.images.length > 0) {
//         form.images.forEach((img) => {
//           formData.append("images", img);
//         });
//       } else if (isEditMode) {
//         formData.append("existingImages", JSON.stringify(packageData.images || []));
//       }

//       // Arrays convert to JSON string
//       formData.append("tags", JSON.stringify(form.themes));
//       formData.append("themes", JSON.stringify(form.themes));
//       formData.append("bestSeason", JSON.stringify(form.bestSeason));
//       formData.append("highlights", JSON.stringify(form.highlights));
//       formData.append("included", JSON.stringify(form.included));
//       formData.append("excluded", JSON.stringify(form.excluded));
//       formData.append("itinerary", JSON.stringify(form.itinerary));

//       const url = isEditMode
//         ? `http://localhost:3000/updatePackage/${packageData._id}`
//         : "http://localhost:3000/addPackageDetailsDynamic";

//       const method = isEditMode ? "put" : "post";

//       const res = await axios({
//         method: method,
//         url: url,
//         data: formData,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (res.data.flag === 1) {
//         alert(isEditMode ? "Package Updated Successfully ✅" : "Package Added Successfully ✅");
//         setForm(initialForm);
//         setStep(1);
//         onClose();
//       }

//     } catch (error) {
//       console.error(error);
//       alert(isEditMode ? "Failed to Update Package ❌" : "Failed to Add Package ❌");
//     }
//   };

//   useEffect(() => {
//     if (packageData) {
//       setForm({
//         ...packageData,
//         image: null, // for new upload
//         existingImage: packageData.image // store old image
//       });
//     }
//     else {
//       setForm(initialForm);
//     }
//   }, [packageData]);

//   if (!open) return null;


//   return (
//     <AnimatePresence>
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//           onClick={onClose}
//         />

//         <motion.div
//           initial={{ opacity: 0, scale: 0.95, y: 20 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.95, y: 20 }}
//           transition={{ duration: 0.25 }}
//           className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between px-8 py-6 border-b">
//             <div>
//               {/* <h2 className="text-xl font-bold text-gray-800">
//                 {packageData ? "View Package" : "Add New Package"}</h2> */}
//               <h2 className="text-xl font-bold text-gray-800">
//                 {isEditMode ? "Edit Package" : packageData ? "View Package" : "Add New Package"}
//               </h2>
//               <p className="text-sm text-gray-500">Step {step} of {STEPS.length}</p>
//             </div>
//             <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
//               <X className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>

//           {/* Stepper */}


//           <div className="flex items-center justify-between px-8 py-6 border-b">

//             {STEPS.map((s, index) => {
//               const Icon = s.icon;
//               const completed = step >= s.id;
//               const active = step === s.id;

//               return (
//                 <div key={s.id} className="flex items-center flex-1">

//                   {/* Rounded Tab */}
//                   <div
//                     className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap
//                     ${completed ? "bg-[#00A3E1] text-white" : "bg-gray-100 text-gray-400"}`} >
//                     <Icon size={16} />
//                     {s.label}
//                   </div>

//                   {/* Connector Line */}
//                   {index < STEPS.length - 1 && (
//                     <div
//                       className={`flex-1 h-[2px] mx-3 transition-all duration-300
//                       ${step > s.id ? "bg-[#00A3E1]" : "bg-gray-200"}`}
//                     />
//                   )}
//                 </div>
//               );
//             })}

//           </div>

//           {/* Content Area */}
//           <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={step}
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.2 }}
//                 className="space-y-6"
//               >
//                 {/* STEP 1: BASIC INFO */}
//                 {step === 1 && (
//                   <div className="grid grid-cols-2 gap-6">

//                     {/* Package Name */}
//                     <div className="col-span-2">
//                       <label className="text-sm font-bold text-gray-700">Package Name *</label>
//                       <input
//                         type="text"
//                         value={form.name}
//                         placeholder="e.g. Kashmir Paradise Tour"
//                         onChange={(e) => update("name", e.target.value)}
//                         className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]"
//                         disabled={isViewMode}
//                       />
//                     </div>

//                     {/* Destination */}
//                     <div>
//                       <label className="text-sm font-bold text-gray-700">Destination *</label>
//                       <input
//                         type="text"
//                         value={form.destination}
//                         placeholder="e.g. Dwarka-Somnath"
//                         onChange={(e) => update("destination", e.target.value)}
//                         className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]"
//                         disabled={isViewMode}
//                       />

//                     </div>

//                     {/* Location */}
//                     <div>
//                       <label className="text-sm font-bold text-black">Location *</label>
//                       <select value={form.location} onChange={(e) => update("location", e.target.value)} disabled={isViewMode} className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]">
//                         <option value="">Select Destination</option>
//                         <option value="Gujarat">Gujarat</option>
//                         <option value="Goa">Goa</option>
//                         <option value="Assam">Assam</option>
//                         <option value="Sikkim">Sikkim</option>
//                         <option value="Kerala">Kerala</option>
//                         <option value="Kashmir">Kashmir</option>
//                         <option value="Rajasthan">Rajasthan</option>
//                         <option value="MadhyaPradesh">MadhyaPradesh</option>
//                         <option value="UttarPradesh">UttarPradesh</option>
//                         <option value="Panjab">Panjab</option>
//                         <option value="Maharastra">Maharastra</option>
//                         <option value="Tamilnadu">Tamilnadu</option>
//                       </select>

//                     </div>
//                     {/* Days */}
//                     <div>
//                       <label className="text-sm font-bold text-black">Days *</label>
//                       <input
//                         type="number"
//                         min="1"
//                         value={form.days}
//                         placeholder="3"
//                         onChange={(e) => {
//                           const daysValue = e.target.value;
//                           update("days", daysValue);

//                           if (daysValue && Number(daysValue) > 0) {
//                             update("nights", Number(daysValue) - 1);
//                           } else {
//                             update("nights", "");
//                           }
//                         }}
//                         className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]"
//                         disabled={isViewMode}
//                       />
//                     </div>

//                     {/* Nights */}
//                     <div>
//                       <label className="text-sm font-bold text-black">Nights *</label>
//                       <input
//                         type="number"
//                         value={form.nights}
//                         placeholder="2"
//                         readOnly
//                         disabled={isViewMode}
//                         className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]"
//                       />
//                     </div>

//                     {/* Image Path */}
//                     <div className="col-span-2">
//                       <label className="text-sm font-bold text-gray-700">Image *</label>
//                       <input type="file" onChange={(e) => update("image", e.target.files[0])} disabled={isViewMode} className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]" />
//                       {/* <input
//                         type="text"
//                         value={form.image}
//                         placeholder="/Images/chardham.jpeg"
//                         onChange={(e) => update("image", e.target.value)}
//                         className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]"
//                       /> */}
//                     </div>


//                     {/* Multiple Images */}
//                     <div className="col-span-2">
//                       <label className="text-sm font-bold text-gray-700">
//                         Gallery Images (Max 5)
//                       </label>

//                       <input
//                         type="file"
//                         multiple
//                         onChange={(e) => update("images", Array.from(e.target.files))}
//                         disabled={isViewMode}
//                         className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50"
//                       />
//                     </div>

//                     {/* Description */}
//                     <div className="col-span-2">
//                       <label className="text-sm font-bold text-black">Description *</label>
//                       <textarea
//                         rows="4"
//                         placeholder="description of package"
//                         value={form.description}
//                         onChange={(e) => update("description", e.target.value)}
//                         className="mt-2 w-full rounded-xl border px-4 py-3 bg-gray-50 text-black outline-none focus:border-[#00A3E1]"
//                         disabled={isViewMode}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 2: DETAILS */}
//                 {step === 2 && (
//                   <div className="space-y-8">
//                     <div>
//                       <label className="text-sm font-bold text-black block mb-4">Travel Themes * (select all that apply)</label>
//                       <div className="flex flex-wrap gap-3">
//                         {THEMES.map(t => (
//                           <button
//                             key={t}
//                             type="button"
//                             disabled={isViewMode}
//                             onClick={() => {
//                               if (!isViewMode) toggleArray("themes", t);
//                             }}
//                             className={`px-6 py-2 rounded-full border transition font-medium
//                             ${form.themes.includes(t)
//                                 ? "bg-[#00A3E1] text-white border-[#00A3E1]"
//                                 : "border-gray-200 text-gray-500"}
//                             ${isViewMode ? "opacity-60 cursor-not-allowed" : ""}
//                             `}
//                           >
//                             {t}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-black block mb-4">Best Season *</label>
//                       <div className="flex flex-wrap gap-3">
//                         {SEASONS.map(s => (
//                           <button
//                             key={s}
//                             type="button"
//                             disabled={isViewMode}
//                             onClick={() =>
//                               setForm(prev => ({
//                                 ...prev,
//                                 bestSeason: prev.bestSeason.includes(s) ? [] : [s],
//                               }))
//                             }
//                             className={`px-6 py-2 rounded-full border transition font-medium ${form.bestSeason.includes(s)
//                               ? "bg-[#00A3E1] text-white border-[#00A3E1]"
//                               : "border-gray-200 text-gray-500"
//                               }`}

//                           >
//                             {s}
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Highlight Section */}
//                     <div>
//                       <div className="flex items-center justify-between mb-3">
//                         <label className="text-sm font-bold text-black">
//                           Highlights
//                         </label>

//                         <button
//                           type="button"
//                           onClick={() => addDynamicField("highlights")}
//                           className="text-sm text-[#00A3E1] font-semibold flex items-center gap-1"
//                         >
//                           + Add
//                         </button>
//                       </div>

//                       {form.highlights.map((h, idx) => (
//                         <div key={idx} className="flex items-center gap-2 mb-3">
//                           <input
//                             value={h}
//                             onChange={(e) => {
//                               const newHighlights = [...form.highlights];
//                               newHighlights[idx] = e.target.value;
//                               update("highlights", newHighlights);
//                             }}
//                             placeholder={`Highlight ${idx + 1}`}
//                             className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]"
//                             disabled={isViewMode}
//                           />

//                           {form.highlights.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => {
//                                 const newHighlights = form.highlights.filter(
//                                   (_, i) => i !== idx
//                                 );
//                                 update("highlights", newHighlights);
//                               }}
//                               className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 3: PRICING */}
//                 {step === 3 && (
//                   <div className="space-y-8">

//                     {/* Price Inputs */}
//                     <div className="grid grid-cols-3 gap-6">

//                       {/* Original Price */}
//                       <div>
//                         <label className="text-sm font-bold text-gray-700">
//                           Original Price (₹) *
//                         </label>
//                         <input
//                           type="number"
//                           value={form.originalPrice}
//                           placeholder="39999"
//                           onChange={(e) => update("originalPrice", e.target.value)}
//                           className="mt-2 w-full h-12 px-4 rounded-xl border"
//                           disabled={isViewMode}
//                         />
//                       </div>

//                       <div>
//                         <label className="text-sm font-bold text-gray-700">
//                           Discount
//                         </label>
//                         <select
//                           value={form.discount}
//                           disabled={isViewMode}
//                           onChange={(e) => update("discount", e.target.value)}
//                           className="mt-2 w-full h-12 px-4 rounded-xl border bg-white"
//                         >
//                           {DISCOUNT_OPTIONS.map((d) => (
//                             <option key={d} value={d}>
//                               {d}%
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Selling Price */}
//                       <div>
//                         <label className="text-sm font-bold text-gray-700">
//                           Selling Price (₹)
//                         </label>
//                         <input
//                           type="number"
//                           value={sellingPrice}
//                           placeholder="31999"
//                           readOnly
//                           className="mt-2 w-full h-12 px-4 rounded-xl border bg-gray-100 cursor-not-allowed"
//                           disabled={isViewMode}
//                         />
//                       </div>


//                     </div>

//                     {/*  Discount Info Box (Only Show If Valid) */}
//                     {discount > 0 && (
//                       <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex items-center gap-4">
//                         <div className="w-14 h-14 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-700">
//                           {discount}%
//                         </div>

//                         <div>
//                           <p className="font-semibold text-gray-800">
//                             {discount}% Discount Applied
//                           </p>
//                           <p className="text-black">
//                             Customer Saves ₹{savings.toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {/*  Package Preview Card */}
//                     <div className="border rounded-2xl p-6 bg-gray-50">
//                       <p className="text-black mb-2"><b>Package Preview Card</b></p>

//                       <p className="text-sm text-black">Starting From</p>

//                       <div className="flex items-center justify-between mt-2">
//                         <div className="flex items-center gap-3">
//                           <span className="text-2xl font-bold text-[#00A3E1]">
//                             ₹{sellingPrice.toLocaleString()}
//                           </span>

//                           {discount > 0 && (
//                             <span className="text-gray-400 line-through">
//                               ₹{originalPrice.toLocaleString()}
//                             </span>
//                           )}
//                         </div>

//                         {discount > 0 && (
//                           <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
//                             {discount}% OFF
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                   </div>
//                 )}


//                 {/* STEP 4: ITINERARY */}
//                 {step === 4 && (
//                   <div className="space-y-8">

//                     {form.itinerary.map((item, idx) => (
//                       <div
//                         key={`day-${idx}`}
//                         className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
//                       >
//                         {/* Day Header */}
//                         <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
//                           <div className="flex items-center gap-3">
//                             <div className="w-9 h-9 rounded-full bg-blue-100 text-[#00A3E1] flex items-center justify-center font-bold">
//                               {idx + 1}
//                             </div>
//                             <h3 className="font-semibold text-gray-800">
//                               Day {idx + 1}
//                             </h3>
//                           </div>

//                           {form.itinerary.length > 1 && (
//                             <button
//                               onClick={() => {
//                                 const newItinerary = form.itinerary
//                                   .filter((_, i) => i !== idx)
//                                   .map((item, index) => ({
//                                     ...item,
//                                     day: index + 1   //  Reassign correct day number
//                                   }));

//                                 update("itinerary", newItinerary);
//                               }}
//                               className="text-red-500 hover:text-red-600"
//                             >
//                               <Trash2 className="w-5 h-5" />
//                             </button>
//                           )}
//                         </div>

//                         {/* Day Content */}
//                         <div className="p-6 space-y-6">

//                           {/* Title + Subtitle */}
//                           <div className="grid grid-cols-2 gap-6">
//                             <div>
//                               <label className="text-sm font-medium text-black block mb-2 ">
//                                 Title
//                               </label>
//                               <input
//                                 value={item.title}
//                                 onChange={(e) => {
//                                   const newItinerary = [...form.itinerary];
//                                   newItinerary[idx].title = e.target.value;
//                                   update("itinerary", newItinerary);
//                                 }}
//                                 placeholder="e.g. Arrival in Srinagar"
//                                 className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#00A3E1] outline-none bg-gray-50"
//                                 disabled={isViewMode}
//                               />
//                             </div>

//                             <div>
//                               <label className="text-sm font-medium text-black block mb-2">
//                                 Subtitle
//                               </label>
//                               <input
//                                 value={item.subtitle}
//                                 onChange={(e) => {
//                                   const newItinerary = [...form.itinerary];
//                                   newItinerary[idx].subtitle = e.target.value;
//                                   update("itinerary", newItinerary);
//                                 }}
//                                 placeholder="e.g. Welcome to Paradise!"
//                                 className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#00A3E1] outline-none bg-gray-50"
//                                 disabled={isViewMode}
//                               />
//                             </div>
//                           </div>

//                           {/* Activities */}
//                           <div>
//                             <div className="flex items-center justify-between mb-3">
//                               <label className="text-sm font-medium text-black">
//                                 Activities
//                               </label>

//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   addDynamicField("itinerary", idx, "activities")
//                                 }
//                                 className="text-sm text-[#00A3E1] font-semibold flex items-center gap-1"
//                               >
//                                 <Plus className="w-4 h-4" />
//                                 Add
//                               </button>
//                             </div>


//                             {item.activities.map((act, actIdx) => (
//                               <div
//                                 key={`activity-${idx}-${actIdx}`}
//                                 className="flex items-center gap-2 mb-3"
//                               >
//                                 <input
//                                   value={act}
//                                   onChange={(e) => {
//                                     const newItinerary = [...form.itinerary];
//                                     newItinerary[idx].activities[actIdx] = e.target.value;
//                                     update("itinerary", newItinerary);
//                                   }}
//                                   placeholder={`Activity ${actIdx + 1}`}
//                                   className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]"
//                                   disabled={isViewMode}
//                                 />

//                                 {item.activities.length > 1 && (
//                                   <button
//                                     type="button"
//                                     onClick={() => {
//                                       const newItinerary = [...form.itinerary];
//                                       newItinerary[idx].activities =
//                                         newItinerary[idx].activities.filter(
//                                           (_, i) => i !== actIdx
//                                         );
//                                       update("itinerary", newItinerary);
//                                     }}
//                                     className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
//                                   >
//                                     <Trash2 className="w-4 h-4" />
//                                   </button>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     ))}

//                     {/* Add Day Button */}
//                     {/* <button
//                       onClick={() => addDynamicField("itinerary")}
//                       className="w-full py-4 border-2 border-solid border-[#00A3E1] rounded-2xl text-black font-semibold hover:border-[#00A3E1] hover:text-white hover:bg-[#00A3E1] transition "
//                     >
//                       + Add Day
//                     </button> */}

//                   </div>
//                 )}


//                 {/* STEP 5: INCLUSIONS */}
//                 {step === 5 && (
//                   <div className="space-y-8">

//                     {/* INCLUDED & EXCLUDED */}
//                     <div className="grid grid-cols-2 gap-8">

//                       {/* ================= INCLUDED ================= */}
//                       <div>
//                         <div className="flex justify-between items-center mb-4">
//                           <h4 className="font-bold text-gray-800 flex items-center gap-2">
//                             ✓ What's Included
//                           </h4>

//                           <button
//                             type="button"
//                             onClick={() => addDynamicField("included")}
//                             className="text-sm text-blue-500 font-semibold"
//                           >
//                             + Add
//                           </button>
//                         </div>

//                         {form.included.map((inc, idx) => (
//                           <div
//                             key={`included-${idx}`}
//                             className="flex items-center gap-3 mb-3"
//                           >
//                             <input
//                               value={inc}
//                               placeholder="e.g. Accommodation"
//                               onChange={(e) => {
//                                 const updated = [...form.included];
//                                 updated[idx] = e.target.value;
//                                 update("included", updated);
//                               }}
//                               className="flex-1 h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                               disabled={isViewMode}
//                             />

//                             {form.included.length > 1 && (
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   const updated = form.included.filter((_, i) => i !== idx);
//                                   update("included", updated);
//                                 }}
//                                 className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             )}
//                           </div>
//                         ))}
//                       </div>

//                       {/* ================= EXCLUDED ================= */}
//                       <div>
//                         <div className="flex justify-between items-center mb-4">
//                           <h4 className="font-bold text-red-500 flex items-center gap-2">
//                             ✗ What's Excluded
//                           </h4>

//                           <button
//                             type="button"
//                             onClick={() => addDynamicField("excluded")}
//                             className="text-sm text-blue-500 font-semibold"
//                           >
//                             + Add
//                           </button>
//                         </div>

//                         {form.excluded.map((ex, idx) => (
//                           <div
//                             key={`excluded-${idx}`}
//                             className="flex items-center gap-3 mb-3"
//                           >
//                             <input
//                               value={ex}
//                               placeholder="e.g. Flights"
//                               onChange={(e) => {
//                                 const updated = [...form.excluded];
//                                 updated[idx] = e.target.value;
//                                 update("excluded", updated);
//                               }}
//                               className="flex-1 h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400"
//                               disabled={isViewMode}
//                             />

//                             {form.excluded.length > 1 && (
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   const updated = form.excluded.filter((_, i) => i !== idx);
//                                   update("excluded", updated);
//                                 }}
//                                 className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* ================= PACKAGE SUMMARY ================= */}
//                     <div className="p-8 rounded-2xl border border-blue-200 bg-blue-50/40">
//                       <h4 className="font-bold text-black mb-6">
//                         Package Summary
//                       </h4>

//                       <div className="grid grid-cols-4 gap-6">
//                         {[
//                           { label: "Name", value: form.name || "—" },
//                           { label: "Destination", value: form.destination || "—" },
//                           { label: "Price", value: `₹${sellingPrice || 0}`, color: "text-[#00A3E1]" },
//                           {
//                             label: "Duration", value: form.days && Number(form.days) > 0 ? `${Number(form.days)} Days / ${Number(form.days) - 1} 
//                             Nights` : "—"
//                           }
//                         ].map((item, index) => (
//                           <div
//                             key={`summary-${index}`}
//                             className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm"
//                           >
//                             <p className="text-xs font-bold text-black uppercase mb-2">
//                               {item.label}
//                             </p>
//                             <p className={`text-sm font-bold truncate ${item.color || "text-gray-800"}`}>
//                               {item.value}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           {/* Footer */}
//           <div className="flex items-center justify-between px-8 py-6 border-t bg-gray-50/50">
//             <button
//               // onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
//               onClick={handleBack}
//               className="flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-[#00A3E1] text-[#00A3E1] font-bold hover:bg-blue-50 transition"
//             >
//               <ChevronLeft className="w-5 h-5" />
//               {step === 1 ? "Cancel" : "Back"}
//             </button>

//             <div className="flex gap-2">
//               {/* {STEPS.map(s => (
//                 <div key={s.id} className={`h-1.5 rounded-full transition-all duration-300 ${step === s.id ? "w-8 bg-[#00A3E1]" : "w-3 bg-gray-200"}`} />
//               ))} */}
//               {STEPS.map(s => (
//                 <div
//                   key={s.id}
//                   className={`h-1.5 rounded-full transition-all duration-300 ${step >= s.id
//                     ? "w-8 bg-[#00A3E1]"
//                     : "w-3 bg-gray-200"
//                     }`}
//                 />
//               ))}
//             </div>


//             {step < STEPS.length ? (

//               <button
//                 // onClick={() => setStep(step + 1)}
//                 onClick={handleNext}
//                 className="flex items-center gap-2 px-10 py-3 rounded-xl bg-[#00A3E1] text-white font-bold hover:bg-[#008cc2] transition shadow-lg shadow-blue-200"
//               >
//                 Next
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             ) : (


//               <button
//                 onClick={handleSave}
//                 className="flex items-center gap-2 px-10 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200"
//               >
//                 <CheckCircle className="w-5 h-5" />
//                  {isEditMode ? "Update Package" : "Save Package"}
//               </button>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </AnimatePresence>
//   );
// }


import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Package,
  Tag,
  DollarSign,
  Calendar,
  CheckCircle,
  CalendarDays,
} from "lucide-react";
import axios from "axios";

// Departures is Step 4 (after Pricing), Itinerary → 5, Inclusions → 6
const STEPS = [
  { id: 1, label: "Basic Info",   icon: Package      },
  { id: 2, label: "Details",      icon: Tag          },
  { id: 3, label: "Pricing",      icon: DollarSign   },
  { id: 4, label: "Departures",   icon: CalendarDays },
  { id: 5, label: "Itinerary",    icon: Calendar     },
  { id: 6, label: "Inclusions",   icon: CheckCircle  },
];

const THEMES           = ["Family","Adventure","Spiritual","Nature","Honeymoon","Heritage","Wildlife"];
const SEASONS          = ["Winter","Summer","Monsoon"];
const DISCOUNT_OPTIONS = [0,5,10,15,20,25,30,40,50];

const emptyDeparture = () => ({ startDate: "", endDate: "", totalSeats: "" });

const initialForm = {
  name: "", location: "", destination: "", image: "",
  days: "", nights: "", price: "", originalPrice: "", discount: 0,
  description: "", tags: [""], themes: [], bestSeason: [],
  highlights: [""],
  itinerary: [{ day: 1, title: "", subtitle: "", activities: [""] }],
  included: [""], excluded: [""],
  departures: [emptyDeparture()],   // always at least 1 slot
};

export default function AddPackageModal({ open, onClose, onSave, packageData, isEditMode }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const isViewMode = !!packageData && !isEditMode;

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleArray = (field, value) => {
    setForm((prev) => {
      const exists = prev[field].includes(value);
      if (field === "themes" && !exists && prev.themes.length >= 3) {
        alert("You can select maximum 3 themes only.");
        return prev;
      }
      return {
        ...prev,
        [field]: exists ? prev[field].filter((v) => v !== value) : [...prev[field], value],
      };
    });
  };

  // Pricing
  const originalPrice = Number(form.originalPrice) || 0;
  const discount      = Number(form.discount)       || 0;
  const savings       = Math.round((originalPrice * discount) / 100);
  const sellingPrice  = Math.round(originalPrice - savings);

  // ── Departure helpers ─────────────────────────────────────────
  const addDeparture = () =>
    update("departures", [...form.departures, emptyDeparture()]);

  const removeDeparture = (idx) =>
    update("departures", form.departures.filter((_, i) => i !== idx));

  const updateDeparture = (idx, field, value) => {
    const updated = [...form.departures];
    updated[idx] = { ...updated[idx], [field]: value };
    update("departures", updated);
  };

  // Auto-fill end date when start date is picked
  const handleStartDate = (idx, value) => {
    const updated = [...form.departures];
    updated[idx].startDate = value;
    if (value && form.days && Number(form.days) > 0) {
      const end = new Date(value);
      end.setDate(end.getDate() + Number(form.days) - 1);
      updated[idx].endDate = end.toISOString().split("T")[0];
    }
    update("departures", updated);
  };

  // ── Other dynamic fields ──────────────────────────────────────
  const addDynamicField = (field, dayIndex = null, subField = null) => {
    if (field === "highlights") {
      update("highlights", [...form.highlights, ""]);
    } else if (field === "itinerary" && dayIndex === null) {
      update("itinerary", [
        ...form.itinerary,
        { day: form.itinerary.length + 1, title: "", subtitle: "", activities: [""] },
      ]);
    } else if (field === "itinerary" && subField === "activities") {
      const n = [...form.itinerary];
      n[dayIndex].activities.push("");
      update("itinerary", n);
    } else if (field === "included") {
      update("included", [...form.included, ""]);
    } else if (field === "excluded") {
      update("excluded", [...form.excluded, ""]);
    }
  };

  const handleNext = () => { if (step < STEPS.length) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); else onClose(); };

  // Sync itinerary length with form.days
  useEffect(() => {
    const totalDays = Number(form.days);
    if (!totalDays || totalDays <= 0) return;
    let updated = [...form.itinerary];
    if (totalDays > updated.length) {
      for (let i = updated.length; i < totalDays; i++)
        updated.push({ day: i + 1, title: "", subtitle: "", activities: [""] });
    }
    if (totalDays < updated.length) updated = updated.slice(0, totalDays);
    update("itinerary", updated.map((item, i) => ({ ...item, day: i + 1 })));
  }, [form.days]);

  // Populate form on edit/view
  useEffect(() => {
    if (packageData) {
      setForm({
        ...packageData,
        image: null,
        existingImage: packageData.image,
        departures:
          packageData.departures && packageData.departures.length > 0
            ? packageData.departures
            : [emptyDeparture()],
      });
    } else {
      setForm(initialForm);
    }
  }, [packageData]);

  // ── Save ──────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      if (form.bestSeason.length !== 1)  { alert("Please select exactly one Best Season."); return; }
      if (form.themes.length < 1)        { alert("Please select at least 1 theme."); return; }
      if (form.themes.length > 3)        { alert("You can select maximum 3 themes only."); return; }

      // Departure validation
      if (!form.departures || form.departures.length === 0) {
        alert("Please add at least one departure slot.");
        return;
      }
      for (let i = 0; i < form.departures.length; i++) {
        const d = form.departures[i];
        if (!d.startDate || !d.endDate || !d.totalSeats) {
          alert(`Departure ${i + 1}: Start date, end date and total seats are all required.`);
          return;
        }
        if (new Date(d.endDate) <= new Date(d.startDate)) {
          alert(`Departure ${i + 1}: End date must be after start date.`);
          return;
        }
        if (Number(d.totalSeats) <= 0) {
          alert(`Departure ${i + 1}: Total seats must be greater than 0.`);
          return;
        }
      }

      const formData = new FormData();
      formData.append("name",          form.name);
      formData.append("location",      form.location);
      formData.append("destination",   form.destination);
      formData.append("days",          form.days);
      formData.append("nights",        form.nights);
      formData.append("price",         sellingPrice);
      formData.append("originalPrice", form.originalPrice);
      formData.append("discount",      form.discount);
      formData.append("description",   form.description);

      if (form.image) {
        formData.append("image", form.image);
      } else {
        formData.append("existingImage", form.existingImage);
      }
      if (form.images && form.images.length > 0) {
        form.images.forEach((img) => formData.append("images", img));
      } else if (isEditMode) {
        formData.append("existingImages", JSON.stringify(packageData.images || []));
      }

      formData.append("tags",        JSON.stringify(form.themes));
      formData.append("themes",      JSON.stringify(form.themes));
      formData.append("bestSeason",  JSON.stringify(form.bestSeason));
      formData.append("highlights",  JSON.stringify(form.highlights));
      formData.append("included",    JSON.stringify(form.included));
      formData.append("excluded",    JSON.stringify(form.excluded));
      formData.append("itinerary",   JSON.stringify(form.itinerary));
      formData.append("departures",  JSON.stringify(form.departures));

      const url    = isEditMode
        ? `http://localhost:3000/updatePackage/${packageData._id}`
        : "http://localhost:3000/addPackageDetailsDynamic";

      const res = await axios({
        method: isEditMode ? "put" : "post",
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.flag === 1) {
        alert(isEditMode ? "Package Updated Successfully ✅" : "Package Added Successfully ✅");
        setForm(initialForm);
        setStep(1);
        onClose();
      }
    } catch (error) {
      console.error(error);
      alert(isEditMode ? "Failed to Update Package ❌" : "Failed to Add Package ❌");
    }
  };

  if (!open) return null;

  const today   = new Date().toISOString().split("T")[0];
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-8 py-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {isEditMode ? "Edit Package" : packageData ? "View Package" : "Add New Package"}
              </h2>
              <p className="text-sm text-gray-500">Step {step} of {STEPS.length}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* ── Stepper ── */}
          <div className="flex items-center px-8 py-4 border-b overflow-x-auto gap-1">
            {STEPS.map((s, index) => {
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex items-center flex-shrink-0">
                  <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap
                    ${step >= s.id ? "bg-[#00A3E1] text-white" : "bg-gray-100 text-gray-400"}`}>
                    <Icon size={13} />
                    {s.label}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-5 h-[2px] mx-1 flex-shrink-0 transition-all duration-300 ${step > s.id ? "bg-[#00A3E1]" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Content ── */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >

                {/* ══ STEP 1: BASIC INFO (unchanged) ══ */}
                {step === 1 && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="text-sm font-bold text-gray-700">Package Name *</label>
                      <input type="text" value={form.name} placeholder="e.g. Kashmir Paradise Tour"
                        onChange={(e) => update("name", e.target.value)} disabled={isViewMode}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700">Destination *</label>
                      <input type="text" value={form.destination} placeholder="e.g. Dwarka-Somnath"
                        onChange={(e) => update("destination", e.target.value)} disabled={isViewMode}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-black">Location *</label>
                      <select value={form.location} onChange={(e) => update("location", e.target.value)} disabled={isViewMode}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]">
                        <option value="">Select Destination</option>
                        {["Gujarat","Goa","Assam","Sikkim","Kerala","Kashmir","Rajasthan","MadhyaPradesh","UttarPradesh","Panjab","Maharastra","Tamilnadu"].map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-black">Days *</label>
                      <input type="number" min="1" value={form.days} placeholder="3" disabled={isViewMode}
                        onChange={(e) => {
                          const v = e.target.value;
                          update("days", v);
                          update("nights", v && Number(v) > 0 ? Number(v) - 1 : "");
                        }}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-black">Nights *</label>
                      <input type="number" value={form.nights} placeholder="2" readOnly disabled={isViewMode}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-bold text-gray-700">Image *</label>
                      <input type="file" onChange={(e) => update("image", e.target.files[0])} disabled={isViewMode}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-bold text-gray-700">Gallery Images (Max 5)</label>
                      <input type="file" multiple onChange={(e) => update("images", Array.from(e.target.files))} disabled={isViewMode}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-bold text-black">Description *</label>
                      <textarea rows="4" placeholder="Description of package" value={form.description}
                        onChange={(e) => update("description", e.target.value)} disabled={isViewMode}
                        className="mt-2 w-full rounded-xl border px-4 py-3 bg-gray-50 text-black outline-none focus:border-[#00A3E1]" />
                    </div>
                  </div>
                )}

                {/* ══ STEP 2: DETAILS (unchanged) ══ */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div>
                      <label className="text-sm font-bold text-black block mb-4">Travel Themes * (max 3)</label>
                      <div className="flex flex-wrap gap-3">
                        {THEMES.map(t => (
                          <button key={t} type="button" disabled={isViewMode}
                            onClick={() => { if (!isViewMode) toggleArray("themes", t); }}
                            className={`px-6 py-2 rounded-full border transition font-medium
                              ${form.themes.includes(t) ? "bg-[#00A3E1] text-white border-[#00A3E1]" : "border-gray-200 text-gray-500"}
                              ${isViewMode ? "opacity-60 cursor-not-allowed" : ""}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-black block mb-4">Best Season *</label>
                      <div className="flex flex-wrap gap-3">
                        {SEASONS.map(s => (
                          <button key={s} type="button" disabled={isViewMode}
                            onClick={() => setForm(prev => ({ ...prev, bestSeason: prev.bestSeason.includes(s) ? [] : [s] }))}
                            className={`px-6 py-2 rounded-full border transition font-medium
                              ${form.bestSeason.includes(s) ? "bg-[#00A3E1] text-white border-[#00A3E1]" : "border-gray-200 text-gray-500"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-bold text-black">Highlights</label>
                        <button type="button" onClick={() => addDynamicField("highlights")}
                          className="text-sm text-[#00A3E1] font-semibold">+ Add</button>
                      </div>
                      {form.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-3">
                          <input value={h} placeholder={`Highlight ${idx + 1}`} disabled={isViewMode}
                            onChange={(e) => { const n = [...form.highlights]; n[idx] = e.target.value; update("highlights", n); }}
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]" />
                          {form.highlights.length > 1 && (
                            <button type="button" onClick={() => update("highlights", form.highlights.filter((_, i) => i !== idx))}
                              className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ══ STEP 3: PRICING (unchanged) ══ */}
                {step === 3 && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-bold text-gray-700">Original Price (₹) *</label>
                        <input type="number" value={form.originalPrice} placeholder="39999" disabled={isViewMode}
                          onChange={(e) => update("originalPrice", e.target.value)}
                          className="mt-2 w-full h-12 px-4 rounded-xl border" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700">Discount</label>
                        <select value={form.discount} disabled={isViewMode} onChange={(e) => update("discount", e.target.value)}
                          className="mt-2 w-full h-12 px-4 rounded-xl border bg-white">
                          {DISCOUNT_OPTIONS.map(d => <option key={d} value={d}>{d}%</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700">Selling Price (₹)</label>
                        <input type="number" value={sellingPrice} readOnly
                          className="mt-2 w-full h-12 px-4 rounded-xl border bg-gray-100 cursor-not-allowed" />
                      </div>
                    </div>
                    {discount > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-700">{discount}%</div>
                        <div>
                          <p className="font-semibold text-gray-800">{discount}% Discount Applied</p>
                          <p className="text-black">Customer Saves ₹{savings.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                    <div className="border rounded-2xl p-6 bg-gray-50">
                      <p className="text-black mb-2"><b>Package Preview Card</b></p>
                      <p className="text-sm text-black">Starting From</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-[#00A3E1]">₹{sellingPrice.toLocaleString()}</span>
                          {discount > 0 && <span className="text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>}
                        </div>
                        {discount > 0 && (
                          <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">{discount}% OFF</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ══ STEP 4: DEPARTURES (NEW) ══ */}
                {step === 4 && (
                  <div className="space-y-5">

                    {/* Info banner */}
                    <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
                      <CalendarDays className="w-5 h-5 text-[#00A3E1] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Add Fixed Departure Slots</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Define when this tour departs. Users will pick a slot — no free date typing.
                          {form.days && Number(form.days) > 0 &&
                            <span className="text-[#00A3E1] font-medium"> End date auto-fills based on {form.days} days.</span>
                          }
                        </p>
                      </div>
                    </div>

                    {/* Departure cards */}
                    {form.departures.map((dep, idx) => (
                      <div key={`dep-${idx}`} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">

                        {/* Card header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#00A3E1]/10 text-[#00A3E1] font-bold text-sm flex items-center justify-center">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">Departure {idx + 1}</p>
                              {dep.startDate && dep.endDate && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {fmtDate(dep.startDate)} → {fmtDate(dep.endDate)}
                                </p>
                              )}
                            </div>
                          </div>
                          {/* Can only delete if more than 1 slot */}
                          {form.departures.length > 1 && !isViewMode && (
                            <button onClick={() => removeDeparture(idx)}
                              className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Card body — 3 fields in a row */}
                        <div className="p-6 grid grid-cols-3 gap-5">

                          {/* Start Date */}
                          <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                              Start Date *
                            </label>
                            <input
                              type="date"
                              value={dep.startDate}
                              min={today}
                              disabled={isViewMode}
                              onChange={(e) => handleStartDate(idx, e.target.value)}
                              className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm"
                            />
                          </div>

                          {/* End Date */}
                          <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1.5 items-center gap-1.5">
                              End Date *
                              {form.days && Number(form.days) > 0 && (
                                <span className="text-[10px] text-[#00A3E1] font-normal bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                                  auto-filled
                                </span>
                              )}
                            </label>
                            <input
                              type="date"
                              value={dep.endDate}
                              min={dep.startDate || today}
                              disabled={isViewMode}
                              onChange={(e) => updateDeparture(idx, "endDate", e.target.value)}
                              className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm"
                            />
                          </div>

                          {/* Total Seats */}
                          <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                              Total Seats *
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={dep.totalSeats}
                              placeholder="20"
                              disabled={isViewMode}
                              onChange={(e) => updateDeparture(idx, "totalSeats", e.target.value)}
                              className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1] text-sm"
                            />
                          </div>

                        </div>

                        {/* Live preview pill — appears once all 3 fields filled */}
                        {dep.startDate && dep.endDate && dep.totalSeats && (
                          <div className="px-6 pb-5">
                            <div className="inline-flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm">
                              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                              <span className="font-semibold text-green-800">
                                {fmtDate(dep.startDate)} – {fmtDate(dep.endDate)}
                              </span>
                              <span className="text-green-300">|</span>
                              <span className="text-green-700">{dep.totalSeats} seats</span>
                              <span className="text-green-300">|</span>
                              <span className="font-semibold text-green-800">
                                ₹{sellingPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add slot button */}
                    {!isViewMode && (
                      <button type="button" onClick={addDeparture}
                        className="w-full py-4 border-2 border-dashed border-[#00A3E1] rounded-2xl text-[#00A3E1] font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add Another Departure
                      </button>
                    )}

                    {/* Summary table — only shows when 2+ complete slots */}
                    {form.departures.filter(d => d.startDate && d.endDate && d.totalSeats).length >= 2 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                        <p className="text-sm font-bold text-gray-700 mb-3">All Scheduled Departures</p>
                        <div className="space-y-2">
                          {form.departures
                            .filter(d => d.startDate && d.endDate && d.totalSeats)
                            .map((d, i) => (
                              <div key={i} className="flex items-center justify-between py-2.5 px-4 bg-white rounded-xl border border-gray-100 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A3E1]" />
                                  <span className="font-medium text-gray-700">Departure {i + 1}</span>
                                </div>
                                <span className="text-gray-500">
                                  {fmtDate(d.startDate)} → {fmtDate(d.endDate)}
                                </span>
                                <span className="text-gray-600 font-medium">{d.totalSeats} seats</span>
                                <span className="font-semibold text-[#00A3E1]">₹{sellingPrice.toLocaleString()}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ══ STEP 5: ITINERARY (was step 4) ══ */}
                {step === 5 && (
                  <div className="space-y-8">
                    {form.itinerary.map((item, idx) => (
                      <div key={`day-${idx}`} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-[#00A3E1] flex items-center justify-center font-bold">{idx + 1}</div>
                            <h3 className="font-semibold text-gray-800">Day {idx + 1}</h3>
                          </div>
                          {form.itinerary.length > 1 && (
                            <button onClick={() => update("itinerary",
                              form.itinerary.filter((_, i) => i !== idx).map((it, i) => ({ ...it, day: i + 1 })))}
                              className="text-red-500 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                          )}
                        </div>
                        <div className="p-6 space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="text-sm font-medium text-black block mb-2">Title</label>
                              <input value={item.title} placeholder="e.g. Arrival in Srinagar" disabled={isViewMode}
                                onChange={(e) => { const n = [...form.itinerary]; n[idx].title = e.target.value; update("itinerary", n); }}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#00A3E1] outline-none bg-gray-50" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-black block mb-2">Subtitle</label>
                              <input value={item.subtitle} placeholder="e.g. Welcome to Paradise!" disabled={isViewMode}
                                onChange={(e) => { const n = [...form.itinerary]; n[idx].subtitle = e.target.value; update("itinerary", n); }}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#00A3E1] outline-none bg-gray-50" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="text-sm font-medium text-black">Activities</label>
                              <button type="button" onClick={() => addDynamicField("itinerary", idx, "activities")}
                                className="text-sm text-[#00A3E1] font-semibold flex items-center gap-1">
                                <Plus className="w-4 h-4" />Add
                              </button>
                            </div>
                            {item.activities.map((act, actIdx) => (
                              <div key={`activity-${idx}-${actIdx}`} className="flex items-center gap-2 mb-3">
                                <input value={act} placeholder={`Activity ${actIdx + 1}`} disabled={isViewMode}
                                  onChange={(e) => { const n = [...form.itinerary]; n[idx].activities[actIdx] = e.target.value; update("itinerary", n); }}
                                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#00A3E1]" />
                                {item.activities.length > 1 && (
                                  <button type="button"
                                    onClick={() => { const n = [...form.itinerary]; n[idx].activities = n[idx].activities.filter((_, i) => i !== actIdx); update("itinerary", n); }}
                                    className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" /></button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ══ STEP 6: INCLUSIONS (was step 5) ══ */}
                {step === 6 && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-gray-800">✓ What's Included</h4>
                          <button type="button" onClick={() => addDynamicField("included")}
                            className="text-sm text-blue-500 font-semibold">+ Add</button>
                        </div>
                        {form.included.map((inc, idx) => (
                          <div key={`included-${idx}`} className="flex items-center gap-3 mb-3">
                            <input value={inc} placeholder="e.g. Accommodation" disabled={isViewMode}
                              onChange={(e) => { const u = [...form.included]; u[idx] = e.target.value; update("included", u); }}
                              className="flex-1 h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            {form.included.length > 1 && (
                              <button type="button" onClick={() => update("included", form.included.filter((_, i) => i !== idx))}
                                className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" /></button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-red-500">✗ What's Excluded</h4>
                          <button type="button" onClick={() => addDynamicField("excluded")}
                            className="text-sm text-blue-500 font-semibold">+ Add</button>
                        </div>
                        {form.excluded.map((ex, idx) => (
                          <div key={`excluded-${idx}`} className="flex items-center gap-3 mb-3">
                            <input value={ex} placeholder="e.g. Flights" disabled={isViewMode}
                              onChange={(e) => { const u = [...form.excluded]; u[idx] = e.target.value; update("excluded", u); }}
                              className="flex-1 h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400" />
                            {form.excluded.length > 1 && (
                              <button type="button" onClick={() => update("excluded", form.excluded.filter((_, i) => i !== idx))}
                                className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" /></button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Package summary */}
                    <div className="p-8 rounded-2xl border border-blue-200 bg-blue-50/40">
                      <h4 className="font-bold text-black mb-6">Package Summary</h4>
                      <div className="grid grid-cols-4 gap-6">
                        {[
                          { label: "Name",        value: form.name || "—" },
                          { label: "Destination", value: form.destination || "—" },
                          { label: "Price",       value: `₹${sellingPrice || 0}`, color: "text-[#00A3E1]" },
                          { label: "Duration",    value: form.days && Number(form.days) > 0
                              ? `${Number(form.days)} Days / ${Number(form.days) - 1} Nights` : "—" },
                        ].map((item, i) => (
                          <div key={i} className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
                            <p className="text-xs font-bold text-black uppercase mb-2">{item.label}</p>
                            <p className={`text-sm font-bold truncate ${item.color || "text-gray-800"}`}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                      {/* Departure count hint */}
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                        <CalendarDays className="w-4 h-4 text-[#00A3E1]" />
                        <span>
                          <b className="text-gray-700">
                            {form.departures.filter(d => d.startDate && d.endDate && d.totalSeats).length}
                          </b> departure slot(s) scheduled
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between px-8 py-6 border-t bg-gray-50/50">
            <button onClick={handleBack}
              className="flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-[#00A3E1] text-[#00A3E1] font-bold hover:bg-blue-50 transition">
              <ChevronLeft className="w-5 h-5" />
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <div className="flex gap-2">
              {STEPS.map(s => (
                <div key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${step >= s.id ? "w-8 bg-[#00A3E1]" : "w-3 bg-gray-200"}`} />
              ))}
            </div>

            {step < STEPS.length ? (
              <button onClick={handleNext}
                className="flex items-center gap-2 px-10 py-3 rounded-xl bg-[#00A3E1] text-white font-bold hover:bg-[#008cc2] transition shadow-lg shadow-blue-200">
                Next <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handleSave}
                className="flex items-center gap-2 px-10 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200">
                <CheckCircle className="w-5 h-5" />
                {isEditMode ? "Update Package" : "Save Package"}
              </button>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
