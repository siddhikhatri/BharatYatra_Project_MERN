import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {

  const { currentUser } = useAuth();
  

  return (

    <div className="w-full flex justify-between items-center px-6 py-4 bg-white border-b border-gray-300">

      {/* Back Button */}
      <Link to="/" className="text-gray-500 hover:text-black">
        ← Back to Home
      </Link>

      <div className="flex items-center gap-6 relative">

        {/* Notification Bell */}
        

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