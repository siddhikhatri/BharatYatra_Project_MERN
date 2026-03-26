// import { Link } from "react-router-dom";
// import { Bell } from "lucide-react";
// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";

// export default function DashboardHeader() {

//   const { currentUser } = useAuth();
//   const [openNotification, setOpenNotification] = useState(false);

//   const notification = [
//     { title: "Booking Confirmed", msg: "Your Thailand Trip is Confirmed." },
//     { title: "Payment Pending", msg: "Please Confirm Your Payment." },
//     { title: "New Review", msg: "You received a 5★ review." }
//   ];

// return (

//   <div className="flex justify-between items-center mb-8">

//     {/* Back Button */}
//     <Link to="/" className="text-gray-500 hover:text-black">
//       ← Back to Home
//     </Link>

//     <div className="flex items-center gap-5">

//       {/* Notification Bell */}
//       <div className="relative">

//         <button
//           onClick={() => setOpenNotification(!openNotification)}
//           className="relative"
//         >

//           <Bell className="text-gray-500 cursor-pointer" size={22} />

//           {/* Notification Count */}
//           <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
//             {notification.length}
//           </span>

//         </button>

//         {/* Notification Dropdown */}
//         {openNotification && (

//           <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg p-4 z-50">

//             <h3 className="font-semibold mb-3">
//               Notifications
//             </h3>

//             {notification.map((n, index) => (

//               <div key={index} className="border-b py-2 last:border-none">

//                 <p className="font-medium text-sm">
//                   {n.title}
//                 </p>

//                 <p className="text-gray-500 text-xs">
//                   {n.msg}
//                 </p>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>


//       {/* User Info */}
//       <div className="flex items-center gap-2">

//         <span className="font-medium">
//           {currentUser?.name}
//         </span>

//         <img
//           src="https://i.pravatar.cc/40"
//           className="w-9 h-9 rounded-full"
//         />

//       </div>

//     </div>

//   </div>

// );
// }

import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {

  const { currentUser } = useAuth();
  const [openNotification, setOpenNotification] = useState(false);

  const notification = [
    { title: "Booking Confirmed", msg: "Your Thailand Trip is Confirmed." },
    { title: "Payment Pending", msg: "Please Confirm Your Payment." },
    { title: "New Review", msg: "You received a 5★ review." }
  ];

  return (

    <div className="w-full flex justify-between items-center px-6 py-4 bg-white border-b border-gray-300">

      {/* Back Button */}
      <Link to="/" className="text-gray-500 hover:text-black">
        ← Back to Home
      </Link>

      <div className="flex items-center gap-6 relative">

        {/* Notification Bell */}
        <div className="relative">

          <button
            onClick={() => setOpenNotification(!openNotification)}
            className="relative"
          >

            <Bell className="text-gray-500 cursor-pointer" size={22} />

            {/* Notification Count */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {notification.length}
            </span>

          </button>

          {/* Notification Dropdown */}
          {openNotification && (

            <div className="absolute right-0 top-10 w-72 bg-white shadow-lg border rounded-lg p-4 z-50">

              <h3 className="font-semibold mb-3">
                Notifications
              </h3>

              {notification.map((n, index) => (

                <div key={index} className="border-b py-2 last:border-none">

                  <p className="font-medium text-sm">
                    {n.title}
                  </p>

                  <p className="text-gray-500 text-xs">
                    {n.msg}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* User Info */}
        <div className="flex items-center gap-2">

          <span className="font-medium">
            {currentUser?.name}
          </span>

          <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold uppercase">
            {currentUser?.name?.charAt(0)}
          </div>

        </div>

      </div>

    </div>

  );
}