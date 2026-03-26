import { useState, useEffect } from "react";
import axios from "axios";
import { Star, Pencil, Trash2, ExternalLink } from "lucide-react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "/src/components/dashboard/DashboardHeader";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

export default function Reviews() {

  const { currentUser, token, openAuthModal } = useAuth();
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  //  Fetch user reviews
  useEffect(() => {
    window.scrollTo(0, 0);

    if (!token) {
      openAuthModal("signin");   // opens modal
      navigate("/");             // redirect to home
      return;
    }

    const fetchReviews = async () => {
      try {

        if (!currentUser?.email) return;

        const res = await axios.get(
          `http://localhost:3000/getUserReviews/${currentUser.email}`
        );

        setReviews(res.data);

      } catch (error) {
        console.log("Error fetching reviews:", error);
      }
    };

    fetchReviews();

  }, [currentUser,navigate,token]);


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await axios.delete(`http://localhost:3000/deleteReview/${id}`);

      setReviews(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.log("Delete error:", err);
    }
  };



  return (

    <div className="flex min-h-screen">

      <DashboardSidebar />

      <div className="flex-1 flex flex-col">

        <DashboardHeader />

        <div className="p-8 bg-gray-50 flex-1">

          {/* TITLE */}
          <h1 className="text-3xl font-bold mb-6">
            Your Reviews
          </h1>

          <div className="space-y-6">

            {reviews.length === 0 ? (
              <p className="text-gray-400 text-center">
                No reviews found.
              </p>
            ) : (

              reviews.map((review) => (

                <div
                  key={review._id}
                  className="bg-white rounded-2xl p-6 shadow"
                >

                  {/* TOP */}
                  <div className="flex justify-between items-start">

                    {/* <p className="text-black0">
                      In tour:
                      <span className="font-semibold ml-1">
                        {review.packageId?.name}
                      </span>
                      <ExternalLink className="inline ml-2" size={16} />
                    </p> */}
                    <p className="text-black">
                      In tour:
                      <span
                        className="font-semibold ml-1 cursor-pointer text-blue-600 hover:underline"
                        onClick={() => navigate(`/packages/${review.packageId?._id}`)}
                      >
                        {review.packageId?.name}
                      </span>

                      <ExternalLink
                        className="inline ml-2 cursor-pointer text-blue-600"
                        size={16}
                        onClick={() => navigate(`/packages/${review.packageId?._id}`)}
                      />
                    </p>

                    <div className="flex gap-5">

                      {/* <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                        <Pencil size={16} />
                        Edit
                      </button> */}

                      <button className="flex items-center gap-2 text-red-500 hover:text-red-600">
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>

                  </div>

                  {/* PACKAGE IMAGE */}
                  {review.packageId?.image && (
                    <img
                      src={`http://localhost:3000/Images/${review.packageId.image}`}
                      className="w-28 h-28 rounded-lg object-cover mb-4"
                    />
                  )}

                  {/* TEXT */}
                  <p className="text-black mb-4 max-w-3xl">
                    {review.review}
                  </p>

                  {/* ⭐ STARS */}
                  <div className="flex mt-3 mb-3">
                    {[...Array(review.rating || 0)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="text-orange-500 fill-orange-500"
                      />
                    ))}
                  </div>


                  {/* FOOTER */}
                  <div className="flex justify-between items-center">

                    <p className="text-black text-sm">
                      On {new Date(review.createdAt).toLocaleDateString()}
                    </p>


                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  );
}