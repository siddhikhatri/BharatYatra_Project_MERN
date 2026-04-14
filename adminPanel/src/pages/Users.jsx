import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MoreVertical, SquareUser, LayoutDashboard, User,Eye,Edit,Trash2 } from "lucide-react";
import axios from "axios";


const getTierColor = (tier) => {
  switch (tier) {
    case "Platinum":
      return "bg-blue-100 text-blue-700";
    case "Gold":
      return "bg-yellow-100 text-yellow-700";
    case "Silver":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function Users() {
  
  const [users, setUser] = useState([]);
  const [error, setError] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:3000/getUserData");

        setUser(res.data);
      } catch (err) {
        console.log("Error in fetching Data.", err);
        setError("Failed To Fetch Users");
      }
    };
    fetchUsers();
  }, []);

  const userStats = [
    { label: "Total Users", value: users.length },
   
  ];

  //Search User Filter
  const [searchTerm, setSearchTerm] = useState("");
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
          <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          Users
        </h1>
        <p className="text-black text-m mt-1">
          {users.length} Registered Users
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
        {userStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-xl border border-gray-200  p-6 text-center shadow-lg"
          >
            <h3 className="text-3xl font-bold text-black">
              {stat.value}
            </h3>
            <p className="text-sm text-black mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-m  border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left   text-black">
                    User
                  </th>
                  <th className="px-6 py-4 text-left  text-black">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left  text-black">
                    Phone
                  </th>
                  {/* <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase">
                    Trips
                  </th> */}
                  <th className="px-6 py-4 text-left    text-black ">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                  >
                    {/* User */}
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <img
                          src={`http://localhost:3000/Images/users/${user.avatar}`}
                          alt="user"
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="font-medium text-black">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-m font-medium text-black">
                      {user.email}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-m font-medium text-black">
                      {user.phone}
                    </td>

                    {/* Trips */}
                    {/* <td className="px-6 py-4 text-sm font-semibold text-black">
                      {user.trips}
                    </td> */}

                    

                    

                    {/* Actions */}
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          className="p-2 text-black hover:text-cyan-600" 
                          onClick={() => setSelectedUser(user)}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}  
                          className="p-2 text-black hover:text-red-600" >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
      {selectedUser && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    
    <div className="bg-white w-[400px] rounded-xl shadow-xl p-6 relative">

      {/* Close Button */}
      <button
        onClick={() => setSelectedUser(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black"
      >
        ✖
      </button>

      {/* Profile Image */}
      <div className="flex flex-col items-center text-center">
        <img
          src={`http://localhost:3000/Images/users/${selectedUser.avatar}`}
          alt="user"
          className="w-24 h-24 rounded-full border-4 border-cyan-500 shadow-md"
        />

        {/* Name */}
        <h2 className="mt-3 text-xl font-bold text-gray-900">
          {selectedUser.name}
        </h2>

        
      </div>

      {/* Divider */}
      <div className="my-4 border-t"></div>

      {/* Other Details */}
      <div className="space-y-2 text-sm text-gray-700">
        {/* <p><b>User ID:</b> {selectedUser._id}</p> */}
        <p><b>Name:</b> {selectedUser.name}</p>
        <p><b>Email:</b> {selectedUser.email}</p>
        <p><b>Phone:</b> {selectedUser.phone}</p>
        <p><b>Address:</b> {selectedUser.address}</p>
        <p><b>City:</b> {selectedUser.city}</p>
        <p><b>Country:</b> {selectedUser.country}</p>
        
        {/* Add more fields if available */}
        {/* <p><b>Joined:</b> {selectedUser.createdAt}</p> */}
        {/* <p><b>Bookings:</b> {selectedUser.totalBookings}</p> */}
      </div>

    </div>
  </div>
)}
    </div>
  );
}