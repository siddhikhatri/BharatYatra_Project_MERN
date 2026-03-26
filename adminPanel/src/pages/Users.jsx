import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MoreVertical, SquareUser, LayoutDashboard, User } from "lucide-react";
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
  // const [users] = useState([]);


  const [users, setUser] = useState([]);
  const [error, setError] = useState([]);
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
    // { label: "Premium", value: 2 },
    // { label: "Gold", value: 2 },
    // { label: "Silver", value: 2 },
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
                  {/* <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase">
                    Tier
                  </th> */}
                  {/* <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase">
                    Joined
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

                    {/* Tier */}
                    {/* <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(
                          user.tier
                        )}`}
                      >
                        {user.tier}
                      </span>
                    </td> */}

                    {/* Joined */}
                    {/* <td className="px-6 py-4 text-sm text-gray-700">
                      {user.joined}
                    </td> */}

                    {/* Action */}
                    <td className="px-6 py-4 font-medium">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-600 hover:text-cyan-600"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}