import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Edit, Trash2, Plus, Package } from "lucide-react";
import axios from "axios";
import AddPackageModal from "../AddPackageModal";

export function Packages() {

  const [selectedPackage, setSelectedPackage] = useState(null)
  const [openModal, setOpenModal] = useState(false); // for add to packages
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const filteredPackages = packages.filter((pkg) => pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()));


  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get("http://localhost:3000/getPackages");
        setPackages(res.data);
      } catch (err) {
        console.error("Error Fetching Packages:", err);
        setError("Failed to fetch packages");
      }
      finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading packages...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }



  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this Package?")) return;

  try {
    await axios.delete(`http://localhost:3000/deletePackage/${id}`);

    // Update UI after backend success
    setPackages((prev) => prev.filter((pkg) => pkg._id !== id));

    alert("Package Deleted Successfully");
  } catch (error) {
    console.error("Delete Error:", error);
    alert("Failed to delete package");
  }
};


  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between" >
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
            <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            Packages
          </h1>
          <p className="text-black text-m mt-1"> Total {packages.length} Packages </p>

        </div>
        {/* Add Package Button */}


        <button onClick={() => setOpenModal(true)} className="flex items-center bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus className="w-4 h-4 mr-2" /> Add Package </button>


      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} >
        <div className="relative max-w-md"> <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          <input type="text" placeholder="Search Packages..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
        </div> </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} >
        <div className="bg-white rounded-xl border border-gray-200  overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left   text-black "> Package </th>
                  <th className="px-6 py-4 text-left  text-black "> Destination </th>
                  <th className="px-6 py-4 text-left  text-black "> Price </th>
                  <th className="px-6 py-4 text-left  text-black "> Duration </th>
                  {/* <th className="px-6 py-4 text-left text-m font-medium text-black uppercase"> Rating </th> */}
                  <th className="px-6 py-4 text-left  text-black "> Actions </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredPackages.map((pkg, index) => (
                  <motion.tr
                    key={pkg._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    whileHover={{ backgroundColor: "#f9fafb" }} >

                    {/* Package */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={`http://localhost:3000/Images/${pkg.image}`}
                          alt={pkg.name} className="w-12 h-12 rounded-lg object-cover" />
                        <span className="font-medium text-m text-black"> {pkg.name} </span>
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="px-6 py-4 font-medium text-black text-lg">
                      {pkg.destination} </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900"> ₹{pkg.price.toLocaleString()} </span>
                        <span className="text-m text-black line-through"> ₹{pkg.originalPrice.toLocaleString()} </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-6 py-4 font-medium text-black"> {pkg.days}D / {pkg.nights}N</td>

                    {/* Rating */}
                    {/* <td className="px-6 py-4 text-black"> ⭐ {pkg.rating} </td> */}

                    {/* Actions */}
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setOpenModal(true);
                            setIsEditMode(false)
                          }}
                          className="p-2 text-black hover:text-cyan-600" >
                          <Eye className="w-4 h-4" />
                        </motion.button>

                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => {
                          setSelectedPackage(pkg);
                          setIsEditMode(true);
                          setOpenModal(true);
                        }} className="p-2 text-black hover:text-cyan-600">
                          <Edit className="w-4 h-4" />
                        </motion.button>

                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(pkg._id)} className="p-2 text-black hover:text-red-600" >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>))}

              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
      <AddPackageModal
        open={openModal}
        onClose={() => { setOpenModal(false); setSelectedPackage(null); }}
        packageData={selectedPackage}
      />
      <AddPackageModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedPackage(null);
          setIsEditMode(false);
        }}
        packageData={selectedPackage}
        isEditMode={isEditMode}
      />
    </div>);

}