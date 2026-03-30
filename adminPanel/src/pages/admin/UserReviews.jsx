import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Star, MessageSquare } from "lucide-react";
import axios from "axios";

export default function UserReviews() {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((rev) =>
    rev.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.packageId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteReview = async (id) => {
    if (window.confirm("Delete this review?")) {
      try {
        await axios.delete(`http://localhost:3000/deleteReview/${id}`);
        setReviews(reviews.filter((r) => r._id !== id));
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-bold text-black">
          <Star className="w-6 h-6 text-cyan-600" />
          User Reviews
        </h1>
        <p className="text-black">Total {reviews.length} Reviews</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>
        <input
          type="text"
          placeholder="Search by user or package..."
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Package</th>
              <th className="px-6 py-4 text-left">Rating</th>
              <th className="px-6 py-4 text-left">Review</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredReviews.map((rev,index)=>(
              <motion.tr
                key={rev._id}
                initial={{opacity:0,y:10}}
                animate={{opacity:1,y:0}}
                transition={{delay:index*0.05}}
                className="border-b"
              >

                {/* User */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  {rev.userName}
                </td>

                {/* Package */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  {rev.packageId?.name || "Package Deleted"}
                </td>

                {/* Rating */}
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((star)=>(
                      <Star
                        key={star}
                        size={18}
                        className={
                          star <= rev.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </td>

                {/* Review */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  {rev.review}
                </td>

                {/* Delete */}
                <td className="px-6 py-4">
                  <button
                    onClick={()=>deleteReview(rev._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18}/>
                  </button>
                </td>

              </motion.tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}