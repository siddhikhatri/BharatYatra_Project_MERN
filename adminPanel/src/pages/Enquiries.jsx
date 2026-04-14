import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MessageSquare } from "lucide-react";
import axios from "axios";

export function Enquiries() {
  const [contactEnquiries, setContactEnquiries] = useState([]);  // Enquiry From Contact
  const [packageEnquiries, setPackageEnquiries] = useState([]);  // Enquiry From Package
  const [activeTab, setActiveTab] = useState("contact");
  const [searchTerm, setSearchTerm] = useState("");  //Search Enquiry
  const [selectedEnquiry, setSelectedEnquiry] = useState(null); //Enquiry Details
  const [error, setError] = useState(null) //Error Message
  const enquiries = activeTab === "contact" ? contactEnquiries : packageEnquiries

  const getStatusColor = (status) => {

    const s = (status || "new").toLowerCase();

    switch (s) {
      case "new":
        return "bg-blue-100 text-blue-700";

      case "replied":
        return "bg-green-100 text-green-700";

      case "closed":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }

  };


  const filteredEnquiries = enquiries.filter((enquiry) => {
    const name = enquiry.name || "";
    const subject = enquiry.subject || enquiry.packageName || "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const fetchEnquiries = async () => {
    try {
      const contactRes = await axios.get("http://localhost:3000/getEnquiries");
      const packageRes = await axios.get("http://localhost:3000/getPackageEnquiries");

      setContactEnquiries(contactRes.data);
      setPackageEnquiries(packageRes.data);
    } catch (err) {
      console.log("Error", err);
      setError("Failed To Fetch Enquiries.");
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (status) => {
    await axios.put(
      `http://localhost:3000/updateEnquiryStatus/${selectedEnquiry._id}`,
      { status }
    );

    alert("Marked as solved ✅");

    await fetchEnquiries(); 
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
          <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          Enquiries
        </h1>
        <p className="text-black text-m mt-1">
          Manage Customer Travel Enquiries
        </p>
        <div className="flex gap-4 mt-4">

          <button
            onClick={() => setActiveTab("contact")}
            className={`px-4 py-2 rounded-lg ${activeTab === "contact"
              ? "bg-cyan-500 text-white"
              : "bg-gray-100"
              }`}
          >
            Contact Enquiries ({contactEnquiries.length})
          </button>

          <button
            onClick={() => setActiveTab("package")}
            className={`px-4 py-2 rounded-lg ${activeTab === "package"
              ? "bg-cyan-500 text-white"
              : "bg-gray-100"
              }`}
          >
            Package Enquiries ({packageEnquiries.length})
          </button>

        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative max-w-md shadow-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          <input
            type="text"
            placeholder="Search enquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shadow-lg">
        {/* Enquiries List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            {filteredEnquiries.map((enquiry, index) => (
              <motion.div
                key={enquiry._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedEnquiry(enquiry)}
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-black">
                        {enquiry.name}
                      </h3>

                      {/* Badge replaced */}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(
                          enquiry.status
                        )}`}
                      >
                        {(enquiry.status || "new").charAt(0).toUpperCase() + (enquiry.status || "new").slice(1)}
                      </span>
                    </div>

                    <p className="text-m font-medium text-black mb-1">
                      {enquiry.subject || enquiry.packageName}
                    </p>

                    <p className="text-m font-medium text-black line-clamp-2">
                      {enquiry.msg || enquiry.message}
                    </p>
                  </div>

                  {/* <span className="text-xs text-gray-500 ml-4">
                    {enquiry.date}
                  </span> */}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>



        {/* Details Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 sticky top-24">
            {selectedEnquiry ? (
              <div className="space-y-3">

                <h3 className="font-medium text-black underline">
                  {selectedEnquiry.name}
                </h3>

                <p className="text-m font-medium text-black">
                  <u>Email :</u>    {selectedEnquiry.email}
                </p>

                {selectedEnquiry.phone && (
                  <p className="text-m font-medium text-black">
                    <u>Phone :</u> {selectedEnquiry.phone}
                  </p>
                )}

                <p className="text-m font-medium text-black">
                  <u>Package Name :</u> {selectedEnquiry.subject || selectedEnquiry.packageName}
                </p>

                {selectedEnquiry.travelDate && (
                  <p className="text-m font-medium text-black">
                    <u>Travel Date :</u>  {new Date(selectedEnquiry.travelDate).toLocaleDateString()}
                  </p>
                )}

                {selectedEnquiry.adults && (
                  <p className="text-m font-medium text-black">
                    <u>Adults :</u>  {selectedEnquiry.adults} <br />
                    <u>Children :</u> {selectedEnquiry.children}
                  </p>
                )}



                <p className="text-m font-medium text-black">
                  <u>Enquiry Msg :</u>  {selectedEnquiry.msg || selectedEnquiry.message}
                </p>

                <button
                  onClick={() => updateStatus("closed")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg mt-4"
                >
                  Mark as Solved
                </button>

              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Select an enquiry to view details
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}