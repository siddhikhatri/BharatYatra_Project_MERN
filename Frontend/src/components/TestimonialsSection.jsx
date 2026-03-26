// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Star, Quote } from "lucide-react";
// import { testimonials } from "/src/data/travelData";
// import axios from 'axios';

// const TestimonialsSection = () => {


//   const [review, setReviews] = useState([]);
//   useEffect(() => {


//     const fetchReviews = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:3000/getAllReviews");

//         setReviews(res.data);

//       } catch (error) {
//         console.log("Error fetching reviews:", error);
//       }
//     };

//     fetchReviews();

//   }, []);

//   return (
//     <section className="section-padding bg-background">
//       <div className="container mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-12"
//         >
//           <span className="text-primary font-medium text-sm uppercase tracking-wider ">
//             Happy Travelers
//           </span>
//           <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
//             What Our Clients Say
//           </h2>
//           <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
//             Discover why thousands of travelers trust us with their dream vacations.
//           </p>
//         </motion.div>

//         {/* Testimonial Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {review.map((testimonial, index) => (
//             <motion.div
//               key={testimonial._id}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow"
//             >
//               {/* Quote Icon */}
//               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
//                 <Quote className="w-5 h-5 text-primary" />
//               </div>

//               {/* Rating */}
//               <div className="flex gap-1 mb-3">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`w-4 h-4 ${i < testimonial.rating
//                         ? "fill-yellow-400 text-yellow-400"
//                         : "text-muted"
//                       }`}
//                   />
//                 ))}
//               </div>

//               {/* Review */}
//               <p className="text-foreground/80 text-sm leading-relaxed mb-4">
//                 "{testimonial.review}"
//               </p>

//               {/* Trip */}
//               <p className="text-xs text-primary font-medium mb-4">
//                 Trip: {testimonial.packageId?.name}
//               </p>

//               {/* User */}
//               <div className="flex items-center gap-3 pt-4 border-t border-border">
//                 <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold uppercase">
//                   {testimonial.userName?.charAt(0)}
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-foreground text-sm">
//                     {testimonial.userName}
//                   </h4>
//                   <p className="text-xs text-muted-foreground">
//                     {testimonial.location}
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TestimonialsSection;








import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import axios from "axios";

const TestimonialsSection = () => {

  const [review, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:3000/getAllReviews");
        setReviews(res.data);
      } catch (error) {
        console.log("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // ✅ Infinite Next
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      review.length === 0 ? 0 : (prev + 1) % review.length
    );
  };

  // ✅ Infinite Prev
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      review.length === 0
        ? 0
        : prev === 0
          ? review.length - 1
          : prev - 1
    );
  };

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-m uppercase tracking-wider">
            Happy Travelers
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            What Our Clients Say
          </h2>

          <p className="text-black mt-2 max-w-xl mx-auto">
            Discover why thousands of travelers trust us.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">

          {/* Left Arrow */}
          <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 z-10">◀</button>
          <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 z-10">▶</button>

          <div className="overflow-hidden ">
          {/* Cards */}
          <div className="flex shadow-lg">

            {review.length > 0 &&
              [0, 1, 2].map((offset) => {
                const index = (currentIndex + offset) % review.length;
                const testimonial = review[index];

                return (
                  <div key={testimonial._id} className="w-1/3 px-3">
                    <motion.div
                      key={currentIndex + "-" + offset}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white rounded-2xl p-6 shadow-lg transition-all h-full"
                    >

                      {/* Quote */}
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Quote className="w-5 h-5 text-blue-500" />
                      </div>

                      {/* Rating */}
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < testimonial.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>

                      {/* Review */}
                      <p className="text-lg font-medium leading-relaxed mb-4">
                        "{testimonial.review}"
                      </p>

                      {/* Trip */}
                      <p className="text-m text-blue-500 font-medium mb-4">
                        Trip: {testimonial.packageId?.name}
                      </p>

                      {/* User */}
                      <div className="flex items-center gap-3 pt-4 border-t">

                        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold uppercase">
                          {testimonial.userName?.charAt(0)}
                        </div>

                        <div>
                          <h4 className="font-semibold text-m">
                            {testimonial.userName}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {/* {testimonial.userEmail} */}
                          </p>
                        </div>

                      </div>

                    </motion.div>
                  </div>
                );
              })}
              </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;












//autoslider
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Star, Quote } from "lucide-react";
// import axios from "axios";

// const TestimonialsSection = () => {

//   const [review, setReviews] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {

//     const fetchReviews = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/getAllReviews");
//         setReviews(res.data);
//       } catch (error) {
//         console.log("Error fetching reviews:", error);
//       }
//     };

//     fetchReviews();

//   }, []);

//   // ✅ Infinite Next
//   const nextSlide = () => {
//     setCurrentIndex((prev) =>
//       review.length === 0 ? 0 : (prev + 1) % review.length
//     );
//   };

//   // ✅ Infinite Prev
//   const prevSlide = () => {
//     setCurrentIndex((prev) =>
//       review.length === 0
//         ? 0
//         : prev === 0
//         ? review.length - 1
//         : prev - 1
//     );
//   };

//   // 🔥 Auto Slide (optional but smooth UX)
//   useEffect(() => {
//     if (review.length === 0) return;

//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % review.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [review]);

//   return (
//     <section className="section-padding bg-background">
//       <div className="container mx-auto">

//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-12"
//         >
//           <span className="text-primary font-medium text-sm uppercase tracking-wider">
//             Happy Travelers
//           </span>

//           <h2 className="text-3xl md:text-4xl font-bold mt-2">
//             What Our Clients Say
//           </h2>

//           <p className="text-gray-500 mt-2 max-w-xl mx-auto">
//             Discover why thousands of travelers trust us.
//           </p>
//         </motion.div>

//         {/* Carousel */}
//         <div className="relative">

//           {/* Left Arrow */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full z-10 hover:bg-gray-100"
//           >
//             ◀
//           </button>

//           {/* Right Arrow */}
//           <button
//             onClick={nextSlide}
//             className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full z-10 hover:bg-gray-100"
//           >
//             ▶
//           </button>

//           {/* Cards */}
//           <div className="flex">

//             {review.length > 0 &&
//               [0, 1, 2].map((offset) => {
//                 const index = (currentIndex + offset) % review.length;
//                 const testimonial = review[index];

//                 return (
//                   <div
//                     key={testimonial._id}
//                     className="w-1/3 px-3"
//                   >
//                     <motion.div
//                       key={currentIndex + offset}
//                       initial={{ opacity: 0, x: 50 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.4 }}
//                       className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all h-full"
//                     >

//                       {/* Quote */}
//                       <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
//                         <Quote className="w-5 h-5 text-blue-500" />
//                       </div>

//                       {/* Rating */}
//                       <div className="flex gap-1 mb-3">
//                         {Array.from({ length: 5 }).map((_, i) => (
//                           <Star
//                             key={i}
//                             className={`w-5 h-5 ${
//                               i < testimonial.rating
//                                 ? "fill-yellow-400 text-yellow-400"
//                                 : "text-gray-300"
//                             }`}
//                           />
//                         ))}
//                       </div>

//                       {/* Review */}
//                       <p className="text-lg font-medium leading-relaxed mb-4">
//                         "{testimonial.review}"
//                       </p>

//                       {/* Trip */}
//                       <p className="text-sm text-blue-500 font-medium mb-4">
//                         Trip: {testimonial.packageId?.name}
//                       </p>

//                       {/* User */}
//                       <div className="flex items-center gap-3 pt-4 border-t">

//                         <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold uppercase">
//                           {testimonial.userName?.charAt(0)}
//                         </div>

//                         <div>
//                           <h4 className="font-semibold text-sm">
//                             {testimonial.userName}
//                           </h4>
//                           <p className="text-xs text-gray-500">
//                             {testimonial.userEmail}
//                           </p>
//                         </div>

//                       </div>

//                     </motion.div>
//                   </div>
//                 );
//               })}

//           </div>

//         </div>

//       </div>
//     </section>
//   );
// };

// export default TestimonialsSection;





//chatgpt
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Star, Quote } from "lucide-react";
// import axios from "axios";

// const TestimonialsSection = () => {

//   const [review, setReviews] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {

//     const fetchReviews = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/getAllReviews");
//         setReviews(res.data);
//       } catch (error) {
//         console.log("Error fetching reviews:", error);
//       }
//     };

//     fetchReviews();

//   }, []);

//   // 👉 Next Slide
//   const nextSlide = () => {
//     if (currentIndex < review.length - 3) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   // 👉 Previous Slide
//   const prevSlide = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   return (
//     <section className="section-padding bg-background">
//       <div className="container mx-auto">

//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-12"
//         >
//           <span className="text-primary font-medium text-sm uppercase tracking-wider bg-gray-50">
//             Happy Travelers
//           </span>

//           <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
//             What Our Clients Say
//           </h2>

//           <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
//             Discover why thousands of travelers trust us with their dream vacations.
//           </p>
//         </motion.div>

//         {/* Carousel */}
//         <div className="relative">

//           {/* Left Arrow */}
//           <button
//             onClick={prevSlide}
//             disabled={currentIndex === 0}
//             className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full z-10 disabled:opacity-50"
//           >
//             ◀
//           </button>

//           {/* Right Arrow */}
//           <button
//             onClick={nextSlide}
//             disabled={currentIndex >= review.length - 3}
//             className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 disabled:opacity-50"
//           >
//             ▶
//           </button>

//           {/* Carousel Container */}
//           <div className="overflow-hidden">
//             <div
//               className="flex transition-transform duration-500"
//               style={{
//                 transform: `translateX(-${currentIndex * 33.33}%)`
//               }}
//             >

//               {review.map((testimonial) => (
//                 <div
//                   key={testimonial._id}
//                   className="min-w-[33.33%] px-3"
//                 >
//                   <motion.div
//                     className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow h-full"
//                   >

//                     {/* Quote */}
//                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
//                       <Quote className="w-5 h-5 text-blue-500" />
//                     </div>

//                     {/* Rating */}
//                     <div className="flex gap-1 mb-3">
//                       {Array.from({ length: 5 }).map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-5 h-5 ${
//                             i < testimonial.rating
//                               ? "fill-yellow-400 text-yellow-400"
//                               : "text-gray-300"
//                           }`}
//                         />
//                       ))}
//                     </div>

//                     {/* Review (BIG TEXT) */}
//                     <p className="text-lg font-medium leading-relaxed mb-4">
//                       "{testimonial.review}"
//                     </p>

//                     {/* Trip */}
//                     <p className="text-sm text-blue-500 font-medium mb-4">
//                       Trip: {testimonial.packageId?.name}
//                     </p>

//                     {/* User */}
//                     <div className="flex items-center gap-3 pt-4 border-t">

//                       <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold uppercase">
//                         {testimonial.userName?.charAt(0)}
//                       </div>

//                       <div>
//                         <h4 className="font-semibold text-sm">
//                           {testimonial.userName}
//                         </h4>
//                         <p className="text-xs text-gray-500">
//                           {testimonial.userEmail}
//                         </p>
//                       </div>

//                     </div>

//                   </motion.div>
//                 </div>
//               ))}

//             </div>
//           </div>

//         </div>

//       </div>
//     </section>
//   );
// };

// export default TestimonialsSection;

